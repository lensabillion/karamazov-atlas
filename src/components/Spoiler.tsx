'use client';

import { useState } from 'react';

/**
 * Content that belongs to a later chapter than the reader may have reached.
 *
 * Rendered in full on the server; the pre-paint gate stylesheet (see
 * lib/reading-position.ts) hides it and shows the note instead when the
 * reader's place is earlier than `from`. Revealing one item drops its gate
 * attribute, so it stays revealed until the page is left.
 *
 * The wrapper is `display: contents`, so gating never changes the layout of
 * whatever grid or flow the content sits in.
 */
export default function Spoiler({
  from,
  cite,
  children,
  what = 'This',
}: {
  /** 1-based reading-order position of the chapter the content depends on. */
  from: number;
  /** Where it comes from, for the note; omit for whole-book material. */
  cite?: string;
  children: React.ReactNode;
  /** What is folded away, for the note: “A biography”, “This scene”. */
  what?: string;
}) {
  const [revealed, setRevealed] = useState(false);
  if (revealed) return <>{children}</>;
  return (
    <>
      <div className="spoiler" data-spoiler-from={from}>{children}</div>
      <p className="spoiler-note meta" data-spoiler-note={from}>
        {what} is folded away: it comes from {cite ?? 'later in the book'}, past your place.{' '}
        <button type="button" className="spoiler-note__show" onClick={() => setRevealed(true)}>
          Show it anyway
        </button>
      </p>
    </>
  );
}
