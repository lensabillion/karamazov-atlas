# Karamazov Atlas

A queryable atlas of Dostoyevsky's *The Brothers Karamazov*, built from the full text
of the Constance Garnett translation (Project Gutenberg #28054, public domain).

349,367 words across 96 chapters, parsed into a typed corpus. Every number in the app
is computed from that file — nothing is asserted from memory.

## Quick start

```bash
npm install
npm run corpus   # parse karamazov.txt -> data/ (deterministic, no API key)
npm run test     # 15 golden checks against the real text
npm run dev
```

The app runs fully without credentials. Only `/ask` and `npm run extract` call a model.
For those, add `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-...
```

## What's here

| Route | What it does |
| --- | --- |
| `/` | Corpus overview — mention counts, book structure |
| `/read` · `/read/[id]` | All 96 chapters, with character mentions highlighted |
| `/character/[id]` | Per-character presence across the novel, ties, densest chapters |
| `/who` | Who the characters are to each other — the relationship map |
| `/timeline` | The novel as a columnar wall chart, one column per character |
| `/names` | Patronymic lineage, name orbits, register ladder |
| `/ask` | Citation-backed Q&A over the full text (AI SDK + Claude) |

## Architecture

> **Implemented vs proposed.** Everything below under "three layers" is built and
> running. The Python service in `api/` is a **prototype**: it ingests the JSON the
> TypeScript pipeline produces and serves it over FastAPI with SQLite/FTS5, and its
> 11 tests pass — but the Next.js app does not read from it, and the chat route does
> not call it. Treat it as a proven contract, not as the live data path. Any decision
> to migrate should be benchmarked against the current TypeScript path first, which
> already filters and ranks results.


Three layers, deliberately separated:

1. **Corpus (deterministic).** `scripts/parse-corpus.ts` splits the source into chapters
   with character offsets; `scripts/build-mentions.ts` builds an alias-aware mention
   index and co-occurrence edges. No LLM, fully reproducible, committed to `data/`.
2. **Enrichment (batch, LLM).** `scripts/extract.ts` uses `generateText` + `Output.object`
   with a Zod schema to pull events, typed relations and themes per chapter. Resumable,
   writes as it goes. Output is committed — the app never runs this at request time.
3. **App (runtime).** Next.js App Router. `/api/chat` is the only path that touches the
   API; it gives Claude three tools over the corpus (`searchNovel`, `readChapter`,
   `listChapters`) and requires book/chapter citations.

### Why aliases matter

Dostoyevsky names one person many ways. A naive `grep Mitya` finds 923 hits; resolving
Dmitri / Mitya / Mitka / Dmitri Fyodorovitch as one person finds 1,291. Aliases are
matched longest-first and each source position is claimed once, so overlapping names
can't double-count.

## Stack

Next.js 16 · React 19 · AI SDK 7 (`@ai-sdk/anthropic`, model `claude-opus-5`) · Zod 4 ·
TypeScript. No CSS framework; the palette is drawn from Russian icon pigments and each
hue is assigned to a character group so colour carries information.

## Configuration

Every variable is optional. 131 of the 132 pages are prerendered from committed
data and need none of them.

| Variable | Absent | Present |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | `/ask` shows a notice; nothing else changes | `/ask` is live |
| `ATLAS_API_URL` | Retrieval uses the local corpus scan | Retrieval uses the API's FTS5 index |
| `CHAT_RATE_LIMIT` | 10 | Requests per window, per caller |
| `CHAT_RATE_WINDOW_MS` | 60000 | Window length |

Backend variables (`ALLOWED_ORIGINS`, `ATLAS_DB_PATH`, `ATLAS_DATA_DIR`) are set in
Render; `render.yaml` supplies the last two.

There is no `.env.example` — it is gitignored deliberately. `docs/deployment-plan.md`
§11 is the reference.

## Cost controls on `/ask`

With a key set, `/api/chat` is a public unauthenticated LLM endpoint. Four bounds
apply, in order of what they actually guarantee:

| Bound | Value |
| --- | --- |
| Output tokens | 2,000 |
| Input characters | 24,000 |
| History length | 40 messages |
| Rate limit | 10 per minute, per caller |

The first three cap the cost of any single request. The fourth keeps per-instance
state, so on serverless the real ceiling is instances × limit — a deterrent, not a
hard cap on spend. `src/lib/rate-limit.ts` says so in its own header.

## Deployment

Backend on Render, frontend on Vercel. Full runbook in `docs/deployment-plan.md`.

**Order matters.** Each platform needs the other's URL, and you break the cycle on
the frontend, because the frontend works with no backend at all:

1. Deploy to **Vercel** with no environment variables. You get a working site.
2. Deploy to **Render** from `render.yaml`; set `ALLOWED_ORIGINS` to the Vercel origin.
3. Return to Vercel and set `ATLAS_API_URL` to the Render URL.

The Docker image builds the database into itself and fails unless it contains exactly
96 chapters, so a bad corpus never reaches a reader.

## CI

`.github/workflows/ci.yml` runs on every push and pull request: typecheck, the test
suites, a build, and the Python tests.

It also regenerates the derived data and fails if it differs from what is committed.
That check exists for a specific reason — `npm run corpus` once silently rebuilt
nothing for weeks while every test still passed, and every derived number went stale.

## Planning

`docs/plan-spec.md` follows the plan-spec template from
[jlevy/tbd](https://github.com/jlevy/tbd).

The [September 8 visual-memory review](docs/reviews/2026-09-08-visual-memory-review.md)
assesses the project against the returning-reader illustration goal and links
verified findings to TBD follow-up work.
