import { getBooks, getCorpus, getMentions } from '@/lib/corpus';
import SmerdyakovStudy from '@/components/SmerdyakovStudy';
import './home.css';

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
    <main className="page page--wide memory-page">
      <section className="memory-opening" aria-labelledby="memory-title">
        <div className="memory-opening__text">
          <header className="page-header">
            <p className="eyebrow">An illustrated companion · Full-book spoilers</p>
            <h1 className="title" id="memory-title">The Brothers<br />Karamazov</h1>
            <p className="memory-subtitle lede">Return to the faces.<br />Remember what passed between them.</p>
          </header>
          <hr className="memory-rule" />
          <p className="text-muted">
            A father, three brothers, and the people bound to them. Find a familiar
            name, follow a relationship, or step back into a scene you remember.
          </p>
          <nav className="memory-contents" aria-label="Explore the novel">
            <a href="/characters"><span className="eyebrow">I</span><span>The people</span><span aria-hidden="true">→</span></a>
            <a href="/who"><span className="eyebrow">II</span><span>What binds them</span><span aria-hidden="true">→</span></a>
            <a href="/timeline"><span className="eyebrow">III</span><span>The days that change everything</span><span aria-hidden="true">→</span></a>
            <a href="/names"><span className="eyebrow">IV</span><span>One person, many names</span><span aria-hidden="true">→</span></a>
          </nav>
          <p className="meta">Fyodor Dostoyevsky · 1880<br />Constance Garnett’s translation · 1912</p>
        </div>
        <SmerdyakovStudy />
      </section>

      <section className="memory-scenes section" aria-labelledby="memory-scenes-title">
        <div className="row row--between">
          <h2 className="heading" id="memory-scenes-title">Begin with a memory</h2>
          <a className="link text-muted" href="/read">The complete novel →</a>
        </div>
        <div className="memory-scenes__list">
          <a href="/read/b05-c05"><p className="eyebrow">Book V · Chapter 5</p><h3 className="subheading">The Grand Inquisitor</h3><p className="text-muted">Ivan’s poem. Alyosha’s answer.</p><span className="link">Return to the tavern →</span></a>
          <a href="/read/b11-c08"><p className="eyebrow">Book XI · Chapter 8</p><h3 className="subheading">The last interview</h3><p className="text-muted">Ivan, Smerdyakov, and the money.</p><span className="link">Return to the confession →</span></a>
          <a href="/read/b13-c03"><p className="eyebrow">Epilogue · Chapter 3</p><h3 className="subheading">At the stone</h3><p className="text-muted">Alyosha and the boys. A memory to keep.</p><span className="link">Return to the farewell →</span></a>
        </div>
      </section>

      <section className="row row--wide memory-statistics" aria-label="The novel in figures">
        {stats.map(([label, value]) => (
          <div className="stat" key={label}>
            <span className="stat__value">{value}</span>
            <span className="eyebrow">{label}</span>
          </div>
        ))}
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="heading">Find a character in the text</h2>
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
        <h2 className="heading">The novel, book by book</h2>
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
