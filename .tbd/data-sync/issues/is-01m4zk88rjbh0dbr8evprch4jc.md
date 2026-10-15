---
type: is
id: is-01m4zk88rjbh0dbr8evprch4jc
title: "Tests: concurrent uvicorn run, punctuation queries, overflow, before boundary, health 503"
kind: task
status: open
priority: 2
version: 1
labels:
  - python
  - api
  - testing
dependencies: []
parent_id: is-01m4zk87vy04qq5g5brccw38mb
created_at: 2026-10-15T10:55:43.890Z
updated_at: 2026-10-15T10:55:43.890Z
---
The sequential TestClient cannot reproduce H3 because anyio reuses one idle worker thread between dispatches. Add tests that start a real uvicorn server in-process on an ephemeral port and fire 50 overlapping requests at /search and /health from a thread pool, asserting every status is 200. Also: apostrophe and question-mark queries return 200, an overflowing limit is 422, before=35 excludes b05-c05 and before=36 includes it, and a missing table or file gives 503 from /health.
