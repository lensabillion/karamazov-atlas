import type { StaticImageData } from 'next/image';
import smerdyakov from '@/assets/artwork/smerdyakov-after-grigoriev.png';
import zossimaAlyosha from '@/assets/artwork/zossima-alyosha-after-grigoriev.png';
import katerinaDmitri from '@/assets/artwork/katerina-dmitri-after-grigoriev.png';
import ivanSmerdyakov from '@/assets/artwork/ivan-smerdyakov-after-grigoriev.png';
import grushenka from '@/assets/artwork/grushenka-after-grigoriev.png';
import fyodor from '@/assets/artwork/fyodor-after-grigoriev.png';
import lizaveta from '@/assets/artwork/lizaveta-after-grigoriev.png';

/** A reference-based study, never presented as an original Grigoriev work. */
export type CharacterArtwork = {
  image: StaticImageData;
  title: string;
  alt: string;
};

const blessing: CharacterArtwork = {
  image: zossimaAlyosha,
  title: 'Father Zosima blesses Alyosha',
  alt: 'Study of the white-bearded elder Zossima resting his hand on the bowed head of the young Alyosha, both in dark robes.',
};

const bow: CharacterArtwork = {
  image: katerinaDmitri,
  title: 'Katerina Ivanovna and Dmitri Karamazov',
  alt: 'Study of Katerina bowing low at the left, with Dmitri in uniform at the right, in a room with a tall mirror and curtained window.',
};

/** Covers every named cast member in the linked article, including shared scenes. */
export const CHARACTER_ARTWORK: Partial<Record<string, CharacterArtwork>> = {
  alyosha: blessing,
  zossima: blessing,
  dmitri: bow,
  katerina: bow,
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
