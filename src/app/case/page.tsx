import type { Metadata } from 'next';
import Divergence from '@/components/Divergence';
import Verdict from '@/components/Verdict';
import { chapterPlaces, getChapter, ordinalOf } from '@/lib/corpus';
import { EVIDENCE, JURY, SOURCE_NAMES, ZOSSIMA, type Evidence } from '@/lib/evidence';
import { passageHref } from '@/lib/passage';
import '@/app/plate.css';
import './case.css';

export const metadata: Metadata = {
  title: 'The case file · Karamazov Atlas',
  description: 'The evidence on the death of Fyodor Pavlovitch, passage by passage, and two questions the novel keeps apart.',
};

const KIND: Record<Evidence['kind'], string> = {
  fact: 'Narrated', testimony: 'Testimony', confession: 'Confession',
  document: 'Document', argument: 'Argument', teaching: 'Teaching',
};
const QUESTION: Record<Evidence['question'], string> = {
  killed: 'Who killed him', responsible: 'Who is responsible', both: 'Both questions',
};
const NAME: Record<string, string> = { dmitri: 'Dmitri', smerdyakov: 'Smerdyakov', ivan: 'Ivan' };

/**
 * The case file (atlas-1bj0), the verdict (atlas-o9w6) and the reader's arc
 * (atlas-tbhb) on one page. The reader sits in the jury box: evidence accrues
 * in reading order, folded past their place; they answer two questions the
 * court merged, as often as they like; and they see where they parted from it.
 */
export default function CasePage() {
  const places = chapterPlaces();
  // Notes on evidence from before the body is found are written with hindsight,
  // so they fold until the reader reaches the discovery; the quotation does not.
  const discovery = ordinalOf('b09-c02');
  // What the court did with a piece of evidence is known only at the verdict.
  const verdict = ordinalOf(JURY.chapter);
  const items = [...EVIDENCE].sort((a, b) => ordinalOf(a.chapter) - ordinalOf(b.chapter));

  return (
    <main className="page page--wide case">
      <header className="page-header">
        <p className="eyebrow">The case file</p>
        <h1 className="title">Who killed Fyodor Pavlovitch — and who is responsible?</h1>
        <p className="lede">
          The narrator announces the death on the first page. The trial answers the first question
          with one name and treats it as the answer to the second; the elder answers the second with
          everyone. Here you keep them apart. Answer now, answer again whenever the book changes your
          mind, and every answer is kept with the place you gave it — then read the evidence as it
          accrues, each piece opening onto its passage.
        </p>
      </header>

      <Verdict places={places} />

      <Divergence places={places} juryAt={verdict} zossimaAt={ordinalOf(ZOSSIMA.chapter)} />

      <section className="case__evidence" aria-labelledby="evidence-title">
        <header className="section-header">
          <p className="eyebrow">{EVIDENCE.length} pieces, in the order the novel gives them</p>
          <h2 className="heading" id="evidence-title">The evidence</h2>
          <p className="text-muted">
            Each is quoted from the text and opens onto its paragraph. Whether it is narrated, sworn or
            confessed is marked, because the novel’s point is that the court believed true evidence and
            still reached the wrong man. Pieces past your place are folded away.
          </p>
        </header>
        <ol className="case__list">
          {items.map((e) => {
            const from = ordinalOf(e.chapter);
            const cite = getChapter(e.chapter)!.cite;
            const pointers = Object.entries(e.points);
            return (
              <li key={e.id} className="case__item" data-spoiler-from={from}>
                <p className="case__meta">
                  <a className="link" href={passageHref(e.chapter, e.quote)}>{cite}</a>
                  <span>{KIND[e.kind]} · {SOURCE_NAMES[e.source]}</span>
                  <span>{QUESTION[e.question]}</span>
                </p>
                <blockquote className="case__quote">{e.quote}</blockquote>
                <div className="spoiler" data-spoiler-from={Math.max(from, discovery)}>
                  <p className="case__says">{e.says}</p>
                  {pointers.length > 0 && (
                    <p className="case__points meta">
                      {pointers.map(([who, dir]) => `${dir === 'toward' ? 'Points to' : 'Points away from'} ${NAME[who]}`).join(' · ')}
                    </p>
                  )}
                </div>
                {e.court && (
                  <p className="case__court" data-court={e.court} data-spoiler-from={verdict}>
                    At the trial: {e.court}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
        <p className="meta">
          Who says what, and who has a stake in it, is followed idea by idea in{' '}
          <a className="link" href="/ideas">Who says this →</a>
        </p>
      </section>
    </main>
  );
}
