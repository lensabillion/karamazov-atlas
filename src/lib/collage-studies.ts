import type { StaticImageData } from 'next/image';
import plate02 from '@/assets/studies/study-plate-02.jpg';
import plate08 from '@/assets/studies/study-plate-08.jpg';
import plate11 from '@/assets/studies/study-plate-11.jpg';
import plate13 from '@/assets/studies/study-plate-13.jpg';
import plate15 from '@/assets/studies/study-plate-15.jpg';
import plate20 from '@/assets/studies/study-plate-20.jpg';
import plate32 from '@/assets/studies/study-plate-32.jpg';

/**
 * Generated studies after collage plates (atlas-08gb).
 *
 * Supplied by the user on 18 September 2026 from their Desktop folder
 * "Karamazov illustrations". They are AI re-renderings of the small collage
 * extracts, not reproductions of Grigoriev: saved from a desktop app, with
 * generated filenames, each inventing detail the extract does not contain.
 *
 * Design-system §6 allows a generated study only under stricter labelling than
 * a reproduction, so each is shown behind a disclosure, under the native
 * extract it follows, captioned as AI-generated, never attributed to Grigoriev,
 * never used as evidence for what a picture shows. `invented` says what the
 * study adds, so a reader can see the difference for themselves.
 *
 * Two supplied studies are deliberately left out, because their inventions
 * change the subject: plate 21's turns the prone figure into a woman and adds
 * a seated man; plate 31's turns a reflection in a mirror into a person in the
 * room. Provenance and hashes: src/assets/studies/README.md.
 */
export interface CollageStudy {
  plateId: number;
  image: StaticImageData;
  /** What the study shows that the collage extract does not. */
  invented: string;
}

export const COLLAGE_STUDIES: CollageStudy[] = [
  { plateId: 2, image: plate02,
    invented: 'The extract already has the house, the crescent moon, the sunflowers and the old woman at the fence; the study sharpens them and adds the carpentry, the lit windows, the flowers and the texture of oil paint.' },
  { plateId: 8, image: plate08,
    invented: 'It extends the picture beyond the extract: the monastery gate, the monk walking away, the benches and the building at the right are generated, not seen.' },
  { plateId: 11, image: plate11,
    invented: 'The sunset, the town and river beyond the curtains, the cracked window, the rug and the signature are added, and the mask-like faces are repainted as realistic ones.' },
  { plateId: 13, image: plate13,
    invented: 'Enlarged about eight times: every fine detail of the face, the headscarf, the barred windows and the brickwork is generated.' },
  { plateId: 15, image: plate15,
    invented: 'The icon, candle, books, rugs and the snowy view through the window are added or elaborated, and every face is repainted.' },
  { plateId: 20, image: plate20,
    invented: 'The church domes and bell tower, the detail of the painted saints and the texture of the trees are generated; the faces are repainted.' },
  { plateId: 32, image: plate32,
    invented: 'The legible shop signs, the lamp post, the church skyline and a realistic face — in place of Grigoriev’s mask-like one — are all generated.' },
];

/** Plates whose supplied study was excluded, and why. Kept so the omission is visible, not silent. */
export const EXCLUDED_STUDIES: Record<number, string> = {
  21: 'The study turns the prone figure into a woman in a dress and adds a man sitting on a stump.',
  31: 'The study turns the arched shapes — plausibly mirrors — into empty alcoves and a reflected figure into a man in the room.',
};

export const studyFor = (plateId: number) => COLLAGE_STUDIES.find((s) => s.plateId === plateId);
