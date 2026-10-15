"""Service behaviour: concurrency, real queries, parameter bounds, readiness.

The golden tests in test_api.py assert facts about the text through a
sequential TestClient — exactly the harness that could not see the deep
review's H3. anyio hands consecutive dispatches to the same idle worker thread,
so a sync dependency's setup, the endpoint and the teardown only land on
different threads when requests overlap. The first test here runs a real
uvicorn server in-process and overlaps them.
"""

import threading
import time
from collections.abc import Iterator
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import httpx
import pytest
import uvicorn
from fastapi.testclient import TestClient

import atlas.db
from atlas.main import app, fts_match

client = TestClient(app)


@pytest.fixture(scope="module")
def server() -> Iterator[str]:
    """A real uvicorn on an ephemeral port, so requests can genuinely overlap."""
    srv = uvicorn.Server(uvicorn.Config(app, host="127.0.0.1", port=0, log_level="error"))
    thread = threading.Thread(target=srv.run, daemon=True)
    thread.start()
    deadline = time.monotonic() + 10
    while not srv.started:
        if time.monotonic() > deadline:
            raise RuntimeError("uvicorn did not start")
        time.sleep(0.01)
    port = srv.servers[0].sockets[0].getsockname()[1]
    yield f"http://127.0.0.1:{port}"
    srv.should_exit = True
    thread.join(timeout=5)


def test_overlapping_requests_all_succeed(server: str) -> None:
    """H3: fifty requests released together. Before the fix, 49 of 50 were 500s."""
    n = 50
    gate = threading.Barrier(n)
    calls = [("/search", {"q": "Inquisitor", "limit": 3}), ("/health", None)]

    def one(i: int) -> int:
        path, params = calls[i % len(calls)]
        gate.wait()
        return httpx.get(server + path, params=params, timeout=30).status_code

    with ThreadPoolExecutor(max_workers=n) as pool:
        statuses = list(pool.map(one, range(n)))
    assert statuses.count(200) == n, statuses


@pytest.mark.parametrize("exists", [True, False], ids=["empty-file", "missing-file"])
def test_health_is_503_until_ingest_has_run(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch, exists: bool
) -> None:
    """M9: a wrong ATLAS_DB_PATH used to create an empty database and 500 on /health."""
    path = tmp_path / "atlas.db"
    if exists:
        path.touch()
    monkeypatch.setattr(atlas.db, "DB_PATH", path)
    r = client.get("/health")
    assert r.status_code == 503, r.text
    assert path.exists() == exists, "a read-only open must not create a database"
    if exists:
        assert path.stat().st_size == 0


@pytest.mark.parametrize(
    "q", ["Grushenka's letter", "who killed Fyodor?", "well-known", "AND", "Alyosha: the monk"]
)
def test_natural_language_queries_are_searched_not_parsed(q: str) -> None:
    """M2: each of these was a 400 from the live service."""
    r = client.get("/search", params={"q": q, "limit": 3})
    assert r.status_code == 200, r.text
    assert r.json(), f"no hits for {q!r}"


def test_a_query_with_no_words_finds_nothing() -> None:
    r = client.get("/search", params={"q": "??"})
    assert r.status_code == 200
    assert r.json() == []


def test_fts_match_quotes_every_term_and_doubles_embedded_quotes() -> None:
    assert fts_match('Grushenka\'s "letter"') == '"Grushenka\'s" OR """letter"""'
    assert fts_match("   ") == ""


def test_fts_match_ors_the_terms() -> None:
    """atlas-h7pn: a question is ranked by bm25 over any of its words, not filtered by all."""
    assert fts_match("who killed Fyodor?") == '"who" OR "killed" OR "Fyodor?"'
    assert fts_match("Inquisitor") == '"Inquisitor"'


def ids(q: str, **params: int) -> list[str]:
    r = client.get("/search", params={"q": q, "limit": 5, **params})
    assert r.status_code == 200, r.text
    return [h["chapter_id"] for h in r.json()]


@pytest.mark.parametrize(
    ("q", "chapter"),
    [
        ("Alyosha's dream of Cana of Galilee", "b07-c04"),
        ("Smerdyakov confesses the murder to Ivan", "b11-c08"),
        ("Dmitri strikes Grigory with the brass pestle", "b08-c04"),
        ("the parable of the onion that Grushenka tells", "b07-c03"),
    ],
)
def test_a_question_with_a_word_no_chapter_has_still_finds_its_chapter(
    q: str, chapter: str
) -> None:
    """atlas-h7pn: under implicit AND each of these was [], and the chat route took
    [] as the answer. The front end's local BM25 scan has each chapter in its top five."""
    assert chapter in ids(q)


def test_common_words_do_not_outrank_the_rare_ones() -> None:
    """A term in most chapters has an idf of effectively zero in FTS5's bm25, so the
    question words cannot bury the two that matter. Under AND this found two chapters."""
    q = "what does the Grand Inquisitor say about freedom"
    hits = ids(q)
    assert hits[0] == "b05-c05"
    assert len(hits) == 5
    # The spoiler scope is a WHERE clause outside the MATCH, so OR does not loosen it.
    assert "b05-c05" not in ids(q, before=35)


def test_or_fills_the_page_where_and_found_one_chapter() -> None:
    """Under AND this returned one chapter, and the system prompt tells the model to
    search again when a result is thin: a round trip the route's step cap now counts."""
    hits = ids("why did Father Zossima's body smell of corruption")
    assert hits[0] == "b07-c01"
    assert len(hits) == 5


@pytest.mark.parametrize(
    ("path", "params"),
    [
        ("/search", {"q": "onion", "limit": "99999999999999999999"}),
        ("/search", {"q": "onion", "limit": 0}),
        ("/search", {"q": "onion", "limit": 51}),
        ("/search", {"q": "onion", "before": 97}),
        ("/chapters", {"book": 14}),
    ],
)
def test_out_of_range_integers_are_422(path: str, params: dict[str, object]) -> None:
    """M9: the overflowing limit was a 500 from SQLite; the rest were silently empty."""
    assert client.get(path, params=params).status_code == 422


def test_before_is_inclusive_at_the_chapter_itself() -> None:
    """b05-c05 is ordinal 36: before=35 excludes it, before=36 includes it."""

    def ids(before: int) -> list[str]:
        r = client.get("/search", params={"q": "Inquisitor", "before": before, "limit": 10})
        return [h["chapter_id"] for h in r.json()]

    assert "b05-c05" not in ids(35)
    assert "b05-c05" in ids(36)
