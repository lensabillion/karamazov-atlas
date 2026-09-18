import { CHARACTER_INTRODUCTIONS } from '@/lib/character-biographies';
import { getChapter, ordinalOf } from '@/lib/corpus';
import { WHOLE_BOOK } from '@/lib/reading-position';

/**
 * A person's line, as much of it as the reader's place allows (atlas-fn3v).
 *
 *   finished             the full-book biography
 *   met, not finished    who they are when first met
 *   not yet met          only where they first appear
 *
 * Pure markup: the three versions are all rendered, and the gate stylesheet
 * (lib/reading-position.ts) shows exactly one before first paint. The middle
 * one sits inside a wrapper gated at the meeting chapter, because a single
 * element cannot be both shown before the end and hidden before the meeting.
 */
export default function Biography({
  id,
  full,
  as = 'p',
  className,
}: {
  id: string;
  /** The full-book line. */
  full: string;
  as?: 'p' | 'span';
  className?: string;
}) {
  const Tag = as;
  const Wrap = as === 'p' ? 'div' : 'span';
  const meeting = CHARACTER_INTRODUCTIONS[id];
  if (!meeting) return <Tag className={className}>{full}</Tag>;

  const met = ordinalOf(meeting.chapter);
  const cite = getChapter(meeting.chapter)?.cite ?? meeting.chapter;
  const note = [className, 'spoiler-note'].filter(Boolean).join(' ');

  return (
    <>
      <Tag className={className} data-spoiler-from={WHOLE_BOOK}>{full}</Tag>
      <Wrap className="spoiler" data-spoiler-from={met}>
        <Tag className={note} data-spoiler-note={WHOLE_BOOK}>{meeting.intro}</Tag>
      </Wrap>
      <Tag className={note} data-spoiler-note={met}>Not yet met at your place in the book: first appears in {cite}.</Tag>
    </>
  );
}
