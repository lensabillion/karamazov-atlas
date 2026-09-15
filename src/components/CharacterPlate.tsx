import Ornament from './Ornament';
import type { NamedCharacter } from '@/lib/names';

/**
 * A character presented as a first-edition plate.
 *
 * The 1912 Heinemann edition this corpus comes from is unillustrated, so there
 * is no portrait to reproduce and none is invented here. What it does have is a
 * way of setting a page — letterspaced capitals, paired rules, a centred block,
 * an ornament — and that is what the person is presented in.
 *
 * Every figure below is computed from the text.
 */

const GROUP_IMPRINT: Record<string, string> = {
  family: 'Of the House of Karamazov',
  women: 'Of the Town · The Women',
  monastery: 'Of the Monastery',
  boys: 'Of the Schoolboys',
  town: 'Of the Town',
  court: 'Of the Court',
};

const REGISTER_NOTE: Record<string, string> = {
  formal: 'Formal',
  distanced: 'Distanced',
  neutral: 'Neutral',
  familiar: 'Familiar',
  tender: 'Tender',
};

export default function CharacterPlate({
  character,
  chapterCount,
  totalChapters,
  epithet,
}: {
  character: NamedCharacter;
  chapterCount: number;
  totalChapters: number;
  /** One line on who this is. */
  epithet?: string;
}) {
  const ORDER = ['formal', 'distanced', 'neutral', 'familiar', 'tender'];
  const forms = [...character.forms].sort(
    (a, b) => ORDER.indexOf(a.register) - ORDER.indexOf(b.register),
  );

  return (
    <section className="plate">
      <p className="plate__series">{GROUP_IMPRINT[character.group] ?? 'Of the Town'}</p>

      <h1 className="plate__name">{character.name}</h1>

      <hr className="plate__rule" />

      {epithet && <p className="plate__epithet">{epithet}</p>}

      <Ornament />

      <dl className="plate__figures">
        <div className="plate__figure">
          <dt>Named</dt>
          <dd>{character.total.toLocaleString()}</dd>
        </div>
        <div className="plate__figure">
          <dt>Chapters</dt>
          <dd>
            {chapterCount} <span style={{ fontSize: '0.6em' }}>of {totalChapters}</span>
          </dd>
        </div>
        <div className="plate__figure">
          <dt>Forms</dt>
          <dd>{character.forms.length}</dd>
        </div>
      </dl>

      <hr className="plate__rule plate__rule--hair" />

      <p className="plate__series">Called</p>

      <div className="plate__forms">
        {forms.map((f) => (
          <p className="plate__form" key={f.form}>
            <span className="plate__form-name">{f.form}</span>
            <span className="plate__form-note">
              {REGISTER_NOTE[f.register]} · {f.count}
            </span>
          </p>
        ))}
      </div>

      {character.patronymic && character.fatherName && (
        <>
          <hr className="plate__rule plate__rule--hair" />
          <p className="plate__imprint">
            {character.patronymic} — child of {character.fatherName}
          </p>
        </>
      )}
    </section>
  );
}
