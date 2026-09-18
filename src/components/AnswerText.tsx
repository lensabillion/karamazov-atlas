/**
 * An answer from /ask, set as prose.
 *
 * The model writes light Markdown — paragraphs, quoted passages, lists, bold
 * and italic — and printed raw it read as asterisks and angle brackets. This
 * renders that subset as React elements (never as HTML, so nothing in a reply
 * can inject markup), and turns every citation the system prompt asks for,
 * "(Bk V, ch. 4)", "Book V, ch. 4" or "(Epilogue, ch. 3)", into a link to the chapter.
 */

const ROMAN: Record<string, number> = { I: 1, V: 5, X: 10, L: 50 };
function fromRoman(s: string): number {
  let n = 0;
  for (let i = 0; i < s.length; i++) {
    const v = ROMAN[s[i]!]!;
    const next = ROMAN[s[i + 1] ?? ''] ?? 0;
    n += v < next ? -v : v;
  }
  return n;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** "Bk V, ch. 4" → b05-c04; "Epilogue, ch. 3" → b13-c03. Null if it cannot be a chapter. */
export function chapterIdOf(book: string, chapter: string): string | null {
  const b = book === 'Epilogue' ? 13 : fromRoman(book);
  const c = Number(chapter);
  if (!b || b > 13 || !c || c > 14) return null;
  return `b${pad(b)}-c${pad(c)}`;
}

const INLINE = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|_[^_\s][^_]*_|(?:(?:Bk|Book) ([IVXL]+)|(Epilogue)), ch\. (\d+))/g;

function inline(text: string, key: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(INLINE)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    const token = m[0];
    const k = `${key}-${i++}`;
    if (token.startsWith('**')) out.push(<strong key={k}>{inline(token.slice(2, -2), k)}</strong>);
    else if (token.startsWith('*') || token.startsWith('_')) out.push(<em key={k}>{inline(token.slice(1, -1), k)}</em>);
    else {
      const id = chapterIdOf(m[2] ?? m[3]!, m[4]!);
      out.push(id ? <a className="link" href={`/read/${id}`} key={k}>{token}</a> : token);
    }
    last = at + token.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function AnswerText({ text }: { text: string }) {
  const blocks = text.trim().split(/\n{2,}/);
  return (
    <div className="answer">
      {blocks.map((block, b) => {
        const lines = block.split('\n');
        const key = `b${b}`;
        if (lines.every((l) => l.startsWith('>'))) {
          return (
            <blockquote key={key}>
              {inline(lines.map((l) => l.replace(/^>\s?/, '')).join(' '), key)}
            </blockquote>
          );
        }
        if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
          return (
            <ul key={key}>
              {lines.map((l, i) => <li key={i}>{inline(l.replace(/^\s*[-*]\s+/, ''), `${key}-${i}`)}</li>)}
            </ul>
          );
        }
        if (lines.every((l) => /^\s*\d+\.\s+/.test(l))) {
          return (
            <ol key={key}>
              {lines.map((l, i) => <li key={i}>{inline(l.replace(/^\s*\d+\.\s+/, ''), `${key}-${i}`)}</li>)}
            </ol>
          );
        }
        return <p key={key}>{inline(lines.join(' '), key)}</p>;
      })}
    </div>
  );
}
