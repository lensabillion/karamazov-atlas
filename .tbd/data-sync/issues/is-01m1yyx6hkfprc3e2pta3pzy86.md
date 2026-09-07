---
type: is
id: is-01m1yyx6hkfprc3e2pta3pzy86
title: Give the project a real database
kind: epic
status: open
priority: 1
version: 1
labels: []
dependencies: []
created_at: 2026-09-07T22:13:04.178Z
updated_at: 2026-09-07T22:13:04.178Z
---
Data lives in three JSON files and 96 text files, parsed on demand. This served the deterministic pipeline well but blocks everything queued next.

SQLite with an FTS5 virtual table over chapter text gives ranked full-text search, phrase and proximity queries, and a WHERE chapter_index <= :position filter that makes spoiler scoping one line instead of a bespoke pass. Foreign keys give the curated data referential integrity that a build-time check would otherwise have to fake.

Single file, versioned or rebuilt by one command, so deployment gets no harder. Pairs with the Python service (atlas-gc9d).
