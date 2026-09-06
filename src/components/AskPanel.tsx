'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

const SUGGESTED = [
  'Where does Ivan first state the idea Smerdyakov later acts on?',
  'What exactly is the evidence against Dmitri at the trial?',
  'What does Zossima mean by saying everyone is responsible for everyone?',
  'How does the dog Zhutchka connect Smerdyakov to Ilusha?',
];

export default function AskPanel({ hasKey }: { hasKey: boolean }) {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, error } = useChat();
  const busy = status === 'submitted' || status === 'streaming';

  const ask = (text: string) => {
    if (!text.trim() || busy) return;
    sendMessage({ text });
    setInput('');
  };

  return (
    <div className="stack stack--loose">
      {!hasKey && (
        <p className="notice">
          <strong>No API key configured.</strong> Everything else in this app works without one —
          only this page calls the model. Create <code>.env.local</code> with{' '}
          <code>ANTHROPIC_API_KEY=sk-ant-…</code> and restart <code>npm run dev</code>.
        </p>
      )}

      {messages.length === 0 && (
        <div className="row">
          {SUGGESTED.map((q) => (
            <button className="button button--quiet" key={q} onClick={() => ask(q)} disabled={busy}>
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="stack stack--loose">
        {messages.map((m) => (
          <div className="stack stack--tight" key={m.id}>
            <p className="eyebrow">{m.role === 'user' ? 'You' : 'From the text'}</p>
            {m.parts.map((part, i) => {
              if (part.type === 'text') {
                return m.role === 'user' ? (
                  <p className="text" key={i}>
                    {part.text}
                  </p>
                ) : (
                  <p className="answer" key={i}>
                    {part.text}
                  </p>
                );
              }
              if (part.type.startsWith('tool-')) {
                return (
                  <p className="meta" key={i}>
                    ↳ searched the novel ({part.type.replace('tool-', '')})
                  </p>
                );
              }
              return null;
            })}
          </div>
        ))}
        {busy && <p className="meta">reading…</p>}
        {error && <p className="notice">{error.message || 'The request failed.'}</p>}
      </div>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
      >
        <input
          className="field"
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          placeholder="Ask something about the novel…"
        />
        <button className="button button--primary" type="submit" disabled={busy || !input.trim()}>
          Ask
        </button>
      </form>
    </div>
  );
}
