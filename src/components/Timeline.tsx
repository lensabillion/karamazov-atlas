'use client';

import { useEffect, useMemo, useState } from 'react';
import { markPath } from './GroupMark';
import { LANES, SEGMENTS, SPANS, type Span } from '@/lib/timeline';
import { passageHref } from '@/lib/passage';
import type { PlaceChapter } from '@/lib/reading-position';

/**
 * The novel as a columnar timeline.
 *
 * Time runs down. Each column is one person, read top to bottom as a continuous
 * thread. Block height is proportional to how much of the BOOK that state
 * occupies — book time rather than story time, because that is the reader's
 * experience of duration: the four days that take two thirds of the novel
 * should look like two thirds.
 *
 * Reading across a row shows what everyone was doing at once. And two columns
 * simply stop: Fyodor's on the night of the murder, Smerdyakov's the night
 * before the trial opens. A death is not an event marker here — it is the end
 * of a thread, which is what it is in the book.
 *
 * atlas-9hx1: the column heads stay in view while the chart scrolls; the chosen
 * block's account sits beside the chart (docked to the bottom on a phone) with
 * a link to the passage; labels never spill out of their block; and a thread
 * that ends part-way through a band ends where the prose puts it.
 */

const GROUP_OF: Record<string, string> = {
  fyodor: 'family', dmitri: 'family', ivan: 'family',
  alyosha: 'family', smerdyakov: 'family',
  grushenka: 'women', katerina: 'women',
};

const W = 1080;
const GUTTER = 170;   // wide enough for the longest era label, wrapped
const TOP = 10;
const BODY_H = 1360;
const RIGHT = 12;
const COL_W = (W - GUTTER - RIGHT) / LANES.length;
/** The elided two months get a fixed band; they have no words of their own. */
const GAP_BAND = 46;
const LINE_H = 13;
const TOTAL_WORDS = 349_367;

/** Naive word wrap, so a label sits inside the space allotted to it. */
function wrap(text: string, perLine: number): string[] {
  const out: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    if ((line + ' ' + word).trim().length > perLine) { out.push(line.trim()); line = word; }
    else line += ' ' + word;
  }
  if (line.trim()) out.push(line.trim());
  return out;
}

/** Wrap, then cut to the lines the block can hold, marking the cut. */
function fit(text: string, perLine: number, height: number): string[] {
  const lines = wrap(text, perLine);
  const room = Math.max(1, Math.floor((height - 10) / LINE_H));
  if (lines.length <= room) return lines;
  const kept = lines.slice(0, room);
  kept[room - 1] = `${kept[room - 1]!.replace(/[\s,.;:—-]+$/, '')}…`;
  return kept;
}

const pct = (px: number) => `${(px / W) * 100}%`;

export default function Timeline({ places }: { places: PlaceChapter[] }) {
  const [selected, setSelected] = useState<Span | null>(null);
  const place = useMemo(() => new Map(places.map((c) => [c.id, c])), [places]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  /** y offset and height for every segment, by share of the novel's words. */
  const bands = useMemo(() => {
    const words = SEGMENTS.reduce((n, s) => n + s.words, 0);
    const scale = (BODY_H - GAP_BAND) / words;
    const out: Record<string, { y: number; h: number; elided: boolean }> = {};
    let y = TOP;
    for (const s of SEGMENTS) {
      const h = s.elided ? GAP_BAND : s.words * scale;
      out[s.id] = { y, h, elided: Boolean(s.elided) };
      y += h;
    }
    return out;
  }, []);

  /** A block spans its segments; a thread that ends stops at `endFraction` of the last. */
  const box = (span: Span) => {
    const first = bands[span.segments[0]!]!;
    const last = bands[span.segments[span.segments.length - 1]!]!;
    const lastH = span.ends && span.endFraction !== undefined ? last.h * span.endFraction : last.h;
    return { y: first.y, h: last.y + lastH - first.y };
  };

  const colX = (id: string) => GUTTER + LANES.findIndex((l) => l.id === id) * COL_W;

  // Room below the last band for a terminator label to sit under its block.
  const H = TOP + BODY_H + 48;
  const laneName = (id: string) => LANES.find((l) => l.id === id)?.name ?? id;
  const chosen = selected ? place.get(selected.chapter) : undefined;

  return (
    <div className="timeline">
      <div className="chart timeline__chart">
        {/* Column heads: HTML so they can stay in view while the chart scrolls
            under them. Columns are set in the same proportions as the drawing. */}
        <div className="timeline__heads" aria-hidden="true"
          style={{ gridTemplateColumns: `${pct(GUTTER)} repeat(${LANES.length}, ${pct(COL_W)}) ${pct(RIGHT)}` }}>
          <span className="timeline__heads-key">Book time ↓</span>
          {LANES.map((lane) => (
            <span key={lane.id} className="timeline__head">
              <svg width="12" height="12" viewBox="-6 -6 12 12" aria-hidden="true">
                <path className="mark" d={markPath(GROUP_OF[lane.id] ?? 'family', 5)} />
              </svg>
              {lane.name}
            </span>
          ))}
          <span />
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} role="group"
          aria-label="The novel as a columnar timeline, one column per character. Each block is a button.">
          <defs>
            {/* Material past the reader's place: ruled, as a blank leaf is. */}
            <pattern id="unread" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke="var(--border)" strokeWidth="2" />
            </pattern>
          </defs>

          {/* era bands down the left, as on a wall chart */}
          {SEGMENTS.map((s) => {
            const b = bands[s.id]!;
            const label = wrap(s.label.toUpperCase(), 18);
            return (
              <g key={`band-${s.id}`}>
                <line x1={0} y1={b.y} x2={W} y2={b.y} stroke="var(--border)" strokeWidth={1} />
                {b.elided && (
                  <rect x={GUTTER} y={b.y} width={W - GUTTER - RIGHT} height={b.h}
                    fill="var(--surface)" />
                )}
                {label.map((ln, j) => (
                  <text key={j} x={GUTTER - 16} y={b.y + 14 + j * LINE_H} textAnchor="end"
                    style={{ font: '600 11px Old Standard TT, Georgia, serif', letterSpacing: '0.06em' }}
                    fill="var(--ink-3)">
                    {ln}
                  </text>
                ))}
                <text x={GUTTER - 16} y={b.y + 14 + label.length * LINE_H} textAnchor="end"
                  style={{ font: '400 10px Old Standard TT, Georgia, serif' }} fill="var(--ink-3)">
                  {s.elided ? 'skipped' : `${Math.round((s.words / TOTAL_WORDS) * 100)}% of the book`}
                </text>
              </g>
            );
          })}

          {/* the blocks */}
          {SPANS.map((span, i) => {
            const { y, h } = box(span);
            const x = colX(span.character);
            const on = selected === span;
            const lines = fit(span.label, Math.floor(COL_W / 5.6), h);
            const from = place.get(span.chapter)?.ordinal;
            return (
              <g key={i}>
                <g className="hit"
                  data-spoiler-from={from}
                  role="button"
                  tabIndex={0}
                  aria-pressed={on}
                  aria-label={`${laneName(span.character)}: ${span.label}`}
                  onClick={() => setSelected(on ? null : span)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(on ? null : span); }
                  }}>
                  <title>{span.label}</title>
                  <rect x={x + 2} y={y + 2} width={COL_W - 6} height={Math.max(4, h - 4)}
                    fill={on ? 'var(--gilt-soft)' : span.key ? 'var(--cloth-soft)' : 'var(--bg)'}
                    stroke={on ? 'var(--gilt)' : span.key ? 'var(--cloth)' : 'var(--border-strong)'}
                    strokeWidth={on || span.key ? 1.5 : 1} />
                  {lines.map((ln, j) => (
                    <text key={j} x={x + 10} y={y + 18 + j * LINE_H}
                      style={{ font: `${span.key ? 600 : 400} 11px Old Standard TT, Georgia, serif` }}
                      fill={on ? 'var(--cloth-deep)' : 'var(--ink)'}>
                      {ln}
                    </text>
                  ))}
                  {/* a thread that ends, ends visibly */}
                  {span.ends && (
                    <>
                      <line x1={x + 2} y1={y + h - 2} x2={x + COL_W - 4} y2={y + h - 2}
                        stroke="var(--gilt)" strokeWidth={3} />
                      <text x={x + 10} y={y + h + 14}
                        style={{ font: '600 10px Old Standard TT, Georgia, serif', letterSpacing: '0.06em' }}
                        fill="var(--cloth-deep)">
                        ENDS HERE
                      </text>
                    </>
                  )}
                </g>
                {/* Shown instead, by the gate stylesheet, past the reader's place. */}
                {from !== undefined && (
                  <g className="spoiler-note" data-spoiler-note={from} aria-hidden="true">
                    <rect x={x + 2} y={y + 2} width={COL_W - 6} height={Math.max(4, h - 4)}
                      fill="url(#unread)" stroke="var(--border)" strokeWidth={1} />
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* The account of the chosen block: beside the chart on a wide screen,
          docked to the bottom of the viewport on a narrow one. */}
      <aside className="timeline__aside" data-open={selected ? true : undefined}
        aria-live="polite" aria-label="The chosen moment">
        {selected ? (
          <div className="stack stack--tight">
            <p className="eyebrow">
              {laneName(selected.character)}
              {' · '}
              {selected.segments.map((id) => SEGMENTS.find((s) => s.id === id)?.label).join(' → ')}
            </p>
            <h2 className="subheading">{selected.label}</h2>
            <p className="text-muted">{selected.detail}</p>
            {selected.reading && <p className="meta"><em>An interpretation, not a statement in the text.</em></p>}
            {chosen && (
              <a className="link" href={passageHref(chosen.id, selected.quote)}>
                Read the passage: {chosen.cite} · {chosen.title.replace(/^“|”$/g, '')} →
              </a>
            )}
            <button type="button" className="timeline__close" onClick={() => setSelected(null)}>
              Close (Esc)
            </button>
          </div>
        ) : (
          <div className="stack stack--tight timeline__hint">
            <p className="eyebrow">How to read it</p>
            <p className="text-muted">
              Choose any block for what happens and the chapter to read it in. A heavier
              outline is a turning point; a gilt rule under a block is where a thread ends.
              Ruled blocks lie past your place in the book.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
