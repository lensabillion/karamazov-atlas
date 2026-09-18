---
type: is
id: is-01m1yyx6hkfprc3e2pta3pzy86
title: Give the project a real database
kind: epic
status: closed
priority: 1
version: 2
labels: []
dependencies: []
created_at: 2026-09-07T22:13:04.178Z
updated_at: 2026-09-18T15:29:40.179Z
closed_at: 2026-09-18T15:29:40.178Z
close_reason: "Delivered in api/: SQLite with FTS5 over chapter text, ordinal-based spoiler filter (before=), foreign keys, one-command ingest (python -m atlas.ingest), built into the Docker image with a 96-chapter assertion. The Next app consumes it for chat retrieval when ATLAS_API_URL is set; pages stay prerendered from committed JSON by design (no runtime DB needed for static pages). 12 pytest checks."
resolution: null
duplicate_of: null
---
Data lives in three JSON files and 96 text files, parsed on demand. This served the deterministic pipeline well but blocks everything queued next.

SQLite with an FTS5 virtual table over chapter text gives ranked full-text search, phrase and proximity queries, and a WHERE chapter_index <= :position filter that makes spoiler scoping one line instead of a bespoke pass. Foreign keys give the curated data referential integrity that a build-time check would otherwise have to fake.

Single file, versioned or rebuilt by one command, so deployment gets no harder. Pairs with the Python service (atlas-gc9d).
