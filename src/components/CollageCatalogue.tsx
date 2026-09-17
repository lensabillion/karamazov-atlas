import Image from 'next/image';
import { COLLAGE_PLATES } from '@/lib/collage-catalogue';
import { getChapter, getCharacter } from '@/lib/corpus';
import './collage-catalogue.css';

const IDENTIFICATION_LABELS = {
  identified: 'Identified from a reference',
  probable: 'Probable match · not confirmed',
  unidentified: 'Not yet identified',
} as const;

/** An annotated contact sheet, kept distinct from the larger illustrated spreads. */
export default function CollageCatalogue() {
  return (
    <section className="collage-catalogue" id="artwork-catalogue" aria-labelledby="catalogue-title">
      <header className="section-header">
        <p className="eyebrow">Boris Grigoriev · From the supplied collage</p>
        <h2 className="heading" id="catalogue-title">A catalogue of the illustrations</h2>
        <p className="text-muted collage-catalogue__note">
          Each picture has been separated from the collage, without redrawing or AI enhancement.
          These small reproductions retain the original’s limited resolution; opening an image
          makes it easier to inspect, but cannot reveal detail absent from the source.
        </p>
      </header>

      <details className="collage-catalogue__disclosure">
        <summary>View all {COLLAGE_PLATES.length} extracted illustrations &amp; their identifications</summary>
        <p className="text-muted collage-catalogue__key">
          Confirmed matches link to related people and reading passages. Probable matches are
          marked as such; unidentified pictures keep a visual description instead of an invented title.
        </p>
        <div className="collage-catalogue__grid">
          {COLLAGE_PLATES.map((plate) => {
            const chapter = plate.status === 'identified' && plate.chapter
              ? getChapter(plate.chapter) : undefined;
            return (
              <article className="collage-catalogue__plate" key={plate.id}
                id={`collage-plate-${plate.id}`} aria-labelledby={`collage-title-${plate.id}`}>
                <figure>
                  <a className="collage-catalogue__image-link" href={plate.image}
                    target="_blank" rel="noopener noreferrer"
                    aria-label={`Open illustration ${plate.id}: ${plate.title} (new tab)`}>
                    <Image src={plate.image} width={plate.width} height={plate.height}
                      alt={`${plate.title} — illustration ${plate.id} extracted from the supplied collage.`}
                      sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 30vw"
                      loading="lazy" />
                  </a>
                  <figcaption>
                    <p className="eyebrow">Illustration {String(plate.id).padStart(2, '0')}</p>
                    <h3 className="collage-catalogue__title" id={`collage-title-${plate.id}`}>{plate.title}</h3>
                    <p className="meta collage-catalogue__confidence">{IDENTIFICATION_LABELS[plate.status]}</p>
                    <p className="text-muted">{plate.description}</p>
                  </figcaption>
                </figure>
                <div className="collage-catalogue__links">
                  {plate.status === 'identified' && plate.people.map((id) => {
                    const person = getCharacter(id);
                    return person ? <a className="link" key={id} href={`/character/${id}`}>{person.short}</a> : null;
                  })}
                  {chapter && <a className="link" href={`/read/${chapter.id}`}>Read {chapter.cite} →</a>}
                  {plate.source && <a className="link" href={plate.source}>
                    {plate.status === 'identified' ? 'Identification source' : 'Comparison source'} ↗
                  </a>}
                  <a className="link" href={plate.image} target="_blank" rel="noopener noreferrer"
                    aria-label={`Open illustration ${plate.id} in a new tab`}>
                    Open image ↗
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </details>
      <a className="link" href="/artwork/grigoriev-collage.zip" download>Download all 36 extracts &amp; the identification guide ↓</a>
      <a className="meta collage-catalogue__back" href="#contents">Back to contents ↑</a>
    </section>
  );
}
