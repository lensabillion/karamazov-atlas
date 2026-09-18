/**
 * Who says this (atlas-sto5): the novel's arguments, attributed to the people
 * with a stake in them.
 *
 * Nothing in this book is asserted by the narrator; every idea is spoken by
 * someone who has something riding on it. Each idea here is followed through
 * the book as a sequence of passages — where it is stated, repeated, contested,
 * acted on, and tested on the man who said it — each quoted verbatim and
 * checked by scripts/test-curated.ts against one paragraph of its chapter.
 *
 * Curated, like the relationship and timeline data. Stances describe what the
 * passage does in the argument, not whether the idea is right.
 */

export type Stance = 'states' | 'repeats' | 'owns' | 'contests' | 'acts on' | 'turns on' | 'answers' | 'lives';

export interface Voice {
  /** Character id of the speaker. */
  who: string;
  stance: Stance;
  chapter: string;
  /** Verbatim, within one paragraph. */
  quote: string;
  /** What this passage does to the idea. */
  note: string;
}

export interface Idea {
  id: string;
  /** The idea, in the words the novel keeps returning to. */
  idea: string;
  /** Why it matters to the book, in one line. */
  stake: string;
  voices: Voice[];
}

export const IDEAS: Idea[] = [
  {
    id: 'lawful',
    idea: 'Everything is lawful',
    stake: 'If there is no immortality, there is no virtue — and then who is to blame for a murder?',
    voices: [
      { who: 'miusov', stance: 'repeats', chapter: 'b02-c06',
        quote: 'nothing then would be immoral, everything would be lawful, even cannibalism',
        note: 'Miüsov reports it at the monastery as Ivan’s argument, a clever man’s paradox.' },
      { who: 'rakitin', stance: 'repeats', chapter: 'b02-c07',
        quote: 'if there’s no immortality of the soul, then there’s no virtue, and everything is lawful',
        note: 'Rakitin passes it on to Alyosha the same afternoon, as gossip about Ivan.' },
      { who: 'ivan', stance: 'owns', chapter: 'b05-c05',
        quote: '‘everything is lawful’ since the word has been said. I won’t deny it.',
        note: 'Ivan claims it himself, to Alyosha, at the end of the Grand Inquisitor.' },
      { who: 'alyosha', stance: 'contests', chapter: 'b05-c05',
        quote: 'Alyosha got up, went to him and softly kissed him on the lips.',
        note: 'Alyosha does not argue. He answers with the gesture Christ gives the Inquisitor.' },
      { who: 'smerdyakov', stance: 'acts on', chapter: 'b11-c08',
        quote: 'That was quite right what you taught me',
        note: 'Smerdyakov says he killed on the strength of it, and hands the idea back to its author.' },
      { who: 'devil', stance: 'turns on', chapter: 'b11-c09',
        quote: '‘all things are lawful’ and that’s the end of it! That’s all very charming',
        note: 'The devil quotes Ivan’s own words back to him, as a joke at his expense.' },
    ],
  },
  {
    id: 'responsible',
    idea: 'Each of us is responsible to all for all',
    stake: 'The novel’s answer to the second question: not one man, but everyone.',
    voices: [
      { who: 'markel', stance: 'states', chapter: 'b06-c01',
        quote: 'every one is really responsible to all men for all men and for everything',
        note: 'Said first by the elder’s brother, dying at seventeen, to their mother — as the elder remembers it.' },
      { who: 'zossima', stance: 'repeats', chapter: 'b06-c02',
        quote: 'we are each responsible to all for all',
        note: 'The elder carries his brother’s words through his own life, and tells them to Alyosha.' },
      { who: 'zossima', stance: 'answers', chapter: 'b06-c03',
        quote: 'Love all God’s creation, the whole and every grain of sand in it.',
        note: 'His teaching turns the idea into practice, set against the Inquisitor’s bread and authority.' },
      { who: 'dmitri', stance: 'lives', chapter: 'b09-c09',
        quote: 'not because I killed him, but because I meant to kill him',
        note: 'Arrested, Dmitri accepts punishment for a wish, not a deed.' },
      { who: 'dmitri', stance: 'lives', chapter: 'b11-c04',
        quote: 'Because we are all responsible for all.',
        note: 'In prison, he reaches the elder’s words by his own road, from his dream of the babe.' },
    ],
  },
  {
    id: 'ticket',
    idea: 'I return the ticket',
    stake: 'Ivan’s case against the world God made: no harmony is worth a child’s suffering.',
    voices: [
      { who: 'ivan', stance: 'states', chapter: 'b05-c04',
        quote: 'It’s not God that I don’t accept, Alyosha, only I most respectfully return Him the ticket.',
        note: 'After the stories of tortured children, Ivan declines the terms rather than the Creator.' },
      { who: 'alyosha', stance: 'contests', chapter: 'b05-c04',
        quote: '“That’s rebellion,” murmured Alyosha, looking down.',
        note: 'Alyosha names it, and cannot yet answer it.' },
      { who: 'zossima', stance: 'answers', chapter: 'b06-c03',
        quote: 'Love all God’s creation, the whole and every grain of sand in it.',
        note: 'Book VI was written as the reply: not a proof, but a way of living in the same world.' },
    ],
  },
];

/** How each speaker is named here. */
export const SPEAKER_NAMES: Record<string, string> = {
  miusov: 'Miüsov', rakitin: 'Rakitin', ivan: 'Ivan', alyosha: 'Alyosha',
  smerdyakov: 'Smerdyakov', zossima: 'Father Zossima', dmitri: 'Dmitri',
  markel: 'Markel, the elder’s brother', devil: 'The devil — or Ivan’s fever',
};
