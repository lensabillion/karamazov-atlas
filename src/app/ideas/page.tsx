import type { Metadata } from 'next';
import Ornament from '@/components/Ornament';
import { getChapter, ordinalOf } from '@/lib/corpus';
import { IDEAS, SPEAKER_NAMES } from '@/lib/ideas';
import { passageHref } from '@/lib/passage';
import '@/app/plate.css';
import '../case/case.css';

export const metadata: Metadata = {
  title: 'Who says this · Karamazov Atlas',
  description: 'The novel’s arguments, followed through the book and attributed to the people with a stake in them.',
};

/**
 * Who says this (atlas-sto5). Nothing in the novel is asserted by the narrator;
 * each idea is followed as a sequence of voices — stated, repeated, owned,
 * contested, acted on, turned on its author — each opening onto its passage and
 * folded away past the reader's place.
 */
export default function IdeasPage() {
  return (
    <main className="page page--narrow ideas">
      <header className="page-header">
        <p className="eyebrow">Who says this</p>
        <h1 className="title">Every idea belongs to someone</h1>
        <p className="lede">
          The narrator argues nothing. Every idea in this book is spoken by a person who has something
          riding on it — and then the book tests it, often on the person who said it. Follow three of
          them here, voice by voice, in the order the novel gives them.
        </p>
      </header>

      {IDEAS.map((idea) => (
        <section key={idea.id} className="ideas__idea book-description" aria-labelledby={`idea-${idea.id}`}>
          <p className="plate__series">An idea, and its voices</p>
          <h2 className="ideas__title" id={`idea-${idea.id}`}>“{idea.idea}”</h2>
          <p className="ideas__stake">{idea.stake}</p>
          <hr className="plate__rule plate__rule--hair" />
          <ol className="ideas__voices">
            {idea.voices.map((v, i) => (
              <li key={i} className="ideas__voice" data-spoiler-from={ordinalOf(v.chapter)}>
                <p className="case__meta">
                  <span className="ideas__stance">{SPEAKER_NAMES[v.who]} {v.stance}</span>
                  <a className="link" href={passageHref(v.chapter, v.quote)}>{getChapter(v.chapter)!.cite}</a>
                </p>
                <blockquote className="case__quote">{v.quote}</blockquote>
                <p className="case__says">{v.note}</p>
              </li>
            ))}
          </ol>
        </section>
      ))}

      <Ornament />
      <p className="meta">
        The same voices are weighed as evidence in <a className="link" href="/case">the case file →</a>
      </p>
    </main>
  );
}
