---
type: is
id: is-01m2109ajg9pb0jn301zcb0mv9
title: Verify default Turbopack build with CSS worker port permissions
kind: task
status: open
priority: 2
version: 1
labels:
  - build
dependencies: []
created_at: 2026-09-08T17:15:38.959Z
updated_at: 2026-09-08T17:15:38.959Z
---
During atlas-tox3 verification at b207385 plus local Who UI changes, default npm run build fails while transforming CSS because a Turbopack worker cannot bind a port (Operation not permitted), including an escalated retry. npm run build -- --webpack passes with 132 pages and the dev UI works. Verify the default command in an environment with the required worker permissions; investigate cache/toolchain if it persists. Do not change the default or suppress the error without diagnosing it.
