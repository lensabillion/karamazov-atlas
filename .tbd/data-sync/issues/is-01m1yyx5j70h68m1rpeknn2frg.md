---
type: is
id: is-01m1yyx5j70h68m1rpeknn2frg
title: "Bug: memoised loaders serve stale data after a rebuild"
kind: bug
status: closed
priority: 2
version: 2
labels:
  - dx
dependencies: []
created_at: 2026-09-07T22:13:03.175Z
updated_at: 2026-09-09T15:55:35.895Z
closed_at: 2026-09-09T15:55:35.895Z
close_reason: null
resolution: null
duplicate_of: null
---
src/lib/corpus.ts and names.ts cache parsed JSON with ??=, so the dev server holds the first parse for the life of the process. Re-running a build script changes the file on disk and the running app keeps serving the old data.

This bit twice during development. Once it produced a screenshot showing already-corrected data as still wrong, which nearly sent me chasing a fix that was already in place. It does not affect production, but it makes verification lie, which is worse than a visible bug.

Fix: skip the cache when NODE_ENV is not production, or key it on file mtime.
