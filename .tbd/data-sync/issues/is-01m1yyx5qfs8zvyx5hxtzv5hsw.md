---
type: is
id: is-01m1yyx5qfs8zvyx5hxtzv5hsw
title: searchCorpus reads all 96 chapter files on every query
kind: task
status: closed
priority: 2
version: 2
labels: []
dependencies: []
created_at: 2026-09-07T22:13:03.343Z
updated_at: 2026-09-18T14:00:39.464Z
closed_at: 2026-09-18T14:00:39.464Z
close_reason: Chapter text and lowercase copies indexed once per process (production); searchCorpus(query, limit, through) adds the spoiler bound. Commit on chore/address-open-beads.
resolution: null
duplicate_of: null
---
searchCorpus() loops the chapter list and calls getChapterText() for each, so one query is 96 synchronous file reads plus 96 lowercase copies of the whole novel.

Survivable at this size; will not survive spoiler-scoped retrieval, phrase search, or concurrency. Superseded if the database work lands first — FTS5 gives ranked search and a chapter_index filter for free.
