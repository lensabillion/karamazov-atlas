---
title: Karamazov Atlas — Design Document
description: What has been built, why each decision was made, and the proposed Python API / Next.js architecture
---
# Karamazov Atlas — Design Document

**Date:** 2026-09-07 · **Status:** Current as of PR #4 · **Author:** Lensa Billion Mudda with Claude

---

## 1. What this is

A reading instrument for Dostoyevsky's *The Brothers Karamazov*, built on the complete
text of the Constance Garnett translation (Project Gutenberg #28054, public domain).

The problem it exists to solve is documented rather than assumed. Research into what
readers actually report (`research-reader-experience.md`) found that the most cited
reason people abandon this novel is not its length or its philosophy — it is that they
cannot track who is being spoken about. Russian naming carries information English
naming does not, and English readers lose all of it.

Everything here follows from one rule: **claims must be checkable.** Numbers are
computed from the source text, and where knowledge is authored rather than computed, the
file says so.

---

## 2. Current state — measured

| | |
| --- | --- |
| Source | 349,367 words, 96 chapters, 13 book groupings (12 books + epilogue) |
| Characters tracked | 27, with 45 distinct name forms |
| Co-occurrence edges | 163 |
| Acts of address extracted | 68, from 813 of 5,866 quoted passages (14% attribution) |
| Relationship map | 24 people, 36 typed ties, 18 bond types |
| Timeline | 23 moments across 8 story segments |
| Golden tests | 15, all passing |
| Routes | 10 pages + 1 API route, 134 pages prerendered |

### Pages

| Route | Purpose |
| --- | --- |
| `/` | Corpus overview — computed statistics, book structure |
| `/read`, `/read/[id]` | All 96 chapters; names tappable, open the Name Key inline |
| `/character/[id]` | Presence across the novel, ties, densest chapters |
| `/who` | **Who these people are to each other** — the relationship map |
| `/names` | Patronymic tree, name orbits, warmth ladder |
| `/timeline` | Story time vs book time, with character lanes |
| `/timeline` | The novel as a columnar wall chart, one column per character |
| `/ask` | Citation-backed Q&A. **Never exercised — no API key.** Now rate-limited and cost-capped before it can be made public |

---

## 3. Architecture as built (TypeScript)

Three layers, deliberately separated by *when they run*.

```
karamazov.txt  (2.0 MB, public domain)
      │
      ▼  scripts/  — build time, deterministic, no network
data/corpus.json      structure + character offsets into the source
data/chapters/*.txt   96 files, one per chapter
data/mentions.json    alias-resolved mention index + co-occurrence
data/names.json       morphology, lineage, register, address data
      │
      ▼  src/lib/  — server-side loaders, memoised
      ▼  src/app/  — Next.js 16 App Router, 134 prerendered pages
```

### 3.1 Build-time scripts

| Script | Output | Notes |
| --- | --- | --- |
| `parse-corpus.ts` | `corpus.json`, `chapters/*.txt` | Splits on Gutenberg markers; records `start`/`end` offsets so any claim traces back to the source |
| `build-mentions.ts` | `mentions.json` | Alias-aware counting; co-occurrence edges |
| `build-names.ts` | `names.json` | Morphology, patronymic lineage, register, speaker attribution |
| `extract.ts` | `entities.json` | LLM enrichment. **Never run** |
| `test-corpus.ts` | — | 15 golden assertions against the real text |

### 3.2 Why offsets

Every chapter records character offsets into the normalised source. This is the
foundation of the whole "checkable" principle: any statement the app makes can be
traced to a span of the original file. It costs almost nothing and it is what separates
this from a summary.

---

## 4. Design decisions, and why

### 4.1 Alias resolution is the core of the data layer

Dostoyevsky names one person many ways. A naive `grep Mitya` returns 923 hits;
resolving Dmitri / Mitya / Dmitri Fyodorovitch / Mityenka as one person returns
**1,291**. Without this every downstream number — presence, co-occurrence, network
centrality — is wrong.

**Implementation:** aliases are matched longest-first, and each source position is
claimed once via a `Uint8Array` bitmap, so overlapping forms cannot double-count
("Dmitri Fyodorovitch" wins over "Dmitri").

**Hard-won lesson:** the alias table must be verified against the text, not trusted.
Three forms in the original table — `Mitka`, `Alyoshka`, `Ilushechka` — are real
Russian diminutives that **occur zero times in Garnett**. A fourth, `Father Paissy`,
was misspelled and matched nothing across 72 occurrences. The builder now asserts that
every declared form occurs at least once, so this class of error fails loudly.

### 4.2 The computed / curated split

This is the most important architectural boundary in the project.

| Computed | Curated |
| --- | --- |
| Mention counts, co-occurrence | Who is whose fiancée |
| Name morphology and register | Story chronology |
| Speaker attribution | Character descriptions |
| Word counts, offsets | Which ties carry the plot |

Co-occurrence can tell you Katerina and Ivan share chapters. It **cannot** tell you she
is engaged to his brother and in love with him. That is knowledge about the novel, not
a statistic, and pretending otherwise would be dishonest. Curated files
(`relationships.ts`, `timeline.ts`) state this in their header comments and carry
chapter citations wherever the text establishes a fact.

### 4.3 Register is ordinal, so it is never encoded by hue

Russian name forms sit on a scale — formal → distanced → neutral → familiar → tender.
Ordinal data must be encoded by an ordinal channel: **position, size, or opacity**.
Categorical colour is reserved exclusively for character *groups*. This is why the name
orbit uses radius, the warmth ladder uses horizontal position, and neither uses colour
to mean intimacy.

### 4.4 Explanatory diagrams are laid out by hand, not simulated

`/who` and `/timeline` use hand-placed coordinates. A force simulation arranges for
*tidiness*, and tidiness is not meaning. On the relationship map the composition is the
argument: the three mothers along the top, the four sons beneath them, the two women
below, and the lines crossing between those rows are the plot.

`/network` was the counter-example — a real force simulation, and the least useful page
in the app. It has since been removed, along with `/map`, which duplicated the overview.

### 4.5 The design system is a single documented file

`src/app/globals.css` (~750 lines) is the sole source of visual truth, opening with
eight numbered principles. Two font families (Spectral serif, Alegreya Sans), six type
sizes, two weights, one accent, one border width, one radius, a six-step space scale,
one breakpoint. Backgrounds are plain `#ffffff` / `#000000`.

Inline styles were reduced from ~200 to 4, and those four are data-computed geometry
(bar widths, sparkline heights). The rule is stated in the refactor checklist so the
exception is explicit rather than a slow leak.

---

## 5. Findings the data produced

These are results, not decoration — several overturned my own expectations.

**The patronymic reveals the family.** Grouping characters by the patronymic the text
gives them reassembles the household from grammar alone: Fyodorovitch → **Dmitri, Ivan,
Alexey, Pavel**. The fourth is Smerdyakov. The novel gives him that patronymic *exactly
once in 349,367 words* (Bk V, ch. 2), where a servant girl calls him Pavel Fyodorovitch.
The claim the plot turns on is made in a suffix, and English readers pass over it.

**The three coldest names are the three the murder runs through.** Ranking every
character by the warmest register anyone ever uses for them:

- **Fyodor** — 247 namings, never anything but "Fyodor Pavlovitch"
- **Ivan** — 765 namings, no diminutive, ever
- **Smerdyakov** — a surname 371 times, a name once

Against Dmitri, who reaches "Mityenka". The murdered father, the brother who supplied
the reasoning, and the man who did it are the three people nobody is ever warm to.

**Formality tracks ceremony, not law.** I predicted the trial would be the most formal
stretch. It is the *least* — 3% formal register for Dmitri in Book XII, against 19% in
Book V and 16% at the monastery. In court the narrator keeps saying "Mitya" while the
institution says the accused.

**Two thirds of the novel covers four days.** 229,504 of 349,367 words. Then two months
pass in a paragraph. This is why the middle of the book feels dense and why readers lose
their footing there.

---

## 6. Proposed architecture — Python API + Next.js

### 6.1 Why move the backend to Python

The current pipeline is TypeScript because the app was TypeScript. That is not a reason.

1. **The work is fundamentally NLP.** Alias resolution, morphological classification and
   speaker attribution are linguistics problems. Python owns that ecosystem — spaCy,
   NLTK, and specifically `pymorphy3` for Russian morphology, which would replace my
   hand-written suffix rules and irregulars table with a real morphological analyser.
2. **Attribution needs better tooling.** Current coverage is 14% using regex. Proper
   coreference resolution and dependency parsing could plausibly triple that, and those
   libraries are Python-only in practice.
3. **The LLM extraction is batch work.** Long-running, resumable, checkpointed jobs are
   more natural in Python than in a Next.js script.
4. **Separation of concerns.** The corpus is a dataset with a lifecycle of its own. It
   should not live inside a web framework's build step.

### 6.2 Stack

| Layer | Choice | Reason |
| --- | --- | --- |
| API | **FastAPI** | Async, and Pydantic models mirror the existing TypeScript interfaces almost one-to-one |
| Validation | **Pydantic v2** | Same schema shapes already used with Zod |
| Storage | **SQLite + FTS5** | See below |
| Migrations | **Alembic** | Corpus rebuilds are versioned rather than destructive |
| NLP | **spaCy + pymorphy3** | Replaces hand-rolled morphology |
| Packaging | **uv** | Fast, lockfile-based |
| Client types | **openapi-typescript** | FastAPI emits OpenAPI; Next consumes generated types — one source of truth |

### 6.3 Why SQLite over the current JSON files

The present `searchCorpus` reads all 96 chapter files and scans them per query. It
works at this scale and will not survive spoiler-scoped retrieval or phrase search.

SQLite with an **FTS5** virtual table over chapter text gives ranked full-text search,
phrase and proximity queries, and a `WHERE chapter_index <= :position` clause that makes
spoiler scoping a one-line filter instead of a bespoke pass. The database is a single
file, versioned in git or rebuilt by one command, so nothing about deployment gets
harder.

### 6.4 API surface

```
GET  /health

GET  /corpus                          metadata + counts
GET  /chapters                        list; ?book= ?part=
GET  /chapters/{id}                   metadata
GET  /chapters/{id}/text              body text
GET  /chapters/{id}/mentions          who is present, with counts

GET  /characters                      list with totals
GET  /characters/{id}                 detail
GET  /characters/{id}/presence        per-chapter counts
GET  /characters/{id}/ties            co-occurrence edges

GET  /names                           all forms, registers, lineages
GET  /names/{character_id}            one character's forms
GET  /names/lineages                  patronymic → children
GET  /addresses                       who calls whom what; ?speaker= ?target=

GET  /relationships                   curated people + ties
GET  /timeline                        curated segments + moments

GET  /search?q=&limit=&before=        FTS5. `before` = spoiler scope
GET  /entities/{chapter_id}           LLM extraction output
POST /jobs/extract                    trigger batch extraction
```

Everything except `/jobs/extract` is a read. The API is stateless and cacheable.

### 6.5 What moves and what stays

**Moves to Python:** all five build scripts, the retrieval logic in `src/lib/corpus.ts`,
and the LLM extraction batch job.

**Stays in Next.js:** every page and component, the design system, and — deliberately —
**the `/api/chat` route**.

That last one is a real decision. The chat route uses the Vercel AI SDK's streaming into
`useChat`, which is tightly coupled to the Next runtime and gives good streaming UX for
free. Moving it to Python would mean reimplementing SSE plumbing for no gain. Instead
the Next route keeps `streamText`, and its `searchNovel` tool calls the Python
`/search` endpoint over HTTP. **Python owns the data; Next owns the streaming.**

### 6.6 Layout

```
karamazov-atlas/
├── api/                        Python service
│   ├── pyproject.toml
│   ├── src/atlas/
│   │   ├── main.py             FastAPI app
│   │   ├── models.py           Pydantic schemas
│   │   ├── db.py               SQLite + FTS5
│   │   ├── routers/            corpus, characters, names, search, …
│   │   └── pipeline/           parse, mentions, names, attribution, extract
│   ├── data/atlas.db
│   └── tests/                  ports the 15 golden tests to pytest
├── web/                        the existing Next.js app
│   └── src/lib/api.ts          generated client
└── docs/
```

### 6.7 Migration path

Sequenced so the app never breaks.

1. **Stand up the API against existing data.** FastAPI reads today's JSON files and
   serves them unchanged. No behaviour changes; the contract gets proven first.
2. **Port the golden tests to pytest.** All 15 must pass against the Python service
   before any pipeline code is rewritten. They are the safety net for everything after.
3. **Port the pipeline**, script by script, verifying each output is byte-identical to
   the TypeScript version before deleting it.
4. **Introduce SQLite + FTS5**, keeping JSON export so nothing else has to change at once.
5. **Point Next at the API.** Replace `src/lib/*.ts` loaders with the generated client.
   Static generation still works — it just fetches at build time.
6. **Upgrade the linguistics.** Only now swap hand-rolled morphology for `pymorphy3` and
   regex attribution for spaCy, measuring the improvement against the golden tests.

Steps 1–2 are safe and reversible. Step 6 is where the real gain is, and it is last on
purpose.

### 6.8 Tradeoffs, stated honestly

- **Two runtimes instead of one.** Local development now needs Python *and* Node. This
  is the real cost.
- **Static generation gets a dependency.** Prerendering 134 pages currently reads local
  files; it would call a service that has to be running at build time.
- **Latency for `/read`.** Chapter text over HTTP is slower than a local read. Mitigated
  by static generation, which fetches once at build.

None is severe, and the NLP gain is worth them. But if the linguistics were *not* going
to improve, this migration would not pay for itself — and that is the honest test.

---

## 7. Known gaps

- **`/ask` has never made a model call.** Written against AI SDK v7, typechecks, builds,
  never exercised. `ANTHROPIC_API_KEY` was absent for the whole build. (`atlas-3mzp`)
- **`extract.ts` has never been run.** `data/entities.json` does not exist. (`atlas-94i4`)
- **Attribution coverage is 14%.** Stated on `/names` rather than hidden.
- ~~`/network` and `/map` should go.~~ **Done** — both removed (`atlas-qfm7`).
- **No portraits.** Requested, but image generation is unavailable; character cards or
  procedural emblems are the honest alternatives.
- **The API key was exposed** in this session's transcript and must be rotated.

## 8. Open beads

| Bead | |
| --- | --- |
| `atlas-e56i` | Epic — the Case File |
| `atlas-3mzp` | Verify `/api/chat` end to end |
| `atlas-94i4` | Run the extraction pipeline |
| `atlas-fn3v` | Reading position as first-class state |
| `atlas-sto5` | Who says this — ideas attributed to speakers |
| `atlas-z9ro` | The momentum layer (anti-abandonment) |
| `atlas-qfm7` | Consolidate the surface |
| `atlas-o9w6` | The verdict mechanic |
| `atlas-ghbn` | Translation brief |

---

## 9. References

- `research-book-representation.md` — how books have been represented
- `research-reader-experience.md` — what real readers report
- `plan-spec.md` — the original spec (tbd template)
- `design-refactor.md` — design-system application checklist
