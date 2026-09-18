/**
 * The case file (atlas-1bj0): what the novel lets a reader know about the
 * death of Fyodor Pavlovitch, one piece at a time, each traced to its passage.
 *
 * Why curated rather than extracted: the verdict asks readers to take a
 * position, and "it is gimmick-shaped if the evidence under it is thin". Every
 * record here quotes the text verbatim, and scripts/test-curated.ts fails if a
 * quotation is not inside one paragraph of its chapter. The machine extraction
 * (data/entities.json, atlas-94i4) covers half the book so far and is not used
 * for anything a reader is asked to judge.
 *
 * The field that carries the novel's argument is `court`: the jury believed
 * true evidence and reached a false conclusion, because what would have cleared
 * Dmitri was either never heard or heard and not believed.
 */

/** The three men the novel puts in the frame for the killing itself. */
export type Suspect = 'dmitri' | 'smerdyakov' | 'ivan';

export interface Evidence {
  id: string;
  /** Where the reader learns it. */
  chapter: string;
  /** Verbatim, within one paragraph, so the link can land on it. */
  quote: string;
  /** Who says it: a character id, or the narrator. */
  source: string;
  kind: 'fact' | 'testimony' | 'confession' | 'document' | 'argument' | 'teaching';
  /** What it establishes, stated plainly and no further than the text goes. */
  says: string;
  /** Which of the two questions it bears on. */
  question: 'killed' | 'responsible' | 'both';
  /** Whom it points toward, or away from. */
  points: Partial<Record<Suspect, 'toward' | 'away'>>;
  /** What the trial did with it, where the novel says. */
  court?: 'believed' | 'heard, not believed' | 'never heard';
}

export const EVIDENCE: Evidence[] = [
  { id: 'e01', chapter: 'b02-c06', source: 'dmitri', kind: 'fact', question: 'both',
    quote: 'Why is such a man alive?',
    says: 'Before the whole company at the monastery, Dmitri asks aloud why his father should live.',
    points: { dmitri: 'toward' } },
  { id: 'e02', chapter: 'b02-c06', source: 'miusov', kind: 'testimony', question: 'responsible',
    quote: 'nothing then would be immoral, everything would be lawful, even cannibalism',
    says: 'Miüsov reports Ivan’s argument: without belief in immortality, everything would be lawful.',
    points: { ivan: 'toward' } },
  { id: 'e03', chapter: 'b03-c05', source: 'dmitri', kind: 'testimony', question: 'killed',
    quote: 'That’s what the old man wants, so that Grushenka can come while he’s away',
    says: 'Father and son want the same woman, and Fyodor is waiting for her to come to him.',
    points: { dmitri: 'toward' } },
  { id: 'e04', chapter: 'b03-c09', source: 'dmitri', kind: 'fact', question: 'killed',
    quote: 'If I haven’t killed him, I’ll come again and kill him.',
    says: 'After beating his father, Dmitri threatens to come back and finish it, in front of witnesses.',
    points: { dmitri: 'toward' } },
  { id: 'e05', chapter: 'b05-c05', source: 'ivan', kind: 'testimony', question: 'responsible',
    quote: '‘everything is lawful’ since the word has been said. I won’t deny it.',
    says: 'Ivan owns the idea himself, to Alyosha.',
    points: { ivan: 'toward' }, court: 'never heard' },
  { id: 'e06', chapter: 'b05-c06', source: 'smerdyakov', kind: 'testimony', question: 'killed',
    quote: 'I let him know the signals as a great secret',
    says: 'Smerdyakov has told Dmitri the knocks that make Fyodor open his door — the knocks Smerdyakov also knows.',
    points: { dmitri: 'toward', smerdyakov: 'toward' } },
  { id: 'e07', chapter: 'b05-c06', source: 'smerdyakov', kind: 'testimony', question: 'both',
    quote: 'I might fall down the cellar steps',
    says: 'The evening before, Smerdyakov tells Ivan he may have a fit tomorrow, and where.',
    points: { smerdyakov: 'toward', ivan: 'toward' } },
  { id: 'e08', chapter: 'b05-c07', source: 'narrator', kind: 'fact', question: 'killed',
    quote: 'Smerdyakov went to the cellar for something and fell down from the top of the steps',
    says: 'The next day he falls in a fit and is put to bed — an apparent alibi for the night.',
    points: { smerdyakov: 'away' }, court: 'believed' },
  { id: 'e09', chapter: 'b05-c07', source: 'ivan', kind: 'fact', question: 'responsible',
    quote: '“I am a scoundrel,” he whispered to himself.',
    says: 'Ivan leaves for Moscow after Smerdyakov’s hints, and knows what he has done.',
    points: { ivan: 'toward' }, court: 'never heard' },
  { id: 'e10', chapter: 'b08-c03', source: 'narrator', kind: 'fact', question: 'killed',
    quote: 'a small brass pestle, not much more than six inches long',
    says: 'Running out of Grushenka’s house, Dmitri snatches up a brass pestle.',
    points: { dmitri: 'toward' }, court: 'believed' },
  { id: 'e11', chapter: 'b08-c04', source: 'narrator', kind: 'fact', question: 'killed',
    quote: 'In Mitya’s hands was a brass pestle, and he flung it mechanically in the grass',
    says: 'In the garden that night Dmitri strikes Grigory down with it and throws it away.',
    points: { dmitri: 'toward' }, court: 'believed' },
  { id: 'e12', chapter: 'b08-c05', source: 'narrator', kind: 'fact', question: 'killed',
    quote: 'the fingers holding them were covered with blood',
    says: 'Within the hour he appears with a fistful of hundred-rouble notes and bloody hands.',
    points: { dmitri: 'toward' }, court: 'believed' },
  { id: 'e13', chapter: 'b09-c02', source: 'narrator', kind: 'fact', question: 'killed',
    quote: 'torn open and was empty',
    says: 'Fyodor is found dead, the envelope for Grushenka torn open and empty on the floor.',
    points: {}, court: 'believed' },
  { id: 'e14', chapter: 'b09-c03', source: 'dmitri', kind: 'testimony', question: 'both',
    quote: 'I’m not guilty of my father’s blood',
    says: 'Dmitri denies the killing from the first question, while admitting he meant to kill.',
    points: { dmitri: 'away' }, court: 'heard, not believed' },
  { id: 'e15', chapter: 'b09-c05', source: 'dmitri', kind: 'testimony', question: 'killed',
    quote: 'the door was shut the whole time I was in the garden',
    says: 'Dmitri insists the door into the house was shut the whole time he was in the garden.',
    points: { dmitri: 'away' }, court: 'heard, not believed' },
  { id: 'e16', chapter: 'b09-c07', source: 'dmitri', kind: 'testimony', question: 'killed',
    quote: 'that fifteen hundred, like a locket round my neck',
    says: 'His money was not his father’s: half of Katerina’s three thousand, kept sewn up for a month.',
    points: { dmitri: 'away' }, court: 'heard, not believed' },
  { id: 'e17', chapter: 'b09-c09', source: 'dmitri', kind: 'testimony', question: 'responsible',
    quote: 'not because I killed him, but because I meant to kill him',
    says: 'Dmitri accepts punishment for having wanted the death, not for causing it.',
    points: { dmitri: 'toward' } },
  { id: 'e18', chapter: 'b06-c02', source: 'zossima', kind: 'teaching', question: 'responsible',
    quote: 'we are each responsible to all for all',
    says: 'The elder’s answer to the second question, learned from his dying brother: everyone.',
    points: {} },
  { id: 'e19', chapter: 'b11-c08', source: 'smerdyakov', kind: 'confession', question: 'both',
    quote: 'It was only with you, with your help, I killed him, and Dmitri Fyodorovitch is quite innocent',
    says: 'Smerdyakov confesses to Ivan alone that he did it, and that Ivan was his accomplice.',
    points: { smerdyakov: 'toward', ivan: 'toward', dmitri: 'away' }, court: 'never heard' },
  { id: 'e20', chapter: 'b11-c08', source: 'smerdyakov', kind: 'confession', question: 'killed',
    quote: 'A sham one, naturally. I shammed it all.',
    says: 'The fit in the cellar, his alibi, was faked.',
    points: { smerdyakov: 'toward' }, court: 'never heard' },
  { id: 'e21', chapter: 'b11-c08', source: 'smerdyakov', kind: 'confession', question: 'responsible',
    quote: 'That was quite right what you taught me',
    says: 'He acted, he says, on what Ivan taught him: that all things are lawful.',
    points: { ivan: 'toward' }, court: 'never heard' },
  { id: 'e22', chapter: 'b11-c08', source: 'smerdyakov', kind: 'fact', question: 'killed',
    quote: 'They are all here, all the three thousand roubles',
    says: 'He hands Ivan the three thousand roubles from the envelope.',
    points: { smerdyakov: 'toward', dmitri: 'away' } },
  { id: 'e23', chapter: 'b11-c10', source: 'smerdyakov', kind: 'document', question: 'both',
    quote: 'I destroy my life of my own will and desire, so as to throw no blame on any one.',
    says: 'Smerdyakov hangs himself the night before the trial, leaving a note that names no one.',
    points: {} },
  { id: 'e24', chapter: 'b12-c02', source: 'narrator', kind: 'testimony', question: 'killed',
    quote: 'the most damning piece of evidence about the open door',
    says: 'Grigory swears the garden door was open — the evidence the prosecution leans on most.',
    points: { dmitri: 'toward' }, court: 'believed' },
  { id: 'e25', chapter: 'b12-c05', source: 'katerina', kind: 'document', question: 'killed',
    quote: 'I shall kill him as soon as Ivan has gone away.',
    says: 'Katerina produces Dmitri’s drunken letter, written weeks before, as proof of a plan.',
    points: { dmitri: 'toward' }, court: 'believed' },
  { id: 'e26', chapter: 'b12-c05', source: 'ivan', kind: 'testimony', question: 'both',
    quote: 'It was he, not my brother, killed our father. He murdered him and I incited him to do it',
    says: 'Ivan, feverish, tells the court Smerdyakov did it and he himself incited it, and shows the money.',
    points: { smerdyakov: 'toward', ivan: 'toward', dmitri: 'away' }, court: 'heard, not believed' },
  { id: 'e27', chapter: 'b12-c11', source: 'fetyukovitch', kind: 'argument', question: 'killed',
    quote: 'if there was no money, there was no theft of it',
    says: 'The defence: no one ever saw the three thousand, so no robbery can be proved.',
    points: { dmitri: 'away' }, court: 'heard, not believed' },
  { id: 'e28', chapter: 'b12-c14', source: 'narrator', kind: 'fact', question: 'both',
    quote: '“Yes, guilty!”',
    says: 'The jury convicts Dmitri on every count, and so answers both questions with one name.',
    points: { dmitri: 'toward' } },
];

/** How each source is named in the case file. */
export const SOURCE_NAMES: Record<string, string> = {
  narrator: 'The narrator', dmitri: 'Dmitri', ivan: 'Ivan', smerdyakov: 'Smerdyakov',
  katerina: 'Katerina Ivanovna', zossima: 'Father Zossima', miusov: 'Miüsov',
  fetyukovitch: 'Fetyukovitch, for the defence',
};

/** The court's answer, fixed, as a reference line for the reader's own. */
export const JURY = { chapter: 'b12-c14', killed: 'dmitri', responsible: ['dmitri'] } as const;

/** The elder's answer to the second question, fixed, as the other reference line. */
export const ZOSSIMA = { chapter: 'b06-c02', responsible: 'everyone' } as const;
