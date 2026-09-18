---
type: is
id: is-01m1wbx23g9f0sc5k9ra0x83hf
title: Run the chapter extraction pipeline
kind: task
status: open
priority: 2
version: 5
spec_path: docs/plan-spec.md
labels:
  - ai
dependencies:
  - type: blocks
    target: is-01m1wbx29gx7pbp3t5ybv616a1
  - type: blocks
    target: is-01m1xtzhjd9p5gh2eda5nadq4d
created_at: 2026-09-06T22:02:27.823Z
updated_at: 2026-09-18T15:31:23.079Z
---
scripts/extract.ts has never been run; data/entities.json does not exist.

Uses generateText + Output.object with a Zod schema per chapter to extract summary, events, typed relations, themes and one verbatim quotation. Resumable — already-extracted chapters are skipped and the file is written after each success.

Start with 'npm run extract -- --limit 3' to prove the schema and the cost per chapter before committing to all 96. Check that keyQuote text actually appears in the chapter it came from; the schema asks for a verbatim copy and that is the claim most likely to drift.

## Notes

18 Sep 2026: ran. 51/96 chapters in data/entities.json (Books I–IX minus II.4, II.7, VII.1, VIII.6 which failed schema), 45 verified quotes, 6 false drops recorded in quotesDropped. STOPPED: Anthropic account credit exhausted ('credit balance is too low') — 41 chapters failed. Measured ≈$0.07/chapter; remaining ≈$3. To finish after the owner adds credit: 'npm run extract' then 'npm run extract -- --redo-dropped'. Every committed quote is test-verified.
