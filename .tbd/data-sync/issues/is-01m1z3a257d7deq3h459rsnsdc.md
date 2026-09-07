---
type: is
id: is-01m1z3a257d7deq3h459rsnsdc
title: "R10: Reconcile architecture claims and documentation with the rereader goal"
kind: task
status: open
priority: 2
version: 1
labels:
  - review
dependencies: []
parent_id: is-01m1yjvd5r5ad7x6xv7d4hpqwa
created_at: 2026-09-07T23:29:59.974Z
updated_at: 2026-09-07T23:29:59.974Z
---
docs/review-2026-09-08.md:116-128 claims JSON cannot support query-time filtering and that TypeScript is the wrong language without a measured need. Existing TS search already filters/ranks; Python API imports its JSON and is not used by the Next chat route. README lists deleted routes; prior review has stale DURATION and placeholder-looking bead IDs. Document implemented versus proposed architecture, real bead IDs and current routes; benchmark any migration before prioritizing it over verified illustrated scenes. Do not remove the Python prototype merely for this finding. See R10 in docs/reviews/2026-09-08-visual-memory-review.md.
