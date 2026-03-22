import Link from 'next/link';

const features = [
  {
    icon: '🎬', title: 'Text to Video', tag: 'Core',
    desc: 'Transform any text prompt into a stunning video. Choose from cinematic, anime, cartoon, Pixar-style, and more. Supports 5s to 60s duration.',
    bullets: ['6 visual styles', '720p to 4K resolution', '16:9, 9:16, and 1:1 aspect ratios', 'Auto-generated captions'],
    color: 'var(--blue-light)', accent: 'var(--blue)',
  },
  {
    icon: '👤', title: 'Avatar Videos', tag: 'Pro',
    desc: 'Write a script and let an AI avatar deliver it. Choose from 10+ professional presenters with natural lip-sync and voice matching.',
    bullets: ['10+ avatar templates', 'Natural lip-sync', 'Custom background scenes', 'Multiple voice styles'],
    color: 'var(--purple-light)', accent: 'var(--purple)',
  },
  {
    icon: '✨', title: 'Animation Studio', tag: 'Pro',
    desc: 'Upload an image or generate one from text, then animate it with AI-powered motion — camera pans, zoom, particle effects, and scene transitions.',
    bullets: ['Image to animation', 'Camera motion effects', 'Particle & weather FX', 'Scene transitions'],
    color: 'var(--pink-light)', accent: 'var(--pink)',
  },
  {
    icon: '🔄', title: 'Video Transform', tag: 'Core',
    desc: 'Upload any video and re-render it in a completely different visual style. Turn a real scene into anime or a selfie video into a Pixar film.',
    bullets: ['Anime, cartoon, cyberpunk styles', 'Preserves original motion', 'Batch transform coming soon', 'Up to 60s input video'],
    color: 'var(--orange-light)', accent: 'var(--orange)',
  },
  {
    icon: '🎙️', title: 'AI Voice Narration', tag: 'Starter',
    desc: 'Generate broadcast-quality voice-overs in 50+ languages. Choose from 30+ voice profiles: calm, energetic, news-anchor, storyteller.',
    bullets: ['50+ languages', '30+ voice profiles', 'MP3, WAV, AAC export', 'Sync to video timeline'],
    color: 'var(--teal-light)', accent: 'var(--teal)',
  },
  {
    icon: '🔑', title: 'Developer API', tag: 'Studio',
    desc: 'Build video generation directly into your product. Full REST API with webhooks, status polling, and official SDKs for Node.js and Python.',
    bullets: ['REST API + webhooks', 'Node.js & Python SDKs', 'Status polling + SSE', 'Sandbox environment'],
    color: 'var(--yellow-light)', accent: 'var(--yellow)',
  },
];

const tagColor: Record<string, string> = {
  Core: 'var(--blue)',
  Starter: 'var(--teal)',
  Pro: 'var(--purple)',
  Studio: 'var(--orange)',
};
const tagBg: Record<string, string> = {
  Core: 'var(--blue-light)',
  Starter: 'var(--teal-light)',
  Pro: 'var(--purple-light)',
  Studio: 'var(--orange-light)',
};

export default function FeaturesPage() {
  return (
    <>
      <section style={{ padding: '80px 0 56px', background: 'linear-gradient(135deg, var(--blue-light), var(--purple-light) 60%, #fff)', textAlign: 'center' }}>
        <div className="container">
          <div className="section-eyebrow">Platform Features</div>
          <h1 className="section-title" style={{ fontSize: 'clamp(32px,5vw,56px)' }}>
            Every Tool a Creator Needs
          </h1>
          <p className="section-desc" style={{ margin: '14px auto 32px' }}>
            One subscription. Six powerful AI creation modes. No experience required.
          </p>
          <Link href="/signup">
            <button className="btn btn-primary btn-lg">Start Creating Free →</button>
          </Link>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {features.map((f, i) => (
              <div key={f.title} style={{
                background: '#fff',
                borderRadius: 'var(--r-xl)',
                border: '1.5px solid var(--border)',
                padding: '36px 40px',
                display: 'grid',
                gridTemplateColumns: i % 2 === 0 ? '1fr 360px' : '360px 1fr',
                gap: 48,
                alignItems: 'center',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                      {f.icon}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: tagBg[f.tag], color: tagColor[f.tag], textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {f.tag}
                    </span>
                  </div>
                  <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 26, fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>{f.title}</h2>
                  <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 20 }}>{f.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {f.bullets.map((b) => (
                      <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text-2)' }}>
                        <span style={{ color: 'var(--green)', fontWeight: 700 }}>✓</span> {b}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ order: i % 2 === 0 ? 1 : 0 }}>
                  <div style={{ background: `linear-gradient(135deg, ${f.color}, #fff)`, borderRadius: 'var(--r-lg)', border: `1.5px solid ${f.accent}22`, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72 }}>
                    {f.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-sm" style={{ background: 'var(--grad-blue)', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 14 }}>
            Start with 5 Free Videos Today
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 28, fontSize: 16 }}>No credit card. No commitment.</p>
          <Link href="/signup">
            <button className="btn btn-white btn-lg">Create Free Account →</button>
          </Link>
        </div>
      </section>
    </>
  );
}
