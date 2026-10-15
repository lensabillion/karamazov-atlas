---
type: is
id: is-01m4zrtfd4d3vw91qdvcgk84qd
title: "Prune dead weight: the Python backend, the extraction pipeline, dead assets, stale docs and duplicate agent folders"
kind: chore
status: closed
priority: 1
version: 3
labels:
  - cleanup
dependencies: []
created_at: 2026-10-15T12:33:03.395Z
updated_at: 2026-10-15T12:39:13.757Z
closed_at: 2026-10-15T12:39:13.757Z
close_reason: "Removed in PR #23 with all gates green; measurements in notes."
resolution: null
duplicate_of: null
---
Owner's direction on 2026-10-15: add nothing, delete what is not strictly necessary, and understand the project from first principles. Tier 1: public/artwork/grigoriev-collage.zip (5.2 MB duplicate of the 36 plates), src/assets/collage/source.webp (491 KB, unreferenced), scripts/extract.ts + data/entities.json (model output nothing renders), six docs (design-refactor, review-2026-09-08, TODO, design-document (M10 stale), historical-illustrations, attribution-precision), .agents and .codex (byte-identical copies of .claude/skills, Codex hooks), eight merged remote branches. Tier 2: the Python backend (api/, Dockerfile, .dockerignore, render.yaml), its client src/lib/atlas-api.ts and suite scripts/test-atlas-api.ts, the CI backend job; the chat route keeps only the in-process search. PRs #20 and #22 close unmerged. The live Render service is not touched (owner's account).

## Notes

Done in PR https://github.com/lensabillion/karamazov-atlas/pull/23 (commit a2ecf7d on chore/prune-dead-weight, stacked on #19 / claude/elastic-haslett-a15730; GitHub retargets to main when #19 merges).

Change: 43 files, +41 / -10,087 lines; 32 files deleted; tracked tree 45,524,511 -> 39,061,399 bytes. Removed: api/ (9 files), Dockerfile, .dockerignore, render.yaml, src/lib/atlas-api.ts, scripts/test-atlas-api.ts, the CI api job; scripts/extract.ts, scripts/lib/verbatim.ts, data/entities.json, the extract npm script and the curated test's extracted-chapters section; public/artwork/grigoriev-collage.zip (5.2 MB) and its link, src/assets/collage/source.webp (491 KB); docs design-refactor, review-2026-09-08, TODO, design-document, historical-illustrations, attribution-precision (942 lines); .agents (3 skills, identical to .claude/skills) and .codex (4 files); eight merged remote branches. Chat route: searchNovel keeps only searchCorpus; ATLAS_API_URL read nowhere. README, deployment-plan (§2 records the decision), plan-spec updated.

Gates on Next 16.4.1: typecheck exit 0; npm test exit 0 (6 suites, 162 ok); test:drift exit 0; build exit 0 (136/136 pages); npm audit exit 0 (0 vulnerabilities). Browser on next dev -p 3211: / 200 (no Download-all link, 16 Back-to-contents links, 5 /_next/image 200), /ask 200 with the no-key notice, /read/b05-c05 200; no console errors.

PRs #20 and #22 closed unmerged with comments. Bead atlas-94i4 canceled. Not done: the live Render service (owner's account) and any ATLAS_API_URL set on Vercel. Not tested: /api/chat with a key, next start.
