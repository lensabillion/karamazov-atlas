/**
 * Name morphology, patronymic lineage and speech attribution (atlas-30o1,
 * atlas-w56r).
 *
 * The morphology is rule-based and the attribution is regex over dialogue —
 * exactly the kind of code that rots quietly. Its escaping once broke and
 * matched nothing while reporting success, and writing these tests found three
 * more faults: Fetyukovitch (a surname) read as "child of Fetyuk", the byname
 * "Lizaveta Smerdyastchaya" classed as a familiar diminutive, and every
 * two-word name wrapped across a line break missed or miscounted.
 *
 * Two halves: fixtures that pin each attribution rule on text written to
 * exercise it, and golden facts about the real data.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { attribute, flattenLines, namesIn, relationOf } from './lib/attribution.ts';
import { findOccurrences, formPattern } from './lib/match.ts';
import type { NamesData } from './build-names.ts';

let failed = 0;
const check = (name: string, cond: boolean, detail = '') => {
  if (!cond) failed++;
  console.log(`${cond ? '  ok  ' : ' FAIL '} ${name}${cond ? '' : ` — ${detail}`}`);
};

const ALIASES = [
  { form: 'Dmitri Fyodorovitch', id: 'dmitri' },
  { form: 'Grigory', id: 'grigory' },
  { form: 'Grushenka', id: 'grushenka' },
  { form: 'Rakitin', id: 'rakitin' },
  { form: 'Alyosha', id: 'alyosha' },
  { form: 'Dmitri', id: 'dmitri' },
  { form: 'Mitya', id: 'dmitri' },
  { form: 'Ivan', id: 'ivan' },
].sort((a, b) => b.form.length - a.form.length);

console.log('direct address and mention');
const rel = (speech: string, form: string) => relationOf(speech, speech.indexOf(form), form);
check('a name opening the speech is address', rel('Alyosha, listen to me.', 'Alyosha') === 'address');
check('a name set off by commas is address', rel('Listen, Alyosha, I beg you.', 'Alyosha') === 'address');
check('an endearment may precede it', rel('What is it, my dear Alyosha?', 'Alyosha') === 'address');
check('a title may precede it', rel('Stay, brother Ivan, stay!', 'Ivan') === 'address');
check('an unlisted patronymic may follow it', rel('wait a little, Grigory Vassilyevitch, wait.', 'Grigory') === 'address');
check('a name in the sentence is mention', rel('I told Alyosha everything.', 'Alyosha') === 'mention');
check('a name before a dash is still mention mid-sentence', rel('that woman. Dmitri—despises her', 'Dmitri') === 'mention');
check('a name as an object is mention', rel('Let’s go to Grushenka.', 'Grushenka') === 'mention');

console.log('\nspeakers');
// R2's case: a long speech, then someone else's short reply, then the tag.
const adjacent = '“That Grushenka is a relation of mine, you know it!” “Thank her and say I’m not coming,” said Alyosha.';
const u1 = attribute(adjacent, ALIASES);
check('a tag belongs to the nearest quotation only (the II.7 case)',
  u1.length === 1 && u1[0]!.speaker === 'alyosha' && u1[0]!.names.length === 0,
  JSON.stringify(u1));
const split = '“You must go to Grushenka at once.”\n\nThat evening, said Rakitin, the snow began.';
check('a tag never reaches across a paragraph break', attribute(split, ALIASES).length === 0);
const self = '“I, Dmitri Fyodorovitch, swear it before you,” said Mitya.';
const u3 = attribute(self, ALIASES);
check('a speaker naming himself is neither address nor mention',
  u3.length === 1 && u3[0]!.speaker === 'dmitri' && u3[0]!.names.length === 0, JSON.stringify(u3));
const both = '“Mitya, Rakitin says Grushenka is coming,” Alyosha began.';
const u4 = attribute(both, ALIASES)[0]!;
check('one speech can hold both address and mention',
  u4.names.map((n) => `${n.target}:${n.relation}`).join(' ') === 'dmitri:address rakitin:mention grushenka:mention',
  JSON.stringify(u4.names));
check('the offset points at the opening quotation mark', both[u4.at] === '“' && u4.length === both.indexOf('”') + 1);

console.log('\nline wrapping');
const wrapped = 'He said to Dmitri\nFyodorovitch that it was late.';
const occ = findOccurrences(wrapped, ALIASES.map((a) => ({ owner: a.id, form: a.form })));
check('a two-word name wrapped across lines is one occurrence of the long form',
  occ.length === 1 && occ[0]!.form === 'Dmitri Fyodorovitch', JSON.stringify(occ));
check('flattening lines keeps every offset', flattenLines('a\nb\n\nc').length === 'a\nb\n\nc'.length
  && flattenLines('a\nb\n\nc') === 'a b\n\nc');
check('names inside a wrapped speech are found', namesIn('go to\nGrushenka now', 'alyosha', ALIASES).length === 1);
check('a form pattern allows any whitespace between words', new RegExp(formPattern('Pyotr Ilyitch')).test('Pyotr\n Ilyitch'));

console.log('\nthe real data');
const names = JSON.parse(readFileSync(join(process.cwd(), 'data', 'names.json'), 'utf8')) as NamesData;
const who = (id: string) => names.characters.find((c) => c.id === id)!;
const form = (id: string, f: string) => who(id).forms.find((x) => x.form === f);

const fyodorovitch = names.lineages.find((l) => l.patronymic === 'Fyodorovitch');
check('Fyodorovitch resolves to exactly four children',
  fyodorovitch?.children.slice().sort().join(',') === 'alyosha,dmitri,ivan,smerdyakov',
  fyodorovitch?.children.join(','));
check('Pavel Fyodorovitch occurs exactly once', form('smerdyakov', 'Pavel Fyodorovitch')?.count === 1);
check('Fyodor’s own father is recovered through the irregular stem', who('fyodor').fatherName === 'Pavel');
check('Grushenka’s father is Alexander, not Alexandr', who('grushenka').fatherName === 'Alexander');
check('an -itch patronymic is read: Pyotr Ilyitch, child of Ilya', who('perhotin').fatherName === 'Ilya');
check('a surname ending -ovitch is not a patronymic (Fetyukovitch)',
  who('fetyukovitch').patronymic === null && who('fetyukovitch').fatherName === null);
check('the byname Lizaveta Smerdyastchaya is distanced, not familiar',
  form('lizaveta', 'Lizaveta Smerdyastchaya')?.register === 'distanced');
check('every declared form occurs in the text',
  names.characters.every((c) => c.forms.every((f) => f.count > 0)),
  names.characters.flatMap((c) => c.forms.filter((f) => !f.count).map((f) => f.form)).join(', '));

const registers: [string, string, string][] = [
  ['dmitri', 'Dmitri Fyodorovitch', 'formal'], ['dmitri', 'Mitya', 'familiar'],
  ['dmitri', 'Mityenka', 'tender'], ['dmitri', 'Dmitri', 'neutral'],
  ['alyosha', 'Alyosha', 'familiar'], ['alyosha', 'Alexey', 'neutral'],
  ['smerdyakov', 'Smerdyakov', 'distanced'], ['grushenka', 'Grushenka', 'tender'],
];
const unstable = registers.filter(([id, f, r]) => form(id, f)?.register !== r).map(([, f, r]) => `${f}≠${r}`);
check('register classification is stable for a fixed sample', unstable.length === 0, unstable.join(', '));

console.log('\nattributed speech');
const { coverage, addresses, spokenOf, speech } = names;
const sum = (xs: { count: number }[]) => xs.reduce((n, x) => n + x.count, 0);
check('addressed and mentioned totals reconcile with the records',
  sum(addresses) === coverage.addressed && sum(spokenOf) === coverage.mentioned
    && speech.flatMap((s) => s.names).length === coverage.addressed + coverage.mentioned);
check('coverage is stated, and partial', coverage.attributed > 0 && coverage.attributed < coverage.quotes / 4);
const chapterText = new Map<string, string>();
const textOf = (id: string) => chapterText.get(id)
  ?? chapterText.set(id, readFileSync(join(process.cwd(), 'data', 'chapters', `${id}.txt`), 'utf8')).get(id)!;
const misplaced = speech.filter((s) => !/[“"]/.test(textOf(s.chapter)[s.at]!)).length;
check('every speech record points at an opening quotation mark in its chapter', misplaced === 0, `${misplaced} off`);
const ii7 = speech.filter((s) => s.chapter === 'b02-c07' && s.speaker === 'alyosha'
  && s.names.some((n) => n.target === 'grushenka'));
check('R2 regression: Rakitin’s II.7 speech about Grushenka is no longer Alyosha’s', ii7.length === 0);
check('Alyosha calls Dmitri “Mitya” to his face',
  addresses.some((a) => a.speaker === 'alyosha' && a.target === 'dmitri' && a.form === 'Mitya'));

console.log(failed === 0 ? '\nName checks passed.' : `\n${failed} check(s) failed`);
process.exit(failed === 0 ? 0 : 1);
