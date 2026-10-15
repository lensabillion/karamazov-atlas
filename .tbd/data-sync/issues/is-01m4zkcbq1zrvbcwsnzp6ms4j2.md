---
type: is
id: is-01m4zkcbq1zrvbcwsnzp6ms4j2
title: Validate answer citations against the real chapter list
kind: bug
status: closed
priority: 3
version: 3
labels: []
dependencies: []
parent_id: is-01m4zkcb01x03f4dxbb3ed8ehw
created_at: 2026-10-15T10:57:57.985Z
updated_at: 2026-10-15T11:10:02.408Z
closed_at: 2026-10-15T11:10:02.407Z
close_reason: "citationHref(book, chapter, chapters) in AnswerText links only ids present in the corpus; AskPanel passes the 96 ids it already has as places. Measured: Bk I ch. 9, Bk VI ch. 4, Epilogue ch. 4 -> null (were 404 links); all 96 chapters link to themselves. PR https://github.com/lensabillion/karamazov-atlas/pull/21"
resolution: null
duplicate_of: null
---
L1. AnswerText bounds a citation only by chapter <= 14, so Bk I, ch. 9 links to /read/b01-c09, a 404. Link only citations whose id is in the corpus; render the rest as text.
