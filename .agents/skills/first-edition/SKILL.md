---
name: first-edition
description: The visual language of the Karamazov Atlas. Use whenever writing or reviewing any UI in this repository — components, pages, CSS, charts, or copy. The app is set as a 1912 letterpress edition, and every surface must match. Triggers on: design, styling, CSS, typography, colour, layout, component, page, chart, SVG, font, spacing.
---

# First-Edition Design

The Karamazov Atlas is set as a printed book — specifically the 1912 Heinemann
edition of the Garnett translation, which is the text the corpus is taken from.
**Every surface follows this.** If something looks like a web app, it is wrong.

Full specification: `docs/design-system.md`. This file is the working summary.

## The rule that matters most

> The page is a leaf of stock, not a screen. Everything sits ON the stock —
> ruled, letterspaced, centred where a page would centre. Do not add boxes,
> shadows, gradients, rounded cards, or anything that reads as a UI surface.

## Typeface — one family, no sans

**Old Standard TT**, everywhere. `--font-display`, `--font-serif` and
`--font-sans` all resolve to it; `--font-display` exists only so display sizes
can be tuned separately.

Never introduce a sans, and do not add a second serif. A 1912 trade book is set
in one family at several sizes. Labels are letterspaced capitals of the same
face, which is how the period set them.

The face was identified from the actual 1912 pages, not guessed: the letterforms
are **Modern (Didone)** — vertical stress, high contrast, flat unbracketed
serifs. An earlier version specified Libre Caslon from a title-page photograph
and was wrong, since Caslon is an Old Style. Evidence and confidence levels:
`docs/typeface-identification.md`.

Describe it as *set in the Modern style of the 1912 edition* — a class match,
not a face match.

**Letterspacing needs `text-indent` to match**, or the block sits optically
off-centre — the trailing letter carries a space the eye reads as a margin:

```css
letter-spacing: 0.22em;
text-indent: 0.22em;   /* always mirror the tracking */
text-transform: uppercase;
```

## Colour — four values from the object, on a white canvas

| Token | Value | Role |
| --- | --- | --- |
| `--cloth` | `#8c2f26` | The binding. Active, interactive, data marks |
| `--gilt` | `#9a7b32` | The stamping. Selection and emphasis only |
| `--ink` / `--ink-2` / `--ink-3` | `#1a1613` → `#786a5c` | Letterpress, in three strengths |
| `--stock` / `--surface` | `#f2ece0` / `#ece5d6` | Cream stock, for descriptions and plates |
| `--bg` | `#ffffff` | The general page canvas (user request, 17 Sep 2026) |

White surrounds the artwork; each **description** stays a leaf of laid paper —
`--paper-texture` (horizontal grain plus two faint washes) on `.plate` and
`.book-description`, never on the body. Do not restore the full-page cream wash.

Use the book names only: `--cloth`, `--cloth-deep`, `--cloth-soft`, `--gilt`,
`--gilt-soft`, `--ink*`, `--surface`, `--stock`. The v3 names (`--blue`,
`--teal`, `--purple`, `--pink`) were retired in atlas-2oai and no longer
resolve. Do not add new colour values.

## Composition

- **Rules, not borders.** Divide with a paired thick/thin rule (`.plate__rule`)
  or a hairline. A 1px box around content is a UI habit, not a print one.
- **Six type sizes**, `--text-xs` … `--text-xl`. There is no seventh.
- **Six spacing steps**, `--space-1` … `--space-6`.
- **One radius** (`--radius`, 2px), used sparingly. Print has no rounded corners.
- **Figures**: `lining-nums` in columns that align, oldstyle in running prose.

## Plates

A character is presented as a title-page plate — `.plate` in
`src/app/plate.css`, built by `CharacterPlate.tsx`. Letterspaced caps, paired
rules, centred block, ornament, leader dots.

`Ornament.tsx` is drawn from primitives. If another device is needed, **draw an
original one**; do not trace a binding, a publisher's mark, or any existing
artwork.

## On portraits and historical art

The 1912 edition is unillustrated. Boris Grigoriev's later 58-sheet cycle
(1916–1932) is the historical source; the user-supplied reproductions and the
36-plate collage are catalogued in `src/assets/scenes/README.md` and
`public/artwork/grigoriev-collage/README.md`. Full rules: design-system.md §6.

- A **generated study** is allowed only as the spec describes: visibly captioned
  as AI-generated, linked to the work it follows, never attributed to Grigoriev.
- An **identification** needs a published caption or catalogue source. Uncertain
  plates keep their label and get no character or chapter link.
- **Treat "enhanced" copies as suspect.** A sharpened or repainted copy of a
  collage crop invents detail (faces, signs, moons, extra figures). Compare it
  with the native crop before using any detail as evidence, and never display
  one as the original.

## Checklist before committing any UI

1. Does it use `--font-display` or `--font-serif`? (Never a system sans.)
2. Does every letterspaced run carry a matching `text-indent`?
3. Are all colours from the book tokens, by their book names?
4. Did you add a box, shadow, or gradient? Remove it.
5. Is every size from the six-step scale?
6. Does the running head stay on one line?
7. Verify by measuring computed styles, not by looking at a screenshot — a
   screenshot hid a wrapped grid row here that only `gridTemplateRows` exposed.
