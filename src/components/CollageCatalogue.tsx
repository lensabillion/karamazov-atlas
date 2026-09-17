import Image from 'next/image';
import { COLLAGE_PLATES } from '@/lib/collage-catalogue';
import { getCollageDisplayImage } from '@/lib/collage-display-images';
import { getChapter, getCharacter } from '@/lib/corpus';
import { STORY_MOVEMENTS } from '@/lib/illustration-stories';
import Ornament from './Ornament';
import './collage-catalogue.css';

type CollagePlate = (typeof COLLAGE_PLATES)[number];

const UNCONFIRMED_PLATES = COLLAGE_PLATES.filter((plate) => plate.status !== 'identified');
const IDENTIFICATION_LABELS = {
  identified: 'Identified from a reference',
  probable: 'Probable match · not confirmed',
  unidentified: 'Not yet identified',
} as const;

function IllustrationFigure({ plate }: { plate: CollagePlate }) {
  const image = getCollageDisplayImage(plate);
  const displayWidth = Math.min(image.width, 440, 440 * image.width / image.height);

  return (
    <figure className="collage-catalogue__figure">
      <a className="collage-catalogue__image-link" href={image.href}
        target="_blank" rel="noopener noreferrer" style={{ width: displayWidth }}
        aria-label={`Open illustration ${plate.id}: ${plate.title} (new tab)`}>
        <Image src={image.src} width={image.width} height={image.height}
          alt={plate.description} loading="lazy" unoptimized />
      </a>
      <figcaption className="collage-catalogue__caption">
        <p className="collage-catalogue__artwork-title">{plate.title}</p>
        <p className="meta">
          Boris Grigoriev · {image.upgraded ? 'Larger supplied reproduction' : 'Extract from the supplied collage'}
        </p>
        <a className="link" href={image.href} target="_blank" rel="noopener noreferrer"
          aria-label={`Open illustration ${plate.id} in a new tab`}>Open image ↗</a>
      </figcaption>
    </figure>
  );
}

function ArtworkReferences({ plate, chapterId }: { plate: CollagePlate; chapterId: string | undefined }) {
  const chapter = chapterId ? getChapter(chapterId) : undefined;
  const displayImage = getCollageDisplayImage(plate);

  return (
    <details className="collage-catalogue__references">
      <summary>People, passage &amp; artwork source</summary>
      <div className="collage-catalogue__links">
        {plate.people.map((id) => {
          const person = getCharacter(id);
          return person ? <a className="link" key={id} href={`/character/${id}`}>{person.short}</a> : null;
        })}
        {chapter && <a className="link" href={`/read/${chapter.id}`}>Related reading: {chapter.cite} · {chapter.title} →</a>}
        {plate.source && <a className="link" href={plate.source}>Artwork identification source ↗</a>}
        {displayImage.upgraded && <a className="link" href={plate.image}
          target="_blank" rel="noopener noreferrer">Open the original collage extract ↗</a>}
      </div>
    </details>
  );
}

/** A guided reading of the confirmed artworks, with unresolved extracts kept separate. */
export default function CollageCatalogue() {
  return (
    <section className="collage-catalogue" id="artwork-catalogue" aria-labelledby="catalogue-title">
      <header className="section-header">
        <p className="eyebrow">Boris Grigoriev · A companion in pictures</p>
        <h2 className="heading" id="catalogue-title">The story, remembered through its images</h2>
        <p className="text-muted collage-catalogue__note">
          A blessing, a humiliation, a promise overheard. These illustrations lead us back to
          the moments that bind the Karamazovs together. Follow five movements through the
          novel, or pause with a single picture. The notes discuss the whole story, including its ending.
        </p>
      </header>

      <nav className="collage-catalogue__contents" aria-label="Illustrated story movements">
        <ol>
          {STORY_MOVEMENTS.map((movement) => (
            <li key={movement.id}>
              <a href={`#${movement.id}`}><span className="collage-catalogue__numeral">{movement.numeral}.</span> {movement.title}</a>
            </li>
          ))}
        </ol>
        <a className="link" href="#unresolved-illustrations">Unconfirmed illustrations ↓</a>
      </nav>

      <div className="collage-catalogue__movements">
        {STORY_MOVEMENTS.map((movement, movementIndex) => (
          <section className="collage-catalogue__movement" key={movement.id}
            id={movement.id} aria-labelledby={`${movement.id}-title`}>
            <header className="collage-catalogue__movement-heading">
              <p className="eyebrow">Movement {movement.numeral}</p>
              <h3 id={`${movement.id}-title`}>{movement.title}</h3>
              <p className="text-muted">{movement.introduction}</p>
            </header>
            {movement.entries.map((entry) => {
              const plate = COLLAGE_PLATES.find((item) => item.id === entry.plateId);
              if (!plate || plate.status !== 'identified') {
                throw new Error(`Story illustration ${entry.plateId} must have a confirmed identification.`);
              }

              return (
                <article className="collage-catalogue__spread" key={plate.id}
                  id={`collage-plate-${plate.id}`} aria-labelledby={`collage-title-${plate.id}`}>
                  <IllustrationFigure plate={plate} />
                  <div className="collage-catalogue__story book-description">
                    <p className="plate__series">Illustration {String(plate.id).padStart(2, '0')}</p>
                    <h4 className="plate__name collage-catalogue__story-title" id={`collage-title-${plate.id}`}>{entry.heading}</h4>
                    <hr className="plate__rule" />
                    <p className="plate__epithet collage-catalogue__story-prose">{entry.story}</p>
                    <Ornament />
                    <dl className="collage-catalogue__reading-notes">
                      <div>
                        <dt className="plate__series">Looking closely</dt>
                        <dd>{entry.looking}</dd>
                      </div>
                      <div>
                        <dt className="plate__series">Remember this</dt>
                        <dd>{entry.remember}</dd>
                      </div>
                    </dl>
                    <ArtworkReferences plate={plate} chapterId={entry.chapter ?? plate.chapter} />
                  </div>
                </article>
              );
            })}
            <div className="collage-catalogue__movement-footer">
              <a className="meta" href="#artwork-catalogue">Back to the movements ↑</a>
              {STORY_MOVEMENTS[movementIndex + 1] && <a className="link"
                href={`#${STORY_MOVEMENTS[movementIndex + 1]!.id}`}>
                Next: {STORY_MOVEMENTS[movementIndex + 1]!.title} →
              </a>}
            </div>
          </section>
        ))}
      </div>

      <section className="collage-catalogue__unresolved" id="unresolved-illustrations"
        aria-labelledby="unresolved-title">
        <h3 className="collage-catalogue__subheading" id="unresolved-title">Pictures still awaiting their place</h3>
        <p className="text-muted collage-catalogue__note">
          These {UNCONFIRMED_PLATES.length} extracts are part of the same supplied collage, but their subjects
          have not been securely identified. They remain here as an illustrated appendix, not as scenes
          assigned a place in the story.
        </p>
        <details className="collage-catalogue__disclosure">
          <summary>Inspect the {UNCONFIRMED_PLATES.length} unconfirmed illustrations</summary>
          <div className="collage-catalogue__grid">
            {UNCONFIRMED_PLATES.map((plate) => (
              <article className="collage-catalogue__plate" key={plate.id}
                id={`collage-plate-${plate.id}`} aria-labelledby={`collage-title-${plate.id}`}>
                <IllustrationFigure plate={plate} />
                <div className="collage-catalogue__unconfirmed-description book-description">
                  <p className="plate__series">Illustration {String(plate.id).padStart(2, '0')}</p>
                  <h4 className="collage-catalogue__title" id={`collage-title-${plate.id}`}>{plate.title}</h4>
                  <p className="meta collage-catalogue__confidence">{IDENTIFICATION_LABELS[plate.status]}</p>
                  <p className="text-muted">{plate.description}</p>
                  {plate.source && <a className="link" href={plate.source}>Comparison source ↗</a>}
                </div>
              </article>
            ))}
          </div>
        </details>
      </section>

      <footer className="collage-catalogue__footer">
        <p className="meta collage-catalogue__note">
          Original colours and complete extracted compositions are preserved. Where a larger supplied
          reproduction exists, it replaces the small collage image. Small extracts are shown at their
          native size or smaller; opening one cannot recover detail missing from the source.
        </p>
        <a className="link" href="/artwork/grigoriev-collage.zip" download>Download all {COLLAGE_PLATES.length} extracts &amp; the identification guide ↓</a>
        <a className="meta collage-catalogue__back" href="#contents">Back to contents ↑</a>
      </footer>
    </section>
  );
}
