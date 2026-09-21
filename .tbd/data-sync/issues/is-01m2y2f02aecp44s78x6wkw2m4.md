---
type: is
id: is-01m2y2f02aecp44s78x6wkw2m4
title: "Design system: --radius is 3px but the spec says 2px"
kind: bug
status: open
priority: 3
version: 1
labels:
  - design
  - cleanup
dependencies: []
created_at: 2026-09-20T00:11:40.489Z
updated_at: 2026-09-20T00:11:40.489Z
---
Found while consolidating the design system (atlas-3w18), and deliberately not
fixed there because that bead had to leave computed styles identical.

docs/design-system.md sec.4 and .claude/skills/first-edition/SKILL.md both say
"One radius (--radius, 2px)". globals.css declares `--radius-sm: 3px` in @theme
and `--radius: var(--radius-sm)` in :root, so every object that reads
var(--radius) is drawn at 3px. Separately, `.plate` (src/app/plate.css:35)
hardcodes `border-radius: 2px` instead of reading the token, so the plate alone
matches the spec while everything else does not.

Per design-system.md sec.9 the document is the specification and the CSS is the
bug, so the correction is 3px -> 2px, plus pointing .plate at the token.

Measured blast radius (computed border-radius today): .card 3px, .field 3px,
.button 3px, .notice 3px, .chart 3px, .name-panel 3px, .lineage__child 3px,
.anchored 3px, .bar-fill 3px, .rung 3px, .sparkbar__bar 3px, .prose mark 3px,
.plate 2px. All of these move by 1px, so this needs its own before/after
measurement pass rather than being folded into a consolidation.

Note that scripts/test-design-system.ts does NOT catch this: it has no check
that a token's value agrees with the spec, only that tokens exist, are read,
and are used instead of literals. Deciding whether such a check is worth having
is part of this bead.
