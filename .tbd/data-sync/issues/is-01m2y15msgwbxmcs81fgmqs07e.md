---
type: is
id: is-01m2y15msgwbxmcs81fgmqs07e
title: "Cleanup: make globals.css the single documented source of the design system"
kind: task
status: closed
priority: 1
version: 6
labels:
  - cleanup
  - design
dependencies:
  - type: blocks
    target: is-01m2y15q46c9qcythwqg5h3rcb
  - type: blocks
    target: is-01m2y181rxg9krbf2qb57fa155
parent_id: is-01m2y13c1jg04xhgaxy7fmxn1m
created_at: 2026-09-19T23:49:05.452Z
updated_at: 2026-09-21T09:35:40.677Z
closed_at: 2026-09-21T09:35:40.676Z
close_reason: Consolidation in 91f8e23, guard in 43af1a4; measured before/after and proven red then green. Details in notes.
resolution: null
duplicate_of: null
---
Read `.claude/skills/first-edition/SKILL.md` and `docs/design-system.md` first.
The system is the 1912 Heinemann edition: one typeface, four colours, six type
sizes, six spacing steps, rules instead of boxes. Do not invent tokens outside
it and do not add a colour.

Four measured leaks:

1. `--rule` is defined FIVE times with the identical value `var(--color-ink)` —
   home.css:6, plate.css:29, case.css:7 and :81, translations.css:5 — plus a
   sixth local override in collage-catalogue.css:22. Five copies of one decision
   is five places to change it and four places to forget. Hoist one definition
   into the `:root` block in globals.css. Keep the collage-catalogue one only if
   it is a deliberate local override, and comment why.
2. `plate.css:171` hardcodes `border-bottom: 1px dotted rgba(43, 36, 29, 0.35)`.
   That colour is in no token — ink is #1a1613 — so it is a fifth ink nobody
   declared. Replace it with a token. If a translucent ink is genuinely needed
   for leader dots, declare it once as a named token and say what it is for.
3. `--tracking-wide: 0.1em` (globals.css:117) is declared and used by nothing.
   Either delete it or apply it where letterspacing is currently a literal —
   decide from the call sites, do not guess. If it stays, remember the skill's
   rule: every letterspaced run needs a matching `text-indent`, or the block
   sits optically off-centre.
4. RULE WEIGHTS are literals everywhere: `1px solid`, `2px solid`,
   `3px double`, `1px dotted` across all seven stylesheets. In this system a
   rule is a design decision, not an incidental border — the paired thick/thin
   rule IS the visual grammar. Give the weights tokens and use them.

Then DOCUMENT the contract in globals.css itself. The header there is already
good; extend it so the file states, for each token group, what the token is,
what it is for, and what is forbidden — enough that someone editing a
stylesheet never needs to open the spec to stay inside the system. Note that
`docs/design-system.md` remains authoritative on disagreement, as the file
already says, and update that document if any token name changes.

Do NOT restyle anything. This is consolidation: computed styles should come out
identical except where a hardcoded value is deliberately corrected onto a token
(finding 2), and that one change must be stated.

Verify by MEASURING, not by screenshot — the skill records a wrapped grid row
that a screenshot hid and only `gridTemplateRows` exposed. Start the dev server
on port 3210, load /, /characters, /case, /read/b05-c05 and a character plate,
and read back `getComputedStyle` for the affected borders and colours before
and after. `npm run build` must pass.

## Notes

Completed 20-21 Sep 2026. Commit 91f8e23.

CHANGES
1. --rule hoisted into :root. Before (git grep on parent 5af7966): the line
   `--rule: var(--color-ink)` five times in FOUR stylesheets (home.css:6,
   plate.css:29, case.css:7 and :81, translations.css:5), plus `--rule:
   var(--ink)` in a fifth (collage-catalogue.css:22). var(--ink) is the same
   colour, so the collage one was not a deliberate override and was removed.
   .plate's --ink and --stock restated :root verbatim and were removed.
   --ink-soft stays local (not a root token; it switches plate classes onto
   non-plate surfaces).
2. plate.css leader dots: rgba(43,36,29,0.35) -> var(--border-strong), the
   value .characters-list__leader already uses. The one deliberate appearance
   change. Old value over flat --stock computes to ~rgb(172,166,156)
   (arithmetic, not a pixel sample; ignores the paper-texture washes);
   --border-strong is rgb(185,171,144).
3. --tracking-wide deleted: read by nothing, one of 13 distinct letter-spacing
   values, would have covered 7 of the call sites (all 0.1em). Verified by git grep.
4. Rule weights: --rule-hair 1px, --rule-thick 2px, --rule-heavy 3px. 38 border
   declarations with a px literal replaced (globals 10, home 7,
   collage-catalogue 7, plate 6, characters 5, translations 2, case 1).
   --border-width renamed --rule-hair: 26 occurrences (git grep -o).
   .prose p[data-cited] padding-left now subtracts var(--rule-heavy).
5. Contract written into the globals.css header, one block per token group.
   docs/design-system.md sec.4 now lists the rule tokens.

MEASUREMENT
Method: dev server :3210, viewport pinned to 1280x900. For every element and
its ::before and ::after, 44 computed properties hashed (FNV-1a 32-bit) per
vector, plus the bounding rect to 0.01px. Captured before the edit (A) and
after (B, C, D), compared by DOM index.

  page                    elements  element diffs  pseudo diffs
  /                           3317  0 (A vs D)     49 .plate__form
  /characters                  610  0              0
  /case                        546  0              0
  /read/b05-c05                400  0              0
  /character/smerdyakov        401  0              2 .plate__form
  /translations                309  0              0
  /ideas                       279  0              0

That is 5862 elements, or 17586 vectors. Changed: 51 .plate__form elements with
BOTH pseudo-elements changed on each, so 102 vectors. All of them are the leader
correction. No element-level vector changed. Rects were identical on the six
non-home pages.

Controls on /: A vs B showed 8 FIGURE element diffs and 53 rect diffs
(FIGCAPTION.meta/STRONG, e.g. STRONG 179.64x12 vs 202.41x13.5). B vs C, same
CSS on the same load, showed the same 8 and the same 53; the printed ones were
exact reversals. So B was captured mid-load. A vs D after a reload: 0 element
diffs, 49 pseudo. C vs D, same CSS: 0 and 0. The rect-diff per-class counts
for A-vs-D and C-vs-D matched, but only by reading both printed lists, not by
an equality check. The load-state cause (font face or image decode) was not
isolated.

Unchanged spot values: .plate__rule 2px solid over 1px solid rgb(26,22,19);
.plate__rule--hair 1px solid rgb(26,22,19); .folio-contents 3px double;
.characters-rule 2px solid; .translations__table th 2px solid rgb(26,22,19).

Other: running head is one line at 1024px (nav 59px, scrollWidth ==
clientWidth). One console read (onlyErrors) after the page sequence returned
nothing; I did not confirm that the buffer survives navigation. build,
typecheck and npm test passed locally before and after commit.

CORRECTIONS TO COMMITTED TEXT
The 91f8e23 message says "51 vectors"; it should say 51 leader pairs, 102
vectors. It also says "--rule was declared with the identical value in five
stylesheets and overridden in a sixth"; it should say five times in four
stylesheets, plus once in a fifth. The globals.css :root comment says "this same
line appeared in five stylesheets"; it should say four. "Six places" is correct.

Follow-up filed: atlas-w8zq (--radius is 3px but the spec says 2px; .plate
hardcodes 2px).
