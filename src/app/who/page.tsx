import { GROUP_LABEL, markPath } from '@/components/GroupMark';
import RelationshipMap from '@/components/RelationshipMap';

export default function WhoPage() {
  return (
    <main className="page page--wide">
      <header className="page-header">
        <p className="eyebrow">Who’s who</p>
        <h1 className="title">Everyone, and what they are to each other</h1>
        <p className="lede">
          Click anyone to find out who they are and how they connect. Shape says what kind of
          person; colour says what kind of link. Pink is the path the murder travels — two men
          wanting the same woman, one brother handing another man the idea, and the killing
          itself. Purple is the one thing the novel never settles.
        </p>
      </header>
      <section className="section">
        <div className="row" style={{ gap: 'var(--space-4)' }}>
          <span className="chip">
            <svg width="34" height="10" aria-hidden="true">
              <line x1="1" y1="5" x2="33" y2="5" stroke="var(--pink)" strokeWidth="2.5" />
            </svg>
            the path the murder travels
          </span>
          <span className="chip">
            <svg width="34" height="10" aria-hidden="true">
              <line x1="1" y1="5" x2="33" y2="5" stroke="var(--purple)" strokeWidth="1.5"
                strokeDasharray="4 4" />
            </svg>
            the novel does not settle it
          </span>
          <span className="chip">
            <svg width="34" height="10" aria-hidden="true">
              <line x1="1" y1="5" x2="33" y2="5" stroke="var(--teal)" strokeWidth="2.5" />
            </svg>
            what you have selected
          </span>
          <span className="chip">
            <svg width="34" height="10" aria-hidden="true">
              <line x1="1" y1="5" x2="33" y2="5" stroke="var(--border-strong)" strokeWidth="1.5" />
            </svg>
            everything else
          </span>
        </div>
        <div className="row" style={{ gap: 'var(--space-4)' }}>
          {(['family', 'women', 'monastery', 'boys', 'town', 'court'] as const).map((g) => (
            <span className="chip" key={g}>
              <svg width="16" height="16" aria-hidden="true">
                <g transform="translate(8,8)">
                  <path className="mark" d={markPath(g, 5)} />
                </g>
              </svg>
              {GROUP_LABEL[g]}
            </span>
          ))}
        </div>
      </section>

      <RelationshipMap />
    </main>
  );
}
