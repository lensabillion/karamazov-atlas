import NameOrbit from '@/components/NameOrbit';
import PatronymicTree from '@/components/PatronymicTree';
import WarmthLadder from '@/components/WarmthLadder';
import { getCorpus } from '@/lib/corpus';
import { getNames } from '@/lib/names';

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
    <main className="page page--wide">
      <header className="page-header">
        <p className="eyebrow">The names</p>
        <h1 className="title">How close does a name stand?</h1>
        <p className="lede">
          Russian names carry what English names do not: the form someone chooses tells you
          their relationship to the person. Which means the names are a map of who is loved —
          and of who is not.
        </p>
      </header>

      {lineage && (
        <section className="section">
          <div className="section-header">
            <h2 className="heading">The family, reassembled from grammar</h2>
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
          <PatronymicTree
            father={lineage.father}
            patronymic={lineage.patronymic}
            children={pick(lineage.children)}
            disputedId="smerdyakov"
          />
        </section>
      )}

      <section className="section">
        <div className="section-header">
          <h2 className="heading">Who is allowed to say it</h2>
          <p className="text-muted">
            Each ring is a degree of intimacy — the outer ring is name-plus-patronymic, held at
            arm’s length; the centre is the diminutive nobody uses casually. Dot size is how
            often the form is spoken, and where the novel attributes the speech, the speakers
            are named. Attribution covers {coverage.attributed.toLocaleString()} of{' '}
            {coverage.quotes.toLocaleString()} quoted passages, so “heard from” is a floor, not
            a full census.
          </p>
        </div>
        <div className="grid grid--pairs">
          {pick(['dmitri', 'grushenka', 'alyosha', 'katerina', 'ivan', 'smerdyakov']).map((c) => (
            <NameOrbit character={c} addresses={addresses} nameOf={nameOf} key={c.id} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="heading">The coldest men in the book</h2>
          <p className="text-muted">
            Not how often someone is named, but how <em>warmly</em> — the furthest anyone ever
            goes for them in 349,367 words. Dmitri reaches the last rung: someone, once, calls
            him Mityenka. Three men never leave the cold end, and the murder runs through all
            three of them. Nobody in the entire novel addresses the father as anything but
            Fyodor Pavlovitch. Nobody gives Ivan a diminutive. Smerdyakov is called by a
            surname 371 times and by a name once.
          </p>
        </div>
        <WarmthLadder characters={characters} markIds={['fyodor', 'ivan', 'smerdyakov']} />
      </section>
    </main>
  );
}
