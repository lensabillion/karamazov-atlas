/**
 * Reading position: how far into the novel the reader says they have read.
 *
 * The atlas is written for people who have finished the book, so the default
 * is the whole book. A reader part-way through sets their place once, in the
 * nav, and every view folds away what lies beyond it (atlas-fn3v).
 *
 * HOW THE FOLDING WORKS
 * Every page is prerendered, so the server cannot know the reader's place.
 * Rendering everything and hiding it after hydration would flash the spoilers
 * on every load. Instead each piece of gated content carries its chapter's
 * reading-order position as `data-spoiler-from`, and a placeholder carries
 * `data-spoiler-note`. An inline script in <head> reads the saved place and
 * writes one stylesheet before first paint: content from later chapters is
 * hidden, their placeholders are shown. Changing the place rewrites that
 * stylesheet, so a gate is CSS, and React never has to agree about it during
 * hydration.
 *
 * This module is shared by the server layout (for the script) and client
 * components (for the store), so it imports nothing from either side.
 */

export const CHAPTER_COUNT = 96;
export const POSITION_KEY = 'karamazov-atlas:position';
export const GATE_STYLE_ID = 'spoiler-gate';

/**
 * The gate for claims that only hold for someone who has finished: full-book
 * biographies, the verdict, the ending. Hidden at every place short of the end.
 */
export const WHOLE_BOOK = CHAPTER_COUNT;

/** A saved place, or null for the whole book. Anything unreadable is the whole book. */
export function parsePosition(raw: string | null | undefined): number | null {
  const n = Number.parseInt(raw ?? '', 10);
  return Number.isInteger(n) && n >= 1 && n < CHAPTER_COUNT ? n : null;
}

/** The stylesheet that folds away everything after `position`. Empty for the whole book. */
export function gateCss(position: number | null): string {
  if (position === null) return '';
  const hide: string[] = [];
  const show: string[] = [];
  for (let k = position + 1; k <= CHAPTER_COUNT; k++) {
    hide.push(`[data-spoiler-from="${k}"]`);
    show.push(`[data-spoiler-note="${k}"]`);
  }
  return `${hide.join(',')}{display:none!important}${show.join(',')}{display:revert!important}`;
}

/**
 * Runs synchronously in <head>, before the body is parsed. Must stay ES5,
 * self-contained, and silent on failure: private windows and blocked storage
 * throw, and the right answer then is the whole book.
 */
export const GATE_SCRIPT = `(function(){try{var p=parseInt(localStorage.getItem(${JSON.stringify(POSITION_KEY)})||"",10);if(!(p>=1&&p<${CHAPTER_COUNT}))return;var a=[],b=[];for(var k=p+1;k<=${CHAPTER_COUNT};k++){a.push('[data-spoiler-from="'+k+'"]');b.push('[data-spoiler-note="'+k+'"]');}var s=document.createElement("style");s.id=${JSON.stringify(GATE_STYLE_ID)};s.textContent=a.join(",")+"{display:none!important}"+b.join(",")+"{display:revert!important}";document.head.appendChild(s);document.documentElement.setAttribute("data-position",String(p));}catch(e){}})();`;

/** Compact chapter list the client needs for the control and for labels. */
export interface PlaceChapter {
  /** 1-based reading order. */
  ordinal: number;
  id: string;
  cite: string;
  title: string;
  book: string;
}
