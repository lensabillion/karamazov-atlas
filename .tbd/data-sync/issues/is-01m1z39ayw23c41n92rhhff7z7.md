---
type: is
id: is-01m1z39ayw23c41n92rhhff7z7
title: "R3: Count each name occurrence once across derived datasets"
kind: bug
status: closed
priority: 1
version: 2
labels:
  - review
dependencies: []
parent_id: is-01m1yjvd5r5ad7x6xv7d4hpqwa
created_at: 2026-09-07T23:29:36.219Z
updated_at: 2026-09-07T23:57:04.553Z
closed_at: 2026-09-07T23:57:04.553Z
close_reason: null
resolution: null
duplicate_of: null
---
scripts/build-names.ts:243-287 independently counts overlapping aliases then sums them. Current names/mentions totals disagree: Dmitri 1434/1294, Ivan 765/714, Katerina 459/287; exclusive raw matches confirm the lower totals for these three. Use a shared longest-first span matcher for all derived data and assert totals and register sums agree. See R3 in docs/reviews/2026-09-08-visual-memory-review.md.
