import { getMentions } from '@/lib/corpus';
import { PEOPLE } from '@/lib/relationships';
import CharacterIllustration from '@/components/CharacterIllustration';
import { CHARACTER_ARTWORK } from '@/lib/character-artwork';
import Ornament from '@/components/Ornament';
import './characters.css';

const GROUPS = [
  ['family', 'The House of Karamazov'],
  ['women', 'The Women'],
  ['monastery', 'The Monastery'],
  ['boys', 'The Schoolboys'],
  ['court', 'The Court'],
  ['town', 'The Town'],
] as const;

/** A visible table of contents for the individual character plates. */
export default function CharactersPage() {
  const characters = getMentions().characters;

  return (
    <main className="page page--wide characters-page">
      <header className="characters-intro">
        <div className="page-header">
          <p className="eyebrow">Dramatis personae</p>
          <h1 className="title">The people of the novel</h1>
        </div>
        <p className="lede">
          Faces, names, and the lives that bind them. Browse the cast below;
          each name opens its full character plate.
        </p>
      </header>

      <div className="characters-rule" aria-hidden="true" />

      {GROUPS.map(([group, title]) => {
        const members = characters.filter((character) => character.group === group);
        if (members.length === 0) return null;
        return (
          <section className="characters-section" key={group}
            data-has-art={members.some((character) => Boolean(CHARACTER_ARTWORK[character.id]))}>
            <div className="characters-section__heading">
              <p className="eyebrow">{String(members.length).padStart(2, '0')}</p>
              <h2 className="heading">{title}</h2>
            </div>
            <ol className="characters-list">
              {members.map((character) => {
                const description = PEOPLE.find((person) => person.id === character.id)?.who;
                const artwork = CHARACTER_ARTWORK[character.id];
                if (artwork) {
                  return (
                    <li key={character.id} data-character={character.id}>
                      <article className="characters-frontispiece" aria-labelledby={`portrait-${character.id}`}>
                        <CharacterIllustration artwork={artwork} eager={character.id === 'alyosha'} />
                        <div className="characters-frontispiece__text">
                          <h3 className="heading" id={`portrait-${character.id}`}>
                            <a href={`/character/${character.id}`}>{character.name}</a>
                          </h3>
                          <Ornament />
                          <p className="characters-frontispiece__description">{description}</p>
                          <a className="link" href={`/character/${character.id}`}>Names, connections, and chapters →</a>
                        </div>
                      </article>
                    </li>
                  );
                }
                return (
                  <li key={character.id}>
                    <a href={`/character/${character.id}`}>
                      <span className="characters-list__name">{character.name}</span>
                      <span className="characters-list__leader" aria-hidden="true" />
                      <span className="characters-list__description">
                        {description ?? `${character.total.toLocaleString()} mentions`}
                      </span>
                      <span className="characters-list__mark" aria-hidden="true">→</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}

      <aside className="characters-art-note">
        <p className="eyebrow">Historical illustrations</p>
        <p className="text-muted">
          Boris Grigoriev made a 58-sheet cycle for <em>The Brothers Karamazov</em>,
          including portraits and scenes. The nine characters named in the linked
          selection are illustrated here with reference-based studies, each labeled
          as AI-generated. Shared scenes retain both people; characters without an
          identified illustration in that selection remain in the cast list.
        </p>
        <a className="link" href="https://www.gw2ru.com/arts/1392-karamazov-illustrations-grigoriev">
          View the surviving cycle and credits ↗
        </a>
      </aside>
    </main>
  );
}
