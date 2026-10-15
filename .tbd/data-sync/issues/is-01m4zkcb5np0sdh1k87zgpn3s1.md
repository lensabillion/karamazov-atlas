---
type: is
id: is-01m4zkcb5np0sdh1k87zgpn3s1
title: Validate /api/chat messages with a Zod schema; 400 instead of a converter 500
kind: task
status: in_progress
priority: 1
version: 2
labels:
  - security
dependencies: []
parent_id: is-01m4zkcb01x03f4dxbb3ed8ehw
created_at: 2026-10-15T10:57:57.429Z
updated_at: 2026-10-15T10:58:14.826Z
---
H1. Roles user and assistant only, text parts only, client-supplied tool parts dropped, the last message from the user. A schema failure returns 400 with RateLimit headers instead of letting convertToModelMessages throw a 500.
