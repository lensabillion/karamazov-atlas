---
type: is
id: is-01m4zk88jvrhxqnz95zv2dcb4s
title: "L7: ingest rebuilds into a fresh database instead of upserting"
kind: task
status: closed
priority: 3
version: 2
labels:
  - python
  - api
dependencies: []
parent_id: is-01m4zk87vy04qq5g5brccw38mb
created_at: 2026-10-15T10:55:43.707Z
updated_at: 2026-10-15T11:02:59.579Z
closed_at: 2026-10-15T11:02:59.579Z
close_reason: "ingest.main builds atlas.db.building with connect_for_write, refuses to replace if chapters == 0 or fts rows != chapters, then os.replace over DB_PATH. Verified: inserted stale row b99-c99, re-ran ingest: inode 23800168 -> 23800380, stale rows 1 -> 0, chapters 96, no .building left. people/ties and the unused models stay with atlas-ljh6. https://github.com/lensabillion/karamazov-atlas/pull/20"
resolution: null
duplicate_of: null
---
db.py uses CREATE TABLE IF NOT EXISTS and ingest.py INSERT OR REPLACE, so re-running over an existing database keeps rows whose ids left the JSON, and ingest never asserts the chapter count itself. With the service now opening the file immutable (H3), a rebuild that writes to a temporary file and renames it over the old one is also what keeps a running reader on a consistent inode. Ingest gets its own writable open; the serving connection stays read-only. The dead people/ties tables and the unused NameForm/NamedCharacter models stay out of scope (atlas-ljh6 branch owns the models).
