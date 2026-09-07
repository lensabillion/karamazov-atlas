'use client';

import { useEffect, useRef, useState } from 'react';
import NameKey from './NameKey';
import type { NamedCharacter } from '@/lib/names';

export interface Alias {
  alias: string;
  id: string;
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

/** Split a run into plain text and name hits. Longest aliases match first. */
function split(text: string, aliases: Alias[]) {
  if (aliases.length === 0) return [text];
  const pattern = new RegExp(
    `\\b(${aliases.map((a) => a.alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
    'g',
  );
  const out: (string | Alias)[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const hit = aliases.find((a) => a.alias === m![1]);
    out.push({ alias: m[1]!, id: hit?.id ?? '' });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/**
 * The reading surface. Any tracked name in the text opens its Name Key inline,
 * so a reader who has lost track of who Rakitin is never has to leave the page.
 */
export default function ChapterProse({
  paragraphs,
  aliases,
  characters,
  cites,
}: {
  paragraphs: string[];
  aliases: Alias[];
  characters: NamedCharacter[];
  cites: Record<string, string>;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const byId = new Map(characters.map((c) => [c.id, c]));

  // The panel used to be inserted above every paragraph, so opening it from a
  // late chapter scrolled the answer thousands of pixels off-screen (review
  // finding R6). It is now docked to the viewport, focused on open, and
  // dismissible with Escape.
  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="stack stack--loose">
      <div className="prose">
        {paragraphs.map((p, i) => (
          <p key={i}>
            {segments(p).map((seg, s) => {
              const inner = split(seg.text, aliases).map((part, j) =>
                typeof part === 'string' ? (
                  part
                ) : (
                  <button
                    className="name-hit"
                    key={j}
                    aria-expanded={open === part.id}
                    onClick={() => setOpen(open === part.id ? null : part.id)}
                  >
                    {part.alias}
                  </button>
                ),
              );
              return seg.italic ? <em key={s}>{inner}</em> : <span key={s}>{inner}</span>;
            })}
          </p>
        ))}
      </div>

      {open && byId.has(open) && (
        <div
          className="dock"
          role="dialog"
          aria-label={`Who is ${byId.get(open)!.short}`}
          tabIndex={-1}
          ref={panelRef}
        >
          <div className="dock__inner">
            <NameKey character={byId.get(open)!} cites={cites} />
            <button className="button" onClick={() => setOpen(null)}>
              Close (Esc)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
