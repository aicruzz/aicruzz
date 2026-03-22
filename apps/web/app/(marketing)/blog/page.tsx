const posts = [
  { title: 'How to Create a Cinematic AI Video in 60 Seconds', date: 'Mar 10, 2025', tag: 'Tutorial', emoji: '🎬' },
  { title: 'Avatar Videos: The Future of Faceless Content Creation', date: 'Mar 4, 2025', tag: 'Deep Dive', emoji: '👤' },
  { title: 'AiCruzz API: Build AI Video into Your Product', date: 'Feb 28, 2025', tag: 'Developer', emoji: '🔑' },
  { title: '10 Creative Ways to Use AI Animation for Your Brand', date: 'Feb 20, 2025', tag: 'Inspiration', emoji: '✨' },
  { title: 'AiCruzz v5 — What\'s New in the Latest Release', date: 'Feb 12, 2025', tag: 'Announcement', emoji: '🚀' },
  { title: 'Text-to-Video vs Traditional Video Production: A Cost Analysis', date: 'Feb 5, 2025', tag: 'Business', emoji: '📊' },
];

export default function BlogPage() {
  return (
    <>
      <section style={{ padding: '80px 0 56px', background: 'linear-gradient(135deg, var(--blue-light), var(--purple-light) 60%, #fff)', textAlign: 'center' }}>
        <div className="container">
          <div className="section-eyebrow">Blog</div>
          <h1 className="section-title">AiCruzz Blog</h1>
          <p className="section-desc" style={{ margin: '14px auto' }}>
            Tutorials, product news, and inspiration for AI video creators.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {posts.map((p) => (
              <div key={p.title} className="card" style={{ cursor: 'pointer' }}>
                <div style={{ height: 140, borderRadius: 'var(--r)', background: 'linear-gradient(135deg, var(--blue-light), var(--purple-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, marginBottom: 18 }}>
                  {p.emoji}
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 999, background: 'var(--blue-light)', color: 'var(--blue)' }}>{p.tag}</span>
                <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16, fontWeight: 800, color: 'var(--text)', margin: '10px 0 8px', lineHeight: 1.4 }}>{p.title}</h3>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{p.date}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
