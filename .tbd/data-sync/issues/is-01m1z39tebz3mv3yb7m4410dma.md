---
type: is
id: is-01m1z39tebz3mv3yb7m4410dma
title: "R7: Make diagrams readable on phones and operable by keyboard"
kind: bug
status: open
priority: 1
version: 1
labels:
  - review
dependencies: []
parent_id: is-01m1yjvd5r5ad7x6xv7d4hpqwa
created_at: 2026-09-07T23:29:52.074Z
updated_at: 2026-09-07T23:29:52.074Z
---
At 390px, body width is 552px; relationship SVG1240 shrinks to340px (13px labels become3.6px), timeline1080 shrinks to340px (11px labels become3.5px). globals.css:512 defeats scroll-x by forcing width100%; pairs grid has min420px. RelationshipMap.tsx:102-103 and Timeline.tsx:132 click-only groups lack keyboard controls. Provide readable mobile layouts or deliberate scroll/zoom, semantic controls and equivalent text. See R7 in docs/reviews/2026-09-08-visual-memory-review.md.
