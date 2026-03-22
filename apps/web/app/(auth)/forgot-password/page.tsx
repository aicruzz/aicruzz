'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: call API reset endpoint
    setSent(true);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span style={{ fontSize: 28 }}>🎬</span>
          <span className="auth-logo-text">AiCruzz</span>
        </div>
        <div style={{ textAlign: 'center', fontSize: 44, marginBottom: 14 }}>🔐</div>
        <div className="auth-title">Reset Password</div>
        <div className="auth-sub">Enter your email and we'll send a reset link</div>

        {sent ? (
          <div style={{ background: 'var(--green-bg)', color: 'var(--green)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 'var(--r-sm)', padding: '14px', textAlign: 'center', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
            ✓ Reset link sent! Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email address</label>
              <input
                id="email"
                className="form-input"
                type="email"
                placeholder="johndoe@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-primary btn-full" type="submit">
              Send Reset Link →
            </button>
          </form>
        )}

        <div className="auth-footer">
          <Link href="/login" className="auth-link">← Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
