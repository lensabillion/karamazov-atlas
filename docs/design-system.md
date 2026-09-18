---
title: Karamazov Atlas — Design System
description: The app is set as a 1912 letterpress edition; this is how
---
# Design System

**Version 6 — White canvas, first-edition descriptions** · 2026-09-17 · Supersedes the two-then-four-hue
screen palette of v2/v3.

Working summary for agents: `.claude/skills/first-edition/SKILL.md` (mirrored to
`.agents/skills/`). This document is the specification; that file is the
checklist.

---

## 1. The premise

The corpus is the **1912 Heinemann edition of the Garnett translation**. The app
is set as that book: letterpress ink on cream stock, letterspaced capitals,
paired rules, centred blocks.

What is followed is the edition's **compositional convention**, which is a
period habit rather than anyone's artwork. The edition is unillustrated, so
there is nothing in it to reproduce even if that were wanted, and every device
here is drawn from scratch.

**The governing rule:** white surroundings give the artwork room; each description
remains a leaf of cream stock. The user explicitly requested this split on
17 September 2026. Typography, paired rules, ornaments and name-form composition
remain unchanged. No shadows, rounded cards or ornamental UI gradients.

---

## 2. Typeface

**One family: Old Standard TT.** There is no sans, because the edition has none —
and no second serif, because a 1912 trade book is set in one family at several
sizes. Two families was a modern habit imported into a period design.

| Token | Resolves to | Use |
| --- | --- | --- |
| `--font-display` | Old Standard TT | Titles, headings, brand, large figures |
| `--font-serif` | Old Standard TT | Text, italics, labels, data, prose |
| `--font-sans` | Old Standard TT | Alias, so stray references degrade correctly |

`--font-display` stays a separate token so display sizes can be tuned
independently — not because it is a different face.

### Why this face

The edition's type was examined rather than guessed: body pages from the actual
1912 Heinemann printing were pulled and magnified, and the letterforms are
**Modern (Didone)** — vertical stress, high contrast, fine flat unbracketed
serifs, a `y` ending in a cut rather than a ball.

An earlier version of this document specified Libre Caslon, chosen from a
photograph of a title page. That was wrong: Caslon is an Old Style with
diagonal stress and bracketed serifs, close to the opposite of what the page
shows. Old Standard TT is an explicit revival of the Modern class.

Full evidence, and the limits of the claim: `docs/typeface-identification.md`.

**Say "set in the Modern style of the 1912 edition."** It is a class match, not a
face match, and the 1880 Moscow first printing is a different object entirely.

Labels are **letterspaced capitals of the text face**, as the period set them —
not a second family at small size.

### The tracking rule

Letterspacing adds a trailing space after the final letter, which the eye reads
as a margin and pulls a centred block off-axis. Every letterspaced run therefore
carries a matching `text-indent`:

```css
letter-spacing: 0.22em;
text-indent: 0.22em;
text-transform: uppercase;
```

### Scale

Six sizes, `--text-xs` (12px) through `--text-xl` (44px). There is no seventh.
Weights: 400 and 600. Emphasis comes from **tracking, size and rules** before it
comes from weight — which is how the period got emphasis, having no variable
axes to reach for.

---

## 3. Colour

Cloth, gilt, ink and stock come from the book; white provides the surrounding canvas.

| Token | Value | Role |
| --- | --- | --- |
| `--cloth` | `#8c2f26` | The binding. Active, interactive, data marks |
| `--gilt` | `#9a7b32` | The stamping. Selection and emphasis only |
| `--ink`, `--ink-2`, `--ink-3` | `#1a1613` → `#786a5c` | Letterpress, three strengths |
| `--bg` | `#ffffff` | General page background |
| `--stock`, `--surface` | `#f2ece0`, `#ece5d6` | Cream description stock |

**Descriptions retain laid paper, not flat cream.** A repeating horizontal grain
at about 2% plus two faint washes, one cloth-red and one umber, remains in
`--paper-texture`. Apply it to `.book-description` and `.plate`, not the body.
The white general background is deliberate; do not restore the old full-page wash.

The v3 names (`--blue`, `--teal`, `--purple`, `--pink`) were **retired on
18 September 2026** (atlas-2oai). They had been aliased to cloth and gilt, which
meant a rule reading `var(--blue)` rendered red — a token name a reader cannot
trust. Every use now names the book colour it means. Short names for SVG
attributes: `--cloth`, `--cloth-deep`, `--cloth-soft`, `--gilt`, `--gilt-soft`,
`--ink`, `--ink-2`, `--ink-3`, `--surface`, `--stock`.

White is the canvas, not a new category or accent colour.

---

## 4. Composition

- **Rules, not borders.** Divide with a paired thick/thin rule, or a hairline.
  A box around content is a UI habit, not a print one.
- **Six spacing steps**, `--space-1` … `--space-6`; gaps set by the parent.
- **One radius**, 2px, used sparingly. Print has no rounded corners.
- **Figures**: `lining-nums` where they align in columns, oldstyle in prose.
- **The running head stays on one line.** It scrolls rather than stacking.

---

## 5. Plates

A character is presented as a title-page plate: `.plate` in `src/app/plate.css`,
built by `CharacterPlate.tsx`. Letterspaced capitals, paired rules, a centred
block, an ornament, leader dots into a cast list.

`Ornament.tsx` draws a lozenge on an axis with four leaves, from primitives. If
another device is wanted, **draw an original**; do not trace a binding, a
publisher's mark, or any existing artwork.

---

## 5a. The title leaf

The homepage opens as the edition opens: a title page (atlas-1d7j). Title, the
part-line, "by", the author, the translator, a device, then the imprint — each line
on its own measure, in graduated letterspaced capitals from the six-step scale, each
tracked run mirrored by its `text-indent`, line breaks balanced. The wording is the
atlas's own and the imprint lines *cite* the 1912 London edition the text comes from
rather than imitating its imprint. The device (`TitleDevice.tsx`) is original: three
interlocked rings for the sons Fyodor acknowledges and a fourth, dashed, for the one
the town says is his — the dashed line the map uses for what the novel never settles.
Never substitute a publisher's mark.

---

## 6. On portraits

The 1912 edition is unillustrated, but Boris Grigoriev made a later 58-sheet
cycle for the novel. It includes portraits and scenes for Smerdyakov, Grushenka,
Fyodor, Ivan, Dmitri, Katerina, Alyosha, Zossima, and others. The cycle was
exhibited in New York in 1933, shown by the Fabergé Museum in 2023–24, and
published by the museum as an album in 2026.

Historical art belongs on the individual character plate or beside the relevant
chapter or timeline event. It must carry artist, title, date, holding collection,
and source. The original artwork may be out of copyright in many jurisdictions,
but a museum or product photograph is not treated as reusable without an explicit
source statement. Until a suitable reproduction is secured, the plate records the
known work by title rather than copying a credited web image.

A generated study after a historical work is permitted, and is held to stricter
labelling than a reproduction. It must be captioned visibly as AI-generated, name
and link the work it follows, and never be attributed to Grigoriev or presented as
archival. Its reference and generation prompt are recorded in
`src/assets/artwork/README.md`. The first is a study after Grigoriev's
*Pavel Smerdyakov*, shared by the homepage and Smerdyakov's plate.

The cast index and individual pages now illustrate all nine characters named in
the linked selection. The additional six studies and prompts are recorded in
`src/assets/artwork/CAST-STUDIES.md`. Shared scenes keep their full compositions and
identify both subjects in the caption; a scene is not mislabeled as a solo portrait.

The homepage is an illustrated sequence of people and scenes. Character spreads
reuse the full `CharacterPlate` typography; scene spreads use the same paired rules,
italic description, ornament, and rectangular image beside text. In-page contents
provide direct jumps. Additional analysis stays behind links and a native disclosure.
The six original scene reproductions supplied by the user are kept unmodified and
credited separately from generated studies; their provenance and chapter mappings
are recorded in `src/assets/scenes/README.md`.

Confirmed collage illustrations form five visible thematic movements, each with
a story reminder, a specific visual cue and a reason to remember the moment.
Images are not treated as decoration or forced into chronology where the evidence
does not support it. Uncertain identifications remain in a separate study disclosure.
Small extracts are never stretched beyond native pixel size; matched larger
user-supplied reproductions replace the display version of plates 17 and 27, while
the archival extracts remain downloadable. No generated detail is claimed as restoration.

---

## 7. Encoding categories

Six character groups cannot be told apart by a four-value palette, and a ramp
would imply an order they do not have. **Category is encoded by shape** —
circle, diamond, triangle, square, hexagon, cross — via `GroupMark.tsx`. Colour
carries state instead: cloth at rest, gilt when active.

---

## 8. Verification

Check computed styles, not screenshots. A wrapped grid row survived a screenshot
review here and was only caught by reading `gridTemplateRows`, which reported
two rows where there should have been one. Measure.

---

## 9. Implementation

`src/app/globals.css` is the single source of truth and mirrors this document.
If the two disagree, this document is the specification and the CSS is the bug.
