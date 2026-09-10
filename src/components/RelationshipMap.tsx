'use client';

import { useRef, useState } from 'react';
import { GROUP_LABEL, markPath, type Group } from './GroupMark';
import { BOND_STYLE, H, PEOPLE, TIES, W, ZONES, type Person } from '@/lib/relationships';
import { connectionsFor, describeTie, findPeople, type Connection } from '@/lib/relationship-view';

const GROUPS: Group[] = ['family', 'women', 'monastery', 'boys', 'town', 'court'];
const STARTERS = ['fyodor', 'dmitri', 'ivan', 'alyosha', 'smerdyakov'];

function Mark({ person, active = false }: { person: Person; active?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
      <path className="mark" data-active={active || undefined}
        transform="translate(16,16)" d={markPath(person.group, 7)} />
    </svg>
  );
}

export default function RelationshipMap({ sources }: { sources: Record<string, string> }) {
  const [selectedId, setSelectedId] = useState('dmitri');
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<Group | 'all'>('all');
  const [mode, setMode] = useState<'focus' | 'all'>('focus');
  const [castOpen, setCastOpen] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const selected = PEOPLE.find((person) => person.id === selectedId)!;
  const connections = connectionsFor(selectedId);
  const results = findPeople(query, group);

  function selectPerson(person: Person) {
    setSelectedId(person.id);
    setCastOpen(false);
    requestAnimationFrame(() => {
      headingRef.current?.focus({ preventScroll: true });
      headingRef.current?.scrollIntoView({ block: 'nearest' });
    });
  }

  function connectionCard(connection: Connection) {
    const { person, ties } = connection;
    const tone = ties.some((tie) => tie.bond === 'disputed') ? 'disputed'
      : ties.some((tie) => tie.key) ? 'plot' : 'ordinary';
    return (
      <article className="who-connection" data-tone={tone} key={person.id}>
        <button className="who-connection__person" onClick={() => selectPerson(person)}
          aria-label={`Explore ${person.name}`}>
          <Mark person={person} />
          <span>{person.name}</span>
          <span className="who-arrow" aria-hidden="true">↗</span>
        </button>
        <div className="who-connection__bonds">
          {ties.map((tie) => (
            <div className="who-bond" key={`${tie.from}-${tie.to}-${tie.bond}`}>
              <p>{describeTie(tie)}</p>
              <div className="who-bond__meta">
                {tie.bond === 'disputed' ? <span className="who-tag who-tag--disputed">Disputed</span>
                  : tie.key ? <span className="who-tag who-tag--plot">Plot thread</span> : null}
                {tie.cite && sources[tie.cite] && (
                  <a href={sources[tie.cite]} className="who-source"
                    aria-label={`Read ${tie.cite}: ${describeTie(tie)}`}>
                    {tie.cite} <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </article>
    );
  }

  return (
    <section className="who-explorer" aria-label="Character explorer">
      <div className="who-starters">
        <p className="eyebrow">Start with the family</p>
        <div className="who-starters__people">
          {STARTERS.map((id) => {
            const person = PEOPLE.find((candidate) => candidate.id === id)!;
            return (
              <button key={id} className="who-starter" aria-pressed={selectedId === id}
                onClick={() => selectPerson(person)}>
                <Mark person={person} active={selectedId === id} />
                <span>{person.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="who-layout">
        <aside className="who-cast" aria-label="Find a character">
          <button className="who-cast__toggle" aria-expanded={castOpen}
            aria-controls="who-cast-directory" onClick={() => setCastOpen(!castOpen)}>
            <span>Browse all {PEOPLE.length} characters</span>
            <span aria-hidden="true">{castOpen ? '−' : '+'}</span>
          </button>
          <div className="who-directory" id="who-cast-directory" data-open={castOpen}>
            <div className="who-directory__header">
              <h2 className="subheading">The cast</h2>
              <span className="who-count">{PEOPLE.length}</span>
            </div>
            <div className="who-search">
              <label className="who-label" htmlFor="who-search">Find a character</label>
              <input id="who-search" type="search" placeholder="Name or nickname…"
                value={query} onChange={(event) => setQuery(event.target.value)} />
              <label className="who-label" htmlFor="who-group">Circle</label>
              <select id="who-group" value={group}
                onChange={(event) => setGroup(event.target.value as Group | 'all')}>
                <option value="all">All circles</option>
                {GROUPS.map((value) => <option key={value} value={value}>{GROUP_LABEL[value]}</option>)}
              </select>
            </div>
            <p className="who-result-count" role="status">
              {results.length} {results.length === 1 ? 'character' : 'characters'}
            </p>
            <div className="who-directory__list">
              {results.map((person) => (
                <button key={person.id} className="who-cast-person"
                  aria-pressed={selectedId === person.id} onClick={() => selectPerson(person)}>
                  <Mark person={person} active={selectedId === person.id} />
                  <span>{person.name}<small>{GROUP_LABEL[person.group]}</small></span>
                </button>
              ))}
              {results.length === 0 && (
                <div className="who-empty">
                  <p>No characters match this search.</p>
                  <button onClick={() => { setQuery(''); setGroup('all'); }}>Clear filters</button>
                </div>
              )}
            </div>
          </div>
        </aside>

        <div className="who-workspace">
          <header className="who-profile">
            <div className="who-profile__mark"><Mark person={selected} active /></div>
            <div className="who-profile__copy">
              <div className="who-profile__meta">
                <span className="eyebrow">{GROUP_LABEL[selected.group]}</span>
                <span>{connections.length} connected {connections.length === 1 ? 'person' : 'people'}</span>
              </div>
              <h2 className="heading" ref={headingRef} tabIndex={-1}>{selected.name}</h2>
              <p>{selected.who}</p>
            </div>
          </header>

          <div className="who-map-toolbar">
            <div className="who-mode" role="group" aria-label="Relationship view">
              <button aria-pressed={mode === 'focus'} onClick={() => setMode('focus')}>Their connections</button>
              <button aria-pressed={mode === 'all'} onClick={() => setMode('all')}>Whole cast</button>
            </div>
            <span className="who-map-hint">Select a person to follow the story</span>
          </div>

          {mode === 'focus' ? (
            <div className="who-network" aria-label={`People connected to ${selected.name}`}>
              <div className="who-network__column">
                {connections.filter((_, index) => index % 2 === 0).map(connectionCard)}
              </div>
              <div className="who-network__center" aria-hidden="true">
                <div className="who-network__seal"><Mark person={selected} active /></div>
                <span>{selected.name}</span>
                <small>Follow a connection</small>
              </div>
              <div className="who-network__column">
                {connections.filter((_, index) => index % 2 === 1).map(connectionCard)}
              </div>
            </div>
          ) : (
            <>
              <p className="who-overview-help" id="who-map-help">
                The whole cast, in context. Scroll to explore the map.
                Select a name to open their relationship cards.
              </p>
              <div className="who-overview" tabIndex={0} role="region"
                aria-label="Scrollable whole-cast map" aria-describedby="who-map-help">
                <svg viewBox={`-40 -24 ${W + 80} ${H + 48}`} role="group" aria-label="Character relationships">
                  {ZONES.map((zone) => (
                    <text className="who-zone" key={zone.label} x={zone.x} y={zone.y}
                      textAnchor="middle">{zone.label}</text>
                  ))}
                  {TIES.map((tie, index) => {
                    const from = PEOPLE.find((person) => person.id === tie.from)!;
                    const to = PEOPLE.find((person) => person.id === tie.to)!;
                    const active = tie.from === selectedId || tie.to === selectedId;
                    const style = BOND_STYLE[tie.bond];
                    const parallel = TIES.slice(0, index).some((previous) =>
                      (previous.from === tie.from && previous.to === tie.to) ||
                      (previous.from === tie.to && previous.to === tie.from),
                    );
                    const dx = to.x - from.x;
                    const dy = to.y - from.y;
                    const length = Math.max(1, Math.hypot(dx, dy));
                    const bow = parallel ? 64 : 0;
                    const cx = (from.x + to.x) / 2 - dy / length * bow;
                    const cy = (from.y + to.y) / 2 + dx / length * bow;
                    return (
                      <g key={`${tie.from}-${tie.to}-${tie.bond}`} opacity={active ? 1 : 0.2}>
                        <title>{describeTie(tie)}</title>
                        <path d={`M${from.x},${from.y} Q${cx},${cy} ${to.x},${to.y}`} fill="none"
                          stroke={tie.bond === 'disputed' ? 'var(--purple)' : tie.key ? 'var(--pink)' : active ? 'var(--teal)' : 'var(--border-strong)'}
                          strokeWidth={style.width} strokeDasharray={style.dash} />
                      </g>
                    );
                  })}
                  {PEOPLE.map((person) => (
                    <g key={person.id} className="who-map-person" role="button" tabIndex={0}
                      aria-label={`Explore ${person.name}`} aria-pressed={person.id === selectedId}
                      onClick={() => { setMode('focus'); selectPerson(person); }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault(); setMode('focus'); selectPerson(person);
                        }
                      }}>
                      <rect x={person.x - 86} y={person.y - 35} width={172} height={52} rx={3} />
                      <path className="mark" data-active={person.id === selectedId || undefined}
                        transform={`translate(${person.x},${person.y + 3})`} d={markPath(person.group, 6)} />
                      <text x={person.x} y={person.y - 13} textAnchor="middle">{person.name}</text>
                    </g>
                  ))}
                </svg>
              </div>
            </>
          )}

          <footer className="who-legend">
            <span><i className="who-legend__line who-legend__line--plot" />Plot thread</span>
            <span><i className="who-legend__line who-legend__line--disputed" />Disputed relationship</span>
            <span><i className="who-legend__line" />Other connection</span>
            <p>Curated from the novel · citations open the chapter</p>
          </footer>
        </div>
      </div>
    </section>
  );
}
