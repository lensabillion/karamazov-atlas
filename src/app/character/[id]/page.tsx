import { notFound } from 'next/navigation';
import { getCharacter, getMentions, presenceOf } from '@/lib/corpus';

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

  const ties = edges
    .filter((e) => e.source === id || e.target === id)
    .map((e) => ({ other: e.source === id ? e.target : e.source, weight: e.weight }))
    .slice(0, 10);

  const busiest = [...presence].sort((a, b) => b.count - a.count).slice(0, 6);

  return (
    <main className={`page group-${character.group}`}>
      <header className="page-header">
        <p className="eyebrow">{character.group}</p>
        <h1 className="title">{character.name}</h1>
        <p className="text-muted">
          Named {character.total.toLocaleString()} times across {character.chapterCount} of 96
          chapters. Counted as: {character.aliases.join(', ')}.
        </p>
      </header>

      <section className="section">
        <div className="section-header">
          <h2 className="heading">Presence across the novel</h2>
          <p className="text-muted">
            One bar per chapter, in reading order. Height is mentions in that chapter.
          </p>
        </div>
        <div className="scroll-x">
          <div className="sparkbar">
            {presence.map(({ chapter, count }) => (
              <a
                className="sparkbar__bar"
                key={chapter.id}
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
              <a className="bar-row" key={t.other} href={`/character/${t.other}`}>
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
              <li key={chapter.id}>
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
