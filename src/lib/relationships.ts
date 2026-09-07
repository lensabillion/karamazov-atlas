/**
 * Who these people are to each other.
 *
 * CURATED, not computed. Co-occurrence tells you who shares a chapter; it cannot
 * tell you that Katerina is engaged to one brother and in love with another.
 * That is knowledge about the novel, so it is written down here by hand, with a
 * chapter citation wherever the text establishes it.
 *
 * Positions are hand-placed too. This is an explanatory diagram, not a force
 * simulation: the composition carries meaning. The father sits above his sons;
 * the two women sit below, and the lines crossing between them are the plot.
 */

export type Bond =
  | 'father'
  | 'disputed'
  | 'brother'
  | 'desire'
  | 'betrothed'
  | 'love'
  | 'taught'
  | 'killed'
  | 'raised'
  | 'guides'
  | 'befriends';

export interface Person {
  id: string;
  name: string;
  /** One line: who this person is, for someone who has lost the thread. */
  who: string;
  group: 'family' | 'women' | 'monastery' | 'boys' | 'town' | 'court';
  x: number;
  y: number;
}

export interface Tie {
  from: string;
  to: string;
  bond: Bond;
  /** Verb phrase drawn on the line. */
  label: string;
  cite?: string;
  /** Ties that carry the plot, drawn heavier. */
  key?: boolean;
}

export const W = 1000;
export const H = 660;

export const PEOPLE: Person[] = [
  {
    id: 'fyodor', name: 'Fyodor Pavlovitch', group: 'family', x: 500, y: 62,
    who: 'The father. A buffoon and a sensualist who forgot his children entirely, then competed with his eldest son for the same woman. Murdered in his own house.',
  },
  {
    id: 'dmitri', name: 'Dmitri — “Mitya”', group: 'family', x: 190, y: 250,
    who: 'The eldest son, by the first marriage. An ex-officer: reckless, generous, loud. Owed money by his father, engaged to Katerina, ruined by Grushenka. Convicted of the murder he did not commit.',
  },
  {
    id: 'ivan', name: 'Ivan', group: 'family', x: 400, y: 250,
    who: 'The second son. A cold intellectual who argues that without God everything is permitted — and then meets a man who acted on it.',
  },
  {
    id: 'alyosha', name: 'Alexey — “Alyosha”', group: 'family', x: 610, y: 250,
    who: 'The youngest son, a novice at the monastery, and the one the narrator calls his hero. Everyone confides in him.',
  },
  {
    id: 'smerdyakov', name: 'Smerdyakov', group: 'family', x: 830, y: 250,
    who: 'The household’s servant and cook, epileptic and contemptuous. The town assumes he is Fyodor’s fourth son. He listened to Ivan more carefully than Ivan did.',
  },
  {
    id: 'grushenka', name: 'Grushenka', group: 'women', x: 150, y: 470,
    who: 'Agrafena Alexandrovna. Kept by a merchant since she was seventeen, abandoned by a Polish officer before that. Courted by father and son at once — which is what sets the murder in motion.',
  },
  {
    id: 'katerina', name: 'Katerina Ivanovna', group: 'women', x: 380, y: 470,
    who: 'Proud and rich. Engaged to Dmitri out of gratitude for a humiliation she never forgave, while in love with Ivan. Her letter destroys Dmitri at the trial.',
  },
  {
    id: 'lise', name: 'Lise Hohlakov', group: 'women', x: 610, y: 560,
    who: 'Madame Hohlakov’s daughter. Fourteen, an invalid, engaged to Alyosha — and privately telling him she dreams of destruction.',
  },
  {
    id: 'zossima', name: 'Father Zossima', group: 'monastery', x: 700, y: 100,
    who: 'The elder at the monastery and Alyosha’s teacher. His answer to Ivan is that every one of us is responsible to all men for everything. He sends Alyosha out into the world.',
  },
  {
    id: 'ilusha', name: 'Ilusha', group: 'boys', x: 830, y: 470,
    who: 'A schoolboy who bit Alyosha’s finger because his father had been humiliated in the street. He dies at nine, and the novel ends at his funeral.',
  },
  {
    id: 'kolya', name: 'Kolya Krassotkin', group: 'boys', x: 930, y: 560,
    who: 'Thirteen, brilliant and insufferable, repeating borrowed nihilism he only half understands — an Ivan who can still be reached.',
  },
  {
    id: 'grigory', name: 'Grigory', group: 'town', x: 880, y: 110,
    who: 'The old servant who actually raised the sons. He takes a blow to the head on the night of the murder, and his testimony about an open door convicts Dmitri.',
  },
];

export const TIES: Tie[] = [
  { from: 'fyodor', to: 'dmitri', bond: 'father', label: 'father' },
  { from: 'fyodor', to: 'ivan', bond: 'father', label: 'father' },
  { from: 'fyodor', to: 'alyosha', bond: 'father', label: 'father' },
  { from: 'fyodor', to: 'smerdyakov', bond: 'disputed', label: 'father?', cite: 'Bk V, ch. 2' },

  { from: 'fyodor', to: 'grushenka', bond: 'desire', label: 'wants', key: true },
  { from: 'dmitri', to: 'grushenka', bond: 'desire', label: 'wants', key: true, cite: 'Bk III, ch. 10' },
  { from: 'dmitri', to: 'katerina', bond: 'betrothed', label: 'engaged to', cite: 'Bk III, ch. 4' },
  { from: 'katerina', to: 'ivan', bond: 'love', label: 'loves', key: true },

  { from: 'ivan', to: 'smerdyakov', bond: 'taught', label: 'taught', key: true, cite: 'Bk XI, ch. 8' },
  { from: 'smerdyakov', to: 'fyodor', bond: 'killed', label: 'killed', key: true, cite: 'Bk XI, ch. 8' },

  { from: 'zossima', to: 'alyosha', bond: 'guides', label: 'elder to' },
  { from: 'grigory', to: 'smerdyakov', bond: 'raised', label: 'raised' },
  { from: 'alyosha', to: 'lise', bond: 'betrothed', label: 'engaged to' },
  { from: 'alyosha', to: 'ilusha', bond: 'befriends', label: 'befriends' },
  { from: 'ilusha', to: 'kolya', bond: 'befriends', label: 'friend' },
];

/** How each kind of bond is drawn. Line style carries type; nothing relies on hue. */
export const BOND_STYLE: Record<Bond, { dash?: string; width: number }> = {
  father: { width: 1.5 },
  disputed: { width: 1.5, dash: '4 4' },
  brother: { width: 1 },
  desire: { width: 2.5 },
  betrothed: { width: 1.5, dash: '7 3' },
  love: { width: 2 },
  taught: { width: 2, dash: '2 3' },
  killed: { width: 2.5 },
  raised: { width: 1 },
  guides: { width: 1.5 },
  befriends: { width: 1 },
};
