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
import { callerKey, check } from '@/lib/rate-limit';
import { getChapter, getChapterText, getCorpus, searchCorpus } from '@/lib/corpus';

export const maxDuration = 60;

/**
 * Cost controls for a public, unauthenticated endpoint.
 *
 * With ANTHROPIC_API_KEY set, anyone who can reach this route can spend money
 * on this account. Four bounds, in order of how much they actually guarantee:
 *
 *   1. MAX_OUTPUT_TOKENS  hard ceiling on what one request can generate
 *   2. MAX_INPUT_CHARS    hard ceiling on what one request can send
 *   3. stopWhen           hard ceiling on tool round-trips
 *   4. rate limit         per-instance, so a deterrent rather than a guarantee
 *
 * The first three bound the cost of any single request no matter how many get
 * through, which is why they matter more than the fourth. See lib/rate-limit.ts
 * for why the fourth is weaker than it looks on serverless.
 */
const RATE_LIMIT = Number(process.env.CHAT_RATE_LIMIT ?? 10);
const RATE_WINDOW_MS = Number(process.env.CHAT_RATE_WINDOW_MS ?? 60_000);
const MAX_MESSAGES = 40;
const MAX_INPUT_CHARS = 24_000;
const MAX_OUTPUT_TOKENS = 2_000;

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
  const limit = check(callerKey(req), { limit: RATE_LIMIT, windowMs: RATE_WINDOW_MS });
  const limitHeaders = {
    'RateLimit-Limit': String(RATE_LIMIT),
    'RateLimit-Remaining': String(limit.remaining),
    'RateLimit-Reset': String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
  };

  if (!limit.ok) {
    return Response.json(
      { error: `Too many requests. Try again in ${limit.retryAfter}s.` },
      { status: 429, headers: { ...limitHeaders, 'Retry-After': String(limit.retryAfter) } },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: 'ANTHROPIC_API_KEY is not set. Add it to .env.local and restart the dev server.' },
      { status: 503, headers: limitHeaders },
    );
  }

  let body: { messages?: UIMessage[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Malformed request body.' }, { status: 400, headers: limitHeaders });
  }

  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: 'No messages supplied.' }, { status: 400, headers: limitHeaders });
  }
  if (messages.length > MAX_MESSAGES) {
    return Response.json(
      { error: `Conversation too long (max ${MAX_MESSAGES} messages).` },
      { status: 413, headers: limitHeaders },
    );
  }

  // Bound what one request can send. Without this a single caller could pay to
  // push an arbitrarily large history through an expensive model.
  const size = JSON.stringify(messages).length;
  if (size > MAX_INPUT_CHARS) {
    return Response.json(
      { error: `Request too large (${size} chars, max ${MAX_INPUT_CHARS}).` },
      { status: 413, headers: limitHeaders },
    );
  }

  const result = streamText({
    model: anthropic('claude-opus-5'),
    system: SYSTEM,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(6),
    maxOutputTokens: MAX_OUTPUT_TOKENS,
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
    headers: limitHeaders,
  });
}
