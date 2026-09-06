import NetworkGraph from '@/components/NetworkGraph';
import { getMentions } from '@/lib/corpus';

export default function NetworkPage() {
  const { characters, edges } = getMentions();
  const nodes = characters
    .filter((c) => c.chapterCount > 0)
    .map(({ id, short, group, total, chapterCount }) => ({ id, short, group, total, chapterCount }));

  return (
    <main className="page">
      <header className="page-header">
        <p className="eyebrow">Derived from the text</p>
        <h1 className="title">Who shares a chapter with whom</h1>
        <p className="lede">
          An edge means two characters are both meaningfully present in the same chapter — at
          least three mentions each. Nothing here is authored: the graph is computed from
          alias-resolved mention counts across all 96 chapters. Node size is total mentions.
        </p>
      </header>
      <NetworkGraph nodes={nodes} edges={edges} />
    </main>
  );
}
