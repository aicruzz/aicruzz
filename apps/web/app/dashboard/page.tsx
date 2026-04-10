'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/auth';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter(); // ✅ ROUTER

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token =
          getToken() || localStorage.getItem('aicruzz_token');

        const res = await fetch('http://localhost:4000/api/v1/videos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        console.log('DASHBOARD DATA:', data);

        const videos = Array.isArray(data)
          ? data
          : data.data || [];

        setUser({
          name: 'Francis',
          videosCreated: videos.length,
          creditsLeft: 0,
          totalCredits: 0,
        });

      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
      }
    };

    fetchDashboard();
  }, []);

  if (!user) {
    return <div style={{ padding: 20 }}>Loading dashboard...</div>;
  }

  return (
    <div
      style={{
        padding: '32px',
        marginLeft: 10,
        maxWidth: 1200,
      }}
    >
      {/* HEADER */}
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>
          Welcome Back 👋, {user.name}
        </h1>
        <p style={{ color: '#6b7280' }}>
          Here's what's happening with your account
        </p>
      </div>

      {/* STATS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 20,
          marginBottom: 40,
        }}
      >
        <div style={cardStyle}>
          <p style={labelStyle}>Videos Created</p>
          <h2 style={valueStyle}>{user.videosCreated || 0}</h2>
        </div>

        <div style={cardStyle}>
          <p style={labelStyle}>Credits Left</p>
          <h2 style={valueStyle}>
            {user.creditsLeft || 0}/{user.totalCredits || 0}
          </h2>

          <div style={progressBarBg}>
            <div
              style={{
                ...progressBarFill,
                width: `${
                  user.totalCredits
                    ? (user.creditsLeft / user.totalCredits) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* QUICK START */}
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>
          Quick Start
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 20,
          }}
        >
          {quickActions.map((item, i) => (
            <div
              key={i}
              style={quickCard}
              onClick={() => {
                // ✅ UPDATED ROUTING
                if (item.title === 'Chat to Create') {
                  router.push('/dashboard/chat');
                }

                if (item.title === 'Motion Control') {
                  router.push('/dashboard/motion-control'); // 🔥 NEW
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  'translateY(-6px) scale(1.03)';
                e.currentTarget.style.boxShadow =
                  '0 20px 40px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow =
                  '0 8px 20px rgba(0,0,0,0.04)';
              }}
            >
              <div style={{ fontSize: 28 }}>{item.icon}</div>
              <p style={{ marginTop: 10, fontWeight: 500 }}>
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: 'linear-gradient(135deg, #ffffff, #f9fafb)',
  padding: 20,
  borderRadius: 16,
  border: '1px solid #eef2f7',
  boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
};

const labelStyle = {
  color: '#6b7280',
  fontSize: 14,
};

const valueStyle = {
  fontSize: 26,
  fontWeight: 700,
  marginTop: 5,
};

const progressBarBg = {
  height: 6,
  background: '#e5e7eb',
  borderRadius: 999,
  marginTop: 10,
};

const progressBarFill = {
  height: '100%',
  background: '#4f46e5',
  borderRadius: 999,
};

const quickCard = {
  background: 'linear-gradient(135deg, #ffffff, #f1f5ff)',
  padding: 22,
  borderRadius: 18,
  border: '1px solid #e0e7ff',
  textAlign: 'center' as const,
  cursor: 'pointer',
  transition: 'all 0.25s ease',
  boxShadow: '0 8px 20px rgba(0,0,0,0.04)',
};

const quickActions = [
  { title: 'Create Script Video', icon: '🎬' },
  { title: 'Motion Control', icon: '🧑‍💻' }, // ✅ NOW CONNECTED
  { title: 'Animation Video', icon: '✨' },
  { title: 'Chat to Create', icon: '🧠' },
  { title: 'Upload Media', icon: '📤' },
];