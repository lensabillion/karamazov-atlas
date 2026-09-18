'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { markPath } from './GroupMark';
import { BOND_STYLE, H, PEOPLE, TIES, W, ZONES, type Person, type Tie } from '@/lib/relationships';
import { passageHref } from '@/lib/passage';
import { WHOLE_BOOK, type PlaceChapter } from '@/lib/reading-position';

type TieKey = string;

/**
 * Who these people are to each other.
 *
 * Deliberately not a force simulation. The layout is the argument: the father
 * sits above his four sons, the two women below, and the lines that cross
 * between those rows are the plot. The heavy lines are the ones the murder
 * runs along — two men wanting the same woman, one brother teaching another
 * man the idea, and the killing itself.
 *
 * Every person and every tie opens onto the chapter behind it (R8), and each
 * carries its reading-order position so the reader's place can fold away
 * people and ties they have not reached yet (atlas-fn3v).
 */
export default function RelationshipMap({
  places,
  profiles,
}: {
  places: PlaceChapter[];
  /** Ids that have a character page; the two mothers outside the cast do not. */
  profiles: string[];
}) {
  const place = new Map(places.map((c) => [c.id, c]));
  const ord = (chapter: string) => place.get(chapter)?.ordinal ?? WHOLE_BOOK;
  const citeOf = (chapter: string) => place.get(chapter)?.cite ?? chapter;
  /** A tie can only be shown once its chapter and both people have been reached. */
  const tieGate = (t: Tie) => Math.max(ord(t.chapter), ord(at(t.from).chapter), ord(at(t.to).chapter));
  const [selected, setSelected] = useState<Person | null>(null);
  const [hovered, setHovered] = useState<Person | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [, setTick] = useState(0);

  // The card floats over the diagram, so it must follow the drawing when the
  // container scrolls or the window resizes.
  const bump = useCallback(() => setTick((t) => t + 1), []);
  useEffect(() => {
    const el = scrollRef.current;
    el?.addEventListener('scroll', bump, { passive: true });
    window.addEventListener('resize', bump);
    return () => {
      el?.removeEventListener('scroll', bump);
      window.removeEventListener('resize', bump);
    };
  }, [bump]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  /** Where to put the card: beside the person, in container pixels. */
  const anchorOf = (p: Person) => {
    const svg = svgRef.current;
    const box = scrollRef.current;
    if (!svg) return { left: 12, top: 12 };
    const rect = svg.getBoundingClientRect();
    const scale = rect.width / W;
    const x = p.x * scale - (box?.scrollLeft ?? 0);
    const y = p.y * scale;
    const CARD_W = 272;
    const CARD_H = 320; // must equal .anchored max-height in globals.css
    const room = box?.clientWidth ?? rect.width;
    const flip = x + CARD_W + 28 > room;

    // Clamp vertically to what is actually on screen.
    //
    // `top` is container-local but the viewport constraint is not, so the two
    // have to be related through rect.top — the container's own offset from the
    // top of the viewport. Getting this wrong put the card at viewport y 1075
    // on an 880px screen: still below the fold, which is the exact problem the
    // anchored card exists to solve.
    const viewH = typeof window === 'undefined' ? rect.height : window.innerHeight;
    const minTop = -rect.top + 8;                  // card's top edge at viewport 8
    const maxTop = viewH - CARD_H - rect.top - 8;  // card's bottom edge inside the viewport
    const wanted = y - 24;
    const top = maxTop < minTop
      ? minTop
      : Math.max(minTop, Math.min(wanted, maxTop));

    return {
      left: Math.max(8, Math.min(flip ? x - CARD_W - 18 : x + 18, room - CARD_W - 8)),
      top,
    };
  };

  const at = (id: string) => PEOPLE.find((p) => p.id === id)!;

  /**
   * Hue by role, never by decoration (design-system.md §3):
   *   gilt       — what the reader has selected
   *   cloth      — consequence: the path the murder travels
   *   ink, dashed — uncertain: what the text does not settle
   *   rule grey  — everything else
   */
  const tieColour = (bond: string, isKey: boolean | undefined, touched: boolean) => {
    if (touched) return 'var(--gilt)';
    if (bond === 'disputed') return 'var(--ink-2)';
    if (isKey) return 'var(--cloth)';
    return 'var(--border-strong)';
  };

  // Index ties by unordered pair, so duplicates can be fanned apart.
  const pairKey = (a: string, b: string) => [a, b].sort().join('~');
  const pairIndex = new Map<string, number>();
  const bowOf = new Map<TieKey, number>();
  for (const t of TIES) {
    const k = pairKey(t.from, t.to);
    const n = pairIndex.get(k) ?? 0;
    pairIndex.set(k, n + 1);
    // 0, then alternating ±: straight, bowed out one way, then the other.
    bowOf.set(`${t.from}-${t.to}-${t.bond}`, n === 0 ? 0 : n % 2 ? 46 : -46);
  }
  const touches = (id: string) =>
    TIES.filter((t) => t.from === id || t.to === id);

  const lit = (id: string) =>
    !selected ||
    selected.id === id ||
    touches(selected.id).some((t) => t.from === id || t.to === id);

  return (
    <div className="stack stack--loose">
      <div className="chart scroll-x" ref={scrollRef}>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} role="img"
          aria-label="Map of who the characters are to each other">

          {ZONES.map((z) => (
            <text key={z.label} x={z.x} y={z.y} textAnchor="middle"
              style={{ font: '700 11px Old Standard TT, Georgia, serif', letterSpacing: '0.12em' }}
              fill="var(--ink-3)" opacity={0.5}>
              {z.label.toUpperCase()}
            </text>
          ))}

          {TIES.map((t) => {
            const a = at(t.from);
            const b = at(t.to);
            const style = BOND_STYLE[t.bond];
            const touched = selected?.id === t.from || selected?.id === t.to;
            const active = !selected || touched;
            // At rest only the plot-critical ties are labelled; selecting a
            // person names every tie they have. Otherwise 37 labels compete.
            const showLabel = touched || (!selected && t.key);
            const bow = bowOf.get(`${t.from}-${t.to}-${t.bond}`) ?? 0;
            // Control point pushed perpendicular to the line by `bow`.
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const len = Math.max(1, Math.hypot(dx, dy));
            const cx = (a.x + b.x) / 2 + (-dy / len) * bow;
            const cy = (a.y + b.y) / 2 + (dx / len) * bow;
            // Midpoint of a quadratic curve, where the label sits.
            const mx = 0.25 * a.x + 0.5 * cx + 0.25 * b.x;
            const my = 0.25 * a.y + 0.5 * cy + 0.25 * b.y;
            return (
              <g key={`${t.from}-${t.to}-${t.bond}`} opacity={active ? 1 : 0.12}
                data-spoiler-from={tieGate(t)}>
                <path d={`M${a.x},${a.y} Q${cx},${cy} ${b.x},${b.y}`}
                  fill="none"
                  stroke={tieColour(t.bond, t.key, touched)}
                  strokeWidth={style.width}
                  strokeDasharray={style.dash}
                  strokeLinecap="round" />
                {showLabel && (
                  <>
                    <rect x={mx - t.label.length * 3.4 - 5} y={my - 9}
                      width={t.label.length * 6.8 + 10} height={18}
                      fill="var(--surface)" rx={2} />
                    <text x={mx} y={my} textAnchor="middle" dominantBaseline="middle"
                      style={{ font: '400 11px Old Standard TT, Georgia, serif' }}
                      fill={
                        touched ? 'var(--cloth-deep)'
                        : t.bond === 'disputed' ? 'var(--ink)'
                        : t.key ? 'var(--cloth-deep)'
                        : 'var(--ink-3)'
                      }>
                      {t.label}
                    </text>
                  </>
                )}
              </g>
            );
          })}

          {PEOPLE.map((p) => {
            const on = selected?.id === p.id;
            return (
              <g key={p.id} opacity={lit(p.id) ? 1 : 0.2}
                data-spoiler-from={ord(p.chapter)}
                className="hit"
                role="button"
                tabIndex={0}
                aria-label={p.name}
                onClick={() => setSelected(p)}
                onMouseEnter={() => setHovered(p)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(p)}
                onBlur={() => setHovered(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(p); }
                }}>
                <path
                  className="mark"
                  data-active={on || undefined}
                  data-uncertain={!on && p.id === 'smerdyakov' ? true : undefined}
                  transform={`translate(${p.x},${p.y})`}
                  d={markPath(p.group, on ? 11 : 8)}
                  stroke="var(--bg)"
                  strokeWidth={2}
                />
                <text x={p.x} y={p.y - (on ? 22 : 18)} textAnchor="middle"
                  style={{ font: `${on ? 700 : 400} 13px Old Standard TT, Georgia, serif` }}
                  fill="var(--ink)">
                  {p.name}
                </text>
              </g>
            );
          })}
        </svg>

        {(() => {
          const shown = selected ?? hovered;
          if (!shown) return null;
          const pos = anchorOf(shown);
          const pinned = selected?.id === shown.id;
          const uncertain = shown.id === 'smerdyakov';
          return (
            <div
              className={
                'anchored' +
                (pinned ? ' anchored--pinned' : '') +
                (uncertain && !pinned ? ' anchored--uncertain' : '')
              }
              style={{ left: pos.left, top: pos.top }}
            >
              <div className="anchored__name">{shown.name}</div>
              {/* The full-book line is folded for a reader part-way through;
                  they get who this person is when first met instead. */}
              <p className="anchored__who" data-spoiler-from={WHOLE_BOOK}>{shown.who}</p>
              <p className="anchored__who spoiler-note" data-spoiler-note={WHOLE_BOOK}>{shown.intro}</p>
              {pinned ? (
                <>
                  <p className="anchored__links">
                    <a className="link" href={`/read/${shown.chapter}`}>First met: {citeOf(shown.chapter)}</a>
                    {profiles.includes(shown.id) && (
                      <a className="link" href={`/character/${shown.id}`}>Character page</a>
                    )}
                  </p>
                  <ul className="anchored__ties">
                    {touches(shown.id).map((t) => {
                      const other = at(t.from === shown.id ? t.to : t.from);
                      const outgoing = t.from === shown.id;
                      return (
                        <li key={`${t.from}-${t.to}-${t.bond}`} className="anchored__tie"
                          data-spoiler-from={tieGate(t)}>
                          {/* Two actions, kept apart: go to the person, or open the evidence. */}
                          <button type="button" className="anchored__person" onClick={() => setSelected(other)}>
                            {/* Outgoing reads as a phrase (“wants Grushenka”);
                                incoming names the other person first (“Adelaïda · mother”). */}
                            {!outgoing && <>{other.name} · </>}
                            <span
                              className={
                                'anchored__bond' +
                                (t.bond === 'disputed' ? ' anchored__bond--uncertain'
                                  : t.key ? ' anchored__bond--key' : '')
                              }
                            >
                              {t.label}
                            </span>
                            {outgoing && <> {other.name}</>}
                          </button>
                          <a className="anchored__cite" href={passageHref(t.chapter, t.quote)}
                            aria-label={`Read the passage: ${citeOf(t.chapter)}`}>
                            {citeOf(t.chapter)}
                          </a>
                          {t.basis && t.basis !== 'fact' && (
                            <span className="anchored__basis">
                              {t.basis === 'said' ? 'A character’s claim' : 'Our reading'}
                              {t.note ? ` — ${t.note}` : ''}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  <button className="anchored__close" onClick={() => setSelected(null)}>
                    Close (Esc)
                  </button>
                </>
              ) : (
                <p className="meta">Click to see every connection</p>
              )}
            </div>
          );
        })()}
      </div>

    </div>
  );
}
