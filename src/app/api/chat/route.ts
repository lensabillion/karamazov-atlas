import { anthropic } from '@ai-sdk/anthropic';
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  toUIMessageStream,
} from 'ai';
import { MAX_INPUT_CHARS, MAX_MESSAGES, parseChatMessages } from '@/lib/chat-messages';
import { chatTools } from '@/lib/chat-tools';
import { getCorpus } from '@/lib/corpus';
import { callerKey, check, envInt } from '@/lib/rate-limit';
import { parsePosition } from '@/lib/reading-position';

export const maxDuration = 60;

/**
 * Cost controls for a public, unauthenticated endpoint.
 *
 * With ANTHROPIC_API_KEY set, anyone who can reach this route can spend money
 * on this account. The body is parsed against a schema before anything else
 * reads it (lib/chat-messages.ts): roles user and assistant, text parts only,
 * so a caller can neither append a system prompt of their own nor hand the
 * model a forged tool result. Then five bounds, in order of how much they
 * actually guarantee:
 *
 *   1. MAX_OUTPUT_TOKENS x MAX_STEPS   what one request can generate: 2,000 x 4
 *   2. MAX_INPUT_CHARS                 what one request can send
 *   3. TOOL_OUTPUT_CHARS               what the tools can hand back, all steps combined
 *   4. MAX_MESSAGES                    how long the history can be
 *   5. rate limit                      per-instance, so a deterrent rather than a guarantee
 *
 * The first four hold PER REQUEST, not per step. Before the deep review of
 * 15 October 2026 (H2) the output cap was per model call with six calls
 * allowed, and readChapter could return 24,000 characters as often as it was
 * asked, so the real ceilings were the context window and maxDuration. See
 * lib/chat-tools.ts for the budget and lib/rate-limit.ts for why the fifth is
 * weaker than it looks on serverless.
 */
const RATE_LIMIT = envInt('CHAT_RATE_LIMIT', 10);
const RATE_WINDOW_MS = envInt('CHAT_RATE_WINDOW_MS', 60_000);
const MAX_OUTPUT_TOKENS = 2_000;
const MAX_STEPS = 4;

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

/**
 * atlas-zbt8. When the reader has set a place, the tools cannot reach past it —
 * but the model has read the novel, so it is also told not to volunteer what it
 * knows. Retrieval scoping stops the text leaking; this stops the model.
 */
function scopeRule(through: number): string {
  const ch = getCorpus().chapters[through - 1]!;
  return `

The reader has read up to and including ${ch.cite} ("${ch.title}") and no further.
- Your tools only return chapters up to that point. Answer from those alone.
- Do not reveal, hint at, or confirm anything that happens later: not who dies, who
  is guilty, what anyone confesses, or how the trial ends. This holds even if you
  know it from outside the tools.
- If a question can only be answered by later chapters, say that the novel takes it
  up later, and stop there.`;
}

export async function POST(req: Request) {
  // The limiter is judged first, before the key and before the body is read,
  // so a flood of bad requests costs the same as a flood of good ones: nothing.
  const limit = check(callerKey(req), { limit: RATE_LIMIT, windowMs: RATE_WINDOW_MS });
  const limitHeaders = {
    'RateLimit-Limit': String(RATE_LIMIT),
    'RateLimit-Remaining': String(limit.remaining),
    'RateLimit-Reset': String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
  };
  const refuse = (status: number, error: string, headers: Record<string, string> = {}) =>
    Response.json({ error }, { status, headers: { ...limitHeaders, ...headers } });

  if (!limit.ok) {
    return refuse(429, `Too many requests. Try again in ${limit.retryAfter}s.`, {
      'Retry-After': String(limit.retryAfter),
    });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return refuse(503, 'ANTHROPIC_API_KEY is not set. Add it to .env.local and restart the dev server.');
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return refuse(400, 'Malformed request body.');
  }
  if (body === null || typeof body !== 'object') return refuse(400, 'Malformed request body.');
  const { messages: raw, position } = body as { messages?: unknown; position?: unknown };

  if (!Array.isArray(raw) || raw.length === 0) return refuse(400, 'No messages supplied.');
  if (raw.length > MAX_MESSAGES) {
    return refuse(413, `Conversation too long (max ${MAX_MESSAGES} messages).`);
  }

  // Bound what one request can send, before the schema does any work on it.
  // Without this a single caller could pay to push an arbitrarily large history
  // through an expensive model.
  const size = JSON.stringify(raw).length;
  if (size > MAX_INPUT_CHARS) {
    return refuse(413, `Request too large (${size} chars, max ${MAX_INPUT_CHARS}).`);
  }

  const parsed = parseChatMessages(raw);
  if (!parsed.ok) return refuse(400, parsed.error);

  // Null means the whole book. Anything malformed is treated as the whole book
  // rather than rejected: the scope is a courtesy to the reader, not a security
  // boundary, and the answer header on the page states which scope applied.
  const through = parsePosition(position == null ? null : String(position)) ?? undefined;

  const result = streamText({
    model: anthropic('claude-opus-5'),
    system: through === undefined ? SYSTEM : SYSTEM + scopeRule(through),
    messages: await convertToModelMessages(parsed.messages),
    stopWhen: stepCountIs(MAX_STEPS),
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    providerOptions: {
      anthropic: { thinking: { type: 'adaptive' }, effort: 'high' },
    },
    tools: chatTools(through).tools,
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
    headers: limitHeaders,
  });
}
