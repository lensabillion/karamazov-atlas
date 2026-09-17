import type { StaticImageData } from 'next/image';
import type { COLLAGE_PLATES } from './collage-catalogue';
import together from '@/assets/scenes/both-together.jpg';
import delirium from '@/assets/scenes/delirium.jpg';

const LARGER_ORIGINALS: Partial<Record<number, StaticImageData>> = {
  17: together,
  27: delirium,
};

/** Prefer a matched, larger user-supplied reproduction without changing the archival extract. */
export function getCollageDisplayImage(plate: (typeof COLLAGE_PLATES)[number]) {
  const original = LARGER_ORIGINALS[plate.id];
  return {
    src: original ?? plate.image,
    width: original?.width ?? plate.width,
    height: original?.height ?? plate.height,
    href: original?.src ?? plate.image,
    upgraded: Boolean(original),
  };
}
