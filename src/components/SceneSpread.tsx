import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import Ornament from './Ornament';
import Spoiler from './Spoiler';
import { ILLUSTRATED_SCENES, SCENE_SOURCE } from '@/lib/illustrated-scenes';
import { getChapter, getCharacter, ordinalOf } from '@/lib/corpus';
import brandy from '@/assets/scenes/over-the-brandy.jpg';
import confession from '@/assets/scenes/passionate-heart.jpg';
import guitar from '@/assets/scenes/smerdyakov-guitar.jpg';
import together from '@/assets/scenes/both-together.jpg';
import delirium from '@/assets/scenes/delirium.jpg';
import captain from '@/assets/scenes/alyosha-snegiryov.jpg';

type Scene = (typeof ILLUSTRATED_SCENES)[number];
const IMAGES: Record<Scene['file'], StaticImageData> = {
  'over-the-brandy.jpg': brandy,
  'passionate-heart.jpg': confession,
  'smerdyakov-guitar.jpg': guitar,
  'both-together.jpg': together,
  'delirium.jpg': delirium,
  'alyosha-snegiryov.jpg': captain,
};

/** An original scene opposite its reading companion, without cropping the artwork. */
export default function SceneSpread({ scene }: { scene: Scene }) {
  const chapter = getChapter(scene.chapter)!;
  return (
    <Spoiler from={ordinalOf(scene.chapter)} cite={chapter.cite} what={`The scene “${scene.title}”`}>
    <article className="folio-spread folio-scene" id={`scene-${scene.id}`}
      aria-labelledby={`scene-title-${scene.id}`}>
      <figure className="character-illustration">
        <Image src={IMAGES[scene.file]} alt={scene.alt}
          sizes="(max-width: 760px) 90vw, 50vw" loading="lazy" />
        <figcaption>
          <span className="eyebrow">Boris Grigoriev · {scene.artworkTitle}</span>
          <span className="meta">1916–1932 · Historical illustration · <a className="link" href={SCENE_SOURCE}>Source &amp; credits ↗</a></span>
          <span className="meta">Private collection · Reproduced in Sotheby’s, 2007</span>
        </figcaption>
      </figure>
      <div className="folio-scene__text plate book-description">
        <p className="plate__series">A scene remembered · {chapter.cite}</p>
        <h2 className="plate__name" id={`scene-title-${scene.id}`}>{scene.title}</h2>
        <hr className="plate__rule" />
        <p className="plate__epithet">{scene.description}</p>
        <Ornament />
        <dl className="folio-scene__notes">
          <div><dt className="eyebrow">Look closely</dt><dd>{scene.looking}</dd></div>
          <div><dt className="eyebrow">Why it matters</dt><dd>{scene.note}</dd></div>
        </dl>
        <nav className="folio-participants" aria-label={`People in ${scene.title}`}>
          {scene.people.map((id) => (
            <a className="link" href={`/character/${id}`} key={id}>{getCharacter(id)!.short}</a>
          ))}
        </nav>
        <a className="link folio-more" href={`/read/${scene.chapter}`}>Read the scene →</a>
      </div>
      <a className="folio-back meta" href="#contents">Back to contents ↑</a>
    </article>
    </Spoiler>
  );
}
