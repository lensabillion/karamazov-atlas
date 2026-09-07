---
type: is
id: is-01m1xtypdn4msy69gy63y2q2ky
title: Reading position as first-class state
kind: feature
status: open
priority: 1
version: 3
labels:
  - reader
dependencies:
  - type: blocks
    target: is-01m1xtzhqzfv2y5at0xcdqp7rr
  - type: blocks
    target: is-01m1xtzj2vpws0jx7zj83mcdh2
parent_id: is-01m1xty0ybnq416hd8apek32xf
created_at: 2026-09-07T11:44:44.469Z
updated_at: 2026-09-07T11:45:29.217Z
---
The reader tells the app where they are. Everything then scopes to it.

This is the mechanic the 2025-26 companion apps converged on (Recall Reader, StoryCodex, Kindle 'Ask this Book') and it is table stakes now. It is also the precondition for the verdict arc: a verdict only means something if we know what the reader had read when they gave it.

Scope: a position control in the nav; persisted per browser; character pages, search, and the map respect it; an explicit unlock for people who have already finished the book and want everything.

Done when: setting position to Bk V ch 5 hides later material by default across every view, the choice survives a reload, and unlocking is one obvious click.
