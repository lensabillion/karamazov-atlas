import Timeline from '@/components/Timeline';
import './timeline.css';

export default function TimelinePage() {
  return (
    <main className="page page--wide timeline-page">
      <header className="timeline-intro">
        <div className="page-header">
          <p className="eyebrow">Timeline</p>
          <h1 className="title">Two thirds of this novel happens in four days</h1>
        </div>
        <p className="lede">
          Seven lives, unfolding together. Follow one person down the page, or read
          across to reconnect their stories. The four days at the heart of the novel
          take up most of the chart. Two threads end before the story does.
        </p>
      </header>
      <div className="timeline-guide" aria-label="How to read the timeline">
        <div><p className="eyebrow">↓ Follow a life</p><p className="text-muted">Each column follows one character.</p></div>
        <div><p className="eyebrow">↔ Read across</p><p className="text-muted">Compare lives within the same period.</p></div>
        <div><p className="eyebrow">Height = share of the book</p><p className="text-muted">Narrative space, not elapsed days. Full-book spoilers.</p></div>
      </div>
      <Timeline />
    </main>
  );
}
