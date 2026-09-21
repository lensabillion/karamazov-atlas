---
type: is
id: is-01m31p1zdtbkd4cndxfg1z6808
title: timeline.ts header comment counts Book I among the four days
kind: bug
status: open
priority: 3
version: 1
labels:
  - docs
dependencies: []
created_at: 2026-09-21T09:51:48.665Z
updated_at: 2026-09-21T09:51:48.665Z
---
src/lib/timeline.ts:6 says two thirds of the novel (229,504 of 349,367 words) covers roughly four days. The four days are Books II–IX: 217,158 words, 62.2% (computed from data/corpus.json). 229,504 = Books I–IX; the same file's SEGMENTS assign Book I to 'before' (thirteen years of backstory). SEGMENTS data is correct; only the comment is wrong. Fix: '217,158 of 349,367 words' (still nearly two thirds). Found during atlas-hgu0.
