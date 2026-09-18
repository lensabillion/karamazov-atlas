---
type: is
id: is-01m1xtzj2vpws0jx7zj83mcdh2
title: Spoiler-scoped retrieval in /ask
kind: feature
status: closed
priority: 2
version: 2
labels:
  - ai
dependencies: []
parent_id: is-01m1xty0ybnq416hd8apek32xf
created_at: 2026-09-07T11:45:12.795Z
updated_at: 2026-09-18T14:38:18.885Z
closed_at: 2026-09-18T14:38:18.885Z
close_reason: "Panel sends the reader's place with each question; route scopes searchNovel (API 'before' + local through), readChapter (refuses past chapters), listChapters, and adds a no-spoiler system rule. Scope stated above every conversation with one-click whole-book switch. Live check at position 36: 'Who kills Fyodor, and how does the trial end?' → all hits ≤ Bk V ch 5, answer: 'Both of those lie ahead of where you are… I won't spoil them.' Tests: scoped search at 5/36/60. Commit 9b048a1."
resolution: null
duplicate_of: null
---
searchCorpus currently searches all 96 chapters. Once reading position exists, constrain retrieval to chapters at or before it, so the Q&A cannot spoil a first-time reader.

Cheap to implement — a filter on the chapter list before scoring — but it needs a deliberate default and a visible state, because silently withholding half the book from someone who has finished it is its own failure. Show which mode is active in the answer header.
