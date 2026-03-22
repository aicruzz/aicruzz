export default function AboutPage() {
  return (
    <>
      <section style={{ padding: '80px 0 56px', background: 'linear-gradient(135deg, var(--blue-light), var(--purple-light) 60%, #fff)', textAlign: 'center' }}>
        <div className="container">
          <div className="section-eyebrow">About AiCruzz</div>
          <h1 className="section-title" style={{ fontSize: 'clamp(32px,5vw,54px)' }}>
            Built for the Next Generation<br />of Video Creators
          </h1>
          <p className="section-desc" style={{ margin: '14px auto' }}>
            We're on a mission to democratize professional video creation using artificial intelligence.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: '#fff' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 26, fontWeight: 800, marginBottom: 16 }}>Our Story</h2>
          <p style={{ fontSize: 16, color: 'var(--text-2)', lineHeight: 1.8, marginBottom: 24 }}>
            AiCruzz was founded in 2024 with a simple idea: creating professional-quality video shouldn't require
            years of expertise or expensive software. Using the latest advances in generative AI — diffusion models,
            lip-sync networks, and neural style transfer — we built a platform that lets anyone produce stunning
            content in seconds.
          </p>
          <p style={{ fontSize: 16, color: 'var(--text-2)', lineHeight: 1.8 }}>
            Today, over 180,000 creators, marketers, and developers use AiCruzz to build content for YouTube, TikTok,
            Instagram, e-commerce, e-learning, and enterprise communications. We're just getting started.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginTop: 48 }}>
            {[['2024','Founded'],['180K+','Creators'],['4M+','Videos generated']].map(([val, lbl]) => (
              <div key={lbl} style={{ textAlign: 'center', padding: '28px 20px', background: 'var(--bg)', borderRadius: 'var(--r-lg)', border: '1.5px solid var(--border)' }}>
                <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 34, fontWeight: 800, background: 'var(--grad-blue)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{val}</div>
                <div style={{ fontSize: 14, color: 'var(--text-2)', marginTop: 6 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
