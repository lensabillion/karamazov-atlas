import NameOrbit from '@/components/NameOrbit';
import PatronymicTree from '@/components/PatronymicTree';
import RegisterRibbon from '@/components/RegisterRibbon';
import { getCorpus } from '@/lib/corpus';
import { getNames } from '@/lib/names';

export default function NamesPage() {
  const { characters, lineages } = getNames();
  const corpus = getCorpus();
  const byId = new Map(characters.map((c) => [c.id, c]));
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
          their relationship to the person and the temperature of the moment. Here is that
          system drawn rather than described.
        </p>
      </header>

      {lineage && (
        <section className="section">
          <div className="section-header">
            <h2 className="heading">The family, reassembled from grammar</h2>
            <p className="text-muted">
              A patronymic is not a middle name — it names the father. Everyone below carries{' '}
              <strong>{lineage.patronymic}</strong>, so everyone below is a child of{' '}
              {lineage.father}. Nobody had to say so.
            </p>
          </div>
          <PatronymicTree
            father={lineage.father}
            patronymic={lineage.patronymic}
            children={pick(lineage.children)}
            disputedId="smerdyakov"
          />
          {pavel && (
            <p className="text-muted">
              The dashed thread is the whole novel in one suffix. The town assumes Smerdyakov is
              old Fyodor’s son; the book never says it. It says something quieter — once, at{' '}
              <a className="link" href={`/read/${pavel.firstChapter}`}>{cite(pavel.firstChapter)}</a>,
              a servant girl calls him Pavel <em>Fyodorovitch</em>.
            </p>
          )}
        </section>
      )}

      <section className="section">
        <div className="section-header">
          <h2 className="heading">One person, five distances</h2>
          <p className="text-muted">
            Each ring is a degree of intimacy. The outer ring is name-plus-patronymic, held at
            arm’s length; the centre is the diminutive nobody uses casually. Dot size is how
            often that form is spoken.
          </p>
        </div>
        <div className="grid grid--pairs">
          {pick(['dmitri', 'alyosha', 'grushenka', 'katerina', 'ivan', 'smerdyakov']).map((c) => (
            <NameOrbit character={c} key={c.id} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="heading">The temperature, chapter by chapter</h2>
          <p className="text-muted">
            Every column is a chapter, in reading order, numbered by book beneath. Height is how
            often the person is named there; the stack is which registers were used, most formal
            and darkest at the top. Formality rises at the monastery and in the confrontations —
            and falls away almost entirely at the trial, where the narrator keeps calling Dmitri
            “Mitya” while the court calls him the accused.
          </p>
        </div>
        <div className="stack stack--loose">
          {pick(['dmitri', 'alyosha', 'grushenka']).map((c) => (
            <div className="stack stack--tight" key={c.id}>
              <p className="eyebrow">{c.name}</p>
              <RegisterRibbon character={c} chapters={corpus.chapters} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
