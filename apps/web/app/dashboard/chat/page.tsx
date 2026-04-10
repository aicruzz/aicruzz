'use client';

import { useState } from 'react';

export default function ChatToCreate() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;

    setLoading(true);

    const res = await fetch('http://localhost:4000/api/v1/ai/chat-to-create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    setResult(data.data);
    setLoading(false);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>🧠 Chat to Create</h1>

      <textarea
        placeholder="Describe your video idea..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: '100%', height: 120, marginTop: 20 }}
      />

      <button onClick={handleGenerate} style={{ marginTop: 20 }}>
        {loading ? 'Generating...' : 'Generate'}
      </button>

      {result && (
        <pre style={{ marginTop: 30, background: '#111', color: '#0f0', padding: 20 }}>
          {result}
        </pre>
      )}
    </div>
  );
}