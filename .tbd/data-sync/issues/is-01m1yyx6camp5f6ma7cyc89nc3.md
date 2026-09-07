---
type: is
id: is-01m1yyx6camp5f6ma7cyc89nc3
title: Finish applying shape encoding, and add a legend
kind: task
status: open
priority: 2
version: 1
labels:
  - design
dependencies: []
created_at: 2026-09-07T22:13:04.010Z
updated_at: 2026-09-07T22:13:04.010Z
---
Design system v2 states that category is encoded by shape, never colour. GroupMark is wired into the relationship map, name orbits and warmth ladder — but not the timeline lanes or the /read sidebar chips, which still use plain circles. The system is inconsistent with its own rule.

Also: shape now carries meaning and nothing explains the mapping. Every page using marks needs a legend.

Also: page copy hardcodes numbers the corpus already knows ('all 96 chapters'). Derive them from corpus.chapters.length so the prose cannot go stale.
