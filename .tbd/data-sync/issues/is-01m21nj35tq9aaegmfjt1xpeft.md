---
type: is
id: is-01m21nj35tq9aaegmfjt1xpeft
title: Refine Names page layout and spacing without changing typography
kind: task
status: closed
priority: 1
version: 4
labels:
  - ui
dependencies: []
created_at: 2026-09-08T23:27:26.393Z
updated_at: 2026-09-09T10:30:51.828Z
closed_at: 2026-09-09T10:30:51.828Z
close_reason: Names UI spacing, alignment, responsive layout, and interaction checks completed without changing typography; verification documented.
resolution: null
duplicate_of: null
---
User requests improved Names page UI, alignment, margins and padding while explicitly preserving typography. Scope: consistent section and chart/card layout, contained responsive charts, clearer navigation and spacing. Preserve existing fonts, font sizes, weights, literary content and data. Verify desktop/mobile bounds and typography before/after.

## Notes

Completed Names layout refresh with unchanged typography, aligned headers and cards, section shortcuts, contained native-size mobile diagrams, and expandable name/speaker metadata. Browser checked 320/390/820/1440px with no page overflow; computed typography matched before/after; anchor navigation and disclosure verified. Typecheck, tests, and Webpack production build pass (132 pages). Documented in docs/PROGRESS.md section 9. Local only; remote sync not retried.
