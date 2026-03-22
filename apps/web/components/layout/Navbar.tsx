'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/api-docs', label: 'API' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav className={`mkt-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-wrap">
          <Link href="/" className="nav-logo">
            <span className="nav-logo-text">AiCruzz</span>
          </Link>

          <div className="nav-links">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`nav-link ${pathname === l.href ? 'active' : ''}`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="nav-actions">
            <Link href="/login">
              <button className="btn-nav-ghost">Log in</button>
            </Link>
            <Link href="/signup">
              <button className="btn-nav-cta">Start Free ✦</button>
            </Link>
          </div>

          <button
            className="nav-hamburger"
            style={{ display: 'flex', flexDirection: 'column', gap: 5, cursor: 'pointer', padding: 5, border: 'none', background: 'none' }}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span style={{ width: 22, height: 2, background: 'var(--text-2)', borderRadius: 2, display: 'block' }} />
            <span style={{ width: 22, height: 2, background: 'var(--text-2)', borderRadius: 2, display: 'block' }} />
            <span style={{ width: 22, height: 2, background: 'var(--text-2)', borderRadius: 2, display: 'block' }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 68, left: 0, right: 0,
          background: '#fff', borderBottom: '1px solid var(--border)',
          padding: '12px 20px 20px', zIndex: 490,
          display: 'flex', flexDirection: 'column', gap: 3,
        }}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{ padding: '11px 14px', fontSize: 15, fontWeight: 500, color: 'var(--text-2)', borderRadius: 'var(--r-sm)' }}
            >
              {l.label}
            </Link>
          ))}
          <div style={{ display: 'flex', gap: 10, padding: '10px 14px 4px' }}>
            <Link href="/login" style={{ flex: 1 }}>
              <button className="btn btn-outline btn-full" onClick={() => setMenuOpen(false)}>Log in</button>
            </Link>
            <Link href="/signup" style={{ flex: 1 }}>
              <button className="btn btn-primary btn-full" onClick={() => setMenuOpen(false)}>Get Started</button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
