import { markPath } from './GroupMark';
import type { Address, NamedCharacter, Register } from '@/lib/names';

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

export default function NameOrbit({
  character,
  addresses = [],
  nameOf,
}: {
  character: NamedCharacter;
  /** Observed acts of address aimed at this character. */
  addresses?: Address[];
  /** Character id → short name, for labelling speakers. */
  nameOf?: Record<string, string>;
}) {
  const max = Math.max(...character.forms.map((f) => f.count), 1);

  // Who is on record using each form for this person.
  const speakersOf = (form: string) =>
    addresses
      .filter((a) => a.target === character.id && a.form === form)
      .sort((a, b) => b.count - a.count)
      .map((a) => nameOf?.[a.speaker] ?? a.speaker);

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
          style={{ font: '400 15px Fraunces, Georgia, serif' }} fill="var(--ink)">
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
          const who = speakersOf(f.form);
          const lx = x + (flip ? -(dot + 6) : dot + 6);
          const anchor = flip ? 'end' : 'start';
          return (
            <g key={f.form}>
              <path className="mark" transform={`translate(${x},${y})`}
                d={markPath(character.group, dot)} />
              <text x={lx} y={y} textAnchor={anchor} dominantBaseline="middle"
                style={{ font: '400 13px Fraunces, Georgia, serif' }} fill="var(--ink)">
                {f.form}
              </text>
              <text x={lx} y={y + 14} textAnchor={anchor} dominantBaseline="middle"
                style={{ font: '400 11px "DM Sans", sans-serif' }} fill="var(--ink-3)">
                {f.count}×
                {who.length > 0 && ` · heard from ${who.slice(0, 3).join(', ')}`}
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
