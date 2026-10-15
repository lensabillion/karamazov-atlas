---
type: is
id: is-01m4zknaqkc43ffeyr2y2za3es
title: "Decide /search semantics for long questions: AND terms, OR them, or fall back on an empty remote result"
kind: task
status: open
priority: 3
version: 1
labels:
  - python
  - api
  - retrieval
dependencies: []
created_at: 2026-10-15T11:02:51.891Z
updated_at: 2026-10-15T11:02:51.891Z
---
Since atlas-eubc, punctuated natural-language queries reach FTS5 instead of being 400s. Terms are implicitly ANDed, as they always were, so a long question in which one word appears in no chapter returns []. Before, that query was a 400 and the chat route fell back to its local OR-ranked BM25 scan; now it receives [] and treats it as the answer (src/app/api/chat/route.ts: 'if (remote)' is true for an empty array; src/lib/atlas-api.ts returns null only on non-2xx or timeout). Options: make /search OR its terms and rely on bm25 ranking; keep AND and have the route fall back to the local scan when the remote list is empty; or an AND-then-OR retry in the API. Decide with a few real chat-route queries against both, not by taste. Found while closing atlas-6t70.
