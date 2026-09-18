import { notFound } from 'next/navigation';
import CharacterPlate from '@/components/CharacterPlate';
import { getNamed } from '@/lib/names';
import { CHARACTER_BIOGRAPHIES } from '@/lib/character-biographies';
import '@/app/plate.css';
import { getCharacter, getMentions, ordinalOf, presenceOf } from '@/lib/corpus';
import { HISTORICAL_ILLUSTRATIONS } from '@/lib/historical-illustrations';
import CharacterIllustration from '@/components/CharacterIllustration';
import { CHARACTER_ARTWORK } from '@/lib/character-artwork';

export function generateStaticParams() {
  return getMentions().characters.map((c) => ({ id: c.id }));
}

export default async function CharacterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const character = getCharacter(id);
  if (!character) notFound();

  const { edges, characters } = getMentions();
  const presence = presenceOf(id);
  const peak = Math.max(...presence.map((p) => p.count), 1);
  const nameOf = (cid: string) => characters.find((c) => c.id === cid)?.short ?? cid;

  // A pair is folded until the first chapter they share, so the list does not
  // announce who this person will end up beside.
  const ties = edges
    .filter((e) => e.source === id || e.target === id)
    .map((e) => ({
      other: e.source === id ? e.target : e.source,
      weight: e.weight,
      from: e.chapters.length ? Math.min(...e.chapters.map(ordinalOf)) : undefined,
    }))
    .slice(0, 10);

  const busiest = [...presence].sort((a, b) => b.count - a.count).slice(0, 6);

  // The plate needs the morphology data; the rest of the page uses the mention
  // index. Both are keyed by the same id.
  const named = getNamed(id);
  const epithet = CHARACTER_BIOGRAPHIES[id];
  const totalChapters = presence.length;
  const historicalWorks = HISTORICAL_ILLUSTRATIONS[id] ?? [];
  const artwork = CHARACTER_ARTWORK[id];

  return (
    <main className={`page group-${character.group}`}>
      <div className="character-opening" data-illustrated={Boolean(artwork)}>
        {artwork && <CharacterIllustration artwork={artwork} eager />}
        {named ? (
          <CharacterPlate
            character={named}
            chapterCount={character.chapterCount}
            totalChapters={totalChapters}
            epithet={epithet}
          />
        ) : (
          <header className="page-header">
            <p className="eyebrow">{character.group}</p>
            <h1 className="title">{character.name}</h1>
          </header>
        )}
      </div>

      {historicalWorks.length > 0 && (
        <aside className="plate-art-record">
          <p className="plate__series">In the historical record</p>
          <p className="text-muted">
            Boris Grigoriev drew {historicalWorks.map((work, index) => (
              <span key={work}>{index > 0 ? ' and ' : ''}<cite>{work}</cite></span>
            ))} for his cycle of illustrations of the novel.
          </p>
          <a className="link" href="https://www.gw2ru.com/arts/1392-karamazov-illustrations-grigoriev">
            See the historical illustration ↗
          </a>
        </aside>
      )}

      <section className="section">
        <div className="section-header">
          <h2 className="heading">Presence across the novel</h2>
          <p className="text-muted">
            One bar per chapter, in reading order. Height is mentions in that chapter.
            If you have set your place in the book, the strip stops there.
          </p>
        </div>
        <div className="scroll-x">
          <div className="sparkbar">
            {presence.map(({ chapter, count }, i) => (
              <a
                className="sparkbar__bar"
                key={chapter.id}
                data-spoiler-from={i + 1}
                href={`/read/${chapter.id}`}
                data-empty={count === 0}
                title={`${chapter.cite} — ${chapter.title}: ${count}`}
                style={{ height: `${Math.max(2, (count / peak) * 100)}%` }}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="grid">
        <section className="section">
          <h2 className="heading">Shares chapters with</h2>
          <div className="stack stack--tight">
            {ties.map((t) => (
              <a className="bar-row" key={t.other} href={`/character/${t.other}`}
                data-spoiler-from={t.from}>
                <span>{nameOf(t.other)}</span>
                <span className="bar-track">
                  <span
                    className="bar-fill"
                    style={{ width: `${(t.weight / ties[0]!.weight) * 100}%` }}
                  />
                </span>
                <span className="meta">{t.weight}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="section">
          <h2 className="heading">Densest chapters</h2>
          <ul className="list">
            {busiest.map(({ chapter, count }) => (
              <li key={chapter.id} data-spoiler-from={ordinalOf(chapter.id)}>
                <a className="list-item" href={`/read/${chapter.id}`}>
                  <span className="list-item__label">{chapter.title}</span>
                  <span className="meta">
                    {chapter.cite} · {count}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
