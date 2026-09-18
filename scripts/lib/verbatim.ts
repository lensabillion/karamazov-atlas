/**
 * Is `quote` in the chapter, word for word? Compared on words alone: the
 * model wraps quotations in its own marks and straightens curly apostrophes
 * ("You're" for "You’re"), which dropped six genuine quotes in the first run.
 */
export function isVerbatim(quote: string, chapterText: string): boolean {
  const words = (s: string) =>
    s.toLowerCase().replace(/[’‘]/g, "'").replace(/[_“”"«»]/g, ' ').replace(/[^a-z0-9']+/g, ' ').trim();
  const q = words(quote);
  return q.length > 0 && words(chapterText).includes(q);
}

