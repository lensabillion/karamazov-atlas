---
type: is
id: is-01m1ych13jsades3wqh0t4r2ma
title: Migrate the data layer to a Python FastAPI service
kind: epic
status: open
priority: 2
version: 1
labels: []
dependencies: []
created_at: 2026-09-07T16:51:51.026Z
updated_at: 2026-09-07T16:51:51.026Z
---
Move the corpus pipeline and retrieval out of Next.js into a Python service, per docs/design-document.md section 6.

Rationale: the work is fundamentally NLP — alias resolution, morphological classification, speaker attribution — and Python owns that ecosystem. pymorphy3 would replace hand-written suffix rules with a real morphological analyser; spaCy could raise speaker attribution above its current 14% coverage.

Stack: FastAPI + Pydantic v2, SQLite with FTS5 for search and spoiler scoping, Alembic, uv, openapi-typescript for a generated client.

Boundary decision: /api/chat STAYS in Next.js. The AI SDK's streaming into useChat is tightly coupled to the Next runtime; moving it would mean reimplementing SSE for no gain. Python owns the data, Next owns the streaming, and the chat route's searchNovel tool calls the Python /search endpoint.

Migration is sequenced so the app never breaks: stand up the API against existing JSON first, port the 15 golden tests to pytest as the safety net, then port the pipeline script by script verifying byte-identical output, then SQLite, then point Next at the API, and only last upgrade the linguistics.

Cost, stated honestly: two runtimes in local development, and static generation gains a build-time service dependency. Worth it only because the linguistics improve — if they were not going to, this migration would not pay for itself.
