'use client';

import { useState } from 'react';
import Link from 'next/link';

const categories = ['All', 'Marketing', 'Education', 'Social Media', 'Business', 'Entertainment'];

const templates = [
  { id: '1', name: 'YouTube Intro',        category: 'Marketing',    icon: '📺', bg: 'linear-gradient(135deg,#1a1a2e,#c0392b)', style: 'Cinematic', duration: '15s' },
  { id: '2', name: 'Business Explainer',   category: 'Business',     icon: '👩‍💼', bg: 'linear-gradient(135deg,#2c3e50,#3498db)', style: 'Realistic', duration: '30s' },
  { id: '3', name: 'Social Media Ad',      category: 'Social Media', icon: '📱', bg: 'linear-gradient(135deg,#e74c3c,#f39c12)', style: 'Cartoon',  duration: '15s' },
  { id: '4', name: 'Product Showcase',     category: 'Marketing',    icon: '🛍️', bg: 'linear-gradient(135deg,#667eea,#764ba2)', style: 'Cinematic', duration: '30s' },
  { id: '5', name: 'Course Introduction',  category: 'Education',    icon: '📚', bg: 'linear-gradient(135deg,#4facfe,#00f2fe)', style: 'Realistic', duration: '60s' },
  { id: '6', name: 'TikTok Hook',          category: 'Social Media', icon: '🎵', bg: 'linear-gradient(135deg,#f093fb,#f5576c)', style: 'Anime',    duration: '10s' },
  { id: '7', name: 'Startup Pitch',        category: 'Business',     icon: '🚀', bg: 'linear-gradient(135deg,#0f0c29,#302b63)', style: 'Cinematic', duration: '60s' },
  { id: '8', name: 'Travel Vlog Intro',    category: 'Entertainment', icon: '✈️', bg: 'linear-gradient(135deg,#11998e,#38ef7d)', style: 'Cinematic', duration: '15s' },
  { id: '9', name: 'Cooking Tutorial',     category: 'Education',    icon: '🍳', bg: 'linear-gradient(135deg,#f7971e,#ffd200)', style: 'Realistic', duration: '30s' },
];

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = templates.filter((t) => {
    const matchCat = activeCategory === 'All' || t.category === activeCategory;
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="db-content">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 className="db-page-title">Templates</h1>
          <p className="db-page-sub">Start from a proven template. Customize and generate in seconds.</p>
        </div>
        <Link href="/dashboard/create">
          <button className="btn btn-outline">+ Start from Scratch</button>
        </Link>
      </div>

      {/* Search & filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          className="form-input"
          style={{ width: 240 }}
          placeholder="🔍  Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="toggle-group">
          {categories.map((c) => (
            <button key={c} className={`tgl-btn ${activeCategory === c ? 'active' : ''}`} onClick={() => setActiveCategory(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-3)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div>No templates found for "{search}"</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {filtered.map((t) => (
            <div key={t.id} className="db-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ height: 140, background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
                {t.icon}
              </div>
              <div style={{ padding: '16px 18px' }}>
                <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>{t.name}</div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', background: 'var(--blue-light)', color: 'var(--blue)', borderRadius: 999 }}>{t.category}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', background: 'var(--bg-2)', color: 'var(--text-3)', borderRadius: 999 }}>{t.style}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', background: 'var(--bg-2)', color: 'var(--text-3)', borderRadius: 999 }}>{t.duration}</span>
                </div>
                <Link href={`/dashboard/create?template=${t.id}`}>
                  <button className="btn btn-primary btn-sm btn-full">Use Template →</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
