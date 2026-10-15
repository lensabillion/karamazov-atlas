---
type: is
id: is-01m4zk887ah36xfm4adkx3htjx
title: "M2: tokenise and double-quote FTS5 terms so punctuation never reaches the MATCH parser"
kind: bug
status: closed
priority: 1
version: 2
labels:
  - python
  - api
dependencies: []
parent_id: is-01m4zk87vy04qq5g5brccw38mb
created_at: 2026-10-15T10:55:43.338Z
updated_at: 2026-10-15T11:02:59.251Z
closed_at: 2026-10-15T11:02:59.250Z
close_reason: "fts_match() splits on whitespace, doubles embedded double quotes, wraps each term in double quotes; a query with no words returns []. Before -> after on the local service: Grushenka's letter 400 -> 200 (3 hits); who killed Fyodor? 400 -> 200 (3); well-known 400 -> 200 (3); AND 400 -> 200 (3); Alyosha: the monk 400 -> 200 (3); ?? 400 -> 200 []. Terms still ANDed; the OR/fallback question is atlas-h7pn. https://github.com/lensabillion/karamazov-atlas/pull/20"
resolution: null
duplicate_of: null
---
main.py /search binds the raw q as the FTS5 MATCH expression. Parameterised, so no injection, but the string is FTS5 syntax: an apostrophe, hyphen, question mark, colon or bare AND is an operator or a syntax error, mapped to 400. Verified live: 'Grushenka's letter', 'who killed Fyodor?', 'well-known' all 400. Split q on whitespace, escape embedded double quotes by doubling, wrap each term in double quotes, and join. A query with no searchable terms returns an empty list. Tests: apostrophe, question mark, hyphen, bare operator word.
