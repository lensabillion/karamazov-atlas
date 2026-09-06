/**
 * Server-side corpus access. Everything here reads committed data files —
 * no network, no API key. The app is fully usable without credentials.
 */
import 'server-only';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface Chapter {
  id: string;
  part: string;
  partNum: number;
  bookNum: number;
  bookTitle: string;
  num: number;
  roman: string;
  title: string;
  cite: string;
  start: number;
  end: number;
  wordCount: number;
}

export interface Corpus {
  title: string;
  author: string;
  translator: string;
  source: string;
  wordCount: number;
  chapters: Chapter[];
}

export interface Character {
  id: string;
  name: string;
  short: string;
  group: 'family' | 'women' | 'monastery' | 'boys' | 'court' | 'town';
  aliases: string[];
  total: number;
  chapterCount: number;
}

export interface MentionData {
  characters: Character[];
  byChapter: Record<string, Record<string, number>>;
  edges: { source: string; target: string; weight: number; chapters: string[] }[];
}

const DATA = join(process.cwd(), 'data');
const read = <T>(f: string): T => JSON.parse(readFileSync(join(DATA, f), 'utf8')) as T;

let _corpus: Corpus | null = null;
let _mentions: MentionData | null = null;

export function getCorpus(): Corpus {
  return (_corpus ??= read<Corpus>('corpus.json'));
}

export function getMentions(): MentionData {
  return (_mentions ??= read<MentionData>('mentions.json'));
}

export function getChapterText(id: string): string {
  return readFileSync(join(DATA, 'chapters', `${id}.txt`), 'utf8');
}

export function getChapter(id: string): Chapter | undefined {
  return getCorpus().chapters.find((c) => c.id === id);
}

/** Chapters grouped by book, in reading order. */
export function getBooks() {
  const corpus = getCorpus();
  const books = new Map<number, { num: number; title: string; part: string; chapters: Chapter[] }>();
  for (const ch of corpus.chapters) {
    if (!books.has(ch.bookNum)) {
      books.set(ch.bookNum, { num: ch.bookNum, title: ch.bookTitle, part: ch.part, chapters: [] });
    }
    books.get(ch.bookNum)!.chapters.push(ch);
  }
  return [...books.values()].sort((a, b) => a.num - b.num);
}

export function getCharacter(id: string): Character | undefined {
  return getMentions().characters.find((c) => c.id === id);
}

/** Per-chapter presence for one character, in reading order. */
export function presenceOf(characterId: string): { chapter: Chapter; count: number }[] {
  const { byChapter } = getMentions();
  return getCorpus().chapters.map((chapter) => ({
    chapter,
    count: byChapter[chapter.id]?.[characterId] ?? 0,
  }));
}

/**
 * Lexical retrieval over chapter text. Scores by term frequency with a bonus for
 * whole-phrase hits, and returns a window of context around the best match so the
 * caller can quote it with a real citation.
 */
export function searchCorpus(query: string, limit = 6) {
  const terms = query.toLowerCase().match(/[a-z’']{3,}/g) ?? [];
  if (terms.length === 0) return [];
  const phrase = query.toLowerCase().trim();

  const scored = getCorpus().chapters.map((chapter) => {
    const text = getChapterText(chapter.id);
    const lower = text.toLowerCase();

    let score = 0;
    let best = -1;
    for (const term of terms) {
      let idx = lower.indexOf(term);
      while (idx !== -1) {
        score += 1;
        if (best === -1) best = idx;
        idx = lower.indexOf(term, idx + term.length);
      }
    }
    const phraseAt = lower.indexOf(phrase);
    if (phrase.length > 8 && phraseAt !== -1) {
      score += 25;
      best = phraseAt;
    }
    // Normalize so long chapters don't dominate purely by length.
    const normalized = score / Math.log2(chapter.wordCount + 2);

    const from = Math.max(0, best - 320);
    const excerpt = best === -1 ? '' : text.slice(from, from + 900).trim();

    return { chapter, score: normalized, raw: score, excerpt };
  });

  return scored
    .filter((s) => s.raw > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
