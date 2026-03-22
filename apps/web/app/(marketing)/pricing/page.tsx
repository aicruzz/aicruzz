import Link from 'next/link';

const plans = [
  {
    name: 'Free', price: 0, period: 'forever', cta: 'Get Started Free', ctaHref: '/signup', featured: false,
    features: ['5 videos per month', '720p resolution', '3 visual styles', 'AiCruzz watermark', 'Community support'],
  },
  {
    name: 'Starter', price: 19, period: 'per month', cta: 'Start Free Trial', ctaHref: '/signup', featured: false,
    features: ['50 videos per month', '1080p Full HD', 'All visual styles', 'No watermark', 'AI voice narration', 'Email support'],
  },
  {
    name: 'Pro', price: 49, period: 'per month', cta: 'Go Pro →', ctaHref: '/signup', featured: true,
    features: ['200 videos per month', '4K Ultra HD', 'Avatar Studio', 'Animation Studio', 'Priority processing', 'Priority support'],
  },
  {
    name: 'Studio', price: 99, period: 'per month', cta: 'Contact Sales', ctaHref: '/contact', featured: false,
    features: ['Unlimited videos', 'API access + SDKs', '5 team seats', 'Custom branding', 'Dedicated SLA', '24/7 phone support'],
  },
];

const comparison = [
  ['Videos/month',    '5',   '50',   '200',      'Unlimited'],
  ['Max resolution',  '720p','1080p','4K',        '4K'],
  ['Max duration',    '15s', '30s',  '60s',       '60s'],
  ['Avatar Studio',   '—',   '—',    '✓',         '✓'],
  ['Animation Studio','—',   '—',    '✓',         '✓'],
  ['API Access',      '—',   '—',    '—',         '✓'],
  ['Team Seats',      '1',   '1',    '1',         '5'],
  ['Support', 'Community', 'Email', 'Priority', '24/7 Phone'],
];

export default function PricingPage() {
  return (
    <>
      <section style={{ padding: '80px 0 56px', background: 'linear-gradient(160deg, var(--blue-light), var(--purple-light) 60%, #fff)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-eyebrow">Pricing Plans</div>
          <h1 className="section-title" style={{ fontSize: 'clamp(34px,5vw,58px)' }}>Plans for Every Creator</h1>
          <p className="section-desc" style={{ margin: '14px auto 0' }}>
            Start free. Upgrade when you need more. Cancel any time.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          {/* Pricing cards */}
          <div className="pricing-grid" style={{ marginBottom: 48 }}>
            {plans.map((p) => (
              <div key={p.name} className={`price-card ${p.featured ? 'featured' : ''}`}>
                <div className="price-tier">{p.name}</div>
                <div className="price-amount">
                  {p.price === 0 ? '$0' : <><sup>$</sup>{p.price}</>}
                </div>
                <div className="price-period">{p.period}</div>
                <div className="price-divider" />
                {p.features.map((f) => (
                  <div key={f} className="price-feature">
                    <div className="price-check">✓</div>
                    {f}
                  </div>
                ))}
                <Link href={p.ctaHref}>
                  <button className={`btn ${p.featured ? 'btn-primary' : 'btn-outline'} btn-full`} style={{ marginTop: 22, justifyContent: 'center' }}>
                    {p.cta}
                  </button>
                </Link>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div style={{ overflowX: 'auto', borderRadius: 'var(--r-lg)', border: '1.5px solid var(--border)' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Free</th>
                  <th>Starter</th>
                  <th style={{ background: 'var(--blue-light)', color: 'var(--blue)' }}>Pro ⭐</th>
                  <th>Studio</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map(([feat, ...vals]) => (
                  <tr key={feat}>
                    <td>{feat}</td>
                    {vals.map((v, i) => (
                      <td key={i} style={i === 2 ? { background: 'var(--blue-light)', fontWeight: v === '✓' ? 700 : undefined, color: v === '✓' ? 'var(--green)' : undefined } : { color: v === '✓' ? 'var(--green)' : undefined, fontWeight: v === '✓' ? 700 : undefined }}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment methods */}
          <div style={{ marginTop: 56, background: 'var(--bg)', borderRadius: 'var(--r-xl)', padding: 40 }}>
            <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Flexible Payment Methods</h3>
            <p style={{ color: 'var(--text-2)', marginBottom: 28, fontSize: 15 }}>We accept all major payment methods including crypto.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
              {[['💳','Credit / Debit Card','Visa, Mastercard, Amex'],['🅿️','PayPal','PayPal balance or card'],['₿','Bitcoin & ETH','BTC, ETH, USDT, USDC'],['🏦','Bank Transfer','Studio plan only']].map(([icon,title,sub]) => (
                <div key={title} style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--r)', padding: 20, textAlign: 'center' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
