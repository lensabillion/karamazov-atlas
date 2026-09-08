'use client';

import type { NamedCharacter, Register } from '@/lib/names';

const ORDER: Register[] = ['formal', 'distanced', 'neutral', 'familiar', 'tender'];

const LABEL: Record<Register, string> = {
  formal: 'Formal',
  distanced: 'Distanced',
  neutral: 'Neutral',
  familiar: 'Familiar',
  tender: 'Tender',
};

/**
 * One character's names, laid out as a ladder from most distant to most intimate.
 * Register is ordinal, so it is shown by position and rung length — not colour.
 */
export default function NameKey({
  character,
  cites,
}: {
  character: NamedCharacter;
  /** Chapter id → human citation, e.g. "Bk V, ch. 2". Plain data: this crosses
   *  the server/client boundary, where functions cannot go. */
  cites?: Record<string, string>;
}) {
  const forms = [...character.forms].sort(
    (a, b) => ORDER.indexOf(a.register) - ORDER.indexOf(b.register),
  );

  return (
    <div className={`name-panel group-${character.group}`}>
      <div className="stack stack--tight">
        <p className="eyebrow">Called {character.forms.length} ways</p>
        <h3 className="subheading">{character.name}</h3>
        {character.patronymic && character.fatherName && (
          <p className="text-muted">
            <strong>{character.patronymic}</strong> means “child of {character.fatherName}”.
            Every time someone addresses {character.short} formally, they name the father.
          </p>
        )}
      </div>

      <div className="stack stack--tight">
        {forms.map((f) => {
          const step = ORDER.indexOf(f.register);
          return (
            <div className="form-row" key={f.form}>
              <span
                className="rung"
                style={{ width: `${((step + 1) / ORDER.length) * 100}%` }}
                aria-hidden="true"
              />
              <span
                className={
                  'form-name' +
                  (f.register === 'tender' ? ' form-name--tender' : '') +
                  (f.register === 'formal' ? ' form-name--formal' : '')
                }
              >
                {f.form}
              </span>
              <span className="meta">
                {LABEL[f.register]} — {f.gloss}
                {f.firstChapter && cites?.[f.firstChapter] ? ` First at ${cites[f.firstChapter]}.` : ''}
              </span>
              <span className="meta num">{f.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
