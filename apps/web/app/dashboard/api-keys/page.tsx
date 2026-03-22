'use client';

import { useEffect, useState } from 'react';
import { apiKeysApi } from '@/lib/api';
import type { ApiKey } from '@aicruzz/types';

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKey, setNewKey] = useState('');
  const [keyName, setKeyName] = useState('My API Key');
  const [generating, setGenerating] = useState(false);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);

  useEffect(() => {
    apiKeysApi.list()
      .then(setKeys)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleGenerate() {
    if (!keyName.trim()) return;
    setGenerating(true);
    try {
      const { key, raw_key } = await apiKeysApi.create(keyName);
      setKeys((prev) => [key, ...prev]);
      setRevealedKey(raw_key);
      setNewKey(raw_key);
    } catch {
      alert('Failed to generate key');
    } finally {
      setGenerating(false);
    }
  }

  async function handleRevoke(id: string) {
    if (!confirm('Revoke this API key? This action cannot be undone.')) return;
    await apiKeysApi.revoke(id);
    setKeys((k) => k.filter((key) => key.id !== id));
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="db-content">
      <h1 className="db-page-title">API Keys</h1>
      <p className="db-page-sub">
        Manage your API keys to integrate with the AiCruzz video generation API.<br />
        Keep these keys secure — treat them like passwords.
      </p>

      <div className="db-card" style={{ maxWidth: 860 }}>
        {/* Generate new key */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
          <input
            className="form-input"
            style={{ flex: 1, minWidth: 180, maxWidth: 260 }}
            placeholder="Key name (e.g. Production)"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleGenerate} disabled={generating}>
            {generating ? 'Generating...' : '🔑 Generate New Key'}
          </button>
        </div>

        {/* Newly created key banner */}
        {revealedKey && (
          <div style={{ background: 'var(--green-bg)', border: '1.5px solid rgba(34,197,94,0.3)', borderRadius: 'var(--r)', padding: '14px 18px', marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)', marginBottom: 8 }}>✓ New API key created — copy it now, it won't be shown again</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <code style={{ flex: 1, fontFamily: 'DM Mono, monospace', fontSize: 13, background: '#fff', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', wordBreak: 'break-all' }}>
                {newKey}
              </code>
              <button className="btn btn-outline btn-sm" onClick={() => copyToClipboard(newKey)}>📋 Copy</button>
            </div>
          </div>
        )}

        <div className="db-card-title" style={{ marginBottom: 14 }}>Your API Keys</div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 32 }}>
            <div className="spinner" style={{ margin: '0 auto', borderColor: 'rgba(47,107,255,0.15)', borderTopColor: 'var(--blue)' }} />
          </div>
        ) : keys.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-3)', fontSize: 14 }}>
            No API keys yet. Generate one above.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>API Key</th>
                <th>Requests</th>
                <th>Created</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.id}>
                  <td style={{ fontWeight: 700 }}>{k.name}</td>
                  <td>
                    <span className="key-mono">{k.key_prefix}•••••••••••••</span>
                  </td>
                  <td style={{ color: 'var(--text-2)' }}>{k.request_count.toLocaleString()}</td>
                  <td style={{ color: 'var(--text-2)' }}>{new Date(k.created_at).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-danger btn-sm" onClick={() => handleRevoke(k.id)}>🗑 Revoke</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ marginTop: 24, padding: 18, background: 'var(--yellow-light)', border: '1.5px solid rgba(234,179,8,0.3)', borderRadius: 'var(--r)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#92400E', marginBottom: 4 }}>⚠️ Security Notice</div>
          <div style={{ fontSize: 13, color: '#78350F' }}>API keys are shown only once at creation. Store them securely — they cannot be retrieved again.</div>
        </div>
      </div>
    </div>
  );
}
