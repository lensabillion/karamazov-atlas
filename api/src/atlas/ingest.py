"""Load the existing JSON pipeline output into SQLite.

Migration step one of docs/design-document.md §6.7: stand the database up against
data the TypeScript pipeline already produces, so the storage layer and the API
contract can be proven before any pipeline code is rewritten in Python. Nothing
about the app's behaviour changes at this step, which is the point — it is
reversible.

    python -m atlas.ingest
"""

from __future__ import annotations

import json
import sqlite3
from pathlib import Path

from atlas.db import connect, create_schema, rebuild_fts

ROOT = Path(__file__).resolve().parents[3]
DATA = ROOT / "data"


def _load(name: str) -> dict:
    return json.loads((DATA / name).read_text(encoding="utf-8"))


def ingest(conn: sqlite3.Connection) -> dict[str, int]:
    create_schema(conn)
    counts: dict[str, int] = {}

    corpus = _load("corpus.json")
    mentions = _load("mentions.json")
    names = _load("names.json")

    for key in ("title", "author", "translator", "source"):
        conn.execute(
            "INSERT OR REPLACE INTO meta(key, value) VALUES (?, ?)", (key, corpus[key])
        )
    conn.execute(
        "INSERT OR REPLACE INTO meta(key, value) VALUES ('word_count', ?)",
        (str(corpus["wordCount"]),),
    )

    # Chapters carry an ordinal: reading order, and therefore the spoiler axis.
    rows = []
    for ordinal, ch in enumerate(corpus["chapters"], start=1):
        body = (DATA / "chapters" / f"{ch['id']}.txt").read_text(encoding="utf-8")
        rows.append(
            (
                ch["id"], ordinal, ch["part"], ch["partNum"], ch["bookNum"],
                ch["bookTitle"], ch["num"], ch["roman"], ch["title"], ch["cite"],
                ch["start"], ch["end"], ch["wordCount"], body,
            )
        )
    conn.executemany(
        """INSERT OR REPLACE INTO chapters
           (id, ordinal, part, part_num, book_num, book_title, num, roman, title,
            cite, start, end, word_count, body)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
        rows,
    )
    counts["chapters"] = len(rows)

    named = {c["id"]: c for c in names["characters"]}
    chars = []
    for c in mentions["characters"]:
        n = named.get(c["id"], {})
        chars.append(
            (
                c["id"], c["name"], c["short"], c["group"],
                n.get("patronymic"), n.get("givenName"), n.get("fatherName"),
                c["total"], c["chapterCount"],
            )
        )
    conn.executemany(
        """INSERT OR REPLACE INTO characters
           (id, name, short, grp, patronymic, given_name, father_name, total, chapter_count)
           VALUES (?,?,?,?,?,?,?,?,?)""",
        chars,
    )
    counts["characters"] = len(chars)

    forms = [
        (c["id"], f["form"], f["kind"], f["register"], f["gloss"], f["count"], f["firstChapter"])
        for c in names["characters"]
        for f in c["forms"]
    ]
    conn.executemany(
        """INSERT OR REPLACE INTO name_forms
           (character_id, form, kind, register, gloss, count, first_chapter)
           VALUES (?,?,?,?,?,?,?)""",
        forms,
    )
    counts["name_forms"] = len(forms)

    ment = [
        (chapter_id, char_id, n)
        for chapter_id, per in mentions["byChapter"].items()
        for char_id, n in per.items()
    ]
    conn.executemany(
        "INSERT OR REPLACE INTO mentions(chapter_id, character_id, count) VALUES (?,?,?)",
        ment,
    )
    counts["mentions"] = len(ment)

    regs = [
        (chapter_id, c["id"], register, n)
        for c in names["characters"]
        for chapter_id, per in c.get("registerByChapter", {}).items()
        for register, n in per.items()
    ]
    conn.executemany(
        """INSERT OR REPLACE INTO register_counts
           (chapter_id, character_id, register, count) VALUES (?,?,?,?)""",
        regs,
    )
    counts["register_counts"] = len(regs)

    addrs = [
        (a["speaker"], a["target"], a["form"], a["register"], a["count"])
        for a in names.get("addresses", [])
    ]
    conn.executemany(
        """INSERT OR REPLACE INTO addresses
           (speaker_id, target_id, form, register, count) VALUES (?,?,?,?,?)""",
        addrs,
    )
    counts["addresses"] = len(addrs)

    edges = [(e["source"], e["target"], e["weight"]) for e in mentions["edges"]]
    conn.executemany(
        "INSERT OR REPLACE INTO cooccurrence(source_id, target_id, weight) VALUES (?,?,?)",
        edges,
    )
    counts["cooccurrence"] = len(edges)

    conn.commit()
    rebuild_fts(conn)
    return counts


def main() -> None:
    DATA.mkdir(exist_ok=True)
    conn = connect()
    counts = ingest(conn)
    width = max(len(k) for k in counts)
    for k, v in counts.items():
        print(f"  {k.ljust(width)}  {v:>6,}")
    total = conn.execute("SELECT count(*) FROM chapters_fts").fetchone()[0]
    print(f"  {'fts rows'.ljust(width)}  {total:>6,}")
    conn.close()


if __name__ == "__main__":
    main()
