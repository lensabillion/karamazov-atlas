'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

export interface MapNode {
  id: string;
  label: string;
  meta?: string;
  href?: string;
  /** Character-group markers, the only categorical colour on this chart. */
  dots?: { id: string; group: string }[];
  children?: MapNode[];
}

interface Placed extends MapNode {
  depth: number;
  side: 'e' | 'w';
  open: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  kids: Placed[];
}

/* Type sizes here mirror globals.css §3 — xs 12, sm 14, md 18. */
const FONT = (d: number) =>
  d === 0
    ? '400 18px Spectral, Georgia, serif'
    : d === 1
      ? '700 14px "Alegreya Sans", sans-serif'
      : d === 2
        ? '400 14px "Alegreya Sans", sans-serif'
        : '400 12px "Alegreya Sans", sans-serif';
const PADX = (d: number) => (d === 0 ? 16 : d === 1 ? 12 : 10);
const HGT = (d: number) => (d === 0 ? 40 : d === 1 ? 28 : 24);

export default function MindMap({ root }: { root: MapNode }) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const s = new Set<string>([root.id]);
    root.children?.forEach((c) => s.add(c.id));
    return s;
  });
  const [selected, setSelected] = useState<MapNode>(root);
  const [tick, setTick] = useState(0);
  const measure = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    measure.current = document.createElement('canvas').getContext('2d');
    if (document.fonts) document.fonts.ready.then(() => setTick((t) => t + 1));
    else setTick((t) => t + 1);
  }, []);

  const { placed, bounds } = useMemo(() => {
    const ctx = measure.current;
    const textWidth = (label: string, depth: number) => {
      if (!ctx) return label.length * (depth === 0 ? 10 : 7);
      ctx.font = FONT(depth);
      return ctx.measureText(label).width;
    };

    const all: Placed[] = [];
    const build = (n: MapNode, depth: number, side: 'e' | 'w'): Placed => {
      const open = openIds.has(n.id);
      const dotW = n.dots?.length ? n.dots.length * 8 + 8 : 0;
      const p: Placed = {
        ...n,
        depth,
        side,
        open,
        x: 0,
        y: 0,
        w: textWidth(n.label, depth) + PADX(depth) * 2 + dotW,
        h: HGT(depth),
        kids: [],
      };
      all.push(p);
      if (open) p.kids = (n.children ?? []).map((c) => build(c, depth + 1, side));
      return p;
    };

    const rootP: Placed = {
      ...root,
      depth: 0,
      side: 'e',
      open: true,
      x: 0,
      y: 0,
      w: textWidth(root.label, 0) + 32,
      h: 40,
      kids: [],
    };
    all.push(rootP);
    const branches = root.children ?? [];
    const half = Math.ceil(branches.length / 2);
    rootP.kids = branches.map((b, i) => build(b, 1, i < half ? 'e' : 'w'));

    for (const side of ['e', 'w'] as const) {
      const cols: number[] = [0];
      let x = rootP.w / 2 + 64;
      for (let d = 1; d <= 4; d++) {
        cols[d] = x;
        const wmax = all
          .filter((n) => n.depth === d && n.side === side)
          .reduce((m, n) => Math.max(m, n.w), 0);
        x += wmax + 48;
      }
      const sgn = side === 'e' ? 1 : -1;
      for (const n of all) if (n.depth > 0 && n.side === side) n.x = sgn * (cols[n.depth] ?? 0);

      let cursor = 0;
      const ROW = 26;
      const GAP: Record<number, number> = { 1: 24, 2: 10, 3: 2, 4: 2 };
      const place = (n: Placed) => {
        if (n.kids.length === 0) {
          n.y = cursor + n.h / 2;
          cursor += Math.max(ROW, n.h + 2);
          return;
        }
        const ys: number[] = [];
        n.kids.forEach((k, i) => {
          place(k);
          ys.push(k.y);
          if (i < n.kids.length - 1) cursor += GAP[k.depth] ?? 0;
        });
        n.y = (ys[0]! + ys[ys.length - 1]!) / 2;
      };
      const stack = rootP.kids.filter((b) => b.side === side);
      stack.forEach((b, i) => {
        place(b);
        if (i < stack.length - 1) cursor += GAP[1]!;
      });
      const shift = cursor / 2;
      for (const n of all) if (n.depth > 0 && n.side === side) n.y -= shift;
    }
    rootP.x = 0;
    rootP.y = 0;

    const lefts = all.map((n) => (n.depth === 0 ? -n.w / 2 : n.side === 'e' ? n.x : n.x - n.w));
    const rights = all.map((n) => (n.depth === 0 ? n.w / 2 : n.side === 'e' ? n.x + n.w : n.x));
    const tops = all.map((n) => n.y - n.h / 2);
    const bottoms = all.map((n) => n.y + n.h / 2);
    return {
      placed: all,
      bounds: {
        x: Math.min(...lefts) - 28,
        y: Math.min(...tops) - 20,
        w: Math.max(...rights) - Math.min(...lefts) + 56,
        h: Math.max(...bottoms) - Math.min(...tops) + 40,
      },
    };
  }, [root, openIds, tick]);

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const edgeX = (n: Placed) => (n.depth === 0 ? n.w / 2 : n.side === 'e' ? n.x + n.w : n.x - n.w);

  return (
    <div className="split">
      <div className="chart scroll-x">
        <svg
          viewBox={`${bounds.x} ${bounds.y} ${bounds.w} ${bounds.h}`}
          role="img"
          aria-label="Structural map of the novel"
        >
          <g>
            {placed.map((n) =>
              n.kids.map((k) => {
                const x1 = n.depth === 0 ? (k.side === 'e' ? n.w / 2 : -n.w / 2) : edgeX(n);
                const mx = (x1 + k.x) / 2;
                return (
                  <path
                    key={`${n.id}-${k.id}`}
                    d={`M${x1},${n.y} C${mx},${n.y} ${mx},${k.y} ${k.x},${k.y}`}
                    fill="none"
                    stroke="var(--border-strong)"
                    strokeWidth={k.depth === 1 ? 1.5 : 1}
                  />
                );
              }),
            )}
          </g>
          <g>
            {placed.map((n) => {
              const left = n.depth === 0 ? -n.w / 2 : n.side === 'e' ? 0 : -n.w;
              const hasKids = (n.children?.length ?? 0) > 0;
              const knobX = n.depth === 0 ? n.w / 2 + 10 : n.side === 'e' ? n.w + 10 : -n.w - 10;
              const isSelected = selected.id === n.id;
              return (
                <g key={n.id} transform={`translate(${n.x},${n.y})`}>
                  <rect
                    x={left}
                    y={-n.h / 2}
                    width={n.w}
                    height={n.h}
                    rx={2}
                    fill={isSelected ? 'var(--accent-bg)' : 'var(--bg)'}
                    stroke={isSelected ? 'var(--accent)' : 'var(--border-strong)'}
                    strokeWidth={1}
                    onClick={() => setSelected(n)}
                  />
                  <text
                    x={n.depth === 0 ? 0 : n.side === 'e' ? PADX(n.depth) : -PADX(n.depth)}
                    y={1}
                    textAnchor={n.depth === 0 ? 'middle' : n.side === 'e' ? 'start' : 'end'}
                    dominantBaseline="middle"
                    style={{ font: FONT(n.depth) }}
                    fill="var(--text)"
                    pointerEvents="none"
                  >
                    {n.label}
                  </text>
                  {n.dots?.map((d, i) => (
                    <circle
                      key={d.id}
                      className={`group-${d.group}`}
                      cx={(n.side === 'e' ? n.w - 10 : -n.w + 10) + (n.side === 'e' ? -1 : 1) * i * 8}
                      cy={0}
                      r={3}
                      fill="var(--group-color)"
                    />
                  ))}
                  {hasKids && (
                    <g transform={`translate(${knobX},0)`} onClick={() => toggle(n.id)}>
                      <circle
                        r={6}
                        fill={n.open ? 'var(--bg)' : 'var(--text-faint)'}
                        stroke="var(--border-strong)"
                        strokeWidth={1}
                      />
                      <path
                        d={n.open ? 'M-3,0 H3' : 'M-3,0 H3 M0,-3 V3'}
                        stroke={n.open ? 'var(--text-faint)' : 'var(--bg)'}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                      />
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <aside className="sidebar">
        <p className="eyebrow">{selected.meta ?? 'Selected'}</p>
        <h2 className="subheading">{selected.label}</h2>
        {selected.href && (
          <a className="link text" href={selected.href}>
            Read this chapter →
          </a>
        )}
        {selected.children?.length ? (
          <ul className="list">
            {selected.children.map((c) => (
              <li key={c.id}>
                <button
                  className="list-item"
                  onClick={() => {
                    setSelected(c);
                    setOpenIds((p) => new Set(p).add(selected.id));
                  }}
                >
                  <span className="list-item__label">{c.label}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </aside>
    </div>
  );
}
