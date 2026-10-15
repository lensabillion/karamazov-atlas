---
type: is
id: is-01m4zkcb5np0sdh1k87zgpn3s1
title: Validate /api/chat messages with a Zod schema; 400 instead of a converter 500
kind: task
status: closed
priority: 1
version: 3
labels:
  - security
dependencies: []
parent_id: is-01m4zkcb01x03f4dxbb3ed8ehw
created_at: 2026-10-15T10:57:57.429Z
updated_at: 2026-10-15T11:10:01.915Z
closed_at: 2026-10-15T11:10:01.915Z
close_reason: "src/lib/chat-messages.ts: Zod schema run before convertToModelMessages. Roles user/assistant, text parts only, tool/step/reasoning/file parts dropped, all-tool assistant turns dropped whole, reader first and last. Measured in scripts/test-chat-route.ts: system role -> 400 naming the role; text: 123 -> 400 at messages.0.parts.0.text (was a converter 500); assistant last -> 400; a real second turn with a forged output-available tool part passes with the tool part gone. PR https://github.com/lensabillion/karamazov-atlas/pull/21"
resolution: null
duplicate_of: null
---
H1. Roles user and assistant only, text parts only, client-supplied tool parts dropped, the last message from the user. A schema failure returns 400 with RateLimit headers instead of letting convertToModelMessages throw a 500.
