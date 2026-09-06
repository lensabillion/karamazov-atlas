import AskPanel from '@/components/AskPanel';
import { getCorpus } from '@/lib/corpus';

export default function AskPage() {
  const corpus = getCorpus();
  return (
    <main className="page page--narrow">
      <header className="page-header">
        <p className="eyebrow">Retrieval over the full text</p>
        <h1 className="title">Ask the novel</h1>
        <p className="lede">
          Questions are answered from the {corpus.wordCount.toLocaleString()} words of the Garnett
          translation, retrieved chapter by chapter and cited by book and chapter. The model is
          instructed to say when the text does not support an answer rather than fill the gap.
        </p>
      </header>
      <AskPanel hasKey={Boolean(process.env.ANTHROPIC_API_KEY)} />
    </main>
  );
}
