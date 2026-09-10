import type { Segment, Span } from './timeline';

/** A narrated interval in chart coordinates. */
export interface TimelineBand { y: number; h: number; }

/** Preserve word proportions while reserving fixed height for skipped time. */
export function buildTimelineBands(segments: Segment[], height: number, gapHeight: number) {
  const words = segments.reduce((sum, segment) => sum + segment.words, 0);
  const scale = (height - segments.filter((segment) => segment.elided).length * gapHeight) / words;
  const bands: Record<string, TimelineBand> = {};
  let y = 0;
  for (const segment of segments) {
    const h = segment.elided ? gapHeight : segment.words * scale;
    bands[segment.id] = { y, h };
    y += h;
  }
  return bands;
}

/** Terminate a thread at its recorded position within the last interval. */
export function getSpanBox(span: Span, bands: Record<string, TimelineBand>): TimelineBand {
  const first = bands[span.segments[0]!]!;
  const last = bands[span.segments[span.segments.length - 1]!]!;
  const lastHeight = last.h * (span.ends ? (span.endFraction ?? 1) : 1);
  return { y: first.y, h: last.y - first.y + lastHeight };
}

/** Bound SVG labels; the full wording remains in the detail panel. */
export function wrapTimelineLabel(text: string, perLine: number, maxLines = Infinity): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    if (line && `${line} ${word}`.length > perLine) { lines.push(line); line = word; }
    else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  if (lines.length <= maxLines) return lines;
  const visible = lines.slice(0, maxLines);
  visible[visible.length - 1] = `${visible[visible.length - 1]!.slice(0, perLine - 1).trimEnd()}…`;
  return visible;
}
