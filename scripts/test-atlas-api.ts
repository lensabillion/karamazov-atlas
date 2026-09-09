/**
 * Tests for the API client, and above all for its fallback.
 *
 * When ATLAS_API_URL is unset, or Render is down, or the request times out,
 * `remoteSearch` must return null so the chat route quietly uses local search.
 * That fallback is what keeps the site working during a backend outage, and
 * nothing was checking it.
 */
export {}; // top-level await requires this file to be a module
let failed = 0;
const check = (name: string, cond: boolean, detail = '') => {
  if (!cond) failed++;
  console.log(`${cond ? '  ok  ' : ' FAIL '} ${name}${cond ? '' : ` — ${detail}`}`);
};

const realFetch = globalThis.fetch;
const stub = (impl: typeof globalThis.fetch) => { globalThis.fetch = impl; };
const restore = () => { globalThis.fetch = realFetch; };

/** Import fresh so the module re-reads process.env each time. */
async function load() {
  const mod = await import(`../src/lib/atlas-api.ts?t=${Math.random()}`);
  return mod as typeof import('../src/lib/atlas-api.ts');
}

const HIT = [{ chapter_id: 'b05-c05', cite: 'Bk V, ch. 5', title: 'The Grand Inquisitor', score: 5.6, excerpt: '…' }];

// --- unconfigured -----------------------------------------------------------
delete process.env.ATLAS_API_URL;
let api = await load();
check('no API configured returns null', (await api.remoteSearch('x')) === null);
check('atlasApiUrl is null when unset', api.atlasApiUrl() === null);

// --- configured, healthy ----------------------------------------------------
process.env.ATLAS_API_URL = 'https://example.test/';
api = await load();
check('trailing slash is trimmed', api.atlasApiUrl() === 'https://example.test');

let seen: string | null = null;
stub(async (input) => {
  seen = String(input);
  return new Response(JSON.stringify(HIT), { status: 200, headers: { 'content-type': 'application/json' } });
});
const hits = await api.remoteSearch('Inquisitor', { limit: 3 });
check('a good response is parsed', Array.isArray(hits) && hits!.length === 1);
check('the citation survives', hits?.[0]?.cite === 'Bk V, ch. 5');
check('query is sent', String(seen).includes('q=Inquisitor'));
check('limit is sent', String(seen).includes('limit=3'));

// --- spoiler scope ----------------------------------------------------------
await api.remoteSearch('x', { before: 20 });
check('before is forwarded for spoiler scoping', String(seen).includes('before=20'));
await api.remoteSearch('x');
check('before is omitted when not asked for', !String(seen).includes('before='));

// --- failure modes, all of which must fall back -----------------------------
stub(async () => new Response('nope', { status: 500 }));
check('a 500 falls back', (await api.remoteSearch('x')) === null);

stub(async () => new Response('nope', { status: 404 }));
check('a 404 falls back', (await api.remoteSearch('x')) === null);

stub(async () => { throw new TypeError('network down'); });
check('a network error falls back', (await api.remoteSearch('x')) === null);

stub(async () => { const e = new Error('timed out'); e.name = 'TimeoutError'; throw e; });
check('a timeout falls back', (await api.remoteSearch('x')) === null);

stub(async () => new Response('not json', { status: 200 }));
check('an unparseable body falls back', (await api.remoteSearch('x')) === null);

restore();
console.log(failed === 0 ? '\nAPI client checks passed.' : `\n${failed} check(s) failed`);
process.exit(failed === 0 ? 0 : 1);
