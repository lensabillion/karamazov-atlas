import { Fragment } from 'react';
import CharacterIllustration from '@/components/CharacterIllustration';
import CharacterPlate from '@/components/CharacterPlate';
import CollageCatalogue from '@/components/CollageCatalogue';
import HomeReference from '@/components/HomeReference';
import SceneSpread from '@/components/SceneSpread';
import TitleDevice from '@/components/TitleDevice';
import { CHARACTER_ARTWORK } from '@/lib/character-artwork';
import { CHARACTER_BIOGRAPHIES } from '@/lib/character-biographies';
import { getCorpus, getMentions } from '@/lib/corpus';
import { ILLUSTRATED_SCENES } from '@/lib/illustrated-scenes';
import { getNames } from '@/lib/names';
import { WHOLE_BOOK } from '@/lib/reading-position';
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
      {/* The first leaf, set as the edition sets its title page: each line on
          its own measure, in graduated letterspaced capitals, with a device
          between the names and the imprint (atlas-1d7j). The wording is the
          atlas's own; the last lines cite the edition the text comes from
          rather than imitating its imprint, and the device is original. */}
      <header className="title-leaf book-description">
        <p className="title-leaf__over">An illustrated companion</p>
        <h1 className="title-leaf__title">The Brothers<br />Karamazov</h1>
        <hr className="plate__rule" />
        <p className="title-leaf__line">A novel in four parts and an epilogue</p>
        <p className="title-leaf__by">by</p>
        <p className="title-leaf__author">Fyodor Dostoyevsky</p>
        <p className="title-leaf__line">In the translation of Constance Garnett</p>
        <TitleDevice />
        <p className="title-leaf__imprint">The text of the London edition<br />1912</p>
        <hr className="plate__rule plate__rule--hair" />
        <p className="title-leaf__motto">The people you remember. The moments that remain.<br />
          <span className="meta">Written for readers who have finished · full-book spoilers</span></p>
      </header>

      {/* Shown whenever the reader has set a place short of the end. */}
      <p className="spoiler-note ahead-note" data-spoiler-note={WHOLE_BOOK}>
        This illustrated book is written for readers who have finished the novel. You have set
        your place part-way through, so scenes from later chapters are folded away and each
        person is described as you first meet them.
      </p>

      <nav className="folio-contents" id="contents" aria-label="Illustrated contents">
        <details>
          <summary>Find a person <span className="meta">{characters.length}</span></summary>
          <div className="folio-index">
            {characters.map((person) => <a href={`#person-${person.id}`} key={person.id}>{person.short}</a>)}
          </div>
        </details>
        <details open>
          <summary>The illustrated scenes <span className="meta">{ILLUSTRATED_SCENES.length}</span></summary>
          <div className="folio-index">
            {ILLUSTRATED_SCENES.map((scene) => <a href={`#scene-${scene.id}`} key={scene.id}>{scene.title}</a>)}
          </div>
        </details>
        <div className="folio-contents__further">
          <a href="#artwork-catalogue">Follow the story in pictures ↓</a>
          <a href="#explore">Explore the text ↓</a>
        </div>
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

      <CollageCatalogue />

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
          <a className="link" href="/translations">Which translation? →</a>
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
