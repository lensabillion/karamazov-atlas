/**
 * Who says what to whom, from Garnett's dialogue tags.
 *
 * Review finding R2 (atlas-w56r) found two faults in the first version:
 *
 *   1. ADJACENT QUOTES. The gap between a closing quote and its tag was any
 *      forty characters without a full stop, so `“…long speech…” “Short
 *      reply,” said Alyosha` handed the long speech (Rakitin's, about
 *      Grushenka, II.7) to Alyosha. The gap may not now contain a quotation
 *      mark, and nothing crosses a paragraph break.
 *   2. MENTION IS NOT ADDRESS. Every name inside a speech was counted as the
 *      speaker addressing that person. Most are the speaker talking ABOUT
 *      someone. A name is now 'address' only when it stands as a vocative —
 *      set off at the start of the speech or by punctuation on both sides
 *      ("Listen, Alyosha, …", "…, my dear Alyosha!") — and 'mention' otherwise.
 *
 * Every record keeps its chapter and character offset, so each claim built on
 * it can be checked against the passage. Coverage is partial by construction
 * (only tagged speech is attributed) and is reported alongside, never hidden.
 */
import { formPattern } from './match.ts';

export type Relation = 'address' | 'mention';

export interface AliasEntry { form: string; id: string }

export interface NameInSpeech {
  target: string;
  form: string;
  relation: Relation;
}

export interface Utterance {
  speaker: string;
  /** Offset of the opening quotation mark in the chapter text. */
  at: number;
  /** Length of the quoted speech, marks included. */
  length: number;
  names: NameInSpeech[];
}

const VERBS =
  'said|cried|answered|asked|shouted|murmured|added|replied|exclaimed|observed|whispered|repeated|began|interrupted';

/** Between a closing quote and its tag: no sentence end, no other quotation, no line break. */
const GAP = `[^.!?\\n“”"]{0,40}?`;
/** A quoted speech inside one paragraph. */
const QUOTE = `[“"]([^”"\\n]{8,900})[”"]`;

/** What may stand between a separator and a vocative name: "my dear", "brother", … */
const ENDEARMENT =
  `(?:(?:my|our)\\s+)?(?:(?:dear|dearest|darling|good|kind|little|poor|old|young|sweet)\\s+)?` +
  `(?:(?:brother|sister|father|mother|uncle|granny|madame|pan|panie)\\s+)?`;
const BEFORE_VOCATIVE = new RegExp(`(?:^|(?:[,;:!?—–]|\\.\\.\\.|…)\\s*)${ENDEARMENT}$`, 'i');
/**
 * After a vocative: punctuation or the end of the speech — optionally after a
 * patronymic the alias list does not carry ("wait a little, Grigory
 * Vassilyevitch," was the one miss in the precision sample).
 */
const AFTER_VOCATIVE = /^(?:\s+[A-Z][a-z]+(?:ovitch|evitch|itch|ovna|evna|ichna))?\s*(?:[,;:!?.—–]|…|$)/;

/**
 * Single line breaks become spaces and paragraph breaks stay; the result has
 * the same length as the input, so offsets still point into the chapter text.
 */
export function flattenLines(text: string): string {
  return text.replace(/(?<!\n)\n(?!\n)/g, ' ');
}

/** Classify one name found inside a speech. Exported for tests. */
export function relationOf(speech: string, index: number, form: string): Relation {
  const before = speech.slice(0, index);
  const after = speech.slice(index + form.length);
  return BEFORE_VOCATIVE.test(before) && AFTER_VOCATIVE.test(after) ? 'address' : 'mention';
}

/** Names inside one speech, longest form first, each position claimed once, speaker excluded. */
export function namesIn(speech: string, speaker: string, aliases: AliasEntry[]): NameInSpeech[] {
  const claimed = new Uint8Array(speech.length);
  const found: { index: number; hit: NameInSpeech }[] = [];
  for (const a of aliases) {
    const re = new RegExp(`\\b${formPattern(a.form)}\\b`, 'g');
    let m: RegExpExecArray | null;
    while ((m = re.exec(speech)) !== null) {
      const end = m.index + m[0].length;
      if (claimed.subarray(m.index, end).some(Boolean)) continue;
      claimed.fill(1, m.index, end);
      // Self-reference is neither address nor mention of another person.
      if (a.id === speaker) continue;
      found.push({ index: m.index, hit: { target: a.id, form: a.form, relation: relationOf(speech, m.index, m[0]) } });
    }
  }
  return found.sort((x, y) => x.index - y.index).map((f) => f.hit);
}

/** Every tagged speech in one chapter. `aliases` must be sorted longest-first. */
export function attribute(chapterText: string, aliases: AliasEntry[]): Utterance[] {
  const text = flattenLines(chapterText);
  const speakerPat = aliases.map((a) => formPattern(a.form)).join('|');
  const patterns = [
    new RegExp(`${QUOTE}${GAP}\\b(?:${VERBS})\\s+(${speakerPat})\\b`, 'g'),
    new RegExp(`${QUOTE}${GAP}\\b(${speakerPat})\\s+(?:${VERBS})\\b`, 'g'),
  ];
  const byOffset = new Map<number, Utterance>();
  for (const re of patterns) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const said = m[2]!.replace(/\s+/g, ' ');
      const speaker = aliases.find((a) => a.form === said)?.id;
      if (!speaker || byOffset.has(m.index)) continue;
      const speech = m[1]!;
      byOffset.set(m.index, {
        speaker,
        at: m.index,
        length: speech.length + 2,
        names: namesIn(speech, speaker, aliases),
      });
    }
  }
  return [...byOffset.values()].sort((a, b) => a.at - b.at);
}

/** Quotations of eight characters or more, the denominator for coverage. */
export function countQuotes(chapterText: string): number {
  return (flattenLines(chapterText).match(new RegExp(QUOTE, 'g')) ?? []).length;
}
