import type { NamedCharacter, Register } from '@/lib/names';

/**
 * The warmest thing anyone in the novel ever calls each person.
 *
 * Not a frequency chart — a ceiling. Each row shows how far up the register
 * ladder a character is ever addressed, across all 349,367 words. The three
 * men at the centre of the murder occupy the three coldest rows in the book:
 * the father nobody ever addresses familiarly, the brother nobody gives a
 * diminutive, and the son called by a surname 371 times and a name once.
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
        aria-label="The warmest register in which each character is ever addressed">

        {LADDER.map((reg, i) => (
          <g key={reg}>
            <line x1={nameW + i * step + step / 2} y1={26} x2={nameW + i * step + step / 2} y2={H - 8}
              stroke="var(--border)" strokeWidth={1} />
            <text x={nameW + i * step + step / 2} y={16} textAnchor="middle"
              style={{ font: '400 11px "Alegreya Sans", sans-serif' }} fill="var(--text-faint)">
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
                style={{ font: `${marked ? 700 : 400} 13px "Alegreya Sans", sans-serif` }}
                fill={marked ? 'var(--accent)' : 'var(--text)'}>
                {c.short}
              </text>
              {/* how far warmth reaches for this person */}
              <line x1={nameW + step / 2} y1={y} x2={x} y2={y}
                stroke="var(--group-color)" strokeWidth={marked ? 3 : 2} opacity={0.55} />
              <circle cx={x} cy={y} r={marked ? 6 : 4.5} fill="var(--group-color)" />
              <text x={W - 78} y={y} dominantBaseline="middle"
                style={{ font: '400 11px "Alegreya Sans", sans-serif' }} fill="var(--text-faint)">
                {c.total.toLocaleString()} namings
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
