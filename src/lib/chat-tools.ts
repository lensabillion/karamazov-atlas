import 'server-only';
import { tool } from 'ai';
import { z } from 'zod';
import { getChapter, getChapterText, getCorpus, ordinalOf, searchCorpus } from './corpus';

/**
 * The three tools /api/chat gives the model, on one budget per request.
 *
 * Every tool result is resent to the model on every later step, so the
 * cost of a request grows with the total text the tools hand back, not with
 * any one call. Before the deep review of 15 October 2026 (H2) that total
 * was unbounded: readChapter returned up to 24,000 characters as often as it
 * was asked, across six steps, and the only real ceilings were the context
 * window and the route's maxDuration.
 *
 * Now each request gets a budget of TOOL_OUTPUT_CHARS, shared by all three
 * tools. Text is charged as it is returned, cut where the budget runs out,
 * and once the budget is spent every tool answers with an error that tells
 * the model to work from what it already has. The invariant the tests hold:
 * the characters returned across a request never exceed TOOL_OUTPUT_CHARS.
 *
 * The scope gate (atlas-zbt8) is unchanged: when the reader has set a place,
 * nothing past it is returned, and a refused read costs nothing.
 */

/** Characters of retrieved text one request may receive, all steps and tools combined. */
export const TOOL_OUTPUT_CHARS = 48_000;
/** Characters of chapter text one readChapter call returns at most; chapters run to 51,000. */
export const CHAPTER_READ_CHARS = 24_000;
/** Characters of excerpt per search hit. */
export const EXCERPT_CHARS = 1_400;
const SEARCH_HITS = 5;

export const BUDGET_SPENT =
  'The retrieval budget for this request is spent. Answer from what you have already ' +
  'read, or say that the text you have does not settle it.';

export interface ToolBudget {
  readonly limit: number;
  /** Characters charged so far. */
  readonly spent: number;
}

export function chatTools(through?: number) {
  let spent = 0;
  const room = () => TOOL_OUTPUT_CHARS - spent;

  /** As much of `text` as the budget allows, charged for. */
  const take = (text: string): string => {
    const out = text.slice(0, Math.max(0, room()));
    spent += out.length;
    return out;
  };

  const tools = {
    searchNovel: tool({
      description:
        'Search the full text of the novel. Returns the best-matching chapters with an ' +
        'excerpt around the match and a citation string.',
      inputSchema: z.object({
        query: z.string().describe('Words or a phrase to look for in the novel'),
      }),
      execute: async ({ query }) => {
        if (room() <= 0) return { error: BUDGET_SPENT };
        const hits = searchCorpus(query, SEARCH_HITS, through).map((h) => ({
          cite: h.chapter.cite,
          title: h.chapter.title,
          book: h.chapter.bookTitle,
          id: h.chapter.id,
          excerpt: h.excerpt,
        }));
        return hits.map((h) => {
          const want = h.excerpt.slice(0, EXCERPT_CHARS);
          const excerpt = take(want);
          return excerpt.length < want.length ? { ...h, excerpt, truncated: true } : { ...h, excerpt };
        });
      },
    }),

    readChapter: tool({
      description:
        'Read a full chapter by its id (for example "b05-c05" for Book V chapter 5). ' +
        'Use after searchNovel when you need more than the excerpt.',
      inputSchema: z.object({
        id: z.string().describe('Chapter id such as b05-c05'),
      }),
      execute: async ({ id }) => {
        const chapter = getChapter(id);
        if (!chapter) return { error: `No chapter ${id}` };
        if (through !== undefined && ordinalOf(id) > through) {
          return { error: `${chapter.cite} is past the reader's place. Do not describe it.` };
        }
        if (room() <= 0) return { error: BUDGET_SPENT };
        const full = getChapterText(id);
        const want = full.slice(0, CHAPTER_READ_CHARS);
        const text = take(want);
        return {
          cite: chapter.cite,
          title: chapter.title,
          text,
          ...(text.length < full.length ? { truncated: true } : {}),
          ...(text.length < want.length
            ? { note: 'Cut short: the retrieval budget for this request is spent.' }
            : {}),
        };
      },
    }),

    listChapters: tool({
      description: 'List every chapter with its id, title and citation. Use to orient yourself.',
      inputSchema: z.object({}),
      execute: async () => {
        const rows = getCorpus()
          .chapters.slice(0, through ?? undefined)
          .map((c) => ({ id: c.id, cite: c.cite, title: c.title }));
        // The list is never cut, so it is charged whole or refused whole.
        const size = JSON.stringify(rows).length;
        if (size > room()) return { error: BUDGET_SPENT };
        spent += size;
        return rows;
      },
    }),
  };

  const budget: ToolBudget = {
    limit: TOOL_OUTPUT_CHARS,
    get spent() {
      return spent;
    },
  };

  return { tools, budget };
}
