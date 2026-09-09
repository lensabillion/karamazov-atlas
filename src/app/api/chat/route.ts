import { anthropic } from '@ai-sdk/anthropic';
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  tool,
  toUIMessageStream,
  type UIMessage,
} from 'ai';
import { z } from 'zod';
import { remoteSearch } from '@/lib/atlas-api';
import { getChapter, getChapterText, getCorpus, searchCorpus } from '@/lib/corpus';

export const maxDuration = 60;

const SYSTEM = `You answer questions about Dostoyevsky's The Brothers Karamazov using ONLY the
text of the novel, retrieved through your tools.

Rules:
- Always call searchNovel before answering a question about what happens in the novel.
  Call it more than once with different phrasings if the first result is thin.
- Ground every claim in retrieved text. Cite as (Bk V, ch. 5) using the cite string the
  tool returns. Quote sparingly — a line or two — and never invent a quotation.
- If the retrieved passages do not support an answer, say so plainly rather than filling
  the gap from memory. The reader can check you against the text, so being wrong is worse
  than being incomplete.
- The translation is Constance Garnett's. Use its spellings (Fyodor Pavlovitch, Alyosha,
  Smerdyakov, Grushenka).
- Be concise and concrete. No throat-clearing.`;

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: 'ANTHROPIC_API_KEY is not set. Add it to .env.local and restart the dev server.' },
      { status: 503 },
    );
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: anthropic('claude-opus-5'),
    system: SYSTEM,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(6),
    providerOptions: {
      anthropic: { thinking: { type: 'adaptive' }, effort: 'high' },
    },
    tools: {
      searchNovel: tool({
        description:
          'Search the full text of the novel. Returns the best-matching chapters with an ' +
          'excerpt around the match and a citation string.',
        inputSchema: z.object({
          query: z.string().describe('Words or a phrase to look for in the novel'),
        }),
        execute: async ({ query }) => {
          // Prefer the API's FTS5 index when it is configured; fall back to the
          // local scan so the route works with no backend deployed.
          const remote = await remoteSearch(query, { limit: 5 });
          if (remote) {
            return remote.map((h) => ({
              cite: h.cite,
              title: h.title,
              id: h.chapter_id,
              excerpt: h.excerpt.slice(0, 1400),
            }));
          }
          const hits = searchCorpus(query, 5);
          return hits.map((h) => ({
            cite: h.chapter.cite,
            title: h.chapter.title,
            book: h.chapter.bookTitle,
            id: h.chapter.id,
            excerpt: h.excerpt.slice(0, 1400),
          }));
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
          return {
            cite: chapter.cite,
            title: chapter.title,
            // Cap the payload; full chapters run to 9k words.
            text: getChapterText(id).slice(0, 24000),
          };
        },
      }),
      listChapters: tool({
        description: 'List every chapter with its id, title and citation. Use to orient yourself.',
        inputSchema: z.object({}),
        execute: async () =>
          getCorpus().chapters.map((c) => ({ id: c.id, cite: c.cite, title: c.title })),
      }),
    },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
