---
title: Karamazov Atlas — Plan Spec
description: A queryable, AI-native reading surface for The Brothers Karamazov
---

> **Superseded.** This is the original spec from 6 September, kept for the record.
> The architecture it describes has since changed substantially — see
> `design-document.md` for what was actually built and `PROGRESS.md` for current state.
# Feature: Karamazov Atlas

**Date:** 2026-09-06

**Status:** Approved

## Overview

Turn the full text of *The Brothers Karamazov* (Garnett translation, 353,722 words,
93 chapters + a 3-chapter epilogue) into a queryable corpus, and build a Next.js +
Vercel AI SDK application on top of it: a data-driven mind map, a character network
derived from the text itself, a chapter reader, and a citation-backed Q&A surface.

## Goals

- Separate content from presentation. One typed corpus, many views.
- Derive facts from the 2 MB source text, not from an author's recollection.
  Every character-network edge traces to chapter positions in the file.
- Ship an app that is useful with **no API key** (browse, search, map, network)
  and gains AI features when a key is present (ask-the-novel, generated maps).
- Keep extraction a build-time batch job, never a runtime dependency.

## Non-Goals

- Not a general-purpose ebook reader.
- No vector database in v1. 96 chapters is small; lexical + structural retrieval
  with LLM reranking is sufficient and has no infra cost.
- No auth, no persistence, no multi-user state.

## Background

v0 was a single hand-authored HTML file. Its content was asserted by an author and
could not be queried, extended, or verified against the novel. The 2 MB text sat
unused beside it. This spec replaces the assertion with extraction.

## Design

### Approach

Three layers, each independently useful:

1. **Corpus (build time, deterministic).** Parse `karamazov.txt` into typed
   structure: parts → books → chapters, with character offsets into the source.
   Compute a mention index (alias-aware) per chapter. No LLM, fully reproducible.
2. **Enrichment (build time, LLM).** `generateText` + `Output.object()` with a Zod
   schema over each chapter to extract events, themes, and typed relations with
   chapter provenance. Output is committed JSON — the app never calls this at runtime.
3. **App (runtime).** Next.js App Router. Views read the committed corpus.
   The Q&A route is the only path that touches the API.

### Components

| Path | Role |
| --- | --- |
| `scripts/parse-corpus.ts` | text → `data/corpus.json` (structure + offsets) |
| `scripts/build-mentions.ts` | corpus → `data/mentions.json` (alias-aware index) |
| `scripts/extract.ts` | corpus → `data/entities.json` (LLM, needs key) |
| `src/lib/corpus.ts` | typed loaders + query helpers |
| `src/app/map` | mind map, rendered from corpus not hardcoded |
| `src/app/network` | character co-occurrence graph |
| `src/app/read` | chapter reader with mention highlighting |
| `src/app/ask` | citation-backed Q&A (`useChat`) |
| `src/app/api/chat/route.ts` | `streamText` + retrieval tool over the corpus |

### API Changes

New: `POST /api/chat`. Streams a `UIMessage` stream. Model `claude-opus-5` via
`@ai-sdk/anthropic`, adaptive thinking. Degrades to a clear "set ANTHROPIC_API_KEY"
state rather than erroring.

## Implementation Plan

### Phase 1: Corpus

- [ ] Parse parts/books/chapters with source offsets
- [ ] Alias-aware mention index (Mitya = Dmitri = Dmitri Fyodorovitch)
- [ ] Co-occurrence edges from shared chapters

### Phase 2: App shell and deterministic views

- [ ] Next.js scaffold, corpus loaders
- [ ] Chapter reader, character network, data-driven mind map

### Phase 3: AI layer

- [ ] `extract.ts` with Zod schema and chapter provenance
- [ ] `/api/chat` with a corpus retrieval tool and enforced citations

## Testing Strategy

Parser is golden-tested: chapter count must equal 93 + 3, and every chapter's
offsets must round-trip to non-empty text. Mention counts are asserted against
known values (e.g. "Alyosha" 1,245 occurrences in the raw file).

## Open Questions

- `ANTHROPIC_API_KEY` is not set in this environment. Phases 1–2 do not need it;
  Phase 3 is written and verified structurally but cannot be run until a key exists.

## References

- Source text: Project Gutenberg #28054 (Garnett, public domain)
- Format borrowed from github.com/jlevy/tbd plan-spec template
