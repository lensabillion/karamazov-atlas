# Historical Illustration Placement

## Decision

The homepage now opens with a generated study after Grigoriev's *Pavel Smerdyakov*,
requested by the user as a concrete visual experiment. The same study appears beside
Smerdyakov's character plate, labeled as AI-generated. Scene links precede corpus
statistics so returning readers can enter through remembered people and moments.
Generation provenance is recorded in `src/assets/artwork/README.md`.

### Focused presentation pass

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
