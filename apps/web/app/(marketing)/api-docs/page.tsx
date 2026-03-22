import Link from 'next/link';

const endpoints = [
  { method: 'POST', path: '/api/v1/auth/register', desc: 'Register a new user' },
  { method: 'POST', path: '/api/v1/auth/login', desc: 'Login and receive JWT' },
  { method: 'GET',  path: '/api/v1/auth/me', desc: 'Get current user (auth required)' },
  { method: 'POST', path: '/api/v1/videos/generate', desc: 'Queue a text-to-video job' },
  { method: 'GET',  path: '/api/v1/videos', desc: 'List your videos (paginated)' },
  { method: 'GET',  path: '/api/v1/videos/:id/status', desc: 'Poll generation status' },
  { method: 'DELETE', path: '/api/v1/videos/:id', desc: 'Delete a video' },
];

const methodColor: Record<string, string> = {
  GET: '#22C55E', POST: '#2F6BFF', DELETE: '#EF4444', PATCH: '#F97316',
};

export default function ApiDocsPage() {
  return (
    <>
      <section style={{ padding: '80px 0 56px', background: 'linear-gradient(135deg, #0F1117, #1a1a2e)', textAlign: 'center' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(47,107,255,0.2)', color: '#7BA4FF', fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 999, marginBottom: 20, border: '1px solid rgba(47,107,255,0.3)' }}>
            🔑 API v1
          </div>
          <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 'clamp(32px,5vw,54px)', fontWeight: 800, color: '#fff', marginBottom: 16 }}>
            AiCruzz API Reference
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', maxWidth: 520, margin: '0 auto 36px' }}>
            Build AI video generation into your product. Studio plan required.
          </p>
          <Link href="/signup">
            <button className="btn btn-primary btn-lg">Get API Access</button>
          </Link>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="card" style={{ marginBottom: 28 }}>
            <div className="db-card-title" style={{ marginBottom: 16 }}>Base URL</div>
            <div style={{ background: '#0F1117', borderRadius: 'var(--r-sm)', padding: '12px 18px', fontFamily: 'DM Mono, monospace', fontSize: 14, color: '#7BA4FF' }}>
              https://api.aicruzz.io/v1
            </div>
          </div>

          <div className="card" style={{ marginBottom: 28 }}>
            <div className="db-card-title" style={{ marginBottom: 16 }}>Authentication</div>
            <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 14, lineHeight: 1.7 }}>
              Include your API key in the Authorization header as a Bearer token on every request.
            </p>
            <div style={{ background: '#0F1117', borderRadius: 'var(--r-sm)', padding: '12px 18px', fontFamily: 'DM Mono, monospace', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
              <span style={{ color: '#7BA4FF' }}>Authorization:</span> Bearer ac_live_sk_your_api_key
            </div>
          </div>

          <div className="card">
            <div className="db-card-title" style={{ marginBottom: 20 }}>Endpoints</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {endpoints.map((e) => (
                <div key={e.path} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: 'var(--bg)', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: methodColor[e.method], background: `${methodColor[e.method]}18`, padding: '3px 8px', borderRadius: 5, minWidth: 58, textAlign: 'center', fontFamily: 'DM Mono, monospace' }}>
                    {e.method}
                  </span>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: 'var(--text)', flex: 1 }}>{e.path}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{e.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
