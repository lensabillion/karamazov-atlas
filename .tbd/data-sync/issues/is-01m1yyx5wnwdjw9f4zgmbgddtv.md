---
type: is
id: is-01m1yyx5wnwdjw9f4zgmbgddtv
title: Validate the curated data at build time
kind: task
status: open
priority: 2
version: 3
labels:
  - review
dependencies: []
created_at: 2026-09-07T22:13:03.508Z
updated_at: 2026-09-07T23:32:19.831Z
---
relationships.ts and timeline.ts are hand-written and unguarded. A tie pointing at a nonexistent person id, or a timeline moment naming someone with no lane, renders as a silently missing line rather than an error.

Both are currently clean — verified by hand during the 2026-09-08 review — which is exactly the problem: nothing enforces it.

Also fixes two sources of truth for chronology: SEGMENTS lives in timeline.ts while DURATION lives in Timeline.tsx, keyed by string. Adding a segment in one and not the other silently mis-scales the axis.

Moving this data into the database gets referential integrity for free.

## Notes

R5/R8/R9 in docs/reviews/2026-09-08-visual-memory-review.md extend this finding. At 5d9098d the separate DURATION map has been removed. The new database defines people/ties but does not ingest them, so foreign keys do not validate displayed curated relationships. Validate current SPANS and chapter/passage references, and fact-check scene claims separately from schema correctness.
