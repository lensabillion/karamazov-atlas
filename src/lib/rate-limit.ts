/**
 * A sliding-window rate limiter for the chat endpoint.
 *
 * WHAT THIS DOES AND DOES NOT DO — read before trusting it.
 *
 * State lives in the module, so on a serverless platform each running instance
 * keeps its own window. Vercel may run several instances concurrently, so the
 * effective ceiling is (instances x limit) rather than the limit, and a cold
 * start resets the window. It therefore raises the cost of casual abuse; it is
 * NOT a hard cap on spend, and must not be described as one.
 *
 * The hard caps are elsewhere and matter more: a bound on request size, a bound
 * on output tokens, and a bound on tool steps. Those bound the cost of a single
 * request regardless of how many get through.
 *
 * For a real global limit, swap `check` for a Redis-backed implementation
 * (@upstash/ratelimit is the usual choice on Vercel). The signature below is
 * deliberately the same shape, so that swap touches this file only.
 */

export interface RateLimitResult {
  ok: boolean;
  /** Requests left in the current window. */
  remaining: number;
  /** Unix ms when the window frees up. */
  resetAt: number;
  /** Seconds to wait, for the Retry-After header. */
  retryAfter: number;
}

interface Window {
  /** Timestamps of recent hits, oldest first. */
  hits: number[];
}

const buckets = new Map<string, Window>();

/** Drop buckets nobody has touched for a while, so the map cannot grow forever. */
function sweep(now: number, windowMs: number) {
  if (buckets.size < 512) return;
  for (const [key, w] of buckets) {
    if (w.hits.length === 0 || now - w.hits[w.hits.length - 1]! > windowMs * 2) {
      buckets.delete(key);
    }
  }
}

export function check(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
  now: number = Date.now(),
): RateLimitResult {
  sweep(now, windowMs);

  const cutoff = now - windowMs;
  const bucket = buckets.get(key) ?? { hits: [] };

  // Sliding window: discard anything that has aged out, then judge what is left.
  const hits = bucket.hits.filter((t) => t > cutoff);

  if (hits.length >= limit) {
    const oldest = hits[0]!;
    const resetAt = oldest + windowMs;
    buckets.set(key, { hits });
    return {
      ok: false,
      remaining: 0,
      resetAt,
      retryAfter: Math.max(1, Math.ceil((resetAt - now) / 1000)),
    };
  }

  hits.push(now);
  buckets.set(key, { hits });
  return {
    ok: true,
    remaining: limit - hits.length,
    resetAt: now + windowMs,
    retryAfter: 0,
  };
}

/**
 * Best-effort caller identity.
 *
 * Behind a proxy the socket address is the proxy, so the forwarded headers are
 * what identify the caller. They are also spoofable by anyone talking to the
 * origin directly — another reason this is a deterrent rather than a guarantee.
 * Vercel sets x-forwarded-for itself and strips client-supplied values.
 */
export function callerKey(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

/** Reset state between tests. */
export function __reset() {
  buckets.clear();
}
