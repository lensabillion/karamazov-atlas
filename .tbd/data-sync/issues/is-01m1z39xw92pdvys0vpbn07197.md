---
type: is
id: is-01m1z39xw92pdvys0vpbn07197
title: "R8: Make literary evidence directly navigable"
kind: feature
status: closed
priority: 2
version: 2
labels:
  - review
dependencies: []
parent_id: is-01m1yjvd5r5ad7x6xv7d4hpqwa
created_at: 2026-09-07T23:29:55.592Z
updated_at: 2026-09-18T14:24:31.800Z
closed_at: 2026-09-18T14:24:31.800Z
close_reason: Every person, tie and timeline span now carries a verified chapter id; key claims carry a verbatim quote and link to /read/<ch>#passage=<quote>, which scrolls to and marks the paragraph. Person and evidence are separate controls in the map card. Ties are labelled fact / a character's claim / our reading, with a required note. Tests enforce chapters, notes, and quote-in-one-paragraph. Commits 9990b0c, 287891e.
resolution: null
duplicate_of: null
---
RelationshipMap.tsx:132-145 renders citations as plain text in buttons that select another character. New timeline Span has no source chapter/span at all. Separate person and evidence actions, store validated chapter and passage references, and distinguish textual fact from interpretation. A reader must reach the supporting passage from every major claim. See R8 in docs/reviews/2026-09-08-visual-memory-review.md.
