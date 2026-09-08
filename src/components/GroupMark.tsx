/**
 * A character group, drawn as a shape.
 *
 * The design system allows two hues (docs/design-system.md §5). Six groups
 * cannot be told apart by two hues, and a blue-to-teal ramp would imply an
 * order these categories do not have. So category is encoded by SHAPE — a
 * genuinely categorical channel, which also survives greyscale printing and
 * does not fail for colour-blind readers.
 *
 * Colour is then free to carry state: blue at rest, teal when active.
 */
export type Group = 'family' | 'women' | 'monastery' | 'boys' | 'town' | 'court';

export const GROUP_SHAPE: Record<Group, string> = {
  family: 'circle',
  women: 'diamond',
  monastery: 'triangle',
  boys: 'square',
  town: 'hexagon',
  court: 'cross',
};

export const GROUP_LABEL: Record<Group, string> = {
  family: 'Household',
  women: 'The women',
  monastery: 'Monastery',
  boys: 'The boys',
  town: 'The town',
  court: 'The court',
};

/** Path for a mark of radius r centred on the origin. */
export function markPath(group: string, r: number): string {
  switch (GROUP_SHAPE[group as Group]) {
    case 'diamond':
      return `M0,${-r} L${r},0 L0,${r} L${-r},0 Z`;
    case 'triangle': {
      const h = r * 1.15;
      return `M0,${-h} L${h * 0.92},${h * 0.66} L${-h * 0.92},${h * 0.66} Z`;
    }
    case 'square': {
      const s = r * 0.88;
      return `M${-s},${-s} H${s} V${s} H${-s} Z`;
    }
    case 'hexagon': {
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i - Math.PI / 2;
        return `${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`;
      });
      return `M${pts.join(' L')} Z`;
    }
    case 'cross': {
      const t = r * 0.38;
      return `M${-t},${-r} H${t} V${-t} H${r} V${t} H${t} V${r} H${-t} V${t} H${-r} V${-t} H${-t} Z`;
    }
    default: {
      // circle, drawn as a path so every mark is one element type
      return `M${-r},0 A${r},${r} 0 1,0 ${r},0 A${r},${r} 0 1,0 ${-r},0 Z`;
    }
  }
}

export default function GroupMark({
  group,
  r = 6,
  active = false,
  x = 0,
  y = 0,
}: {
  group: string;
  r?: number;
  active?: boolean;
  x?: number;
  y?: number;
}) {
  return (
    <path
      className="mark"
      data-active={active || undefined}
      transform={`translate(${x},${y})`}
      d={markPath(group, r)}
    />
  );
}
