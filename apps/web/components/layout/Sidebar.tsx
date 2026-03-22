'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { removeToken } from '@/lib/auth';

const navItems = [
  { href: '/dashboard',       icon: '⊞', label: 'Dashboard' },
  { href: '/dashboard/create',    icon: '🎬', label: 'Create Video' },
  { href: '/dashboard/avatar',    icon: '👤', label: 'Avatar Videos' },
  { href: '/dashboard/animation', icon: '✨', label: 'Animation Studio' },
  { href: '/dashboard/videos',    icon: '📁', label: 'My Videos' },
  { href: '/dashboard/templates', icon: '📋', label: 'Templates' },
  { href: '/dashboard/billing',   icon: '💳', label: 'Billing' },
  { href: '/dashboard/api-keys',  icon: '🔑', label: 'API Keys' },
  { href: '/dashboard/settings',  icon: '⚙', label: 'Settings' },
];

interface SidebarProps {
  userName?: string;
  userPlan?: string;
}

export default function Sidebar({ userName = 'User', userPlan = 'Free Plan' }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    removeToken();
    router.push('/login');
  }

  const initials = userName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="db-sidebar">
      {/* Logo */}
      <div className="db-logo-row">
        <span style={{ fontSize: 22 }}>🎬</span>
        <span className="db-logo-text">AiCruzz</span>
      </div>

      {/* Navigation */}
      <nav className="db-nav" style={{ flex: 1 }}>
        {navItems.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`db-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="db-nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User row */}
      <div className="db-user-row">
        <div className="db-avatar-img">{initials}</div>
        <div>
          <div className="db-user-name">{userName}</div>
          <div className="db-user-plan" style={{ textTransform: 'capitalize' }}>{userPlan} Plan</div>
        </div>
        <button
          onClick={handleLogout}
          title="Log out"
          style={{
            marginLeft: 'auto', background: 'transparent', border: 'none',
            color: 'rgba(255,255,255,0.4)', fontSize: 18, cursor: 'pointer', padding: 4,
          }}
        >
          ⏻
        </button>
      </div>
    </div>
  );
}
