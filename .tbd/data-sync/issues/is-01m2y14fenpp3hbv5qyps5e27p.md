---
type: is
id: is-01m2y14fenpp3hbv5qyps5e27p
title: "Cleanup: modernize the Python source and clear its warnings"
kind: task
status: closed
priority: 2
version: 5
labels:
  - cleanup
  - python
dependencies:
  - type: blocks
    target: is-01m2y181rxg9krbf2qb57fa155
parent_id: is-01m2y13c1jg04xhgaxy7fmxn1m
created_at: 2026-09-19T23:48:27.221Z
updated_at: 2026-09-20T00:07:28.799Z
closed_at: 2026-09-20T00:07:28.798Z
close_reason: null
resolution: null
duplicate_of: null
---
Remove what Python 3.14 makes unnecessary, and clear the two warnings the test
run prints today.

1. DELETE `models.Edge`. It is defined at models.py:121 and referenced nowhere
   in the package, the tests, or the frontend. A schema no endpoint returns is
   a claim about the API that is not true.
2. DROP `from __future__ import annotations` from all four modules. It exists
   to make PEP 604 unions and builtin generics parse on old interpreters; the
   floor is now 3.14, where `int | None` and `list[str]` are native. It is not
   inert under Pydantic either — it turns every annotation into a string that
   Pydantic must resolve at class-build time, so removing it makes the model
   definitions more direct, not just shorter.
3. FIX the two `UserWarning: Field name "register" ... shadows an attribute in
   parent "BaseModel"` (models.py:54 NameForm, models.py:88 Address). Keep the
   wire name `register` — it is the API contract and the frontend reads it —
   and silence the collision properly rather than renaming the field.
4. TIGHTEN loose annotations: `get_db()` is unannotated; `health()` and
   `chapter_text()` return bare `dict`; `args: tuple = ()` and `args: list = []`
   in the query builders carry no element type. Give each one the type it
   actually has.
5. While in main.py, check `/addresses` and `/spoken-of` — they are the same
   function over two tables, and their missing return annotations are the only
   reason that is not obvious. Deduplicate ONLY if the FastAPI response_model
   and generated OpenAPI operation ids stay identical; the OpenAPI document is
   a published interface.

Verify: `uv run pytest -q` — 12 passed and the two UserWarnings GONE from the
output (that is the test; a fix you cannot see in the warning count is not a
fix). `uv run ruff check .` clean.

## Notes

Verified on 2026-09-20, Python 3.14.4, pydantic 2.13.5, fastapi 0.141.1.

1. models.Edge DELETED. Confirmed unreferenced first: a repo-wide grep over *.py/*.ts/*.tsx (excluding node_modules/.next) matched only its own definition, and it was absent from components.schemas in the generated OpenAPI document.
2. 'from __future__ import annotations' removed from all four modules (main.py, models.py, db.py, ingest.py). 'grep -rn from __future__ src tests' now exits 1.
3. The register shadow was NOT cosmetic, and this is the substantive finding. Pydantic takes the inherited BaseModel.register (the abc.ABCMeta classmethod) as the field's DEFAULT, so before this change:
   - Address.model_fields['register'].is_required() was False, likewise NameForm's;
   - the OpenAPI document listed Address.required as ['speaker','target','form','count'] with 'register' MISSING, so openapi-typescript would have typed it optional while NameKey.tsx / CharacterPlate.tsx / NameOrbit.tsx index into f.register unguarded;
   - models.Address(speaker=..., target=..., form=..., count=...) constructed successfully with register set to '<bound method ModelMetaclass.register>', and generating the schema emitted a third warning, PydanticJsonSchemaWarning 'Default value ... is not JSON serializable'.
   Fix: 'register: Register = Field(...)' restores required (both models now report is_required() True for every field), and the UserWarning — which has no per-field opt-out anywhere in ConfigDict; pydantic/_internal/_fields.py:334 warns unconditionally — is filtered by a message-specific warnings.catch_warnings() block around each of the two class bodies. The PydanticJsonSchemaWarning is gone too.
4. Annotations tightened: get_db() -> Iterator[sqlite3.Connection]; health() -> dict[str, bool | int | str]; chapter_text() -> dict[str, str]; 'args: tuple = ()' -> tuple[int, ...]; 'args: list = []' -> list[str]; 'args: list = [q]' -> list[str | int].
5. /addresses and /spoken-of deduplicated into _named_in_speech(db, table, speaker, target); both endpoints keep their own function names and -> list[models.Address]. CONSTRAINT CHECKED by diffing the OpenAPI document captured before and after: the '/addresses' and '/spoken-of' path objects compare EQUAL, operation ids unchanged ('addresses_addresses_get', 'spoken_of_spoken_of_get'), response_model unchanged. Live equivalence also checked against SQL: /addresses 35 rows vs 35 in the table, /spoken-of 37 vs 37, filters (speaker=alyosha&target=dmitri) return 2 and 1 rows respectively.

WHOLE-DOCUMENT OPENAPI DIFF: 21 changed lines, all three of them intended — 'register' added to Address.required; /chapters/{id}/text additionalProperties true -> {type: string}; /health additionalProperties true -> anyOf[boolean,integer,string]. Nothing else moved.

MEASURED:
- 'uv run pytest -q': BEFORE '12 passed, 4 warnings'; AFTER '12 passed, 2 warnings'. The two remaining are third-party (StarletteDeprecationWarning about httpx, anyio.abc.BlockingPortal DeprecationWarning); both register UserWarnings are gone.
- 'uv run ruff check .' -> 'All checks passed!'; 'uv run ruff format --check .' -> '5 files already formatted'. (Re-run after this bead, as atlas-pjse required of whichever landed second.)
- 'python -m atlas.ingest' against a scratch DB still reports 96 chapters / 27 characters / 49 name_forms / 35 addresses / 37 spoken_of, and the Dockerfile's literal 96-chapter assertion exits 0.
