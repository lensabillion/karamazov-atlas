---
type: is
id: is-01m1z39xw92pdvys0vpbn07197
title: "R8: Make literary evidence directly navigable"
kind: feature
status: open
priority: 2
version: 1
labels:
  - review
dependencies: []
parent_id: is-01m1yjvd5r5ad7x6xv7d4hpqwa
created_at: 2026-09-07T23:29:55.592Z
updated_at: 2026-09-07T23:29:55.592Z
---
RelationshipMap.tsx:132-145 renders citations as plain text in buttons that select another character. New timeline Span has no source chapter/span at all. Separate person and evidence actions, store validated chapter and passage references, and distinguish textual fact from interpretation. A reader must reach the supporting passage from every major claim. See R8 in docs/reviews/2026-09-08-visual-memory-review.md.
