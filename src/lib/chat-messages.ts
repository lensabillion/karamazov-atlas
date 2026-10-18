import { z } from 'zod';

/**
 * What a client may send /api/chat, and nothing more.
 *
 * useChat posts the whole conversation back as UIMessage[], and that type is
 * wider than a reader needs. Its role union includes 'system', and an
 * assistant message may carry tool parts in the 'output-available' state.
 * Handed straight to convertToModelMessages, the first became a second
 * system prompt, appended after the atlas's rules and the spoiler scope; the
 * second became a tool result, "retrieved" text the model would cite that
 * never came from the novel; and a malformed part threw inside the converter
 * and surfaced as a 500 (deep review of 15 October 2026, H1).
 *
 * So the messages are parsed against this schema before anything else reads
 * them, and what reaches the model is exactly:
 *   - roles user and assistant;
 *   - text parts. Everything else the client echoes back (tool calls, step
 *     markers, reasoning, files) is dropped, so the model's own history
 *     reaches it as prose and nothing a client types is ever a tool result;
 *   - no message without text. An assistant turn that was all tool calls is
 *     dropped with its parts; a reader's message with no text is an error;
 *   - a reader's message first and last.
 * A failure is a 400 that names the first problem, never a 500.
 *
 * MAX_MESSAGES and MAX_INPUT_CHARS are checked by the route on the raw array
 * before this schema runs, so the parser never sees an oversized body.
 */

export const MAX_MESSAGES = 40;
export const MAX_INPUT_CHARS = 24_000;

export interface TextPart {
  type: 'text';
  text: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  parts: TextPart[];
}

/** One part as the client sent it: text is kept, anything else becomes null. */
const Part = z
  .object({ type: z.string(), text: z.unknown().optional() })
  .refine((p) => p.type !== 'text' || typeof p.text === 'string', {
    message: 'a text part must carry a string "text"',
    path: ['text'],
  })
  .transform((p): TextPart | null =>
    p.type === 'text' && typeof p.text === 'string' && p.text.trim() !== ''
      ? { type: 'text', text: p.text }
      : null,
  );

const Message = z
  .object({
    role: z.enum(['user', 'assistant']),
    parts: z.array(Part).transform((parts) => parts.filter((p): p is TextPart => p !== null)),
  })
  .refine((m) => m.role === 'assistant' || m.parts.length > 0, {
    message: "the reader's message has no text",
    path: ['parts'],
  });

const Messages = z
  .array(Message)
  .min(1, 'No messages supplied.')
  // An assistant turn that was all tool calls has nothing left to say.
  .transform((ms): ChatMessage[] => ms.filter((m) => m.parts.length > 0))
  .refine((ms) => ms[0]?.role === 'user', 'The first message must be from the reader.')
  .refine((ms) => ms[ms.length - 1]?.role === 'user', 'The last message must be from the reader.');

export type ParsedChatMessages =
  | { ok: true; messages: ChatMessage[] }
  | { ok: false; error: string };

/** The client's messages as the model may see them, or the first thing wrong with them. */
export function parseChatMessages(input: unknown): ParsedChatMessages {
  const result = Messages.safeParse(input);
  if (result.success) return { ok: true, messages: result.data };
  const issue = result.error.issues[0]!;
  const where = issue.path.length ? `messages.${issue.path.join('.')}: ` : '';
  return { ok: false, error: `Invalid messages: ${where}${issue.message}` };
}
