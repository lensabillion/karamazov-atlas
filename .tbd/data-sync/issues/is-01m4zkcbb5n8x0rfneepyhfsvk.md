---
type: is
id: is-01m4zkcbb5n8x0rfneepyhfsvk
title: Bound tool output per request and lower the step count
kind: task
status: closed
priority: 1
version: 3
labels:
  - security
dependencies: []
parent_id: is-01m4zkcb01x03f4dxbb3ed8ehw
created_at: 2026-10-15T10:57:57.604Z
updated_at: 2026-10-15T11:10:02.079Z
closed_at: 2026-10-15T11:10:02.079Z
close_reason: "src/lib/chat-tools.ts: one budget of TOOL_OUTPUT_CHARS=48,000 per request shared by searchNovel, readChapter and listChapters; text charged as returned and cut at the budget; refused with BUDGET_SPENT after. stepCountIs 6 -> 4, so output is 8,000 tokens per request (was 12,000) and retrieved text 48,000 chars (was unbounded: 24,000 per readChapter call, any number of calls). Measured: two reads of b05-c05 (50,940 chars) and b06-c02 spend exactly 48,000; third read, a search and the list each refused at cost 0; mixed sequence returned == charged == 48,000, never above; scope-gate refusal costs 0. PR https://github.com/lensabillion/karamazov-atlas/pull/21"
resolution: null
duplicate_of: null
---
H2. A running character budget shared by searchNovel, readChapter and listChapters so the retrieved text across all steps of one request cannot exceed a documented cap; stepCountIs lowered from 6 to 4 so the per-request output ceiling is 4 x 2,000 tokens.
