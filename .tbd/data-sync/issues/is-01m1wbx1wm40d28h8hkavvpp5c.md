---
type: is
id: is-01m1wbx1wm40d28h8hkavvpp5c
title: Verify /api/chat end to end against the live API
kind: task
status: open
priority: 1
version: 2
spec_path: docs/plan-spec.md
labels:
  - ai
dependencies:
  - type: blocks
    target: is-01m1xtzj2vpws0jx7zj83mcdh2
created_at: 2026-09-06T22:02:27.602Z
updated_at: 2026-09-07T11:45:29.223Z
---
The chat route in src/app/api/chat/route.ts has never made a model call — it was written and typechecked with no ANTHROPIC_API_KEY present in the environment.

Written against AI SDK v7: streamText + convertToModelMessages + createUIMessageStreamResponse/toUIMessageStream, model claude-opus-5, adaptive thinking, three corpus tools (searchNovel, readChapter, listChapters), stopWhen: stepCountIs(6).

Done when: a question asked at /ask returns a streamed answer that cites a real book and chapter, the tool-call trace renders in AskPanel, and a question the text does not answer produces a refusal rather than an invention.
