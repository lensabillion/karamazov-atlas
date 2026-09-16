---
title: Karamazov Atlas — Design System
description: The app is set as a 1912 letterpress edition; this is how
---
# Design System

**Version 5 — First Edition** · 2026-09-15 · Supersedes the two-then-four-hue
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

**The governing rule:** the page is a leaf of stock, not a screen. If a surface
reads as a web app — a boxed card, a shadow, a gradient, a rounded panel — it is
wrong.

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

Four values, taken from the object rather than invented.

| Token | Value | Role |
| --- | --- | --- |
| `--cloth` | `#8c2f26` | The binding. Active, interactive, data marks |
| `--gilt` | `#9a7b32` | The stamping. Selection and emphasis only |
| `--ink`, `--ink-2`, `--ink-3` | `#1a1613` → `#786a5c` | Letterpress, three strengths |
| `--bg`, `--surface` | `#f2ece0`, `#ece5d6` | Cream stock |

**The ground is laid paper, not flat cream.** A repeating horizontal grain at
about 2% plus two faint washes, one cloth-red and one umber, in opposite
corners. It is never strong enough to sit under running text, and it is what
stops the page reading as a beige fill.

The v3 names (`--blue`, `--teal`, `--purple`, `--pink`) still resolve; they now
point at cloth and gilt. Components were not rewritten to rename them, because
the alias is honest about what happened and touches one file rather than thirty.

**Do not add a fifth value.**

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

**Do not generate character faces.** A historical interpretation is evidence;
an image-model interpretation would present invention as memory of the novel.

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
