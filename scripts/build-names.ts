/**
 * Build the Name Key: decompose every name form in the novel and classify it.
 *
 * Russian naming is not decoration. The form of a name encodes the relationship
 * between speaker and subject, and the formality of the moment. English readers
 * lose all of it — which is the single most cited barrier to this novel.
 *
 * Three things are computed here, all from the text:
 *
 *   1. MORPHOLOGY — each form is decomposed and classified by its suffix into a
 *      register, from formal (given name + patronymic) to tender (-enka).
 *   2. PATRONYMIC LINEAGE — a patronymic literally names the father. Grouping
 *      characters by patronymic reconstructs the family tree from the names
 *      alone, and surfaces what the novel states only once: Smerdyakov is given
 *      the patronymic Fyodorovitch — son of Fyodor — exactly one time.
 *   3. OCCURRENCE — where each form appears, and where it first appears.
 *
 * Output: data/names.json. Deterministic, no LLM.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CHARACTERS } from './lib/characters.ts';
import { countByForm, escapeRe, findOccurrences, type AliasSpec } from './lib/match.ts';
import type { Corpus } from './parse-corpus.ts';

const DATA = join(process.cwd(), 'data');

export type Register = 'formal' | 'neutral' | 'familiar' | 'tender' | 'distanced';

export interface NameForm {
  form: string;
  kind: 'patronymic-pair' | 'given' | 'diminutive' | 'surname';
  register: Register;
  /** Plain-English explanation of why this form reads the way it does. */
  gloss: string;
  count: number;
  chapters: string[];
  firstChapter: string | null;
}

export interface NamedCharacter {
  id: string;
  name: string;
  short: string;
  group: string;
  /** Patronymic carried by this character, if the text ever gives them one. */
  patronymic: string | null;
  /** The given name that pairs with it — Pavel, not Smerdyakov. */
  givenName: string | null;
  /** The father's given name, recovered from that patronymic. */
  fatherName: string | null;
  forms: NameForm[];
  total: number;
  /** Per chapter, how many namings fell in each register. Drives the ribbon. */
  registerByChapter: Record<string, Partial<Record<Register, number>>>;
  /** The warmest register anyone in the novel ever uses for this person. */
  warmestRegister: Register;
}

/** One observed act of address: who called whom what, and how often. */
export interface Address {
  speaker: string;
  target: string;
  form: string;
  register: Register;
  count: number;
}

export interface NamesData {
  characters: NamedCharacter[];
  /** Observed in attributed dialogue only — see `coverage`. */
  addresses: Address[];
  coverage: { quotes: number; attributed: number };
  /** patronymic → everyone who carries it. Reconstructs paternity from names. */
  lineages: { patronymic: string; father: string; children: string[] }[];
  registers: { key: Register; label: string; description: string }[];
}

/**
 * Russian patronymics are formed from the father's given name plus a suffix.
 * Stripping the suffix recovers the father — except where the stem drops a
 * vowel, which a small table of irregulars restores.
 */
const IRREGULAR_STEMS: Record<string, string> = {
  Pavl: 'Pavel',
  Alexandr: 'Alexander',
  Boriss: 'Boris',
  Ignaty: 'Ignat',
  Kondraty: 'Kondrat',
  Parfeny: 'Parfeny',
  Mavrikye: 'Mavriky',
  Vassilye: 'Vassily',
};

function fatherFromPatronymic(patronymic: string): string {
  const stem = patronymic.replace(/(ovitch|evitch|ovna|evna)$/, '');
  return IRREGULAR_STEMS[stem] ?? stem;
}

const isPatronymic = (w: string) => /(ovitch|evitch|ovna|evna)$/.test(w);

/** Classify a name form by its morphology. Order matters: longest suffix wins. */
function classify(form: string, surnames: Set<string>): Omit<NameForm, 'count' | 'chapters' | 'firstChapter'> {
  const words = form.split(' ');

  if (words.length > 1 && isPatronymic(words[words.length - 1]!)) {
    const pat = words[words.length - 1]!;
    const father = fatherFromPatronymic(pat);
    return {
      form,
      kind: 'patronymic-pair',
      register: 'formal',
      gloss: `Given name plus patronymic — the respectful address. “${pat}” means son or daughter of ${father}, so the name states the parentage every time it is spoken.`,
    };
  }

  if (surnames.has(form)) {
    return {
      form,
      kind: 'surname',
      register: 'distanced',
      gloss: 'Surname alone — how the town, the court and the narrator refer to someone they are placing at a distance.',
    };
  }

  if (/(enka|echka|ushka|yenka)$/.test(form)) {
    return {
      form,
      kind: 'diminutive',
      register: 'tender',
      gloss: 'The affectionate diminutive. Reserved for tenderness, pity, or coaxing — never neutral.',
    };
  }

  if (/(sha|tya|nya|usha|ya)$/.test(form)) {
    return {
      form,
      kind: 'diminutive',
      register: 'familiar',
      gloss: 'The everyday short form, used by family and close friends. Warm, but ordinary.',
    };
  }

  return {
    form,
    kind: 'given',
    register: 'neutral',
    gloss: 'The plain given name — more formal than a diminutive, less formal than name plus patronymic.',
  };
}

/** Ordered coldest to warmest. Position on this ladder is the whole point. */
export const REGISTER_LADDER: Register[] = ['formal', 'distanced', 'neutral', 'familiar', 'tender'];

/**
 * Who calls whom what.
 *
 * Garnett attributes speech as `"…," said Alyosha.` or `"…" Ivan answered.`
 * Matching those gives a speaker for a minority of quoted passages; within each,
 * any other character's name is an observed act of address. Coverage is partial
 * by construction and is reported alongside the result, never hidden.
 */
function buildAddresses(
  chapterText: Map<string, string>,
  aliasIndex: { form: string; id: string; register: Register }[],
): { addresses: Address[]; coverage: { quotes: number; attributed: number } } {
  const VERBS =
    'said|cried|answered|asked|shouted|murmured|added|replied|exclaimed|observed|whispered|repeated|began|interrupted';
  const speakerPat = aliasIndex.map((a) => escape(a.form)).join('|');
  const patterns = [
    new RegExp(`[“"]([^”"]{8,900})[”"][^.!?\\n]{0,40}?\\b(?:${VERBS})\\s+(${speakerPat})\\b`, 'g'),
    new RegExp(`[“"]([^”"]{8,900})[”"][^.!?\\n]{0,40}?\\b(${speakerPat})\\s+(?:${VERBS})\\b`, 'g'),
  ];

  const tally = new Map<string, number>();
  let quotes = 0;
  let attributed = 0;

  for (const raw of chapterText.values()) {
    const text = raw.replace(/\n/g, ' ');
    quotes += (text.match(/[“"][^”"]{8,900}[”"]/g) ?? []).length;
    for (const re of patterns) {
      re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(text)) !== null) {
        const speech = m[1]!;
        const speaker = aliasIndex.find((a) => a.form === m![2])?.id;
        if (!speaker) continue;
        attributed++;
        const claimed: string[] = [];
        for (const a of aliasIndex) {
          if (a.id === speaker) continue;
          if (!new RegExp(`\\b${escape(a.form)}\\b`).test(speech)) continue;
          // A longer form already claimed this text; don't double-count the stem.
          if (claimed.some((f) => f.includes(a.form))) continue;
          claimed.push(a.form);
          const key = `${speaker}|${a.id}|${a.form}|${a.register}`;
          tally.set(key, (tally.get(key) ?? 0) + 1);
        }
      }
    }
  }

  const addresses: Address[] = [...tally.entries()]
    .map(([key, count]) => {
      const [speaker, target, form, register] = key.split('|') as [string, string, string, Register];
      return { speaker, target, form, register, count };
    })
    .sort((a, b) => b.count - a.count);

  return { addresses, coverage: { quotes, attributed } };
}

const REGISTERS: NamesData['registers'] = [
  { key: 'formal', label: 'Formal', description: 'Name plus patronymic. Respect, distance, or an official occasion.' },
  { key: 'distanced', label: 'Distanced', description: 'Surname alone. The public, third-person register.' },
  { key: 'neutral', label: 'Neutral', description: 'The plain given name.' },
  { key: 'familiar', label: 'Familiar', description: 'The everyday short form, among family and friends.' },
  { key: 'tender', label: 'Tender', description: 'The affectionate diminutive. Never used casually.' },
];

const escape = escapeRe;

function main() {
  const corpus: Corpus = JSON.parse(readFileSync(join(DATA, 'corpus.json'), 'utf8'));
  const chapterText = new Map(
    corpus.chapters.map((c) => [c.id, readFileSync(join(DATA, 'chapters', `${c.id}.txt`), 'utf8')]),
  );

  // One pass over the text with the shared matcher; every dataset below reads
  // from these claimed spans so no occurrence is counted twice.
  const allAliases: AliasSpec[] = CHARACTERS.flatMap((c) =>
    c.aliases.map((form) => ({ owner: c.id, form })),
  );
  const formCounts = new Map<string, Record<string, number>>();
  for (const ch of corpus.chapters) {
    formCounts.set(ch.id, countByForm(findOccurrences(chapterText.get(ch.id)!, allAliases)));
  }

  // Surnames are the last word of each character's full name.
  const surnames = new Set(CHARACTERS.map((c) => c.name.split(' ').pop()!));

  const characters: NamedCharacter[] = CHARACTERS.map((c) => {
    let patronymic: string | null = null;
    for (const alias of c.aliases) {
      const last = alias.split(' ').pop()!;
      if (isPatronymic(last)) { patronymic = last; break; }
    }
    // Fall back to the canonical full name, which may carry one the aliases don't.
    if (!patronymic) {
      for (const w of c.name.split(' ')) if (isPatronymic(w)) { patronymic = w; break; }
    }

    const forms: NameForm[] = c.aliases.map((alias) => {
      const base = classify(alias, surnames);
      // Counts come from the shared span matcher, so a full name is never
      // counted again as its short form (review finding R3).
      let count = 0;
      const chapters: string[] = [];
      for (const ch of corpus.chapters) {
        const n = formCounts.get(ch.id)?.[alias] ?? 0;
        if (n > 0) { count += n; chapters.push(ch.id); }
      }
      return { ...base, count, chapters, firstChapter: chapters[0] ?? null };
    });

    // The given name is whatever precedes the patronymic in the formal form.
    const formalForm = c.aliases.find((a) => {
      const parts = a.split(' ');
      return parts.length > 1 && isPatronymic(parts[parts.length - 1]!);
    });
    const givenName = formalForm ? formalForm.split(' ').slice(0, -1).join(' ') : null;

    // Register mix per chapter, from the same claimed spans as the totals.
    const registerByChapter: Record<string, Partial<Record<Register, number>>> = {};
    for (const f of forms) {
      for (const chId of f.chapters) {
        const n = formCounts.get(chId)?.[f.form] ?? 0;
        if (!n) continue;
        registerByChapter[chId] ??= {};
        registerByChapter[chId]![f.register] = (registerByChapter[chId]![f.register] ?? 0) + n;
      }
    }

    return {
      id: c.id,
      name: c.name,
      short: c.short,
      group: c.group,
      patronymic,
      givenName,
      registerByChapter,
      fatherName: patronymic ? fatherFromPatronymic(patronymic) : null,
      warmestRegister: REGISTER_LADDER[
        Math.max(...forms.map((f) => REGISTER_LADDER.indexOf(f.register)))
      ]!,
      forms: forms.sort((a, b) => b.count - a.count),
      total: forms.reduce((n, f) => n + f.count, 0),
    };
  });

  // Group by patronymic: everyone sharing one shares a father.
  const byPatronymic = new Map<string, string[]>();
  for (const c of characters) {
    if (!c.patronymic) continue;
    if (!byPatronymic.has(c.patronymic)) byPatronymic.set(c.patronymic, []);
    byPatronymic.get(c.patronymic)!.push(c.id);
  }
  const lineages = [...byPatronymic.entries()]
    .filter(([, kids]) => kids.length > 1)
    .map(([patronymic, children]) => ({
      patronymic,
      father: fatherFromPatronymic(patronymic),
      children,
    }));

  const aliasIndex = characters
    .flatMap((c) => c.forms.map((f) => ({ form: f.form, id: c.id, register: f.register })))
    .sort((a, b) => b.form.length - a.form.length);
  const { addresses, coverage } = buildAddresses(chapterText, aliasIndex);

  // R3: the two datasets must agree by construction. Assert it, so they cannot
  // silently drift apart again.
  const mentions = JSON.parse(readFileSync(join(DATA, 'mentions.json'), 'utf8')) as {
    characters: { id: string; short: string; total: number }[];
  };
  const drift = mentions.characters
    .map((m) => ({ short: m.short, mentions: m.total, names: characters.find((c) => c.id === m.id)?.total ?? 0 }))
    .filter((d) => d.mentions !== d.names);
  if (drift.length) {
    throw new Error(
      'name totals disagree with mention totals: ' +
        drift.map((d) => `${d.short} ${d.names} vs ${d.mentions}`).join(', '),
    );
  }

  // Register sums must also reconcile with each form's total.
  for (const c of characters) {
    const viaRegisters = Object.values(c.registerByChapter).reduce(
      (n, per) => n + Object.values(per).reduce((a, b) => a + (b ?? 0), 0), 0,
    );
    if (viaRegisters !== c.total) {
      throw new Error(`${c.short}: register sum ${viaRegisters} != total ${c.total}`);
    }
  }

  const out: NamesData = { characters, addresses, coverage, lineages, registers: REGISTERS };
  writeFileSync(join(DATA, 'names.json'), JSON.stringify(out, null, 2));

  console.log(`${characters.length} characters, ${characters.reduce((n, c) => n + c.forms.length, 0)} name forms`);
  console.log(
    `${addresses.length} observed acts of address, from ${coverage.attributed} of ${coverage.quotes} quoted passages`,
  );
  const zero = characters.flatMap((c) => c.forms.filter((f) => f.count === 0).map((f) => f.form));
  console.log(zero.length ? `forms with no occurrences: ${zero.join(', ')}` : 'every form occurs in the text');
  console.log('\nlineages recovered from patronymics alone:');
  for (const l of lineages) {
    const names = l.children.map((id) => characters.find((c) => c.id === id)!.short).join(', ');
    console.log(`  ${l.patronymic} → children of ${l.father}: ${names}`);
  }
}

main();
