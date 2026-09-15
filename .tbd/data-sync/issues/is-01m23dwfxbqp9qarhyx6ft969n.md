---
type: is
id: is-01m23dwfxbqp9qarhyx6ft969n
title: Test the API client and its fallback
kind: task
status: closed
priority: 2
version: 2
labels: []
dependencies: []
created_at: 2026-09-09T15:51:47.371Z
updated_at: 2026-09-09T15:55:36.849Z
closed_at: 2026-09-09T15:55:36.849Z
close_reason: null
resolution: null
duplicate_of: null
---
src/lib/atlas-api.ts has no test coverage. Its fallback — returning null so the chat route uses local search — is what keeps the site working when Render is down or ATLAS_API_URL is unset, and nothing verifies it.

Cover: unset ATLAS_API_URL returns null; a non-200 returns null; a timeout returns null; a good response is parsed; the before parameter is forwarded for spoiler scoping.
