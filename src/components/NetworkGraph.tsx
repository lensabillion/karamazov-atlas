'use client';

import { useEffect, useMemo, useState } from 'react';

export interface GraphNode {
  id: string;
  short: string;
  group: string;
  total: number;
  chapterCount: number;
}
export interface GraphEdge {
  source: string;
  target: string;
  weight: number;
}

const GROUPS = ['family', 'women', 'monastery', 'boys', 'court', 'town'] as const;

const W = 900;
const H = 620;

interface Sim {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

/**
 * Deterministic force-directed layout: repulsion between every pair, springs along
 * co-occurrence edges (stiffer for characters who share more chapters), and a weak
 * pull to centre. Seeded so the same data always produces the same picture.
 */
function layout(nodes: GraphNode[], edges: GraphEdge[], minWeight: number): Sim[] {
  const maxTotal = Math.max(...nodes.map((n) => n.total));
  const sims: Sim[] = nodes.map((n, i) => {
    const a = (i / nodes.length) * Math.PI * 2;
    return {
      id: n.id,
      x: W / 2 + Math.cos(a) * 210,
      y: H / 2 + Math.sin(a) * 190,
      vx: 0,
      vy: 0,
      r: 7 + Math.sqrt(n.total / maxTotal) * 21,
    };
  });
  const index = new Map(sims.map((s, i) => [s.id, i]));
  const active = edges.filter((e) => e.weight >= minWeight);
  const maxW = Math.max(1, ...active.map((e) => e.weight));

  for (let step = 0; step < 420; step++) {
    const cooling = 1 - step / 420;

    for (let i = 0; i < sims.length; i++) {
      for (let j = i + 1; j < sims.length; j++) {
        const a = sims[i]!;
        const b = sims[j]!;
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let d2 = dx * dx + dy * dy;
        if (d2 < 1) { d2 = 1; dx = 0.5; dy = 0.5; }
        const d = Math.sqrt(d2);
        const force = (2600 + (a.r + b.r) * 90) / d2;
        const fx = (dx / d) * force;
        const fy = (dy / d) * force;
        a.vx -= fx; a.vy -= fy;
        b.vx += fx; b.vy += fy;
      }
    }

    for (const e of active) {
      const ai = index.get(e.source);
      const bi = index.get(e.target);
      if (ai === undefined || bi === undefined) continue;
      const a = sims[ai]!;
      const b = sims[bi]!;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.max(1, Math.hypot(dx, dy));
      const rest = 150 - (e.weight / maxW) * 78;
      const k = 0.0022 * (0.35 + (e.weight / maxW) * 0.65);
      const force = (d - rest) * k;
      const fx = (dx / d) * force;
      const fy = (dy / d) * force;
      a.vx += fx; a.vy += fy;
      b.vx -= fx; b.vy -= fy;
    }

    for (const s of sims) {
      s.vx += (W / 2 - s.x) * 0.0016;
      s.vy += (H / 2 - s.y) * 0.0016;
      s.vx *= 0.82 * cooling + 0.1;
      s.vy *= 0.82 * cooling + 0.1;
      s.x += s.vx;
      s.y += s.vy;
      s.x = Math.max(s.r + 46, Math.min(W - s.r - 46, s.x));
      s.y = Math.max(s.r + 18, Math.min(H - s.r - 18, s.y));
    }
  }
  // The simulation runs on both the server and the client. Float results can
  // differ in the last ulp between the two, which React reports as a hydration
  // mismatch, so quantise the output to a precision well above that noise.
  const q = (v: number) => Math.round(v * 100) / 100;
  for (const s of sims) {
    s.x = q(s.x);
    s.y = q(s.y);
    s.r = q(s.r);
  }
  return sims;
}

export default function NetworkGraph({ nodes, edges }: { nodes: GraphNode[]; edges: GraphEdge[] }) {
  const [minWeight, setMinWeight] = useState(4);
  const [hover, setHover] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const sims = useMemo(() => layout(nodes, edges, minWeight), [nodes, edges, minWeight]);
  const pos = useMemo(() => new Map(sims.map((s) => [s.id, s])), [sims]);
  const shown = useMemo(() => edges.filter((e) => e.weight >= minWeight), [edges, minWeight]);
  const maxW = Math.max(1, ...shown.map((e) => e.weight));

  useEffect(() => setReady(true), []);

  const dim = (id: string) =>
    hover !== null &&
    hover !== id &&
    !shown.some(
      (e) => (e.source === hover && e.target === id) || (e.target === hover && e.source === id),
    );

  return (
    <div className="stack stack--loose">
      <div className="row row--between">
        <label className="row">
          <span className="text-muted">Minimum shared chapters</span>
          <input
            className="range"
            type="range"
            min={1}
            max={12}
            value={minWeight}
            onChange={(e) => setMinWeight(Number(e.currentTarget.value))}
          />
          <span className="text num">{minWeight}</span>
          <span className="meta">
            {shown.length} of {edges.length} ties shown
          </span>
        </label>
        <div className="row">
          {GROUPS.map((g) => (
            <span className={`chip group-${g}`} key={g}>
              <span className="dot" />
              {g}
            </span>
          ))}
        </div>
      </div>

      <div className="chart scroll-x">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Character co-occurrence network">
          <g>
            {shown.map((e) => {
              const a = pos.get(e.source);
              const b = pos.get(e.target);
              if (!a || !b) return null;
              const lit = hover === e.source || hover === e.target;
              return (
                <line
                  key={`${e.source}-${e.target}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="var(--text-faint)"
                  strokeWidth={Math.round((0.5 + (e.weight / maxW) * 3) * 100) / 100}
                  strokeLinecap="round"
                  opacity={hover === null ? 0.3 : lit ? 0.75 : 0.06}
                />
              );
            })}
          </g>
          <g>
            {nodes.map((n) => {
              const p = pos.get(n.id);
              if (!p) return null;
              return (
                <g
                  key={n.id}
                  className={`group-${n.group}`}
                  transform={`translate(${p.x},${p.y})`}
                  opacity={ready ? (dim(n.id) ? 0.15 : 1) : 0}
                  onMouseEnter={() => setHover(n.id)}
                  onMouseLeave={() => setHover(null)}
                >
                  <a href={`/character/${n.id}`}>
                    <circle
                      r={p.r}
                      fill="var(--group-color)"
                      stroke="var(--surface)"
                      strokeWidth={1.5}
                    />
                    <text className="chart-label" y={p.r + 13} textAnchor="middle">
                      {n.short}
                    </text>
                  </a>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
