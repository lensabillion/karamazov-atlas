'use client';

import { useEffect, useState } from 'react';
import { CHAPTER_COUNT, type PlaceChapter } from '@/lib/reading-position';
import { useReadingPosition } from '@/lib/use-reading-position';
import { clearVerdicts, recordVerdict, useVerdicts } from '@/lib/use-verdicts';

/**
 * The verdict (atlas-o9w6): two questions, kept apart.
 *
 *   1. Who killed Fyodor Pavlovitch?
 *   2. Who is responsible for his death?
 *
 * The court answers the first with Dmitri and treats that as an answer to the
 * second; the elder answers the second with everyone. The reader can answer
 * either at any point, change either at any point, and every answer is kept
 * with the place in the book it was given at. The second question takes more
 * than one name, and should — that is the whole argument.
 */

export const KILLED_OPTIONS: { id: string; label: string }[] = [
  { id: 'dmitri', label: 'Dmitri' },
  { id: 'smerdyakov', label: 'Smerdyakov' },
  { id: 'ivan', label: 'Ivan' },
  { id: 'other', label: 'Someone else' },
];

export const RESPONSIBLE_OPTIONS: { id: string; label: string }[] = [
  { id: 'dmitri', label: 'Dmitri' },
  { id: 'smerdyakov', label: 'Smerdyakov' },
  { id: 'ivan', label: 'Ivan' },
  { id: 'fyodor', label: 'Fyodor himself' },
  { id: 'katerina', label: 'Katerina Ivanovna' },
  { id: 'grushenka', label: 'Grushenka' },
  { id: 'everyone', label: 'Everyone — “each of us is responsible to all”' },
];

export const labelOf = (id: string) =>
  [...KILLED_OPTIONS, ...RESPONSIBLE_OPTIONS].find((o) => o.id === id)?.label.split(' —')[0] ?? id;

export default function Verdict({ places }: { places: PlaceChapter[] }) {
  const records = useVerdicts();
  const position = useReadingPosition() ?? CHAPTER_COUNT;
  const last = records.at(-1);
  const [killed, setKilled] = useState<string | null>(null);
  const [responsible, setResponsible] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  // Start from the reader's latest answer, once it has been read from storage.
  useEffect(() => {
    if (!last) return;
    setKilled(last.killed);
    setResponsible(last.responsible);
  }, [last]);

  const place = places[position - 1];
  const unchanged = last && last.killed === killed
    && last.responsible.length === responsible.length
    && last.responsible.every((r) => responsible.includes(r));

  const toggle = (id: string) => {
    setSaved(false);
    setResponsible((cur) => (cur.includes(id) ? cur.filter((r) => r !== id) : [...cur, id]));
  };

  return (
    <form className="verdict book-description" aria-labelledby="verdict-title"
      onSubmit={(e) => {
        e.preventDefault();
        recordVerdict({ position, killed, responsible });
        setSaved(true);
      }}>
      <p className="plate__series">The two questions</p>
      <h2 className="verdict__title" id="verdict-title">Your verdict</h2>
      <hr className="plate__rule plate__rule--hair" />

      <fieldset className="verdict__question">
        <legend>1 · Who killed Fyodor Pavlovitch?</legend>
        <div className="verdict__options">
          {KILLED_OPTIONS.map((o) => (
            <label key={o.id} className="verdict__option">
              <input type="radio" name="killed" value={o.id} checked={killed === o.id}
                onChange={() => { setKilled(o.id); setSaved(false); }} />
              {o.label}
            </label>
          ))}
          <label className="verdict__option">
            <input type="radio" name="killed" value="" checked={killed === null}
              onChange={() => { setKilled(null); setSaved(false); }} />
            Not yet sure
          </label>
        </div>
      </fieldset>

      <fieldset className="verdict__question">
        <legend>2 · Who is responsible for his death? <span className="meta">Choose as many as you hold responsible.</span></legend>
        <div className="verdict__options">
          {RESPONSIBLE_OPTIONS.map((o) => (
            <label key={o.id} className="verdict__option">
              <input type="checkbox" checked={responsible.includes(o.id)} onChange={() => toggle(o.id)} />
              {o.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="verdict__actions">
        <button type="submit" className="button button--primary" disabled={Boolean(unchanged)}>
          {last ? 'Record this answer' : 'Give this answer'}
        </button>
        <p className="meta" aria-live="polite">
          {saved
            ? `Recorded at ${place?.cite ?? 'the end'}. Change it whenever the book changes your mind.`
            : `It will be kept with your place: ${position === CHAPTER_COUNT ? 'the whole book read' : place?.cite}.`}
        </p>
      </div>
      {records.length > 0 && (
        <p className="meta verdict__kept">
          {records.length} answer{records.length === 1 ? '' : 's'} kept in this browser.{' '}
          <button type="button" className="spoiler-note__show"
            onClick={() => { if (window.confirm('Forget every answer you have given?')) clearVerdicts(); }}>
            Forget them
          </button>
        </p>
      )}
    </form>
  );
}
