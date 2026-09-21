---
type: is
id: is-01m2y14qbr9w7t624rp7ps6e8g
title: "Cleanup: delete dead exports and narrow over-wide ones in src/lib"
kind: task
status: closed
priority: 2
version: 4
labels:
  - cleanup
  - typescript
dependencies:
  - type: blocks
    target: is-01m2y181rxg9krbf2qb57fa155
parent_id: is-01m2y13c1jg04xhgaxy7fmxn1m
created_at: 2026-09-19T23:48:35.320Z
updated_at: 2026-09-19T23:55:23.625Z
closed_at: 2026-09-19T23:55:23.625Z
close_reason: null
resolution: null
duplicate_of: null
---
Five findings, each verified by grepping the whole of src/ and scripts/ for the
symbol and finding only its own definition.

DELETE — defined, exported, read by nobody:
- `EXCLUDED_STUDIES` (src/lib/collage-studies.ts:64). A Record<number,string>
  of plates excluded from the studies list. Check first whether the reason it
  records is stated anywhere else; if that note is the only copy of a curatorial
  decision, move the text into a comment on `COLLAGE_STUDIES` rather than losing
  it with the code. Provenance notes in this repo are evidence, not commentary.
- `REGISTER_ORDER` (src/lib/names.ts:78). The register array is ordered at each
  use site already.

NARROW — used only inside their own module, so the `export` widens the surface
for nothing:
- `COLLAGE_STUDIES` (collage-studies.ts:43) — read by `studyFor` alone.
- `PASSAGE_KEY` (passage.ts:17) and `forMatch` (passage.ts:34) — read only by
  `passageLink` / `findPassage` in the same file.
Drop the keyword; keep the const. If a test imports one of these, keep the
export and say so here instead.

Verify: `npm run typecheck` clean and `npm test` — all 6 suites pass. Both must
be run AFTER the edits: an unused export is exactly the thing the compiler will
not miss, and the test suites import from these modules.

## Notes

Done in commit 636644e (branch chore/cleanup-uv-design-system).

DELETED (grep over the whole working tree, all file types, excluding node_modules/.next/.git, found only the definition itself):
- EXCLUDED_STUDIES, collage-studies.ts:64 — sole occurrence was its own definition.
- REGISTER_ORDER, names.ts:78 — sole occurrence was its own definition.

The EXCLUDED_STUDIES curatorial note was NOT the only copy, so the code went and no comment was added. The same two sentences, each plus a further clause of reasoning, are the 'Left out' table at src/assets/studies/README.md:34-39 ('Turns the prone figure into a woman in a dress and adds a man on a stump — inventions that change the subject…' / 'Turns the arched shapes (plausibly mirrors) into empty alcoves and a reflected figure into a man in the room — erasing the one clue to the scene'). The module docstring at collage-studies.ts:25-28 already states the omission and points at that README, and docs/historical-illustrations.md:11-14 repeats it. scripts/test-curated.ts also asserts plates 21 and 31 stay out, so the omission is enforced, not only described.

NARROWED (export keyword dropped, const kept; no test imports any of them):
- COLLAGE_STUDIES, collage-studies.ts:43 — read by studyFor alone. scripts/test-curated.ts:80 reads this file as raw TEXT, but its regexes are /plateId: (\\d+)/, /from '@\\/assets\\/…'/, /madeFrom: '…'/ and /invented: '/ — none matches the export keyword or the const name, so narrowing is invisible to it. Confirmed by running it.
- PASSAGE_KEY, passage.ts:17 — read by passageHref (:21) and passageFromHash (:48), not by findPassage as this bead said.
- forMatch, passage.ts:34 — read by findPassage (:40, :42).

VERIFICATION, run before and after the edits with identical results:
- npx tsc --noEmit --incremental false — exit 0, zero bytes of output (npm run typecheck avoided: it writes shared build state another agent is using).
- scripts/test-names.ts — exit 0, 'Name checks passed.'
- scripts/test-reading-position.ts — exit 0, 'Reading-position checks passed.'
- scripts/test-curated.ts — exit 0, 'Curated data checks passed.' Run as an extra check because it is the one suite that reads a file I edited.
No FAIL line in any output.

NOTE for whoever wrote the verification command: 'npx tsx scripts/test-reading-position.ts' cannot work — it throws from server-only because corpus.ts is server-only. The script's own docstring (line 9) and package.json both invoke it as 'node --conditions=react-server --import tsx scripts/test-reading-position.ts'. That is what was run, before and after. It is a wrong command, not a repo failure.

Diff: 3 files, 3 insertions, 12 deletions. Nothing outside src/lib/{collage-studies,names,passage}.ts was touched.
