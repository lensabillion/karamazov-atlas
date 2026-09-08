import { notFound } from 'next/navigation';
import ChapterProse from '@/components/ChapterProse';
import { getChapter, getChapterText, getCorpus, getMentions } from '@/lib/corpus';
import { getNames } from '@/lib/names';

export function generateStaticParams() {
  return getCorpus().chapters.map((c) => ({ id: c.id }));
}

export default async function ChapterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chapter = getChapter(id);
  if (!chapter) notFound();

  const text = getChapterText(id);
  const { characters, byChapter } = getMentions();
  const chapters = getCorpus().chapters;
  const idx = chapters.findIndex((c) => c.id === id);
  const prev = chapters[idx - 1];
  const next = chapters[idx + 1];

  const counts = byChapter[id] ?? {};
  const present = characters
    .filter((c) => (counts[c.id] ?? 0) > 0)
    .sort((a, b) => (counts[b.id] ?? 0) - (counts[a.id] ?? 0));

  const aliases = present
    .flatMap((c) => c.aliases.map((alias) => ({ alias, id: c.id })))
    .sort((a, b) => b.alias.length - a.alias.length);

  const named = getNames().characters.filter((n) => present.some((p) => p.id === n.id));
  const cites = Object.fromEntries(chapters.map((c) => [c.id, c.cite]));

  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\n/g, ' ').trim())
    .filter(Boolean);

  return (
    <main className="page split">
      <article className="stack stack--loose">
        <header className="page-header">
          <p className="eyebrow">
            {chapter.part} ·{' '}
            {chapter.bookNum === 13 ? 'Epilogue' : `Book ${chapter.bookNum}. ${chapter.bookTitle}`}
          </p>
          <h1 className="title">{chapter.title}</h1>
          <p className="meta">
            {chapter.cite} · {chapter.wordCount.toLocaleString()} words
          </p>
        </header>

        <ChapterProse
          paragraphs={paragraphs}
          aliases={aliases}
          characters={named}
          cites={cites}
        />

        <nav className="row row--between">
          {prev ? (
            <a className="stack stack--tight" href={`/read/${prev.id}`}>
              <span className="eyebrow">Previous</span>
              <span className="text-muted">{prev.title}</span>
            </a>
          ) : (
            <span />
          )}
          {next ? (
            <a className="stack stack--tight" href={`/read/${next.id}`}>
              <span className="eyebrow">Next</span>
              <span className="text-muted">{next.title}</span>
            </a>
          ) : (
            <span />
          )}
        </nav>
      </article>

      <aside className="sidebar">
        <p className="eyebrow">In this chapter</p>
        {present.map((c) => (
          <a className={`chip group-${c.group}`} key={c.id} href={`/character/${c.id}`}>
            <span className="dot" />
            <span className="list-item__label">{c.short}</span>
            <span className="num">{counts[c.id]}</span>
          </a>
        ))}
        {present.length === 0 && <p className="meta">No tracked characters named.</p>}
      </aside>
    </main>
  );
}
