# Karamazov Atlas API — image for Render.
#
# Build context is the REPOSITORY ROOT, not api/, because the service needs two
# things that live in different places: the Python source under api/ and the
# committed corpus under data/. Render is told this via `dockerContext: .` in
# render.yaml.
#
# The database is built during the image build, never at boot and never
# committed. data/atlas.db is gitignored precisely because it is derived: the
# same commit in produces the same database out, so the running container is
# immutable and needs no volume, no migration step and no warm-up.

FROM python:3.12-slim AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Dependencies first, so edits to source or corpus do not invalidate this layer.
COPY api/pyproject.toml /app/api/pyproject.toml
RUN pip install --no-cache-dir \
      "fastapi>=0.115" "uvicorn[standard]>=0.32" "pydantic>=2.9"

# Source is run in place rather than installed: db.py resolves its default paths
# relative to the project layout, and installing into site-packages would break
# that arithmetic. The env vars below make the paths explicit regardless.
COPY api/src /app/api/src
COPY data /app/data

ENV PYTHONPATH=/app/api/src \
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
