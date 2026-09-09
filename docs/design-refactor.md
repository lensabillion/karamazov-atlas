> **Complete and superseded.** This tracked the v1 design-system rollout.
> The system has since been rewritten twice; `design-system.md` is current.

# Design system refactor — progress

Applying `src/app/globals.css` to every surface. Rule: **no inline `style`
attributes** except where a value is computed from data (bar widths, SVG
geometry, group colour assignment).

- [x] Write the system — `src/app/globals.css`, documented
- [x] `layout.tsx` — nav
- [x] `page.tsx` — overview
- [x] `read/page.tsx` — contents
- [x] `read/[id]/page.tsx` — chapter
- [x] `character/[id]/page.tsx` — character
- [x] `network/page.tsx` + `NetworkGraph.tsx`
- [x] `map/page.tsx` + `MindMap.tsx`
- [x] `ask/page.tsx` + `AskPanel.tsx`
- [x] Verify: zero stray inline styles, build clean, both themes checked
