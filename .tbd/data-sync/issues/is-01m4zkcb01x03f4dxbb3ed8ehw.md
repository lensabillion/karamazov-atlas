---
type: is
id: is-01m4zkcb01x03f4dxbb3ed8ehw
title: Harden the public chat endpoint (deep review H1, H2, M3, M7, L1)
kind: epic
status: in_progress
priority: 1
version: 9
labels:
  - security
dependencies: []
child_order_hints:
  - is-01m4zkcb5np0sdh1k87zgpn3s1
  - is-01m4zkcbb5n8x0rfneepyhfsvk
  - is-01m4zkcbgne8dn5zw9kes9p0yr
  - is-01m4zkcbq1zrvbcwsnzp6ms4j2
  - is-01m4zkcbwp5q1zgdxeesns2x4r
  - is-01m4zkcc2875qmajjqcr86cb4c
  - is-01m4zkcc7sy7gkfav9t0wxjqvv
created_at: 2026-10-15T10:57:57.249Z
updated_at: 2026-10-15T10:58:07.673Z
---
With ANTHROPIC_API_KEY set on Vercel, /api/chat is a public, unauthenticated LLM route. The deep review of 15 October 2026 (docs/reviews/2026-10-15-deep-review.md) found that it trusts its request body (H1: a caller can append a system message or forge tool results, and malformed parts become a 500), that its cost bounds are per step rather than per request (H2: 2,000 output tokens x 6 steps, 24,000 chars of chapter text per readChapter call with no total), that a non-numeric CHAT_RATE_LIMIT silently disables the limiter (M3), that the Ask page states the wrong scope on first paint for a reader with a place set (M7), and that a citation like Bk I, ch. 9 links to a 404 (L1). One PR: schema-validate the body, bound tool output per request, validate the env, gate the scope sentence in CSS, validate citations against the real chapter list, add a request-level test suite for the route, and correct the README cost table.
