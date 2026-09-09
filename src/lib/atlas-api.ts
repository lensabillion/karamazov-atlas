import 'server-only';

/**
 * Client for the Karamazov Atlas API (the Python service on Render).
 *
 * The frontend is deliberately able to run without it. Every page is prerendered
 * from committed data, so the only thing that reaches for the API is the chat
 * route's retrieval tool — and when `ATLAS_API_URL` is unset it falls back to
 * the local corpus search. That keeps local development and preview builds
 * working with no backend, and means an outage on Render degrades one feature
 * rather than taking the site down.
 */

export interface RemoteHit {
  chapter_id: string;
  cite: string;
  title: string;
  score: number;
  excerpt: string;
}

export const atlasApiUrl = () => process.env.ATLAS_API_URL?.replace(/\/$/, '') ?? null;

/**
 * Ranked full-text search via the API's FTS5 index.
 *
 * `before` is the spoiler axis: chapters carry an ordinal in reading order, so
 * an answer can be scoped to what the reader has actually read.
 * Returns null when the API is not configured or does not answer, so the caller
 * can fall back rather than fail.
 */
export async function remoteSearch(
  query: string,
  opts: { limit?: number; before?: number; signal?: AbortSignal } = {},
): Promise<RemoteHit[] | null> {
  const base = atlasApiUrl();
  if (!base) return null;

  const url = new URL(`${base}/search`);
  url.searchParams.set('q', query);
  url.searchParams.set('limit', String(opts.limit ?? 5));
  if (opts.before !== undefined) url.searchParams.set('before', String(opts.before));

  try {
    const res = await fetch(url, {
      signal: opts.signal ?? AbortSignal.timeout(4000),
      headers: { accept: 'application/json' },
      // Retrieval results are stable for a given corpus build.
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as RemoteHit[];
  } catch {
    // Timeout, DNS, cold start on a sleeping instance — all fall back.
    return null;
  }
}
