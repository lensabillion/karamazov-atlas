---
type: is
id: is-01m1xtzj2vpws0jx7zj83mcdh2
title: Spoiler-scoped retrieval in /ask
kind: feature
status: open
priority: 2
version: 1
labels:
  - ai
dependencies: []
parent_id: is-01m1xty0ybnq416hd8apek32xf
created_at: 2026-09-07T11:45:12.795Z
updated_at: 2026-09-07T11:45:12.795Z
---
searchCorpus currently searches all 96 chapters. Once reading position exists, constrain retrieval to chapters at or before it, so the Q&A cannot spoil a first-time reader.

Cheap to implement — a filter on the chapter list before scoring — but it needs a deliberate default and a visible state, because silently withholding half the book from someone who has finished it is its own failure. Show which mode is active in the answer header.
