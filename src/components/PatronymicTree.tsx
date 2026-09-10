import type { NamedCharacter } from '@/lib/names';

/**
 * The family reassembled from grammar alone.
 *
 * A patronymic names the father, so everyone carrying "Fyodorovitch" is a child
 * of Fyodor. The suffix is drawn as the literal thread connecting them. The
 * dashed descent is Smerdyakov, whose paternity the novel asserts exactly once
 * and never repeats.
 */
export default function PatronymicTree({
  father,
  patronymic,
  children,
  disputedId,
}: {
  father: string;
  patronymic: string;
  children: NamedCharacter[];
  disputedId?: string;
}) {
  const W = 860;
  const H = 300;
  const rootY = 44;
  const bandY = 132;
  const kidY = 232;
  const slot = W / children.length;

  return (
    <div className="chart scroll-x" tabIndex={0} role="region"
      aria-label="Family name diagram; scroll horizontally on small screens">
      <svg viewBox={`0 0 ${W} ${H}`} role="img"
        aria-label={`Characters carrying the patronymic ${patronymic}, all children of ${father}`}>

        {/* the father */}
        <text x={W / 2} y={rootY} textAnchor="middle"
          style={{ font: '400 22px Fraunces, Georgia, serif' }} fill="var(--ink)">
          {father} Pavlovitch
        </text>
        <text x={W / 2} y={rootY + 19} textAnchor="middle"
          style={{ font: '400 12px "DM Sans", sans-serif' }} fill="var(--ink-3)">
          the father
        </text>

        {/* the suffix, drawn as the thread they all hang from */}
        <line x1={40} y1={bandY} x2={W - 40} y2={bandY}
          stroke="var(--accent)" strokeWidth={1.5} />
        <rect x={W / 2 - 92} y={bandY - 14} width={184} height={28}
          fill="var(--bg)" stroke="var(--accent)" strokeWidth={1} rx={2} />
        <text x={W / 2} y={bandY + 1} textAnchor="middle" dominantBaseline="middle"
          style={{ font: '700 13px "DM Sans", sans-serif' }} fill="var(--accent)">
          — {patronymic}
        </text>

        {/* father down to the thread */}
        <line x1={W / 2} y1={rootY + 30} x2={W / 2} y2={bandY - 14}
          stroke="var(--border-strong)" strokeWidth={1} />

        {children.map((c, i) => {
          const x = slot * i + slot / 2;
          const disputed = c.id === disputedId;
          const formal = c.forms.find((f) => f.register === 'formal');
          return (
            <g key={c.id}>
              <line x1={x} y1={bandY} x2={x} y2={kidY - 30}
                stroke={disputed ? 'var(--ink-3)' : 'var(--border-strong)'}
                strokeWidth={1}
                strokeDasharray={disputed ? '3 4' : undefined} />
              <text x={x} y={kidY} textAnchor="middle"
                style={{ font: '400 24px Fraunces, Georgia, serif' }} fill="var(--ink)">
                {c.givenName ?? c.short}
              </text>
              <text x={x} y={kidY + 22} textAnchor="middle"
                style={{ font: '400 12px "DM Sans", sans-serif' }} fill="var(--ink-3)">
                {c.short === (c.givenName ?? c.short) ? '' : `“${c.short}” · `}
                {formal ? `${formal.count}×` : 'named so once'}
              </text>
              {disputed && (
                <text x={x} y={kidY + 44} textAnchor="middle"
                  style={{ font: '400 12px "DM Sans", sans-serif' }} fill="var(--accent)">
                  once, in 349,367 words
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
