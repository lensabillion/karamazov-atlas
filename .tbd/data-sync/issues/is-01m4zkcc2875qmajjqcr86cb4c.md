---
type: is
id: is-01m4zkcc2875qmajjqcr86cb4c
title: Request-level test suite for /api/chat
kind: task
status: in_progress
priority: 2
version: 2
labels: []
dependencies: []
parent_id: is-01m4zkcb01x03f4dxbb3ed8ehw
created_at: 2026-10-15T10:57:58.344Z
updated_at: 2026-10-15T10:58:15.632Z
---
L6. scripts/test-chat-route.ts, wired into npm test: 400 on a system-role message, 413 on size, 429 after the limit, the tool-output cap, the env fallback, citation validation. No live model call: fetch is stubbed to throw and asserted never called.
