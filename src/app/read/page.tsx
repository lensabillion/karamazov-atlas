import { getBooks } from '@/lib/corpus';

export default function Contents() {
  const books = getBooks();
  return (
    <main className="page page--narrow">
      <header className="page-header">
        <p className="eyebrow">Full text</p>
        <h1 className="title">Contents</h1>
      </header>

      {books.map((b) => (
        <section className="section" key={b.num}>
          <h2 className="heading">
            {b.num === 13 ? 'Epilogue' : `Book ${b.num}. ${b.title}`}
          </h2>
          <ul className="list">
            {b.chapters.map((ch) => (
              <li key={ch.id}>
                <a className="list-item" href={`/read/${ch.id}`}>
                  <span className="list-item__lead">{ch.roman}</span>
                  <span className="list-item__label">{ch.title}</span>
                  <span className="meta">{ch.wordCount.toLocaleString()}w</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
