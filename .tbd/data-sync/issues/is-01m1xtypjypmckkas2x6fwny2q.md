---
type: is
id: is-01m1xtypjypmckkas2x6fwny2q
title: "Consolidate the surface: fold /map into /, demote /network, remove the v0 artefact"
kind: chore
status: closed
priority: 2
version: 2
labels: []
dependencies: []
parent_id: is-01m1xty0ybnq416hd8apek32xf
created_at: 2026-09-07T11:44:44.638Z
updated_at: 2026-09-07T22:11:38.980Z
closed_at: 2026-09-07T22:11:38.979Z
close_reason: null
resolution: null
duplicate_of: null
---
Three pieces of accumulated redundancy:

- /map and / both render parts→books→chapters. Two views of one thing. Fold the map's interactivity into the overview and drop the separate route.
- /network is a distant-reading artefact — honest, mildly interesting, and not why anyone would return. The research is explicit that nobody has ever loved a novel more for seeing its co-occurrence graph. Keep it as a secondary view; stop treating it as a headline.
- karamazov-map.html sits in the repo root, 41,700 bytes, referenced by nothing. It is the v0 hand-authored mind map, superseded by the app and preserved as a published artifact. Delete it from the repo.

Done when: the nav has fewer, better entries; nothing in src references a removed route; the root has no orphan HTML.
