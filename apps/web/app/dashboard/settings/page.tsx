'use client';

import { useEffect, useState } from 'react';
import { authApi } from '@/lib/api';
import type { User } from '@aicruzz/types';

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [notifications, setNotifications] = useState({
    videoComplete: true,
    weeklyReport: true,
    productUpdates: true,
    marketing: false,
  });

  useEffect(() => {
    authApi.me().then((u) => {
      setUser(u);
      setName(u.name);
      setEmail(u.email);
    }).catch(() => {});
  }, []);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await authApi.updateMe({ name });
      setUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  }

  function toggleNotif(key: keyof typeof notifications) {
    setNotifications((n) => ({ ...n, [key]: !n[key] }));
  }

  return (
    <div className="db-content">
      <h1 className="db-page-title">Settings</h1>
      <p className="db-page-sub">Manage your profile, security, and preferences.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Profile */}
        <div className="db-card">
          <div className="db-card-title" style={{ marginBottom: 18 }}>Profile Settings</div>
          {saved && (
            <div style={{ background: 'var(--green-bg)', color: 'var(--green)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 'var(--r-sm)', padding: '10px 14px', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
              ✓ Profile saved successfully
            </div>
          )}
          <form onSubmit={handleSaveProfile}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'var(--blue-light)', border: '2px solid var(--blue-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 24, fontWeight: 800, color: 'var(--blue)' }}>
                  {name.charAt(0).toUpperCase() || 'U'}
                </div>
                <button type="button" className="btn btn-primary btn-sm" style={{ position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontSize: 10, padding: '3px 9px' }}>
                  Update
                </button>
              </div>
              <div style={{ flex: 1 }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" value={email} disabled style={{ background: 'var(--bg-2)', cursor: 'not-allowed' }} />
                  <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Email cannot be changed</p>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Current Plan</label>
                  <input className="form-input" value={user?.plan ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) : ''} disabled style={{ background: 'var(--bg-2)', cursor: 'not-allowed', textTransform: 'capitalize' }} />
                </div>
              </div>
            </div>
            <button className="btn btn-primary btn-full" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="db-card">
          <div className="db-card-title" style={{ marginBottom: 18 }}>Change Password</div>
          <form onSubmit={(e) => { e.preventDefault(); alert('Password change coming soon'); }}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input className="form-input" type="password" placeholder="••••••••" autoComplete="current-password" />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input className="form-input" type="password" placeholder="At least 8 characters" autoComplete="new-password" />
            </div>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label">Confirm New Password</label>
              <input className="form-input" type="password" placeholder="Repeat new password" autoComplete="new-password" />
            </div>
            <button className="btn btn-primary btn-full" type="submit">Update Password</button>
          </form>
        </div>
      </div>

      {/* Notifications */}
      <div className="db-card" style={{ maxWidth: 580 }}>
        <div className="db-card-title" style={{ marginBottom: 16 }}>Notification Preferences</div>
        {([
          ['videoComplete', 'Video generation complete', 'Notify when your AI video is ready'],
          ['weeklyReport',  'Weekly usage report',       'Summary of your monthly credit usage'],
          ['productUpdates','Product updates & news',    'New features and platform announcements'],
          ['marketing',     'Marketing emails',          'Tips and promotional offers'],
        ] as [keyof typeof notifications, string, string][]).map(([key, title, desc]) => (
          <div key={key} className="toggle-row">
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{desc}</div>
            </div>
            <div
              className={`toggle-sw ${notifications[key] ? 'on' : ''}`}
              onClick={() => toggleNotif(key)}
            />
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div className="db-card" style={{ maxWidth: 580, marginTop: 20, borderColor: 'rgba(239,68,68,0.3)' }}>
        <div className="db-card-title" style={{ marginBottom: 4, color: 'var(--red)' }}>Danger Zone</div>
        <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 16 }}>
          Deleting your account is permanent and cannot be undone.
        </p>
        <button className="btn btn-danger">Delete My Account</button>
      </div>
    </div>
  );
}
