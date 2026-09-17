/** Editorial reading notes; chapter links are companions, not artwork identifications. */
export interface IllustrationStory {
  plateId: number;
  heading: string;
  story: string;
  looking: string;
  remember: string;
  chapter?: string;
}

/** A thematic sequence through the novel, rather than a chronology of the paintings. */
export interface StoryMovement {
  id: string;
  numeral: string;
  title: string;
  introduction: string;
  entries: readonly IllustrationStory[];
}

export const STORY_MOVEMENTS: readonly StoryMovement[] = [
  {
    id: 'house-and-inheritance',
    numeral: 'I',
    title: 'A town, a house, a childhood',
    introduction: 'Before the crime, there is a world to remember: familiar streets, neglected children, and the rooms in which a family learns to live apart.',
    entries: [
      {
        plateId: 25,
        heading: 'Begin outside the house',
        story: 'The town is more than a backdrop. Visits, errands and overheard stories carry the Karamazovs’ private troubles into public life. This panorama lets us begin at that wider scale. Its published title gives us a warm, clear day, not a securely identified episode.',
        looking: 'The row of houses stands above a line of trees; small figures occupy the open ground below.',
        remember: 'Keep the town in view: the family’s most private quarrels will eventually be repeated, interpreted and judged by others.',
      },
      {
        plateId: 5,
        heading: 'The memory that remains',
        story: 'Alyosha loses his mother before his fourth birthday, yet one evening stays with him: sunlight, an icon, and her arms holding him close in prayer. Long before he enters the monastery, love and fear are already joined in his earliest surviving memory.',
        looking: 'A diagonal shaft of sunlight crosses the room toward the mother and child gathered beneath the bright window.',
        remember: 'Alyosha’s tenderness has a history. His faith begins here as something felt and remembered, before it becomes an argument.',
        chapter: 'b01-c04',
      },
      {
        plateId: 29,
        heading: 'The father in his own rooms',
        story: 'Fyodor Pavlovitch can accumulate money while neglecting the people who depend on him. His household combines comfort with disorder, affection with mockery. This portrait gives the family’s disruptive centre a domestic setting: the father is at home, but his sons have never found much shelter there.',
        looking: 'Tall mirrors fill the wall behind the seated figure; pale chairs and houseplants crowd the edges of his room.',
        remember: 'The inheritance dispute is also a dispute about fatherhood: what does a parent owe beyond the money he keeps?',
        chapter: 'b01-c01',
      },
      {
        plateId: 19,
        heading: 'An interlude beyond the family',
        story: 'Two young figures and a small animal interrupt the succession of troubled interiors. The published title names Katya the schoolgirl, but does not securely place this scene in a chapter. We leave that connection open, rather than turn a shared first name into Katerina Ivanovna’s biography.',
        looking: 'Two figures in patterned dresses stand beside a wooden fence, with a small brown animal crossing the grass.',
        remember: 'The title is established; the episode is not. Let the image widen the world without supplying a story we cannot verify.',
      },
    ],
  },
  {
    id: 'love-and-pride',
    numeral: 'II',
    title: 'Love entangled with pride',
    introduction: 'Money can look like rescue, gratitude like devotion, and tenderness like a contest. Remember what each person wants the other to acknowledge.',
    entries: [
      {
        plateId: 13,
        heading: 'Katerina, before the testimony',
        story: 'Katerina is not merely the woman Dmitri leaves. Her attachment carries the memory of a desperate appeal, an unexpected gift, and a debt she cannot treat as settled. Read this quiet portrait beside her history: generosity and wounded pride will repeatedly change places.',
        looking: 'Her eyes turn downward beneath the brim of a pale hat; the small portrait holds her apart from any scene.',
        remember: 'Katerina’s later decisions grow from this unresolved debt. To help Dmitri can also mean insisting that he needs her.',
        chapter: 'b03-c04',
      },
      {
        plateId: 6,
        heading: 'The gift and the bow',
        story: 'Katerina comes to Dmitri for money to save her father from disgrace. Dmitri has imagined exploiting her desperation, but instead gives her the money and lets her go. Her bow of gratitude becomes a memory neither can escape: an act of help already burdened by humiliation.',
        looking: 'Katerina bends almost to the floor while Dmitri remains upright; an empty chair separates their bodies in the pale room.',
        remember: 'Remember the bow when Katerina enters the courtroom. What began in private will be told again before strangers.',
        chapter: 'b03-c04',
      },
      {
        plateId: 16,
        heading: 'Grushenka, beyond the rivalry',
        story: 'Father and son treat Grushenka as the answer to their desires. Her own story is less convenient: an old abandonment, years of resentment, and a capacity for unexpected kindness. When Alyosha comes to her in grief, the supposed temptation becomes an encounter of mutual compassion.',
        looking: 'The face nearly fills the sheet; dark eyes and a tightly held mouth leave little space for setting or spectacle.',
        remember: 'Grushenka is not simply the prize in a quarrel. The encounter with Alyosha changes how both characters see themselves.',
        chapter: 'b07-c03',
      },
      {
        plateId: 17,
        heading: 'The kiss that is withheld',
        story: 'Katerina welcomes Grushenka as though an understanding between them could settle Dmitri’s future. She kisses her rival’s hand. Grushenka offers to return the gesture, then refuses. Alyosha watches an apparent reconciliation become a humiliation: the contest is now about who has power to wound.',
        looking: 'The two women share a striped sofa but turn differently toward one another; Alyosha stands small behind them.',
        remember: 'The missing kiss matters more than the polite words. A small gesture exposes the struggle beneath their apparent intimacy.',
        chapter: 'b03-c10',
      },
    ],
  },
  {
    id: 'faith-and-tenderness',
    numeral: 'III',
    title: 'What tenderness must survive',
    introduction: 'Alyosha carries the elder’s teaching into drawing rooms and sickrooms. These images belong together through that trial of care, not because they illustrate a single day.',
    entries: [
      {
        plateId: 1,
        heading: 'A blessing, and a sending out',
        story: 'Zossima gives Alyosha affection, but not permission to withdraw from everyone else. In their last conversations he urges him to seek Dmitri and attend to the suffering ahead. The blessing is a beginning of responsibility: what Alyosha receives in the cell must become care outside it.',
        looking: 'The elder’s large hand rests on the bowed head; the gold cross hangs immediately above their point of contact.',
        remember: 'Zossima’s influence survives less as a doctrine Alyosha repeats than as a way of approaching people who need him.',
        chapter: 'b06-c01',
      },
      {
        plateId: 4,
        heading: 'Care in an ordinary room',
        story: 'At the Hohlakovs’, talk of miracles and family scandal meets the smaller urgency of Alyosha’s injured finger. Lise interrupts the conversation to have it washed and dressed. The household gives his journey another scale: beside the great questions, there is someone immediately in need of care.',
        looking: 'Alyosha’s dark robe interrupts the pale patterned interior; the window and crowded table draw attention to the domestic setting.',
        remember: 'This is related reading, not a claim that the crop depicts the wound. Small acts of care anchor the visit.',
        chapter: 'b04-c04',
      },
      {
        plateId: 12,
        heading: 'Lise’s changing voice',
        story: 'Lise can tease Alyosha, worry over his pain, and listen closely as he describes another family’s humiliation. Their childhood friendship briefly opens toward a shared future. Keep that capacity for fellow feeling beside this profile; it makes her later wish to hurt herself and others more troubling.',
        looking: 'The profile turns toward the left edge; a blue ribbon gathers the curls behind the sharply outlined cheek.',
        remember: 'Do not reduce Lise to her later cruelty. Her earlier concern for suffering people is part of the same character.',
        chapter: 'b05-c01',
      },
      {
        plateId: 3,
        heading: 'When the miracle does not come',
        story: 'After Zossima’s death, visitors expect his body to affirm his holiness. Instead, its decay becomes a scandal. Alyosha grieves not only for his teacher but at the delight others take in his humiliation. Faith must survive without the reassuring sign that the crowd has demanded.',
        looking: 'The body and the standing mourner are separated by bare grey space; the red coffin supplies the strongest colour.',
        remember: 'This loss tests Alyosha’s expectations of goodness. The elder’s death does not spare him the difficulty of living his teaching.',
        chapter: 'b07-c01',
      },
      {
        plateId: 24,
        heading: 'A room turned inward',
        story: 'Later, Lise rejects the future she imagined with Alyosha and speaks of wanting destruction rather than happiness. He listens, but cannot simply soothe her distress away. The published composition includes both of them; this collage preserves only her side, making the room feel more solitary still.',
        looking: 'Lise sits low beside a table beneath a large window; the other listener falls outside this partial reproduction.',
        remember: 'Her distress resists a tidy explanation. The scene asks what compassionate attention can do when it cannot immediately heal.',
        chapter: 'b11-c03',
      },
    ],
  },
  {
    id: 'watching-and-departing',
    numeral: 'IV',
    title: 'At the door, at the window',
    introduction: 'The house narrows into thresholds: a servant who knows the signals, a father waiting for a visitor, a son preparing to leave. What remains unsaid begins to matter.',
    entries: [
      {
        plateId: 36,
        heading: 'The listener in the household',
        story: 'Smerdyakov is raised by Grigory and Marfa and serves in Fyodor’s house, where his skill as a cook does not protect him from contempt. His reserve encourages others to underestimate him. Keep him in view: the man at the edge of family conversation is listening closely.',
        looking: 'Seated beside a tall wooden door, Smerdyakov turns his head back toward us while his body remains facing away.',
        remember: 'Smerdyakov’s knowledge of the household matters. The people who dismiss him repeatedly entrust him with their secrets and desires.',
        chapter: 'b03-c06',
      },
      {
        plateId: 2,
        heading: 'The visitor who never arrives',
        story: 'Fyodor’s expectation of Grushenka reorganises the household. He waits, questions Smerdyakov, and arranges secret signals for her arrival. Dmitri is watching too. The moonlit house belongs to that atmosphere of anticipation, where an imagined visit can govern the actions of people who have not met.',
        looking: 'A crescent moon hangs above the timber house; the fence and small foreground figures keep us outside its rooms.',
        remember: 'Grushenka’s absence is active in the plot. Father and son make dangerous decisions around what they imagine she will do.',
        chapter: 'b05-c06',
      },
      {
        plateId: 35,
        heading: 'A face at the window',
        story: 'In the garden, Dmitri watches his father and cannot decide whether Grushenka is inside. He knocks the agreed signal. Fyodor opens the window in eager expectation, while Dmitri remains hidden. The moment brings desire and hatred face to face, without yet telling the whole story of the murder.',
        looking: 'An open shutter and arched frame surround Fyodor’s face; the red head covering stands out against the dark exterior.',
        remember: 'Dmitri’s violent feeling is not proof of the murder. The novel makes us distinguish an impulse from an act.',
        chapter: 'b08-c04',
      },
      {
        plateId: 26,
        heading: 'What does leaving mean?',
        story: 'At the gate, Smerdyakov presses Ivan about leaving and describes how exposed the household may become. Ivan resents the suggestion that they understand each other without speaking plainly. Their conversation leaves an unanswered question behind him: can departing become a way of refusing to know?',
        looking: 'The two figures stand apart against the wooden gate; the blue evening light leaves little warmth between them.',
        remember: 'Ivan hears more than he wants to acknowledge. Later, he must revisit both the words and his own decision to leave.',
        chapter: 'b05-c06',
      },
    ],
  },
  {
    id: 'celebration-and-judgment',
    numeral: 'V',
    title: 'A night of joy, a public judgment',
    introduction: 'The company at Mokroye gathers around desire and entertainment; the courtroom gathers around competing accounts. In both rooms, look at who watches and who must perform.',
    entries: [
      {
        plateId: 7,
        heading: 'Everyone is watching Grushenka',
        story: 'Dmitri reaches Mokroye to find Grushenka with the former lover whose return has unsettled her. Cards, money and awkward politeness fill the room before that reunion collapses. This gathering is a turning point for her, not simply another extravagant evening in Dmitri’s pursuit.',
        looking: 'Grushenka occupies the foreground beneath the hanging lamp; the men behind her form a close, watchful company.',
        remember: 'Grushenka must judge the man she has remembered for years against the man who has actually returned to her.',
        chapter: 'b08-c07',
      },
      {
        plateId: 27,
        heading: 'Joy on the edge of disaster',
        story: 'The party spills into songs and dancing; two girls perform dressed as bears. During the same night, Grushenka and Dmitri finally acknowledge their love. What feels like a beginning is interrupted by officials arriving to arrest him. The revelry and the catastrophe occupy the same room.',
        looking: 'One bear-costumed performer stands while another sprawls beside an overturned chair; musicians and spectators press close behind them.',
        remember: 'The chapter’s delirium holds both happiness and dread. Their declaration of love does not cancel the violence outside the celebration.',
        chapter: 'b08-c08',
      },
      {
        plateId: 30,
        heading: 'A private debt becomes evidence',
        story: 'Katerina first tells the court how Dmitri helped her father, exposing her own humiliation to defend him. Later she produces his threatening letter. The testimony turns their intimate history into public evidence, while generosity, anger and the wish to protect Ivan pull her in different directions.',
        looking: 'A solitary woman faces the long green-covered table; the seated officials and raised enclosure make the room feel divided.',
        remember: 'Remember the earlier bow. Katerina must now tell strangers what it meant, and her account can change Dmitri’s fate.',
        chapter: 'b12-c05',
      },
      {
        plateId: 10,
        heading: 'Who gets to decide the story?',
        story: 'By the end of the trial, Dmitri’s life has been arranged into rival explanations. The jurors must decide which account to believe, and they convict him of the murder. These unnamed faces return the question to ordinary people: how easily can a persuasive story be mistaken for truth?',
        looking: 'Heads fill two uneven rows, each with a different angle and expression; no single face commands the whole group.',
        remember: 'The verdict closes the trial, not the question of responsibility. Legal guilt and the novel’s moral reckoning are not identical.',
        chapter: 'b12-c14',
      },
    ],
  },
];
