---
type: is
id: is-01m21q83n2g5e3zgcvwme0rja9
title: Rate-limit /api/chat before enabling it publicly
kind: task
status: closed
priority: 1
version: 2
labels:
  - security
dependencies: []
created_at: 2026-09-08T23:56:56.354Z
updated_at: 2026-09-09T15:42:54.817Z
closed_at: 2026-09-09T15:42:54.816Z
close_reason: null
resolution: null
duplicate_of: null
---
With ANTHROPIC_API_KEY set, /api/chat is a public unauthenticated streaming LLM endpoint that anyone can call and bill to this account. It caps tool steps at 6 but has no per-caller limit and no output token cap.

Before the key goes anywhere public: per-IP rate limit and an explicit maxOutputTokens. Until then, deploy without the key — /ask degrades to a clear notice by design.
