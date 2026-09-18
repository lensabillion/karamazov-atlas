/**
 * Integrity checks for the hand-authored data.
 *
 * relationships.ts and timeline.ts are written by hand, and nothing enforced
 * their references. A tie pointing at a person id that does not exist, or a
 * span naming a character with no column, rendered as a silently missing line
 * on a diagram — a wrong picture rather than an error. These make that loud.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PEOPLE, TIES, ZONES, W, H } from '../src/lib/relationships.ts';
import { LANES, MOMENTS, SEGMENTS, SPANS } from '../src/lib/timeline.ts';
import { ILLUSTRATED_SCENES } from '../src/lib/illustrated-scenes.ts';
import { CHARACTER_BIOGRAPHIES } from '../src/lib/character-biographies.ts';
import { COLLAGE_PLATES } from '../src/lib/collage-catalogue.ts';
import { STORY_MOVEMENTS } from '../src/lib/illustration-stories.ts';
import { findPassage, toParagraphs } from '../src/lib/passage.ts';
import { isVerbatim } from './lib/verbatim.ts';
import { BOOK_ORIENTATION, CHAPTER_ORIENTATION } from '../src/lib/orientation.ts';
import { CHARACTER_INTRODUCTIONS } from '../src/lib/character-biographies.ts';

let failed = 0;
const check = (name: string, cond: boolean, detail = '') => {
  if (!cond) failed++;
  console.log(`${cond ? '  ok  ' : ' FAIL '} ${name}${cond ? '' : ` — ${detail}`}`);
};

const corpus = JSON.parse(readFileSync(join(process.cwd(), 'data', 'corpus.json'), 'utf8')) as {
  chapters: { id: string }[];
};
const chapterIds = new Set(corpus.chapters.map((c) => c.id));
const mentions = JSON.parse(readFileSync(join(process.cwd(), 'data', 'mentions.json'), 'utf8')) as {
  characters: { id: string }[];
};
const names = JSON.parse(readFileSync(join(process.cwd(), 'data', 'names.json'), 'utf8')) as {
  characters: { id: string }[];
};
const castIds = new Set(mentions.characters.map((c) => c.id));
const namedIds = new Set(names.characters.map((c) => c.id));

console.log('relationships');
const personIds = new Set(PEOPLE.map((p) => p.id));
check('every person id is unique', personIds.size === PEOPLE.length);
check('every homepage character has name-form data',
  [...castIds].every((id) => namedIds.has(id)));
check('every homepage character has a biography',
  [...castIds].every((id) => Boolean(CHARACTER_BIOGRAPHIES[id]?.trim())));

console.log('\nillustrated scenes');
check('the six supplied scenes have distinct anchors', ILLUSTRATED_SCENES.length === 6
  && new Set(ILLUSTRATED_SCENES.map((scene) => scene.id)).size === 6);
check('every scene opens an existing chapter',
  ILLUSTRATED_SCENES.every((scene) => chapterIds.has(scene.chapter)));
check('every scene participant and placement resolves to a character page',
  ILLUSTRATED_SCENES.every((scene) => [scene.afterCharacter, ...scene.people].every((id) => castIds.has(id))));
check('every original scene image exists locally',
  ILLUSTRATED_SCENES.every((scene) => existsSync(join(process.cwd(), 'src/assets/scenes', scene.file))));
check('each full-size scene has a visual cue and a reason to remember it',
  ILLUSTRATED_SCENES.every((scene) => Boolean(scene.looking.trim() && scene.note.trim())));

console.log('\nextracted collage');
check('all 36 extracted compositions have unique ids', COLLAGE_PLATES.length === 36
  && new Set(COLLAGE_PLATES.map((plate) => plate.id)).size === 36);
check('every crop exists at its public image path', COLLAGE_PLATES.every((plate) =>
  existsSync(join(process.cwd(), 'public', plate.image)) && plate.width > 0 && plate.height > 0));
check('every confirmed identification cites a source', COLLAGE_PLATES.every((plate) =>
  plate.status !== 'identified' || Boolean(plate.source?.startsWith('https://'))));
check('uncertain identifications never assert character or chapter links', COLLAGE_PLATES.every((plate) =>
  plate.status === 'identified' || (plate.people.length === 0 && !plate.chapter)));
check('all catalogue reading and character links resolve', COLLAGE_PLATES.every((plate) =>
  plate.people.every((id) => castIds.has(id)) && (!plate.chapter || chapterIds.has(plate.chapter))));

console.log('\ngenerated studies');
// The studies are imported as images, which plain tsx cannot load, so they are
// checked from the source text and the files on disk.
const studySource = readFileSync(join(process.cwd(), 'src/lib/collage-studies.ts'), 'utf8');
const studyIds = [...studySource.matchAll(/plateId: (\d+)/g)].map((m) => Number(m[1]));
check('every generated study follows a real plate', studyIds.length > 0
  && studyIds.every((id) => COLLAGE_PLATES.some((plate) => plate.id === id)));
check('every study image exists', studyIds.every((id) =>
  existsSync(join(process.cwd(), 'src/assets/studies', `study-plate-${String(id).padStart(2, '0')}.jpg`))));
check('every study says what it invents', (studySource.match(/invented: '/g) ?? []).length === studyIds.length);
check('the two studies that change their subject stay out', !studyIds.includes(21) && !studyIds.includes(31));
check('a study never adds a link its plate lacks', studyIds.every((id) => {
  const plate = COLLAGE_PLATES.find((p) => p.id === id)!;
  return plate.status === 'identified' || (plate.people.length === 0 && !plate.chapter);
}));

console.log('\nillustrated storytelling');
const storyEntries = STORY_MOVEMENTS.flatMap((movement) => movement.entries);
const storyPlateIds = new Set(storyEntries.map((entry) => entry.plateId));
const identifiedPlates = COLLAGE_PLATES.filter((plate) => plate.status === 'identified');
check('every confirmed illustration has exactly one story', storyEntries.length === identifiedPlates.length
  && storyPlateIds.size === storyEntries.length
  && identifiedPlates.every((plate) => storyPlateIds.has(plate.id)));
check('story movements have unique anchors and introductions', STORY_MOVEMENTS.length > 0
  && new Set(STORY_MOVEMENTS.map((movement) => movement.id)).size === STORY_MOVEMENTS.length
  && STORY_MOVEMENTS.every((movement) => Boolean(movement.title.trim() && movement.introduction.trim())
    && movement.entries.length > 0));
check('every story explains the scene, a visual detail and its significance', storyEntries.every((entry) =>
  Boolean(entry.heading.trim() && entry.story.trim() && entry.looking.trim() && entry.remember.trim())));
check('all story reading companions resolve to the text', storyEntries.every((entry) =>
  !entry.chapter || chapterIds.has(entry.chapter)));

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

// R8: every line on the map must open onto the passage behind it.
const badTieChapter = TIES.filter((t) => !chapterIds.has(t.chapter)).map((t) => `${t.from}->${t.to}`);
check('every tie opens a real chapter', badTieChapter.length === 0, badTieChapter.join(', '));

const badPersonChapter = PEOPLE.filter((p) => !chapterIds.has(p.chapter)).map((p) => p.id);
check('every person opens the chapter where they are met', badPersonChapter.length === 0,
  badPersonChapter.join(', '));

const noIntro = PEOPLE.filter((p) => !p.intro.trim() || !p.who.trim()).map((p) => p.id);
check('every person has a first-meeting intro and a full-book line', noIntro.length === 0, noIntro.join(', '));

// A claim a character makes, or a reading this atlas offers, must say so.
const unqualified = TIES.filter((t) => t.basis && t.basis !== 'fact' && !t.note?.trim())
  .map((t) => `${t.from}->${t.to}`);
check('every claimed or interpreted tie explains itself', unqualified.length === 0, unqualified.join(', '));

// The murder is only ever a character's account in this novel; it must not be drawn as narrated fact.
const killing = TIES.find((t) => t.bond === 'killed');
check('the killing is marked as Smerdyakov’s own account', killing?.basis === 'said');

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

const noSpanChapter = SPANS.filter((s) => !s.chapter).map((s) => `${s.character}:${s.label}`);
check('every timeline block opens a chapter (R8)', noSpanChapter.length === 0, noSpanChapter.join(', '));

// R5 regression: Ivan went to Moscow, not Tchermashnya.
check('no moment sends Ivan to Tchermashnya',
  !MOMENTS.some((m) => m.who.includes('ivan') && /leaves for Tchermashnya/.test(m.label)));

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

console.log('\nquoted passages');
// A link that lands on a passage must land on a real one, inside a single
// paragraph split exactly as the reader splits it.
const paragraphsOf = (id: string) =>
  toParagraphs(readFileSync(join(process.cwd(), 'data', 'chapters', `${id}.txt`), 'utf8'));
const quoted = [
  ...TIES.filter((t) => t.quote).map((t) => ({ where: `${t.from}->${t.to}`, chapter: t.chapter, quote: t.quote! })),
  ...SPANS.filter((s) => s.quote).map((s) => ({ where: `${s.character}:${s.label}`, chapter: s.chapter, quote: s.quote! })),
];
const misquoted = quoted.filter((q) => findPassage(paragraphsOf(q.chapter), q.quote) === -1).map((q) => q.where);
check(`all ${quoted.length} quoted phrases occur verbatim in one paragraph of their chapter`,
  misquoted.length === 0, misquoted.join(', '));
const keyUnquoted = TIES.filter((t) => t.key && !t.quote).map((t) => `${t.from}->${t.to}`);
check('every tie the murder runs along lands on its sentence', keyUnquoted.length === 0, keyUnquoted.join(', '));

console.log('\nwhy this is here');
const order = new Map(corpus.chapters.map((c, i) => [c.id, i + 1]));
const books = [...new Set(corpus.chapters.map((c) => Number(c.id.slice(1, 3))))];
check('every book has an orientation', books.every((b) => BOOK_ORIENTATION[b]?.where.trim() && BOOK_ORIENTATION[b]?.why.trim()));
const badOrientation = Object.keys(CHAPTER_ORIENTATION).filter((id) => !chapterIds.has(id));
check('every chapter note belongs to a real chapter', badOrientation.length === 0, badOrientation.join(', '));
// The one rule a spoiler-free note cannot break mechanically: naming someone
// the reader has not met. A book note shows from the book's first chapter.
const namesFull = JSON.parse(readFileSync(join(process.cwd(), 'data', 'names.json'), 'utf8')) as {
  characters: { id: string; forms: { form: string }[] }[];
};
const metAt = (id: string) => order.get(CHARACTER_INTRODUCTIONS[id]?.chapter ?? '') ?? 1;
const namedTooEarly = (text: string, at: number) => namesFull.characters
  .filter((c) => metAt(c.id) > at && c.forms.some((f) => new RegExp(`\\b${f.form}\\b`).test(text)))
  .map((c) => c.id);
const early = [
  ...books.flatMap((b) => {
    const first = order.get(corpus.chapters.find((c) => Number(c.id.slice(1, 3)) === b)!.id)!;
    const o = BOOK_ORIENTATION[b]!;
    return namedTooEarly(`${o.where} ${o.why}`, first).map((id) => `Book ${b}: ${id}`);
  }),
  ...Object.entries(CHAPTER_ORIENTATION).flatMap(([id, note]) =>
    namedTooEarly(note, order.get(id) ?? 0).map((who) => `${id}: ${who}`)),
];
check('no orientation names a person before the reader meets them', early.length === 0, early.join(', '));

console.log('\nextracted chapters');
// data/entities.json is model output. Its quotations are the field most likely
// to drift, so every one committed must be in its chapter word for word.
const entitiesPath = join(process.cwd(), 'data', 'entities.json');
if (existsSync(entitiesPath)) {
  const entities = JSON.parse(readFileSync(entitiesPath, 'utf8')) as {
    chapters: Record<string, { keyQuote: { text: string } | null }>;
  };
  const ids = Object.keys(entities.chapters);
  check('every extracted chapter is a real chapter', ids.every((id) => chapterIds.has(id)));
  const bad = ids.filter((id) => {
    const q = entities.chapters[id]!.keyQuote;
    return q && !isVerbatim(q.text, readFileSync(join(process.cwd(), 'data', 'chapters', `${id}.txt`), 'utf8'));
  });
  check(`every extracted quotation is verbatim (${ids.length} chapters)`, bad.length === 0, bad.join(', '));
}

console.log(failed === 0 ? '\nCurated data checks passed.' : `\n${failed} check(s) failed`);
process.exit(failed === 0 ? 0 : 1);
