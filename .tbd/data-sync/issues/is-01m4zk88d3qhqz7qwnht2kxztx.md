---
type: is
id: is-01m4zk88d3qhqz7qwnht2kxztx
title: "M9: bound limit, before and book with Annotated Query constraints"
kind: bug
status: closed
priority: 2
version: 2
labels:
  - python
  - api
dependencies: []
parent_id: is-01m4zk87vy04qq5g5brccw38mb
created_at: 2026-10-15T10:55:43.522Z
updated_at: 2026-10-15T11:02:59.414Z
closed_at: 2026-10-15T11:02:59.414Z
close_reason: "limit Query(ge=1, le=50), before Query(ge=0, le=96), book Query(ge=1, le=13). limit=99999999999999999999: 500 (OverflowError) -> 422; limit=0: 200 [] -> 422; limit=51 -> 422; before=97 -> 422; /chapters?book=14: 200 [] -> 422. before boundary unchanged and now pinned: before=35 -> [b05-c04], before=36 -> [b05-c05, b05-c04]. https://github.com/lensabillion/karamazov-atlas/pull/20"
resolution: null
duplicate_of: null
---
limit and before on /search and book on /chapters are unbounded ints; SQLite raises OverflowError on a huge integer, uncaught, so /search?q=onion&limit=99999999999999999999 is a 500 (verified live). Bound them: limit ge=1 le=50, before ge=0 le=96, book ge=1 le=13, so an overflow is a 422 from validation. Test the overflow and the before boundary (35 excludes b05-c05, 36 includes it).
