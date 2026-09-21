---
title: The thirteenth juror — what the Atlas should become
description: Second research pass. What people build to represent a book they have read, why the ones that spread have one rule, and how twelve pages become one sentence.
softschema:
  contract: atlas.research:GrowthDossier/v1
  schema: schemas/growth-dossier.schema.yaml
  envelope: dossier
  status: permissive
dossier:
  date: "2026-09-21"
  bead: atlas-hgu0
  question: >-
    What have people built to represent a book they have read, and what should the
    Atlas — twelve pages today — become so that it is short and catchy?
  verdict: >-
    Make the case file the front door — "Twelve jurymen decided the Karamazov case. You
    are the thirteenth." — run it on the calendar the novel keeps, and fold every other
    page into the text it explains.
  current_shape:
    routes: 12
    nav_links: 8
    buried_routes: [/ideas, /translations]
    one_line_rule: null
  precedent_registry: research-precedents.yaml

  proposals:

    - id: two-doors
      name: Two doors
      rule: The nav becomes the case, the book, and the reader's place — nothing else.
      kind: cut
      descends_from: [vilna-talmud-page, world-of-dante, norton-critical-karamazov]
      needs:
        - Front matter for the persons of the drama, back matter for the whole-book plates
      have_already:
        - src/components/Nav.tsx — eight links and the "Read to" place
      effort: S
      risk: >-
        /names and /translations are the Atlas's best landing pages from search. They
        keep their URLs and leave the nav.
      verdict: build-now
      only_this_novel: >-
        The architecture it adopts is the 1912 edition's own — front matter, text, back
        matter — the edition the whole app is already set as. The one door it keeps
        open is the trial.

    - id: thirteenth-juror
      name: The thirteenth juror
      rule: Twelve jurymen decided the Karamazov case. You are the thirteenth.
      kind: spine
      descends_from: [you-draw-it, the-jury-murder-trial, crimes-and-punishments]
      needs:
        - The case at /, asking its two questions before the first chapter
        - The illustrated companion moved to the front matter of the book
      have_already:
        - src/app/case/page.tsx
        - src/lib/evidence.ts — 28 records, each quoted and tested against its chapter
        - src/components/Verdict.tsx and src/components/Divergence.tsx
        - src/lib/use-verdicts.ts — every answer kept with the chapter it was given at
      effort: M
      risk: >-
        Reading the novel as a whodunnit is the prosecutor's mistake, so the front door
        is honest only once the second question carries its evidence (second-question).
        It also reverses a decision made on 18 September, when the illustrated
        companion became the front door (atlas-t72d).
      verdict: build-now
      only_this_novel: >-
        The trial is the novel's own last book, titled "A Judicial Error", which opens
        on "the twelve jurymen" (Bk XII, ch. 1); and the first sentence announces the
        death, so the question is fair from the first page.

    - id: second-question
      name: The second question, weighed
      rule: >-
        The case weighs who is responsible as carefully as who killed him — from the
        elder's teaching to the speech at the stone.
      kind: apparatus
      descends_from: [her-story, crimes-and-punishments]
      needs:
        - Evidence from Book X and the Epilogue, where there is none
        - More from Books V and VI — Rebellion, the Inquisitor, the elder
      have_already:
        - src/lib/evidence.ts — 13 of 28 records bear on responsibility
        - scripts/test-curated.ts — every quotation checked against its chapter
      effort: M
      risk: >-
        Curated interpretation is where this Atlas is most exposed. Each record quotes
        the text and says no more than it does.
      verdict: build-now
      only_this_novel: >-
        The elder's answer — "we are each responsible to all for all" (Bk VI, ch. 2) —
        is the novel's reply to its own trial. Without it the front door is a
        whodunnit, and a whodunnit is the prosecutor's reading of this book.

    - id: swear-on-a-passage
      name: Swear on a passage
      rule: >-
        Every verdict names the passage it rests on, and at the verdict you learn which
        of your passages the court believed, disbelieved, or never heard.
      kind: spine
      descends_from: [golden-idol, obra-dinn, you-draw-it]
      needs:
        - Evidence ids on each VerdictRecord, chosen only from passages the reader has reached
        - A tally at Bk XII, ch. 14, built from each record's court field
      have_already:
        - src/lib/evidence.ts — court set on 17 records (believed 7, heard and not believed 5, never heard 5)
        - src/lib/use-verdicts.ts
        - the reading-position fold
      effort: S
      risk: >-
        A reader can pick a passage without reading it. Offering only what they have
        reached limits that; nothing prevents it.
      verdict: build-now
      only_this_novel: >-
        The novel's argument is that the jury believed true evidence and convicted the
        wrong man. The tally tells a reader whether they reasoned the same way — the one
        thing about the ending nobody can spoil for them.

    - id: karamazov-calendar
      name: The Karamazov calendar
      rule: >-
        One chapter a day from 1 July: the four days end on 31 August, as the book
        says; two months of silence while Mitya waits; the trial from 1 November; the
        verdict on 1 December.
      kind: ritual
      descends_from: [dracula-daily, whale-weekly, footnotes-and-tangents, daf-yomi, russian-messenger-serial, bible-in-a-year]
      needs:
        - A calendar file (.ics) generated at build time from data/corpus.json — no mailing list to run
        - A page for each day that sets the reader's place to that day's chapter
        - A link any read-along can use for its own schedule
      have_already:
        - 96 chapter files, a mean of about 3,600 words — fifteen minutes a day
        - src/lib/orientation.ts — a spoiler-free note on why each chapter is there
        - the reading-position gate
      effort: M
      risk: >-
        Readers drift away during the silent months. The jury room stays open, and a
        late starter follows "Day 23 of 96" at their own pace.
      verdict: build-next
      only_this_novel: >-
        The book places itself — the monastery day "at the end of August" (Bk II, ch.
        1), Book X at "the beginning of November", the Epilogue "five days after the
        trial" — and its chapters fit the months: 62 for July and August, 31 for
        November and the verdict. The silence is the two months the novel skips.

    - id: verdict-plate
      name: The verdict plate
      rule: >-
        The shape of the whole novel with your deliberation marked along it, and
        nothing on it that could spoil a stranger.
      kind: artifact
      descends_from: [wordle, booktok-tabbing, dear-data, posavec-writing-without-words, litographs]
      needs:
        - A share image drawn from the verdict history, in the edition's type and rules
        - A share link that carries marks, never names, and opens folded to the viewer's place
      have_already:
        - src/lib/use-verdicts.ts — position and both answers for every verdict
        - src/components/GroupMark.tsx — marks told apart by shape, which survive greyscale and print
        - src/lib/timeline.ts — the four days take 62% of the words
      effort: M
      risk: >-
        Data art that means nothing to a stranger. One legend line guards against it,
        and one human line — the passage the reader swore on, shown only as its
        location if it lies past the viewer's place.
      verdict: build-next
      only_this_novel: >-
        Its spine is this book's shape — thirteen books, 96 chapters, four days taking
        62% of the words — and its marks are this book's two questions.

    - id: glossed-page
      name: The glossed page
      rule: Every kind of help has a fixed place around the text instead of a page of its own.
      kind: apparatus
      descends_from: [vilna-talmud-page, digital-dante, joyce-project, sefaria, oxford-introduction-as-afterword]
      needs:
        - Named margin areas on the chapter page that fall under each paragraph at phone width
        - A spoiler cutoff on every gloss
      have_already:
        - src/app/read/[id]/page.tsx — already works out each chapter's persons and name forms
        - data-spoiler-from gating, and the Name Key
      effort: L
      risk: >-
        A 1912 Garnett page has no side-notes, so the margins stay nearly empty by
        default. Quoting the in-copyright translations line by line is a rights
        question; the translations stay a note.
      verdict: build-next
      only_this_novel: >-
        Its inner margin carries what an English reader of this book cannot do without
        — that Mitya, Mityenka and Dmitri Fyodorovitch are one man.

    - id: sort-the-karamazovs
      name: Sort the Karamazovs
      rule: >-
        Sort the book's name forms into its people, confirmed three at a time, ending on
        the name that accuses the father.
      kind: door
      descends_from: [obra-dinn, roottrees-are-dead]
      needs:
        - A sorting surface on /names, checked in batches
      have_already:
        - data/names.json — 27 people and their name forms
        - src/components/NameKey.tsx
      effort: S
      risk: A quiz can trivialise. It sorts names, which have right answers, and nothing else.
      verdict: explore
      only_this_novel: >-
        Russian naming is the first wall English readers hit, and here a patronymic
        carries the plot — Smerdyakov "was christened Pavel, to which people were not
        slow in adding Fyodorovitch (son of Fyodor)", while his father went on "denying
        his responsibility" (Bk III, ch. 2).

    - id: the-ticket
      name: The ticket
      rule: >-
        The book's most famous argument in one sitting — Rebellion, The Grand
        Inquisitor, and the elder's reply.
      kind: door
      descends_from: [hackett-grand-inquisitor, waste-land-app]
      needs:
        - A reading route over chapters that exist — b05-c04, b05-c05, then Book VI
      have_already:
        - data/chapters/b05-c04.txt (4,922 words) and data/chapters/b05-c05.txt (9,252 words)
      effort: S
      risk: >-
        It lifts the argument out of the family with a stake in it, which is what the
        novel resists. One line of context stays — who tells it, to whom, and why.
      verdict: explore
      only_this_novel: >-
        Hackett already sells this cut on its own, in Garnett's translation — the text
        this Atlas is built on. Ivan "most respectfully" returns the ticket (Bk V, ch.
        4); the door takes its name from him.

    - id: readers-jury
      name: The readers' jury
      rule: See how other readers had ruled at the same chapter, beside the novel's twelve.
      kind: ritual
      descends_from: [you-draw-it, the-jury-murder-trial, storygraph-readalongs]
      needs:
        - A shared store for anonymous tallies — the FastAPI service in api/ could hold them
        - Enough readers for a distribution to mean something
        - A privacy review
      have_already:
        - api/ — FastAPI and SQLite
        - VerdictRecord keeps the position of every answer
      effort: L
      risk: >-
        Tallies from readers who finished leak the ending to readers who have not —
        Kindle's popular-highlights problem. Only answers given at or before the
        viewer's place are shown.
      verdict: explore
      only_this_novel: The novel seats a jury of twelve; a jury of readers is its second room.

    - id: atlas-for-any-novel
      name: An atlas for any novel
      rule: Generalise the pipeline into a companion for every book.
      kind: spine
      descends_from: [position-scoped-companions, world-of-dante]
      effort: L
      verdict: reject
      only_this_novel: >-
        It cannot be, and that is the objection. The 2025–26 companions are the same
        product for every book; the first research pass named that as their failure.

    - id: reader-portrait
      name: A written portrait of the reader
      rule: Have a model describe the reader from their verdicts.
      kind: artifact
      descends_from: [fable-reader-personas]
      effort: S
      verdict: reject
      only_this_novel: >-
        Nothing about it is. Fable's personas were pulled after bigoted output. The
        verdict is the reader's to write.

    - id: public-margins
      name: Public margins
      rule: Let anyone annotate the text for everyone.
      kind: apparatus
      descends_from: [public-annotation-layers, kindle-popular-highlights]
      effort: M
      verdict: reject
      only_this_novel: Nothing about it is. Every open layer died, and pooled highlights spoil.

    - id: red-string-board
      name: A red-string evidence board
      rule: A free-form corkboard where the reader strings evidence to suspects.
      kind: apparatus
      descends_from: [shadows-of-doubt]
      effort: L
      verdict: reject
      only_this_novel: >-
        Nothing about it is. When the ending is fixed, a board adds little that swearing
        on a passage does not give more cheaply.

  consolidation:
    thesis: >-
      Stop being a website with pages and become the edition — the case at the front,
      the text in the middle with its help in the margins, everything whole-book at the
      back.
    keep:
      - /case — becomes the front door, at /
      - /read/[id] — becomes the glossed page
      - /names and /translations — landing pages from search, out of the nav
      - /character/[id] — links a reader can share
    merge:
      - into: /case
        from: [/ideas]
        why: It already ends by sending readers to the case file; its voices are the evidence on the second question.
      - into: the case, as "cross-examine the text"
        from: [/ask]
        why: Questions to the text are a tool for weighing evidence, not a destination.
      - into: the glossed page
        from: ["/who (while reading)", "/names (while reading)", "/timeline (while reading)"]
        why: Each answers a question a reader has at a particular line, and the answer belongs beside that line.
      - into: front matter — the persons of the drama
        from: [/, /characters]
        why: The plates are the cast, and a 1912 edition puts its persons before the text.
      - into: back matter — the plates
        from: ["/timeline (the whole wall chart)", "/who (the whole map)"]
        why: Whole-book views do not fit a margin; editions fold them in at the back.
    demote:
      - /translations — a colophon note, and a landing page from search
      - /names — a landing page from search, and the sorting game
    cut:
      - Six of the eight nav links
---
# The thirteenth juror

**Date:** 2026-09-21 · **Status:** Complete · **Bead:** atlas-hgu0 ·
**Follows:** [`research-book-representation.md`](research-book-representation.md) (atlas-v27c)

> **Twelve jurymen decided the Karamazov case. You are the thirteenth.**

That is the proposal. The novel's last book is called *A Judicial Error*, and it opens on
"the twelve jurymen" — four of whom, the narrator says, "had never read a single book"
(Bk XII, ch. 1). The novel's first sentence announces a "gloomy and tragic death" (Bk I,
ch. 1). The Atlas already has the case file that stands between the two —
it is the seventh link in the nav. This document argues that it should be the only thing
at the front, that it should run on a calendar the novel turns out to keep, and that
nearly everything else should become the margins and appendices of one edition.

The first pass asked what nobody had built, and answered: put the reader in the jury box.
That was built. This pass takes the owner's question — *there are so many pages; can it be
short and catchy?* — and the answer is yes, because the sentence already exists.

## The one-sentence test

Everything in the survey that spread beyond its niche can be said in one sentence, and
the sentence is a rule, not a description. The surface is small: one screen, often less.

| What spread | Its rule | Its surface |
| --- | --- | --- |
| Dracula Daily (2021) | Each part is emailed on the day of the year it is dated | One email, on days the book has something to say |
| Wordle (2021) | One word a day; share how you got there, never the answer | One grid |
| Return of the Obra Dinn (2018) | Name sixty dead; the ledger confirms three at a time | One ledger, one watch |
| Daf Yomi (1923) | The same page of Talmud, everywhere, on the same day | One page number |
| The Vilna Talmud page | Each kind of commentary in a fixed margin around the text | One template |

The Atlas, measured on the day of writing:

| | |
| --- | --- |
| `page.tsx` files | 12 |
| Destinations in the nav | 8 |
| Finished pages the nav does not reach | 2 — `/ideas` and `/translations` |
| One-sentence rule | none |

The front door says *The people you remember. The moments that remain.* That is a mood;
nobody can repeat it to a friend as a reason to click. None of this is a failure of craft
— every page is careful, every quotation is tested against the text, and the design
system has its own test suite. The project has done ten good things and chosen none of
them. Of all the precedents, it most resembles the University of Virginia's *World of
Dante*: one carefully encoded text feeding about seven separate tools.

## What the research found

The first pass covered distant reading, enriched editions, study guides, fan maps and AI
companions. This one covered four more traditions. All 51 precedents from both passes —
each reduced to the rule that made it work and what the Atlas could take — are in
[`research-precedents.yaml`](research-precedents.yaml).

**Serial rituals: the schedule is the product.** Dracula Daily grew from 1,600
subscribers in 2021 to 200,000 by May 2022 and past 240,000 by October 2023, and all it
adds to Stoker is a date. Footnotes and Tangents is in its fourth year of *War and Peace*
at a chapter a day. The last completion of Daf Yomi's seven-and-a-half-year cycle filled
MetLife Stadium with more than 90,000 people. Whale Weekly reconstructed a calendar for
*Moby-Dick* from clues in the text. Several *Karamazov* read-alongs are running on
Substack now; none is scoped to where its readers are, or cites the text.

**Deduction games: withhold confirmation only where there is an answer.** Obra Dinn
confirms fates three at a time so that nobody can guess their way through. Golden Idol
builds each accusation out of words taken from the evidence. Her Story never tells you
that you are right. Wordle's share grid — invented by players in New Zealand, adopted by
the game, shared 1.2 million times on Twitter in the first thirteen days of 2022 — shows
the shape of your play and never the answer. For a novel whose ending is public: confirm
names, never verdicts, and share the shape of a deliberation, not its conclusion.

**Commentary editions: give each kind of help a fixed place, not a page.** The Talmud
page holds a text and every layer of its commentary on one template, because each layer
always sits in the same spot. The digital editions that read well — Sefaria, Digital
Dante, the Joyce Project — keep one surface per unit of text. The Joyce Project opens
every note with a paragraph for newcomers and puts the spoilers after it; Oxford World's
Classics tells readers who want no plot details to read the introduction last. Print had
a spoiler rule long before this Atlas did. And the Norton Critical Edition of
*Karamazov* — Garnett's text, revised — is already a book in three zones: a key to the
names in front, the text, then backgrounds and criticism.

**What readers show: the effort and the stance, never the content.** BookTok's coloured
tabs show where a reader reacted, never what happened — a mark that cannot spoil.
Litographs already sells *Karamazov* as a shirt printed with its text, but every buyer
gets the same one; nothing shows one person's reading of it. Fable's AI-written reader
portraits were pulled after bigoted output: the verdict is the reader's to write.

**What nobody has built.** Sites that lock a reference to the reader's place exist, but
only for genre series such as *The Wheel of Time*. None serves a classic, and none makes
anything a reader can share. Fan wikis let spoiler warnings expire a fixed time after
release, which protects no first-time reader of an 1880 novel. Digital Dostoevsky encodes
this novel, in Russian, for research — an instrument, not a companion.

## The book keeps its own calendar

Dracula Daily works because Stoker dated every letter. Dostoevsky dated nothing — but he
placed the novel in the year, and the placement fits the calendar with no adjustment:

| Chapters | One a day from | Lands on | What the text says |
| --- | --- | --- | --- |
| Books I–IX, 62 chapters | 1 July | **31 August** — "They Carry Mitya Away" | The monastery day falls "at the end of August" (Bk II, ch. 1) |
| — | — | September and October: nothing | The novel skips two months while Mitya waits in prison |
| Books X–XII, 31 chapters | 1 November | **1 December** — "The Peasants Stand Firm" | Book X opens at "the beginning of November" (Bk X, ch. 1) |
| Epilogue, 3 chapters | 6 December | 8 December — the speech at the stone | "five days after the trial" (Epilogue, ch. 1) |

Sixty-two chapters fill July and August exactly, so the four days end on the date the
story gives them. Thirty-one chapters fill November with one day over, and that day is
the verdict. A chapter averages about 3,600 words — fifteen minutes' reading. And the
silent months are not a hole in the schedule. They are the hole in the book, lived
through: the reader waits while Mitya does. No serial of a dated novel can offer that,
because Stoker never stopped writing letters.

The novel was first read this way — in instalments in *The Russian Messenger*, January
1879 to November 1880, with months skipped.

## The Atlas, as a reader would live it

Put together, the whole project fits on one card:

- **1 July.** Day 1. The first sentence announces a "gloomy and tragic death". The case
  asks its two questions — who killed him, and who is responsible. Answer now; change
  your answers whenever you like.
- **July and August.** A chapter a day. Names are glossed in the margin where they
  appear. Each answer you give names the passage it rests on.
- **31 August.** "They Carry Mitya Away." The four days end on the day the book says.
- **September and October.** Nothing arrives. The jury room stays open: the evidence you
  have reached, and your answers so far.
- **1 November.** The trial stretch begins.
- **1 December — Verdict Day.** Every calendar reader reaches "The Peasants Stand Firm"
  on the same day. The tally opens: the passages you convicted on, and which of them the
  court believed, disbelieved, or never heard.
- **8 December.** The speech at the stone, and your plate — the shape of the whole novel
  with your deliberation marked along it. Shareable, because it spoils nothing.

## Four moves

1. **Two doors.** The nav becomes *the case*, *the book*, and the reader's place.
   Everything else moves into the margins, the front matter or the back matter (table
   below). This is the direct answer to "so many pages", and it is small.
2. **The thirteenth juror.** The case moves to the front door and asks its questions
   before the first chapter. It is honest only once the second question — who is
   *responsible* — carries its evidence. Today 13 of the 28 records bear on it, and none
   comes from Book X or the Epilogue. The elder's answer, "we are each responsible to all
   for all" (Bk VI, ch. 2), and Ilusha's story need their evidence first. Without them
   the front door is a whodunnit, and a whodunnit is the prosecutor's reading of this
   book.
3. **Swear on a passage.** Each answer names a passage, chosen from what the reader has
   reached. The Atlas already records what the court did with its evidence — 7 records
   believed, 5 heard and not believed, 5 never heard — so the verdict can reveal the one
   thing about the ending nobody can spoil: whether you reasoned like the jury. Two fields
   on `VerdictRecord`; no server.
4. **The calendar and the plate.** The calendar is a static `.ics` file generated at
   build time from `data/corpus.json`. Nobody has to send anything each day, and every
   read-along can link to it. The plate is drawn from the verdict history the browser
   already keeps, set in the edition's type, marked by shape rather than by name.

The first full calendar would open on **1 July 2027**. A shorter run could come sooner:
Books X–XII from 1 November 2026, with Verdict Day on 1 December, for readers who already
know the first nine books.

## Twelve pages, three doors

| Today | Becomes |
| --- | --- |
| `/case`, seventh in the nav | **The front door** |
| `/ideas`, outside the nav | Part of the case — its voices are the evidence on the second question |
| `/ask` | A tool in the case: "cross-examine the text" |
| `/read/[id]` | **The book** — the glossed page, its help in fixed margins |
| `/who`, `/names`, `/timeline`, while reading | Margins of the glossed page |
| `/`, `/characters` | Front matter: the persons of the drama, with their plates |
| `/timeline`, `/who`, whole-book | Back matter: the wall chart and the map, as plates |
| `/translations`, `/names` | Landing pages from search, out of the nav; the translations become a colophon note |
| `/character/[id]` | Kept, as links a reader can share |

The third door is not a page but a date.

## Everything proposed, ranked

<!-- This table mirrors dossier.proposals in the frontmatter; the YAML is authoritative. -->

| | Proposal | The rule | Kind | Effort |
| --- | --- | --- | --- | --- |
| Build now | **Two doors** | The nav becomes the case, the book, and the reader's place — nothing else. | cut | S |
| Build now | **The thirteenth juror** | Twelve jurymen decided the Karamazov case. You are the thirteenth. | spine | M |
| Build now | **The second question, weighed** | The case weighs who is responsible as carefully as who killed him — from the elder's teaching to the speech at the stone. | apparatus | M |
| Build now | **Swear on a passage** | Every verdict names the passage it rests on, and at the verdict you learn which of your passages the court believed, disbelieved, or never heard. | spine | S |
| Build next | **The Karamazov calendar** | One chapter a day from 1 July: the four days end on 31 August, as the book says; two months of silence while Mitya waits; the trial from 1 November; the verdict on 1 December. | ritual | M |
| Build next | **The verdict plate** | The shape of the whole novel with your deliberation marked along it, and nothing on it that could spoil a stranger. | artifact | M |
| Build next | **The glossed page** | Every kind of help has a fixed place around the text instead of a page of its own. | apparatus | L |
| Explore | **Sort the Karamazovs** | Sort the book's name forms into its people, confirmed three at a time, ending on the name that accuses the father. | door | S |
| Explore | **The ticket** | The book's most famous argument in one sitting — Rebellion, The Grand Inquisitor, and the elder's reply. | door | S |
| Explore | **The readers' jury** | See how other readers had ruled at the same chapter, beside the novel's twelve. | ritual | L |
| Reject | **An atlas for any novel** | Generalise the pipeline into a companion for every book. | spine | L |
| Reject | **A written portrait of the reader** | Have a model describe the reader from their verdicts. | artifact | S |
| Reject | **Public margins** | Let anyone annotate the text for everyone. | apparatus | M |
| Reject | **A red-string evidence board** | A free-form corkboard where the reader strings evidence to suspects. | apparatus | L |

## What this costs

- **It reverses a decision three days old.** The illustrated companion became the front
  door on 18 September (atlas-t72d). This keeps every plate and moves them one leaf in,
  to the persons of the drama.
- **A whodunnit reading.** The second-question work guards against it, so it comes
  first.
- **Two entry points,** if `/names` and `/translations` left the site. They stay as
  URLs.
- **The silence loses readers.** Dracula Daily's one addition in five years was a
  catch-up recap. Late starters follow "Day 23 of 96" at their own pace.
- **Margins can drown a novel.** A 1912 Garnett page has no side-notes, so the margins
  stay nearly empty by default. Quoting the in-copyright translations line by line is a
  rights question, so the translations stay a note.

## A correction found on the way

[`src/lib/timeline.ts`](../src/lib/timeline.ts) says two thirds of the novel — "229,504 of
349,367 words" — covers roughly four days. The four days are Books II–IX: 217,158 words,
62.2%. The larger figure includes Book I, which the same file assigns to *Before*,
thirteen years of backstory. The segment data is right; only the comment is not.

## How this document is built

The frontmatter is a [softschema](https://github.com/jlevy/softschema) artifact: contract
`atlas.research:GrowthDossier/v1`, compiled schema
[`schemas/growth-dossier.schema.yaml`](schemas/growth-dossier.schema.yaml). The
precedents are a second artifact, `atlas.research:PrecedentRegistry/v1`, so that every
research pass shares one list. The YAML is what a script reads — to open beads, or to
check a roadmap against the proposals. This prose is the argument; nothing should parse
it.

```bash
uvx softschema@latest validate docs/research-growth.md
uvx softschema@latest validate docs/research-precedents.yaml
```

Both are `permissive`. The shapes of a proposal and of the consolidation are closed — an
unknown field fails — because consumers rely on them. Precedents stay open, because the
registry grows by description. Promote both to `enforced` when a second dossier is
written against them. Two rules JSON Schema cannot state are checked separately: precedent
ids are unique, and every `descends_from` names one of them.
