# Historical Illustration Placement

## Collage Catalogue · 17 September 2026

The homepage now includes an expandable catalogue of 36 native-resolution extracts
from the user's collage. A source-image review confirms 21 subjects; seven are
explicitly provisional and eight remain descriptively unidentified. Uncertain
entries have no character or chapter links. A separate image-opening link lets the
reader inspect each crop, and a ZIP contains all files and the identification guide.
The full table and sources are in `public/artwork/grigoriev-collage/README.md`;
`src/assets/collage/crop-bounds.json` records reproducible pixel bounds.

The supplied guitar scene was already included byte-for-byte as
`src/assets/scenes/smerdyakov-guitar.jpg`, following Smerdyakov's character spread.
The scene contents are now open by default so its title and jump link are not hidden.
Existing higher-resolution scene art and the approved portrait studies are unchanged.

Review corrections: two touching images in the collage were separated into plates 28
and 36; a hat-wearing portrait is Katerina, not a boy; the seated figure in plate 18 is
not confidently Lise; plate 34 is not the published *Ivan in his father's house*.
Enlargement does not restore absent detail, and the catalogue says so explicitly.

Validation: all 36 PNGs match the corresponding source pixels exactly. The test
suite, type checks and 133-page production build pass. Generated homepage HTML
contains 51 images, all 36 catalogue entries, one primary heading, the guitar-scene
anchor and no duplicate IDs or dangling fragment links. The download contains
36 PNGs and the identification guide. Independent source-level review found no
blocking issues; live responsive and interaction checks remain tracked in
`atlas-znk4` because browser access was blocked by the app approval service.

## Decision

The homepage presents nine illustrated character plates and six original scene
spreads, with all 27 character introductions visible on the page. Each person has a
link to further details; each scene pairs its full composition with a reminder and
a chapter link. The remaining 18 people have typographic plates, without fabricated
portrait placeholders. Contents disclosures jump directly to any person or scene.
The existing analytical pages, mention counts, passage shortcuts, and full chapter
index remain accessible through “Explore the text.”

The six user-supplied original illustrations and their verified source mappings are
documented in `src/assets/scenes/README.md`. Dates in their captions follow the
magazine, and the text descriptions follow the local Garnett chapters.

### Homepage Review · 17 September 2026

- Reused `CharacterPlate`, including figures, name forms, and patronymic, rather
  than approximating the user's screenshot with a new card design.
- Added missing introductions for Nikolay, Paissy, Maximov, Trifon, and Perhotin;
  the homepage, cast index, and detail pages share the same biographies.
- Added checks for complete biography/name-data coverage, scene assets, unique
  anchors, and valid participant/chapter references. The biography test failed
  before the five missing descriptions were added, then passed.
- Independent code review found no actionable correctness or accessibility defect.
- Type checks, the complete frontend test suite, and the 133-page production build
  pass. Static homepage output contains nine generated-study captions, six historical
  scene captions, 15 images, one primary heading, and no dangling in-page links.
- Browser inspection was blocked by the app's usage-limit approval failure.
  Responsive spacing and live image loading are not claimed as verified for this
  homepage revision.

### Character Artwork Coverage

Every named character in the linked Grigoriev selection now has an illustration
beside their biography on the cast index and on their individual character page.
Seven labeled generated studies cover nine people:

| Character | Study after Grigoriev |
| --- | --- |
| Alyosha and Zossima | Father Zosima blesses Alyosha |
| Dmitri and Katerina | Katerina Ivanovna and Dmitri Karamazov |
| Ivan | Ivan Karamazov and Smerdyakov |
| Smerdyakov | Pavel Smerdyakov (the previously approved study) |
| Fyodor | Fyodor Pavlovich Karamazov in his room |
| Grushenka | Agrafena (Grushenka) |
| Lizaveta | The Reeking Lizaveta |

This is complete coverage of the article's named characters, not a claim that
unillustrated cast members have never appeared in art. Anonymous figures in the jury
and crowd scenes are not assigned invented identities. All 27 cast entries and the
existing application features remain available. Shared scenes are never cropped to
simulate individual portraits. The six additional image prompts and sources are in
`src/assets/artwork/CAST-STUDIES.md`.

Review: the shared artwork registry is now appropriate for seven reusable assets,
replacing the one-character special case. Each illustration carries descriptive alt
text and its generated-study attribution. Browser checks verified all nine individual
pages load an illustration with attribution and no desktop overflow; the cast index
retains 27 entries and nine illustrated biographies at desktop and 390px widths.
Type-checking, the full test suite, and the 133-page production build pass.

### Initial visual study (historical implementation note)

The homepage now opens with a generated study after Grigoriev's *Pavel Smerdyakov*,
requested by the user as a concrete visual experiment. The same study appears beside
Smerdyakov's character plate, labeled as AI-generated. Scene links precede corpus
statistics so returning readers can enter through remembered people and moments.
Generation provenance is recorded in `src/assets/artwork/README.md`.

### Focused presentation pass (historical implementation note)

The Characters page pairs the approved Smerdyakov study with the existing biography
in a two-column book-like spread, stacking on phones. Cast descriptions now sit
below their names, left-aligned for reading. All 27 cast links and every existing
page and feature remain; the homepage is unchanged in this pass.

Review: no actionable defects found. The shared illustration component preserves
its attribution, and the biography comes from the existing character data rather
than a duplicate. Desktop and 390px browser checks confirm the image loads, the
spread changes from two columns to one, descriptions remain left-aligned, all cast
links remain, and there is no horizontal page overflow. Type-checking, all tests,
and the production build pass. No new dependencies or client-side state were added.

Boris Grigoriev's 58-sheet cycle is the strongest visual source for the cast.
It depicts named characters and scenes from the novel and has the period distance
the atlas needs without imitating an image model. The 1912 Garnett edition itself
remains unillustrated.

The linked 2023 article credits its reproductions to the Fabergé Museum, and the
museum announced a new album and exhibition of the complete cycle in 2026. Those
web and product reproductions are reference material, not repository assets, until
a source grants reuse or a rights holder supplies files for this project.

## Placement

| Work | Destination |
| --- | --- |
| Character studies of Smerdyakov, Grushenka, and Fyodor | Individual character plate, between the title and the textual figures |
| Zossima blessing Alyosha | Alyosha and Zossima plates; Book II chapter 6 |
| Katerina and Dmitri | Both character plates; the relevant chapter once identified |
| Ivan and Smerdyakov | Both character plates; Book XI chapter 8 |
| The party in Mokroye | Dmitri and Grushenka plates; Book VIII chapter 7; timeline event |
| Interrogation of Katerina | Katerina plate; trial section after chapter verification |
| Jury in court | Trial band of the timeline; Book XII overview |
| Monastery | Reading overview for Books II and VI |

Each reproduction should remain a rectangular print on the paper ground: no
cropping into circles, no faux photographic frame, no filter, and no decorative
colour treatment. Captions use the existing small-cap label style and identify
artist, title, approximate date, holding collection, and source.

## Sources

- Gateway to Russia, “Illustrations for ‘The Brothers Karamazov’ by Boris
  Grigoriev,” 22 October 2023
- Fabergé Museum, exhibition and album announcements for the 58-sheet cycle,
  2023–24 and 2026
