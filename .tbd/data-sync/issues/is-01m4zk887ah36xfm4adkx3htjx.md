---
type: is
id: is-01m4zk887ah36xfm4adkx3htjx
title: "M2: tokenise and double-quote FTS5 terms so punctuation never reaches the MATCH parser"
kind: bug
status: open
priority: 1
version: 1
labels:
  - python
  - api
dependencies: []
parent_id: is-01m4zk87vy04qq5g5brccw38mb
created_at: 2026-10-15T10:55:43.338Z
updated_at: 2026-10-15T10:55:43.338Z
---
main.py /search binds the raw q as the FTS5 MATCH expression. Parameterised, so no injection, but the string is FTS5 syntax: an apostrophe, hyphen, question mark, colon or bare AND is an operator or a syntax error, mapped to 400. Verified live: 'Grushenka's letter', 'who killed Fyodor?', 'well-known' all 400. Split q on whitespace, escape embedded double quotes by doubling, wrap each term in double quotes, and join. A query with no searchable terms returns an empty list. Tests: apostrophe, question mark, hyphen, bare operator word.
