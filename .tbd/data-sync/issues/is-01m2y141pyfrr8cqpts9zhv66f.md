---
type: is
id: is-01m2y141pyfrr8cqpts9zhv66f
title: "Cleanup: gate the Python API with ruff lint and format"
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
created_at: 2026-09-19T23:48:13.149Z
updated_at: 2026-09-20T00:03:05.887Z
closed_at: 2026-09-20T00:03:05.887Z
close_reason: null
resolution: null
duplicate_of: null
---
The API has no linter and no formatter. Add ruff (the project's Python rules
call for it) and make CI enforce it, so style is decided once instead of per
diff.

1. `[tool.ruff]` in api/pyproject.toml: `target-version = "py314"` matching the
   requires-python floor set by atlas-gdde, `line-length = 100`.
2. Select a rule set that catches real defects rather than taste: E/W
   (pycodestyle), F (pyflakes — unused imports and names), I (import order),
   UP (pyupgrade — flags exactly the legacy syntax this cleanup removes, and
   under py314 it flags more of it), B (bugbear), SIM, RUF. Add ruff to the dev
   dependency group.
3. Fix every finding. If a rule has to be silenced, silence it narrowly with a
   `# noqa: RULE` and a reason on the line — never a blanket per-file ignore.
4. CI: `uv run ruff check .` and `uv run ruff format --check .` in the api job,
   before the tests, so a style failure is legible as a style failure.

Note the interaction with the sibling modernization bead: ruff's UP rules will
themselves flag `from __future__ import annotations` under py314. Whichever
lands second must re-run the other's check.

Verify: `uv run ruff check .` and `uv run ruff format --check .` both clean;
`uv run pytest -q` still 12 passed.

## Notes

Verified on 2026-09-20 with ruff 0.16.8 (installed via the dev group).

- api/pyproject.toml: [tool.ruff] target-version = "py314", line-length = 100; [tool.ruff.lint] select = ["E", "W", "F", "I", "UP", "B", "SIM", "RUF"]. select lives under [tool.ruff.lint] because a bare [tool.ruff] select is deprecated in current ruff. ruff>=0.14 added to [dependency-groups] dev; uv.lock re-resolved, 29 -> 30 packages.
- CI api job: two new steps, 'uv run ruff check .' and 'uv run ruff format --check .', placed after install and before the database build and the tests.

FINDINGS AND FIXES (no noqa needed, no per-file ignores):
- Before: 'ruff check .' -> 'Found 2 errors. [*] 1 fixable'.
  1. F401 src/atlas/main.py:16 — 'from contextlib import asynccontextmanager' unused. Removed; nothing in the module referenced it.
  2. E741 tests/test_api.py:55 — ambiguous name 'l' in the lineage comprehension. Renamed to 'ln'.
- Before: 'ruff format --check .' -> '2 files would be reformatted, 3 files already formatted' (src/atlas/main.py, src/atlas/ingest.py; both had argument lists packed several per line). Applied 'ruff format .': '2 files reformatted, 3 files left unchanged'.

AFTER:
- 'uv run ruff check .' -> 'All checks passed!' (0 findings), exit 0.
- 'uv run ruff format --check .' -> '5 files already formatted', exit 0.
- 'ATLAS_DB_PATH=.../data/atlas.db uv run pytest -q' -> 12 passed, 4 warnings.
- 'uv lock --check' and 'uv sync --locked' both exit 0 after adding ruff.
