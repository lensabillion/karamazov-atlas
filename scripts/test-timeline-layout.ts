import assert from 'node:assert/strict';
import { SEGMENTS, SPANS } from '../src/lib/timeline';
import { buildTimelineBands, getSpanBox, wrapTimelineLabel } from '../src/lib/timeline-layout';

const bands = buildTimelineBands(SEGMENTS, 1360, 46);
const trial = bands.trial!;
const death = SPANS.find((span) => span.character === 'smerdyakov' && span.ends)!;
assert.equal(getSpanBox(death, bands).h, trial.h * 0.06,
  'Smerdyakov’s thread ends near the start of the trial, not at its end');
assert.equal(bands.gap!.h, 46, 'The skipped interval keeps its separate fixed band');
assert.ok(Math.abs(bands.after!.y + bands.after!.h - 1360) < 0.000001);
assert.ok(Math.abs(bands.day1!.h / bands.day2!.h - 56945 / 76812) < 0.000001,
  'Narrated bands retain their relative word proportions');
assert.deepEqual(wrapTimelineLabel('Courted by father and son', 18, 2), ['Courted by father', 'and son']);
assert.deepEqual(wrapTimelineLabel('Twenty years — or escape', 18, 1), ['Twenty years — or…']);
assert.ok(wrapTimelineLabel('Hangs himself', 18, 1).every((line) => line.length <= 18));
console.log('Timeline layout: endpoint, proportional bands, gap, and label-fit checks passed.');
