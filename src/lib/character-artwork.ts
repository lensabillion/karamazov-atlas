import type { StaticImageData } from 'next/image';
import smerdyakov from '@/assets/artwork/smerdyakov-after-grigoriev.png';
import zossimaAlyosha from '@/assets/artwork/zossima-alyosha-after-grigoriev.png';
import katerinaDmitri from '@/assets/artwork/katerina-dmitri-after-grigoriev.png';
import ivanSmerdyakov from '@/assets/artwork/ivan-smerdyakov-after-grigoriev.png';
import grushenka from '@/assets/artwork/grushenka-after-grigoriev.png';
import fyodor from '@/assets/artwork/fyodor-after-grigoriev.png';
import lizaveta from '@/assets/artwork/lizaveta-after-grigoriev.png';
import katerinaPortrait from '@/assets/studies/study-plate-13.jpg';

/** A reference-based study, never presented as an original Grigoriev work. */
export type CharacterArtwork = {
  image: StaticImageData;
  title: string;
  alt: string;
  /** Where the work it follows is published; defaults to the museum selection. */
  source?: string;
};

const TRETYAKOV_2023 = 'https://www.tretyakovgallerymagazine.ru/articles/3-4-2023-80-81/obrazy-dostoevskogo-i-gogolya-v-pozdnem-tvorchestve-borisa-grigoreva-mezhdu-';

const blessing: CharacterArtwork = {
  image: zossimaAlyosha,
  title: 'Father Zosima blesses Alyosha',
  alt: 'Study of the white-bearded elder Zossima resting his hand on the bowed head of the young Alyosha, both in dark robes.',
};

/**
 * A scene, not a portrait: it illustrates Dmitri's story of the bow (III.4)
 * and appears with that scene in the collage catalogue. Katerina has her own
 * portrait below; the user asked (18 Sep 2026) that a person be shown by a
 * picture of that person, and a scene by the scene.
 */
export const bow: CharacterArtwork = {
  image: katerinaDmitri,
  title: 'Katerina Ivanovna and Dmitri Karamazov',
  alt: 'Study of Katerina bowing low at the left, with Dmitri in uniform at the right, in a room with a tall mirror and curtained window.',
};

/** Covers every named cast member in the linked article, including shared scenes. */
export const CHARACTER_ARTWORK: Partial<Record<string, CharacterArtwork>> = {
  alyosha: blessing,
  zossima: blessing,
  dmitri: bow,
  katerina: {
    image: katerinaPortrait,
    title: 'Katerina Ivanovna',
    alt: 'Study of Katerina Ivanovna, eyes lowered, in a fringed headscarf and a blue coat, before a red building with barred windows.',
    source: TRETYAKOV_2023,
  },
  ivan: {
    image: ivanSmerdyakov,
    title: 'Ivan Karamazov and Smerdyakov',
    alt: 'Study of Ivan and Smerdyakov at a wooden gate beneath the moon: one man turns through the gate while the other stands beside the fence.',
  },
  smerdyakov: {
    image: smerdyakov,
    title: 'Pavel Smerdyakov',
    alt: 'A drawn study of Smerdyakov seated by a wooden door, turning his sharp, wary face over the shoulder of a heavy olive coat.',
  },
  fyodor: {
    image: fyodor,
    title: 'Fyodor Pavlovich Karamazov in his room',
    alt: 'Study of a balding Fyodor in a grey dressing gown, seated amid mirrors, chairs and houseplants.',
  },
  grushenka: {
    image: grushenka,
    title: 'Agrafena (Grushenka)',
    alt: 'Study of Grushenka with centre-parted brown hair, dark expressive eyes and flushed cheeks, wearing a blue garment patterned with orange spirals.',
  },
  lizaveta: {
    image: lizaveta,
    title: 'The Reeking Lizaveta',
    alt: 'Study of barefoot Lizaveta seated on a rustic fence in a pale dress, with a thatched shed and a birch tree nearby.',
  },
};
