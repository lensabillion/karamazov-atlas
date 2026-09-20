# Karamazov Atlas API — image for Render.
#
# THIS FILE LIVES AT THE REPOSITORY ROOT ON PURPOSE.
#
# It needs two things from different places: the Python source under api/ and
# the committed corpus under data/. It was originally at api/Dockerfile with
# `dockerContext: .` in render.yaml, and Render's first build failed with
# `"/data": not found` — a Root Directory of `api` overrides the blueprint's
# context, so `data/` sat outside it and COPY could not see it.
#
# A Dockerfile at the root, built with the root as context, is unambiguous: it
# works with Render's defaults and does not depend on a dashboard setting that
# is invisible from the repository. If a build fails this way again, check that
# the service's Root Directory is EMPTY.
#
# The database is built during the image build, never at boot and never
# committed. data/atlas.db is gitignored precisely because it is derived: the
# same commit in produces the same database out, so the running container is
# immutable and needs no volume, no migration step and no warm-up.

FROM python:3.14-slim AS base

# uv comes from its own published image, which is the pattern uv documents for
# Docker. The tag pins the exact uv that replays the lockfile, so the resolver
# is as fixed as the resolution it is reading.
COPY --from=ghcr.io/astral-sh/uv:0.12.8 /uv /uvx /usr/local/bin/

# UV_COMPILE_BYTECODE precompiles the installed dependencies during the build so
# the first request does not pay for it; PYTHONDONTWRITEBYTECODE below only
# suppresses writes at run time, which is still wanted for the source that is
# run in place. UV_LINK_MODE=copy: uv's cache and the venv are not on the same
# filesystem here, so hardlinking would warn on every build. UV_PYTHON_DOWNLOADS
# =never makes the build fail loudly rather than quietly fetch a second
# interpreter if this base image ever stops being 3.14.
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PYTHON_DOWNLOADS=never

WORKDIR /app

# Fail early and legibly if the context is wrong. Without this the error is
# BuildKit's "failed to compute cache key", which says nothing about the cause.
COPY api/pyproject.toml /tmp/ctx-check-api
COPY data/corpus.json /tmp/ctx-check-data

# Dependencies first, so edits to source or corpus do not invalidate this layer.
# The versions are no longer restated here: uv.lock is the single place they are
# written down, and --locked fails the build if it and pyproject.toml have
# drifted apart, which is the whole reason to commit a lockfile. --no-dev keeps
# pytest and httpx out of the image; --no-install-project keeps this layer
# independent of api/src, which the next layer copies and which is never
# installed in any case.
COPY api/pyproject.toml api/uv.lock api/.python-version /app/api/
RUN uv sync --project /app/api --locked --no-dev --no-install-project

# Source is run in place rather than installed: db.py resolves its default paths
# relative to the project layout, and installing into site-packages would break
# that arithmetic. The env vars below make the paths explicit regardless.
COPY api/src /app/api/src
COPY data /app/data

# Putting the venv on PATH is what makes `python` and `uvicorn` below the ones
# uv installed, without wrapping every command in `uv run`.
ENV PATH="/app/api/.venv/bin:$PATH" \
    PYTHONPATH=/app/api/src \
    ATLAS_DATA_DIR=/app/data \
    ATLAS_DB_PATH=/app/data/atlas.db

# Build the SQLite database and its FTS5 index into the image.
RUN python -m atlas.ingest

# Fail the build rather than the reader if ingest produced nothing.
RUN python -c "\
import sqlite3, os, sys; \
n = sqlite3.connect(os.environ['ATLAS_DB_PATH']).execute('select count(*) from chapters').fetchone()[0]; \
print(f'chapters in image: {n}'); \
sys.exit(0 if n == 96 else 1)"

EXPOSE 10000

# Render provides $PORT; default matches its convention for local runs.
CMD ["sh", "-c", "uvicorn atlas.main:app --host 0.0.0.0 --port ${PORT:-10000}"]
