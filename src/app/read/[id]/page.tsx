import { notFound } from 'next/navigation';
import { getChapter, getChapterText, getCorpus, getMentions } from '@/lib/corpus';

export function generateStaticParams() {
  return getCorpus().chapters.map((c) => ({ id: c.id }));
}

/**
 * Gutenberg marks italics with underscores (_Notre Dame de Paris_). Split those out
 * so they render as emphasis instead of leaking punctuation into the prose.
 */
function segments(text: string): { text: string; italic: boolean }[] {
  const out: { text: string; italic: boolean }[] = [];
  const re = /_([^_\n]{1,200})_/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push({ text: text.slice(last, m.index), italic: false });
    out.push({ text: m[1]!, italic: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last), italic: false });
  return out;
}

/**
 * Split a run of text into plain text and marked character names, so mentions can
 * be highlighted without injecting HTML. Longest aliases match first.
 */
function highlight(text: string, aliases: { alias: string; id: string }[]) {
  if (aliases.length === 0) return [text];
  const pattern = new RegExp(
    `\\b(${aliases.map((a) => a.alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
    'g',
  );
  const out: (string | { text: string; id: string })[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const hit = aliases.find((a) => a.alias === m![1]);
    out.push({ text: m[1]!, id: hit?.id ?? '' });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
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

        <div className="prose">
          {paragraphs.map((p, i) => (
            <p key={i}>
              {segments(p).map((seg, s) => {
                const inner = highlight(seg.text, aliases).map((part, j) =>
                  typeof part === 'string' ? (
                    part
                  ) : (
                    <a key={j} href={`/character/${part.id}`}>
                      <mark>{part.text}</mark>
                    </a>
                  ),
                );
                return seg.italic ? <em key={s}>{inner}</em> : <span key={s}>{inner}</span>;
              })}
            </p>
          ))}
        </div>

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
