---
type: is
id: is-01m1yjwjv8heb1xf9vttb7nx9x
title: "R2: Replace unsupported emotional-warmth claims with evidenced name usage"
kind: bug
status: closed
priority: 1
version: 3
labels:
  - review
dependencies: []
parent_id: is-01m1yjvd5r5ad7x6xv7d4hpqwa
created_at: 2026-09-07T18:43:01.095Z
updated_at: 2026-09-18T14:47:58.913Z
closed_at: 2026-09-18T14:47:58.912Z
close_reason: "Attribution rewritten (scripts/lib/attribution.ts): no tag across adjacent quotes/paragraphs (II.7 Rakitin case fixed, regression-tested); vocative 'address' vs 'mention'; every attributed speech stored with chapter+offset (names.json speech). Claims qualified: 'coldest men' → 'How far the naming ever relaxes', 'said to their face by' = direct address only, ladder describes naming not feeling; reading kept labelled as a reading. Precision hand-judged: 25/25 address, 25/25 mention, 50/50 speakers (docs/attribution-precision.md). Python API: /addresses (direct), /spoken-of, coverage split. Commit 0c59716."
resolution: null
duplicate_of: null
---
R2 of docs/reviews/2026-09-08-visual-memory-review.md. scripts/build-names.ts:162-198 treats a mentioned person as an addressee and can attach speech to the wrong speaker; the b02-c07 Rakitin passage about Grushenka is attributed to Alyosha. Warmth is inferred from prose mentions, including narration, against an incomplete alias whitelist. Replace universal unloved/coldest claims with qualified usage descriptions; store verified speaker, addressee or mentioned subject, chapter and passage. Validate direct address, third-person mention, adjacent quotes and self-reference. Preserve literary interpretations as interpretations.
