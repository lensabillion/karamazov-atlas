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
npm test         # seven suites: corpus, rate limit, curated data, names, reading position, chat route, design system
npm run dev
```

The app runs fully without credentials. Only `/ask` calls a model. For it, add
`.env.local`:

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

Two layers, deliberately separated. There is no backend: every page is prerendered
from the committed data, and the one server route searches that data in process.

1. **Corpus (deterministic).** `scripts/parse-corpus.ts` splits the source into chapters
   with character offsets; `scripts/build-mentions.ts` builds an alias-aware mention
   index and co-occurrence edges. No LLM, fully reproducible, committed to `data/`.
2. **App (runtime).** Next.js App Router, prerendered. `/api/chat` is the only path that
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
TypeScript · Tailwind v4, configured from the design tokens.

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
| `CHAT_RATE_LIMIT` | 10 | Requests per window, per caller. Must be a positive integer; anything else is logged and the default is used |
| `CHAT_RATE_WINDOW_MS` | 60000 | Window length in milliseconds. Same rule |

There is no `.env.example` — it is gitignored deliberately. `docs/deployment-plan.md`
§11 is the reference.

## Cost controls on `/ask`

With a key set, `/api/chat` is a public unauthenticated LLM endpoint. The body is
validated before anything else reads it (`src/lib/chat-messages.ts`): roles `user` and
`assistant` only, text parts only, the reader's message first and last. A
client-supplied `system` message is a 400, not a second system prompt, and a
client-supplied tool result is dropped, not cited. Then five bounds apply. The first
four hold **per request**, across every step the model takes:

| Bound | Per request | How |
| --- | --- | --- |
| Output tokens | 8,000 | 2,000 per step, at most 4 steps |
| Input characters | 24,000 | the client's messages, measured before they are parsed |
| Retrieved text | 48,000 characters | one budget shared by `searchNovel`, `readChapter` and `listChapters`; a chapter read returns at most 24,000, so two full reads, or one and several searches |
| History length | 40 messages | |
| Rate limit | 10 per minute, per caller | per instance: a deterrent, not a cap |

The first four cap the cost of a single request no matter how many get through: what
the model sees on its last step is the system prompt, at most 24,000 characters of
history, at most 48,000 characters of retrieved text, and its own earlier steps. Once
the retrieval budget is spent, every tool returns an error telling the model to answer
from what it already has.

The rate limit keeps per-instance state, so on serverless the real ceiling is
instances × limit — a deterrent, not a hard cap on spend — and it tells callers apart
by `x-forwarded-for`, so behind no proxy (plain `next start`) every caller shares one
bucket. `src/lib/rate-limit.ts` says so in its own header. `scripts/test-chat-route.ts`
holds all of the above at the request level, without a model call.

## Deployment

Vercel, and nothing else. Runbook in `docs/deployment-plan.md`. Deploy with no
environment variables and you get a working site; set `ANTHROPIC_API_KEY` only when
`/ask` should be live, after reading the cost controls above.

## CI

`.github/workflows/ci.yml` runs on every push and pull request: typecheck, the test
suites, the drift check and a build.

One of the suites, `scripts/test-design-system.ts`, holds the stylesheets to the design
contract written at the top of `src/app/globals.css`: no undefined or dead token, no
colour outside the palette, one typeface, no literal rule weight or spacing step, and
no comment that closes early.

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
