import crops from '@/assets/collage/crop-bounds.json';

const TRETYAKOV = 'https://www.tretyakovgallerymagazine.ru/articles/3-4-2023-80-81/obrazy-dostoevskogo-i-gogolya-v-pozdnem-tvorchestve-borisa-grigoreva-mezhdu-';
const SELECTION = 'https://www.gw2ru.com/arts/1392-karamazov-illustrations-grigoriev';
const SCENES = 'https://www.tretyakovgallerymagazine.com/articles/4-2021-73/amazing-mixture-good-and-evil';

/** Identification is separate from extraction: uncertain plates get no character attribution. */
interface PlateIdentification {
  id: number;
  title: string;
  description: string;
  status: 'identified' | 'probable' | 'unidentified';
  source?: string;
  people: readonly string[];
  chapter?: string;
}

const IDENTIFICATIONS: PlateIdentification[] = [
  { id: 1, title: 'Zossima blesses Alyosha', status: 'identified', source: TRETYAKOV,
    description: 'The elder rests his hand on Alyosha’s bowed head.', people: ['zossima', 'alyosha'] },
  { id: 2, title: '“What if Grushenka comes today…”', status: 'identified', source: TRETYAKOV,
    description: 'A moonlit house and garden. The title records Fyodor’s expectation of Grushenka.', people: ['fyodor'] },
  { id: 3, title: 'Alyosha at Zossima’s coffin', status: 'identified', source: TRETYAKOV,
    description: 'Alyosha stands beside the elder’s body in a spare, grey interior.', people: ['alyosha', 'zossima'] },
  { id: 4, title: 'At the Hohlakovs', status: 'identified', source: TRETYAKOV,
    description: 'Alyosha visits the Hohlakov household; the collage preserves only part of the room.', people: ['alyosha', 'hohlakov', 'lise'] },
  { id: 5, title: 'Alyosha’s memory of his mother', status: 'identified', source: TRETYAKOV,
    description: 'A mother holds her child in a shaft of sunlight. Alyosha remembers Sofya from his early childhood.', people: ['alyosha'], chapter: 'b01-c04' },
  { id: 6, title: 'Katerina Ivanovna and Dmitri', status: 'identified', source: TRETYAKOV,
    description: 'Katerina bows low before Dmitri. Gratitude and humiliation become inseparable in their history.', people: ['katerina', 'dmitri'], chapter: 'b03-c04' },
  { id: 7, title: 'The party in Mokroye', status: 'identified', source: SELECTION,
    description: 'Grushenka and the company gathered at the inn, beneath the hanging lamp.', people: ['grushenka', 'dmitri'], chapter: 'b08-c07' },
  { id: 8, title: 'Two monks', status: 'probable',
    description: 'Probably Alyosha with Zossima. The figures resemble their other portraits, but this particular composition has not been matched to a caption.', people: [] },
  { id: 9, title: 'Three women outdoors', status: 'unidentified',
    description: 'Three women stand beside a fence with the town beyond. Their identities are not established.', people: [] },
  { id: 10, title: 'The jury', status: 'identified', source: SELECTION,
    description: 'A study of the faces of the men who will judge Dmitri. No individual juror is assigned a name.', people: [], chapter: 'b12-c01' },
  { id: 11, title: 'Men around a table', status: 'unidentified',
    description: 'A group sits around a table in a room with red curtains. The exact episode remains unverified.', people: [] },
  { id: 12, title: 'Lise Hohlakov', status: 'identified', source: TRETYAKOV,
    description: 'Lise in profile. The published discussion connects this likeness to the actress Lydia Koreneva.', people: ['lise'] },
  { id: 13, title: 'Katerina Ivanovna', status: 'identified', source: TRETYAKOV,
    description: 'A small portrait of Katerina in a hat, with her gaze lowered.', people: ['katerina'] },
  { id: 14, title: 'A man leaning toward a window', status: 'probable',
    description: 'Probably Fyodor Pavlovitch awaiting a visitor. The identification is a visual inference, not a verified catalogue title.', people: [] },
  { id: 15, title: 'A bow in the monastery', status: 'probable',
    description: 'Probably Zossima bowing before Dmitri during the family’s visit. A caption for this exact image has not yet been verified.', people: [] },
  { id: 16, title: 'Grushenka', status: 'identified', source: SELECTION,
    description: 'A close portrait of Agrafena Alexandrovna, known throughout the novel as Grushenka.', people: ['grushenka'] },
  { id: 17, title: 'Both together', status: 'identified', source: SCENES,
    description: 'Katerina and Grushenka on the sofa, with Alyosha behind them. A larger reproduction is already shown among the homepage scenes.', people: ['katerina', 'grushenka', 'alyosha'], chapter: 'b03-c10' },
  { id: 18, title: 'A seated figure in red and white', status: 'unidentified',
    description: 'A bare-legged figure sits beside a pale object. The small reproduction does not support a confident character or scene identification.', people: [] },
  { id: 19, title: 'Katya the schoolgirl', status: 'identified', source: TRETYAKOV,
    description: 'The magazine names this scene “Katya the schoolgirl.” That title does not establish that this is Katerina Ivanovna, so no such link is made.', people: [] },
  { id: 20, title: 'Two men on a monastery path', status: 'probable',
    description: 'Probably Alyosha and Rakitin. A dark-robed figure and a man in a grey coat stand among the trees; the precise episode is unverified.', people: [] },
  { id: 21, title: 'A figure on the earth at night', status: 'unidentified',
    description: 'A prone figure lies among trees under a blue night sky. The subject has not been confirmed.', people: [] },
  { id: 22, title: 'A visit to a crowded room', status: 'probable',
    description: 'Possibly Alyosha visiting the Snegiryov household. The figures and room suggest the episode, but no matching caption has been found.', people: [] },
  { id: 23, title: 'Two studies of faces', status: 'unidentified',
    description: 'Two tightly framed faces. Neither identity can be established from this reproduction alone.', people: [] },
  { id: 24, title: 'The little demon', status: 'identified', source: TRETYAKOV,
    description: 'The published composition is titled “The Little Demon [Lise Hohlakov and Alyosha].” This collage includes only a portion of it; Alyosha is outside the visible crop.', people: ['lise', 'alyosha'], chapter: 'b11-c03' },
  { id: 25, title: '“A fine, warm and clear day…”', status: 'identified', source: TRETYAKOV,
    description: 'A panorama of the town. The magazine supplies this title but does not establish a single character in the small crowd.', people: [] },
  { id: 26, title: 'Ivan and Smerdyakov at the gate', status: 'identified', source: TRETYAKOV,
    description: 'Published as “For a while a very obscure one [Ivan and Smerdyakov].” Their conversation surrounds Ivan’s departure.', people: ['ivan', 'smerdyakov'], chapter: 'b05-c06' },
  { id: 27, title: 'Delirium', status: 'identified', source: SCENES,
    description: 'The performers dressed as bears at Mokroye. The larger supplied version remains in the homepage’s scene sequence.', people: ['dmitri', 'grushenka'], chapter: 'b08-c08' },
  { id: 28, title: 'A meal with the monks', status: 'probable',
    description: 'Probably the monastery meal following the family meeting. This was separated from the Smerdyakov portrait touching its right edge in the collage.', people: [] },
  { id: 29, title: 'Fyodor Pavlovitch in his room', status: 'identified', source: SELECTION,
    description: 'Fyodor seated in a dressing gown, surrounded by mirrors, chairs and houseplants.', people: ['fyodor'] },
  { id: 30, title: 'Katerina’s testimony', status: 'identified', source: SELECTION,
    description: 'Published as “Interrogation of Katerina.” She stands before the court during Dmitri’s trial.', people: ['katerina'] },
  { id: 31, title: 'A bearded man and a woman', status: 'probable',
    description: 'Possibly Grigory and Marfa. The pairing is plausible, but their identities are not confirmed by an individual caption.', people: [] },
  { id: 32, title: 'Outside a tea-and-sugar shop', status: 'unidentified',
    description: 'A figure stands beneath a sign reading “Tea, Sugar.” The place and person remain unidentified.', people: [] },
  { id: 33, title: 'A dim interior', status: 'unidentified',
    description: 'A window, a pale head and a samovar emerge from the dark room. The episode is not securely identified.', people: [] },
  { id: 34, title: 'An interior with a hanging coat', status: 'unidentified',
    description: 'A hanging coat and a small window in a dim interior. This is not the magazine’s separately published “Ivan in his father’s house.”', people: [] },
  { id: 35, title: 'Fyodor Pavlovitch at the window', status: 'identified', source: SCENES,
    description: 'Fyodor, wearing a red cap, looks out beneath an arched window.', people: ['fyodor'] },
  { id: 36, title: 'Pavel Smerdyakov', status: 'identified', source: SELECTION,
    description: 'The original composition behind the approved study: Smerdyakov seated beside a wooden door, looking back over his shoulder.', people: ['smerdyakov'] },
];

/** The supplied collage's own pixels, extracted at native resolution with no generated detail. */
export const COLLAGE_PLATES = IDENTIFICATIONS.map((plate) => {
  const bounds = crops.bounds[plate.id - 1]!;
  const [left, top, right, bottom] = bounds.map((value) =>
    Math.round(value * crops.sourceSize / crops.coordinateSize));
  return {
    ...plate,
    image: `/artwork/grigoriev-collage/plate-${String(plate.id).padStart(2, '0')}.png`,
    width: right! - left!,
    height: bottom! - top!,
  };
});
