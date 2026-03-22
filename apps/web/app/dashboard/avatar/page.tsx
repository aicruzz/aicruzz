'use client';

import { useState } from 'react';

const avatars = [
  { id: 'pro_f', label: 'Professional F', icon: '👩‍💼', bg: 'linear-gradient(135deg,#667eea,#764ba2)' },
  { id: 'pro_m', label: 'Professional M', icon: '👨‍💼', bg: 'linear-gradient(135deg,#f093fb,#f5576c)' },
  { id: 'tech_m', label: 'Tech Lead',      icon: '👨‍💻', bg: 'linear-gradient(135deg,#4facfe,#00f2fe)' },
  { id: 'casual_f', label: 'Casual F',     icon: '👩', bg: 'linear-gradient(135deg,#f7971e,#ffd200)' },
  { id: 'news_m', label: 'News Anchor',    icon: '📺', bg: 'linear-gradient(135deg,#a8edea,#fed6e3)' },
  { id: 'coach_f', label: 'Life Coach',    icon: '🎤', bg: 'linear-gradient(135deg,#d299c2,#fef9d7)' },
];

const voices = ['Natural', 'Energetic', 'Calm', 'News Anchor', 'Storyteller'];
const backgrounds = ['Office', 'Studio', 'Gradient Blue', 'Gradient Purple', 'Plain White'];

export default function AvatarPage() {
  const [script, setScript] = useState('Welcome to our product demo! Today I\'ll show you how AiCruzz can transform your content creation workflow in just seconds.');
  const [selectedAvatar, setSelectedAvatar] = useState('pro_f');
  const [selectedVoice, setSelectedVoice] = useState('Natural');
  const [selectedBg, setSelectedBg] = useState('Office');
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  function handleGenerate() {
    if (!script.trim()) return;
    setGenerating(true);
    setDone(false);
    setTimeout(() => { setGenerating(false); setDone(true); }, 3500);
  }

  return (
    <div className="db-content">
      <h1 className="db-page-title">Avatar Videos</h1>
      <p className="db-page-sub">Create talking avatar videos from a written script. Choose your presenter and voice.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>
        <div>
          {/* Script */}
          <div className="db-card" style={{ marginBottom: 16 }}>
            <div className="db-card-title" style={{ marginBottom: 12 }}>Your Script</div>
            <textarea
              className="form-input form-textarea"
              style={{ minHeight: 120, marginBottom: 8 }}
              placeholder="Write the script your avatar will deliver..."
              value={script}
              onChange={(e) => setScript(e.target.value)}
            />
            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{script.length} characters · est. {Math.ceil(script.length / 14)}s</div>
          </div>

          {/* Avatar selector */}
          <div className="db-card" style={{ marginBottom: 16 }}>
            <div className="db-card-title" style={{ marginBottom: 14 }}>Choose Your Avatar</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {avatars.map((a) => (
                <div
                  key={a.id}
                  onClick={() => setSelectedAvatar(a.id)}
                  style={{
                    border: `2px solid ${selectedAvatar === a.id ? 'var(--blue)' : 'var(--border)'}`,
                    borderRadius: 'var(--r)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.18s',
                    boxShadow: selectedAvatar === a.id ? '0 0 0 3px rgba(47,107,255,0.15)' : 'none',
                  }}
                >
                  <div style={{ height: 80, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>{a.icon}</div>
                  <div style={{ padding: '8px 4px', fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{a.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Voice & Background */}
          <div className="db-card">
            <div className="db-card-title" style={{ marginBottom: 16 }}>Voice & Background</div>
            <div style={{ marginBottom: 14 }}>
              <div className="form-label" style={{ marginBottom: 8 }}>Voice Style</div>
              <div className="toggle-group">
                {voices.map((v) => (
                  <button key={v} className={`tgl-btn ${selectedVoice === v ? 'active' : ''}`} onClick={() => setSelectedVoice(v)}>{v}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="form-label" style={{ marginBottom: 8 }}>Background</div>
              <div className="toggle-group">
                {backgrounds.map((b) => (
                  <button key={b} className={`tgl-btn ${selectedBg === b ? 'active' : ''}`} onClick={() => setSelectedBg(b)}>{b}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview panel */}
        <div className="db-card">
          <div className="db-card-title" style={{ marginBottom: 14 }}>Preview</div>
          <div className="video-preview-box" style={{ marginBottom: 14 }}>
            {!generating && !done && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, opacity: 0.25, marginBottom: 8 }}>👤</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Configure and generate</div>
              </div>
            )}
            {generating && (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div className="spinner" />
                <div style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>Creating avatar video...</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Lip-syncing to script</div>
              </div>
            )}
            {done && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 52 }}>{avatars.find(a => a.id === selectedAvatar)?.icon}</div>
                <div style={{ color: 'var(--green)', fontSize: 14, fontWeight: 700, marginTop: 8 }}>✓ Avatar Video Queued!</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{selectedVoice} · {selectedBg}</div>
              </div>
            )}
          </div>

          <button className="btn btn-primary btn-full" onClick={handleGenerate} disabled={generating || !script.trim()}>
            {generating ? 'Generating...' : 'Generate Avatar Video'}
          </button>
          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-3)', marginTop: 8 }}>Uses 2× credits per video</div>

          <div style={{ marginTop: 16, padding: 14, background: 'var(--blue-light)', borderRadius: 'var(--r-sm)', fontSize: 13 }}>
            <div style={{ fontWeight: 700, color: 'var(--blue)', marginBottom: 4 }}>ℹ Pro Feature</div>
            <div style={{ color: 'var(--text-2)' }}>Avatar videos require a Pro or Studio plan.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
