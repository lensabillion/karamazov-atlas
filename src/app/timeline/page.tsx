import Timeline from '@/components/Timeline';

export default function TimelinePage() {
  return (
    <main className="page page--wide">
      <header className="page-header">
        <p className="eyebrow">Timeline</p>
        <h1 className="title">Two thirds of this novel happens in four days</h1>
        <p className="lede">
          229,504 of its 349,367 words cover roughly four days — the monastery quarrel, the
          night of the murder, and the arrest. Then two months vanish in a paragraph. The two
          ribbons below are the same story measured on those two clocks, and they are almost
          exact inversions of each other. Click any moment to see what happened and who was
          there.
        </p>
      </header>
      <Timeline />
    </main>
  );
}
