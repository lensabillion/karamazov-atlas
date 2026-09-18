import { markPath } from './GroupMark';
import type { NamedCharacter, Register } from '@/lib/names';

/**
 * How far the naming of each person ever relaxes.
 *
 * Not a frequency chart — a ceiling. Each row shows the least formal register
 * in which the TEXT names a character anywhere, narration included, under the
 * alias list in scripts/lib/characters.ts. It says how the prose names people;
 * it is not a measure of how anyone feels, and a finite alias list cannot
 * prove what nobody ever says (review finding R2). The page frames the
 * pattern it shows as a reading, offered as one.
 */
const LADDER: Register[] = ['formal', 'distanced', 'neutral', 'familiar', 'tender'];
const LABEL: Record<Register, string> = {
  formal: 'formal',
  distanced: 'distanced',
  neutral: 'neutral',
  familiar: 'familiar',
  tender: 'tender',
};

export default function WarmthLadder({
  characters,
  markIds = [],
}: {
  characters: NamedCharacter[];
  /** Characters to draw attention to — here, the three the murder runs through. */
  markIds?: string[];
}) {
  const rows = [...characters]
    .filter((c) => c.total >= 100)
    .sort(
      (a, b) =>
        LADDER.indexOf(b.warmestRegister) - LADDER.indexOf(a.warmestRegister) || b.total - a.total,
    );

  const W = 820;
  const rowH = 30;
  const H = rows.length * rowH + 34;
  const nameW = 132;
  const trackW = W - nameW - 96;
  const step = trackW / LADDER.length;

  return (
    <div className="chart scroll-x">
      <svg viewBox={`0 0 ${W} ${H}`} role="img"
        aria-label="The least formal register in which the text ever names each character">

        {LADDER.map((reg, i) => (
          <g key={reg}>
            <line x1={nameW + i * step + step / 2} y1={26} x2={nameW + i * step + step / 2} y2={H - 8}
              stroke="var(--border)" strokeWidth={1} />
            <text x={nameW + i * step + step / 2} y={16} textAnchor="middle"
              style={{ font: '400 11px Old Standard TT, Georgia, serif' }} fill="var(--ink-3)">
              {LABEL[reg]}
            </text>
          </g>
        ))}

        {rows.map((c, i) => {
          const y = 34 + i * rowH;
          const reach = LADDER.indexOf(c.warmestRegister);
          const x = nameW + reach * step + step / 2;
          const marked = markIds.includes(c.id);
          return (
            <g key={c.id} className={`group-${c.group}`}>
              <text x={nameW - 12} y={y} textAnchor="end" dominantBaseline="middle"
                style={{ font: `${marked ? 700 : 400} 13px Old Standard TT, Georgia, serif` }}
                fill={marked ? 'var(--cloth-deep)' : 'var(--ink)'}>
                {c.short}
              </text>
              {/* how far warmth reaches for this person */}
              <line x1={nameW + step / 2} y1={y} x2={x} y2={y}
                stroke={marked ? 'var(--gilt)' : 'var(--cloth)'} strokeWidth={marked ? 3 : 2} opacity={0.5} />
              <path className="mark" data-active={marked || undefined}
                transform={`translate(${x},${y})`} d={markPath(c.group, marked ? 6.5 : 4.5)} />
              <text x={W - 78} y={y} dominantBaseline="middle"
                style={{ font: '400 11px Old Standard TT, Georgia, serif' }} fill="var(--ink-3)">
                {c.total.toLocaleString()} namings
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
