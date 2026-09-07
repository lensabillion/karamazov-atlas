---
type: is
id: is-01m1z39prjpczc8sxjthmt0r25
title: "R6: Keep the reader Name Key visible and explain who the person is"
kind: bug
status: open
priority: 1
version: 1
labels:
  - review
dependencies: []
parent_id: is-01m1yjvd5r5ad7x6xv7d4hpqwa
created_at: 2026-09-07T23:29:48.305Z
updated_at: 2026-09-07T23:29:48.305Z
---
ChapterProse.tsx:70-76 inserts the selected key above all prose. On current UI, last Alyosha in b03-c09 at 1280x720 opens a panel with top -7535.7 and bottom -7281.5 px. Use an accessible anchored or persistent panel with focus/close handling, a one-line identity and key relationships, and shared identity across views. Verify late-chapter and mobile interactions. See R6 in docs/reviews/2026-09-08-visual-memory-review.md.
