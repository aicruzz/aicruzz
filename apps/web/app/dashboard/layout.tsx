'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import { getToken } from '@/lib/auth';
import { authApi } from '@/lib/api';
import type { User } from '@aicruzz/types';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace('/login');
      return;
    }
    authApi.me()
      .then((u) => { setUser(u); setChecked(true); })
      .catch(() => { router.replace('/login'); });
  }, [router]);

  if (!checked) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--db-bg)' }}>
        <div className="spinner" style={{ borderColor: 'rgba(47,107,255,0.15)', borderTopColor: 'var(--blue)' }} />
      </div>
    );
  }

  return (
    <div className="db-layout">
      <Sidebar userName={user?.name} userPlan={user?.plan} />
      <div className="db-main">
        {/* Topbar */}
        <div className="db-topbar">
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--text-3)' }}>
            app.aicruzz.io
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--blue-light)', border: '2px solid var(--blue-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--blue)' }}>
              {user?.name?.charAt(0).toUpperCase() ?? 'U'}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{user?.name}</span>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>⌄</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
