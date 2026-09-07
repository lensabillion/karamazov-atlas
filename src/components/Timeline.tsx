'use client';

import { useState } from 'react';
import { LANES, MOMENTS, SEGMENTS, type Moment } from '@/lib/timeline';

/**
 * The novel on two clocks at once.
 *
 * The top ribbon is STORY time — how long each stretch actually lasts. The
 * second is BOOK time — how much of the novel it consumes. They are near
 * inversions of each other: two months of story pass in a paragraph, while
 * four days take two thirds of the book. That mismatch is why the novel feels
 * dense, and it is the reason this chart exists.
 *
 * Beneath, one lane per character. A dot means that person is present in that
 * moment, so you can read across a life or down a single night.
 */

/** How long each segment lasts, in days. The gap is the whole point. */
const DURATION: Record<string, number> = {
  before: 6, day1: 1, day2: 1, day3: 1, day4: 1, gap: 60, trial: 3, after: 5,
};

const W = 1200;
const RIBBON_H = 26;
const LANE_H = 40;
const LANES_TOP = 210;
const H = LANES_TOP + LANES.length * LANE_H + 30;

export default function Timeline() {
  const [selected, setSelected] = useState<Moment | null>(
    MOMENTS.find((m) => m.id === 'm15') ?? null,
  );

  const totalWords = SEGMENTS.reduce((n, s) => n + s.words, 0);
  const totalDays = SEGMENTS.reduce((n, s) => n + (DURATION[s.id] ?? 1), 0);

  // Book-time layout drives the lanes; story-time is shown for contrast.
  const bookX: Record<string, { x: number; w: number }> = {};
  let bx = 0;
  for (const s of SEGMENTS) {
    const w = (s.words / totalWords) * W;
    bookX[s.id] = { x: bx, w };
    bx += w;
  }

  const storyX: Record<string, { x: number; w: number }> = {};
  let sx = 0;
  for (const s of SEGMENTS) {
    const w = ((DURATION[s.id] ?? 1) / totalDays) * W;
    storyX[s.id] = { x: sx, w };
    sx += w;
  }

  const momentX = (m: Moment) => {
    const seg = bookX[m.segment]!;
    const inSeg = MOMENTS.filter((x) => x.segment === m.segment);
    const i = inSeg.findIndex((x) => x.id === m.id);
    return seg.x + (seg.w * (i + 1)) / (inSeg.length + 1);
  };

  const laneY = (i: number) => LANES_TOP + i * LANE_H + LANE_H / 2;

  return (
    <div className="stack stack--loose">
      <div className="chart scroll-x">
        <svg viewBox={`0 0 ${W} ${H}`} role="img"
          aria-label="The novel laid out on story time and on book time, with a lane per character">

          <text x={0} y={14} style={{ font: '700 11px "Alegreya Sans", sans-serif', letterSpacing: '0.1em' }}
            fill="var(--text-faint)">STORY TIME — HOW LONG IT ACTUALLY TAKES</text>
          {SEGMENTS.map((s) => {
            const p = storyX[s.id]!;
            return (
              <g key={`s-${s.id}`}>
                <rect x={p.x} y={24} width={Math.max(p.w - 2, 1)} height={RIBBON_H}
                  fill={s.elided ? 'var(--border)' : 'var(--group-color, var(--text-faint))'}
                  opacity={s.elided ? 1 : 0.45} rx={2} />
                {p.w > 62 && (
                  <text x={p.x + p.w / 2} y={24 + RIBBON_H / 2} textAnchor="middle" dominantBaseline="middle"
                    style={{ font: '400 11px "Alegreya Sans", sans-serif' }} fill="var(--text)">
                    {s.label}
                  </text>
                )}
              </g>
            );
          })}

          <text x={0} y={90} style={{ font: '700 11px "Alegreya Sans", sans-serif', letterSpacing: '0.1em' }}
            fill="var(--text-faint)">BOOK TIME — HOW MUCH OF THE NOVEL IT TAKES UP</text>
          {SEGMENTS.map((s) => {
            const p = bookX[s.id]!;
            return (
              <g key={`b-${s.id}`}>
                <rect x={p.x} y={100} width={Math.max(p.w - 2, 1)} height={RIBBON_H}
                  fill="var(--accent)" opacity={0.5} rx={2} />
                {p.w > 62 && (
                  <text x={p.x + p.w / 2} y={100 + RIBBON_H / 2} textAnchor="middle" dominantBaseline="middle"
                    style={{ font: '400 11px "Alegreya Sans", sans-serif' }} fill="var(--text)">
                    {s.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* segment guides down through the lanes */}
          {SEGMENTS.map((s) => {
            const p = bookX[s.id]!;
            return (
              <line key={`g-${s.id}`} x1={p.x} y1={140} x2={p.x} y2={H - 24}
                stroke="var(--border)" strokeWidth={1} />
            );
          })}

          {LANES.map((lane, i) => (
            <g key={lane.id}>
              <line x1={0} y1={laneY(i)} x2={W} y2={laneY(i)} stroke="var(--border)" strokeWidth={1} />
              <text x={4} y={laneY(i) - 9} style={{ font: '400 12px "Alegreya Sans", sans-serif' }}
                fill="var(--text-faint)">{lane.name}</text>
            </g>
          ))}

          {MOMENTS.map((m) => {
            const x = momentX(m);
            const on = selected?.id === m.id;
            return (
              <g key={m.id} onClick={() => setSelected(m)} style={{ cursor: 'pointer' }}>
                <title>{`${m.cite} — ${m.label}`}</title>
                <line x1={x} y1={LANES_TOP} x2={x} y2={H - 24}
                  stroke={on ? 'var(--accent)' : 'var(--border-strong)'}
                  strokeWidth={on ? 1.5 : 0.6} opacity={on ? 1 : 0.5} />
                {m.who.map((id) => {
                  const i = LANES.findIndex((l) => l.id === id);
                  if (i < 0) return null;
                  return (
                    <circle key={id} cx={x} cy={laneY(i)} r={on ? 7 : m.key ? 5.5 : 4}
                      fill={on || m.key ? 'var(--accent)' : 'var(--text-faint)'}
                      stroke="var(--surface)" strokeWidth={1.5} />
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

      {selected && (
        <div className="name-panel">
          <div className="stack stack--tight">
            <p className="eyebrow">
              {SEGMENTS.find((s) => s.id === selected.segment)?.label} · {selected.cite}
            </p>
            <h3 className="subheading">{selected.label}</h3>
            <p className="text-muted">{selected.detail}</p>
            <p className="meta">
              Present: {selected.who.map((id) => LANES.find((l) => l.id === id)?.name ?? id).join(', ')}
            </p>
            <a className="link text" href={`/read/${selected.chapter}`}>Read this chapter →</a>
          </div>
        </div>
      )}

      <ol className="list">
        {MOMENTS.map((m) => (
          <li key={m.id}>
            <button className="list-item" onClick={() => setSelected(m)}>
              <span className="list-item__lead">{m.cite.replace('Bk ', '')}</span>
              <span className="list-item__label">{m.label}</span>
              <span className="meta">
                {SEGMENTS.find((s) => s.id === m.segment)?.label}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
