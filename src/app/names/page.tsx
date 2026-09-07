import NameKey from '@/components/NameKey';
import { getCorpus } from '@/lib/corpus';
import { getNames } from '@/lib/names';

export default function NamesPage() {
  const { characters, lineages, registers } = getNames();
  const corpus = getCorpus();
  const cites = Object.fromEntries(corpus.chapters.map((c) => [c.id, c.cite]));
  const citeOf = (id: string) => cites[id] ?? id;

  const byId = new Map(characters.map((c) => [c.id, c]));
  const totalForms = characters.reduce((n, c) => n + c.forms.length, 0);

  // The one form that carries the novel's central ambiguity.
  const smerdyakov = byId.get('smerdyakov');
  const pavel = smerdyakov?.forms.find((f) => f.form === 'Pavel Fyodorovitch');

  const principals = ['dmitri', 'ivan', 'alyosha', 'smerdyakov', 'grushenka', 'katerina']
    .map((id) => byId.get(id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <main className="page">
      <header className="page-header">
        <p className="eyebrow">The names</p>
        <h1 className="title">Everyone here has five names, and each one means something</h1>
        <p className="lede">
          The most cited reason readers put this novel down is that they cannot tell who is
          being spoken about. It is not a memory problem. Russian names carry information
          English names do not: the form someone uses tells you their relationship to the
          person and the temperature of the moment. {totalForms} distinct forms appear across
          these {characters.length} characters, and every one below was counted in the text.
        </p>
      </header>

      <section className="section">
        <div className="section-header">
          <h2 className="heading">The register ladder</h2>
          <p className="text-muted">
            The same person, addressed from most distant to most intimate. Nothing about the
            person changes; everything about the speaker does.
          </p>
        </div>
        <ul className="list">
          {registers.map((r) => (
            <li className="list-item" key={r.key}>
              <span className="list-item__label">
                <strong>{r.label}</strong> — {r.description}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {lineages.map((l) => (
        <section className="section" key={l.patronymic}>
          <div className="section-header">
            <h2 className="heading">What the patronymic gives away</h2>
            <p className="text-muted">
              A patronymic is not a middle name. “{l.patronymic}” means <em>child of {l.father}</em>.
              Group the characters by the patronymic the text gives them and the family
              reassembles itself — including the son nobody will say is a son.
            </p>
          </div>
          <div className="lineage">
            {l.children.map((id) => {
              const c = byId.get(id);
              if (!c) return null;
              const disputed = id === 'smerdyakov';
              return (
                <span
                  className={`lineage__child${disputed ? ' lineage__child--disputed' : ''}`}
                  key={id}
                >
                  {c.givenName ?? c.short}
                </span>
              );
            })}
          </div>
          {pavel && (
            <p className="text-muted">
              The dashed one is the point. Smerdyakov is the household’s servant and cook, and
              the town assumes he is old Fyodor’s son by Lizaveta — but the novel never states
              it. It does something quieter: exactly <strong>once</strong> in{' '}
              {corpus.wordCount.toLocaleString()} words, at{' '}
              <a className="link" href={`/read/${pavel.firstChapter}`}>
                {citeOf(pavel.firstChapter ?? '')}
              </a>
              , a servant girl addresses him as <em>Pavel Fyodorovitch</em> — Pavel, son of
              Fyodor. The claim the whole plot turns on is made once, in a suffix, and English
              readers pass straight over it.
            </p>
          )}
        </section>
      ))}

      <section className="section">
        <h2 className="heading">The principals</h2>
        <div className="stack stack--loose">
          {principals.map((c) => (
            <NameKey character={c} cites={cites} key={c.id} />
          ))}
        </div>
      </section>
    </main>
  );
}
