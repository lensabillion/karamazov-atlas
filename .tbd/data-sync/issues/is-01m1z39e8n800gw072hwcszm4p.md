---
type: is
id: is-01m1z39e8n800gw072hwcszm4p
title: "R4: Make corpus regeneration complete and safe for paths with spaces"
kind: bug
status: closed
priority: 1
version: 2
labels:
  - review
dependencies: []
parent_id: is-01m1yjvd5r5ad7x6xv7d4hpqwa
created_at: 2026-09-07T23:29:39.604Z
updated_at: 2026-09-07T23:57:04.803Z
closed_at: 2026-09-07T23:57:04.803Z
close_reason: null
resolution: null
duplicate_of: null
---
scripts/build-mentions.ts:189 compares encoded import.meta.url to an unencoded file path, false in this project folder. npm run corpus silently skips mention rebuilding and never invokes build-names. Paissy is 0 in mentions despite 73 exclusive matches with current name forms; standalone Alexey is omitted. Fix the entry guard and full pipeline, validate alias coverage and regenerated artifacts in a temp output directory. See R4 in docs/reviews/2026-09-08-visual-memory-review.md.
