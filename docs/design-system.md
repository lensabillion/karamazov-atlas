---
title: Karamazov Atlas — Design System
description: The app is set as a 1912 letterpress edition; this is how
---
# Design System

**Version 4 — First Edition** · 2026-09-15 · Supersedes the two-then-four-hue
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

## 2. Typefaces

Two, both period revivals. **There is no sans**, because the edition has none.

| Token | Face | Use |
| --- | --- | --- |
| `--font-display` | **Libre Caslon Display** | Titles, headings, brand, large figures |
| `--font-serif` | **EB Garamond** | Text, italics, labels, data, prose |

`--font-sans` is retained as an alias to the serif so that any component still
asking for it degrades to the right face instead of a system sans.

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

There is **no historical set of Karamazov character faces**:

- Grigoriev's illustrations (c. 1916–33) were exhibited once in 1933 and went
  into a private collection; no usable scans circulate.
- The 1912 edition is unillustrated.
- Perov's 1872 portrait is public domain, but it is the author, not the cast.

**Characters are presented typographically and no faces are generated.** That is
a decision, not a gap awaiting an image model.

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

