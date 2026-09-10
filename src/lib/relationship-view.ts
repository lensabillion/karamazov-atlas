import { PEOPLE, TIES, type Person, type Tie } from './relationships';

export interface Connection {
  person: Person;
  ties: Tie[];
}

/** One card per person, without losing multiple bonds or their direction. */
export function connectionsFor(id: string): Connection[] {
  const connections = new Map<string, Connection>();
  for (const tie of TIES) {
    if (tie.from !== id && tie.to !== id) continue;
    const otherId = tie.from === id ? tie.to : tie.from;
    const person = PEOPLE.find((candidate) => candidate.id === otherId);
    if (!person) throw new Error(`Unknown character in relationship: ${otherId}`);
    const connection = connections.get(otherId) ?? { person, ties: [] };
    connection.ties.push(tie);
    connections.set(otherId, connection);
  }
  return [...connections.values()];
}

const normalize = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

export function findPeople(query: string, group: Person['group'] | 'all'): Person[] {
  const needle = normalize(query.trim());
  return PEOPLE.filter((person) =>
    (group === 'all' || person.group === group) &&
    normalize(`${person.name} ${person.id}`).includes(needle),
  );
}

/** Keep subject → bond → object explicit even when browsing an incoming tie. */
export function describeTie(tie: Tie): string {
  const from = PEOPLE.find((person) => person.id === tie.from)!;
  const to = PEOPLE.find((person) => person.id === tie.to)!;
  const labels: Record<string, string> = {
    father: 'is father of', mother: 'is mother of',
    'father?': 'is possibly father of', 'first wife': 'is first wife of',
    'second wife': 'is second wife of', friend: 'is a friend of',
    'engaged to': 'is engaged to', 'married to': 'is married to',
    'servant to': 'is servant to', 'cousin of': 'is cousin of',
    'elder to': 'is elder to', 'rival to': 'is rival to',
  };
  return `${from.name} ${labels[tie.label] ?? tie.label} ${to.name}`;
}
