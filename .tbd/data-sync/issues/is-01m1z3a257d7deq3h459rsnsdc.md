---
type: is
id: is-01m1z3a257d7deq3h459rsnsdc
title: "R10: Reconcile architecture claims and documentation with the rereader goal"
kind: task
status: closed
priority: 2
version: 3
labels:
  - review
dependencies: []
parent_id: is-01m1yjvd5r5ad7x6xv7d4hpqwa
created_at: 2026-09-07T23:29:59.974Z
updated_at: 2026-09-18T15:28:40.414Z
closed_at: 2026-09-18T15:28:40.413Z
close_reason: "README rewritten to the current routes (8), tests (6 suites), design (first edition), alias figures (911 vs 1,294) and an accurate implemented-vs-proposed note (chat route uses the API when ATLAS_API_URL is set; pages never do). Sept 8 review: status box with real bead states; B4 marked resolved. R10 corrections in D1/D2 were already present. Python prototype kept."
resolution: null
duplicate_of: null
---
docs/review-2026-09-08.md:116-128 claims JSON cannot support query-time filtering and that TypeScript is the wrong language without a measured need. Existing TS search already filters/ranks; Python API imports its JSON and is not used by the Next chat route. README lists deleted routes; prior review has stale DURATION and placeholder-looking bead IDs. Document implemented versus proposed architecture, real bead IDs and current routes; benchmark any migration before prioritizing it over verified illustrated scenes. Do not remove the Python prototype merely for this finding. See R10 in docs/reviews/2026-09-08-visual-memory-review.md.
