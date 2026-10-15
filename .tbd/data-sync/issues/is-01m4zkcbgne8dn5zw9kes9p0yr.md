---
type: is
id: is-01m4zkcbgne8dn5zw9kes9p0yr
title: Validate CHAT_RATE_LIMIT and CHAT_RATE_WINDOW_MS; fall back on a non-numeric value
kind: bug
status: closed
priority: 2
version: 3
labels: []
dependencies: []
parent_id: is-01m4zkcb01x03f4dxbb3ed8ehw
created_at: 2026-10-15T10:57:57.781Z
updated_at: 2026-10-15T11:10:02.242Z
closed_at: 2026-10-15T11:10:02.242Z
close_reason: "envInt(name, fallback) in src/lib/rate-limit.ts: positive integer or the fallback with one console.warn. Measured: unset/blank/abc/0/-5/2.5 -> 10, 25 -> 25, four warnings for four bad values; a route imported under CHAT_RATE_LIMIT=ten returns 400 x10 then 429, with RateLimit-Limit: 10 and Remaining: 0 (was NaN and never 429). README config table says the rule. PR https://github.com/lensabillion/karamazov-atlas/pull/21"
resolution: null
duplicate_of: null
---
M3. Number('abc') is NaN, hits.length >= NaN is always false, and the limiter silently allows everything while emitting RateLimit-Remaining: NaN. A positive-integer parser falls back to the default and warns once.
