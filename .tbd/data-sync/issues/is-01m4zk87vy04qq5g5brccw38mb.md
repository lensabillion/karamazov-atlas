---
type: is
id: is-01m4zk87vy04qq5g5brccw38mb
title: Make the API serve concurrent, natural-language search (deep review H3, M2, M9, L7)
kind: epic
status: closed
priority: 1
version: 7
labels:
  - python
  - api
dependencies: []
child_order_hints:
  - is-01m4zk881kjt3q4883zvyz1sm0
  - is-01m4zk887ah36xfm4adkx3htjx
  - is-01m4zk88d3qhqz7qwnht2kxztx
  - is-01m4zk88jvrhxqnz95zv2dcb4s
  - is-01m4zk88rjbh0dbr8evprch4jc
created_at: 2026-10-15T10:55:42.973Z
updated_at: 2026-10-15T11:02:59.906Z
closed_at: 2026-10-15T11:02:59.905Z
close_reason: "All four findings fixed and measured; see child beads. 120 overlapping requests: 112x500 -> 120x200. All punctuated queries 400 -> 200. Overflow 500 -> 422. Ingest rebuilds. Not tested: Docker image build, live Render service (untouched, M1 separate), and the AND-vs-OR retrieval question (atlas-h7pn). https://github.com/lensabillion/karamazov-atlas/pull/20"
resolution: null
duplicate_of: null
---
The FastAPI service in api/ is paid for and bypassed: the Next.js chat route calls /search when ATLAS_API_URL is set and falls back to the local BM25 scan on any non-2xx, so every failure below is invisible to readers. Spec: docs/reviews/2026-10-15-deep-review.md findings H3 (SQLite connection crosses threadpool threads under overlapping requests: 114 of 120 concurrent requests returned 500), M2 (the raw query is the FTS5 MATCH expression, so apostrophes, hyphens and question marks are 400s on the live service), M9 (unbounded limit/before/book give 500 on overflow; the read-write open turns a mispathed ATLAS_DB_PATH into an empty database and a 500 on /health) and L7 (ingest is an upsert, not a rebuild). Done means a PR against main with measured before/after numbers from a real concurrent run, and all four child beads closed with measurements in their notes. Out of scope: render.yaml, the deployed service, the plan/dashboard mismatch (M1).
