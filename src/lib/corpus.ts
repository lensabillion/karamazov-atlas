/**
 * Server-side corpus access. Everything here reads committed data files —
 * no network, no API key. The app is fully usable without credentials.
 */
import 'server-only';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { PlaceChapter } from './reading-position';

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

/**
 * Cache parsed data, except in development.
 *
 * These files are rebuilt by `npm run corpus`. Caching for the life of the
 * process meant a running dev server kept serving the previous parse, so a
 * corrected dataset still rendered as wrong — which once nearly caused a
 * working fix to be undone. Production builds read each file once at build
 * time, where the cache is free and correct.
 */
const CACHE = process.env.NODE_ENV === 'production';

let _corpus: Corpus | null = null;
let _mentions: MentionData | null = null;

export function getCorpus(): Corpus {
  if (!CACHE) return read<Corpus>('corpus.json');
  return (_corpus ??= read<Corpus>('corpus.json'));
}

export function getMentions(): MentionData {
  if (!CACHE) return read<MentionData>('mentions.json');
  return (_mentions ??= read<MentionData>('mentions.json'));
}

export function getChapterText(id: string): string {
  return readFileSync(join(DATA, 'chapters', `${id}.txt`), 'utf8');
}

export function getChapter(id: string): Chapter | undefined {
  return getCorpus().chapters.find((c) => c.id === id);
}

/**
 * Every chapter's reading-order position, citation and title, in the compact
 * shape client components receive as props. Position is the spoiler axis: see
 * lib/reading-position.ts.
 */
export function chapterPlaces(): PlaceChapter[] {
  return getCorpus().chapters.map((c, i) => ({
    ordinal: i + 1,
    id: c.id,
    cite: c.cite,
    title: c.title,
    book: c.bookNum === 13 ? 'Epilogue' : `Book ${c.cite.split(',')[0]!.replace('Bk ', '')}. ${c.bookTitle}`,
  }));
}

/** 1-based reading-order position of a chapter id; throws on an unknown id. */
export function ordinalOf(id: string): number {
  const i = getCorpus().chapters.findIndex((c) => c.id === id);
  if (i === -1) throw new Error(`Unknown chapter id: ${id}`);
  return i + 1;
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
 * Words too common to say anything about which chapter a passage is in. Before
 * they were dropped, "the", "his" and "was" decided every ranking, and every
 * query returned the same five longest chapters (found by atlas-3mzp's first
 * live call, where the model had to guess the chapter itself).
 */
const STOPWORDS = new Set(
  (
    'the and that his her him she was with for not but you had have all they this what from are ' +
    'were been there their them one would said who when which will into out then now only like very ' +
    'did your yes how can could more even has its our why any some just over such too than about ' +
    'upon these those again also own same other does done don\'t i\'m it\'s that\'s he\'s she\'s ' +
    'you\'re i\'ll i\'ve can\'t won\'t didn\'t isn\'t wasn\'t there\'s let\'s here where after before ' +
    'while because though still ever never much many most well may might must shall should being ' +
    'himself herself itself myself yourself themselves ourselves whom whose each both few through ' +
    'under once off down came come went going know knew see saw say says tell told'
  ).split(' '),
);

const normalize = (s: string) => s.toLowerCase().replace(/[’‘]/g, "'");

/** Content words, lowercased, with curly apostrophes made straight. */
function tokens(s: string): string[] {
  return (normalize(s).match(/[a-z][a-z']*[a-z]/g) ?? []).filter(
    (w) => w.length >= 3 && !STOPWORDS.has(w),
  );
}

interface IndexedChapter {
  chapter: Chapter;
  /** Text with line wrapping collapsed, so phrases match across lines. */
  flat: string;
  lower: string;
  tf: Map<string, number>;
  length: number;
}

interface SearchIndex {
  chapters: IndexedChapter[];
  df: Map<string, number>;
  avgLength: number;
}

let _index: SearchIndex | null = null;

/**
 * Term statistics for every chapter, built once.
 *
 * Search used to read all 96 files and lowercase the whole novel on every
 * query. Built once per process in production; rebuilt per call in development
 * for the same stale-data reason as the loaders above.
 */
function searchIndex(): SearchIndex {
  const build = (): SearchIndex => {
    const df = new Map<string, number>();
    const chapters = getCorpus().chapters.map((chapter) => {
      const flat = getChapterText(chapter.id).replace(/\s+/g, ' ').trim();
      const tf = new Map<string, number>();
      const words = tokens(flat);
      for (const w of words) tf.set(w, (tf.get(w) ?? 0) + 1);
      for (const w of tf.keys()) df.set(w, (df.get(w) ?? 0) + 1);
      return { chapter, flat, lower: normalize(flat), tf, length: words.length };
    });
    const avgLength = chapters.reduce((n, c) => n + c.length, 0) / chapters.length;
    return { chapters, df, avgLength };
  };
  if (!CACHE) return build();
  return (_index ??= build());
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Ranked retrieval over chapter text: BM25 over content words, plus a strong
 * bonus when the query occurs as a phrase. Returns a window of context around
 * the phrase, or around the rarest query word the chapter contains, so the
 * caller can quote it with a real citation.
 *
 * `through` is the spoiler bound: a 1-based reading-order position, so only
 * chapters up to and including it are searched. Omit it to search the whole book.
 */
export function searchCorpus(query: string, limit = 6, through?: number) {
  const terms = [...new Set(tokens(query))];
  if (terms.length === 0) return [];
  const phrase = normalize(query).replace(/["“”]/g, '').replace(/\s+/g, ' ').trim();

  const { chapters, df, avgLength } = searchIndex();
  const N = chapters.length;
  const idf = (term: string) => {
    const n = df.get(term) ?? 0;
    return Math.log(1 + (N - n + 0.5) / (n + 0.5));
  };
  const K1 = 1.2;
  const B = 0.75;

  const scope = through === undefined ? chapters : chapters.slice(0, Math.max(0, through));

  const scored = scope.map(({ chapter, flat, lower, tf, length }) => {
    let score = 0;
    let rarest: string | null = null;
    for (const term of terms) {
      const f = tf.get(term) ?? 0;
      if (!f) continue;
      score += idf(term) * ((f * (K1 + 1)) / (f + K1 * (1 - B + (B * length) / avgLength)));
      if (rarest === null || idf(term) > idf(rarest)) rarest = term;
    }

    let at = -1;
    if (phrase.length > 8 && terms.length > 1) {
      at = lower.indexOf(phrase);
      // A verbatim phrase outranks any amount of scattered vocabulary.
      if (at !== -1) score += 10 + terms.reduce((n, t) => n + idf(t), 0);
    }
    if (at === -1 && rarest) {
      at = lower.search(new RegExp(`\\b${escapeRe(rarest)}\\b`));
    }

    const from = Math.max(0, at - 320);
    const excerpt = at === -1 ? '' : flat.slice(from, from + 900).trim();
    return { chapter, score, excerpt };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
