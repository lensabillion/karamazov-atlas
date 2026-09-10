import NameOrbit from '@/components/NameOrbit';
import PatronymicTree from '@/components/PatronymicTree';
import WarmthLadder from '@/components/WarmthLadder';
import { getCorpus } from '@/lib/corpus';
import { getNames } from '@/lib/names';
import './names.css';

export default function NamesPage() {
  const { characters, addresses, coverage, lineages } = getNames();
  const corpus = getCorpus();
  const byId = new Map(characters.map((c) => [c.id, c]));
  const nameOf = Object.fromEntries(characters.map((c) => [c.id, c.short]));
  const cite = (id: string | null) => corpus.chapters.find((c) => c.id === id)?.cite ?? '';

  const pick = (ids: string[]) =>
    ids.map((id) => byId.get(id)).filter((c): c is NonNullable<typeof c> => Boolean(c));

  const lineage = lineages[0];
  const pavel = byId.get('smerdyakov')?.forms.find((f) => f.form === 'Pavel Fyodorovitch');

  return (
    <main className="page page--wide names-page">
      <header className="names-header">
        <div className="names-header__title">
          <p className="eyebrow">The names</p>
          <h1 className="title">How close does a name stand?</h1>
        </div>
        <p className="lede">
          Russian names carry what English names do not: the form chosen encodes formality
          and distance. What follows is a description of how each person is <em>named</em>{' '}
          across the text — narration included — not a measure of how they are felt about.
          Where a reading is offered, it is marked as a reading.
        </p>
      </header>

      <nav className="names-sections" aria-label="On this page">
        {lineage && <a href="#names-family"><span className="eyebrow">01</span><span className="text">The family</span><span aria-hidden="true">↓</span></a>}
        <a href="#names-forms"><span className="eyebrow">02</span><span className="text">Names & forms</span><span aria-hidden="true">↓</span></a>
        <a href="#names-registers"><span className="eyebrow">03</span><span className="text">Across the novel</span><span aria-hidden="true">↓</span></a>
      </nav>

      {lineage && (
        <section className="names-section" id="names-family" aria-labelledby="names-family-title">
          <div className="names-section__header">
            <div className="names-section__title">
              <p className="eyebrow">01 / The family</p>
              <h2 className="heading" id="names-family-title">The family, reassembled from grammar</h2>
            </div>
            <p className="text-muted">
              A patronymic names the father. Everyone below carries{' '}
              <strong>{lineage.patronymic}</strong>, so everyone below is a child of{' '}
              {lineage.father}. The dashed thread is said once, at{' '}
              {pavel && (
                <a className="link" href={`/read/${pavel.firstChapter}`}>{cite(pavel.firstChapter)}</a>
              )}
              , and never again.
            </p>
          </div>
          <div className="names-wide-chart names-family-chart">
            <PatronymicTree
              father={lineage.father}
              patronymic={lineage.patronymic}
              children={pick(lineage.children)}
              disputedId="smerdyakov"
            />
          </div>
        </section>
      )}

      <section className="names-section" id="names-forms" aria-labelledby="names-forms-title">
        <div className="names-section__header">
          <div className="names-section__title">
            <p className="eyebrow">02 / Names & forms</p>
            <h2 className="heading" id="names-forms-title">Who is allowed to say it</h2>
          </div>
          <p className="text-muted">
            Each ring is a degree of intimacy — the outer ring is name-plus-patronymic, held at
            arm’s length; the centre is the diminutive nobody uses casually. Dot size is how
            often the form is spoken, and where the novel attributes the speech, the speakers
            are named. Attribution covers {coverage.attributed.toLocaleString()} of{' '}
            {coverage.quotes.toLocaleString()} quoted passages, so “heard from” is a floor, not
            a full census.
          </p>
        </div>
        <div className="names-orbits">
          {pick(['dmitri', 'grushenka', 'alyosha', 'katerina', 'ivan', 'smerdyakov']).map((c) => (
            <NameOrbit character={c} addresses={addresses} nameOf={nameOf} key={c.id} />
          ))}
        </div>
      </section>

      <section className="names-section" id="names-registers" aria-labelledby="names-registers-title">
        <div className="names-section__header">
          <div className="names-section__title">
            <p className="eyebrow">03 / Across the novel</p>
            <h2 className="heading" id="names-registers-title">The coldest men in the book</h2>
          </div>
          <p className="text-muted">
            Not how often someone is named, but the least formal register the text ever uses
            for them — across narration and dialogue alike, under the alias vocabulary listed
            on this page. Dmitri reaches the diminutive <em>Mityenka</em>; Fyodor appears only
            as Fyodor Pavlovitch, Ivan takes no recorded diminutive, and Smerdyakov is a
            surname 371 times against a single given name.
          </p>
        </div>
        <div className="names-wide-chart names-register-chart">
          <WarmthLadder characters={characters} markIds={['fyodor', 'ivan', 'smerdyakov']} />
        </div>
        <aside className="names-note" aria-label="Interpretation note">
          <p className="text-muted">
            <strong>A reading, offered as one:</strong> those three sit at the formal end, and
            the murder runs through all three. That is a pattern in how the prose names people.
            It is not evidence of what any character feels, and an alias list this size cannot
            support a claim about what nobody ever says.
          </p>
        </aside>
      </section>
    </main>
  );
}
