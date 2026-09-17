import { Fragment } from 'react';
import CharacterIllustration from '@/components/CharacterIllustration';
import CharacterPlate from '@/components/CharacterPlate';
import HomeReference from '@/components/HomeReference';
import SceneSpread from '@/components/SceneSpread';
import { CHARACTER_ARTWORK } from '@/lib/character-artwork';
import { CHARACTER_BIOGRAPHIES } from '@/lib/character-biographies';
import { getCorpus, getMentions } from '@/lib/corpus';
import { ILLUSTRATED_SCENES } from '@/lib/illustrated-scenes';
import { getNames } from '@/lib/names';
import './plate.css';
import './home.css';

/** The illustrated companion is the front door; deeper tools remain one click away. */
export default function Home() {
  const { characters } = getMentions();
  const totalChapters = getCorpus().chapters.length;
  const names = new Map(getNames().characters.map((person) => [person.id, person]));
  const illustrated = characters.filter((person) => CHARACTER_ARTWORK[person.id]);
  const otherPeople = characters.filter((person) => !CHARACTER_ARTWORK[person.id]);

  return (
    <main className="page page--wide folio-page">
      <header className="folio-title">
        <div>
          <p className="eyebrow">An illustrated companion · Full-book spoilers</p>
          <h1 className="title">The Brothers Karamazov</h1>
        </div>
        <p className="text-muted">The people you remember.<br />The moments that remain.</p>
      </header>

      <nav className="folio-contents" id="contents" aria-label="Illustrated contents">
        <details>
          <summary>Find a person <span className="meta">{characters.length}</span></summary>
          <div className="folio-index">
            {characters.map((person) => <a href={`#person-${person.id}`} key={person.id}>{person.short}</a>)}
          </div>
        </details>
        <details>
          <summary>Find a scene <span className="meta">{ILLUSTRATED_SCENES.length}</span></summary>
          <div className="folio-index">
            {ILLUSTRATED_SCENES.map((scene) => <a href={`#scene-${scene.id}`} key={scene.id}>{scene.title}</a>)}
          </div>
        </details>
        <a href="#explore">Explore the text ↓</a>
      </nav>

      <div className="folio-leaves">
        {illustrated.map((person, index) => (
          <Fragment key={person.id}>
            <article className="folio-spread character-opening" data-illustrated="true"
              id={`person-${person.id}`} aria-labelledby={`person-title-${person.id}`}>
              <CharacterIllustration artwork={CHARACTER_ARTWORK[person.id]!} eager={index === 0} />
              <div className="folio-person__text">
                <CharacterPlate character={names.get(person.id)!} chapterCount={person.chapterCount}
                  totalChapters={totalChapters} epithet={CHARACTER_BIOGRAPHIES[person.id]}
                  heading="h2" headingId={`person-title-${person.id}`} />
                <a className="link folio-more" href={`/character/${person.id}`}>
                  More about {person.short}: connections &amp; chapters →
                </a>
              </div>
              <a className="folio-back meta" href="#contents">Back to contents ↑</a>
            </article>
            {ILLUSTRATED_SCENES.filter((scene) => scene.afterCharacter === person.id).map((scene) => (
              <SceneSpread key={scene.id} scene={scene} />
            ))}
          </Fragment>
        ))}
      </div>

      <section className="folio-others" aria-labelledby="other-people">
        <header className="section-header">
          <p className="eyebrow">The rest of the company</p>
          <h2 className="heading" id="other-people">More lives in the novel</h2>
          <p className="text-muted">No separate portrait in this selection. Their stories still belong here.</p>
        </header>
        <div className="folio-people-grid">
          {otherPeople.map((person) => (
            <article id={`person-${person.id}`} className="folio-person--type" key={person.id}>
              <CharacterPlate character={names.get(person.id)!} chapterCount={person.chapterCount}
                totalChapters={totalChapters} epithet={CHARACTER_BIOGRAPHIES[person.id]} heading="h3" />
              <a className="link folio-more" href={`/character/${person.id}`}>More about {person.short} →</a>
            </article>
          ))}
        </div>
      </section>

      <section id="explore" className="folio-explore" aria-labelledby="explore-title">
        <h2 className="heading" id="explore-title">Explore the text</h2>
        <nav className="folio-tools" aria-label="Explore the novel">
          <a className="link" href="/characters">The cast →</a>
          <a className="link" href="/who">Relationships →</a>
          <a className="link" href="/timeline">The timeline →</a>
          <a className="link" href="/names">Names &amp; forms →</a>
          <a className="link" href="/read">Read the novel →</a>
        </nav>
        <details className="folio-reference-disclosure">
          <summary>Open the chapter index, memorable passages &amp; mention counts</summary>
          <HomeReference />
        </details>
        <p className="meta">Fyodor Dostoyevsky · 1880 · Constance Garnett’s translation · 1912</p>
      </section>
    </main>
  );
}
