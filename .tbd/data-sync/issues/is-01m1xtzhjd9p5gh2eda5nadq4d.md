---
type: is
id: is-01m1xtzhjd9p5gh2eda5nadq4d
title: "Evidence records: turn extraction output into a citable case file"
kind: feature
status: closed
priority: 2
version: 5
labels:
  - ai
dependencies:
  - type: blocks
    target: is-01m1xtzhqzfv2y5at0xcdqp7rr
  - type: blocks
    target: is-01m1xtzj8anawer9vhaycpeanq
parent_id: is-01m1xty0ybnq416hd8apek32xf
created_at: 2026-09-07T11:45:12.269Z
updated_at: 2026-09-18T15:43:56.307Z
closed_at: 2026-09-18T15:43:56.306Z
close_reason: "/case: 28 curated evidence records, each verbatim-quoted (test-verified per paragraph), linked to its paragraph, with kind, question, pointers and court outcome where the text shows it. Curated rather than extraction-derived because extraction covers 51/96 chapters (credit ran out) and readers judge on this; extraction quotes are separately verified. Commit 044b8fc."
resolution: null
duplicate_of: null
---
scripts/extract.ts already produces, per chapter, typed relations (from → verb → to) with a short evidence phrase, plus events with participants and consequences. That is already the shape of an evidence record; nothing reads it.

Build the layer that turns data/entities.json into facts a reader can inspect: what this chapter established, who it implicates, and the citation to check it against. Every record must trace to book and chapter — a claim the reader cannot verify is worthless here, since the whole point is that the court believed true evidence and reached a false conclusion.

Guard: the schema asks for a verbatim quotation, and that is the field most likely to drift. Validate every keyQuote actually appears in the chapter it came from and drop the ones that don't.
