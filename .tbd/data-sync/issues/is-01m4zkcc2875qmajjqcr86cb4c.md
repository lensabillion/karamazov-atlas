---
type: is
id: is-01m4zkcc2875qmajjqcr86cb4c
title: Request-level test suite for /api/chat
kind: task
status: closed
priority: 2
version: 3
labels: []
dependencies: []
parent_id: is-01m4zkcb01x03f4dxbb3ed8ehw
created_at: 2026-10-15T10:57:58.344Z
updated_at: 2026-10-15T11:10:02.733Z
closed_at: 2026-10-15T11:10:02.733Z
close_reason: "scripts/test-chat-route.ts, eighth suite in npm test under --conditions=react-server: 75 checks in nine groups (body 6, schema 9, size 3, limiter 7, env 11, what reaches the model 9, tool budget 21, citations 8, no model call 1). fetch replaced with a function that throws and asserted called 0 times; the key is a placeholder. Whole npm test: 8 suites in 1.85 s. PR https://github.com/lensabillion/karamazov-atlas/pull/21"
resolution: null
duplicate_of: null
---
L6. scripts/test-chat-route.ts, wired into npm test: 400 on a system-role message, 413 on size, 429 after the limit, the tool-output cap, the env fallback, citation validation. No live model call: fetch is stubbed to throw and asserted never called.
