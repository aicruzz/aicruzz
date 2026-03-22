'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function SignupPage() {
  const { register, loading, error } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await register({ name, email, password });
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span style={{ fontSize: 28 }}>🎬</span>
          <span className="auth-logo-text">AiCruzz</span>
        </div>
        <div className="auth-title">Create your account</div>
        <div className="auth-sub">Start creating AI videos for free today</div>

        {error && <div className="auth-error">⚠ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              id="name"
              className="form-input"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="form-input"
              type="email"
              placeholder="johndoe@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="form-input"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <button
            className="btn btn-primary btn-full"
            type="submit"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? 'Creating account...' : 'Create Free Account →'}
          </button>
        </form>

        <div className="divider-or">or sign up with</div>
        <button className="social-btn">🌐 Sign up with Google</button>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link href="/login" className="auth-link">Log in</Link>
        </div>
        <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: 'var(--text-3)' }}>
          By signing up you agree to our{' '}
          <Link href="#" style={{ color: 'var(--blue)' }}>Terms</Link> &{' '}
          <Link href="#" style={{ color: 'var(--blue)' }}>Privacy</Link>
        </div>
      </div>
    </div>
  );
}
