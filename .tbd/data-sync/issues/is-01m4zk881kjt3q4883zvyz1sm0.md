---
type: is
id: is-01m4zk881kjt3q4883zvyz1sm0
title: "H3: open SQLite cross-thread safe, read-only and immutable; /health 503 on a missing table"
kind: bug
status: closed
priority: 1
version: 2
labels:
  - python
  - api
dependencies: []
parent_id: is-01m4zk87vy04qq5g5brccw38mb
created_at: 2026-10-15T10:55:43.154Z
updated_at: 2026-10-15T11:02:59.078Z
closed_at: 2026-10-15T11:02:59.077Z
close_reason: "db.connect() opens file:{path}?mode=ro&immutable=1 with uri=True and check_same_thread=False; connect_for_write() is the ingest-only writable open. get_db maps 'unable to open database file' to 503 and /health maps 'no such table' to 503. Measured with an in-process uvicorn and a barrier: 120 overlapping requests 112x500 -> 120x200; 50 overlapping 49x500 -> 50x200. The new concurrent test fails on HEAD's db.py (every status 500) and passes on the fix. https://github.com/lensabillion/karamazov-atlas/pull/20"
resolution: null
duplicate_of: null
---
api/src/atlas/db.py connect() opens with the default check_same_thread=True while main.py hands the connection through a sync generator dependency to sync endpoints. FastAPI dispatches setup, endpoint and teardown to the anyio threadpool separately, so under overlapping requests they land on different threads and sqlite3 raises ProgrammingError. Open with check_same_thread=False (one connection per request, used sequentially) and as a read-only immutable URI (file:...?mode=ro&immutable=1, uri=True) so a mispathed ATLAS_DB_PATH cannot create an empty database. /health must return the documented 503 when the chapters table or file is missing, not a 500. Measure with a real uvicorn run of overlapping requests before and after.
