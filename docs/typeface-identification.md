---
title: Identifying the typeface of the 1912 edition
description: What the page actually shows, how it was examined, and how confident the conclusion is
---
# Typeface Identification

**Date:** 2026-09-15 · **Conclusion:** a Modern (Didone) book face, not an Old Style.

## Why this document exists

The first pass at this design chose **Libre Caslon** from a photograph of a
title page. That was a guess dressed as a finding — a commit message claimed it
was "closest to your Heinemann title page" on the basis of an impression, with
no letterform examined. It was wrong, and in the opposite direction.

This records what was actually examined, so the next person can check the
reasoning rather than inherit the conclusion.

## Source

Internet Archive item `dli.ernet.509773` — *The Brothers Karamazov*, trans.
Constance Garnett, **William Heinemann Ltd, London, 1912**. The edition the
corpus text comes from.

Two body pages were pulled at 1600px wide, cropped to the chapter heading and a
line of text, and resampled for examination. Body pages, not the title page:
display capitals are the weakest evidence available, and it was display
capitals that produced the original mistake.

## What the letterforms show

### Capitals

| Feature | Observation |
| --- | --- |
| Serifs | Fine, flat, horizontal, essentially unbracketed |
| Stress | Vertical |
| Contrast | High between stem and hairline |
| `C` | Serifs at both terminals, horizontal, not angled |
| `R` | Straight, slightly splayed leg |

### Lowercase

| Feature | Observation |
| --- | --- |
| Stress on `o`, `d`, `p` | Vertical — thin points at top and bottom, not diagonal |
| `g` | Double-storey, small upper bowl |
| `y` | Straight angled descender, small cut terminal — not a ball |
| `a` | Double-storey, small bowl, abrupt top terminal |
| Serifs on `l`, `h`, `i`, `t` | Fine, flat, horizontal |
| x-height | Large relative to ascenders |

## Conclusion

**Modern (Didone).** Vertical stress, high contrast and flat unbracketed serifs
are the defining set, and all three are present.

This rules out the original guess decisively. Caslon is an Old Style: diagonal
stress, heavily bracketed angled serifs, low contrast — close to the opposite of
what the page shows. Garamond likewise.

The specific face is most likely **Monotype Modern**, the workhorse of British
trade book printing in the period. That part is inference from context rather
than proof.

It also rules out **Scotch Roman**, the other common candidate: Scotch carries
pronounced ball terminals on `a`, `c`, `f`, `r` and `y`, and the `y` here ends
in a cut rather than a ball.

## What was chosen, and why

**Old Standard TT** (Alexey Kryukov, SIL OFL, on Google Fonts). Its stated
purpose is reviving "the Modern (classicist) style of serif typefaces, very
commonly used in various editions printed in the late 19th and early 20th
century, but almost completely abandoned later" — the same class, revived for
the same reason.

Used as a **single family** throughout. A 1912 trade book is set in one family
at several sizes; two families was a modern habit imported into a period design.
`--font-display` remains a separate token so display sizes can be tuned, not
because it resolves to a different face.

## Confidence

| Claim | Confidence |
| --- | --- |
| The face is a Modern, not an Old Style | **High** — three independent diagnostics agree |
| It is not Caslon or Garamond | **High** |
| It is not Scotch Roman | **Moderate** — rests on terminals, which the scan renders poorly |
| It is specifically Monotype Modern | **Low** — inference from period and market, not from the page |
| Old Standard TT is the right revival | **High** for the class; it is not claimed to be the same face |

## The honest limit

This is a **class match, not a face match**. Old Standard TT reproduces the kind
of type the edition used. Proving the exact face would need a metal-type
specimen comparison, and the scan — heavily inked, with show-through from the
reverse — is not good enough for that even if the specimens were to hand.

Describe it as *set in the Modern style of the 1912 edition*. Not *matches the
first edition*, and never *the first ever print*, which is the 1880 Moscow
edition in Russian and shares no typographic tradition with this one.
