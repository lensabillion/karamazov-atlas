import MindMap, { type MapNode } from '@/components/MindMap';
import { getBooks, getMentions } from '@/lib/corpus';

export default function MapPage() {
  const books = getBooks();
  const { characters, byChapter } = getMentions();
  const groupOf = new Map(characters.map((c) => [c.id, c.group]));

  const parts = new Map<string, typeof books>();
  for (const b of books) {
    if (!parts.has(b.part)) parts.set(b.part, []);
    parts.get(b.part)!.push(b);
  }

  const root: MapNode = {
    id: 'root',
    label: 'The Brothers Karamazov',
    meta: 'Structure derived from the source text',
    children: [...parts.entries()].map(([part, bs]) => ({
      id: `part-${part}`,
      label: part,
      meta: `${bs.length} book${bs.length === 1 ? '' : 's'}`,
      children: bs.map((b) => ({
        id: `book-${b.num}`,
        label: b.num === 13 ? 'Epilogue' : `${b.num}. ${b.title}`,
        meta: `${b.chapters.length} chapters · ${b.chapters
          .reduce((n, c) => n + c.wordCount, 0)
          .toLocaleString()} words`,
        children: b.chapters.map((ch) => {
          // The three characters most present in this chapter, as group markers.
          const counts = byChapter[ch.id] ?? {};
          const dots = Object.entries(counts)
            .sort((a, b2) => b2[1] - a[1])
            .slice(0, 3)
            .map(([id]) => ({ id, group: groupOf.get(id) ?? 'town' }));
          return {
            id: ch.id,
            label: ch.title,
            meta: ch.cite,
            href: `/read/${ch.id}`,
            dots,
          };
        }),
      })),
    })),
  };

  return (
    <main className="page page--wide">
      <header className="page-header">
        <p className="eyebrow">Structure</p>
        <h1 className="title">The shape of the novel</h1>
        <p className="lede">
          Four parts, twelve books, ninety-six chapters, laid out from the parsed corpus.
          Coloured dots on a chapter are the three characters most present in it. Click a node
          to inspect it; click the knob to unfold.
        </p>
      </header>
      <MindMap root={root} />
    </main>
  );
}
