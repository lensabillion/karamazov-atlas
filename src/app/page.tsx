import { getBooks, getCorpus, getMentions } from '@/lib/corpus';

export default function Home() {
  const corpus = getCorpus();
  const books = getBooks();
  const { characters, edges } = getMentions();
  const top = characters.slice(0, 12);
  const max = top[0]!.total;

  const stats: [string, string][] = [
    ['Words', corpus.wordCount.toLocaleString()],
    ['Chapters', String(corpus.chapters.length)],
    ['Books', String(books.length - 1)],
    ['Characters', String(characters.length)],
    ['Ties', String(edges.length)],
  ];

  return (
    <main className="page">
      <header className="page-header">
        <p className="eyebrow">Fyodor Dostoyevsky · 1880 · trans. Constance Garnett</p>
        <h1 className="title">The Brothers Karamazov, taken apart</h1>
        <p className="lede">
          The full text — {corpus.wordCount.toLocaleString()} words across{' '}
          {corpus.chapters.length} chapters — parsed into a corpus you can read, search, and
          interrogate. Every figure on this page is computed from the source file, not asserted.
        </p>
      </header>

      <section className="row row--wide">
        {stats.map(([label, value]) => (
          <div className="stat" key={label}>
            <span className="stat__value">{value}</span>
            <span className="eyebrow">{label}</span>
          </div>
        ))}
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="heading">Who is actually in this novel</h2>
          <p className="text-muted">
            Mention counts with aliases resolved — Dmitri, Mitya, Mitka and Dmitri Fyodorovitch
            counted as one person. Overlapping names are claimed longest-first, so nothing is
            double-counted.
          </p>
        </div>
        <div className="stack stack--tight">
          {top.map((c) => (
            <a className={`bar-row group-${c.group}`} key={c.id} href={`/character/${c.id}`}>
              <span>{c.short}</span>
              <span className="bar-track">
                <span
                  className="bar-fill"
                  style={{ width: `${Math.max(2, (c.total / max) * 100)}%` }}
                />
              </span>
              <span className="meta">
                {c.total} · {c.chapterCount} ch
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="heading">The architecture</h2>
        <div className="grid">
          {books.map((b) => (
            <article className="card" key={b.num}>
              <p className="eyebrow">{b.part}</p>
              <h3 className="subheading">
                {b.num === 13 ? 'Epilogue' : `${b.num}. ${b.title}`}
              </h3>
              <ul className="list">
                {b.chapters.map((ch) => (
                  <li key={ch.id}>
                    <a className="list-item" href={`/read/${ch.id}`}>
                      <span className="list-item__lead">{ch.roman}</span>
                      <span className="list-item__label">{ch.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
