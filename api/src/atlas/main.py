"""Karamazov Atlas API.

Owns the corpus, the derived name data, and retrieval. The Next.js front end owns
rendering and — deliberately — the streaming chat route: the AI SDK's streaming
into `useChat` is tightly coupled to the Next runtime, and reimplementing SSE here
would buy nothing. That route's `searchNovel` tool calls `/search` below.

Python owns the data. Next owns the streaming.
"""

from __future__ import annotations

import os
import re
import sqlite3
from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from atlas import models
from atlas.db import connect

app = FastAPI(
    title="Karamazov Atlas API",
    version="0.1.0",
    summary="Corpus, name morphology and retrieval for The Brothers Karamazov",
)

# The API is read-only and carries no user data, but it is not free to call: it
# fronts the corpus for a deployed frontend on a different origin. Allow exactly
# the origins we deploy, not "*", so a stray site cannot use this as its own
# backend. ALLOWED_ORIGINS is a comma-separated list set per environment.
_origins = [
    o.strip()
    for o in os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
    if o.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


def get_db():
    conn = connect()
    try:
        yield conn
    finally:
        conn.close()


DB = Annotated[sqlite3.Connection, Depends(get_db)]


@app.get("/health")
def health(db: DB) -> dict:
    """Readiness, not just liveness.

    The container builds its own database at image-build time, so a process that
    is up but has an empty database is not ready to serve. Report the chapter
    count and fail the check if it is zero, so a bad build is caught by the
    platform rather than by a reader.
    """
    n = db.execute("SELECT count(*) FROM chapters").fetchone()[0]
    if n == 0:
        raise HTTPException(503, "database is empty — ingest did not run")
    return {"ok": True, "chapters": n, "version": app.version}


@app.get("/corpus", response_model=models.CorpusMeta)
def corpus(db: DB) -> models.CorpusMeta:
    meta = {r["key"]: r["value"] for r in db.execute("SELECT key, value FROM meta")}
    row = db.execute(
        "SELECT count(*) AS chapters, count(DISTINCT book_num) AS books FROM chapters"
    ).fetchone()
    return models.CorpusMeta(
        title=meta.get("title", ""),
        author=meta.get("author", ""),
        translator=meta.get("translator", ""),
        source=meta.get("source", ""),
        word_count=int(meta.get("word_count", 0)),
        chapter_count=row["chapters"],
        book_count=row["books"],
    )


def _chapter(row: sqlite3.Row) -> models.Chapter:
    return models.Chapter(
        id=row["id"], part=row["part"], part_num=row["part_num"],
        book_num=row["book_num"], book_title=row["book_title"], num=row["num"],
        roman=row["roman"], title=row["title"], cite=row["cite"],
        start=row["start"], end=row["end"], word_count=row["word_count"],
    )


@app.get("/chapters", response_model=list[models.Chapter])
def chapters(db: DB, book: int | None = None) -> list[models.Chapter]:
    sql = "SELECT * FROM chapters"
    args: tuple = ()
    if book is not None:
        sql += " WHERE book_num = ?"
        args = (book,)
    sql += " ORDER BY ordinal"
    return [_chapter(r) for r in db.execute(sql, args)]


@app.get("/chapters/{chapter_id}", response_model=models.Chapter)
def chapter(chapter_id: str, db: DB) -> models.Chapter:
    row = db.execute("SELECT * FROM chapters WHERE id = ?", (chapter_id,)).fetchone()
    if row is None:
        raise HTTPException(404, f"No chapter {chapter_id}")
    return _chapter(row)


@app.get("/chapters/{chapter_id}/text")
def chapter_text(chapter_id: str, db: DB) -> dict:
    row = db.execute(
        "SELECT cite, title, body FROM chapters WHERE id = ?", (chapter_id,)
    ).fetchone()
    if row is None:
        raise HTTPException(404, f"No chapter {chapter_id}")
    return {"id": chapter_id, "cite": row["cite"], "title": row["title"], "text": row["body"]}


@app.get("/characters", response_model=list[models.Character])
def characters(db: DB) -> list[models.Character]:
    rows = db.execute("SELECT * FROM characters ORDER BY total DESC")
    out = []
    for r in rows:
        aliases = [
            f["form"]
            for f in db.execute(
                "SELECT form FROM name_forms WHERE character_id = ? ORDER BY count DESC",
                (r["id"],),
            )
        ]
        out.append(
            models.Character(
                id=r["id"], name=r["name"], short=r["short"], group=r["grp"],
                aliases=aliases, total=r["total"], chapter_count=r["chapter_count"],
            )
        )
    return out


@app.get("/names/lineages", response_model=list[models.Lineage])
def lineages(db: DB) -> list[models.Lineage]:
    """Characters grouped by patronymic — the family recovered from grammar."""
    rows = db.execute(
        """SELECT patronymic, father_name, group_concat(id) AS kids
           FROM characters
           WHERE patronymic IS NOT NULL
           GROUP BY patronymic
           HAVING count(*) > 1"""
    )
    return [
        models.Lineage(
            patronymic=r["patronymic"], father=r["father_name"], children=r["kids"].split(",")
        )
        for r in rows
    ]


@app.get("/names/coverage", response_model=models.Coverage)
def coverage(db: DB) -> models.Coverage:
    """Attribution is partial by construction; this is how a caller finds out.

    Derived from the stored text rather than hardcoded (review finding R9): a
    fixed numerator and denominator meant the test could never notice extraction
    coverage changing, which is precisely what such a test is for.
    """
    quotes = 0
    for (body,) in db.execute("SELECT body FROM chapters"):
        quotes += len(re.findall(r"[\u201c\"][^\u201d\"]{8,900}[\u201d\"]", body))
    attributed = db.execute("SELECT COALESCE(SUM(count), 0) FROM addresses").fetchone()[0]
    return models.Coverage(
        quotes=quotes,
        attributed=attributed,
        ratio=(attributed / quotes) if quotes else 0.0,
    )


@app.get("/addresses", response_model=list[models.Address])
def addresses(db: DB, speaker: str | None = None, target: str | None = None):
    sql = "SELECT * FROM addresses WHERE 1=1"
    args: list = []
    if speaker:
        sql += " AND speaker_id = ?"
        args.append(speaker)
    if target:
        sql += " AND target_id = ?"
        args.append(target)
    sql += " ORDER BY count DESC"
    return [
        models.Address(
            speaker=r["speaker_id"], target=r["target_id"], form=r["form"],
            register=r["register"], count=r["count"],
        )
        for r in db.execute(sql, args)
    ]


@app.get("/search", response_model=list[models.SearchHit])
def search(
    db: DB,
    q: Annotated[str, Query(min_length=2)],
    limit: int = 6,
    before: Annotated[
        int | None,
        Query(description="Spoiler scope: only chapters at or before this reading position."),
    ] = None,
) -> list[models.SearchHit]:
    """Ranked full-text search.

    `before` is the spoiler axis: chapters carry an ordinal in reading order, so
    scoping an answer to what the reader has already read is one clause rather
    than a bespoke pass over the text.
    """
    sql = """
        SELECT c.id, c.cite, c.title,
               bm25(chapters_fts) AS score,
               snippet(chapters_fts, 0, '', '', '…', 32) AS excerpt
        FROM chapters_fts
        JOIN chapters c ON c.ordinal = chapters_fts.rowid
        WHERE chapters_fts MATCH ?
    """
    args: list = [q]
    if before is not None:
        sql += " AND c.ordinal <= ?"
        args.append(before)
    sql += " ORDER BY score LIMIT ?"
    args.append(limit)
    try:
        rows = db.execute(sql, args).fetchall()
    except sqlite3.OperationalError as e:
        raise HTTPException(400, f"Bad query: {e}") from e
    return [
        models.SearchHit(
            chapter_id=r["id"], cite=r["cite"], title=r["title"],
            score=-r["score"], excerpt=r["excerpt"],
        )
        for r in rows
    ]
