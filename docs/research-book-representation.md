---
title: How books have been represented — and what nobody has built
description: Survey of literary visualisation, study tools, and reading companions, with a recommended direction for the Karamazov Atlas
---
# Research: Representing a Complex Novel

**Date:** 2026-09-07

**Status:** Complete

**Bead:** atlas-v27c

## Overview

The Atlas currently proves the corpus works: 96 chapters parsed, characters resolved
through their aliases, a co-occurrence network, a citation-backed Q&A route. That is
infrastructure. It is not yet a *reason to care*.

This asks what people have actually built to make difficult books legible and loved,
what each approach gets right, what it costs, and where the unclaimed ground is.

## Questions

1. What are the genuinely great representations of books, and what makes them great?
2. What do they systematically fail at?
3. What is specific to *The Brothers Karamazov* that a generic tool cannot serve?
4. What has nobody built?

## Findings

### 1. Distant reading — the book as a shape

The oldest and most beautiful tradition. It treats a text as data and draws its
structure.

- **[Ben Fry, *On the Origin of Species: The Preservation of Favoured Traces*](https://www.benfry.com/traces/)**
  renders all six editions of Darwin at once, each revision colour-coded, so the text
  visibly *evolves* — form matching subject exactly. Now in the Cooper Hewitt collection.
- **[Chris Harrison & Christoph Römhild, Bible Cross-References](https://www.chrisharrison.net/index.php/Visualizations/BibleViz)**
  draws all 63,779 cross-references as arcs over a bar chart of chapter lengths. One
  image conveys interconnectedness no amount of prose could.
- **[Stefanie Posavec, *Writing Without Words*](https://www.stefanieposavec.com/archive/writing-without-words)**
  decomposes Kerouac's *On the Road* into parts → chapters → paragraphs → sentences →
  words, drawn as a "[literary organism](https://seeingdata.org/examples-visualisation/literary-organism/)"
  — a plant-like structure, hand-coloured by theme.
- **[Reagan et al., *The emotional arcs of stories*](https://arxiv.org/pdf/1606.07772)**
  (UVM Computational Story Lab) ran sentiment analysis over 1,700 texts and found six
  recurring shapes, empirically confirming
  [Vonnegut's thesis](https://www.technologyreview.com/2016/07/06/158961/data-mining-reveals-the-six-basic-emotional-arcs-of-storytelling/).
- **Character networks** are the workhorse of digital humanities — Elson et al. built
  networks from dialogue in 19th-century British novels; the
  [Project Dialogism Novel Corpus](https://nightingaledvs.com/data-is-plural-dialogism/)
  now provides 35,000+ attributed quotations across 22 novels.

**What it gets right:** reveals structure invisible at reading distance. Often
genuinely beautiful. Reproducible and honest.

**What it fails at:** it shows *shape, not meaning*. Nobody has ever loved a novel more
because they saw its co-occurrence graph. These are objects to admire, not to use —
and our `/network` page is currently sitting squarely in this tradition.

### 2. The enriched edition — the book as a performance

- **[*The Waste Land* for iPad](https://apps.apple.com/us/app/the-waste-land/id427434046)**
  (Touch Press / Faber, 2011) is still the high-water mark. Filmed performance by Fiona
  Shaw, readings by Eliot, Ted Hughes, Viggo Mortensen, manuscript facsimiles with
  Pound's edits, layered notes. It hit
  [#1 among book apps worldwide and was the UK's best-selling iPad app of any kind](https://www.100archive.com/projects/the-waste-land-ipad).

**What it gets right:** it makes a forbidding text *hospitable* without simplifying it.
The poem stays hard; you gain company.

**What it fails at:** enormous production cost, and it doesn't scale past one work.
Touch Press eventually pivoted away from the model entirely.

### 3. Study tools — the book as an exam

[LitCharts](https://www.litcharts.com/lit/infinite-jest), SparkNotes, CliffsNotes.
LitCharts does offer interactive plot/theme visualisation for texts as hard as
*Infinite Jest*.

**What it gets right:** genuinely useful, comprehensive, cheap.

**What it fails at:** it is optimised for people who must *pass*, not people who want to
*read*. It converts a novel into retrievable summary — which is precisely the thing
Dostoyevsky's novel resists, since its argument only works when you sit inside it.

### 4. Fan cartography — the book as territory

- **[Ulysses mapped for the web](https://libraries.mit.edu/news/?p=9133)** by Joe Nugent
  at Boston College, plus VR work aimed at new audiences; Bloomsday makes Dublin itself
  the interface.
- **[One man's two-year quest to map *Infinite Jest*](https://www.vice.com/en/article/sub-infinite-jest/)** —
  an obsessive hand-built diagram of a novel that defeats linear reading.

**What it gets right:** made by people who love the book, which shows. Handles
non-linear structure that summary destroys.

**What it fails at:** unmaintained, idiosyncratic, and usually only legible to people
who have *already finished* the book.

### 5. The 2025–26 wave — spoiler-aware AI companions

The newest category, and the most commercially active:
[Recall Reader](https://recallreader.com/), [BookPal](https://www.getbookpal.com/blog/best-ai-reading-companion-apps-2026),
[StoryCodex](https://storycodex.app/), [Previously On](https://www.previouslyon.app/),
and Amazon's own
["Ask this Book"](https://alternativeto.net/news/2025/12/amazon-adds-ask-this-book-to-the-kindle-ios-app-for-interactive-and-spoiler-free-qanda)
in the Kindle iOS app.

The shared mechanic: **scope every answer to the reader's current position.** Tap a
name, get who they are *as of chapter 12* and no further. TV-style "previously on"
recaps. Chat that cannot spoil.

**What it gets right:** solves a real, specific pain — and see §6, because for this
novel that pain is acute.

**What it fails at:** it is the *same product for every book*. Nothing about it knows
that *Karamazov* is different from a LitRPG serial. It is a generic memory prosthesis.

### 6. What is specific to this novel

Two things, and both are underserved by everything above.

**a. The names are a documented wall.** Russian naming gives every character a given
name, a patronymic, a surname, and a shifting cloud of diminutives whose formality
encodes the relationship of the speaker. Alexey appears as
[Alyosha, Alyoshka, Alyoshenka, Alyoshechka, Alexeichik, Lyosha and Lyoshenka](https://www.janetfitchwrites.com/janets-blog/2017/12/10/oh-those-names-or-how-to-read-a-russian-novel);
Janet Fitch's essay exists precisely because this stops readers cold. **We already
solved the machine half of this** — the alias resolver is why Dmitri counts 1,291
rather than the 923 a naive search returns. We have never surfaced it to a reader.

**b. The book is an argument staged as a family.** Nothing is asserted by the narrator.
Every idea is spoken by someone with a stake in it: Ivan formulates "all things are
lawful," Smerdyakov *acts* on it, Zossima answers with universal responsibility,
Alyosha lives it. And the plot is a **trial in which the legal answer and the moral
answer diverge** — Dmitri is convicted of a murder he did not commit, while Ivan, who
supplied the reasoning, walks free and mad.

No existing representation engages this. Networks show who stands near whom. Study
guides state the themes. None of them make the reader *take a position*.

## Recommendation

### The unclaimed ground: put the reader in the jury box

Build the Atlas around the novel's own central question — **not "what happens" but "who
is guilty"** — and make the reader answer it, repeatedly, as evidence accumulates.

The mechanic:

1. **You set your position in the book.** Everything is scoped to it (§5's insight,
   which is sound and worth taking).
2. **Evidence accrues as you read.** Each chapter contributes facts to a case file, from
   the corpus we already parsed, with citations to book and chapter.
3. **You return a verdict whenever you like** — on two separate questions, deliberately
   kept apart: *Who killed Fyodor Pavlovitch?* and *Who is responsible for his death?*
4. **Your verdicts are recorded over time.** At the end you are shown your own arc —
   where you changed your mind, what changed it — set against the jury's, and against
   Zossima's claim that the second question has only one answer: everyone.

Why this and not another network diagram:

- **It is the only book where this works.** The trial is not a device we impose; it is
  Books XI–XII. The divergence between legal and moral guilt *is* the novel's thesis.
- **It converts a passive artefact into an argument the reader is inside.** That is the
  "oh my god, wow" — not admiring a picture, but discovering at chapter 80 that you
  have quietly changed your own verdict, and being shown the moment it happened.
- **It serves both audiences.** Someone who has never read it gets a spoiler-safe way
  in with the names solved. Someone who has read it three times gets a mirror.
- **It is buildable on what exists.** Corpus, citations, alias resolution, retrieval and
  the extraction schema are already there. The extraction pipeline
  (`atlas-94i4`) already pulls typed relations and events with provenance — which is
  exactly the shape of an evidence record.

### Supporting features, ranked

| | Feature | Why |
| --- | --- | --- |
| 1 | **Name resolver** — tap any name, get the person, their diminutives, and who calls them what | Removes the documented #1 barrier; we already have the data |
| 2 | **Position lock** — everything scoped to where you are | Table stakes as of 2026 |
| 3 | **The evidence ledger + verdict** | The distinctive idea above |
| 4 | **"Who says this"** — each major claim tied to the character with a stake in it | Serves the book's actual structure |
| 5 | Emotional/tension arc per chapter | Cheap, attractive, well-precedented (§1) |

### What to drop or demote

The `/network` page is a §1 artefact: honest, mildly interesting, and not why anyone
would return. Keep it as a supporting view; do not build further on it.

## Open questions

- Does the verdict mechanic need accounts, or does per-browser storage suffice for v1?
- Spoiler-scoping the Q&A route means constraining retrieval by chapter index — cheap to
  add to `searchCorpus`, but it needs a deliberate default (locked or unlocked?).

## References

All linked inline above. Primary sources: Fry, Harrison, Posavec, Reagan et al. (arXiv
1606.07772), Touch Press/Faber, LitCharts, Boston College Ulysses project, and the
2025–26 companion apps.
