---
type: is
id: is-01m1yyx61ywnazd47kj93abnyq
title: Test the name morphology, lineage and attribution
kind: task
status: closed
priority: 2
version: 4
labels:
  - review
dependencies: []
created_at: 2026-09-07T22:13:03.677Z
updated_at: 2026-09-18T14:47:59.088Z
closed_at: 2026-09-18T14:47:59.087Z
close_reason: "scripts/test-names.ts (32 checks, in npm test): vocative/mention fixtures, adjacent quotes, paragraph breaks, self-reference, offsets, line-wrapped names; golden data: Fyodorovitch → exactly four children, Pavel Fyodorovitch once, irregular stems (Pavel, Alexander, Ilya), Fetyukovitch not a patronymic, byname distanced, every form occurs, fixed register sample, totals reconcile. Writing them found and fixed 4 faults (wrapped names, Fetyukovitch, byname, missing -itch aliases). Precision measured, not just coverage. Commit 0c59716."
resolution: null
duplicate_of: null
---
15 golden tests cover parsing and mentions. There are zero tests for name morphology, patronymic lineage, speaker attribution, or curated data.

The morphology is rule-based and full of edge cases — the irregular-stem table (Pavl to Pavel, Alexandr to Alexander) is exactly the kind of thing that rots quietly. Attribution is regex over dialogue and equally fragile; its escaping already broke silently once, matching nothing while reporting success.

Assert: Fyodorovitch resolves to four children; Pavel Fyodorovitch occurs exactly once; every declared alias occurs at least once; register classification is stable for a fixed sample.

## Notes

R9 in docs/reviews/2026-09-08-visual-memory-review.md adds verified failures at 5d9098d: the TS Zossima test checks pre-death presence, existing JSON/database tests do not exercise fresh regeneration, and Python attribution coverage is hardcoded. New Python lineage coverage now exists, superseding the older zero-tests claim. Add focused pipeline, overlap, attribution distinction and interaction checks; measure precision, not just reported coverage.
