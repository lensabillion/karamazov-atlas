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
  { id: 'm13', segment: 'day3', at: 1, label: 'Cana of Galilee', detail: 'Dozing at the coffin as the Gospel is read, Alyosha goes out and falls to the earth weeping. He rises settled.', who: ['alyosha', 'grushenka'], chapter: 'b07-c04', cite: 'Bk VII, ch. 4', key: true },
  { id: 'm14', segment: 'day3', at: 2, label: 'Dmitri hunts the money', detail: 'A whole day spent chasing three thousand roubles — Samsonov, a drunk peasant in a hut, Madame Hohlakov and her gold-mines. He ends with nothing.', who: ['dmitri', 'katerina'], chapter: 'b08-c01', cite: 'Bk VIII, ch. 1' },
  { id: 'm15', segment: 'day3', at: 3, label: 'The night. The pestle. The garden.', detail: 'Dmitri climbs the fence with a brass pestle, looks through the window at his father, and runs. On the wall he strikes down Grigory. Sometime that night Fyodor is killed.', who: ['dmitri', 'fyodor', 'smerdyakov'], chapter: 'b08-c04', cite: 'Bk VIII, ch. 4', key: true },
  { id: 'm16', segment: 'day3', at: 4, label: 'Mokroe', detail: 'Champagne for the village, gypsies, and Grushenka finally saying she loves him — until the police arrive at dawn.', who: ['dmitri', 'grushenka'], chapter: 'b08-c07', cite: 'Bk VIII, ch. 7' },

  { id: 'm17', segment: 'day4', at: 0, label: 'The three ordeals', detail: 'The preliminary investigation. Dmitri tells the truth about everything and is believed about nothing, least of all the amulet.', who: ['dmitri'], chapter: 'b09-c03', cite: 'Bk IX, ch. 3' },
  { id: 'm18', segment: 'day4', at: 1, label: 'Mitya’s great secret', detail: 'He admits the half of Katerina’s money sewn into a rag round his neck for a month — proof he is a thief but not a scoundrel, and the one fact nobody accepts.', who: ['dmitri', 'katerina'], chapter: 'b09-c07', cite: 'Bk IX, ch. 7', key: true },

  { id: 'm19', segment: 'trial', at: 0, label: 'The third visit to Smerdyakov', detail: 'Smerdyakov lays out the money and explains, calmly, that Ivan was the author and he only the instrument.', who: ['ivan', 'smerdyakov'], chapter: 'b11-c08', cite: 'Bk XI, ch. 8', key: true },
  { id: 'm20', segment: 'trial', at: 1, label: 'The devil on the sofa', detail: 'A shabby gentleman repeats Ivan’s own worst thoughts back to him in a genial voice. Brain fever, or the visitor — the novel refuses to settle it.', who: ['ivan'], chapter: 'b11-c09', cite: 'Bk XI, ch. 9', key: true },
  { id: 'm21', segment: 'trial', at: 2, label: 'Katerina’s letter', detail: 'In a fit of jealousy she produces a letter in which Dmitri wrote he would kill his father for the money. It is the single piece of evidence that convicts him.', who: ['katerina', 'dmitri', 'ivan'], chapter: 'b12-c05', cite: 'Bk XII, ch. 5', key: true },
  { id: 'm22', segment: 'trial', at: 3, label: 'The peasants stand firm', detail: 'Twenty years in the Siberian mines, for a murder he did not commit.', who: ['dmitri'], chapter: 'b12-c14', cite: 'Bk XII, ch. 14', key: true },

  { id: 'm23', segment: 'after', at: 0, label: 'The speech at the stone', detail: 'Twelve boys, a funeral, and Alyosha telling them that one good memory kept from childhood may be the thing that saves a person.', who: ['alyosha'], chapter: 'b13-c03', cite: 'Epilogue, ch. 3', key: true },
];
