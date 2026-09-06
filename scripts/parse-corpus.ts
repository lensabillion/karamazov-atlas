/**
 * Parse the Gutenberg text of The Brothers Karamazov into a typed corpus.
 *
 * Deterministic: no LLM, no network. Produces
 *   data/corpus.json        structure + offsets into the source text
 *   data/chapters/<id>.txt  one file per chapter, read server-side at runtime
 *
 * Every chapter records `start`/`end` character offsets into the normalized
 * source so any claim made elsewhere in the app can be traced back to the text.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const SOURCE = join(ROOT, 'karamazov.txt');
const OUT_DIR = join(ROOT, 'data');
const CH_DIR = join(OUT_DIR, 'chapters');

const START = '*** START OF THE PROJECT GUTENBERG EBOOK';
const END = '*** END OF THE PROJECT GUTENBERG EBOOK';

const ROMAN: Record<string, number> = {
  I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000,
};

function fromRoman(s: string): number {
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = ROMAN[s[i]!]!;
    const next = ROMAN[s[i + 1]!];
    total += next && next > cur ? -cur : cur;
  }
  return total;
}

export interface Chapter {
  /** Stable slug, e.g. "b05-c05" for Book V chapter 5. */
  id: string;
  part: string;
  partNum: number;
  bookNum: number;
  bookTitle: string;
  num: number;
  roman: string;
  title: string;
  /** Human citation, e.g. "Bk V, ch. 5". */
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

function main() {
  const raw = readFileSync(SOURCE, 'utf8').replace(/\r\n/g, '\n');

  const startIdx = raw.indexOf(START);
  const endIdx = raw.indexOf(END);
  if (startIdx === -1 || endIdx === -1) {
    throw new Error('Could not find Gutenberg start/end markers in karamazov.txt');
  }
  // Skip past the marker's own line.
  const bodyStart = raw.indexOf('\n', startIdx) + 1;
  const text = raw.slice(bodyStart, endIdx);

  const lines = text.split('\n');

  // Offset of the first character of each line within `text`.
  const lineOffset: number[] = new Array(lines.length);
  let acc = 0;
  for (let i = 0; i < lines.length; i++) {
    lineOffset[i] = acc;
    acc += lines[i]!.length + 1;
  }

  const PART_RE = /^PART ([IVX]+)$/;
  const BOOK_RE = /^Book ([IVX]+)\.\s*(.+?)\s*$/;
  const CHAP_RE = /^Chapter ([IVXL]+)\.$/;
  const EPILOGUE_RE = /^EPILOGUE$/;

  let part = '';
  let partNum = 0;
  let bookNum = 0;
  let bookTitle = '';
  let inEpilogue = false;

  const chapters: Chapter[] = [];
  // Index into `chapters` of the entry whose `end` is still open.
  let open = -1;

  const closeAt = (offset: number) => {
    if (open >= 0) chapters[open]!.end = offset;
    open = -1;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!.trim();
    if (!line) continue;

    const partM = PART_RE.exec(line);
    if (partM) {
      closeAt(lineOffset[i]!);
      partNum = fromRoman(partM[1]!);
      part = `Part ${partM[1]}`;
      inEpilogue = false;
      continue;
    }

    if (EPILOGUE_RE.test(line)) {
      closeAt(lineOffset[i]!);
      inEpilogue = true;
      part = 'Epilogue';
      partNum = 5;
      bookNum = 13;
      bookTitle = 'Epilogue';
      continue;
    }

    const bookM = BOOK_RE.exec(line);
    if (bookM) {
      closeAt(lineOffset[i]!);
      bookNum = fromRoman(bookM[1]!);
      bookTitle = bookM[2]!;
      continue;
    }

    const chapM = CHAP_RE.exec(line);
    if (chapM && bookNum > 0) {
      closeAt(lineOffset[i]!);

      // The chapter title is the next non-blank line.
      let j = i + 1;
      while (j < lines.length && !lines[j]!.trim()) j++;
      const title = (lines[j] ?? '').trim();

      const roman = chapM[1]!;
      const num = fromRoman(roman);
      const bookLabel = inEpilogue ? 'Epilogue' : `Bk ${toRoman(bookNum)}`;

      chapters.push({
        id: `b${String(bookNum).padStart(2, '0')}-c${String(num).padStart(2, '0')}`,
        part,
        partNum,
        bookNum,
        bookTitle,
        num,
        roman,
        title,
        cite: `${bookLabel}, ch. ${num}`,
        // Body starts after the title line.
        start: lineOffset[j + 1] ?? lineOffset[j]!,
        end: text.length,
        wordCount: 0,
      });
      open = chapters.length - 1;
      i = j;
    }
  }
  closeAt(text.length);

  rmSync(CH_DIR, { recursive: true, force: true });
  mkdirSync(CH_DIR, { recursive: true });

  let total = 0;
  for (const ch of chapters) {
    const body = text.slice(ch.start, ch.end).trim();
    ch.wordCount = body.split(/\s+/).filter(Boolean).length;
    total += ch.wordCount;
    writeFileSync(join(CH_DIR, `${ch.id}.txt`), body, 'utf8');
  }

  const corpus: Corpus = {
    title: 'The Brothers Karamazov',
    author: 'Fyodor Dostoyevsky',
    translator: 'Constance Garnett',
    source: 'Project Gutenberg #28054 (public domain)',
    wordCount: total,
    chapters,
  };

  writeFileSync(join(OUT_DIR, 'corpus.json'), JSON.stringify(corpus, null, 2));

  const books = new Set(chapters.map((c) => c.bookNum));
  console.log(
    `parsed ${chapters.length} chapters across ${books.size} books, ${total.toLocaleString()} words`,
  );
}

function toRoman(n: number): string {
  const table: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
    [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ];
  let out = '';
  for (const [v, sym] of table) while (n >= v) { out += sym; n -= v; }
  return out;
}

main();
