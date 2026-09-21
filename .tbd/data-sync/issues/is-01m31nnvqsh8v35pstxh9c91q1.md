---
type: is
id: is-01m31nnvqsh8v35pstxh9c91q1
title: "Correct the models.py docstring: no generated client reads these schemas"
kind: task
status: open
priority: 3
version: 1
labels:
  - python
  - docs
dependencies: []
created_at: 2026-09-21T09:45:11.673Z
updated_at: 2026-09-21T09:45:11.673Z
---
Found while closing atlas-ljh6, and left out of it because that bead's scope was
the two models, not the file's prose.

The module docstring of api/src/atlas/models.py says the schemas "mirror the
TypeScript interfaces in web/src/lib one-to-one, deliberately", that
"`openapi-typescript` regenerates the client types", and that "the front end can
never drift from the API without the compiler noticing". None of it describes
the repo:

- There is no web/ directory; the interfaces live in src/lib.
- Nothing generates a client. openapi-typescript appears nowhere in
  package.json, src or scripts, and design-document §6.9 records that step 5
  (pointing the pages at the API through a generated client) was not taken
  (atlas-gc9d).
- The front end reads committed JSON (src/lib/names.ts reads data/names.json).
  The only API caller is src/lib/atlas-api.ts, for /search, with a hand-written
  RemoteHit type, so no compiler would notice drift.
- The mirror is not one-to-one: the TypeScript names interfaces are camelCase.

The comment above _REGISTER_SHADOWS_BASEMODEL repeats the premise ("so the
generated client typed it as possibly missing"). Keeping `register` required is
still right, because /addresses and /spoken-of publish it in the OpenAPI
document; only the stated consumer is wrong.

Correct the docstring and that clause to say what the schemas are for today:
the published OpenAPI document of a service whose one live consumer is the chat
route's retrieval tool. Verify as atlas-ljh6 did: the served /openapi.json stays
byte-identical, since docstrings on the module and comments reach no schema.
