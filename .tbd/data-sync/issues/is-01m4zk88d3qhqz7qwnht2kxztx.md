---
type: is
id: is-01m4zk88d3qhqz7qwnht2kxztx
title: "M9: bound limit, before and book with Annotated Query constraints"
kind: bug
status: open
priority: 2
version: 1
labels:
  - python
  - api
dependencies: []
parent_id: is-01m4zk87vy04qq5g5brccw38mb
created_at: 2026-10-15T10:55:43.522Z
updated_at: 2026-10-15T10:55:43.522Z
---
limit and before on /search and book on /chapters are unbounded ints; SQLite raises OverflowError on a huge integer, uncaught, so /search?q=onion&limit=99999999999999999999 is a 500 (verified live). Bound them: limit ge=1 le=50, before ge=0 le=96, book ge=1 le=13, so an overflow is a 422 from validation. Test the overflow and the before boundary (35 excludes b05-c05, 36 includes it).
