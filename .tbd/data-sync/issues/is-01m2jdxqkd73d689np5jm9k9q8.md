---
type: is
id: is-01m2jdxqkd73d689np5jm9k9q8
title: Audit every surface against the first-edition system
kind: task
status: open
priority: 1
version: 1
labels:
  - design
dependencies: []
created_at: 2026-09-15T11:41:04.493Z
updated_at: 2026-09-15T11:41:04.493Z
---
Palette, ground, typefaces and chart labels are switched globally, but each page needs reading against docs/design-system.md rather than assumed correct.

Per page — /, /read, /read/[id], /who, /names, /timeline, /ask:
  1. Only --font-display and --font-serif; no system sans
  2. Every letterspaced run carries a matching text-indent
  3. Colours only from cloth, gilt and the three inks
  4. No boxes, shadows, gradients or rounded panels left from v3
  5. Sizes from the six-step scale

Verify by reading computed styles, not screenshots. A wrapped grid row survived a screenshot review on the plate and was caught only by gridTemplateRows reporting two rows where there should have been one.
