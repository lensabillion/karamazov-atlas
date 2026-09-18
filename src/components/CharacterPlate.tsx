import Biography from './Biography';
import Ornament from './Ornament';
import { ordinalOf } from '@/lib/corpus';
import type { NamedCharacter } from '@/lib/names';

/** The typographic half of a character spread, with figures computed from the text. */

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
  heading = 'h1',
  headingId,
}: {
  character: NamedCharacter;
  chapterCount: number;
  totalChapters: number;
  /** One line on who this is. */
  epithet?: string;
  heading?: 'h1' | 'h2' | 'h3';
  headingId?: string;
}) {
  const Heading = heading;
  const ORDER = ['formal', 'distanced', 'neutral', 'familiar', 'tender'];
  const forms = [...character.forms].sort(
    (a, b) => ORDER.indexOf(a.register) - ORDER.indexOf(b.register),
  );
  const patronymicForm = character.forms.find((f) => f.kind === 'patronymic-pair' && f.firstChapter);
  const patronymicFrom = patronymicForm ? ordinalOf(patronymicForm.firstChapter!) : undefined;

  return (
    <section className="plate book-description">
      <p className="plate__series">{GROUP_IMPRINT[character.group] ?? 'Of the Town'}</p>

      <Heading className="plate__name" id={headingId}>{character.name}</Heading>

      <hr className="plate__rule" />

      {epithet && <Biography id={character.id} full={epithet} className="plate__epithet" />}

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
          // A form the reader has not met yet is folded away with its chapter.
          <p className="plate__form" key={f.form}
            data-spoiler-from={f.firstChapter ? ordinalOf(f.firstChapter) : undefined}>
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
          {/* The patronymic is itself a disclosure for Smerdyakov, said once, late. */}
          <p className="plate__imprint" data-spoiler-from={patronymicFrom}>
            {character.patronymic} — child of {character.fatherName}
          </p>
        </>
      )}
    </section>
  );
}
