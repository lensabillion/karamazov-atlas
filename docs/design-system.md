---
title: Karamazov Atlas — Design System
description: Two typefaces, two colours, and the rules that make them consistent everywhere
---
# Design System

**Version 3** · 2026-09-08 · Extends v2 from two hues to four.

---

## 1. The constraints

1. Light ground — white, but not flat white (§3.4).
2. Four hues: **blue**, **teal**, **purple**, **pink**. No fifth.
3. Exactly **two** typefaces: Fraunces and DM Sans. Unchanged from v2.
4. Consistent on every surface, without exception.

**Every hue must have a job.** Two colours were too few — the result read grey and
flat, because with one accent held in reserve for selection, almost everything was
neutral. Four is enough to carry meaning, and few enough to stay disciplined. A hue
that is only decorative is a bug.

---

## 2. Typefaces

Two families, chosen to be genuinely admired rather than defaults.

### Fraunces — display and reading

A contemporary "old style" serif with real character: soft, slightly wonky, warm. It is
a **variable font with an optical-size axis** (`opsz`), which is why one family can do
two jobs honestly — at 96pt it is a display face with dramatic contrast, and at 17pt the
optical size reflows the letterforms for reading. That solves the usual problem of
needing a display serif *and* a text serif without spending a third family.

Deliberately not Playfair Display, which has become the automatic choice for
"editorial" and now reads as a default rather than a decision.

**Used for:** page titles, section headings, the novel's text, quotations, and any
number the reader is meant to dwell on.

### DM Sans — interface

A low-contrast geometric sans with a tall x-height and short descenders. It stays
legible at 12px, which is where most interface text lives, and its geometry sits
comfortably beside Fraunces' warmth without competing.

Deliberately not Inter, for the same reason as above.

**Used for:** navigation, labels, controls, data annotations, chart text, captions.

### The rule

> Fraunces is for language. DM Sans is for interface.
> If the reader is reading *words the novel or the author wrote*, it is Fraunces.
> If they are reading *the app talking about the novel*, it is DM Sans.

### Scale

Six sizes. There is no seventh.

| Token | Size | Use |
| --- | --- | --- |
| `--text-xs` | 12px | Labels, chart annotations, counts |
| `--text-sm` | 14px | Interface body, list items, controls |
| `--text-base` | 16px | Default |
| `--text-md` | 19px | Reading prose, lede |
| `--text-lg` | 26px | Section headings |
| `--text-xl` | 44px | Page title, one per page |

Weights: **400** and **600** only. Fraunces additionally uses its `SOFT` and `opsz`
axes rather than reaching for more weights.

---

## 3. Colour

### The two hues

Both are picked away from the web-default blues. `--blue` is a deep ink blue with a
slight violet cast, which reads as considered rather than generic. `--teal` is desaturated
towards green-grey so it can sit beside the blue without vibrating.

| Token | Value | Role |
| --- | --- | --- |
| `--blue` | `#1F3A93` | Primary. Structure, data marks, links, headings-in-emphasis |
| `--blue-deep` | `#152863` | Pressed, hover, heavy strokes |
| `--blue-soft` | `#E8ECFA` | Tinted grounds behind blue content |
| `--teal` | `#0E7C7B` | Secondary. Selection, the active thing, the answer |
| `--teal-deep` | `#0A5C5B` | Pressed |
| `--teal-soft` | `#E0F2F1` | Tinted grounds behind teal content |
| `--purple` | `#5B3E96` | **Uncertain, disputed, interpreted.** What the text does not settle |
| `--purple-soft` | `#EDE8F8` | Tinted ground behind interpretation |
| `--pink` | `#B32B65` | **Consequence.** The thread the murder travels along |
| `--pink-soft` | `#FBE8F0` | Tinted ground behind that thread |

### Neutrals are blue, not grey

Every neutral is the blue hue at very low saturation. Nothing in the interface is a
true grey, which is what keeps two colours from looking like two colours plus grey.

| Token | Value |
| --- | --- |
| `--bg` | `#FFFFFF` |
| `--surface` | `#F6F7FB` |
| `--border` | `#E1E5F0` |
| `--border-strong` | `#C2C9DE` |
| `--ink` | `#101632` |
| `--ink-2` | `#414A6B` |
| `--ink-3` | `#7A83A0` |

### Division of labour

- **Blue is the noun.** Structure, data, the things being described.
- **Teal is the verb.** Selection, focus, the currently active thing, the answer to the
  reader's question.

A page at rest is blue. Teal appears only where the reader has acted or where the app
is pointing at something.

---

## 4. There is no dark mode

v1 supported light and dark. This version commits to one: a white ground, as specified.
Committing lets the palette be tuned exactly rather than compromised across two
environments. `color-scheme: light` is declared so form controls follow.

---

## 5. Encoding six groups with two colours

The hard problem. The app distinguishes six character groups — household, women,
monastery, boys, town, court — which v1 encoded by six hues. Two hues cannot do that,
and a blue→teal ramp would be worse than useless: a sequential ramp implies **order**,
and these categories have none.

**Groups are therefore encoded by SHAPE, not colour.**

| Group | Mark |
| --- | --- |
| Household | ● circle |
| Women | ◆ diamond |
| Monastery | ▲ triangle |
| Boys | ■ square |
| Town | ⬢ hexagon |
| Court | ✚ cross |

Shape is a categorical channel — it carries no implied order, which is exactly right
here — and it survives greyscale printing and colour-blindness, which six hues did not.

Colour is then freed to carry something it is actually good at:

- **Blue** — everything at rest.
- **Teal** — the selected element and everything connected to it.

So on the relationship map, shape says *what kind of person this is* and teal says
*what you are looking at*. The two channels stop competing.

---

## 6. Structure

- One border width: **1px**.
- One radius: **3px**.
- No shadows, no gradients, no blur. Depth comes from the single `--surface` step.
- Space scale, six steps: 4 / 8 / 16 / 24 / 40 / 64px.
- Gaps are set by parents with flex or grid `gap`. Never margins on children.
- One breakpoint: 760px.

---

## 7. Rules that must not be broken

1. No colour value appears outside the token block in `globals.css`.
2. No `style` attribute except for values computed from data (bar widths, SVG geometry).
3. No font size outside the six tokens.
4. Categorical data is encoded by shape; colour never encodes category.
5. Teal means *active*. It is never decorative.
6. Fraunces for the novel's language, DM Sans for the app's.

---

## 8. Implementation

`src/app/globals.css` is the single source of truth and mirrors this document section
for section. If the two disagree, this document is the specification and the CSS is the
bug.
