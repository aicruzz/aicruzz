export default function ContactPage() {
  return (
    <>
      <section style={{ padding: '80px 0 56px', background: 'linear-gradient(135deg, var(--blue-light), var(--purple-light) 60%, #fff)', textAlign: 'center' }}>
        <div className="container">
          <div className="section-eyebrow">Get in Touch</div>
          <h1 className="section-title">Contact Us</h1>
          <p className="section-desc" style={{ margin: '14px auto' }}>
            Have questions? We'd love to hear from you. Send us a message and we'll get back within 24 hours.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: '#fff' }}>
        <div className="container" style={{ maxWidth: 640 }}>
          <div className="card">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="johndoe@email.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input className="form-input" type="text" placeholder="How can we help?" />
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea className="form-input form-textarea" placeholder="Tell us more..." style={{ minHeight: 120 }} />
            </div>
            <button className="btn btn-primary btn-full">Send Message →</button>
          </div>

          <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, textAlign: 'center' }}>
            {[['📧','Email','support@aicruzz.io'],['💬','Live Chat','Available 9am–6pm UTC'],['📚','Docs','docs.aicruzz.io']].map(([icon, label, val]) => (
              <div key={label} style={{ padding: '20px 16px', background: 'var(--bg)', borderRadius: 'var(--r)', border: '1.5px solid var(--border)' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
