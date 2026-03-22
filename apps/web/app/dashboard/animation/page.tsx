'use client';

import { useState } from 'react';

const motionEffects = [
  { id: 'zoom_in',  label: 'Zoom In',     icon: '🔍' },
  { id: 'pan_left', label: 'Pan Left',    icon: '⬅️' },
  { id: 'pan_right',label: 'Pan Right',   icon: '➡️' },
  { id: 'orbit',    label: 'Orbit',       icon: '🔄' },
  { id: 'float',    label: 'Float Up',    icon: '⬆️' },
  { id: 'shake',    label: 'Shake',       icon: '〰️' },
];

const particleEffects = ['None', 'Snow', 'Rain', 'Sparkles', 'Fireflies', 'Petals'];

export default function AnimationPage() {
  const [prompt, setPrompt] = useState('');
  const [selectedMotion, setSelectedMotion] = useState('zoom_in');
  const [selectedParticle, setSelectedParticle] = useState('None');
  const [duration, setDuration] = useState('5 sec');
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  function handleGenerate() {
    if (!prompt.trim()) return;
    setGenerating(true); setDone(false);
    setTimeout(() => { setGenerating(false); setDone(true); }, 3000);
  }

  return (
    <div className="db-content">
      <h1 className="db-page-title">Animation Studio</h1>
      <p className="db-page-sub">Bring images to life with AI-powered motion effects and scene animations.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>
        <div>
          {/* Image source */}
          <div className="db-card" style={{ marginBottom: 16 }}>
            <div className="db-card-title" style={{ marginBottom: 14 }}>Image Source</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div style={{ border: '2px dashed var(--border)', borderRadius: 'var(--r)', padding: '28px 16px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.18s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--blue)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>⬆️</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)' }}>Upload Image</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>PNG, JPG, WebP</div>
              </div>
              <div style={{ border: '2px dashed var(--border)', borderRadius: 'var(--r)', padding: '28px 16px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.18s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--purple)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>✨</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)' }}>Generate Image</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>From text prompt</div>
              </div>
            </div>
            <textarea
              className="form-input form-textarea"
              style={{ minHeight: 72 }}
              placeholder="Or describe the scene to generate and animate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          {/* Motion effects */}
          <div className="db-card" style={{ marginBottom: 16 }}>
            <div className="db-card-title" style={{ marginBottom: 14 }}>Motion Effect</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {motionEffects.map((m) => (
                <div key={m.id}
                  onClick={() => setSelectedMotion(m.id)}
                  style={{
                    border: `2px solid ${selectedMotion === m.id ? 'var(--blue)' : 'var(--border)'}`,
                    borderRadius: 'var(--r)',
                    padding: '14px 10px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: selectedMotion === m.id ? 'var(--blue-light)' : '#fff',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{m.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: selectedMotion === m.id ? 'var(--blue)' : 'var(--text-2)' }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Particle & duration */}
          <div className="db-card">
            <div className="db-card-title" style={{ marginBottom: 16 }}>Effects & Duration</div>
            <div style={{ marginBottom: 14 }}>
              <div className="form-label" style={{ marginBottom: 8 }}>Particle Effect</div>
              <div className="toggle-group">
                {particleEffects.map((p) => (
                  <button key={p} className={`tgl-btn ${selectedParticle === p ? 'active' : ''}`} onClick={() => setSelectedParticle(p)}>{p}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="form-label" style={{ marginBottom: 8 }}>Duration</div>
              <div className="toggle-group">
                {['3 sec','5 sec','10 sec','15 sec'].map((d) => (
                  <button key={d} className={`tgl-btn ${duration === d ? 'active' : ''}`} onClick={() => setDuration(d)}>{d}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="db-card">
          <div className="db-card-title" style={{ marginBottom: 14 }}>Preview</div>
          <div className="video-preview-box" style={{ marginBottom: 14 }}>
            {!generating && !done && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, opacity: 0.25, marginBottom: 8 }}>✨</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Upload image or enter prompt</div>
              </div>
            )}
            {generating && (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div className="spinner" />
                <div style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>Animating scene...</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Applying {motionEffects.find(m => m.id === selectedMotion)?.label}</div>
              </div>
            )}
            {done && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 52 }}>✨</div>
                <div style={{ color: 'var(--green)', fontSize: 14, fontWeight: 700, marginTop: 8 }}>✓ Animation Queued!</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                  {motionEffects.find(m => m.id === selectedMotion)?.label} · {selectedParticle} · {duration}
                </div>
              </div>
            )}
          </div>
          <button className="btn btn-primary btn-full" onClick={handleGenerate} disabled={generating || !prompt.trim()}>
            {generating ? 'Animating...' : 'Generate Animation'}
          </button>
          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-3)', marginTop: 8 }}>Estimated: 15–30 seconds</div>
        </div>
      </div>
    </div>
  );
}
