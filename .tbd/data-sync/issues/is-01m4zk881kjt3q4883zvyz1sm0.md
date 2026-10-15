---
type: is
id: is-01m4zk881kjt3q4883zvyz1sm0
title: "H3: open SQLite cross-thread safe, read-only and immutable; /health 503 on a missing table"
kind: bug
status: open
priority: 1
version: 1
labels:
  - python
  - api
dependencies: []
parent_id: is-01m4zk87vy04qq5g5brccw38mb
created_at: 2026-10-15T10:55:43.154Z
updated_at: 2026-10-15T10:55:43.154Z
---
api/src/atlas/db.py connect() opens with the default check_same_thread=True while main.py hands the connection through a sync generator dependency to sync endpoints. FastAPI dispatches setup, endpoint and teardown to the anyio threadpool separately, so under overlapping requests they land on different threads and sqlite3 raises ProgrammingError. Open with check_same_thread=False (one connection per request, used sequentially) and as a read-only immutable URI (file:...?mode=ro&immutable=1, uri=True) so a mispathed ATLAS_DB_PATH cannot create an empty database. /health must return the documented 503 when the chapters table or file is missing, not a 500. Measure with a real uvicorn run of overlapping requests before and after.
