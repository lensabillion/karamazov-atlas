import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { connectionsFor, describeTie, findPeople } from '../src/lib/relationship-view';
import { PEOPLE, TIES } from '../src/lib/relationships';

const fyodor = connectionsFor('fyodor');
const smerdyakov = fyodor.find((connection) => connection.person.id === 'smerdyakov');
assert.equal(smerdyakov?.ties.length, 2, 'Keep both disputed parentage and murder on one person card');
assert.equal(
  describeTie(TIES.find((tie) => tie.bond === 'killed')!),
  'Smerdyakov killed Fyodor Pavlovitch',
  'A relationship must keep its direction when either person is selected',
);
assert.deepEqual(findPeople('mitya', 'all').map((person) => person.id), ['dmitri']);
assert.deepEqual(findPeople('adelaida', 'women').map((person) => person.id), ['adelaida']);
assert.equal(findPeople('mitya', 'court').length, 0);
assert.equal(findPeople('no-such-person', 'all').length, 0);

const corpus = JSON.parse(readFileSync('data/corpus.json', 'utf8')) as {
  chapters: { cite: string }[];
};
for (const person of PEOPLE) {
  const connections = connectionsFor(person.id);
  assert.equal(new Set(connections.map((connection) => connection.person.id)).size, connections.length);
  assert.equal(
    connections.flatMap((connection) => connection.ties).length,
    TIES.filter((tie) => tie.from === person.id || tie.to === person.id).length,
  );
}
for (const tie of TIES) {
  if (tie.cite) assert.ok(corpus.chapters.some((chapter) => chapter.cite === tie.cite), tie.cite);
}
console.log('Relationship explorer checks passed: direction, grouping, search, filters and citations.');
