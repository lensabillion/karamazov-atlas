import Timeline from '@/components/Timeline';
import { chapterPlaces } from '@/lib/corpus';

export default function TimelinePage() {
  return (
    <main className="page page--wide">
      <header className="page-header">
        <p className="eyebrow">Timeline</p>
        <h1 className="title">Two thirds of this novel happens in four days</h1>
        <p className="lede">
          Time runs down. Each column is one person, read top to bottom as a continuous
          thread, and every block is as tall as the share of the novel that state occupies —
          so the four days that take two thirds of the book look like two thirds. Read across
          a row to see what everyone was doing at once. Two columns simply stop. Every block
          opens onto the chapter it comes from.
        </p>
      </header>
      <Timeline places={chapterPlaces()} />
    </main>
  );
}
