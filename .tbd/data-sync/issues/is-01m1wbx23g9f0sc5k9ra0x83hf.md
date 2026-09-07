---
type: is
id: is-01m1wbx23g9f0sc5k9ra0x83hf
title: Run the chapter extraction pipeline
kind: task
status: open
priority: 2
version: 3
spec_path: docs/plan-spec.md
labels:
  - ai
dependencies:
  - type: blocks
    target: is-01m1wbx29gx7pbp3t5ybv616a1
  - type: blocks
    target: is-01m1xtzhjd9p5gh2eda5nadq4d
created_at: 2026-09-06T22:02:27.823Z
updated_at: 2026-09-07T11:45:28.737Z
---
scripts/extract.ts has never been run; data/entities.json does not exist.

Uses generateText + Output.object with a Zod schema per chapter to extract summary, events, typed relations, themes and one verbatim quotation. Resumable — already-extracted chapters are skipped and the file is written after each success.

Start with 'npm run extract -- --limit 3' to prove the schema and the cost per chapter before committing to all 96. Check that keyQuote text actually appears in the chapter it came from; the schema asks for a verbatim copy and that is the claim most likely to drift.
