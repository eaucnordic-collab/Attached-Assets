import { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { Heart } from 'lucide-react';

const NAVY = '#0d1117';
const GOLD = '#e8b400';

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}

function Header() {
  const [location] = useLocation();
  // On the home route, show minimal nav matching the original
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10,12,20,0.95)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', height: 52,
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff', letterSpacing: '0.04em' }}>
          EAUC
        </span>
      </Link>

      <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <Link href="/#mission" style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
          Om os
        </Link>
        <Link href="/#donér" style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
          Donér
        </Link>
        <Link href="/admin/login" style={{
          fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)',
          textDecoration: 'none', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: 20,
        }}>
          Admin
        </Link>
        {/* Language toggle matching original */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          border: '1px solid rgba(255,255,255,0.2)', borderRadius: 999,
          padding: '5px 12px',
        }}>
          <span style={{ fontSize: 13, color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>🌐</span>
          <span style={{ fontSize: 12, color: '#fff', fontFamily: 'Inter, sans-serif' }}>DA</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif' }}>DK</span>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{
      background: '#0d1117',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '28px 40px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: 16,
    }}>
      <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>
        EAUC
      </span>
      <nav style={{ display: 'flex', gap: 24 }}>
        {['Om os', 'Kontakt', 'Privatlivspolitik'].map(l => (
          <a key={l} href="#" style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>
            {l}
          </a>
        ))}
      </nav>
      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
        © 2026 Håb for Ukraine. Alle rettigheder forbeholdes.
      </span>
    </footer>
  );
}
