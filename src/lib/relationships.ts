/**
 * Who these people are to each other.
 *
 * CURATED, not computed. Co-occurrence tells you who shares a chapter; it cannot
 * tell you that Katerina is engaged to one brother and in love with another, or
 * that the boy who bites Alyosha's finger is the son of a man Dmitri humiliated.
 * That is knowledge about the novel, written down by hand, and every person and
 * every tie carries the chapter where the text establishes it (review finding
 * R8): a reader must be able to reach the passage behind any line on the map.
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

/**
 * How a claim stands in the text. The map mixes three kinds of statement and
 * must not let them pass for one another:
 *
 *   fact    — the narrator states it or the scene shows it
 *   said    — a character asserts it; true in the novel's world only as far as
 *             that character is believed
 *   reading — an interpretation offered by this atlas, not a statement in the text
 */
export type Basis = 'fact' | 'said' | 'reading';

export interface Person {
  id: string;
  name: string;
  /** One line: who this person is, for someone who has lost the thread. Full-book. */
  who: string;
  /** Who they are when the reader first meets them. Safe to show at `chapter`. */
  intro: string;
  /** Chapter id where the reader meets them. */
  chapter: string;
  group: 'family' | 'women' | 'monastery' | 'boys' | 'town' | 'court';
  x: number;
  y: number;
}

export interface Tie {
  from: string;
  to: string;
  bond: Bond;
  label: string;
  /** Chapter id where the text establishes this tie. Required: every line is checkable. */
  chapter: string;
  /** A verbatim phrase from that chapter, so the link can land on the sentence. */
  quote?: string;
  /** Defaults to 'fact'. */
  basis?: Basis;
  /** Qualifies a 'said' or 'reading' tie: who says it, or what is uncertain. */
  note?: string;
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
  { id: 'adelaida', name: 'Adelaïda', group: 'women', x: 120, y: 80, chapter: 'b01-c01',
    intro: 'Fyodor’s first wife, from a rich and distinguished family. She eloped with him, then ran away from him, leaving their three-year-old son behind.',
    who: 'Fyodor’s first wife. She ran away and died in poverty, leaving Dmitri behind — a child his father then forgot about entirely.' },
  { id: 'sofya', name: 'Sofya', group: 'women', x: 430, y: 80, chapter: 'b01-c03',
    intro: 'Fyodor’s second wife, an orphan kept in terror since childhood, who fell ill with fits of hysterics. Mother of Ivan and Alyosha; she died when Alyosha was three.',
    who: 'Fyodor’s second wife, an orphan kept in terror since childhood and broken by fits of hysterics in his house. Mother of Ivan and Alyosha. She died young.' },
  { id: 'lizaveta', name: 'Lizaveta', group: 'town', x: 800, y: 80, chapter: 'b03-c02',
    intro: 'Lizaveta Smerdyastchaya — a mute, homeless girl of the town who slept wherever she lay down. She climbed into the Karamazov garden to give birth and died there.',
    who: 'Lizaveta Smerdyastchaya — a mute, homeless girl of the town. She climbed into the Karamazov garden to give birth and died doing it. Smerdyakov takes his name from her.' },

  { id: 'fyodor', name: 'Fyodor Pavlovitch', group: 'family', x: 430, y: 190, chapter: 'b01-c01',
    intro: 'The father. A landowner, buffoon and sensualist who made money, married twice, and forgot all three of his sons.',
    who: 'The father. A buffoon and a sensualist who forgot his children entirely, then competed with his eldest son for the same woman. Murdered in his own house.' },

  // ---- the four sons ----
  { id: 'dmitri', name: 'Dmitri — “Mitya”', group: 'family', x: 150, y: 330, chapter: 'b01-c02',
    intro: 'The eldest son, by the first wife. Passed from relative to relative, now an ex-officer who believes his father owes him his mother’s money.',
    who: 'The eldest, by Adelaïda. An ex-officer: reckless, generous, loud. Owed money by his father, engaged to Katerina, ruined by Grushenka. Convicted of a murder he did not commit.' },
  { id: 'ivan', name: 'Ivan', group: 'family', x: 370, y: 330, chapter: 'b01-c03',
    intro: 'The second son, by Sofya. Raised on charity, a gifted writer and a sceptic; nobody can quite explain why he has come to stay with his father.',
    who: 'The second son, by Sofya. A cold intellectual who argues that without God everything is permitted — then meets a man who acted on it.' },
  { id: 'alyosha', name: 'Alexey — “Alyosha”', group: 'family', x: 590, y: 330, chapter: 'b01-c04',
    intro: 'The youngest son, by Sofya, and the narrator’s declared hero. A novice at the monastery whom everybody trusts.',
    who: 'The youngest, by Sofya. A novice at the monastery and the one the narrator calls his hero. Everyone confides in him.' },
  { id: 'smerdyakov', name: 'Smerdyakov', group: 'family', x: 800, y: 330, chapter: 'b03-c06',
    intro: 'The household’s cook, raised by Grigory and trained in Moscow. Silent, fastidious about his clothes, contemptuous — and subject to fits.',
    who: 'The household’s cook, epileptic and contemptuous. Born to Lizaveta in the garden; the town assumes Fyodor is the father. He listened to Ivan more carefully than Ivan did.' },

  // ---- the women of the plot ----
  { id: 'grushenka', name: 'Grushenka', group: 'women', x: 110, y: 580, chapter: 'b03-c05',
    intro: 'Agrafena Alexandrovna. Kept for years by an old merchant, and the woman both Dmitri and his father are pursuing.',
    who: 'Agrafena Alexandrovna. Brought to town by the merchant Samsonov at eighteen and kept by him since. Courted by father and son at once — which is what sets the murder in motion.' },
  { id: 'katerina', name: 'Katerina Ivanovna', group: 'women', x: 330, y: 580, chapter: 'b03-c04',
    intro: 'A proud colonel’s daughter. Dmitri tells how he once saved her family’s honour in a way that humiliated her; she became his fiancée.',
    who: 'Proud and rich. Engaged to Dmitri out of gratitude for a humiliation she never forgave, while in love with Ivan. Her letter destroys Dmitri at the trial.' },
  { id: 'samsonov', name: 'Samsonov', group: 'town', x: 60, y: 700, chapter: 'b07-c03',
    intro: 'An old, rich, ailing merchant who has been Grushenka’s protector for years.',
    who: 'The old merchant who keeps Grushenka. Dying, and amused enough by Dmitri’s desperation to send him on a wild errand.' },
  { id: 'rakitin', name: 'Rakitin', group: 'monastery', x: 250, y: 700, chapter: 'b02-c07',
    intro: 'A seminarist and Alyosha’s friend — clever, ambitious, and quick to explain everyone by their lowest motive.',
    who: 'A seminarist on the make and Grushenka’s cousin. Explains everyone by their motives, takes twenty-five roubles to bring the grieving Alyosha to her, and turns up at the trial with a theory.' },

  { id: 'hohlakov', name: 'Madame Hohlakov', group: 'women', x: 570, y: 700, chapter: 'b02-c03',
    intro: 'A rich, excitable widow who has brought her invalid daughter to see the elder.',
    who: 'A wealthy widow of enthusiasms, comic and useless. Lise’s mother — and the one who sends Dmitri chasing gold-mines when he needs three thousand roubles.' },
  { id: 'lise', name: 'Lise', group: 'women', x: 570, y: 580, chapter: 'b02-c03',
    intro: 'Madame Hohlakov’s daughter, fourteen and unable to walk — quick, mischievous, and fond of Alyosha.',
    who: 'Madame Hohlakov’s daughter. Fourteen, an invalid, engaged to Alyosha — and privately telling him she dreams of destruction.' },

  // ---- the monastery ----
  { id: 'zossima', name: 'Father Zossima', group: 'monastery', x: 1010, y: 250, chapter: 'b01-c05',
    intro: 'The elder of the monastery, sought out by crowds for his counsel. Alyosha’s teacher.',
    who: 'The elder, and Alyosha’s teacher. His answer to Ivan is that every one of us is responsible to all men for everything. He sends Alyosha out into the world.' },
  { id: 'ferapont', name: 'Father Ferapont', group: 'monastery', x: 1160, y: 330, chapter: 'b04-c01',
    intro: 'An old ascetic monk — fasting, silence, visions of devils — and an open enemy of the elders.',
    who: 'The rival ascetic — fasting, visions, and hostility to the elders. Piety as spite, set beside Zossima’s piety as love.' },

  // ---- the servants ----
  { id: 'grigory', name: 'Grigory', group: 'town', x: 960, y: 80, chapter: 'b01-c02',
    intro: 'Fyodor’s old servant — gloomy, obstinate and honest — who looked after each of the boys when their father would not.',
    who: 'Fyodor’s servant for decades, and the man who actually raised the sons. He is struck down with a pestle on the night of the murder, and his evidence that the garden door stood open is the most damning at the trial.' },
  { id: 'marfa', name: 'Marfa', group: 'town', x: 1120, y: 130, chapter: 'b03-c01',
    intro: 'Grigory’s wife, and the other half of the household that brought up the boys their father ignored.',
    who: 'Grigory’s wife, and the other half of the household that brought up the boys their father ignored.' },

  // ---- the boys ----
  { id: 'ilusha', name: 'Ilusha', group: 'boys', x: 800, y: 700, chapter: 'b04-c03',
    intro: 'A small, sick schoolboy of about nine who fights a whole gang of boys alone — and bites Alyosha’s finger.',
    who: 'A schoolboy who bit Alyosha’s finger because his father had been dragged through the street by the beard. He dies at nine, and the novel ends at his funeral.' },
  { id: 'snegiryov', name: 'Captain Snegiryov', group: 'boys', x: 800, y: 820, chapter: 'b04-c06',
    intro: 'Ilusha’s father, a destitute former captain who plays the buffoon to cover his shame.',
    who: 'Ilusha’s father. Destitute, and humiliated in front of his son by Dmitri. He tramples the money that would save his family because his boy is watching.' },
  { id: 'kolya', name: 'Kolya Krassotkin', group: 'boys', x: 1020, y: 700, chapter: 'b10-c01',
    intro: 'A widow’s only son, the boldest boy in his class, and the terror of his mother’s nerves.',
    who: 'Thirteen — “fourteen in a fortnight”, he insists — brilliant and insufferable, repeating borrowed nihilism he half understands. An Ivan who can still be reached.' },
  { id: 'smurov', name: 'Smurov', group: 'boys', x: 1020, y: 820, chapter: 'b04-c03',
    intro: 'One of the schoolboys throwing stones at Ilusha.',
    who: 'One of the boys who stoned Ilusha, and the one who told Alyosha about him. Later Kolya’s devoted go-between.' },

  // ---- the court ----
  { id: 'prosecutor', name: 'Ippolit Kirillovitch', group: 'court', x: 180, y: 850, chapter: 'b09-c02',
    intro: 'The town’s deputy prosecutor, called from a game of whist on the night of the alarm.',
    who: 'The prosecutor, consumptive and giving the speech of his life. His psychology of Dmitri is persuasive, and wrong.' },
  { id: 'fetyukovitch', name: 'Fetyukovitch', group: 'court', x: 410, y: 850, chapter: 'b12-c01',
    intro: 'The celebrated defence lawyer, brought from Petersburg for the trial.',
    who: 'The celebrated defence counsel from Petersburg. He dismantles the evidence piece by piece — and loses.' },
];

export const TIES: Tie[] = [
  // marriages and parentage
  { from: 'adelaida', to: 'fyodor', bond: 'married', label: 'first wife', chapter: 'b01-c01' },
  { from: 'sofya', to: 'fyodor', bond: 'married', label: 'second wife', chapter: 'b01-c03' },
  { from: 'adelaida', to: 'dmitri', bond: 'mother', label: 'mother', chapter: 'b01-c01' },
  { from: 'sofya', to: 'ivan', bond: 'mother', label: 'mother', chapter: 'b01-c03' },
  { from: 'sofya', to: 'alyosha', bond: 'mother', label: 'mother', chapter: 'b01-c03' },
  { from: 'lizaveta', to: 'smerdyakov', bond: 'mother', label: 'mother', chapter: 'b03-c02',
    quote: 'They saved the baby, but Lizaveta died at dawn' },

  { from: 'fyodor', to: 'dmitri', bond: 'father', label: 'father', chapter: 'b01-c01' },
  { from: 'fyodor', to: 'ivan', bond: 'father', label: 'father', chapter: 'b01-c03' },
  { from: 'fyodor', to: 'alyosha', bond: 'father', label: 'father', chapter: 'b01-c03' },
  { from: 'fyodor', to: 'smerdyakov', bond: 'disputed', label: 'father?', chapter: 'b03-c02', basis: 'said',
    quote: 'rumor pointed straight at Fyodor',
    note: 'The town’s rumour. The narrator reports it and never settles it.' },

  // the rivalry that becomes the motive
  { from: 'fyodor', to: 'grushenka', bond: 'desire', label: 'wants', key: true, chapter: 'b03-c05',
    quote: 'That’s what the old man wants, so that Grushenka can come while he’s away' },
  { from: 'dmitri', to: 'grushenka', bond: 'desire', label: 'wants', key: true, chapter: 'b03-c05',
    quote: 'I went in the first place to beat her' },
  { from: 'samsonov', to: 'grushenka', bond: 'keeps', label: 'keeps', chapter: 'b07-c03',
    quote: 'the merchant Samsonov, who was known to be the girl’s protector' },
  { from: 'rakitin', to: 'grushenka', bond: 'kin', label: 'cousin of', chapter: 'b12-c04', basis: 'said',
    quote: 'Why, he is my cousin',
    note: 'Grushenka says so in court; Rakitin had kept it quiet.' },

  { from: 'dmitri', to: 'katerina', bond: 'betrothed', label: 'engaged to', chapter: 'b03-c05',
    quote: 'We weren’t betrothed at once, not for three months after that adventure' },
  { from: 'katerina', to: 'ivan', bond: 'love', label: 'loves', key: true, chapter: 'b04-c05', basis: 'said',
    quote: 'you’re torturing Ivan, simply because you love him',
    note: 'Alyosha tells her so to her face; the rest of the novel bears him out.' },

  // the crime
  { from: 'ivan', to: 'smerdyakov', bond: 'taught', label: 'taught', key: true, chapter: 'b11-c08', basis: 'said',
    quote: 'I was only your instrument, your faithful servant, and it was following your words I did it',
    note: 'Smerdyakov’s account, given to Ivan alone: the idea was Ivan’s.' },
  { from: 'smerdyakov', to: 'fyodor', bond: 'killed', label: 'killed', key: true, chapter: 'b11-c08', basis: 'said',
    quote: 'It was only with you, with your help, I killed him, and Dmitri Fyodorovitch is quite innocent',
    note: 'Smerdyakov’s confession to Ivan. No one else hears it, and he hangs himself before the trial.' },
  { from: 'dmitri', to: 'grigory', bond: 'humiliated', label: 'struck', chapter: 'b08-c04',
    quote: 'In Mitya’s hands was a brass pestle, and he flung it mechanically in the grass' },

  // the household that raised them
  { from: 'grigory', to: 'fyodor', bond: 'serves', label: 'servant to', chapter: 'b01-c02' },
  { from: 'grigory', to: 'marfa', bond: 'married', label: 'married to', chapter: 'b03-c01' },
  { from: 'grigory', to: 'smerdyakov', bond: 'raised', label: 'raised', chapter: 'b03-c02',
    quote: 'Grigory took the baby, brought it home' },
  { from: 'grigory', to: 'alyosha', bond: 'raised', label: 'raised', chapter: 'b01-c03',
    quote: 'They were looked after by the same Grigory and lived in his cottage' },

  // the monastery
  { from: 'zossima', to: 'alyosha', bond: 'guides', label: 'elder to', chapter: 'b01-c05' },
  { from: 'ferapont', to: 'zossima', bond: 'rival', label: 'rival to', chapter: 'b04-c01' },
  { from: 'rakitin', to: 'alyosha', bond: 'befriends', label: 'shadows', chapter: 'b02-c07', basis: 'reading',
    note: 'They are friends in the text; “shadows” is this atlas’s word for how Rakitin uses it.' },

  // the Hohlakovs
  { from: 'hohlakov', to: 'lise', bond: 'mother', label: 'mother', chapter: 'b02-c03' },
  { from: 'alyosha', to: 'lise', bond: 'betrothed', label: 'engaged to', chapter: 'b05-c01' },

  // the boys
  { from: 'snegiryov', to: 'ilusha', bond: 'father', label: 'father', chapter: 'b04-c06' },
  { from: 'dmitri', to: 'snegiryov', bond: 'humiliated', label: 'humiliated', key: true, chapter: 'b04-c07',
    quote: 'your brother Dmitri Fyodorovitch was pulling me by my beard' },
  { from: 'alyosha', to: 'ilusha', bond: 'befriends', label: 'befriends', chapter: 'b10-c04' },
  { from: 'kolya', to: 'ilusha', bond: 'befriends', label: 'friend', chapter: 'b10-c04' },
  { from: 'smurov', to: 'ilusha', bond: 'befriends', label: 'friend', chapter: 'b10-c03' },
  { from: 'alyosha', to: 'kolya', bond: 'befriends', label: 'befriends', chapter: 'b10-c04' },

  // the trial
  { from: 'prosecutor', to: 'dmitri', bond: 'court', label: 'prosecutes', chapter: 'b12-c06' },
  { from: 'fetyukovitch', to: 'dmitri', bond: 'court', label: 'defends', chapter: 'b12-c10' },
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
