import RelationshipMap from '@/components/RelationshipMap';
import { getCorpus } from '@/lib/corpus';
import './who.css';

export default function WhoPage() {
  const sources = Object.fromEntries(
    getCorpus().chapters.map((chapter) => [chapter.cite, `/read/${chapter.id}`]),
  );
  return (
    <main className="page page--wide who-page">
      <header className="who-header">
        <div className="who-header__title">
          <p className="eyebrow">The Brothers Karamazov / Who’s who</p>
          <h1 className="title">Remember the people.<br />Follow the connections.</h1>
        </div>
        <div className="who-header__intro">
          <p>A family at the centre. A whole town around them. Find a familiar name,
            remember their part, and follow the relationships that move the story.</p>
          <span className="who-spoilers">A companion for returning readers · full-book spoilers</span>
        </div>
      </header>
      <RelationshipMap sources={sources} />
    </main>
  );
}
