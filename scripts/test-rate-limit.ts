/**
 * Tests for the chat rate limiter.
 *
 * `check` takes an explicit `now`, so window behaviour is tested deterministically
 * rather than with sleeps.
 */
import { __reset, callerKey, check } from '../src/lib/rate-limit.ts';

let failed = 0;
function assert(name: string, cond: boolean, detail = '') {
  if (!cond) failed++;
  console.log(`${cond ? '  ok  ' : ' FAIL '} ${name}${cond ? '' : ` — ${detail}`}`);
}

const OPTS = { limit: 3, windowMs: 1000 };

__reset();
const first = check('a', OPTS, 0);
assert('first request passes', first.ok);
assert('remaining counts down', first.remaining === 2, `got ${first.remaining}`);

check('a', OPTS, 10);
const third = check('a', OPTS, 20);
assert('third request still passes', third.ok);
assert('no allowance left', third.remaining === 0, `got ${third.remaining}`);

const fourth = check('a', OPTS, 30);
assert('fourth request is blocked', !fourth.ok);
assert('retryAfter is a positive whole number of seconds',
  Number.isInteger(fourth.retryAfter) && fourth.retryAfter >= 1, `got ${fourth.retryAfter}`);

__reset();
check('b', OPTS, 0);
check('b', OPTS, 1);
check('b', OPTS, 2);
assert('blocked while the window holds', !check('b', OPTS, 500).ok);
assert('window SLIDES rather than resetting on a fixed boundary',
  check('b', OPTS, 1001).ok, 'the oldest hit should have aged out');

__reset();
check('c', OPTS, 0); check('c', OPTS, 0); check('c', OPTS, 0);
assert('one caller cannot exhaust another', check('d', OPTS, 0).ok);
assert('the exhausted caller is still blocked', !check('c', OPTS, 0).ok);

__reset();
assert('forwarded-for identifies the caller',
  callerKey(new Request('http://x', { headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' } })) === '1.2.3.4');
assert('a proxy chain uses the client, not the proxy',
  callerKey(new Request('http://x', { headers: { 'x-forwarded-for': '9.9.9.9, 10.0.0.1' } })) === '9.9.9.9');
assert('missing headers do not throw',
  callerKey(new Request('http://x')) === 'unknown');

console.log(failed === 0 ? '\nRate limiter checks passed.' : `\n${failed} check(s) failed`);
process.exit(failed === 0 ? 0 : 1);
