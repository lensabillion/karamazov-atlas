/**
 * Build an alias-aware mention index and a co-occurrence network from the corpus.
 *
 * Deterministic: no LLM. Dostoyevsky names one person many ways — Dmitri is
 * "Mitya", "Mitka", and "Dmitri Fyodorovitch" — so a naive grep undercounts every
 * major character. Aliases are matched on word boundaries, longest first, and each
 * source position is claimed once so overlapping aliases can't double-count.
 *
 * Produces data/mentions.json: per-character totals, per-chapter counts, and
 * weighted co-occurrence edges (two characters sharing a chapter).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Corpus } from './parse-corpus.ts';

const ROOT = process.cwd();
const DATA = join(ROOT, 'data');

interface CharacterDef {
  id: string;
  name: string;
  /** Short label for graph nodes. */
  short: string;
  group: 'family' | 'women' | 'monastery' | 'boys' | 'court' | 'town';
  aliases: string[];
}

/**
 * Aliases are deliberately conservative: only forms that are unambiguous in this
 * novel. "the elder" (Zossima) and "the captain" (Snegiryov) are omitted because
 * they also refer to other people.
 */
const CHARACTERS: CharacterDef[] = [
  { id: 'fyodor', name: 'Fyodor Pavlovitch Karamazov', short: 'Fyodor', group: 'family',
    aliases: ['Fyodor Pavlovitch'] },
  { id: 'dmitri', name: 'Dmitri Fyodorovitch Karamazov', short: 'Dmitri', group: 'family',
    aliases: ['Dmitri Fyodorovitch', 'Dmitri', 'Mitya', 'Mitka'] },
  { id: 'ivan', name: 'Ivan Fyodorovitch Karamazov', short: 'Ivan', group: 'family',
    aliases: ['Ivan Fyodorovitch', 'Ivan'] },
  { id: 'alyosha', name: 'Alexey Fyodorovitch Karamazov', short: 'Alyosha', group: 'family',
    aliases: ['Alexey Fyodorovitch', 'Alyosha', 'Alyoshka'] },
  { id: 'smerdyakov', name: 'Pavel Smerdyakov', short: 'Smerdyakov', group: 'family',
    aliases: ['Smerdyakov'] },

  { id: 'grushenka', name: 'Agrafena Alexandrovna Svyetlov', short: 'Grushenka', group: 'women',
    aliases: ['Agrafena Alexandrovna', 'Grushenka', 'Grusha'] },
  { id: 'katerina', name: 'Katerina Ivanovna Verhovtsev', short: 'Katerina', group: 'women',
    aliases: ['Katerina Ivanovna', 'Katya'] },
  { id: 'hohlakov', name: 'Madame Hohlakov', short: 'Hohlakov', group: 'women',
    aliases: ['Madame Hohlakov', 'Hohlakov'] },
  { id: 'lise', name: 'Lise Hohlakov', short: 'Lise', group: 'women', aliases: ['Lise'] },

  { id: 'zossima', name: 'Father Zossima', short: 'Zossima', group: 'monastery',
    aliases: ['Father Zossima', 'Zossima'] },
  { id: 'ferapont', name: 'Father Ferapont', short: 'Ferapont', group: 'monastery',
    aliases: ['Father Ferapont', 'Ferapont'] },
  { id: 'paissy', name: 'Father Paissy', short: 'Paissy', group: 'monastery',
    aliases: ['Father Paissy', 'Paissy'] },
  { id: 'rakitin', name: 'Mihail Rakitin', short: 'Rakitin', group: 'monastery',
    aliases: ['Rakitin'] },

  { id: 'ilusha', name: 'Ilusha Snegiryov', short: 'Ilusha', group: 'boys',
    aliases: ['Ilusha', 'Ilushechka'] },
  { id: 'kolya', name: 'Kolya Krassotkin', short: 'Kolya', group: 'boys',
    aliases: ['Krassotkin', 'Kolya'] },
  { id: 'snegiryov', name: 'Captain Snegiryov', short: 'Snegiryov', group: 'boys',
    aliases: ['Snegiryov'] },
  { id: 'smurov', name: 'Smurov', short: 'Smurov', group: 'boys', aliases: ['Smurov'] },

  { id: 'grigory', name: 'Grigory Kutuzov', short: 'Grigory', group: 'town',
    aliases: ['Grigory'] },
  { id: 'marfa', name: 'Marfa Ignatyevna', short: 'Marfa', group: 'town',
    aliases: ['Marfa Ignatyevna', 'Marfa'] },
  { id: 'samsonov', name: 'Kuzma Samsonov', short: 'Samsonov', group: 'town',
    aliases: ['Kuzma Samsonov', 'Samsonov'] },
  { id: 'lizaveta', name: 'Lizaveta Smerdyastchaya', short: 'Lizaveta', group: 'town',
    aliases: ['Lizaveta Smerdyastchaya', 'Lizaveta'] },
  { id: 'maximov', name: 'Maximov', short: 'Maximov', group: 'town', aliases: ['Maximov'] },
  { id: 'perhotin', name: 'Pyotr Perhotin', short: 'Perhotin', group: 'town',
    aliases: ['Perhotin'] },

  { id: 'prosecutor', name: 'Ippolit Kirillovitch', short: 'Prosecutor', group: 'court',
    aliases: ['Ippolit Kirillovitch'] },
  { id: 'fetyukovitch', name: 'Fetyukovitch', short: 'Fetyukovitch', group: 'court',
    aliases: ['Fetyukovitch'] },
  { id: 'nikolay', name: 'Nikolay Parfenovitch', short: 'Nikolay P.', group: 'court',
    aliases: ['Nikolay Parfenovitch'] },
  { id: 'trifon', name: 'Trifon Borissovitch', short: 'Trifon B.', group: 'court',
    aliases: ['Trifon Borissovitch'] },
];

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Alias patterns, longest first, so "Dmitri Fyodorovitch" wins over "Dmitri". */
const PATTERNS = CHARACTERS.flatMap((c) =>
  c.aliases.map((a) => ({ id: c.id, alias: a, len: a.length })),
).sort((a, b) => b.len - a.len);

export interface MentionData {
  characters: (CharacterDef & { total: number; chapterCount: number })[];
  /** chapterId -> characterId -> count */
  byChapter: Record<string, Record<string, number>>;
  edges: { source: string; target: string; weight: number; chapters: string[] }[];
}

function main() {
  const corpus: Corpus = JSON.parse(readFileSync(join(DATA, 'corpus.json'), 'utf8'));

  const byChapter: Record<string, Record<string, number>> = {};
  const totals: Record<string, number> = {};
  const chapterCount: Record<string, number> = {};

  for (const ch of corpus.chapters) {
    const text = readFileSync(join(DATA, 'chapters', `${ch.id}.txt`), 'utf8');
    // Tracks which source positions are already claimed by a longer alias.
    const claimed = new Uint8Array(text.length);
    const counts: Record<string, number> = {};

    for (const { id, alias } of PATTERNS) {
      const re = new RegExp(`\\b${escape(alias)}\\b`, 'g');
      let m: RegExpExecArray | null;
      while ((m = re.exec(text)) !== null) {
        const from = m.index;
        const to = from + m[0].length;
        let taken = false;
        for (let i = from; i < to; i++) if (claimed[i]) { taken = true; break; }
        if (taken) continue;
        for (let i = from; i < to; i++) claimed[i] = 1;
        counts[id] = (counts[id] ?? 0) + 1;
      }
    }

    byChapter[ch.id] = counts;
    for (const [id, n] of Object.entries(counts)) {
      totals[id] = (totals[id] ?? 0) + n;
      chapterCount[id] = (chapterCount[id] ?? 0) + 1;
    }
  }

  // Co-occurrence: both characters meaningfully present in the same chapter.
  const PRESENT = 3;
  const edgeMap = new Map<string, { weight: number; chapters: string[] }>();

  for (const ch of corpus.chapters) {
    const present = Object.entries(byChapter[ch.id]!)
      .filter(([, n]) => n >= PRESENT)
      .map(([id]) => id)
      .sort();
    for (let i = 0; i < present.length; i++) {
      for (let j = i + 1; j < present.length; j++) {
        const key = `${present[i]}|${present[j]}`;
        const e = edgeMap.get(key) ?? { weight: 0, chapters: [] };
        e.weight += 1;
        e.chapters.push(ch.id);
        edgeMap.set(key, e);
      }
    }
  }

  const out: MentionData = {
    characters: CHARACTERS.map((c) => ({
      ...c,
      total: totals[c.id] ?? 0,
      chapterCount: chapterCount[c.id] ?? 0,
    })).sort((a, b) => b.total - a.total),
    byChapter,
    edges: [...edgeMap.entries()]
      .map(([key, v]) => {
        const [source, target] = key.split('|') as [string, string];
        return { source, target, weight: v.weight, chapters: v.chapters };
      })
      .sort((a, b) => b.weight - a.weight),
  };

  writeFileSync(join(DATA, 'mentions.json'), JSON.stringify(out, null, 2));

  console.log(`${out.characters.length} characters, ${out.edges.length} co-occurrence edges`);
  console.log('\ntop by mentions:');
  for (const c of out.characters.slice(0, 10)) {
    console.log(`  ${c.short.padEnd(13)} ${String(c.total).padStart(5)}  in ${c.chapterCount} chapters`);
  }
  console.log('\nstrongest ties:');
  for (const e of out.edges.slice(0, 8)) {
    console.log(`  ${e.source} — ${e.target}: ${e.weight} shared chapters`);
  }
}

main();
