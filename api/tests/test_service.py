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
    assert fts_match('Grushenka\'s "letter"') == '"Grushenka\'s" """letter"""'
    assert fts_match("   ") == ""


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
