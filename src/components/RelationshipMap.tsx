'use client';

import { useState } from 'react';
import { markPath } from './GroupMark';
import { BOND_STYLE, H, PEOPLE, TIES, W, ZONES, type Person } from '@/lib/relationships';

type TieKey = string;

/**
 * Who these people are to each other.
 *
 * Deliberately not a force simulation. The layout is the argument: the father
 * sits above his four sons, the two women below, and the lines that cross
 * between those rows are the plot. The heavy lines are the ones the murder
 * runs along — two men wanting the same woman, one brother teaching another
 * man the idea, and the killing itself.
 */
export default function RelationshipMap() {
  const [selected, setSelected] = useState<Person | null>(null);

  const at = (id: string) => PEOPLE.find((p) => p.id === id)!;

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
      <div className="chart scroll-x">
        <svg viewBox={`0 0 ${W} ${H}`} role="img"
          aria-label="Map of who the characters are to each other">

          {ZONES.map((z) => (
            <text key={z.label} x={z.x} y={z.y} textAnchor="middle"
              style={{ font: '700 11px "DM Sans", sans-serif', letterSpacing: '0.12em' }}
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
              <g key={`${t.from}-${t.to}-${t.bond}`} opacity={active ? 1 : 0.12}>
                <path d={`M${a.x},${a.y} Q${cx},${cy} ${b.x},${b.y}`}
                  fill="none"
                  stroke={touched ? 'var(--teal)' : t.key ? 'var(--blue)' : 'var(--border-strong)'}
                  strokeWidth={style.width}
                  strokeDasharray={style.dash}
                  strokeLinecap="round" />
                {showLabel && (
                  <>
                    <rect x={mx - t.label.length * 3.4 - 5} y={my - 9}
                      width={t.label.length * 6.8 + 10} height={18}
                      fill="var(--surface)" rx={2} />
                    <text x={mx} y={my} textAnchor="middle" dominantBaseline="middle"
                      style={{ font: '400 11px "DM Sans", sans-serif' }}
                      fill={touched ? 'var(--teal-deep)' : t.key ? 'var(--blue)' : 'var(--ink-3)'}>
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
              <g key={p.id} className={`group-${p.group}`} opacity={lit(p.id) ? 1 : 0.2}
                onClick={() => setSelected(p)} style={{ cursor: 'pointer' }}>
                <path className="mark" data-active={on || undefined}
                  transform={`translate(${p.x},${p.y})`}
                  d={markPath(p.group, on ? 11 : 8)}
                  stroke="var(--bg)" strokeWidth={2} />
                <text x={p.x} y={p.y - (on ? 22 : 18)} textAnchor="middle"
                  style={{ font: `${on ? 700 : 400} 13px "DM Sans", sans-serif` }}
                  fill="var(--ink)">
                  {p.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {selected && (
        <div className={`name-panel group-${selected.group}`}>
          <div className="stack stack--tight">
            <p className="eyebrow">Who this is</p>
            <h3 className="subheading">{selected.name}</h3>
            <p className="text-muted">{selected.who}</p>
          </div>
          <ul className="list">
            {touches(selected.id).map((t) => {
              const other = at(t.from === selected.id ? t.to : t.from);
              const outgoing = t.from === selected.id;
              return (
                <li key={`${t.from}-${t.to}-${t.bond}`}>
                  <button className="list-item" onClick={() => setSelected(other)}>
                    <span className="list-item__label">
                      {outgoing ? (
                        <>
                          <strong>{t.label}</strong> {other.name}
                        </>
                      ) : (
                        <>
                          {other.name} <strong>{t.label}</strong> them
                        </>
                      )}
                    </span>
                    {t.cite && <span className="meta">{t.cite}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
