# Karamazov Atlas

An illustrated companion to Dostoyevsky's *The Brothers Karamazov*, built from the full
text of the Constance Garnett translation (Project Gutenberg #28054, public domain) and
written first for readers who have finished it. A reader part-way through can set their
place in the running head and everything past it folds away.

349,367 words across 96 chapters, parsed into a typed corpus. Every count is computed
from that file; every curated claim — a tie on the map, a block on the timeline — opens
the chapter, and usually the paragraph, that supports it.

## Quick start

```bash
npm install
npm run corpus   # parse karamazov.txt -> data/ (deterministic, no API key)
npm test         # six suites: corpus, rate limit, curated data, names, API client, reading position
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
| `/` | A title page, then an illustrated book of people and scenes (Grigoriev's cycle and labelled studies) |
| `/characters` · `/character/[id]` | The cast; each person's plate, name forms, presence and chapters |
| `/who` | The relationship map. Every tie opens its chapter; claims and readings are labelled as such |
| `/timeline` | The novel as a columnar wall chart, one column per character, each block citing its chapter |
| `/names` | Patronymic lineage, name orbits, how far each person's naming relaxes |
| `/read` · `/read/[id]` | All 96 chapters, each with a spoiler-free note on why it is there; names open the Name Key |
| `/translations` | The five English translations, what Garnett costs this atlas, a spelling concordance |
| `/ask` | Citation-backed Q&A over the text, scoped to the reader's place (AI SDK + Claude) |

## Architecture

> **Implemented vs proposed.** Everything below under "three layers" is built and
> running. The Python service in `api/` ingests the JSON the TypeScript pipeline
> produces and serves it over FastAPI with SQLite/FTS5 (12 tests). One thing reads
> from it: when `ATLAS_API_URL` is set, `/api/chat`'s search tool uses its FTS5 index,
> falling back to the local BM25 search when it is unset or unreachable. The pages do
> not read from it; they are prerendered from the committed JSON. The pipeline itself
> stays in TypeScript — see `docs/design-document.md` §6 and atlas-gc9d for why.


Three layers, deliberately separated:

1. **Corpus (deterministic).** `scripts/parse-corpus.ts` splits the source into chapters
   with character offsets; `scripts/build-mentions.ts` builds an alias-aware mention
   index and co-occurrence edges. No LLM, fully reproducible, committed to `data/`.
2. **Enrichment (batch, LLM).** `scripts/extract.ts` uses `generateText` + `Output.object`
   with a Zod schema to pull events, typed relations and themes per chapter. Resumable,
   writes as it goes, logs token usage, and drops any "verbatim" quote that is not in
   the chapter. Output is committed to `data/entities.json` — the app never runs this
   at request time.
3. **App (runtime).** Next.js App Router, prerendered. `/api/chat` is the only path that
   calls a model; it gives Claude three tools over the corpus (`searchNovel`,
   `readChapter`, `listChapters`), requires book/chapter citations, and limits all
   three to the reader's place when one is set.

Curated knowledge — who is what to whom, the timeline, why each chapter is there — is
written by hand in `src/lib/relationships.ts`, `timeline.ts` and `orientation.ts`, and
`scripts/test-curated.ts` checks every chapter reference and every quoted phrase
against the text.

### Why aliases matter

Dostoyevsky names one person many ways. A naive `grep Mitya` finds 911 hits; resolving
Dmitri / Mitya / Mityenka / Dmitri Fyodorovitch as one person finds 1,294. Aliases are
matched longest-first, across line breaks, and each source position is claimed once,
so overlapping names can't double-count.

## Stack

Next.js 16 · React 19 · AI SDK 7 (`@ai-sdk/anthropic`, model `claude-opus-5`) · Zod 4 ·
TypeScript · Tailwind v4, configured from the design tokens. FastAPI + SQLite/FTS5 for
the optional API.

The app is set as the 1912 Heinemann edition the text comes from: one family (Old
Standard TT), four colours taken from the book, letterspaced capitals, paired rules.
Character groups are told apart by shape, not hue. Specification:
`docs/design-system.md`; working checklist: `.claude/skills/first-edition/SKILL.md`.

## Configuration

Every variable is optional. Every page but `/api/chat` is prerendered from committed
data and needs none of them.

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

Work is tracked as tbd beads (`tbd list`); `docs/PROGRESS.md` explains the state and
the why. `docs/plan-spec.md` (superseded, kept for history) follows the plan-spec
template from [jlevy/tbd](https://github.com/jlevy/tbd).

The [September 8 visual-memory review](docs/reviews/2026-09-08-visual-memory-review.md)
assesses the project against the returning-reader illustration goal and links
verified findings to TBD follow-up work.
