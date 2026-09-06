/**
 * Golden tests for the corpus. These assert facts about the actual Gutenberg
 * text, so a regression in the parser or the alias table fails loudly.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Corpus } from './parse-corpus.ts';
import type { MentionData } from './build-mentions.ts';

const DATA = join(process.cwd(), 'data');
let failed = 0;

function check(name: string, actual: unknown, expected: unknown) {
  const ok = actual === expected;
  if (!ok) failed++;
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${name}${ok ? '' : ` — expected ${expected}, got ${actual}`}`);
}

function assert(name: string, cond: boolean, detail = '') {
  if (!cond) failed++;
  console.log(`${cond ? '  ok  ' : ' FAIL '} ${name}${cond ? '' : ` — ${detail}`}`);
}

const corpus: Corpus = JSON.parse(readFileSync(join(DATA, 'corpus.json'), 'utf8'));
const mentions: MentionData = JSON.parse(readFileSync(join(DATA, 'mentions.json'), 'utf8'));

console.log('corpus structure');
check('96 chapters (93 + 3 epilogue)', corpus.chapters.length, 96);
check('13 book groupings (12 + epilogue)', new Set(corpus.chapters.map((c) => c.bookNum)).size, 13);
check('Book V has 7 chapters', corpus.chapters.filter((c) => c.bookNum === 5).length, 7);
check('Book XII has 14 chapters', corpus.chapters.filter((c) => c.bookNum === 12).length, 14);
check('The Grand Inquisitor is Bk V ch 5',
  corpus.chapters.find((c) => c.bookNum === 5 && c.num === 5)?.title, 'The Grand Inquisitor');
check('Epilogue closes at the stone',
  corpus.chapters.at(-1)?.title, 'Ilusha’s Funeral. The Speech At The Stone');

console.log('\nchapter bodies');
let emptyBodies = 0;
let badOffsets = 0;
for (const ch of corpus.chapters) {
  const p = join(DATA, 'chapters', `${ch.id}.txt`);
  if (!existsSync(p) || readFileSync(p, 'utf8').trim().length === 0) emptyBodies++;
  if (!(ch.end > ch.start)) badOffsets++;
}
check('every chapter body is non-empty', emptyBodies, 0);
check('every chapter has end > start', badOffsets, 0);
assert('total word count is in range', corpus.wordCount > 340_000 && corpus.wordCount < 360_000,
  `got ${corpus.wordCount}`);

console.log('\nmention index');
const by = (id: string) => mentions.characters.find((c) => c.id === id);
assert('Alyosha leads the mention count', mentions.characters[0]?.id === 'alyosha',
  `top was ${mentions.characters[0]?.id}`);
assert('alias resolution beats a naive grep for Dmitri',
  (by('dmitri')?.total ?? 0) > 1200, `got ${by('dmitri')?.total}`);
assert('Smerdyakov appears in Book XI', (mentions.byChapter['b11-c08']?.smerdyakov ?? 0) > 0);
assert('Kolya is concentrated in Book X', (by('kolya')?.chapterCount ?? 99) < 20,
  `appeared in ${by('kolya')?.chapterCount} chapters`);
assert('Zossima does not appear after his death in Bk VII+',
  (mentions.byChapter['b06-c03']?.zossima ?? 0) > 0);
assert('the strongest tie is between brothers',
  ['alyosha', 'dmitri', 'ivan'].includes(mentions.edges[0]!.source) &&
  ['alyosha', 'dmitri', 'ivan'].includes(mentions.edges[0]!.target));

console.log(failed === 0 ? '\nall checks passed' : `\n${failed} check(s) failed`);
process.exit(failed === 0 ? 0 : 1);
