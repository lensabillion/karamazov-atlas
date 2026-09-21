/**
 * Links to the evidence: a chapter, and when a verbatim phrase is known, the
 * paragraph that contains it.
 *
 * The phrase travels in the URL hash (`#passage=…`). The reader's page finds
 * the paragraph, scrolls it into view and marks it. Browser text fragments
 * (`#:~:text=`) were tried first and rejected: Chrome only honours them on a
 * user-initiated navigation, and it will not match across the buttons the
 * reader draws round character names — so any quote containing a name, which
 * is most of them, silently failed.
 *
 * Every phrase stored in the curated data is checked by scripts/test-curated.ts
 * to fall inside a single paragraph of its chapter, split exactly as the
 * reader splits it (toParagraphs below).
 */

const PASSAGE_KEY = 'passage';

export function passageHref(chapter: string, quote?: string): string {
  return quote
    ? `/read/${chapter}#${PASSAGE_KEY}=${encodeURIComponent(quote)}`
    : `/read/${chapter}`;
}

/** Split a chapter's text into the paragraphs the reader renders. */
export function toParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\n/g, ' ').trim())
    .filter(Boolean);
}

/** Compare prose ignoring Gutenberg's italic underscores and line wrapping. */
function forMatch(s: string): string {
  return s.replace(/_/g, '').replace(/\s+/g, ' ').trim();
}

/** Index of the paragraph containing `quote`, or -1. */
export function findPassage(paragraphs: string[], quote: string): number {
  const q = forMatch(quote);
  if (!q) return -1;
  return paragraphs.findIndex((p) => forMatch(p).includes(q));
}

/** The phrase requested in a location hash, if any. */
export function passageFromHash(hash: string): string | null {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  return params.get(PASSAGE_KEY);
}
