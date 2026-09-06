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
| `/network` | Force-directed co-occurrence graph, derived from mention data |
| `/map` | Structural mind map: parts → books → chapters |
| `/ask` | Citation-backed Q&A over the full text (AI SDK + Claude) |

## Architecture

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

## Planning

`docs/plan-spec.md` follows the plan-spec template from
[jlevy/tbd](https://github.com/jlevy/tbd).
