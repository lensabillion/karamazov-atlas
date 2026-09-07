import RelationshipMap from '@/components/RelationshipMap';

export default function WhoPage() {
  return (
    <main className="page page--wide">
      <header className="page-header">
        <p className="eyebrow">Who’s who</p>
        <h1 className="title">Everyone, and what they are to each other</h1>
        <p className="lede">
          Click anyone to find out who they are and how they connect. The heavy lines are the
          ones the murder travels along: two men wanting the same woman, one brother handing
          another man the idea, and the killing itself.
        </p>
      </header>
      <RelationshipMap />
    </main>
  );
}
