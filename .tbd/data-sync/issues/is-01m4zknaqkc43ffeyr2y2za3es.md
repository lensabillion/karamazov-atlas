---
type: is
id: is-01m4zknaqkc43ffeyr2y2za3es
title: "Decide /search semantics for long questions: AND terms, OR them, or fall back on an empty remote result"
kind: task
status: closed
priority: 3
version: 3
labels:
  - python
  - api
  - retrieval
dependencies: []
created_at: 2026-10-15T11:02:51.891Z
updated_at: 2026-10-15T11:23:46.393Z
closed_at: 2026-10-15T11:23:46.392Z
close_reason: "Decided (a): fts_match joins the quoted terms with OR and bm25 ranks; the route is untouched. PR lensabillion/karamazov-atlas#22, commit 96ff845 on top of #20. Measured on 10 chat-shaped queries against the front end's searchCorpus top 5. Empty results: AND (today) 4/10; (a) OR 0; (b) AND + local fallback 0; (c) AND + OR retry 0; (d) AND then OR fill 0. Key chapter in top 5: AND 6, (a) 9, (b) 10, (c) 10, (d) 10, local scan 9. Agreement with local top 5 (50 slots): (a) 41, (b) 32, (c) 28, (d) 39. (a)'s one miss, b11-c09 for 'how does Ivan's conversation with the devil end', the local scan misses too. Top-hit snippet byte-identical under AND and OR for the 6 queries AND could answer. Live uvicorn after the change: p50 5.3 ms, p95 24.7 ms over 200 requests. Gates in api/: ruff check 0, ruff format --check 0, pytest 35 passed (was 28)."
resolution: null
duplicate_of: null
---
Since atlas-eubc, punctuated natural-language queries reach FTS5 instead of being 400s. Terms are implicitly ANDed, as they always were, so a long question in which one word appears in no chapter returns []. Before, that query was a 400 and the chat route fell back to its local OR-ranked BM25 scan; now it receives [] and treats it as the answer (src/app/api/chat/route.ts: 'if (remote)' is true for an empty array; src/lib/atlas-api.ts returns null only on non-2xx or timeout). Options: make /search OR its terms and rely on bm25 ranking; keep AND and have the route fall back to the local scan when the remote list is empty; or an AND-then-OR retry in the API. Decide with a few real chat-route queries against both, not by taste. Found while closing atlas-6t70.
