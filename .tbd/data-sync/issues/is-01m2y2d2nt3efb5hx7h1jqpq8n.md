---
type: is
id: is-01m2y2d2nt3efb5hx7h1jqpq8n
title: Decide the fate of the unused NamedCharacter and NameForm models
kind: task
status: closed
priority: 3
version: 3
labels:
  - python
dependencies: []
created_at: 2026-09-20T00:10:37.626Z
updated_at: 2026-09-21T09:45:11.600Z
closed_at: 2026-09-21T09:45:11.600Z
close_reason: |
  Dead, not staged; deleted in 28b95dc. No endpoint has ever returned either model. The only plan that names a /names route is design-document §6.4, and §6.9 decides against it (atlas-gc9d: pages stay on committed JSON). No bead plans one, and the frontend reads register from data/names.json, not the API. The served OpenAPI document is byte-identical before and after; 12 passed, 2 warnings.
resolution: null
duplicate_of: null
---
Found while closing atlas-3pyw, which deleted `models.Edge` for being returned
by no endpoint. `NamedCharacter` and `NameForm` have exactly the same problem
and the bead named only Edge, so they were left alone rather than deleted on an
assumption.

Evidence: neither appears as a `response_model` in main.py. Confirmed against
the live document — `app.openapi()['components']['schemas']` contains neither,
because FastAPI only emits schemas something references. `NameForm` is reachable
only through `NamedCharacter.forms`, and `NamedCharacter` is reachable from
nothing.

The question is whether they are dead or staged. The data they describe IS
served — `/characters` returns aliases and `/names/lineages` returns the
patronymic grouping — but never in this shape. models.py's own docstring says
these mirror the TypeScript interfaces one-to-one so `openapi-typescript` can
regenerate the client; `NamedCharacter` matches `src/lib/names.ts`, which the
frontend reads from committed JSON rather than from the API.

So: either a `/names/{id}` endpoint was intended and never written, or the
mirror is aspirational and these two should go the way of Edge. Check the
design document and git history before deciding. Do not delete on a grep alone;
the same grep would have deleted Edge correctly and these two wrongly if a route
is pending.

## Notes

Decided 2026-09-21: DEAD, not staged. Deleted in commit 28b95dc on branch
atlas-ljh6/drop-unused-name-models, one commit on top of
chore/cleanup-uv-design-system (43af1a4).

Checked as this bead asked — design document and history, not a grep alone:

1. No endpoint returns either model, and none ever has. `git log --all -S
   NamedCharacter -- api/src/atlas/main.py` and the same for NameForm are both
   empty: no version of main.py on any ref mentions them. `git log --all -G
   '"/names"|/names/\{|names/characters'` matches only f401fca (the design
   document), 78037c4 and 5bd16e9 (frontend), none of which touches api/. In
   api/ they were only ever their own definitions, added with the API in 9b5b15e.
2. The design document proposes GET /names and GET /names/{character_id} in
   §6.4, but §6.9 (decision, 18 Sep 2026; atlas-gc9d closed as a decision)
   records that step 5, pointing the pages at the API, was not taken: every page
   is prerendered from committed JSON. Its reopen condition is about attribution
   recall, not names routes. §6.4 also proposes /characters/{id}/ties, Edge's
   route, and atlas-3pyw deleted Edge anyway, so a §6.4 listing had already been
   judged not to be a plan.
3. No bead plans a names route. `tbd search` over all beads, open and closed,
   for "/names", "names/", "NamedCharacter", "endpoint" and "route": this bead is
   the only one that mentions either model, and none proposes a /names route.
4. The frontend's `register` (NameKey.tsx, CharacterPlate.tsx, NameOrbit.tsx)
   comes from data/names.json, read with readFileSync in src/lib/names.ts — the
   pipeline output, not this API. The only API caller is src/lib/atlas-api.ts,
   for /search alone, with a hand-written RemoteHit type. openapi-typescript
   appears nowhere in package.json, src or scripts.
5. The shapes did not match anyway: the TypeScript NamedCharacter is camelCase
   (givenName, fatherName, warmestRegister; NameForm.firstChapter) and carries
   registerByChapter, which the Python model never had.

Kept: Register (Address still uses it), Group (Character), and
_REGISTER_SHADOWS_BASEMODEL with the catch_warnings block around Address.
Removed with NameForm: the catch_warnings block that existed for it alone. The
comment above now says `Address` and "the one class body" where it said "the
two models" and "the two class bodies".

MEASURED, before and after the change, identical:
- `uv run ruff check .` -> All checks passed!; `uv run ruff format --check .`
  -> 5 files already formatted.
- `ATLAS_DB_PATH=... uv run pytest -q` -> 12 passed, 2 warnings (the same two
  third-party deprecations, httpx via starlette and anyio BlockingPortal).
- components.schemas unchanged: Address, Chapter, Character, CorpusMeta,
  Coverage, HTTPValidationError, Lineage, SearchHit, ValidationError.
- The served /openapi.json is byte-identical: 10,653 bytes, sha256
  aeecc31239d060da4865ff64efa9f4b3555d39b7bc480551c245b9debeb342b6 both times
  (cmp exit 0).
- `python -W error -c 'import atlas.models'` raises nothing;
  Address.model_fields['register'].is_required() is True.

The test database was built in the worktree with `python -m atlas.ingest`:
96 chapters / 27 characters / 49 name_forms / 35 addresses / 37 spoken_of,
the same counts atlas-3pyw recorded.
