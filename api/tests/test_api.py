"""Golden tests, ported from scripts/test-corpus.ts.

These assert facts about the actual Gutenberg text, so a regression in the
pipeline or the ingest fails loudly. They are the safety net that has to pass
before any pipeline code is rewritten in Python (design-document.md §6.7 step 2).
"""

from fastapi.testclient import TestClient

from atlas.main import app

client = TestClient(app)


def test_health():
    assert client.get("/health").json()["chapters"] == 96


def test_corpus_shape():
    c = client.get("/corpus").json()
    assert c["chapter_count"] == 96
    assert c["book_count"] == 13
    assert 340_000 < c["word_count"] < 360_000
    assert c["translator"] == "Constance Garnett"


def test_book_five_has_seven_chapters():
    assert len(client.get("/chapters", params={"book": 5}).json()) == 7


def test_grand_inquisitor_location():
    ch = client.get("/chapters/b05-c05").json()
    assert ch["title"] == "The Grand Inquisitor"
    assert ch["cite"] == "Bk V, ch. 5"


def test_every_chapter_has_text():
    for ch in client.get("/chapters").json():
        body = client.get(f"/chapters/{ch['id']}/text").json()["text"]
        assert body.strip(), f"empty body for {ch['id']}"


def test_missing_chapter_is_404():
    assert client.get("/chapters/nope").status_code == 404


def test_alias_resolution_beats_naive_grep():
    chars = {c["id"]: c for c in client.get("/characters").json()}
    assert chars["dmitri"]["total"] > 1200, "alias resolution regressed"
    assert chars["alyosha"]["total"] > chars["ivan"]["total"]


def test_patronymic_recovers_the_family():
    lineages = client.get("/names/lineages").json()
    fyodorovitch = next(l for l in lineages if l["patronymic"] == "Fyodorovitch")
    assert fyodorovitch["father"] == "Fyodor"
    assert set(fyodorovitch["children"]) == {"dmitri", "ivan", "alyosha", "smerdyakov"}


def test_search_finds_the_inquisitor():
    hits = client.get("/search", params={"q": "Inquisitor", "limit": 3}).json()
    assert hits, "no hits"
    assert any(h["chapter_id"] == "b05-c05" for h in hits)


def test_spoiler_scope_excludes_later_chapters():
    """Book V chapter 5 is ordinal 31; scoping to 20 must exclude it."""
    early = client.get("/search", params={"q": "Inquisitor", "before": 20}).json()
    assert all(h["chapter_id"] != "b05-c05" for h in early)


def test_attribution_coverage_is_reported_not_hidden():
    cov = client.get("/names/coverage").json()
    assert 0 < cov["ratio"] < 0.25, "coverage should be stated honestly"
