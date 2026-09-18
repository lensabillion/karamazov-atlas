/**
 * The reader's place (atlas-fn3v) and spoiler-scoped retrieval (atlas-zbt8).
 *
 * The gate exists twice — as an ES5 string that runs before first paint, and
 * as the module function that re-gates when the place changes — so the most
 * important check is that the two produce the same stylesheet. The rest pins
 * the parsing edge cases and proves search cannot reach past the place.
 *
 * Run with --conditions=react-server: corpus.ts is server-only.
 */
import {
  CHAPTER_COUNT, GATE_SCRIPT, GATE_STYLE_ID, POSITION_KEY, gateCss, parsePosition,
} from '../src/lib/reading-position.ts';
import { ordinalOf, searchCorpus } from '../src/lib/corpus.ts';
import { findPassage, passageFromHash, passageHref } from '../src/lib/passage.ts';
import { chapterIdOf } from '../src/components/AnswerText.tsx';

let failed = 0;
const check = (name: string, cond: boolean, detail = '') => {
  if (!cond) failed++;
  console.log(`${cond ? '  ok  ' : ' FAIL '} ${name}${cond ? '' : ` — ${detail}`}`);
};

console.log('parsing a saved place');
check('a chapter in range is a place', parsePosition('36') === 36);
check('the last chapter means the whole book', parsePosition(String(CHAPTER_COUNT)) === null);
check('zero, negatives and junk mean the whole book',
  [null, undefined, '', '0', '-4', 'abc', '999'].every((v) => parsePosition(v) === null));

console.log('\nthe gate');
check('no stylesheet for the whole book', gateCss(null) === '');
const g95 = gateCss(95);
check('a place one short of the end folds only the last chapter',
  g95.includes('[data-spoiler-from="96"]') && !g95.includes('[data-spoiler-from="95"]'));
const g36 = gateCss(36);
check('the gate hides content after the place, never at it',
  g36.includes('[data-spoiler-from="37"]') && !g36.includes('[data-spoiler-from="36"]'));
check('the gate shows the notes for exactly the folded chapters',
  g36.includes('[data-spoiler-note="37"]') && g36.includes('[data-spoiler-note="96"]')
    && !g36.includes('[data-spoiler-note="36"]'));

// Run the inline script against a minimal DOM and storage, and compare.
function runScript(stored: string | null, throws = false) {
  const appended: { id: string; textContent: string }[] = [];
  const attrs: Record<string, string> = {};
  const env = {
    localStorage: {
      getItem: (k: string) => {
        if (throws) throw new Error('SecurityError');
        return k === POSITION_KEY ? stored : null;
      },
    },
    document: {
      createElement: () => ({ id: '', textContent: '' }),
      head: { appendChild: (el: { id: string; textContent: string }) => appended.push(el) },
      documentElement: { setAttribute: (k: string, v: string) => { attrs[k] = v; } },
    },
  };
  new Function('localStorage', 'document', GATE_SCRIPT)(env.localStorage, env.document);
  return { appended, attrs };
}
const pre = runScript('36');
check('the pre-paint script writes the same stylesheet as the module',
  pre.appended.length === 1 && pre.appended[0]!.id === GATE_STYLE_ID
    && pre.appended[0]!.textContent === gateCss(36), 'script and module disagree');
check('the pre-paint script marks the page with the place', pre.attrs['data-position'] === '36');
check('no saved place: the script does nothing', runScript(null).appended.length === 0);
check('blocked storage: the script fails silently to the whole book',
  runScript('36', true).appended.length === 0);

console.log('\nspoiler-scoped retrieval');
const hanged = ordinalOf('b11-c10');
const whole = searchCorpus('hanged himself', 10);
check('the whole book finds the hanging', whole.some((h) => ordinalOf(h.chapter.id) === hanged));
for (const through of [5, 36, 60]) {
  const hits = searchCorpus('hanged himself', 20, through);
  const past = hits.filter((h) => ordinalOf(h.chapter.id) > through).map((h) => h.chapter.cite);
  check(`search at place ${through} returns nothing past it`, past.length === 0, past.join(', '));
}

console.log('\nretrieval quality');
// Known passages, found by the words a reader would use. Before BM25 and a
// stopword list, every one of these returned the same five long chapters.
const top = (q: string, n = 1) => searchCorpus(q, n).map((h) => h.chapter.id);
const cases: [string, string, number][] = [
  ['Snegiryov trampling the notes under his heel', 'b04-c07', 1],
  ['the Grand Inquisitor', 'b05-c05', 1],
  ['Cana of Galilee', 'b07-c04', 1],
  ['returns the ticket', 'b05-c04', 3],
  ['Zhutchka the dog with a pin in the bread', 'b10-c04', 3],
  ['the pestle Grigory struck on the fence', 'b08-c04', 3],
];
for (const [q, want, n] of cases) {
  const got = top(q, n);
  check(`“${q}” finds ${want} in the top ${n}`, got.includes(want), got.join(', '));
}
const distinct = new Set(['Alyosha', 'trampling money', 'Grand Inquisitor'].map((q) => top(q, 5).join()));
check('different questions no longer return the same chapters', distinct.size === 3);

console.log('\npassage links');
const href = passageHref('b03-c02', 'They saved the baby, but Lizaveta died at dawn');
check('a passage link round-trips through the hash',
  passageFromHash(href.slice(href.indexOf('#'))) === 'They saved the baby, but Lizaveta died at dawn');
check('matching ignores italic underscores and wrapping',
  findPassage(['one _two_\nthree', 'four'], 'two three') === 0);
check('an absent phrase is -1', findPassage(['one'], 'nothing like it') === -1);

console.log('\nanswer citations');
check('Bk V, ch. 4 links to b05-c04', chapterIdOf('V', '4') === 'b05-c04');
check('Bk XII, ch. 14 links to b12-c14', chapterIdOf('XII', '14') === 'b12-c14');
check('Epilogue, ch. 3 links to b13-c03', chapterIdOf('Epilogue', '3') === 'b13-c03');
check('an impossible citation links nowhere', chapterIdOf('XX', '4') === null && chapterIdOf('V', '40') === null);

console.log(failed === 0 ? '\nReading-position checks passed.' : `\n${failed} check(s) failed`);
process.exit(failed === 0 ? 0 : 1);
