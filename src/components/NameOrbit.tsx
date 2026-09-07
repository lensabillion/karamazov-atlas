import type { NamedCharacter, Register } from '@/lib/names';

/**
 * One person, and how close each of their names stands to them.
 *
 * Register is a distance: the formal name-plus-patronymic is held at arm's
 * length, the tender diminutive sits against the skin. Rings are that distance;
 * dot size is how often the form is used. Register is ordinal, so it is encoded
 * by radius and size — never by hue, which belongs to character groups.
 */
const RINGS: { key: Register; r: number; label: string }[] = [
  { key: 'tender', r: 28, label: 'tender' },
  { key: 'familiar', r: 52, label: 'familiar' },
  { key: 'neutral', r: 76, label: 'neutral' },
  { key: 'distanced', r: 100, label: 'distanced' },
  { key: 'formal', r: 124, label: 'formal' },
];

/* The box is wider than it is tall: labels sit beside their dots, and the
   longest of them ("Agrafena Alexandrovna") needs room past the outer ring. */
const W = 560;
const H = 330;
const CX = W / 2;
const CY = H / 2;

export default function NameOrbit({ character }: { character: NamedCharacter }) {
  const max = Math.max(...character.forms.map((f) => f.count), 1);

  return (
    <figure className={`chart group-${character.group}`} style={{ margin: 0 }}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img"
        aria-label={`The names of ${character.short}, placed by intimacy`}>

        {RINGS.map((ring) => (
          <circle key={ring.key} cx={CX} cy={CY} r={ring.r}
            fill="none" stroke="var(--border)" strokeWidth={1} />
        ))}

        {/* the person */}
        <text x={CX} y={CY} textAnchor="middle" dominantBaseline="middle"
          style={{ font: '400 15px Spectral, Georgia, serif' }} fill="var(--text)">
          {character.short}
        </text>

        {character.forms.map((f, i) => {
          const ring = RINGS.find((r) => r.key === f.register)!;
          // Spread forms around the circle deterministically, starting top-left.
          const angle = (-140 + i * 61) * (Math.PI / 180);
          const x = CX + Math.cos(angle) * ring.r;
          const y = CY + Math.sin(angle) * ring.r;
          const dot = 3 + Math.sqrt(f.count / max) * 11;
          const flip = x < CX;
          return (
            <g key={f.form}>
              <circle cx={x} cy={y} r={dot} fill="var(--group-color)" />
              <text x={x + (flip ? -(dot + 6) : dot + 6)} y={y}
                textAnchor={flip ? 'end' : 'start'} dominantBaseline="middle"
                style={{ font: '400 13px Spectral, Georgia, serif' }} fill="var(--text)">
                {f.form}
              </text>
              <text x={x + (flip ? -(dot + 6) : dot + 6)} y={y + 14}
                textAnchor={flip ? 'end' : 'start'} dominantBaseline="middle"
                style={{ font: '400 11px "Alegreya Sans", sans-serif' }} fill="var(--text-faint)">
                {f.count}×
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="meta" style={{ padding: 'var(--space-2) var(--space-3)' }}>
        {character.name} — {character.forms.length} ways of being named.
        Nearer the centre is more intimate.
      </figcaption>
    </figure>
  );
}
