"""SQLite storage with an FTS5 index over the chapter text.

Why a database at all, when the pipeline already produces clean JSON:

1. RETRIEVAL. The TypeScript `searchCorpus` read all 96 chapter files on every
   query. FTS5 gives ranked full-text search, phrase and proximity queries, and
   snippet extraction from an index instead of a linear scan.
2. SPOILER SCOPING. Restricting an answer to what a reader has already read is
   `WHERE c.ordinal <= :position` — one clause, rather than a bespoke pass.
3. REFERENTIAL INTEGRITY. The curated relationship and timeline data is hand
   written and currently unguarded; foreign keys make a dangling reference an
   error at write time instead of a silently missing line on a diagram.

One file on disk, rebuilt by one command, so nothing about deployment is harder.
"""

from __future__ import annotations

import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parents[3] / "data" / "atlas.db"

SCHEMA = """
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS meta (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS chapters (
    id          TEXT PRIMARY KEY,
    ordinal     INTEGER NOT NULL UNIQUE,   -- reading order; the spoiler axis
    part        TEXT    NOT NULL,
    part_num    INTEGER NOT NULL,
    book_num    INTEGER NOT NULL,
    book_title  TEXT    NOT NULL,
    num         INTEGER NOT NULL,
    roman       TEXT    NOT NULL,
    title       TEXT    NOT NULL,
    cite        TEXT    NOT NULL,
    start       INTEGER NOT NULL,          -- offset into the source text
    end         INTEGER NOT NULL,
    word_count  INTEGER NOT NULL,
    body        TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_chapters_book ON chapters(book_num, num);

-- External-content FTS: the index mirrors chapters.body without copying it.
CREATE VIRTUAL TABLE IF NOT EXISTS chapters_fts USING fts5(
    body,
    content='chapters',
    content_rowid='ordinal',
    tokenize='unicode61 remove_diacritics 2'
);

CREATE TABLE IF NOT EXISTS characters (
    id            TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    short         TEXT NOT NULL,
    grp           TEXT NOT NULL,
    patronymic    TEXT,
    given_name    TEXT,
    father_name   TEXT,
    total         INTEGER NOT NULL DEFAULT 0,
    chapter_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS name_forms (
    character_id  TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    form          TEXT NOT NULL,
    kind          TEXT NOT NULL,
    register      TEXT NOT NULL,
    gloss         TEXT NOT NULL,
    count         INTEGER NOT NULL,
    first_chapter TEXT REFERENCES chapters(id),
    PRIMARY KEY (character_id, form)
);

CREATE TABLE IF NOT EXISTS mentions (
    chapter_id   TEXT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    character_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    count        INTEGER NOT NULL,
    PRIMARY KEY (chapter_id, character_id)
);

CREATE INDEX IF NOT EXISTS idx_mentions_char ON mentions(character_id);

-- Per chapter, how many namings fell in each register.
CREATE TABLE IF NOT EXISTS register_counts (
    chapter_id   TEXT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    character_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    register     TEXT NOT NULL,
    count        INTEGER NOT NULL,
    PRIMARY KEY (chapter_id, character_id, register)
);

-- Who calls whom what, from attributed dialogue. Partial by construction.
CREATE TABLE IF NOT EXISTS addresses (
    speaker_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    target_id  TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    form       TEXT NOT NULL,
    register   TEXT NOT NULL,
    count      INTEGER NOT NULL,
    PRIMARY KEY (speaker_id, target_id, form)
);

CREATE TABLE IF NOT EXISTS cooccurrence (
    source_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    target_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    weight    INTEGER NOT NULL,
    PRIMARY KEY (source_id, target_id)
);

-- Curated: hand-authored knowledge about the novel. Foreign keys are the point,
-- because these are the tables a typo would otherwise corrupt silently.
CREATE TABLE IF NOT EXISTS people (
    id    TEXT PRIMARY KEY,
    name  TEXT NOT NULL,
    who   TEXT NOT NULL,
    grp   TEXT NOT NULL,
    x     REAL NOT NULL,
    y     REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS ties (
    from_id  TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    to_id    TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    bond     TEXT NOT NULL,
    label    TEXT NOT NULL,
    cite     TEXT,
    is_key   INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (from_id, to_id, bond)
);
"""


def connect(path: Path | None = None) -> sqlite3.Connection:
    conn = sqlite3.connect(path or DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def create_schema(conn: sqlite3.Connection) -> None:
    conn.executescript(SCHEMA)
    conn.commit()


def rebuild_fts(conn: sqlite3.Connection) -> None:
    """Repopulate the FTS index from chapters. Cheap at this scale."""
    conn.execute("INSERT INTO chapters_fts(chapters_fts) VALUES('rebuild')")
    conn.commit()
