/**
 * Who these people are to each other.
 *
 * CURATED, not computed. Co-occurrence tells you who shares a chapter; it cannot
 * tell you that Katerina is engaged to one brother and in love with another, or
 * that the boy who bites Alyosha's finger is the son of a man Dmitri humiliated.
 * That is knowledge about the novel, written down by hand, with a chapter
 * citation wherever the text establishes it.
 *
 * Positions are hand-placed. This is an explanatory diagram, not a force
 * simulation: the composition carries meaning. The three women who bore
 * Fyodor's children sit along the top, the four sons beneath them, and the ties
 * that cross the middle are the plot.
 */

export type Bond =
  | 'father' | 'disputed' | 'mother' | 'married'
  | 'desire' | 'betrothed' | 'love' | 'keeps' | 'kin'
  | 'taught' | 'killed' | 'raised' | 'serves' | 'guides' | 'rival'
  | 'befriends' | 'humiliated' | 'court';

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
  label: string;
  cite?: string;
  /** Ties the murder runs along, drawn heavier. */
  key?: boolean;
}

export const W = 1240;
export const H = 900;

/** Faint zone labels, so the eye can find a neighbourhood before a name. */
export const ZONES: { label: string; x: number; y: number }[] = [
  { label: 'The household', x: 430, y: 32 },
  { label: 'The women', x: 200, y: 640 },
  { label: 'The monastery', x: 1080, y: 420 },
  { label: 'The boys', x: 910, y: 655 },
  { label: 'The court', x: 300, y: 890 },
];

export const PEOPLE: Person[] = [
  // ---- the three women who bore Fyodor's children ----
  { id: 'adelaida', name: 'Adelaïda', group: 'women', x: 120, y: 80,
    who: 'Fyodor’s first wife. She ran away and died in poverty, leaving Dmitri behind — a child his father then forgot about entirely.' },
  { id: 'sofya', name: 'Sofya', group: 'women', x: 430, y: 80,
    who: 'Fyodor’s second wife, a frightened orphan girl the household called “the crazy woman”. Mother of Ivan and Alyosha. She died young.' },
  { id: 'lizaveta', name: 'Lizaveta', group: 'town', x: 800, y: 80,
    who: 'Lizaveta Smerdyastchaya — a mute, homeless girl of the town. She climbed into the Karamazov garden to give birth and died doing it. Smerdyakov takes his name from her.' },

  { id: 'fyodor', name: 'Fyodor Pavlovitch', group: 'family', x: 430, y: 190,
    who: 'The father. A buffoon and a sensualist who forgot his children entirely, then competed with his eldest son for the same woman. Murdered in his own house.' },

  // ---- the four sons ----
  { id: 'dmitri', name: 'Dmitri — “Mitya”', group: 'family', x: 150, y: 330,
    who: 'The eldest, by Adelaïda. An ex-officer: reckless, generous, loud. Owed money by his father, engaged to Katerina, ruined by Grushenka. Convicted of a murder he did not commit.' },
  { id: 'ivan', name: 'Ivan', group: 'family', x: 370, y: 330,
    who: 'The second son, by Sofya. A cold intellectual who argues that without God everything is permitted — then meets a man who acted on it.' },
  { id: 'alyosha', name: 'Alexey — “Alyosha”', group: 'family', x: 590, y: 330,
    who: 'The youngest, by Sofya. A novice at the monastery and the one the narrator calls his hero. Everyone confides in him.' },
  { id: 'smerdyakov', name: 'Smerdyakov', group: 'family', x: 800, y: 330,
    who: 'The household’s cook, epileptic and contemptuous. Born to Lizaveta in the garden; the town assumes Fyodor is the father. He listened to Ivan more carefully than Ivan did.' },

  // ---- the women of the plot ----
  { id: 'grushenka', name: 'Grushenka', group: 'women', x: 110, y: 580,
    who: 'Agrafena Alexandrovna. Kept by the merchant Samsonov since she was seventeen. Courted by father and son at once — which is what sets the murder in motion.' },
  { id: 'katerina', name: 'Katerina Ivanovna', group: 'women', x: 330, y: 580,
    who: 'Proud and rich. Engaged to Dmitri out of gratitude for a humiliation she never forgave, while in love with Ivan. Her letter destroys Dmitri at the trial.' },
  { id: 'samsonov', name: 'Samsonov', group: 'town', x: 60, y: 700,
    who: 'The old merchant who keeps Grushenka. Dying, and amused enough by Dmitri’s desperation to send him on a wild errand.' },
  { id: 'rakitin', name: 'Rakitin', group: 'monastery', x: 250, y: 700,
    who: 'A seminarist on the make and Grushenka’s relative. Explains everyone by their motives, sells Alyosha’s grief for twenty-five roubles, and turns up at the trial with a theory.' },

  { id: 'hohlakov', name: 'Madame Hohlakov', group: 'women', x: 570, y: 700,
    who: 'A wealthy widow of enthusiasms, comic and useless. Lise’s mother — and the one who sends Dmitri chasing gold-mines when he needs three thousand roubles.' },
  { id: 'lise', name: 'Lise', group: 'women', x: 570, y: 580,
    who: 'Madame Hohlakov’s daughter. Fourteen, an invalid, engaged to Alyosha — and privately telling him she dreams of destruction.' },

  // ---- the monastery ----
  { id: 'zossima', name: 'Father Zossima', group: 'monastery', x: 1010, y: 250,
    who: 'The elder, and Alyosha’s teacher. His answer to Ivan is that every one of us is responsible to all men for everything. He sends Alyosha out into the world.' },
  { id: 'ferapont', name: 'Father Ferapont', group: 'monastery', x: 1160, y: 330,
    who: 'The rival ascetic — fasting, visions, and hostility to the elders. Piety as spite, set beside Zossima’s piety as love.' },

  // ---- the servants ----
  { id: 'grigory', name: 'Grigory', group: 'town', x: 960, y: 80,
    who: 'Fyodor’s servant for decades, and the man who actually raised the sons. He takes a pestle blow to the head on the night of the murder, and his testimony about an open door convicts Dmitri.' },
  { id: 'marfa', name: 'Marfa', group: 'town', x: 1120, y: 130,
    who: 'Grigory’s wife, and the other half of the household that brought up the boys their father ignored.' },

  // ---- the boys ----
  { id: 'ilusha', name: 'Ilusha', group: 'boys', x: 800, y: 700,
    who: 'A schoolboy who bit Alyosha’s finger because his father had been dragged through the street by the beard. He dies at nine, and the novel ends at his funeral.' },
  { id: 'snegiryov', name: 'Captain Snegiryov', group: 'boys', x: 800, y: 820,
    who: 'Ilusha’s father. Destitute, and humiliated in front of his son by Dmitri. He tramples the money that would save his family because his boy is watching.' },
  { id: 'kolya', name: 'Kolya Krassotkin', group: 'boys', x: 1020, y: 700,
    who: 'Thirteen, brilliant and insufferable, repeating borrowed nihilism he half understands — an Ivan who can still be reached.' },
  { id: 'smurov', name: 'Smurov', group: 'boys', x: 1020, y: 820,
    who: 'One of Ilusha’s schoolfellows, and the boy who brings Alyosha to the others.' },

  // ---- the court ----
  { id: 'prosecutor', name: 'Ippolit Kirillovitch', group: 'court', x: 180, y: 850,
    who: 'The prosecutor, consumptive and giving the speech of his life. His psychology of Dmitri is flawless, and wrong.' },
  { id: 'fetyukovitch', name: 'Fetyukovitch', group: 'court', x: 410, y: 850,
    who: 'The celebrated defence counsel from Petersburg. He dismantles every piece of evidence — and loses.' },
];

export const TIES: Tie[] = [
  // marriages and parentage
  { from: 'adelaida', to: 'fyodor', bond: 'married', label: 'first wife' },
  { from: 'sofya', to: 'fyodor', bond: 'married', label: 'second wife' },
  { from: 'adelaida', to: 'dmitri', bond: 'mother', label: 'mother' },
  { from: 'sofya', to: 'ivan', bond: 'mother', label: 'mother' },
  { from: 'sofya', to: 'alyosha', bond: 'mother', label: 'mother' },
  { from: 'lizaveta', to: 'smerdyakov', bond: 'mother', label: 'mother', cite: 'Bk III, ch. 2' },

  { from: 'fyodor', to: 'dmitri', bond: 'father', label: 'father' },
  { from: 'fyodor', to: 'ivan', bond: 'father', label: 'father' },
  { from: 'fyodor', to: 'alyosha', bond: 'father', label: 'father' },
  { from: 'fyodor', to: 'smerdyakov', bond: 'disputed', label: 'father?', cite: 'Bk V, ch. 2' },

  // the rivalry that becomes the motive
  { from: 'fyodor', to: 'grushenka', bond: 'desire', label: 'wants', key: true },
  { from: 'dmitri', to: 'grushenka', bond: 'desire', label: 'wants', key: true, cite: 'Bk III, ch. 10' },
  { from: 'samsonov', to: 'grushenka', bond: 'keeps', label: 'keeps' },
  { from: 'rakitin', to: 'grushenka', bond: 'kin', label: 'cousin of' },

  { from: 'dmitri', to: 'katerina', bond: 'betrothed', label: 'engaged to', cite: 'Bk III, ch. 4' },
  { from: 'katerina', to: 'ivan', bond: 'love', label: 'loves', key: true },

  // the crime
  { from: 'ivan', to: 'smerdyakov', bond: 'taught', label: 'taught', key: true, cite: 'Bk XI, ch. 8' },
  { from: 'smerdyakov', to: 'fyodor', bond: 'killed', label: 'killed', key: true, cite: 'Bk XI, ch. 8' },
  { from: 'dmitri', to: 'grigory', bond: 'humiliated', label: 'struck', cite: 'Bk VIII, ch. 4' },

  // the household that raised them
  { from: 'grigory', to: 'fyodor', bond: 'serves', label: 'servant to' },
  { from: 'grigory', to: 'marfa', bond: 'married', label: 'married to' },
  { from: 'grigory', to: 'smerdyakov', bond: 'raised', label: 'raised' },
  { from: 'grigory', to: 'alyosha', bond: 'raised', label: 'raised' },

  // the monastery
  { from: 'zossima', to: 'alyosha', bond: 'guides', label: 'elder to' },
  { from: 'ferapont', to: 'zossima', bond: 'rival', label: 'rival to' },
  { from: 'rakitin', to: 'alyosha', bond: 'befriends', label: 'shadows' },

  // the Hohlakovs
  { from: 'hohlakov', to: 'lise', bond: 'mother', label: 'mother' },
  { from: 'alyosha', to: 'lise', bond: 'betrothed', label: 'engaged to' },

  // the boys
  { from: 'snegiryov', to: 'ilusha', bond: 'father', label: 'father' },
  { from: 'dmitri', to: 'snegiryov', bond: 'humiliated', label: 'humiliated', key: true, cite: 'Bk IV, ch. 6' },
  { from: 'alyosha', to: 'ilusha', bond: 'befriends', label: 'befriends' },
  { from: 'kolya', to: 'ilusha', bond: 'befriends', label: 'friend' },
  { from: 'smurov', to: 'ilusha', bond: 'befriends', label: 'friend' },
  { from: 'alyosha', to: 'kolya', bond: 'befriends', label: 'befriends' },

  // the trial
  { from: 'prosecutor', to: 'dmitri', bond: 'court', label: 'prosecutes' },
  { from: 'fetyukovitch', to: 'dmitri', bond: 'court', label: 'defends' },
];

/** Line style carries the kind of bond, so nothing depends on hue alone. */
export const BOND_STYLE: Record<Bond, { dash?: string; width: number }> = {
  father: { width: 1.5 },
  disputed: { width: 1.5, dash: '4 4' },
  mother: { width: 1.5, dash: '1 3' },
  married: { width: 1.5 },
  desire: { width: 2.5 },
  betrothed: { width: 1.5, dash: '7 3' },
  love: { width: 2 },
  keeps: { width: 1, dash: '6 4' },
  kin: { width: 1, dash: '1 3' },
  taught: { width: 2, dash: '2 3' },
  killed: { width: 2.5 },
  raised: { width: 1 },
  serves: { width: 1 },
  guides: { width: 1.5 },
  rival: { width: 1, dash: '5 5' },
  befriends: { width: 1 },
  humiliated: { width: 1.5, dash: '3 3' },
  court: { width: 1, dash: '2 4' },
};
