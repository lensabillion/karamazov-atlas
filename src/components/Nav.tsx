'use client';

import { usePathname } from 'next/navigation';
import type { PlaceChapter } from '@/lib/reading-position';
import { setReadingPosition, useReadingPosition } from '@/lib/use-reading-position';

const LINKS = [
  { href: '/', label: 'Overview' },
  { href: '/read', label: 'Read' },
  { href: '/characters', label: 'Characters' },
  { href: '/who', label: 'Who’s who' },
  { href: '/names', label: 'Names' },
  { href: '/timeline', label: 'Timeline' },
  { href: '/ask', label: 'Ask' },
];

export default function Nav({ places }: { places: PlaceChapter[] }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);
  const position = useReadingPosition();

  // Books in order, each with its chapters, for the grouped control.
  const books: { name: string; chapters: PlaceChapter[] }[] = [];
  for (const p of places) {
    const last = books.at(-1);
    if (last?.name === p.book) last.chapters.push(p);
    else books.push({ name: p.book, chapters: [p] });
  }

  return (
    <nav className="nav">
      <span className="nav-brand">Karamazov Atlas</span>
      {LINKS.map((l) => (
        <a
          key={l.href}
          href={l.href}
          className="nav-link"
          aria-current={isActive(l.href) ? 'page' : undefined}
        >
          {l.label}
        </a>
      ))}
      <span className="grow" />
      {/* The reader's place. Everything later than it folds away, site-wide. */}
      <label className="nav-place" data-set={position !== null || undefined}>
        <span className="nav-place__label">Read to</span>
        <select
          className="nav-place__select"
          value={position ?? ''}
          onChange={(e) => setReadingPosition(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">The end — show everything</option>
          {books.map((b) => (
            <optgroup key={b.name} label={b.name}>
              {b.chapters.map((c) => (
                <option key={c.id} value={c.ordinal}>{c.cite} — {c.title}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>
      {position !== null && (
        <button type="button" className="nav-place__all" onClick={() => setReadingPosition(null)}>
          Show everything
        </button>
      )}
    </nav>
  );
}
