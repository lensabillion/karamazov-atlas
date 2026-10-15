---
type: is
id: is-01m4zkcbgne8dn5zw9kes9p0yr
title: Validate CHAT_RATE_LIMIT and CHAT_RATE_WINDOW_MS; fall back on a non-numeric value
kind: bug
status: in_progress
priority: 2
version: 2
labels: []
dependencies: []
parent_id: is-01m4zkcb01x03f4dxbb3ed8ehw
created_at: 2026-10-15T10:57:57.781Z
updated_at: 2026-10-15T10:58:15.148Z
---
M3. Number('abc') is NaN, hits.length >= NaN is always false, and the limiter silently allows everything while emitting RateLimit-Remaining: NaN. A positive-integer parser falls back to the default and warns once.
