# Review: an illustrated memory atlas, not a corpus dashboard

**Verdict: changes needed before this is a trustworthy illustrated reminder.**

The foundation is useful, but the product currently makes it easier to inspect word
counts than to remember the novel. Its most serious weakness is confident literary
copy built on measurements that do not establish the claimed meaning.

## Scope and evidence

- User's goal: the best possible illustrated representation of *The Brothers
  Karamazov* for people who have already read it. Spoilers are expected.
- Whole-folder review, initially at `8ab8a5c` on September 7; current findings
  rechecked at `5d9098d` on September 8, 2026, branch `atlas-bdxb/name-key`.
- Inspected application routes, components, corpus/name builders, generated data,
  plans, design documents, existing review, and the new Python API and tests.
- Checked selected literary claims against the local Garnett chapter files. This is
  not a complete fact-check of every scene or a comparison of translations.
- Used TBD's review workflow to give findings stable IDs, concrete evidence,
  priorities, and follow-up work. Review task: `atlas-458y`; improvement epic:
  `atlas-t72d`. No application fixes or new illustrations were made in this review.

The latest changes deserve credit: `/network` and `/map` are gone, the design system
is more consistent, category shapes no longer depend on color alone, and the
columnar timeline has a clearer narrative intention. Findings below concern the
remaining behavior, not those removed views.

## Findings

### R1 · High · The product optimizes for the wrong reader

**Evidence:** `src/app/page.tsx:10–45` leads with words, chapters, ties, and mention
counts. Character pages emphasize frequency and co-occurrence. The existing Case
File epic (`atlas-e56i`) prioritizes reading position, evolving verdicts, and
first-reader momentum. There is no illustrated scene sequence or persistent visual
identity for individual characters.

These can be useful supporting tools, but they are not the requested memory aid.
Knowing that someone occurs hundreds of times does not remind a reader what they
wanted, what they did, or why an encounter mattered. Category shapes identify groups,
not the distinctive people and episodes a reader wants to recall.

**Fix:** make a curated, illustrated narrative the main experience: scene → people →
motives → action → consequence, with source passages one step away. Keep statistics
and optional chat secondary. Agree on a small first sequence before expanding the
architecture. **Tracking:** `atlas-t72d`.

### R2 · High · Name morphology is presented as proof of love and coldness

**Evidence:** `src/app/names/page.tsx:25–28,76–83` calls names a map of who is loved
and labels three characters the coldest men. `scripts/build-names.ts:243–287`
counts names throughout the prose, including narration, and takes the warmest
classified alias. This is not a measure of affection or even a count of spoken
addresses. An incomplete alias list cannot establish universal claims about what
“nobody” ever says.

There is a separate attribution error: `scripts/build-names.ts:158–197` treats any
other character named inside a quotation as its addressee. In
`data/chapters/b02-c07.txt:156`, Alyosha tells Rakitin that Dmitri despises the woman;
Dmitri is the subject, not the person addressed. The adjacent Rakitin speech about
Grushenka and Alyosha's reply at lines 185–190 also exposes quotation-boundary
misattribution in the extractor. A coverage percentage does not measure correctness.

**Fix:** distinguish narrator mention, direct address, third-person reference, and
self-reference. Store chapter, exact span, speaker, addressee when known, and
uncertainty. Present emotional readings as interpretations supported by examples,
not facts derived from suffixes. Validate attribution precision before chasing higher
coverage. **Tracking:** `atlas-w56r`.

### R3 · High · The two name-counting systems disagree

**Evidence:** `scripts/build-names.ts:243–252,264–287` independently counts overlapping
aliases, then adds them. A full name can count again as its short form. Recounting
the same name forms longest-first, with non-overlapping matches in chapter text,
produced:

| Character | names.json | mentions.json | Exclusive raw matches |
| --- | ---: | ---: | ---: |
| Dmitri | 1,434 | 1,294 | 1,294 |
| Ivan | 765 | 714 | 714 |
| Katerina | 459 | 287 | 287 |
| Paissy | 145 | 0 | 73 |

These are counts under the current alias vocabulary, not a claim that every possible
reference has been recognized. Paissy also exposes stale output (R4). Inflated totals
affect form sizes and register mixes, not just a decorative statistic.

**Fix:** share one span-matching implementation, assign each occurrence one form,
and derive totals and register mixes from those occurrences. Test agreement between
outputs and regenerate them together. **Tracking:** `atlas-61hm`.

### R4 · High · The documented regeneration command silently skips work

**Evidence:** `scripts/build-mentions.ts:189` compares `import.meta.url` with
`file://${process.argv[1]}`. In this folder, spaces are encoded in the URL but not
the filesystem path, so the entry-point guard is false. The command can exit
successfully without rebuilding mentions. `package.json:10` also omits the names
builder from `npm run corpus`.

The checked-in mention index gives Paissy zero appearances although the current
name forms find 73 exclusive matches. Missing standalone `Alexey` also leaves actual
references unrecognized. The reader's alias selection depends on this data.

**Fix:** compare properly constructed file URLs; provide one complete regeneration
command; check alias coverage and output consistency. Exercise the pipeline in a
temporary output directory, including a path containing spaces, rather than only
testing existing JSON. **Tracking:** `atlas-8l09`.

### R5 · High · The new timeline teaches incorrect events and misleading timing

**Evidence:** the Ivan `day2` span in `src/lib/timeline.ts:135` says he takes the
train to Tchermashnya. `data/chapters/b05-c07.txt:238–259` explicitly has him refuse
Tchermashnya and board the train to Moscow. His contemplated destination and actual
departure are different; collapsing them distorts his encounter with Smerdyakov.

Smerdyakov's suicide span occupies `trial`, with `ends: true`, while its own detail
says the night **before** the trial. `src/components/Timeline.tsx:67–71,149–160`
places the termination at the end of that whole band. The visual teaches a later
death than the prose does.

More broadly, the page promises that reading across shows simultaneous action, but
the geometry uses whole-book word buckets. Narrated backstory, absence, and events
at different moments cannot all be interpreted as synchronized character states.
The retained module comment's 229,504-word four-day claim also includes the 12,346
words assigned to “Before”; the four day buckets themselves total 217,158.

**Fix:** separate event time, narration order, and page share. Add sourced event
anchors, show uncertainty and retrospective material, and make death endpoints
agree with the chronology. Audit all current spans; do not simply restore the old
MOMENTS array, which has its own errors. **Tracking:** `atlas-8mgb`.

### R6 · High · Clicking a name often opens an invisible answer

**Evidence:** `src/components/ChapterProse.tsx:70–76` inserts the Name Key before
all chapter paragraphs. At 1280 × 720, clicking the last Alyosha button in
`/read/b03-c09` produced a panel at `top: -7535.7px`, `bottom: -7281.5px` on the
current UI. The reader sees the selected name, but the answer is far above them.

`src/components/NameKey.tsx:41–86` explains forms and patronymics, but not the
person's role or key relationships. Even when visible, it does not fully answer
“Who was Rakitin again?”

**Fix:** use an anchored or persistent accessible panel, with intentional focus and
close behavior. Lead with a one-line identity and relationships; put alias analysis
after that. Reuse the same identity across scenes, map, search, and reader.
**Tracking:** `atlas-4hp7`.

### R7 · High · The visual interfaces are not usable across input modes

**Evidence:** at a 390px viewport, the current body measures 552px wide. The
relationship SVG's 1240-unit viewBox renders at 340px: its 13-unit character labels
become about 3.6 screen pixels. The timeline's 1080-unit chart also renders at 340px:
its 11-unit text becomes about 3.5 pixels. `.chart svg` at
`src/app/globals.css:512` forces width to 100%, so `scroll-x` does not preserve a
readable diagram size. The pairs grid also has a fixed 420px minimum at line 245.

`src/components/RelationshipMap.tsx:102–103` and the timeline's clickable SVG groups
have no keyboard activation or tab stops. The relationship map's initial
accessibility tree contains no character controls; its alternative panel is only
created after selection.

**Fix:** provide a deliberately readable mobile arrangement or controlled scroll/zoom
with adequate text size, fix navigation/grid overflow, and expose semantic keyboard
controls plus an equivalent text view. Verify these with actual viewport and
keyboard tests, not only SVG screenshots. **Tracking:** `atlas-c69d`.

### R8 · Medium · Citations look evidential but do not lead to evidence

**Evidence:** `src/components/RelationshipMap.tsx:132–145` puts a plain citation
inside a button that selects the *other person*, not the supporting passage. The
new `Span` schema in `src/lib/timeline.ts:104–115` has no source field, and the
timeline detail panel provides no chapter link.

**Fix:** separate “show this person” from “read the evidence.” Store validated
chapter and passage references on every major relationship and scene claim, and
label interpretation separately from textual fact. **Tracking:** `atlas-4iaj`.

### R9 · Medium · Passing tests overstate what has been validated

**Evidence:** `scripts/test-corpus.ts:59–60` announces that Zossima does not appear
after his death in Book VII onward, but actually checks that his count is positive
in Book VI chapter 3. The test neither checks its claim nor distinguishes a mention
from physical presence. Posthumous mentions are valid and must not be deleted.

The 15 TypeScript checks inspect existing artifacts, not a fresh pipeline run. The
11 new Python tests add useful API coverage, but likewise use the existing database;
they do not prove that source-to-database regeneration works. The Python coverage
endpoint hardcodes its numerator and denominator (`api/src/atlas/main.py`,
`coverage()`), so its test cannot detect changed extraction coverage. No configured
lint command or repository CI gate was found.

**Fix:** correct misleading assertions; add a small set of meaningful tests for
fresh generation, overlap counts, attribution distinctions, curated references, and
the broken reader/mobile interactions. Derive coverage from actual extraction data.
Reuse existing testing/validation/CI work rather than creating duplicate projects.
**Tracking:** `atlas-30o1`, `atlas-h0xk`, `atlas-83bt`.

### R10 · Medium · The architecture report confuses possible improvements with necessities

**Evidence:** `docs/review-2026-09-08.md:116–128` says JSON cannot provide query-time
filtering and calls TypeScript the wrong language. Yet `src/lib/corpus.ts:113`
onward already performs query-time scoring/filtering with a phrase bonus. Reading
position filtering does not inherently require a database. Performance can justify
an index; it needs measurement, not that claim.

The new Python service is explicitly an incremental prototype importing the existing
JSON (`api/src/atlas/ingest.py`). The live Next chat route still imports and invokes
`searchCorpus` (`src/app/api/chat/route.ts:12,58`); it does not call Python `/search`,
despite the Python module docstring saying it does. Curated `people` and `ties`
tables exist but are not populated by this ingest, so their foreign keys do not yet
validate the displayed diagrams.

**Fix:** document implemented versus proposed behavior. Keep the prototype if useful,
but benchmark a concrete retrieval need and define an integration contract before
prioritizing migration over the illustrated experience. Moving incorrect data into
SQLite does not make the interpretation correct. **Tracking:** `atlas-dvvm`.

## Design assessment and recommended direction

Keep the complete local text, stable chapter IDs, deterministic build, alias-aware
reader, curated relationships, and the idea of a narrative timeline. Those are
valuable foundations. SQLite/FTS can be a useful retrieval option; it is not the
product's missing illustration layer.

The highest-value next experiment is one polished illustrated sequence, not another
generic diagram:

1. Choose a bounded sequence, for example the disputed money → garden/pestle →
   Mokroe → investigation/trial. Verify every scene and transition first.
2. Give recurring people consistent visual identities, and use memorable objects
   as recall cues. Distinguish the different money sums and what people believe
   about them instead of reducing everything to one “3,000 roubles” symbol.
3. Give each scene a concise “what happened / why it mattered / what changed,”
   plus people, location, and exact evidence.
4. Test whether a returning reader can reconstruct the sequence without consulting
   a plot summary. Test on a phone and with keyboard navigation.
5. Expand beyond the murder plot: Ivan's rebellion, Zossima and Alyosha, Grushenka's
   onion, and Ilusha and the boys are essential counterweights, not optional trivia.

The removed `karamazov-map.html` is still available in Git history at `8ab8a5c`.
Its objects and thematic material are editorial candidates worth inspecting, not
facts to restore without verification. Do not revive the redundant old interface.

## Documentation that needs reconciliation

- `README.md` still lists deleted `/network` and `/map` routes and the previous
  pigment/color system; it omits the current `/who`, `/names`, and `/timeline` routes.
- `docs/design-document.md` needs current architecture and route status, qualified
  literary claims, and a rereader-first product objective.
- `docs/review-2026-09-08.md` predates parts of the timeline rewrite: its separate
  `DURATION` finding is no longer current, and its “only corpus tests” wording needs
  the Python tests acknowledged. Map its issue references to actual TBD records.
- Plans and existing epics should distinguish first-reader features from this user's
  illustrated recall objective. Do not silently delete their historical rationale.

These are tracked under R10. This review leaves the other review intact and adds a
separate, scoped assessment rather than overwriting another contributor's work.

## Validation and limitations

At `5d9098d`:

- `npm run typecheck`: passed.
- `npm run build`: passed; 132 pages generated.
- `npm test`: all 15 checks passed, including the misleading Zossima check noted above.
- `UV_CACHE_DIR=/private/tmp/karamazov-review-uv uv run --no-sync pytest -q` in
  `api/`: 11 passed, four warnings (two dependency deprecations and two Pydantic
  field-shadowing warnings).
- Independently counted non-overlapping current name forms and checked the encoded
  entry-point URL comparison without regenerating the user's artifacts.
- Checked the current relationship map and timeline at 390px and the late-chapter
  Name Key at 1280 × 720; temporary viewport overrides were reset.
- No live paid model call, deployment, broad dependency/security audit, or full novel
  fact-check was performed. Green tests do not resolve the findings above.

## Suspected issues deliberately not promoted

- Spoilers are not a defect for the user's stated returning-reader audience.
- Replacing category colors with shapes is a defensible design choice, not a bug.
- The removed network/map views and old `DURATION` map are not current failures.
- Low attribution coverage alone does not make partial data useless; incorrect
  attribution and unsupported conclusions are the actionable problems.
- No language rewrite is required merely because the task involves text processing.
- No application commit, push, PR review submission, or fix was authorized by this
  review-only request. TBD records are separate from application commits.

<!-- This document follows common-doc-guidelines.md.
See github.com/jlevy/practical-prose and review guidelines before editing.
-->
