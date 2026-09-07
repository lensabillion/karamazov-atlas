'use client';

import { useMemo, useState } from 'react';
import { markPath } from './GroupMark';
import { LANES, SEGMENTS, SPANS, type Span } from '@/lib/timeline';

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
 * before the verdict. A death is not an event marker here — it is the end of a
 * thread, which is what it is in the book.
 */

const GROUP_OF: Record<string, string> = {
  fyodor: 'family', dmitri: 'family', ivan: 'family',
  alyosha: 'family', smerdyakov: 'family',
  grushenka: 'women', katerina: 'women',
};

const W = 1080;
const GUTTER = 170;   // wide enough for the longest era label, wrapped
const HEADER = 54;
const BODY_H = 1360;
const COL_W = (W - GUTTER - 12) / LANES.length;
/** The elided two months get a fixed band; they have no words of their own. */
const GAP_BAND = 46;

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

export default function Timeline() {
  const [selected, setSelected] = useState<Span | null>(
    SPANS.find((s) => s.character === 'fyodor' && s.ends) ?? null,
  );

  /** y offset and height for every segment, by share of the novel's words. */
  const bands = useMemo(() => {
    const words = SEGMENTS.reduce((n, s) => n + s.words, 0);
    const scale = (BODY_H - GAP_BAND) / words;
    const out: Record<string, { y: number; h: number; elided: boolean }> = {};
    let y = HEADER;
    for (const s of SEGMENTS) {
      const h = s.elided ? GAP_BAND : s.words * scale;
      out[s.id] = { y, h, elided: Boolean(s.elided) };
      y += h;
    }
    return out;
  }, []);

  const box = (span: Span) => {
    const first = bands[span.segments[0]!]!;
    const last = bands[span.segments[span.segments.length - 1]!]!;
    return { y: first.y, h: last.y + last.h - first.y };
  };

  const colX = (id: string) => GUTTER + LANES.findIndex((l) => l.id === id) * COL_W;

  // Room below the last band for a terminator label to sit under its block.
  const H = HEADER + BODY_H + 48;

  return (
    <div className="stack stack--loose">
      <div className="chart scroll-x">
        <svg viewBox={`0 0 ${W} ${H}`} role="img"
          aria-label="The novel as a columnar timeline, one column per character">

          {/* era bands down the left, as on a wall chart */}
          {SEGMENTS.map((s) => {
            const b = bands[s.id]!;
            return (
              <g key={`band-${s.id}`}>
                <line x1={0} y1={b.y} x2={W} y2={b.y} stroke="var(--border)" strokeWidth={1} />
                {b.elided && (
                  <rect x={GUTTER} y={b.y} width={W - GUTTER - 12} height={b.h}
                    fill="var(--surface)" />
                )}
                {wrap(s.label.toUpperCase(), 18).map((ln, j) => (
                  <text key={j} x={GUTTER - 16} y={b.y + 14 + j * 13} textAnchor="end"
                    style={{ font: '600 11px "DM Sans", sans-serif', letterSpacing: '0.06em' }}
                    fill="var(--ink-3)">
                    {ln}
                  </text>
                ))}
                <text x={GUTTER - 16}
                  y={b.y + 14 + wrap(s.label.toUpperCase(), 18).length * 13} textAnchor="end"
                  style={{ font: '400 10px "DM Sans", sans-serif' }} fill="var(--ink-3)">
                  {s.elided ? 'skipped' : `${Math.round((s.words / 349367) * 100)}% of the book`}
                </text>
              </g>
            );
          })}

          {/* column headers */}
          {LANES.map((lane) => {
            const x = colX(lane.id);
            return (
              <g key={`h-${lane.id}`}>
                <path className="mark" transform={`translate(${x + 12},${HEADER - 30})`}
                  d={markPath(GROUP_OF[lane.id] ?? 'family', 5)} />
                <text x={x + 24} y={HEADER - 26}
                  style={{ font: '600 13px "DM Sans", sans-serif' }} fill="var(--ink)">
                  {lane.name}
                </text>
              </g>
            );
          })}

          {/* the blocks */}
          {SPANS.map((span, i) => {
            const { y, h } = box(span);
            const x = colX(span.character);
            const on = selected === span;
            const lines = wrap(span.label, Math.floor(COL_W / 5.6));
            return (
              <g key={i} onClick={() => setSelected(span)} style={{ cursor: 'pointer' }}>
                <title>{span.label}</title>
                <rect x={x + 2} y={y + 2} width={COL_W - 6} height={h - 4} rx={2}
                  fill={on ? 'var(--teal-soft)' : span.key ? 'var(--blue-soft)' : 'var(--bg)'}
                  stroke={on ? 'var(--teal)' : span.key ? 'var(--blue)' : 'var(--border-strong)'}
                  strokeWidth={on || span.key ? 1.5 : 1} />
                {lines.map((ln, j) => (
                  <text key={j} x={x + 10} y={y + 18 + j * 13}
                    style={{ font: `${span.key ? 600 : 400} 11px "DM Sans", sans-serif` }}
                    fill={on ? 'var(--teal-deep)' : 'var(--ink)'}>
                    {ln}
                  </text>
                ))}
                {/* a thread that ends, ends visibly */}
                {span.ends && (
                  <>
                    <line x1={x + 2} y1={y + h - 2} x2={x + COL_W - 4} y2={y + h - 2}
                      stroke="var(--teal)" strokeWidth={3} />
                    <text x={x + 10} y={y + h + 14}
                      style={{ font: '600 10px "DM Sans", sans-serif', letterSpacing: '0.06em' }}
                      fill="var(--teal-deep)">
                      ENDS HERE
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {selected && (
        <div className="name-panel">
          <div className="stack stack--tight">
            <p className="eyebrow">
              {LANES.find((l) => l.id === selected.character)?.name}
              {' · '}
              {selected.segments.map((id) => SEGMENTS.find((s) => s.id === id)?.label).join(' → ')}
            </p>
            <h3 className="subheading">{selected.label}</h3>
            <p className="text-muted">{selected.detail}</p>
          </div>
        </div>
      )}
    </div>
  );
}
