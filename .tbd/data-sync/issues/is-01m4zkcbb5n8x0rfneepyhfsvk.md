---
type: is
id: is-01m4zkcbb5n8x0rfneepyhfsvk
title: Bound tool output per request and lower the step count
kind: task
status: in_progress
priority: 1
version: 2
labels:
  - security
dependencies: []
parent_id: is-01m4zkcb01x03f4dxbb3ed8ehw
created_at: 2026-10-15T10:57:57.604Z
updated_at: 2026-10-15T10:58:14.988Z
---
H2. A running character budget shared by searchNovel, readChapter and listChapters so the retrieved text across all steps of one request cannot exceed a documented cap; stepCountIs lowered from 6 to 4 so the per-request output ceiling is 4 x 2,000 tokens.
