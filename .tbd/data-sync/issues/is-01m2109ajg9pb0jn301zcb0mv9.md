---
type: is
id: is-01m2109ajg9pb0jn301zcb0mv9
title: Verify default Turbopack build with CSS worker port permissions
kind: task
status: closed
priority: 2
version: 2
labels:
  - build
dependencies: []
created_at: 2026-09-08T17:15:38.959Z
updated_at: 2026-09-18T13:57:53.725Z
closed_at: 2026-09-18T13:57:53.724Z
close_reason: "Verified 2026-09-18 on macOS, Node v24.15.0, Next 16.3.4: rm -rf .next && npm run build (default Turbopack) compiles, generates 133/133 static pages, no 'Operation not permitted'. The earlier failure was the Codex sandbox denying the CSS worker a port, not a toolchain defect. Default build unchanged."
resolution: null
duplicate_of: null
---
During atlas-tox3 verification at b207385 plus local Who UI changes, default npm run build fails while transforming CSS because a Turbopack worker cannot bind a port (Operation not permitted), including an escalated retry. npm run build -- --webpack passes with 132 pages and the dev UI works. Verify the default command in an environment with the required worker permissions; investigate cache/toolchain if it persists. Do not change the default or suppress the error without diagnosing it.
