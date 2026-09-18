/**
 * The momentum layer (atlas-z9ro): why each part of the novel is there.
 *
 * Reader research (docs/research-reader-experience.md) found three ways people
 * abandon this book: they stall in Book VI, which the readers who love the novel
 * name most often; they cannot tell a load-bearing digression from ornament, so
 * they attend to everything and tire; and they read the narrator's lapses as
 * sloppiness because nobody tells them he is a character.
 *
 * Each note answers "where am I in the argument, what is this answering, why is
 * it here" — and never "what happens". A note may look back; it must not look
 * forward past its own chapter. scripts/test-curated.ts checks that no note
 * names a person the reader has not yet met.
 *
 * Set as the period set a chapter's "argument": a few italic lines under the
 * heading. Curated, like the relationship and timeline data.
 */

export interface Orientation {
  /** Where the reader stands in the book's argument. */
  where: string;
  /** Why this part is here, and what to hold on to. */
  why: string;
}

/** One per book, keyed by book number (13 is the Epilogue). */
export const BOOK_ORIENTATION: Record<number, Orientation> = {
  1: {
    where: 'The backstory, told by a townsman who knew the family and will keep interrupting.',
    why: 'Every quarrel in the novel is inherited. This is the ledger: three sons by two mothers, each left to others to raise, and a father who forgot them. Hold on to the money the eldest believes he is owed.',
  },
  2: {
    where: 'The one scene in which the whole family is in a room together.',
    why: 'Each son shows who he is under his father’s provocation. The elder’s few gestures say more than the arguments do; remember them, because the novel returns to them.',
  },
  3: {
    where: 'The Karamazov inheritance as appetite — in the father, in the eldest son, and in the house.',
    why: 'Dmitri’s three-chapter confession sets out the money, the two women and the rivalry with his father that drive everything after. The chapters about the servants are not a detour: who they are, and how one of them was raised, matters.',
  },
  4: {
    where: 'A long day of other people’s wounds, carried from house to house by Alyosha.',
    why: '“Laceration” is the translator’s word for suffering people choose and nurse. The book seems to wander from the family; it is building the world the brothers’ argument will be tested against, and it plants the schoolboys.',
  },
  5: {
    where: 'The argument itself — the “contra”.',
    why: 'Ivan’s case against the world God made, and his poem of the Grand Inquisitor. Read these slowly: much of the rest of the novel is an answer to them, in words or in events.',
  },
  6: {
    where: 'The reply to Book V, given not as a counter-argument but as a life.',
    why: 'Dostoyevsky meant this book to answer the Rebellion and the Grand Inquisitor. It is slower and more devotional, and it is where readers most often stall — yet it is the book most often named by those who call the novel life-changing. Skip it and the accusation stands with no defence.',
  },
  7: {
    where: 'Alyosha’s own book: what faith does when events seem to refute it.',
    why: 'Short, and the hinge of his story. The question of Books V and VI is now asked of one young man, in private.',
  },
  8: {
    where: 'One desperate day and night from Dmitri’s side, told almost minute by minute.',
    why: 'Notice exactly what the narration shows you and what it does not. Later books depend on the difference.',
  },
  9: {
    where: 'The case against Dmitri, assembled question by question.',
    why: 'Read it once as the investigators hear it and once as Dmitri lives it. The gap between what is true and what is believable is the subject of the rest of the novel.',
  },
  10: {
    where: 'An abrupt turn to schoolchildren, months later.',
    why: 'Not an interruption. The boys replay the adults’ story at a smaller scale — pride, cruelty, humiliation, and what can be done about them — and Alyosha’s path runs through them.',
  },
  11: {
    where: 'Ivan’s book, as Book V was Ivan’s argument.',
    why: 'What the argument costs the man who made it. The three interviews and the nightmare that follow are the core of the novel’s case about ideas and responsibility.',
  },
  12: {
    where: 'The trial.',
    why: 'The book’s own title calls it an error before it begins. Watch two brilliant speeches build persuasive stories from the same facts, and ask of each what it leaves out.',
  },
  13: {
    where: 'The aftermath, in three short chapters.',
    why: 'What the survivors do with the verdict — and the place the novel chooses for its last word.',
  },
};

/** Chapters that need more than their book's note. Keyed by chapter id. */
export const CHAPTER_ORIENTATION: Record<string, string> = {
  'b01-c01': 'The narrator is a local who says what he saw, admits what he does not know, and sometimes forgets. That is deliberate: he is a character in the town, not a camera.',
  'b01-c05': 'A digression on the institution of elders, and not an idle one: it explains the authority Alyosha has chosen to live under.',
  'b03-c06': 'A chapter about a servant, placed between Dmitri’s confession and the evening at his father’s table. Its position is the point.',
  'b05-c04': 'Ivan builds his case from cruelty to children, drawn from real reports of the time. He does not deny God; he refuses the terms of the world.',
  'b05-c05': 'A poem inside the novel. Its argument — that people prefer bread and authority to freedom — is Ivan’s, not the author’s, and Book VI is written to answer it. Alyosha’s response at the end is part of the answer.',
  'b06-c01': 'If you are tempted to skim, this is the book to slow down for. It is the novel’s reply to the tavern.',
  'b06-c02': 'Stories from the elder’s youth. Each is a case, lived before it is stated, of the idea at the centre of this book: that every one of us is responsible to all for all.',
  'b06-c03': 'The teaching, in the elder’s own words, as Alyosha wrote it down. It answers the Grand Inquisitor indirectly — not by refuting him, but by describing a different way to live.',
  'b10-c01': 'A new boy, a new household. The narrator has jumped two months; you have not missed anything.',
  'b12-c06': 'The prosecutor’s speech is meant to persuade you. Let it, and then ask what it had to assume.',
  'b12-c10': 'The defence answers the prosecution with a psychology of its own. Keep both in mind before you decide which to trust.',
};
