import Link from 'next/link';

const features = [
  { icon: '🎬', title: 'Text to Video', desc: 'Type a prompt, get a cinematic AI video in seconds. Styles from realistic to anime.', color: 'var(--blue-light)', accent: 'var(--blue)' },
  { icon: '👤', title: 'Avatar Videos', desc: 'Create talking avatar videos with lip-synced AI presenters from a written script.', color: 'var(--purple-light)', accent: 'var(--purple)' },
  { icon: '✨', title: 'Animation Studio', desc: 'Bring still images to life with AI-powered motion and 3D animation effects.', color: 'var(--pink-light)', accent: 'var(--pink)' },
  { icon: '🔄', title: 'Video Transform', desc: 'Upload any video and transform it into anime, cartoon, cinematic, or oil-painting style.', color: 'var(--orange-light)', accent: 'var(--orange)' },
  { icon: '🎙️', title: 'AI Voice Narration', desc: 'Generate natural voice-overs in 50+ languages with 30+ voice profiles.', color: 'var(--teal-light)', accent: 'var(--teal)' },
  { icon: '🔑', title: 'Developer API', desc: 'Build on top of AiCruzz with our REST API. SDKs for Node.js and Python.', color: 'var(--yellow-light)', accent: 'var(--yellow)' },
];

const steps = [
  { n: '01', title: 'Describe your video', desc: 'Write a text prompt or pick a template for your scene.' },
  { n: '02', title: 'Choose your style', desc: 'Select cinematic, anime, cartoon, realistic and more.' },
  { n: '03', title: 'Generate & download', desc: 'AI renders your video in under 60 seconds. Download in 4K.' },
];

const stats = [
  { val: '180K+', label: 'Creators' },
  { val: '4M+', label: 'Videos made' },
  { val: '50+', label: 'Languages' },
  { val: '4.9★', label: 'Average rating' },
];

export default function HomePage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-blobs">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="hero-blob hero-blob-3" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            🚀 Now Live — 5 Free Videos Every Month
          </div>
          <h1 className="hero-title">
            Create <span className="grad-text">Stunning AI Videos</span>
            <br />In Seconds, Not Days
          </h1>
          <p className="hero-sub">
            The all-in-one AI video platform. Generate cinematic scenes, talking avatars,
            3D animations, and voice narration — all from one powerful dashboard.
          </p>
          <div className="hero-actions">
            <Link href="/signup">
              <button className="btn btn-primary btn-lg">Get Started Free →</button>
            </Link>
            <Link href="/features">
              <button className="btn btn-secondary btn-lg">Explore Features</button>
            </Link>
          </div>
          <div className="hero-social-proof">
            <div className="proof-avatars">
              {['KO','SM','JL','AB','+'].map((i, idx) => (
                <div key={idx} className="proof-avatar" style={idx === 1 ? { background: 'linear-gradient(135deg,#EC4899,#F97316)' } : idx === 2 ? { background: 'linear-gradient(135deg,#0D9488,#2F6BFF)' } : {}}>
                  {i}
                </div>
              ))}
            </div>
            <div className="proof-text"><strong>180,000+</strong> creators already using AiCruzz</div>
            <div>
              <div style={{ color: '#F97316', fontSize: 14, letterSpacing: 2 }}>★★★★★</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>4.9 / 5 rating</div>
            </div>
          </div>
        </div>

        {/* Dashboard preview mockup */}
        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ background: '#fff', borderRadius: '24px 24px 0 0', border: '1.5px solid var(--border)', borderBottom: 'none', boxShadow: '0 -8px 60px rgba(47,107,255,0.14)', overflow: 'hidden' }}>
            <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['#FF5F57','#FEBC2E','#28C840'].map((c) => <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />)}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500 }}>app.aicruzz.io — Dashboard</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)' }}>John Doe ⌄</div>
            </div>
            <div style={{ display: 'flex', height: 380 }}>
              <div style={{ width: 200, background: 'var(--blue)', padding: '14px 0', flexShrink: 0 }}>
                <div style={{ padding: '0 14px 12px', fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>AiCruzz</div>
                {['⊞ Dashboard','🎬 Create Video','👤 Avatar Videos','✨ Animation Studio','📁 My Videos'].map((item, i) => (
                  <div key={i} style={{ padding: '8px 14px', margin: '1px 8px', borderRadius: 7, fontSize: 12.5, fontWeight: i === 0 ? 600 : 500, color: i === 0 ? '#fff' : 'rgba(255,255,255,0.6)', background: i === 0 ? 'rgba(255,255,255,0.18)' : 'transparent' }}>
                    {item}
                  </div>
                ))}
              </div>
              <div style={{ flex: 1, background: '#F4F6FF', padding: 20, overflow: 'hidden' }}>
                <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>Welcome Back, John! 👋</div>
                <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 16 }}>Here's what's happening today.</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
                  {[['Videos Created','128','64%','var(--grad-blue)'],['Monthly Credits','320/500','64%','linear-gradient(90deg,#F97316,#EAB308)'],['Processing','3','15%','linear-gradient(90deg,#22C55E,#0D9488)'],['Storage','75%','75%','linear-gradient(90deg,#7C3AED,#EC4899)']].map(([lbl,val,pct,bg]) => (
                    <div key={lbl} style={{ background: '#fff', borderRadius: 10, padding: '12px 14px', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>{lbl}</div>
                      <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>{val}</div>
                      <div style={{ height: 4, background: 'var(--bg-2)', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: pct, background: bg, borderRadius: 999 }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#fff', borderRadius: 10, padding: 14, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>Quick Start</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                    {[['🎬','Text to Video'],['🧑‍💼','Avatar Video'],['✨','Transform']].map(([icon,lbl]) => (
                      <div key={lbl} style={{ background: 'var(--bg-2)', borderRadius: 8, padding: '10px 8px', textAlign: 'center', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)' }}>{lbl}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: '#fff', padding: '48px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, textAlign: 'center' }}>
            {stats.map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 36, fontWeight: 800, background: 'var(--grad-blue)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.val}</div>
                <div style={{ fontSize: 14, color: 'var(--text-2)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div className="section-eyebrow">Everything you need</div>
            <h2 className="section-title">One Platform, Infinite Possibilities</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              From text prompts to broadcast-ready videos — every tool you need in one place.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {features.map((f) => (
              <div key={f.title} className="card">
                <div style={{ width: 52, height: 52, borderRadius: 14, background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 16 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', marginBottom: 8, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div className="section-eyebrow">How it works</div>
            <h2 className="section-title">Create Your First Video in 3 Steps</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32 }}>
            {steps.map((s) => (
              <div key={s.n} style={{ textAlign: 'center' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--grad-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 20, fontWeight: 800, color: '#fff' }}>
                  {s.n}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 10, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section" style={{ background: 'linear-gradient(135deg, #EEF3FF, #F3EEFF 60%, #FDF2F8)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title" style={{ marginBottom: 16 }}>Ready to Start Creating?</h2>
          <p className="section-desc" style={{ margin: '0 auto 36px' }}>
            Join 180,000+ creators. Start free — no credit card required.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup">
              <button className="btn btn-primary btn-lg">Create Free Account →</button>
            </Link>
            <Link href="/pricing">
              <button className="btn btn-secondary btn-lg">View Pricing</button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
