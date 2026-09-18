import type { Metadata } from 'next';
import Ornament from '@/components/Ornament';
import '@/app/plate.css';
import './translations.css';

export const metadata: Metadata = {
  title: 'Which translation? · Karamazov Atlas',
  description: 'The five English translations in wide use, what each keeps and costs, and what reading Garnett here costs you.',
};

/**
 * The translation brief (atlas-ghbn): the decision readers make before page one.
 *
 * Reputations are reported as readers' consensus from the comparison pieces
 * cited at the foot, not asserted as verdicts. The page states plainly what the
 * atlas loses by shipping Garnett, because hiding it would be dishonest in a
 * project whose premise is that every idea is spoken by a particular person.
 */

interface Translation {
  who: string;
  year: string;
  keeps: string;
  costs: string;
  for: string;
  ours?: boolean;
}

const TRANSLATIONS: Translation[] = [
  {
    who: 'Constance Garnett',
    year: '1912 · Heinemann',
    ours: true,
    keeps: 'Gravity. Her measured Victorian English suits the elder’s teaching and the narrator’s long periods, and for decades it was the Dostoyevsky English-speaking readers knew.',
    costs: 'Dostoyevsky’s roughness. She smooths his repetitions, hesitations and deliberately clumsy phrasing, and the voices sound more alike than they do in Russian. There are also slips and small omissions; later editors corrected many of them.',
    for: 'Readers who want the classic English Dostoyevsky, or the text this atlas quotes. The Norton Critical Edition prints her translation revised by Ralph Matlaw (1976), and later by Susan McReynolds Oddo (2011).',
  },
  {
    who: 'Richard Pevear & Larissa Volokhonsky',
    year: '1990 · North Point Press',
    keeps: 'The Russian. Readers’ consensus is that it is the closest in cadence and structure: the repetitions, the verbal tics, the narrator’s fussiness, each character’s own way of talking.',
    costs: 'Ease. Keeping the Russian shape sometimes makes for awkward English, and its critics argue it reads as translated.',
    for: 'Readers who want to hear how Dostoyevsky sounds, and do not mind the effort.',
  },
  {
    who: 'David McDuff',
    year: '1993 · Penguin Classics',
    keeps: 'Pace. Readers describe it as leaner and faster than the older translations, in plain modern English.',
    costs: 'Some of the texture both Garnett and Pevear & Volokhonsky, in their different ways, preserve.',
    for: 'Often recommended for a first reading.',
  },
  {
    who: 'Ignat Avsey',
    year: '1994 · Oxford World’s Classics',
    keeps: 'Life in the dialogue. Fluent modern English in which the arguments crackle; readers who find it call it the most underrated.',
    costs: 'Fluency is a choice: the smoother the English, the less of Dostoyevsky’s deliberate awkwardness survives.',
    for: 'Readers who stall on stiff prose and want the conversations to move.',
  },
  {
    who: 'Michael R. Katz',
    year: '2023 · Liveright',
    keeps: 'A contemporary scholar’s reading, the newest of the five.',
    costs: 'Too new for the long record of readers’ reports the others have; judge a chapter for yourself.',
    for: 'Readers who want the most recent translation.',
  },
];

/** Garnett's spellings against Pevear & Volokhonsky's, the translation most readers will hold beside this atlas. */
const SPELLINGS: [string, string][] = [
  ['Fyodor Pavlovitch', 'Fyodor Pavlovich'],
  ['Dmitri Fyodorovitch', 'Dmitri Fyodorovich'],
  ['Alexey (Alyosha)', 'Alexei (Alyosha)'],
  ['Father Zossima', 'Father Zosima'],
  ['Father Païssy', 'Father Paissy'],
  ['Madame Hohlakov', 'Madame Khokhlakov'],
  ['Kolya Krassotkin', 'Kolya Krasotkin'],
  ['Ilusha', 'Ilyusha'],
  ['Perhotin', 'Perkhotin'],
  ['Fetyukovitch', 'Fetyukovich'],
  ['Mokroe', 'Mokroye'],
  ['Tchermashnya', 'Chermashnya'],
];

const SOURCES = [
  { label: 'Goodreads: “Which translation is the best translation?” (85 replies)', href: 'https://www.goodreads.com/topic/show/983001-which-translation-is-the-best-translation' },
  { label: 'We Love Translations: What’s the best translation of The Brothers Karamazov?', href: 'https://welovetranslations.com/2022/01/10/whats-the-best-translation-of-the-brothers-karamazov/' },
  { label: 'Reading the Odyssey: The Brothers Karamazov — what it’s about and the best translation', href: 'https://www.readingtheodyssey.com/translations-brothers-karamazov/' },
  { label: 'Idlings: McDuff vs Pevear & Volokhonsky', href: 'https://idlings.wordpress.com/2022/06/09/macduff-vs-pevear-volokhonsky/' },
  { label: 'Wikipedia: The Brothers Karamazov — English translations', href: 'https://en.wikipedia.org/wiki/The_Brothers_Karamazov' },
];

export default function TranslationsPage() {
  return (
    <main className="page page--narrow translations">
      <header className="page-header">
        <p className="eyebrow">Before page one</p>
        <h1 className="title">Which translation?</h1>
        <p className="lede">
          The first decision a reader of this novel makes, and usually with no way to make it.
          Five English translations are in wide use. None is wrong; they differ in what they
          choose to keep. What follows reports readers’ consensus from the comparisons cited
          at the foot of the page, and then says what reading Garnett here costs you.
        </p>
      </header>

      <section className="translations__list" aria-label="The translations">
        {TRANSLATIONS.map((t) => (
          <article className="translations__entry book-description" key={t.who} data-ours={t.ours || undefined}>
            <p className="plate__series">{t.ours ? 'The text of this atlas' : t.year}</p>
            <h2 className="translations__who">{t.who}</h2>
            {t.ours && <p className="meta translations__year">{t.year}</p>}
            <hr className="plate__rule plate__rule--hair" />
            <dl className="translations__notes">
              <div><dt>Keeps</dt><dd>{t.keeps}</dd></div>
              <div><dt>Costs</dt><dd>{t.costs}</dd></div>
              <div><dt>For</dt><dd>{t.for}</dd></div>
            </dl>
          </article>
        ))}
      </section>

      <Ornament />

      <section className="section" aria-labelledby="cost">
        <h2 className="heading" id="cost">What Garnett costs this atlas</h2>
        <p>
          The atlas quotes Garnett because her translation is in the public domain, so the whole
          text can be searched, read and cited here. That is a practical reason, not a judgement.
        </p>
        <p>
          The standing complaint about her is the one that matters most for this book. Joseph
          Brodsky’s version of it, as David Remnick reported, was that English readers can hardly
          tell Tolstoy from Dostoyevsky because what they are reading is Constance Garnett. In a
          novel whose whole method is that every idea is spoken by a particular person — Ivan’s
          argument in Ivan’s voice, Smerdyakov’s in his — a translation that brings the voices
          closer together loses something real. When the atlas says who says what, it is right
          about the words’ owner and less reliable about their sound.
        </p>
      </section>

      <section className="section" aria-labelledby="concordance">
        <h2 className="heading" id="concordance">Reading another translation beside the atlas</h2>
        <p>
          Book and chapter numbers are Dostoyevsky’s, so every citation here — Bk V, ch. 5 — finds
          the same chapter in any translation. Names are spelled differently; Garnett’s older
          transliteration against Pevear &amp; Volokhonsky’s:
        </p>
        <table className="translations__table">
          <thead><tr><th scope="col">Garnett (here)</th><th scope="col">Pevear &amp; Volokhonsky</th></tr></thead>
          <tbody>
            {SPELLINGS.map(([g, pv]) => <tr key={g}><td>{g}</td><td>{pv}</td></tr>)}
          </tbody>
        </table>
      </section>

      <footer className="section translations__sources">
        <p className="eyebrow">Sources for the readers’ consensus</p>
        <ul>
          {SOURCES.map((s) => <li key={s.href}><a className="link" href={s.href}>{s.label} ↗</a></li>)}
        </ul>
      </footer>
    </main>
  );
}
