---
type: is
id: is-01m21q83tmhdj99bh2y5vmj20s
title: CI must fail if committed data drifts from the pipeline
kind: task
status: closed
priority: 1
version: 2
labels: []
dependencies: []
created_at: 2026-09-08T23:56:56.531Z
updated_at: 2026-09-09T15:55:36.689Z
closed_at: 2026-09-09T15:55:36.689Z
close_reason: null
resolution: null
duplicate_of: null
---
Add to CI: run npm run corpus, then git diff --exit-code data/. If the committed derived data does not match what the pipeline produces, fail.

This is the check that would have caught review finding R4 the day it appeared — npm run corpus had been silently rebuilding nothing for weeks because of a broken entry-point guard, and every downstream number was stale while all tests passed.

Part of atlas-83bt.
