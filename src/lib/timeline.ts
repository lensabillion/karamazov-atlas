/**
 * The novel on story time rather than page time.
 *
 * CURATED, like the relationship data. The chronology is knowledge about the
 * book, not a statistic — but the striking part is measured: two thirds of the
 * novel (229,504 of 349,367 words) covers roughly four days. Books I–IX are
 * almost a single continuous stretch; then two months vanish in a paragraph.
 *
 * That mismatch is the point of the chart. The segments below are laid out by
 * STORY time, while each carries the share of the BOOK it consumes — so the
 * compression is visible instead of asserted.
 */

export interface Segment {
  id: string;
  label: string;
  /** What a reader should understand about this stretch of time. */
  note: string;
  books: number[];
  /** Words the novel spends here. Measured from the corpus. */
  words: number;
  /** A gap in the story that the book skips over. */
  elided?: boolean;
}

export interface Moment {
  id: string;
  segment: string;
  /** Order within the segment. */
  at: number;
  label: string;
  detail: string;
  who: string[];
  chapter: string;
  cite: string;
  /** Turning points, drawn heavier. */
  key?: boolean;
}

/** Lanes, top to bottom. Ordered so the murder's participants sit together. */
export const LANES = [
  { id: 'fyodor', name: 'Fyodor' },
  { id: 'dmitri', name: 'Dmitri' },
  { id: 'ivan', name: 'Ivan' },
  { id: 'smerdyakov', name: 'Smerdyakov' },
  { id: 'alyosha', name: 'Alyosha' },
  { id: 'grushenka', name: 'Grushenka' },
  { id: 'katerina', name: 'Katerina' },
];

export const SEGMENTS: Segment[] = [
  { id: 'before', label: 'Before', note: 'Thirteen years of neglect, compressed into one book of backstory.', books: [1], words: 12346 },
  { id: 'day1', label: 'Day one', note: 'The family assembles at the monastery to settle a money quarrel and settles nothing. By nightfall Dmitri has attacked his father.', books: [2, 3], words: 56945 },
  { id: 'day2', label: 'Day two', note: 'Alyosha spends the day absorbing other people’s humiliations, then meets Ivan in a tavern and hears the case against God. Zossima dies that night.', books: [4, 5, 6], words: 76812 },
  { id: 'day3', label: 'Day three — and the night', note: 'The elder’s body decays and Alyosha’s faith cracks. Dmitri spends the day hunting three thousand roubles. That night Fyodor is killed.', books: [7, 8], words: 53566 },
  { id: 'day4', label: 'Day four', note: 'The investigation. Everything Dmitri says is true and all of it sounds like a lie.', books: [9], words: 29835 },
  { id: 'gap', label: 'Two months', note: 'The novel skips them almost entirely. Dmitri is in prison; Ivan is unravelling; Ilusha is dying.', books: [], words: 0, elided: true },
  { id: 'trial', label: 'The trial', note: 'The boys, Ivan’s three visits to Smerdyakov and his nightmare, then two days in court.', books: [10, 11, 12], words: 110412 },
  { id: 'after', label: 'Five days later', note: 'The escape plan, and a funeral.', books: [13], words: 9451 },
];

export const MOMENTS: Moment[] = [
  { id: 'm1', segment: 'before', at: 0, label: 'Three sons, forgotten', detail: 'Fyodor marries twice, loses both wives, and leaves each child to be raised by servants or relatives. He does not think of them again for years.', who: ['fyodor', 'dmitri', 'ivan', 'alyosha'], chapter: 'b01-c02', cite: 'Bk I, ch. 2' },
  { id: 'm2', segment: 'before', at: 1, label: 'A child born in the garden', detail: 'Lizaveta, mute and homeless, climbs the Karamazov fence to give birth and dies. The boy is raised by Grigory as a servant, and named after her.', who: ['smerdyakov', 'fyodor'], chapter: 'b03-c02', cite: 'Bk III, ch. 2' },

  { id: 'm3', segment: 'day1', at: 0, label: 'The gathering at the monastery', detail: 'The family meets in the elder’s cell to settle Dmitri’s inheritance. Fyodor performs as a buffoon; nothing is settled.', who: ['fyodor', 'dmitri', 'ivan', 'alyosha'], chapter: 'b02-c02', cite: 'Bk II, ch. 2' },
  { id: 'm4', segment: 'day1', at: 1, label: 'Zossima bows to the ground', detail: 'The elder kneels before Dmitri and touches his forehead to the floor — a gesture nobody in the room can explain, and which reads afterwards as recognition of suffering to come.', who: ['dmitri', 'alyosha'], chapter: 'b02-c06', cite: 'Bk II, ch. 6', key: true },
  { id: 'm5', segment: 'day1', at: 2, label: 'The confession in the garden', detail: 'Dmitri lays himself out to Alyosha over three chapters: the money, Katerina, Grushenka, and his own vileness, stated as diagnosis rather than excuse.', who: ['dmitri', 'alyosha'], chapter: 'b03-c03', cite: 'Bk III, ch. 3' },
  { id: 'm6', segment: 'day1', at: 3, label: 'Dmitri beats his father', detail: 'He bursts into the house looking for Grushenka, throws the old man down and kicks him, and swears in front of witnesses that he may come back and finish it.', who: ['dmitri', 'fyodor', 'alyosha', 'grushenka'], chapter: 'b03-c09', cite: 'Bk III, ch. 9', key: true },

  { id: 'm7', segment: 'day2', at: 0, label: 'The captain’s beard', detail: 'Alyosha finds the family Dmitri ruined. Snegiryov tramples the money that would save them because his son is watching.', who: ['alyosha'], chapter: 'b04-c06', cite: 'Bk IV, ch. 6' },
  { id: 'm8', segment: 'day2', at: 1, label: 'Rebellion', detail: 'In the tavern Ivan refuses a harmony bought with the suffering of children. He does not deny God; he returns the ticket.', who: ['ivan', 'alyosha'], chapter: 'b05-c04', cite: 'Bk V, ch. 4', key: true },
  { id: 'm9', segment: 'day2', at: 2, label: 'The Grand Inquisitor', detail: 'Ivan’s poem: Christ returns to Seville and the Church arrests him, explaining that people cannot bear the freedom he left them.', who: ['ivan', 'alyosha'], chapter: 'b05-c05', cite: 'Bk V, ch. 5', key: true },
  { id: 'm10', segment: 'day2', at: 3, label: 'Ivan leaves for Tchermashnya', detail: 'Smerdyakov all but tells him what will happen if he goes. He goes anyway, and knows what he has done before the carriage is out of town.', who: ['ivan', 'smerdyakov'], chapter: 'b05-c07', cite: 'Bk V, ch. 7', key: true },
  { id: 'm11', segment: 'day2', at: 4, label: 'Zossima dies', detail: 'The elder gives his last teaching — that each of us is responsible to all men for everything — and dies that night.', who: ['alyosha'], chapter: 'b06-c03', cite: 'Bk VI, ch. 3', key: true },

  { id: 'm12', segment: 'day3', at: 0, label: 'The breath of corruption', detail: 'The body decays quickly and the town treats it as a verdict on the elder’s sanctity. Alyosha’s faith cracks — not in God, but in the justice of the world’s judgment.', who: ['alyosha'], chapter: 'b07-c01', cite: 'Bk VII, ch. 1' },
  { id: 'm13', segment: 'day3', at: 1, chapter: 'b07-c04', cite: 'Bk VII, ch. 4', label: 'Cana of Galilee', detail: 'Dozing at the coffin as the Gospel is read, Alyosha goes out and falls to the earth weeping. He rises settled.', who: ['alyosha', 'grushenka'], key: true },
  { id: 'm14', segment: 'day3', at: 2, label: 'Dmitri hunts the money', detail: 'A whole day spent chasing three thousand roubles — Samsonov, a drunk peasant in a hut, Madame Hohlakov and her gold-mines. He ends with nothing.', who: ['dmitri', 'katerina'], chapter: 'b08-c01', cite: 'Bk VIII, ch. 1' },
  { id: 'm15', segment: 'day3', at: 3, label: 'The night. The pestle. The garden.', detail: 'Dmitri climbs the fence with a brass pestle, looks through the window at his father, and runs. On the wall he strikes down Grigory. Sometime that night Fyodor is killed.', who: ['dmitri', 'fyodor', 'smerdyakov'], chapter: 'b08-c04', cite: 'Bk VIII, ch. 4', key: true },
  { id: 'm16', segment: 'day3', at: 4, label: 'Mokroe', detail: 'Champagne for the village, gypsies, and Grushenka finally saying she loves him — until the police arrive at dawn.', who: ['dmitri', 'grushenka'], chapter: 'b08-c07', cite: 'Bk VIII, ch. 7' },

  { id: 'm17', segment: 'day4', at: 0, label: 'The three ordeals', detail: 'The preliminary investigation. Dmitri tells the truth about everything and is believed about nothing, least of all the amulet.', who: ['dmitri'], chapter: 'b09-c03', cite: 'Bk IX, ch. 3' },
  { id: 'm18', segment: 'day4', at: 1, label: 'Mitya’s great secret', detail: 'He admits the half of Katerina’s money sewn into a rag round his neck for a month — proof he is a thief but not a scoundrel, and the one fact nobody accepts.', who: ['dmitri', 'katerina'], chapter: 'b09-c07', cite: 'Bk IX, ch. 7', key: true },

  { id: 'm19', segment: 'trial', at: 0, label: 'The third visit to Smerdyakov', detail: 'Smerdyakov lays out the money and explains, calmly, that Ivan was the author and he only the instrument.', who: ['ivan', 'smerdyakov'], chapter: 'b11-c08', cite: 'Bk XI, ch. 8', key: true },
  { id: 'm20', segment: 'trial', at: 1, label: 'The devil on the sofa', detail: 'A shabby gentleman repeats Ivan’s own worst thoughts back to him in a genial voice. Brain fever, or the visitor — the novel refuses to settle it.', who: ['ivan'], chapter: 'b11-c09', cite: 'Bk XI, ch. 9', key: true },
  { id: 'm21', segment: 'trial', at: 2, label: 'Katerina’s letter', detail: 'In a fit of jealousy she produces a letter in which Dmitri wrote he would kill his father for the money. It is the single piece of evidence that convicts him.', who: ['katerina', 'dmitri', 'ivan'], chapter: 'b12-c05', cite: 'Bk XII, ch. 5', key: true },
  { id: 'm22', segment: 'trial', at: 3, label: 'The peasants stand firm', detail: 'Twenty years in the Siberian mines, for a murder he did not commit.', who: ['dmitri'], chapter: 'b12-c14', cite: 'Bk XII, ch. 14', key: true },

  { id: 'm23', segment: 'after', at: 0, chapter: 'b13-c03', cite: 'Epilogue, ch. 3', label: 'The speech at the stone', detail: 'Twelve boys, a funeral, and Alyosha telling them that one good memory kept from childhood may be the thing that saves a person.', who: ['alyosha'], key: true },
];

/**
 * A state a character is in for a stretch of the novel.
 *
 * The timeline is columnar: one column per person, time running down, block
 * height proportional to how much of the BOOK that state occupies. Book time
 * rather than story time, because it is the reader's experience of duration —
 * the four days that take two thirds of the novel should look like two thirds.
 *
 * `ends: true` means the column stops there. Two of them do.
 */
export interface Span {
  character: string;
  /** Chapter that establishes this state. Every claim must be checkable. */
  chapter?: string;
  cite?: string;
  /**
   * Where in the final segment the thread stops, 0-1. A death should terminate
   * where the prose puts it, not at the end of whatever band it falls in
   * (review finding R5).
   */
  endFraction?: number;
  /** Segment ids this state covers, in order. */
  segments: string[];
  label: string;
  detail: string;
  /** The character's thread terminates at the end of this span. */
  ends?: boolean;
  /** Load-bearing for the plot. */
  key?: boolean;
}

export const SPANS: Span[] = [
  // Fyodor — the column that stops on the night of the murder.
  { character: 'fyodor', segments: ['before'], label: 'Forgets his sons', detail: 'Two marriages, two dead wives, and three children left to servants and relatives. He does not think of them for years.' },
  { character: 'fyodor', segments: ['day1'], label: 'Performs at the monastery', detail: 'Summoned to settle Dmitri\u2019s inheritance, he plays the buffoon instead, and the meeting settles nothing.' },
  { character: 'fyodor', segments: ['day2'], label: 'Waiting for Grushenka', detail: 'Three thousand roubles in an envelope under his pillow, tied with pink ribbon, and a signal knock agreed with his servant.' },
  { character: 'fyodor', segments: ['day3'], chapter: 'b08-c04', cite: 'Bk VIII, ch. 4', label: 'Killed', detail: 'Sometime in the night of the storm. The column ends here — everything after this point in the novel is about a man who is no longer in it.', ends: true, key: true },

  // Dmitri — the longest thread, and the one on trial.
  { character: 'dmitri', segments: ['before'], label: 'Raised by servants', detail: 'Left behind by a mother who ran, forgotten by a father who did not notice.' },
  { character: 'dmitri', segments: ['day1'], label: 'Demands his inheritance', detail: 'Believes his father is withholding money from his mother\u2019s estate. Asks aloud in front of witnesses why such a man is alive.' },
  { character: 'dmitri', segments: ['day2'], label: 'Torn between two women', detail: 'Engaged to Katerina, whose money he has half spent; ruined by Grushenka, whom his father also wants.' },
  { character: 'dmitri', segments: ['day3'], chapter: 'b08-c01', cite: 'Bk VIII, ch. 1', label: 'Hunting three thousand roubles', detail: 'A whole day of it \u2014 Samsonov, a drunk peasant, gold-mines \u2014 then the garden, the pestle, and Mokroe.', key: true },
  { character: 'dmitri', segments: ['day4'], label: 'The three ordeals', detail: 'Tells the truth about everything and is believed about nothing, least of all the money sewn into a rag round his neck.' },
  { character: 'dmitri', segments: ['gap', 'trial'], label: 'In prison, then on trial', detail: 'Two months awaiting a verdict, then two days in court where his own letter convicts him.' },
  { character: 'dmitri', segments: ['after'], label: 'Twenty years \u2014 or escape', detail: 'Sentenced to the Siberian mines. Whether he accepts the suffering or takes the plan Ivan financed is the question the novel leaves open.' },

  // Ivan — note the gap at day3. That absence is the question of his guilt.
  { character: 'ivan', segments: ['before'], label: 'Educated away', detail: 'Raised elsewhere, on charity, and made himself into an intellectual who owes his family nothing.' },
  { character: 'ivan', segments: ['day1'], label: 'Watching, saying little', detail: 'Present at the monastery and at the scandal, contributing almost nothing except an argument about ecclesiastical courts.' },
  { character: 'ivan', segments: ['day2'], label: 'Rebellion, then he leaves', detail: 'Returns the ticket and tells the Grand Inquisitor. His father and Smerdyakov both press him to go to Tchermashnya, a short trip nearby; Smerdyakov all but spells out what an absence would permit. Ivan refuses it and takes the seven o\u2019clock train to Moscow instead \u2014 further away, and by his own choice. The distinction matters: he did not do what he was asked, and he went anyway.', key: true, chapter: 'b05-c07', cite: 'Bk V, ch. 7' },
  { character: 'ivan', segments: ['day4'], label: 'Returns', detail: 'Comes back to a house with his father dead in it and his brother arrested.' },
  { character: 'ivan', segments: ['gap'], label: 'Three visits to Smerdyakov', detail: 'On the third he is handed the money and told, calmly, that he was the author and Smerdyakov only the instrument.', key: true },
  { character: 'ivan', segments: ['trial', 'after'], label: 'Brain fever', detail: 'A shabby gentleman on his sofa repeats his own worst thoughts back to him. He testifies incoherently and collapses.' },

  // Alyosha — continuous, which is the point of him.
  { character: 'alyosha', segments: ['before'], label: 'A novice', detail: 'Came home to find his mother\u2019s grave and stayed for the monastery instead.' },
  { character: 'alyosha', segments: ['day1'], label: 'Sent between them all', detail: 'Everyone confides in him and nobody is embarrassed by him, which is how he ends up carrying every message in the book.' },
  { character: 'alyosha', segments: ['day2'], label: 'Hears the case against God', detail: 'Takes Ivan\u2019s argument in the tavern, then returns to find Zossima dying.' },
  { character: 'alyosha', segments: ['day3'], label: 'Cana of Galilee', detail: 'The body decays, his faith cracks, and he goes out and falls to the earth weeping. He gets up settled.', key: true },
  { character: 'alyosha', segments: ['day4', 'gap'], label: 'With the boys', detail: 'Ilusha is dying. Alyosha spends the missing two months at a bedside rather than at the case.' },
  { character: 'alyosha', segments: ['trial', 'after'], label: 'The speech at the stone', detail: 'At his brother\u2019s trial, then at a child\u2019s funeral, where the novel chooses to end.', key: true },

  // Smerdyakov — the second column that stops, and it stops before the verdict.
  { character: 'smerdyakov', segments: ['before'], label: 'Born in the garden', detail: 'To Lizaveta, who died doing it. Raised by Grigory as a servant and named after his mother\u2019s nickname.' },
  { character: 'smerdyakov', segments: ['day1'], label: 'In the kitchen', detail: 'Cooking for a household that treats him as furniture, and reading more than any of them notice.' },
  { character: 'smerdyakov', segments: ['day2'], chapter: 'b05-c02', cite: 'Bk V, ch. 2', label: 'Teaches the signal', detail: 'Explains the knocks to Dmitri, and to Ivan explains \u2014 without quite saying it \u2014 what an absence would permit.', key: true },
  { character: 'smerdyakov', segments: ['day3', 'day4'], label: 'The fit, and the night', detail: 'A real illness he can time. The seizure empties the house on precisely the night it needs emptying.', key: true },
  { character: 'smerdyakov', segments: ['gap'], chapter: 'b11-c08', cite: 'Bk XI, ch. 8', label: 'Three interviews', detail: 'Ill, contemptuous, and finally explicit: he did it, and the reasoning was Ivan\u2019s.' },
  { character: 'smerdyakov', segments: ['trial'], label: 'Hangs himself', detail: 'The night before the trial opens. The only witness who could clear Dmitri removes himself before a word of evidence is heard \u2014 so this thread ends at the very start of the trial, not across it.', ends: true, key: true, endFraction: 0.06, chapter: 'b11-c10', cite: 'Bk XI, ch. 10' },

  // Grushenka
  { character: 'grushenka', segments: ['day1'], label: 'Courted by father and son', detail: 'Kept by Samsonov, wanted by Fyodor, and amusing herself with Dmitri \u2014 the arrangement the whole plot turns on.', key: true },
  { character: 'grushenka', segments: ['day3'], label: 'Mokroe', detail: 'Goes to meet the Polish officer who abandoned her five years ago, finds him worthless, and tells Dmitri she loves him as the police arrive.' },
  { character: 'grushenka', segments: ['gap', 'trial', 'after'], label: 'At the prison', detail: 'Visits him, testifies for him, and falls ill after the verdict.' },

  // Katerina
  { character: 'katerina', segments: ['day1'], label: 'Engaged to Dmitri', detail: 'Out of gratitude for a humiliation she has never forgiven, and while in love with his brother.' },
  { character: 'katerina', segments: ['gap'], label: 'Financing the defence', detail: 'Paying for the famous lawyer, and visiting Ivan.' },
  { character: 'katerina', segments: ['trial'], chapter: 'b12-c05', cite: 'Bk XII, ch. 5', label: 'The letter', detail: 'Produces, in a fit of jealousy, the letter in which Dmitri wrote that he would kill his father for the money. It is what convicts him.', key: true, ends: false },
  { character: 'katerina', segments: ['after'], label: 'Asks forgiveness', detail: 'Comes to him after the sentence, and for a moment the lie between them becomes true.' },
];
