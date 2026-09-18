---
type: is
id: is-01m1wbx1wm40d28h8hkavvpp5c
title: Verify /api/chat end to end against the live API
kind: task
status: closed
priority: 1
version: 3
spec_path: docs/plan-spec.md
labels:
  - ai
dependencies:
  - type: blocks
    target: is-01m1xtzj2vpws0jx7zj83mcdh2
created_at: 2026-09-06T22:02:27.602Z
updated_at: 2026-09-18T14:38:18.713Z
closed_at: 2026-09-18T14:38:18.712Z
close_reason: "Verified live 2026-09-18 against claude-opus-5 via local dev server (key from .env.local). (1) 'What does Snegiryov do with the money…' → 200 text/event-stream, 6 tool calls, answer cites Bk IV ch 7 with verbatim quotes (checked against text) and Bk X ch 5. (2) 'What colour were Fyodor's eyes?' → 7 searches, explicit refusal: 'The novel never gives a colour… I'd rather say it's unsupported than guess.' (3) In the UI at /ask: tool trace renders ('↳ searched the novel (searchNovel)' ×2), answer cites Bk V ch 4. The first call exposed that local search returned the same five chapters for every query; fixed with BM25 in 33fa79b. Answers now render as prose with linked citations (2679263). NB: the key used may be the unrotated one — atlas-qcsc still stands."
resolution: null
duplicate_of: null
---
The chat route in src/app/api/chat/route.ts has never made a model call — it was written and typechecked with no ANTHROPIC_API_KEY present in the environment.

Written against AI SDK v7: streamText + convertToModelMessages + createUIMessageStreamResponse/toUIMessageStream, model claude-opus-5, adaptive thinking, three corpus tools (searchNovel, readChapter, listChapters), stopWhen: stepCountIs(6).

Done when: a question asked at /ask returns a streamed answer that cites a real book and chapter, the tool-call trace renders in AskPanel, and a question the text does not answer produces a refusal rather than an invention.
