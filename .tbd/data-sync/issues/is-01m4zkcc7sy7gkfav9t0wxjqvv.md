---
type: is
id: is-01m4zkcc7sy7gkfav9t0wxjqvv
title: Correct the README cost-controls table
kind: task
status: closed
priority: 3
version: 3
labels: []
dependencies: []
parent_id: is-01m4zkcb01x03f4dxbb3ed8ehw
created_at: 2026-10-15T10:57:58.520Z
updated_at: 2026-10-15T11:10:02.905Z
closed_at: 2026-10-15T11:10:02.905Z
close_reason: "README cost table now has a 'Per request' column: 8,000 output tokens, 24,000 input chars, 48,000 chars of retrieved text, 40 messages, rate limit as deterrent; says the body is schema-validated and that bad env values fall back; documents x-forwarded-for. Quick start says eight suites. PR https://github.com/lensabillion/karamazov-atlas/pull/21"
resolution: null
duplicate_of: null
---
H2. The table says the first three bounds cap the cost of any single request; they were per-step. Make it say what the code now guarantees per request.
