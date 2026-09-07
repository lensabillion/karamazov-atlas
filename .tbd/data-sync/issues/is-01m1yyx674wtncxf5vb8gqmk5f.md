---
type: is
id: is-01m1yyx674wtncxf5vb8gqmk5f
title: Add CI
kind: chore
status: open
priority: 3
version: 2
labels:
  - review
dependencies: []
created_at: 2026-09-07T22:13:03.843Z
updated_at: 2026-09-07T23:32:11.725Z
---
npm run test and next build are run by hand. Nothing stops a broken build being pushed. Everything needed exists; it just is not wired to a workflow. Add typecheck, tests and build on push and PR.
