---
title: Progress Log
description: Running record of what has been built, what the reviews changed, what is solved, and what is next
---
# Progress Log

**Living document. Append, do not rewrite.** Last updated 2026-09-08.

Ground truth for work items is tbd (`tbd list`). This file explains the *why* and
the *state*; the beads carry the detail.

---

## 1. Stage of change — where the project is

| Stage | Status | Evidence |
| --- | --- | --- |
| 1 · Corpus pipeline | **Done** | 96 chapters, 349,367 words, offsets into source |
| 2 · Derived data | **Done, corrected** | Shared span matcher; datasets now agree |
| 3 · Design system | **Done (v2 + Tailwind)** | `docs/design-system.md`, two fonts, two colours |
| 4 · Reader surfaces | **Partial** | `/read` `/who` `/names` `/timeline` built; identity thin |
| 5 · AI layer | **Unproven** | `/ask` has never made a model call |
| 6 · Python API | **Prototype only** | 11 tests pass; app does not consume it |
| 7 · Illustrated memory atlas | **Not started** | `atlas-t72d`, the actual product goal |

---

## 2. What has been built

| Area | What exists |
| --- | --- |
| Corpus | `parse-corpus.ts` → 96 chapters with character offsets into the source |
| Counting | `lib/match.ts` — one span matcher shared by every derived dataset |
| Names | Morphology, register ladder, patronymic lineage, 46 forms |
| Relationships | 24 people, 36 typed ties, hand-laid diagram |
| Timeline | Columnar wall chart, 36 spans, book-time heights |
| Design | Fraunces + DM Sans, blue + teal, shape-encoded categories |
| API | FastAPI + SQLite/FTS5, 11 passing tests |
| Tests | 15 TypeScript golden checks, 11 Python |

---

## 3. What the Codex review changed

Review: `docs/reviews/2026-09-08-visual-memory-review.md`. Ten findings; eight addressed
in commit `677217b`.

| ID | Finding | State | What changed |
| --- | --- | --- | --- |
| R1 | Product optimises for the wrong reader | **Open** | Scoped by the review itself as follow-up (`atlas-t72d`) |
| R2 | Name data presented as proof of love | **Fixed (copy)** | Claims rewritten as description; pattern marked as a reading. Attribution model still counts mentions as addresses |
| R3 | Two counting systems disagreed | **Fixed** | Shared matcher; Dmitri 1434→1294, Katerina 459→287, Paissy 0→73. Assertions added |
| R4 | `npm run corpus` silently did nothing | **Fixed** | Entry guard removed by extracting the shared table; all three builders run |
| R5 | Timeline taught a false fact | **Fixed** | Ivan goes to **Moscow**, not Tchermashnya; suicide terminates at start of trial; sources added |
| R6 | Name Key opened off-screen | **Fixed** | Docked panel, `role="dialog"`, focus, Escape. Verified at top 366 (was −7535) |
| R7 | Diagrams illegible on phones, no keyboard | **Fixed** | min-width + scroll; labels 3.6px → 9.4px; Enter/Space activation |
| R8 | Evidence not navigable | **Partial** | Timeline spans now carry chapter + cite; relationship citations still plain text in the wrong button |
| R9 | Tests overstate what is validated | **Partial** | Misleading Zossima assertion corrected; coverage now derived from data. Fresh-generation tests still missing |
| R10 | Architecture claims unsupported | **Fixed** | "JSON cannot" retracted as false; README routes corrected; real bead IDs |

### The three that mattered most

**R4 was the worst.** The documented regeneration command had been exiting successfully
without rebuilding anything, because the entry-point guard compared a percent-encoded
URL against a raw path — and this project's folder has spaces in it. Every downstream
number was stale. Fixed by removing the need for a guard at all.

**R3 was a correctness bug I had shipped and quoted.** Two builders counted overlapping
aliases independently, so a full name counted again as its short form. I had publicly
cited both 1,294 and 1,434 for Dmitri without noticing they came from different files.

**R5 was a factual error being taught as fact.** The timeline said Ivan takes the train
to Tchermashnya. He refuses Tchermashnya and goes to Moscow. That inverts the meaning
of his departure.

---

## 4. What I struggled with

Recorded because the pattern matters more than the individual bugs.

**Verification that lies.** Three separate times a check reported something false and I
nearly acted on it:

1. **Memoised loaders** (`atlas-arat`) — a screenshot showed corrected data as still
   wrong because the dev server held the first parse. I almost re-fixed a working fix.
2. **A hidden browser pane** — my overflow check reported the body scrolling sideways.
   `clientWidth` was 0, so *everything* trivially overflowed. Meaningless reading.
3. **Wrong file probed** — I grepped `/_next/static/css/` for Tailwind tokens, but the
   path is `/_next/static/chunks/`. I was probing the HTML page and concluding the
   tokens were missing.

The lesson: a failing check is not evidence until the check itself is verified. Each
time, the honest move was to question the instrument.

**Silent regex failures.** The attribution extractor reported success while matching
nothing, because `\b` inside a template literal is the backspace character. Only caught
because a prototype had found 827 matches and the port found 0.

**Claims outrunning data.** R2 is the sharpest criticism and it is correct. I built a
real measurement — register of address — and described it as emotional warmth. The
measurement was sound; the sentence on top of it was not.

---

## 5. Solved

- Corpus parsing with source offsets, 15 golden tests
- Alias resolution, single-claim span matching, cross-dataset agreement asserted
- Patronymic lineage (the Fyodorovitch → four sons recovery)
- Design system v2, applied; category by shape not colour
- Relationship map with 24 people and typed ties
- Columnar timeline with sourced spans
- Name Key docked, focusable, keyboard-dismissible
- Charts legible and scrollable on phones; diagrams keyboard-operable
- Python API prototype with FTS5 and spoiler-scoped search
- Tailwind v4 wired to the design tokens

## 6. Next

Ordered. Ground truth in tbd.

| Order | Bead | Why now |
| --- | --- | --- |
| 1 | `atlas-w56r` | Attribution still treats a mentioned person as an addressee. Data, not copy |
| 2 | `atlas-arat` | Stale-cache bug makes every future verification untrustworthy |
| 3 | `atlas-4iaj` (R8) | Evidence must be reachable from every claim |
| 4 | `atlas-30o1` / `atlas-83bt` | Fresh-generation tests, then CI |
| 5 | `atlas-t72d` (R1) | The actual product goal: an illustrated sequence, not a dashboard |
| 6 | `atlas-3mzp` | `/ask` has still never made a model call |

## 7. Known-unfinished, stated plainly

- `/ask` has never run. `extract.ts` has never run; `entities.json` does not exist.
- The Python API is a prototype the app does not use.
- Tailwind is wired to the tokens but components still use semantic classes by
  design; only `Nav` uses utilities so far.
- Attribution coverage is 14% **and** imprecise. Precision before coverage.
- The API key used earlier in this project was exposed in a transcript and should be
  rotated.

---

## Changelog

| Date | Change |
| --- | --- |
| 2026-09-08 | Tailwind v4 wired to design tokens; this log created |
| 2026-09-08 | Codex review R2–R7, R9, R10 addressed (`677217b`) |
| 2026-09-08 | Timeline rebuilt as columnar wall chart |
| 2026-09-08 | Design system v2; `/map` and `/network` removed |
| 2026-09-08 | Python API + SQLite/FTS5 prototype; internal review |
| 2026-09-07 | Name Key: morphology, lineage, orbits, register ladder |
| 2026-09-07 | Reader research; representation research |
| 2026-09-06 | Corpus pipeline, app scaffold, first design system |

## 8. Who’s Who interaction and spacing refresh

Implemented for `atlas-tox3`, starting from `b207385`, in response to the user's
request to improve `/who` UI/UX, padding, margins, and representation.

- Replaced the floating identity card with a persistent profile and a focused
  connection view. The whole-cast diagram remains an alternate view; selecting a
  node opens that person's connection cards.
- Added family shortcuts, an accent-insensitive name/nickname search, circle
  filtering, an empty state, and a collapsible cast directory on phones.
- Grouped multiple bonds onto one person card without reversing their direction.
  Disputed and plot-critical ties have text labels as well as color. Existing
  literary descriptions and relationship data were preserved.
- Turned existing relationship citations into separate chapter links, using the
  actual corpus citation index. Uncited claims still need editorial sourcing; this
  does not close the broader R8 evidence work.
- Added scoped layout styles that reuse v3 tokens. The phone navigation no longer
  forces page overflow; connection cards remain readable instead of shrinking an
  entire SVG. No new dependencies or corpus regeneration were required.

Validation: typecheck and all existing corpus tests pass, alongside the new
`scripts/test-relationship-view.ts` checks for direction, grouping, search, filters,
and valid citation destinations. The tests are included in `npm test`.

Browser checks covered 320px, 390px, 820px, and desktop widths. At 390px, page width
is 390px and relationship copy is 14px; the whole-cast diagram scrolls inside a
356px panel without widening the page. Search for `adelaida` finds Adelaïda;
keyboard activation moves focus to the visible profile; selecting Smerdyakov from
the overview opens both his disputed parentage and murder relationships; the
Book XI chapter 8 link opens the correct chapter.

`npm run build -- --webpack` passes with 132 generated pages. The default Turbopack
build fails in this environment when its CSS worker tries to bind a port
(`Operation not permitted`), including on an escalated retry. The project default
was not changed to hide that limitation. Application changes remain local; TBD
remote synchronization was not retried after its earlier permission rejection.

## 9. Names page layout refresh — 2026-09-09

Implemented for `atlas-5oeh` to improve `/names` alignment, margins, padding, and
navigation while preserving its typography.

- Aligned the introduction and section headers on a consistent two-column grid,
  with stacked layouts on smaller screens and three in-page section shortcuts.
- Standardized orbit card spacing, captions, and headers. Removed the inherited
  900px chart minimum from the 560px name diagrams, which had widened the page.
- Kept diagrams at readable native sizes with contained horizontal scrolling on
  phones. The mobile navigation wraps without creating page-level overflow.
- Moved recorded-speaker metadata into expandable name-form lists, retaining the
  existing names, counts, registers, and speaker data. Separated the interpretation
  note from the comparison chart with a padded panel.
- Preserved existing font declarations and literary content. Computed font family,
  size, weight, line height, and letter spacing matched before and after for the
  title, introduction, section headings, muted copy, captions, and sampled SVG text.

Validation: typecheck, all corpus and relationship tests, and the Webpack production
build pass (132 generated pages). Browser checks found no page-level horizontal
overflow at 320px, 390px, 820px, and 1440px. At desktop width, the page previously
overflowed to 1629px and now stays within 1440px. Section navigation reaches the
intended headings, and the name-form disclosure opens with its recorded data.
No dependencies or corpus data were changed. Changes and TBD tracking remain local;
the previously documented default-build and remote-sync limitations still apply.
