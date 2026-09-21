---
type: is
id: is-01m2y15q46c9qcythwqg5h3rcb
title: "Cleanup: a test that fails the build when a stylesheet leaves the design system"
kind: task
status: closed
priority: 2
version: 5
labels:
  - cleanup
  - design
dependencies:
  - type: blocks
    target: is-01m2y181rxg9krbf2qb57fa155
parent_id: is-01m2y13c1jg04xhgaxy7fmxn1m
created_at: 2026-09-19T23:49:07.846Z
updated_at: 2026-09-21T09:35:40.683Z
closed_at: 2026-09-21T09:35:40.683Z
close_reason: Consolidation in 91f8e23, guard in 43af1a4; measured before/after and proven red then green. Details in notes.
resolution: null
duplicate_of: null
---
Every design rule in this repo is currently enforced by whoever remembers it.
The audit found four leaks by hand; the point of this bead is that the fifth
gets caught by the build.

Add `scripts/test-design-system.ts` in the style of the existing test scripts
(see scripts/test-corpus.ts for the ok/fail reporting shape) and add it to the
`test` script in package.json so CI already runs it.

Checks, each one from a leak that actually happened here:

1. NO UNDEFINED TOKENS. Collect every `var(--x)` across src/**/*.css and
   src/**/*.tsx, collect every `--x:` definition, and fail on a use with no
   definition. A `var(--typo)` renders as nothing at all and no other check in
   this repo would notice. Honour the `var(--x, fallback)` form — a use WITH a
   fallback is legitimate (`--chart-min` is set inline by Divergence.tsx and is
   correct), so only flag an undefined token used without one.
2. NO DEAD TOKENS. Fail on a token defined in globals.css `:root`/`@theme` that
   nothing reads. This is what `--tracking-wide` was.
3. NO RAW COLOUR OUTSIDE THE PALETTE. Fail on a hex or rgb()/rgba() literal in
   any stylesheet other than the token declarations in globals.css. This is
   what plate.css:171 was. The paper-texture gradient in globals.css uses rgba
   deliberately — allow it by locating the exemption precisely, not by
   skipping the whole file.
4. NO SECOND TYPEFACE. Fail on a `font-family` naming a sans or any face other
   than the declared stack. The skill's first rule is one family, no sans.

The checks must be precise about comments: `--blue` appears in a globals.css
comment explaining why it was retired, and a naive scan reports it as an
undefined token. Strip CSS comments before scanning, and prove it by running
the check against the current tree — it must report exactly the known leaks and
nothing else.

Verify RED then GREEN: run it against the tree BEFORE the consolidation bead
lands and confirm it reports those leaks and no false positives; run it after
and confirm it is clean. Record both numbers. A guard that has never failed has
not been tested.

## Notes

Completed 20-21 Sep 2026. Commit 43af1a4. scripts/test-design-system.ts is
appended to package.json "test". CI runs `npm run test`
(.github/workflows/ci.yml:30), so CI runs the guard.

CHECKS. The bead specified checks 1-4. I added 5 and 6 so that leaks 1 and 4
of atlas-3w18 are guarded as well.
  1 no undefined token (var() with no fallback must resolve; css+tsx)
  2 no dead token (a :root/@theme token nothing var()-reads)
  3 no raw colour (hex/rgb/hsl, except inside a --custom-property declaration
    in globals.css :root/@theme)
  4 no second typeface (font-family must be var(--font-*))
  5 no shadowed root token (a globals token redeclared in another stylesheet)
  6 no literal rule weight (px in a border* declaration; radius excluded)
Comments are blanked in place before scanning, so line numbers stay true.

RED, against the pre-consolidation working tree (CSS identical to 5af7966):
  ok   1
  FAIL 2  1 dead token          globals.css:117  --tracking-wide: 0.1em;
  FAIL 3  1 literal colour      plate.css:171    rgba(43, 36, 29, 0.35)
  ok   4
  FAIL 5  2 shadowed tokens     plate.css:26 --ink, plate.css:28 --stock
  FAIL 6  38 literal weights    7 stylesheets, each file:line listed
  "4 check(s) failed", exit 1. 42 offenders.
None of the offenders is a false positive. The run did not report var(--blue)
in the globals.css comment, var(--chart-min, 900px), the rgba() in
--paper-texture, or border-radius: 2px.
The guard was changed between its first RED run and the recorded one, with two
reporting fixes. First, check 6 pointed at the line before a declaration that
sits on its own line. Second, a `#` now counts as a colour only in a value
position. The first run had the same pass/fail and the same counts (1/1/2/38).
No case in the tree exercises the `#` fix, because the stylesheets have no
#id selectors.
Check 5 could not report the five --rule copies in RED, because --rule had no
:root home yet. It covers --rule from now on.

GREEN, after the consolidation: checks 1-6 ok, "all checks passed", exit 0.

MUTATION TEST, which is the only run that exercised check 1. I added
`--rule: var(--color-ink)` and `border-top: 2px solid var(--ruel)` to
home.css:6-7. Check 1 reported var(--ruel), check 5 reported --rule, check 6
reported the 2px. "3 check(s) failed". I restored the file from a copy and the
guard was green again. The committed home.css diff has 15 changed lines, which
is exactly the intended edits (7 re-weighted borders plus 1 removed --rule).

npm test is now 7 suites, exit 0. typecheck is clean, and tsconfig includes
**/*.ts, so the script is typechecked.

LIMITS
Check 2 counts only var() reads. That is exact today, because no Tailwind
utility classes appear in tsx; the only utility-like names are grid--pairs and
text-muted, both semantic. Check 5 also flags a deliberate override of a root
token, which the contract forbids. The script's header comment says
"`--rule: var(--color-ink)` was written out six times". That exact text appeared
five times; the token was declared six times.
