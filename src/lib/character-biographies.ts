import { PEOPLE } from './relationships';

/** Shared reminders for every indexed character, including those outside the relationship diagram. */
export const CHARACTER_BIOGRAPHIES: Record<string, string> = {
  ...Object.fromEntries(PEOPLE.map((person) => [person.id, person.who])),
  // Books IX.2, VII.1, XI.1, VIII.6–8, and IX.1 respectively.
  nikolay: 'The young investigating lawyer. With the prosecutor, he questions Dmitri at Mokroye, turning the night’s confused events into the case against him.',
  paissy: 'A monk close to Father Zossima. He reads the Gospel over the elder’s body and remains a steady presence when the monastery’s reverence turns to doubt.',
  maximov: 'An elderly hanger-on, eager for company and a place at the table. After the revels at Mokroye, Grushenka takes him into her care.',
  trifon: 'The innkeeper at Mokroye. He welcomes Dmitri’s extravagant spending, then becomes a witness to the money and revelry of that last night.',
  perhotin: 'The young official holding Dmitri’s pistols as a pledge. Alarmed by his bloodstained hands and sudden money, he follows the trail that brings the authorities to Mokroye.',
};
