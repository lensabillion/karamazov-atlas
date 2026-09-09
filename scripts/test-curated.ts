/**
 * Integrity checks for the hand-authored data.
 *
 * relationships.ts and timeline.ts are written by hand, and nothing enforced
 * their references. A tie pointing at a person id that does not exist, or a
 * span naming a character with no column, rendered as a silently missing line
 * on a diagram — a wrong picture rather than an error. These make that loud.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PEOPLE, TIES, ZONES, W, H } from '../src/lib/relationships.ts';
import { LANES, MOMENTS, SEGMENTS, SPANS } from '../src/lib/timeline.ts';

let failed = 0;
const check = (name: string, cond: boolean, detail = '') => {
  if (!cond) failed++;
  console.log(`${cond ? '  ok  ' : ' FAIL '} ${name}${cond ? '' : ` — ${detail}`}`);
};

const corpus = JSON.parse(readFileSync(join(process.cwd(), 'data', 'corpus.json'), 'utf8')) as {
  chapters: { id: string; cite: string }[];
};
const chapterIds = new Set(corpus.chapters.map((c) => c.id));
const cites = new Set(corpus.chapters.map((c) => c.cite));

console.log('relationships');
const personIds = new Set(PEOPLE.map((p) => p.id));
check('every person id is unique', personIds.size === PEOPLE.length);

const dangling = TIES.flatMap((t) =>
  [t.from, t.to].filter((id) => !personIds.has(id)).map((id) => `${t.from}->${t.to} (${id})`),
);
check('every tie endpoint resolves to a person', dangling.length === 0, dangling.join(', '));

const selfTies = TIES.filter((t) => t.from === t.to).map((t) => t.from);
check('no person is tied to themselves', selfTies.length === 0, selfTies.join(', '));

const outOfBounds = PEOPLE.filter((p) => p.x < 0 || p.x > W || p.y < 0 || p.y > H).map((p) => p.id);
check('every person sits inside the diagram', outOfBounds.length === 0, outOfBounds.join(', '));

const zoneOob = ZONES.filter((z) => z.x < 0 || z.x > W || z.y < 0 || z.y > H).map((z) => z.label);
check('every zone label sits inside the diagram', zoneOob.length === 0, zoneOob.join(', '));

const badTieCite = TIES.filter((t) => t.cite && !cites.has(t.cite)).map((t) => t.cite!);
check('every tie citation names a real chapter', badTieCite.length === 0, badTieCite.join(', '));

console.log('\ntimeline');
const laneIds = new Set(LANES.map((l) => l.id));
const segIds = new Set(SEGMENTS.map((s) => s.id));

const spanNoLane = SPANS.filter((s) => !laneIds.has(s.character)).map((s) => s.character);
check('every span belongs to a lane', spanNoLane.length === 0, [...new Set(spanNoLane)].join(', '));

const spanNoSeg = SPANS.flatMap((s) => s.segments.filter((id) => !segIds.has(id)));
check('every span segment exists', spanNoSeg.length === 0, [...new Set(spanNoSeg)].join(', '));

const unordered = SPANS.filter((s) => {
  const idx = s.segments.map((id) => SEGMENTS.findIndex((g) => g.id === id));
  return idx.some((v, i) => i > 0 && v !== idx[i - 1]! + 1);
}).map((s) => `${s.character}:${s.label}`);
check('multi-segment spans are contiguous and in order', unordered.length === 0, unordered.join(', '));

const badSpanChapter = SPANS.filter((s) => s.chapter && !chapterIds.has(s.chapter)).map((s) => s.chapter!);
check('every span chapter exists in the corpus', badSpanChapter.length === 0, badSpanChapter.join(', '));

const badSpanCite = SPANS.filter((s) => s.cite && !cites.has(s.cite)).map((s) => s.cite!);
check('every span citation names a real chapter', badSpanCite.length === 0, badSpanCite.join(', '));

const badMomentCh = MOMENTS.filter((m) => !chapterIds.has(m.chapter)).map((m) => m.chapter);
check('every moment chapter exists', badMomentCh.length === 0, badMomentCh.join(', '));

const momentNoLane = MOMENTS.flatMap((m) => m.who.filter((id) => !laneIds.has(id)));
check('every moment participant has a lane', momentNoLane.length === 0, [...new Set(momentNoLane)].join(', '));

const badFraction = SPANS.filter((s) => s.endFraction !== undefined && (s.endFraction < 0 || s.endFraction > 1));
check('endFraction stays within 0..1', badFraction.length === 0);

const endsWithoutFlag = SPANS.filter((s) => s.endFraction !== undefined && !s.ends).map((s) => s.label);
check('endFraction is only set on a span that ends', endsWithoutFlag.length === 0, endsWithoutFlag.join(', '));

// Word shares drive block heights; a segment claiming words it does not have
// would silently mis-scale the whole chart.
const declared = SEGMENTS.reduce((n, s) => n + s.words, 0);
check('segment word counts stay within the corpus', declared > 300_000 && declared <= 349_367,
  `declared ${declared}`);

console.log(failed === 0 ? '\nCurated data checks passed.' : `\n${failed} check(s) failed`);
process.exit(failed === 0 ? 0 : 1);
