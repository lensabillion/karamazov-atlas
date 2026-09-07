/**
 * Alias-resolved mention index and co-occurrence network.
 *
 * Counting is delegated to scripts/lib/match.ts, which every derived dataset
 * shares. That is deliberate: this builder and build-names previously counted
 * independently and disagreed with each other by hundreds of occurrences
 * (review finding R3). Now both consume the same claimed spans, so their totals
 * cannot drift apart.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CHARACTERS, type CharacterDef } from './lib/characters.ts';
import { countByOwner, findOccurrences, type AliasSpec } from './lib/match.ts';
import type { Corpus } from './parse-corpus.ts';

const DATA = join(process.cwd(), 'data');

export interface MentionData {
  characters: (CharacterDef & { total: number; chapterCount: number })[];
  byChapter: Record<string, Record<string, number>>;
  edges: { source: string; target: string; weight: number; chapters: string[] }[];
}

const ALIASES: AliasSpec[] = CHARACTERS.flatMap((c) =>
  c.aliases.map((form) => ({ owner: c.id, form })),
);

function main() {
  const corpus: Corpus = JSON.parse(readFileSync(join(DATA, 'corpus.json'), 'utf8'));

  const byChapter: Record<string, Record<string, number>> = {};
  const totals: Record<string, number> = {};
  const chapterCount: Record<string, number> = {};

  for (const ch of corpus.chapters) {
    const text = readFileSync(join(DATA, 'chapters', `${ch.id}.txt`), 'utf8');
    const counts = countByOwner(findOccurrences(text, ALIASES));
    byChapter[ch.id] = counts;
    for (const [id, n] of Object.entries(counts)) {
      totals[id] = (totals[id] ?? 0) + n;
      chapterCount[id] = (chapterCount[id] ?? 0) + 1;
    }
  }

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

  // Every declared form must occur; a form matching nothing is a data bug.
  const missing = out.characters.filter((c) => c.total === 0).map((c) => c.short);
  if (missing.length) {
    throw new Error(`characters with no occurrences: ${missing.join(', ')}`);
  }

  writeFileSync(join(DATA, 'mentions.json'), JSON.stringify(out, null, 2));
  console.log(`mentions: ${out.characters.length} characters, ${out.edges.length} edges`);
  for (const c of out.characters.slice(0, 6)) {
    console.log(`  ${c.short.padEnd(12)} ${String(c.total).padStart(5)}  in ${c.chapterCount} chapters`);
  }
}

main();
