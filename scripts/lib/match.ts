/**
 * One span matcher, shared by every derived dataset.
 *
 * Review finding R3 (atlas-61hm): build-mentions and build-names each counted
 * aliases independently and then summed them, so a full name was counted again
 * as its short form. The two outputs disagreed — Dmitri 1,434 against 1,294,
 * Katerina 459 against 287 — and the inflated figures drove mark sizes and
 * register mixes, not just a decorative statistic.
 *
 * The rule here: every occurrence in the text belongs to exactly one form.
 * Matches are resolved longest-first and each source position is claimed once,
 * so "Dmitri Fyodorovitch" consumes the span and "Dmitri" cannot re-count it.
 * Both builders call this, so their totals agree by construction.
 */

export interface AliasSpec {
  /** Owner of this form — a character id. */
  owner: string;
  form: string;
}

export interface Occurrence {
  owner: string;
  form: string;
  start: number;
  end: number;
}

export const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Find every non-overlapping alias occurrence in `text`.
 * Longest form wins; positions are claimed once.
 */
export function findOccurrences(text: string, aliases: AliasSpec[]): Occurrence[] {
  const ordered = [...aliases].sort((a, b) => b.form.length - a.form.length);
  const claimed = new Uint8Array(text.length);
  const out: Occurrence[] = [];

  for (const { owner, form } of ordered) {
    const re = new RegExp(`\\b${escapeRe(form)}\\b`, 'g');
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const start = m.index;
      const end = start + m[0].length;
      let taken = false;
      for (let i = start; i < end; i++) {
        if (claimed[i]) { taken = true; break; }
      }
      if (taken) continue;
      for (let i = start; i < end; i++) claimed[i] = 1;
      out.push({ owner, form, start, end });
    }
  }
  return out.sort((a, b) => a.start - b.start);
}

/** Count occurrences per owner. */
export function countByOwner(occ: Occurrence[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const o of occ) out[o.owner] = (out[o.owner] ?? 0) + 1;
  return out;
}

/** Count occurrences per exact form. */
export function countByForm(occ: Occurrence[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const o of occ) out[o.form] = (out[o.form] ?? 0) + 1;
  return out;
}

/**
 * True when this module is the process entry point.
 *
 * Review finding R4 (atlas-8l09): the previous guard compared `import.meta.url`
 * with `file://${process.argv[1]}`. This project's path contains spaces, which
 * the URL percent-encodes and the raw path does not, so the comparison was
 * always false and `npm run corpus` exited successfully without rebuilding
 * anything. pathToFileURL does the encoding correctly.
 */
export async function isEntryPoint(moduleUrl: string): Promise<boolean> {
  const { pathToFileURL } = await import('node:url');
  const entry = process.argv[1];
  if (!entry) return false;
  return moduleUrl === pathToFileURL(entry).href;
}
