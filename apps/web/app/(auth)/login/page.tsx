'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login({ email, password });
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span style={{ fontSize: 28 }}>🎬</span>
          <span className="auth-logo-text">AiCruzz</span>
        </div>
        <div className="auth-title">Welcome back</div>
        <div className="auth-sub">Log in to your AiCruzz account</div>

        {error && <div className="auth-error">⚠ {error}</div>}

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
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label className="form-label" htmlFor="password" style={{ margin: 0 }}>Password</label>
              <Link href="/forgot-password" style={{ fontSize: 13, fontWeight: 700, color: 'var(--blue)' }}>
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            className="btn btn-primary btn-full"
            type="submit"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? 'Logging in...' : 'Log In →'}
          </button>
        </form>

        <div className="divider-or">or continue with</div>
        <button className="social-btn">🌐 Continue with Google</button>
        <button className="social-btn">🐙 Continue with GitHub</button>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link href="/signup" className="auth-link">Sign up free</Link>
        </div>
      </div>
    </div>
  );
}
