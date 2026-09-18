/**
 * Build-time enrichment: read each chapter and extract typed events, themes and
 * relations with chapter provenance. Writes data/entities.json.
 *
 * This is a batch job, never a runtime dependency — the app ships the committed
 * output. Resumable: chapters already present in the output file are skipped, so
 * an interrupted run costs nothing to restart.
 *
 *   ANTHROPIC_API_KEY=sk-ant-... npm run extract
 *   npm run extract -- --limit 5      # try it on the first five chapters
 */
import { anthropic } from '@ai-sdk/anthropic';
import { Output, generateText } from 'ai';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import type { Corpus } from './parse-corpus.ts';
import { isVerbatim } from './lib/verbatim.ts';

const DATA = join(process.cwd(), 'data');
const OUT = join(DATA, 'entities.json');

const ChapterExtraction = z.object({
  summary: z.string().describe('One sentence, plain and concrete, on what happens.'),
  events: z
    .array(
      z.object({
        description: z.string().describe('A single thing that happens, stated plainly.'),
        participants: z.array(z.string()).describe('Character names as the translation spells them'),
        consequence: z.string().describe('What this causes later, or "" if self-contained'),
      }),
    )
    .max(6),
  relations: z
    .array(
      z.object({
        from: z.string(),
        /** A verb phrase: taught, killed, accuses, loves, owes money to. */
        type: z.string(),
        to: z.string(),
        evidence: z.string().describe('A short phrase from the chapter supporting this'),
      }),
    )
    .max(8)
    .describe('Typed directed relations asserted or established in THIS chapter'),
  themes: z.array(z.string()).max(4).describe('Abstract concerns this chapter carries'),
  keyQuote: z
    .object({
      text: z.string().describe('A quotation copied EXACTLY from the chapter, under 25 words'),
      speaker: z.string(),
    })
    .nullable(),
});

type ChapterExtraction = z.infer<typeof ChapterExtraction>;

interface Entities {
  model: string;
  generatedAt: string;
  chapters: Record<string, ChapterExtraction>;
  /** Chapters whose keyQuote failed verification and was dropped; `--redo-dropped` retries them. */
  quotesDropped?: string[];
}


const CONCURRENCY = 4;

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error(
      'ANTHROPIC_API_KEY is not set.\n' +
        'This script is the only part of the project that needs it — the app runs without.\n' +
        '  export ANTHROPIC_API_KEY=sk-ant-...',
    );
    process.exit(1);
  }

  const limitArg = process.argv.indexOf('--limit');
  const limit = limitArg === -1 ? Infinity : Number(process.argv[limitArg + 1]);

  const corpus: Corpus = JSON.parse(readFileSync(join(DATA, 'corpus.json'), 'utf8'));
  const existing: Entities = existsSync(OUT)
    ? JSON.parse(readFileSync(OUT, 'utf8'))
    : { model: 'claude-opus-5', generatedAt: new Date().toISOString(), chapters: {} };

  // --redo-dropped retries the chapters whose quotation failed verification.
  if (process.argv.includes('--redo-dropped')) {
    for (const id of existing.quotesDropped ?? []) delete existing.chapters[id];
  }

  const todo = corpus.chapters
    .filter((c) => !existing.chapters[c.id])
    .slice(0, limit === Infinity ? undefined : limit);

  if (todo.length === 0) {
    console.log('nothing to do — every chapter is already extracted');
    return;
  }
  console.log(`extracting ${todo.length} chapter(s) with claude-opus-5, ${CONCURRENCY} at a time`);

  let done = 0;
  let tokensIn = 0;
  let tokensOut = 0;
  const queue = [...todo];

  const worker = async () => {
    while (queue.length > 0) {
      const ch = queue.shift();
      if (!ch) break;
      const text = readFileSync(join(DATA, 'chapters', `${ch.id}.txt`), 'utf8');
      try {
        const { output, usage } = await generateText({
          model: anthropic('claude-opus-5'),
          maxOutputTokens: 8000,
          providerOptions: { anthropic: { thinking: { type: 'adaptive' }, effort: 'medium' } },
          output: Output.object({ schema: ChapterExtraction }),
          system:
            'You extract structure from a chapter of The Brothers Karamazov (Garnett ' +
            'translation). Use only what this chapter contains — do not import knowledge of ' +
            'later chapters. Spell names as the translation does. Any quotation must be ' +
            'copied exactly from the text given; if no short quotation fits, return null.',
          prompt: `Chapter: ${ch.title} (${ch.cite}, from Book ${ch.bookNum}. ${ch.bookTitle})\n\n${text}`,
        });
        // The schema asks for a verbatim quotation, the field most likely to
        // drift. Keep it only if it really is in the chapter (atlas-94i4).
        const quoteOk = !output.keyQuote || isVerbatim(output.keyQuote.text, text);
        if (!quoteOk) {
          console.warn(`  ${ch.cite}: keyQuote not found verbatim, dropped: "${output.keyQuote!.text}"`);
          output.keyQuote = null;
          existing.quotesDropped = [...new Set([...(existing.quotesDropped ?? []), ch.id])];
        } else {
          existing.quotesDropped = (existing.quotesDropped ?? []).filter((id) => id !== ch.id);
        }
        existing.chapters[ch.id] = output;
        done++;
        tokensIn += usage.inputTokens ?? 0;
        tokensOut += usage.outputTokens ?? 0;
        console.log(`  [${done}/${todo.length}] ${ch.cite} — ${ch.title} · ${usage.inputTokens} in / ${usage.outputTokens} out${quoteOk ? '' : ' · quote dropped'}`);
        // Write as we go so an interrupted run keeps its work.
        writeFileSync(OUT, JSON.stringify(existing, null, 2));
      } catch (err) {
        console.error(`  FAILED ${ch.cite}: ${(err as Error).message}`);
      }
    }
  };

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  existing.generatedAt = new Date().toISOString();
  writeFileSync(OUT, JSON.stringify(existing, null, 2));
  console.log(`\nwrote ${Object.keys(existing.chapters).length} chapters to data/entities.json`);
  console.log(`this run: ${tokensIn.toLocaleString()} input tokens, ${tokensOut.toLocaleString()} output tokens`);
}

main();
