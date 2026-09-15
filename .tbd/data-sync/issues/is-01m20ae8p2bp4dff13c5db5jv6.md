---
type: is
id: is-01m20ae8p2bp4dff13c5db5jv6
title: Improve Who’s Who spacing, character navigation and relationship representation
kind: feature
status: closed
priority: 1
version: 4
labels:
  - ui
dependencies: []
parent_id: is-01m1yjvd5r5ad7x6xv7d4hpqwa
created_at: 2026-09-08T10:53:52.193Z
updated_at: 2026-09-08T17:15:48.708Z
closed_at: 2026-09-08T17:15:48.708Z
close_reason: Requested Who’s Who UI/UX improvements implemented and browser-verified; regression tests, typecheck and Webpack production build pass. See docs/progress.md section8. Remaining default build environment limitation tracked separately.
resolution: null
duplicate_of: null
---
User requests UI/UX, padding, margin and representation improvements to /who. Build on current b207385 and design system v3. Add a readable character-focused relationship explorer, consistent spacing, searchable cast navigation, clear directed ties, useful detail and source links, responsive layout, keyboard support. Verify desktop/mobile behavior and build/tests. Do not change unrelated novel analysis.

## Notes

Implemented the focused character explorer, family shortcuts, search/filter directory, readable multi-bond cards, persistent profile, separate chapter links, whole-cast context map, keyboard focus and scoped responsive spacing. Reused v3 design tokens and preserved literary data. Browser verified 320/390/820/1440px; no Who page overflow. Tests/typecheck pass; production Webpack build passes132 pages; default Turbopack worker port failure tracked separately. Documentation appended to docs/progress.md. Local changes only; prior remote sync rejection was not retried.
