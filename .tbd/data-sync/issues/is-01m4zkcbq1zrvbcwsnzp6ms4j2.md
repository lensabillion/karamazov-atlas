---
type: is
id: is-01m4zkcbq1zrvbcwsnzp6ms4j2
title: Validate answer citations against the real chapter list
kind: bug
status: in_progress
priority: 3
version: 2
labels: []
dependencies: []
parent_id: is-01m4zkcb01x03f4dxbb3ed8ehw
created_at: 2026-10-15T10:57:57.985Z
updated_at: 2026-10-15T10:58:15.310Z
---
L1. AnswerText bounds a citation only by chapter <= 14, so Bk I, ch. 9 links to /read/b01-c09, a 404. Link only citations whose id is in the corpus; render the rest as text.
