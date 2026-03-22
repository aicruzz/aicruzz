'use client';

import { useState } from 'react';
import { videosApi } from '@/lib/api';
import type { VideoStyle, VideoResolution, AspectRatio } from '@aicruzz/types';

const styles: { label: string; value: VideoStyle; icon: string; bg: string }[] = [
  { label: 'Cinematic', value: 'cinematic', icon: '🎥', bg: 'linear-gradient(135deg,#f6d365,#fda085)' },
  { label: 'Cartoon',   value: 'cartoon',   icon: '🎨', bg: 'linear-gradient(135deg,#a8edea,#fed6e3)' },
  { label: 'Anime',     value: 'anime',     icon: '⛩️', bg: 'linear-gradient(135deg,#d299c2,#fef9d7)' },
  { label: 'Pixar',     value: 'pixar' as VideoStyle, icon: '🌟', bg: 'linear-gradient(135deg,#89f7fe,#66a6ff)' },
  { label: 'Realistic', value: 'realistic', icon: '🌿', bg: 'linear-gradient(135deg,#fddb92,#d1fdff)' },
];

const durations = ['5 sec', '10 sec', '20 sec', '60 sec'];
const resolutions: VideoResolution[] = ['720p', '1080p', '4k'];
const ratios: AspectRatio[] = ['16:9', '9:16', '1:1'];

const suggestions = [
  'Cinematic scene with dramatic lighting',
  'Fun cartoon animation with bright colors',
  'Anime style with vibrant effects',
  'Professional product advertisement',
];

type GenStatus = 'idle' | 'generating' | 'done' | 'error';

export default function CreatePage() {
  const [prompt, setPrompt] = useState('Create a cinematic drone video flying over Lagos at sunset with golden lighting and ocean waves');
  const [selectedStyle, setSelectedStyle] = useState<VideoStyle>('cinematic');
  const [duration, setDuration] = useState('10 sec');
  const [resolution, setResolution] = useState<VideoResolution>('1080p');
  const [ratio, setRatio] = useState<AspectRatio>('16:9');
  const [status, setStatus] = useState<GenStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [error, setError] = useState('');

  async function handleGenerate() {
    if (!prompt.trim()) { setError('Please enter a video description'); return; }
    setError('');
    setStatus('generating');
    setProgress(0);

    const steps = ['Analyzing prompt…', 'Generating keyframes…', 'Applying style…', 'Adding motion…', 'Encoding…', 'Finalizing…'];
    let step = 0;
    const iv = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + Math.random() * 15 + 4, 95);
        if (step < steps.length) setProgressLabel(steps[step++]);
        return next;
      });
    }, 420);

    try {
      const durationSec = parseInt(duration) || 10;
      await videosApi.generate({ prompt, style: selectedStyle, duration: durationSec, resolution, aspect_ratio: ratio });
      clearInterval(iv);
      setProgress(100);
      setProgressLabel('Done!');
      setTimeout(() => setStatus('done'), 400);
    } catch (err: unknown) {
      clearInterval(iv);
      setStatus('error');
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Generation failed. Please try again.');
    }
  }

  return (
    <div className="db-content">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 className="db-page-title">Create AI Video</h1>
          <p className="db-page-sub">Generate professional videos from text prompts, scripts, or templates.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline btn-sm">⬆ Import Video</button>
          <button className="btn btn-outline btn-sm">📋 Templates</button>
        </div>
      </div>

      {/* Prompt */}
      <div className="db-card" style={{ marginBottom: 18 }}>
        <div className="db-card-title" style={{ marginBottom: 12 }}>Describe the video you want to generate</div>
        {error && <div className="auth-error" style={{ marginBottom: 12 }}>⚠ {error}</div>}
        <textarea
          className="form-input form-textarea"
          style={{ minHeight: 82, marginBottom: 12 }}
          placeholder="Create a cinematic drone video flying over Lagos at sunset..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {suggestions.map((s) => (
            <span key={s} onClick={() => setPrompt(s)}
              style={{ fontSize: 12, padding: '5px 13px', background: 'var(--blue-light)', color: 'var(--blue)', borderRadius: 999, cursor: 'pointer', fontWeight: 600 }}>
              {s}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' }}>
        <div>
          {/* Style selector */}
          <div className="db-card" style={{ marginBottom: 16 }}>
            <div className="db-card-title" style={{ marginBottom: 14 }}>Select Video Style</div>
            <div className="style-grid">
              {styles.map((s) => (
                <div key={s.value} className={`style-card ${selectedStyle === s.value ? 'active' : ''}`} onClick={() => setSelectedStyle(s.value)}>
                  <div className="style-card-img" style={{ background: s.bg }}>{s.icon}</div>
                  <div className="style-card-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="db-card">
            <div className="db-card-title" style={{ marginBottom: 16 }}>Video Settings</div>
            <div style={{ marginBottom: 14 }}>
              <div className="form-label" style={{ marginBottom: 8 }}>Duration</div>
              <div className="toggle-group">
                {durations.map((d) => (
                  <button key={d} className={`tgl-btn ${duration === d ? 'active' : ''}`} onClick={() => setDuration(d)}>{d}</button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
              <span className="form-label" style={{ margin: 0, minWidth: 80 }}>Resolution</span>
              <div className="toggle-group">
                {resolutions.map((r) => (
                  <button key={r} className={`tgl-btn ${resolution === r ? 'active' : ''}`} onClick={() => setResolution(r)}>{r}</button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span className="form-label" style={{ margin: 0, minWidth: 80 }}>Aspect Ratio</span>
              <div className="toggle-group">
                {ratios.map((r) => (
                  <button key={r} className={`tgl-btn ${ratio === r ? 'active' : ''}`} onClick={() => setRatio(r)}>{r}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview panel */}
        <div className="db-card">
          <div className="db-card-title" style={{ marginBottom: 14 }}>Video Preview</div>

          <div className="video-preview-box" style={{ marginBottom: 14 }}>
            {status === 'idle' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, opacity: 0.25, marginBottom: 8 }}>🎬</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Configure settings and generate</div>
              </div>
            )}
            {status === 'generating' && (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div className="spinner" />
                <div style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>Generating Video...</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{progressLabel}</div>
                <div style={{ width: 200, height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: '#fff', borderRadius: 3, transition: 'width 0.3s' }} />
                </div>
              </div>
            )}
            {status === 'done' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 52 }}>🎬</div>
                <div style={{ color: 'var(--green)', fontSize: 14, fontWeight: 700, marginTop: 8 }}>✓ Video Queued!</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                  {selectedStyle} · {resolution} · {duration}
                </div>
              </div>
            )}
            {status === 'error' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 36 }}>⚠️</div>
                <div style={{ color: 'var(--red)', fontSize: 13, marginTop: 8 }}>Generation failed</div>
              </div>
            )}
          </div>

          <button
            className="btn btn-primary btn-full"
            onClick={handleGenerate}
            disabled={status === 'generating'}
            style={{ marginBottom: 8 }}
          >
            {status === 'generating' ? 'Generating...' : 'Generate AI Video'}
          </button>
          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-3)' }}>Estimated time: 20–40 seconds</div>
          {status === 'done' && (
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center' }}>✂️ Editor</button>
              <button className="btn btn-sm" style={{ flex: 1, justifyContent: 'center', background: 'var(--green-bg)', color: 'var(--green)', border: 'none', fontWeight: 700 }}>⬇ Download</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
