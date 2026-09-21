---
type: is
id: is-01m2y13c1jg04xhgaxy7fmxn1m
title: "Repo cleanup: modern Python/uv toolchain, dead code, and a documented design system"
kind: epic
status: closed
priority: 1
version: 10
labels:
  - cleanup
dependencies: []
child_order_hints:
  - is-01m2y13t337yw958n5h645g2k9
  - is-01m2y141pyfrr8cqpts9zhv66f
  - is-01m2y14fenpp3hbv5qyps5e27p
  - is-01m2y14qbr9w7t624rp7ps6e8g
  - is-01m2y15msgwbxmcs81fgmqs07e
  - is-01m2y15q46c9qcythwqg5h3rcb
  - is-01m2y181rxg9krbf2qb57fa155
created_at: 2026-09-19T23:47:50.961Z
updated_at: 2026-09-21T22:08:24.530Z
closed_at: 2026-09-21T22:08:24.530Z
close_reason: null
resolution: null
duplicate_of: null
---
A single cleanup pass over the whole repository, from an audit run on 20 Sep 2026.

Baseline before any change (so every claim below is measured, not assumed):
- Frontend: `npm run typecheck` clean; `npm test` — 6 suites, all pass.
- Backend: `pytest -q` — 12 passed, 4 warnings.

What the audit found, by area:

PYTHON TOOLCHAIN. The API declares `requires-python = ">=3.12"` but nothing
pins or locks it. There is no `uv.lock`, no `.python-version`, and CI installs
with `pip install -e ".[dev]"`. The local venv is 3.14 while CI is 3.12, so
local and CI are not the same interpreter and nobody would know. The Dockerfile
repeats the dependency list as a literal `pip install "fastapi>=0.115" ...`,
duplicating pyproject.toml with nothing to keep the two in step. Project rule
(python-modern-guidelines) is uv for everything.

PYTHON SOURCE. `models.Edge` is defined and referenced nowhere. Every module
carries `from __future__ import annotations`, which does nothing on >=3.12.
Loose annotations (`-> dict`, `args: tuple = ()`, `args: list = []`) and an
unannotated `get_db()`. Two live Pydantic warnings: field `register` shadows a
BaseModel attribute in `NameForm` and `Address`. No linter or formatter at all.

TYPESCRIPT. Dead exports: `EXCLUDED_STUDIES` (collage-studies.ts) and
`REGISTER_ORDER` (names.ts) are defined and never read anywhere. `PASSAGE_KEY`
and `forMatch` (passage.ts) and `COLLAGE_STUDIES` are exported but used only
inside their own module.

DESIGN SYSTEM. Mostly sound already, with specific leaks: `--rule` is defined
five separate times in five files with the identical value instead of once;
`plate.css:171` hardcodes `rgba(43, 36, 29, 0.35)`, a colour that is not in the
palette at all; `--tracking-wide` is declared and never used; rule weights
(1px/2px/3px double) are repeated as literals across every stylesheet. Nothing
mechanically enforces any of this, so the next drift is silent.

Done when: uv is the only Python toolchain in the repo and CI proves it, ruff
gates the API, no dead code remains, every colour and rule weight is a token,
globals.css documents the contract in full, and an automated check fails the
build if a stylesheet breaks it. Baseline tests must still pass.

## Notes

All seven children closed. Final gate run once on ee65100, the exact tree the PR
carries. Each step recorded its own exit code, with no pipe in front of it.

FRONTEND
  npm run typecheck   exit 0
  npm test            exit 0. 7 suite trailers, 178 ok lines, 0 FAIL. Design
                      guard 8/8.
  npm run test:drift  exit 0. 0 files changed under data/.
  npm run build       exit 0. 136/136 static pages.
BACKEND (from a deleted .venv, as CI runs it)
  uv sync --locked    exit 0
  ruff check / format "All checks passed!" / "5 files already formatted"
  atlas.ingest        exit 0
  pytest -q           12 passed, 2 warnings. Both are third-party; the two
                      warnings that were ours are gone.
IMAGE (ee65100)
  docker build        exit 0. The build-time assertion found 96 chapters.
  container           /health 96 chapters; /search puts b05-c05 first;
                      Python 3.14.7; pytest ABSENT (--no-dev); /addresses
                      carries register.
GUARD
  28/28 mutations on HEAD. Each fails exactly its named check or passes
  cleanly, including the real regression that check 8 exists for.

Measured, not assumed: the CSS change is equivalent everywhere except the one
deliberate leader colour. Static proof: 7 of 8 stylesheets are identical after
resolving tokens. Runtime: 12 of 13 targeted values are identical, and the 13th
is correctly overridden by an older context rule. The implementing agent also
compared 5,862 elements before and after.

Filed along the way: atlas-w8zq (radius), atlas-ueak (pre-existing contract
breaches), atlas-ljh6 (unused models; resolved in a separate session, on
atlas-ljh6/drop-unused-name-models, stacked here, merges cleanly), atlas-sqda
(models.py docstring).

Not verifiable before pushing: CI on GitHub.
