/**
 * The title page's device, drawn from scratch (atlas-1d7j).
 *
 * A period title page carries a publisher's mark between the author and the
 * imprint. This atlas draws its own rather than tracing anyone's: three rings
 * interlocked for the three sons Fyodor Pavlovitch acknowledges, and a fourth,
 * dashed and set a little apart, for the one the town says is his — the same
 * dashed line the relationship map uses for what the novel never settles.
 * Built from primitives, in the ink of the page.
 */
export default function TitleDevice({ size = 88 }: { size?: number }) {
  const r = 13;
  // Three rings on a small triangle, the fourth below and apart.
  const rings: { x: number; y: number; dashed?: boolean }[] = [
    { x: 30, y: 26 },
    { x: 50, y: 26 },
    { x: 40, y: 42 },
    { x: 40, y: 64, dashed: true },
  ];
  return (
    <svg viewBox="0 0 80 84" width={size} height={(size * 84) / 80} aria-hidden="true"
      role="presentation" style={{ display: 'block', color: 'var(--ink)' }}>
      {/* the oval cartouche, as a device is usually framed */}
      <ellipse cx={40} cy={42} rx={37} ry={40} fill="none" stroke="currentColor" strokeWidth={1} opacity={0.55} />
      {rings.map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r={r} fill="none" stroke="currentColor"
          strokeWidth={1.3} strokeDasharray={c.dashed ? '2.5 3' : undefined}
          opacity={c.dashed ? 0.7 : 0.9} />
      ))}
    </svg>
  );
}
