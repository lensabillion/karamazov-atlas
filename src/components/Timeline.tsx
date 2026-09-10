'use client';

import { useRef, useState } from 'react';
import { markPath } from './GroupMark';
import { LANES, SEGMENTS, SPANS, type Span } from '@/lib/timeline';
import { buildTimelineBands, getSpanBox, wrapTimelineLabel } from '@/lib/timeline-layout';

const GROUP_OF: Record<string, string> = {
  fyodor: 'family', dmitri: 'family', ivan: 'family', alyosha: 'family',
  smerdyakov: 'family', grushenka: 'women', katerina: 'women',
};
const W = 1080;
const GUTTER = 170;
const HEADER = 54;
const BODY_H = 1360;
const COL_W = (W - GUTTER - 12) / LANES.length;
const bands = buildTimelineBands(SEGMENTS, BODY_H, 46);
const totalWords = SEGMENTS.reduce((sum, segment) => sum + segment.words, 0);
const colX = (id: string) => GUTTER + LANES.findIndex((lane) => lane.id === id) * COL_W;

/** Parallel character threads sized by narrative space, with a nearby reading panel. */
export default function Timeline() {
  const [selected, setSelected] = useState<Span>(SPANS[0]!);
  const viewport = useRef<HTMLDivElement>(null);
  const detail = useRef<HTMLElement>(null);
  const selectedMark = useRef<SVGGElement>(null);

  const selectSpan = (span: Span) => {
    setSelected(span);
    detail.current?.focus({ preventScroll: true });
    detail.current?.scrollIntoView({ block: 'nearest' });
  };

  const jumpToPeriod = (id: string) => {
    const band = bands[id];
    const svg = viewport.current?.querySelector<SVGSVGElement>('.timeline-body');
    if (!band || !svg || !viewport.current) return;
    viewport.current.scrollTo({ top: band.y * svg.clientWidth / W });
  };

  return (
    <section className="timeline-workspace" aria-label="Character timeline">
      <div className="timeline-toolbar">
        <div className="stack stack--tight">
          <h2 className="subheading">The lives, side by side</h2>
          <p className="meta" id="timeline-instructions">Scroll down through time; sideways for other characters. Select a block to read its story below.</p>
        </div>
        <label className="timeline-jump text-muted">
          Jump to
          <select className="field" aria-label="Jump to a period" defaultValue="" onChange={(event) => {
            jumpToPeriod(event.target.value);
            event.target.value = '';
          }}>
            <option value="" disabled>A period…</option>
            {SEGMENTS.map((segment) => <option key={segment.id} value={segment.id}>{segment.label}</option>)}
          </select>
        </label>
      </div>

      <div className="timeline-legend meta" aria-label="Timeline key">
        <span><i className="timeline-swatch" />Turning point</span>
        <span><i className="timeline-swatch timeline-swatch--selected" />Selected story</span>
        <span><i className="timeline-swatch timeline-swatch--end" />A life ends</span>
        <span>Blank space: no state shown in this guide</span>
      </div>

      <div className="timeline-viewport" ref={viewport} tabIndex={0} role="region"
        aria-label="Scrollable character timeline" aria-describedby="timeline-instructions">
        <div className="timeline-canvas">
          <svg className="timeline-column-heads" viewBox={`0 0 ${W} ${HEADER}`} aria-hidden="true">
            <text x={20} y={30} style={{ font: '600 11px "DM Sans", sans-serif', letterSpacing: '0.06em' }} fill="var(--ink-3)">STORY TIME ↓</text>
            {LANES.map((lane) => (
              <g key={lane.id}>
                <path className="mark" transform={`translate(${colX(lane.id) + 12},24)`}
                  d={markPath(GROUP_OF[lane.id] ?? 'family', 5)} />
                <text x={colX(lane.id) + 24} y={28}
                  style={{ font: '600 13px "DM Sans", sans-serif' }} fill="var(--ink)">{lane.name}</text>
              </g>
            ))}
          </svg>
          <svg className="timeline-body" viewBox={`0 0 ${W} ${BODY_H + 40}`} role="group"
            aria-label="Character stories in chronological periods">
            {SEGMENTS.map((segment) => {
              const band = bands[segment.id]!;
              const label = wrapTimelineLabel(segment.label.toUpperCase(), 18);
              return (
                <g key={segment.id}>
                  {segment.elided && <rect x={0} y={band.y} width={W} height={band.h} fill="var(--purple-soft)" />}
                  <line x1={0} y1={band.y} x2={W} y2={band.y} stroke="var(--border)"
                    strokeDasharray={segment.elided ? '4 4' : undefined} />
                  {label.map((line, i) => (
                    <text key={i} x={GUTTER - 16} y={band.y + 14 + i * 13} textAnchor="end"
                      style={{ font: '600 11px "DM Sans", sans-serif', letterSpacing: '0.06em' }} fill="var(--ink-3)">{line}</text>
                  ))}
                  <text x={GUTTER - 16} y={band.y + 14 + label.length * 13} textAnchor="end"
                    style={{ font: '400 10px "DM Sans", sans-serif' }} fill="var(--ink-3)">
                    {segment.elided ? 'time skipped' : `${Math.round(segment.words / totalWords * 100)}% of the book`}
                  </text>
                </g>
              );
            })}

            {SPANS.map((span, i) => {
              const { y, h } = getSpanBox(span, bands);
              const x = colX(span.character);
              const on = selected === span;
              const lines = wrapTimelineLabel(span.label, 18, Math.max(1, Math.floor((h - 12) / 13)));
              const person = LANES.find((lane) => lane.id === span.character)!.name;
              const period = span.segments.map((id) => SEGMENTS.find((segment) => segment.id === id)!.label).join(' → ');
              return (
                <g key={i} className="hit timeline-block" ref={on ? selectedMark : undefined}
                  role="button" tabIndex={0} aria-label={`${person}: ${span.label}. ${period}`}
                  aria-pressed={on} aria-controls="timeline-detail" onClick={() => selectSpan(span)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      selectSpan(span);
                    }
                  }}>
                  <title>{`${person}: ${span.label}`}</title>
                  <rect x={x + 2} y={y + 2} width={COL_W - 6} height={h - 4} rx={2}
                    fill={on ? 'var(--teal-soft)' : span.key ? 'var(--blue-soft)' : 'var(--bg)'}
                    stroke={on ? 'var(--teal)' : span.key ? 'var(--blue)' : 'var(--border-strong)'}
                    strokeWidth={on || span.key ? 1.5 : 1} />
                  {lines.map((line, j) => (
                    <text key={j} x={x + 10} y={y + 18 + j * 13}
                      style={{ font: `${span.key ? 600 : 400} 11px "DM Sans", sans-serif` }}
                      fill={on ? 'var(--teal-deep)' : 'var(--ink)'}>{line}</text>
                  ))}
                  {span.ends && <>
                    <line x1={x + 2} y1={y + h - 2} x2={x + COL_W - 4} y2={y + h - 2}
                      stroke="var(--teal)" strokeWidth={3} />
                    <text x={x + 10} y={y + h + 14}
                      style={{ font: '600 10px "DM Sans", sans-serif', letterSpacing: '0.06em' }}
                      fill="var(--teal-deep)">ENDS HERE</text>
                  </>}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <section className="timeline-detail" id="timeline-detail" ref={detail} tabIndex={-1}
        aria-labelledby="timeline-detail-title">
        <div className="stack stack--tight">
          <p className="eyebrow">{LANES.find((lane) => lane.id === selected.character)?.name}</p>
          <h3 className="subheading" id="timeline-detail-title">{selected.label}</h3>
          <p className="meta">{selected.segments.map((id) => SEGMENTS.find((segment) => segment.id === id)?.label).join(' → ')}</p>
          {selected.ends && <p className="meta timeline-end-note">This character’s life ends here.</p>}
        </div>
        <div className="stack">
          <p className="text-muted">{selected.detail}</p>
          <div className="timeline-detail-actions">
            {selected.chapter && <a className="link text-muted" href={`/read/${selected.chapter}`}>Read {selected.cite ?? 'the chapter'} ↗</a>}
            <button type="button" className="link meta" onClick={() => {
              selectedMark.current?.focus({ preventScroll: true });
              selectedMark.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
            }}>Return to selected block ↑</button>
          </div>
        </div>
      </section>
    </section>
  );
}
