'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import type { User } from '@aicruzz/types';

const planDetails: Record<string, { price: string; label: string }> = {
  free:    { price: '$0',  label: 'Free' },
  starter: { price: '$19/month', label: 'Starter' },
  pro:     { price: '$49/month', label: 'Pro' },
  studio:  { price: '$99/month', label: 'Studio' },
};

export default function BillingPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => { authApi.me().then(setUser).catch(() => {}); }, []);

  const plan = user?.plan ?? 'free';
  const planInfo = planDetails[plan] ?? planDetails.free;
  const creditsUsed = user?.credits_used ?? 0;
  const creditsLimit = user?.credits_limit ?? 5;

  return (
    <div className="db-content">
      <h1 className="db-page-title">Billing & Subscription</h1>
      <p className="db-page-sub">Manage your plan, credits, and payment details.</p>

      <div style={{ maxWidth: 760 }}>
        {/* Current plan */}
        <div className="plan-card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>Current Plan</div>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 26, fontWeight: 800, color: 'var(--text)' }}>
                {planInfo.label} Plan{' '}
                <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--blue)' }}>{planInfo.price}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-outline btn-sm">Manage Billing</button>
              <Link href="/pricing"><button className="btn btn-primary btn-sm">Upgrade Plan</button></Link>
            </div>
          </div>

          {[
            ['Videos used this month', creditsUsed, creditsLimit, (creditsUsed / creditsLimit) * 100, 'var(--grad-blue)'],
            ['Storage used', 0, 100, 0, 'linear-gradient(90deg,#7C3AED,#EC4899)'],
          ].map(([label, used, total, pct, bg]) => (
            <div key={String(label)} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-2)', marginBottom: 5 }}>
                <span>{label}</span>
                <span style={{ fontWeight: 700 }}>{String(used)} / {String(total)}</span>
              </div>
              <div className="usage-bar"><div className="usage-fill" style={{ width: `${pct}%`, background: String(bg) }} /></div>
            </div>
          ))}
        </div>

        {/* Payment method */}
        <div className="db-card" style={{ marginBottom: 18 }}>
          <div className="db-card-title" style={{ marginBottom: 14 }}>💳 Payment Method</div>
          {plan === 'free' ? (
            <div style={{ fontSize: 14, color: 'var(--text-3)', padding: '12px 0' }}>
              No payment method required for the Free plan.{' '}
              <Link href="/pricing" style={{ color: 'var(--blue)', fontWeight: 700 }}>Upgrade to add one</Link>
            </div>
          ) : (
            <div style={{ background: 'var(--bg-2)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24 }}>💳</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Visa ending in 4242</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Expires 08/2027</div>
              </div>
              <button className="btn btn-outline btn-sm" style={{ marginLeft: 'auto' }}>Update</button>
            </div>
          )}
        </div>

        {/* Billing history */}
        <div className="db-card">
          <div className="db-card-title" style={{ marginBottom: 14 }}>🧾 Billing History</div>
          {plan === 'free' ? (
            <div style={{ fontSize: 14, color: 'var(--text-3)', padding: '12px 0' }}>No invoices yet.</div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                <tr>
                  <td style={{ color: 'var(--text-2)' }}>Jun 1, 2025</td>
                  <td>{planInfo.label} Plan</td>
                  <td style={{ fontWeight: 700 }}>{planInfo.price.replace('/month','')}</td>
                  <td><span className="badge badge-done">Paid</span></td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
