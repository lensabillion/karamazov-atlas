/**
 * A printer's ornament, drawn from scratch.
 *
 * Period title pages break their blocks with a small centred device. This is an
 * original geometric figure in that spirit — a lozenge on an axis with four
 * radiating leaves — not a trace of any binding or publisher's mark. It is
 * built from primitives so it scales cleanly and carries no imagery.
 */
export default function Ornament({ width = 96 }: { width?: number }) {
  const w = 120;
  const h = 26;
  const cx = w / 2;
  const cy = h / 2;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={width}
      height={(width * h) / w}
      role="presentation"
      aria-hidden="true"
      style={{ display: 'block', opacity: 0.75 }}
    >
      {/* the axis, stopping short of the centre device */}
      <line x1={2} y1={cy} x2={cx - 17} y2={cy} stroke="currentColor" strokeWidth={1} />
      <line x1={cx + 17} y1={cy} x2={w - 2} y2={cy} stroke="currentColor" strokeWidth={1} />

      {/* centre lozenge */}
      <path
        d={`M${cx},${cy - 9} L${cx + 7},${cy} L${cx},${cy + 9} L${cx - 7},${cy} Z`}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
      />
      <path
        d={`M${cx},${cy - 4} L${cx + 3},${cy} L${cx},${cy + 4} L${cx - 3},${cy} Z`}
        fill="currentColor"
      />

      {/* four leaves, quarter-arcs springing from the lozenge's points */}
      {[
        [cx - 9, cy, -1, -1],
        [cx - 9, cy, -1, 1],
        [cx + 9, cy, 1, -1],
        [cx + 9, cy, 1, 1],
      ].map(([x, y, dx, dy], i) => (
        <path
          key={i}
          d={`M${x},${y} q${(dx as number) * 5},${(dy as number) * 5} ${(dx as number) * 9},${(dy as number) * 1.5}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
