import React, { useState, useEffect, useRef } from 'react';
import {
  Heart, Shield, Smile, Facebook, Instagram,
  Users, FileText, HandHeart, Mail, MapPin, Phone, ExternalLink,
  ChevronDown, Menu, X, Send, CheckCircle, Newspaper,
} from 'lucide-react';
import {
  AnySection, HeroSection, MissionSection, HowSection, StatsSection,
  AboutSection, BoardSection, DonateSection, TextSection,
  NewsSection, ContactSection,
  SiteContent, loadSiteContent, saveSiteContent, fetchSiteContentFromAPI,
} from '../../lib/site-content';
import { useSubmitForm, useListForms } from '@workspace/api-client-react';
import {
  Lang, UI_TRANSLATIONS, CONTACT_UI, NAV_UI,
  LANGUAGES, loadLang, saveLang, getTranslatedContent,
} from '../../lib/i18n';

// ─── Design tokens ────────────────────────────────────────────────────────────
const GOLD  = '#c8a84b';
const NAVY  = '#0d1b3e';
const BLUE  = '#1a4cdb';
const CREAM = '#f7f4ef';

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useWindowWidth() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return w;
}

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

// ─── Animation wrapper ────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Header sub-components ────────────────────────────────────────────────────
function SocialIcon({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: 36, height: 36, borderRadius: '50%',
      background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)',
      textDecoration: 'none', transition: 'background 0.15s',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.18)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
    >
      {children}
    </a>
  );
}

function LanguagePicker({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);
  const current = LANGUAGES.find(l => l.code === lang);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 999, padding: '6px 12px', cursor: 'pointer', color: '#fff',
        fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, minHeight: 36,
      }}>
        <span>{current?.flag}</span><span>{current?.code.toUpperCase()}</span>
        <ChevronDown size={12} style={{ opacity: 0.7, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 1000,
          background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          overflow: 'hidden', minWidth: 140,
        }}>
          {LANGUAGES.map(l => (
            <button key={l.code} onClick={() => { onChange(l.code); setOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 16px',
                background: l.code === lang ? '#f0f4ff' : '#fff', border: 'none', cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', fontSize: 14, color: NAVY, textAlign: 'left', minHeight: 44,
              }}
              onMouseEnter={e => { if (l.code !== lang) (e.currentTarget as HTMLElement).style.background = '#f7f7f7'; }}
              onMouseLeave={e => { if (l.code !== lang) (e.currentTarget as HTMLElement).style.background = '#fff'; }}
            >
              <span>{l.flag}</span><span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SiteHeader({ lang, onLangChange }: { lang: Lang; onLangChange: (l: Lang) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const width = useWindowWidth();
  const isMobile = width < 768;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
      background: scrolled ? 'rgba(8,12,30,0.96)' : 'transparent',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      transition: 'background 0.35s, box-shadow 0.35s',
      boxShadow: scrolled ? '0 1px 0 rgba(255,255,255,0.07)' : 'none',
    }}>
      <div style={{
        maxWidth: 1140, margin: '0 auto',
        padding: isMobile ? '0 20px' : '0 32px',
        height: isMobile ? 60 : 72,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img src="/logo-text.png" alt="EAUC Nordic" style={{ height: isMobile ? 87 : 116, width: 'auto', objectFit: 'contain' }} />
        </a>

        {isMobile ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <LanguagePicker lang={lang} onChange={onLangChange} />
              <button onClick={() => setMenuOpen(o => !o)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'none', border: 'none', cursor: 'pointer', color: '#fff', padding: 8,
              }}>
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
            {menuOpen && (
              <div style={{
                position: 'fixed', top: 60, left: 0, right: 0, bottom: 0,
                background: 'rgba(8,12,30,0.97)', backdropFilter: 'blur(12px)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, zIndex: 899,
              }}>
                {([
                    { href: '#mission',  label: NAV_UI[lang].mission },
                    { href: '#om-os',    label: NAV_UI[lang].about   },
                    { href: '#kontakt',  label: NAV_UI[lang].contact  },
                    { href: '#nyheder',  label: NAV_UI[lang].news     },
                  ]).map(({ href, label }) => (
                  <a key={href} href={href} onClick={() => setMenuOpen(false)} style={{
                    color: '#fff', textDecoration: 'none', fontFamily: 'Inter, sans-serif',
                    fontWeight: 500, fontSize: 22, padding: '12px 0', minHeight: 44, display: 'flex', alignItems: 'center',
                  }}>
                    {label.toUpperCase()}
                  </a>
                ))}
                <a href="#donér" onClick={() => setMenuOpen(false)} style={{
                  marginTop: 16, background: GOLD, color: NAVY, borderRadius: 999,
                  padding: '16px 36px', fontFamily: 'Inter, sans-serif', fontWeight: 700,
                  fontSize: 18, textDecoration: 'none', minHeight: 52, display: 'flex', alignItems: 'center',
                }}>
                  {NAV_UI[lang].donateNow}
                </a>
              </div>
            )}
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {([
              { href: '#mission', label: NAV_UI[lang].mission },
              { href: '#om-os',   label: NAV_UI[lang].about   },
              { href: '#kontakt', label: NAV_UI[lang].contact  },
            ]).map(({ href, label }) => (
              <a key={href} href={href} style={{
                color: 'rgba(255,255,255,0.88)', textDecoration: 'none',
                fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500, minHeight: 44,
                display: 'flex', alignItems: 'center', transition: 'color 0.15s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.88)'; }}
              >
                {label}
              </a>
            ))}
            <LanguagePicker lang={lang} onChange={onLangChange} />
            <a href="#donér" style={{
              background: GOLD, color: NAVY, borderRadius: 999, padding: '10px 22px',
              fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14,
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, minHeight: 40,
            }}>
              <Heart size={14} fill={NAVY} /> {NAV_UI[lang].donateNow}
            </a>
          </div>
        )}
      </div>
    </header>
  );
}

// ─── Footer helpers ───────────────────────────────────────────────────────────
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} style={{
      fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.55)',
      textDecoration: 'none', padding: '5px 0', minHeight: 36, display: 'flex', alignItems: 'center',
      transition: 'color 0.15s',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'; }}
    >
      {children}
    </a>
  );
}

function FooterColTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700,
      letterSpacing: '0.12em', color: GOLD, textTransform: 'uppercase', marginBottom: 20,
    }}>
      {children}
    </div>
  );
}

function SiteFooter({ lang }: { lang: Lang }) {
  const width = useWindowWidth();
  const isMobile = width < 768;
  const f = UI_TRANSLATIONS[lang].footerFull;

  return (
    <footer style={{ background: '#080c16', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: 'linear-gradient(90deg, #003893 0%, #003893 50%, #ffd500 50%, #ffd500 100%)', height: 4 }} />
      <div style={{
        maxWidth: 1140, margin: '0 auto',
        padding: isMobile ? '48px 20px 40px' : '64px 32px 48px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: isMobile ? '40px 0' : '48px 40px',
      }}>
        {/* Col 1 — Brand */}
        <div>
          <img src="/logo.png" alt="EAUC Nordic" style={{ height: 150, width: 'auto', objectFit: 'contain', marginBottom: 18 }} />
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: '0 0 28px', maxWidth: 260 }}>{f.tagline}</p>
          <div style={{ marginBottom: 8 }}><FooterColTitle>{f.followUs}</FooterColTitle></div>
          <div style={{ display: 'flex', gap: 10 }}>
            <SocialIcon href="https://www.facebook.com/profile.php?id=61592491217605"><Facebook size={16} /></SocialIcon>
            <SocialIcon href="https://www.instagram.com/eaucnordic/"><Instagram size={16} /></SocialIcon>
          </div>
        </div>
        {/* Col 2 — Navigation */}
        <div>
          <FooterColTitle>{f.navTitle}</FooterColTitle>
          <nav style={{ display: 'flex', flexDirection: 'column' }}>
            <FooterLink href="#mission">{f.navMission}</FooterLink>
            <FooterLink href="#mission">{f.navHow}</FooterLink>
            <FooterLink href="#om-os">{f.navAbout}</FooterLink>
            <FooterLink href="#donér">{f.navDonate}</FooterLink>
            <FooterLink href="#kontakt">{f.navContact}</FooterLink>
          </nav>
        </div>
        {/* Col 3 — Contact */}
        <div>
          <FooterColTitle>{f.contactTitle}</FooterColTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <MapPin size={16} color={GOLD} style={{ marginTop: 2, flexShrink: 0 }} />
              <div>
                {f.addressLines.map((line, i) => (
                  <div key={i} style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{line}</div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Mail size={16} color={GOLD} style={{ flexShrink: 0 }} />
              <a href={`mailto:${f.email}`} style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'; }}
              >{f.email}</a>
            </div>
          </div>
        </div>
        {/* Col 4 — Legal */}
        <div>
          <FooterColTitle>{f.legalTitle}</FooterColTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 14px', width: 'fit-content' }}>
              <ExternalLink size={13} color={GOLD} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.02em' }}>{f.cvr}</span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0 }}>{f.registeredAs}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 13 }}>✓</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{f.taxNote}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 13 }}>✓</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{f.transparencyNote}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', maxWidth: 1140, margin: '0 auto' }} />
      <div style={{
        maxWidth: 1140, margin: '0 auto',
        padding: isMobile ? '20px 20px' : '20px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', lineHeight: 1.5 }}>{f.copyright}</span>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <a href="#" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', minHeight: 44, display: 'flex', alignItems: 'center' } as React.CSSProperties}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; }}
          >{f.privacy}</a>
          <a href="#" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', minHeight: 44, display: 'flex', alignItems: 'center' } as React.CSSProperties}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; }}
          >{f.cookies}</a>
        </div>
      </div>
    </footer>
  );
}

// ─── Section blocks ───────────────────────────────────────────────────────────

const CARD_ICONS: Record<string, React.ReactNode> = {
  heart: <Heart size={28} color={BLUE} />,
  smile: <Smile size={28} color={BLUE} />,
  shield: <Shield size={28} color={BLUE} />,
};

function HeroBlock({ s }: { s: HeroSection }) {
  const width = useWindowWidth();
  const isMobile = width < 768;
  return (
    <section style={{
      position: 'relative',
      minHeight: isMobile ? 520 : 500,
      display: 'flex',
      alignItems: 'center',
      background: `linear-gradient(135deg, #080c1e 0%, #0d1b3e 60%, #0a1530 100%)`,
      overflow: 'hidden',
    }}>
      {/* Subtle background texture */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 70% 50%, rgba(200,168,75,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: 1200,
        margin: '0 auto',
        padding: isMobile ? '110px 20px 60px' : '0 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 40,
        flexDirection: isMobile ? 'column' : 'row',
      }}>
        {/* Left: text */}
        <div style={{ flex: '1 1 auto', maxWidth: isMobile ? '100%' : 560 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 999, padding: '5px 14px', marginBottom: 28 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: GOLD, display: 'inline-block' }} />
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', fontFamily: 'Inter, sans-serif' }}>{s.badge}</span>
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(30px,5vw,56px)', fontWeight: 700, lineHeight: 1.1, color: '#fff', margin: '0 0 6px' }}>{s.heading}</h1>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(30px,5vw,56px)', fontWeight: 700, lineHeight: 1.15, color: GOLD, margin: '0 0 22px' }}>{s.headingAccent}</h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: isMobile ? 15 : 16, color: 'rgba(255,255,255,0.82)', lineHeight: 1.65, maxWidth: 460, margin: '0 0 36px' }}>{s.subtitle}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href={s.ctaUrl} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GOLD, color: NAVY, borderRadius: 999, padding: '14px 28px', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 15, cursor: 'pointer', textDecoration: 'none', minHeight: 44 }}>
              <Heart size={16} fill={NAVY} /> {s.ctaLabel}
            </a>
            <a href={s.cta2Url} style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)', borderRadius: 999, padding: '14px 28px', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 15, cursor: 'pointer', textDecoration: 'none', minHeight: 44 }}>
              {s.cta2Label}
            </a>
          </div>
        </div>

        {/* Right: logo */}
        {!isMobile && (
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src="/logo.png"
              alt="EAUC Nordic"
              style={{
                width: 340, height: 340,
                objectFit: 'contain',
                filter: 'drop-shadow(0 8px 32px rgba(200,168,75,0.25))',
              }}
            />
          </div>
        )}
        {isMobile && (
          <img
            src="/logo.png"
            alt="EAUC Nordic"
            style={{ width: 200, height: 200, objectFit: 'contain', margin: '0 auto', display: 'block' }}
          />
        )}
      </div>
    </section>
  );
}

function MissionBlock({ s }: { s: MissionSection }) {
  return (
    <section id="mission" style={{ background: CREAM, padding: '80px 24px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
        <FadeUp>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px,6vw,40px)', fontWeight: 700, color: NAVY, margin: '0 0 20px' }}>{s.heading}</h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: '#555', lineHeight: 1.7, maxWidth: 540, margin: '0 auto 56px' }}>{s.subtitle}</p>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 24 }}>
          {s.cards.map((c, i) => (
            <FadeUp key={i} delay={i * 100}>
              <div style={{ background: '#fff', borderRadius: 16, padding: '36px 28px', border: '1px solid rgba(0,0,0,0.07)', textAlign: 'center', height: '100%' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#e8f0fb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  {CARD_ICONS[c.icon] ?? <Heart size={28} color={BLUE} />}
                </div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: NAVY, margin: '0 0 12px' }}>{c.title}</h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#666', lineHeight: 1.65, margin: 0 }}>{c.text}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowBlock({ s }: { s: HowSection }) {
  const width = useWindowWidth();
  const isMobile = width < 768;
  return (
    <section style={{ background: CREAM, padding: '0 24px 80px' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <FadeUp>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px,6vw,40px)', fontWeight: 700, color: NAVY, textAlign: 'center', margin: '0 0 56px' }}>{s.heading}</h2>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px,1fr))', gap: isMobile ? '32px 0' : '36px 64px' }}>
          {s.steps.map((st, i) => (
            <FadeUp key={i} delay={i * 80}>
              <div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: GOLD, marginBottom: 8 }}>{st.n}</div>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 700, color: NAVY, margin: '0 0 8px' }}>{st.title}</h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#666', lineHeight: 1.7, margin: 0 }}>{st.text}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsBlock({ s }: { s: StatsSection }) {
  return (
    <section style={{ position: 'relative', padding: '72px 24px' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${s.imageUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,12,24,0.78)' }} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto' }}>
        <FadeUp>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px,5vw,36px)', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>{s.heading}</h2>
            <p style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.75)', fontSize: 15, margin: 0 }}>{s.subtitle}</p>
          </div>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))', gap: 32, paddingTop: 40 }}>
          {s.items.map((st, i) => (
            <FadeUp key={i} delay={i * 100}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px,5vw,52px)', fontWeight: 700, color: GOLD, lineHeight: 1 }}>{st.value}</div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.65)', marginTop: 10, textTransform: 'uppercase' }}>{st.label}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutBlock({ s, lang }: { s: AboutSection; lang: Lang }) {
  const width = useWindowWidth();
  const isMobile = width < 768;
  const ui = UI_TRANSLATIONS[lang].about;
  return (
    <section id="om-os" style={{ background: CREAM, padding: '80px 24px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
        <FadeUp>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', color: GOLD, textTransform: 'uppercase', marginBottom: 12 }}>{s.tagline}</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px,6vw,42px)', fontWeight: 700, color: NAVY, margin: '0 0 24px' }}>{s.heading}</h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#555', lineHeight: 1.75, margin: '0 auto 56px' }}>{s.text}</p>
        </FadeUp>
        <FadeUp delay={100}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 32 }}>{ui.orgStructure}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ background: NAVY, borderRadius: 14, padding: '24px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: isMobile ? '100%' : 260 }}>
              <FileText size={28} color={GOLD} />
              <div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#fff', fontSize: 16 }}>EAUC Nordic</div>
                <div style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 2 }}>{ui.nonprofitSub}</div>
              </div>
            </div>
            <div style={{ width: 2, height: 32, background: '#ccc' }} />
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
              {[
                { icon: <Users size={24} color={BLUE} />, title: ui.boardTitle, sub: ui.boardSub },
                { icon: <HandHeart size={24} color={GOLD} />, title: ui.volunteerTitle, sub: ui.volunteerSub },
              ].map(c => (
                <div key={c.title} style={{ background: '#fff', border: '1px solid #e0dbd0', borderRadius: 14, padding: '24px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flex: isMobile ? '1 1 100%' : '0 0 auto', minWidth: isMobile ? 0 : 200 }}>
                  {c.icon}
                  <div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: NAVY, fontSize: 15 }}>{c.title}</div>
                    <div style={{ fontFamily: 'Inter, sans-serif', color: '#777', fontSize: 13, marginTop: 2 }}>{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: NAVY, margin: '60px 0 24px' }}>{ui.registrationTitle}</h3>
          <div style={{ background: '#fff', border: '1px solid #e0dbd0', borderRadius: 14, padding: isMobile ? '20px 16px' : '28px 32px', textAlign: 'left', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '20px 0' : '24px 32px' }}>
            <div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#999', textTransform: 'uppercase', marginBottom: 6 }}>{ui.cvrLabel}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: NAVY, fontSize: 15 }}>{s.cvr}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#999', textTransform: 'uppercase', marginBottom: 6 }}>{ui.nameLabel}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: NAVY, fontSize: 15 }}>{s.orgName}</div>
            </div>
            <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#999', textTransform: 'uppercase', marginBottom: 6 }}>{ui.addressLabel}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: NAVY, fontSize: 15 }}>{s.address}</div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function BoardBlock({ s }: { s: BoardSection }) {
  return (
    <section style={{ background: CREAM, padding: '0 24px 80px' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <FadeUp>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: NAVY, textAlign: 'center', marginBottom: 32 }}>{s.heading}</h3>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: 16 }}>
          {s.members.map((m, i) => (
            <FadeUp key={i} delay={i * 60}>
              <div style={{ background: '#fff', border: '1px solid #e0dbd0', borderRadius: 14, padding: '24px 16px', textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ede9e0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  {m.photo ? <img src={m.photo} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Users size={28} color="#aaa" />}
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: NAVY, fontSize: 14 }}>{m.name}</div>
                <div style={{ fontFamily: 'Inter, sans-serif', color: '#888', fontSize: 13, marginTop: 4 }}>{m.role}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function DonateBlock({ s, lang }: { s: DonateSection; lang: Lang }) {
  const [selected, setSelected] = useState(s.amounts[1] ?? s.amounts[0]);
  const [custom, setCustom] = useState('');
  const [email, setEmail] = useState('');
  const width = useWindowWidth();
  const isMobile = width < 768;
  const ui = UI_TRANSLATIONS[lang].donate;
  useEffect(() => { setSelected(s.amounts[1] ?? s.amounts[0]); setCustom(''); }, [s.amounts]);
  return (
    <section id="donér" style={{ background: CREAM, padding: '80px 24px 100px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
        <FadeUp>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px,6vw,42px)', fontWeight: 700, color: NAVY, margin: '0 0 16px' }}>{s.heading}</h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#555', lineHeight: 1.65, margin: '0 0 40px' }}>{s.subtitle}</p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 12, marginBottom: 12 }}>
            {s.amounts.map(a => (
              <button key={a} onClick={() => { setSelected(a); setCustom(''); }}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 16, padding: '16px 0', borderRadius: 12, cursor: 'pointer', border: selected === a && !custom ? `2px solid ${BLUE}` : '2px solid #d8d2c8', background: selected === a && !custom ? '#eef3fc' : '#fff', color: selected === a && !custom ? BLUE : NAVY, minHeight: 52 }}>
                {a.toLocaleString('da-DK')} {ui.currency}
              </button>
            ))}
          </div>
          <input type="number" placeholder={ui.customPlaceholder} value={custom} onChange={e => { setCustom(e.target.value); setSelected(0); }}
            style={{ width: '100%', padding: '15px 20px', borderRadius: 12, border: '2px solid #d8d2c8', fontFamily: 'Inter, sans-serif', fontSize: 15, color: NAVY, marginBottom: 20, boxSizing: 'border-box', background: '#fff', minHeight: 52 }} />
          <div style={{ marginBottom: 8, textAlign: 'left' }}>
            <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#555' }}>{ui.emailLabel}</label>
          </div>
          <input type="email" placeholder={ui.emailPlaceholder} value={email} onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '15px 20px', borderRadius: 12, border: '2px solid #d8d2c8', fontFamily: 'Inter, sans-serif', fontSize: 15, color: NAVY, marginBottom: 24, boxSizing: 'border-box', background: '#fff', minHeight: 52 }} />
          <button
            onClick={() => {
              if (s.donateUrl) {
                window.open(s.donateUrl, '_blank', 'noopener,noreferrer');
              }
            }}
            disabled={!s.donateUrl}
            title={!s.donateUrl ? 'Donate URL not configured' : undefined}
            style={{ width: '100%', padding: '16px', borderRadius: 999, background: s.donateUrl ? BLUE : '#aaa', color: '#fff', border: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 17, cursor: s.donateUrl ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: 52, opacity: s.donateUrl ? 1 : 0.6 }}>
            <Heart size={18} fill="#fff" /> {s.buttonLabel}
          </button>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#999', marginTop: 16 }}>{s.note}</p>
        </FadeUp>
      </div>
    </section>
  );
}

function TextBlock({ s }: { s: TextSection }) {
  const bg = s.background === 'white' ? '#fff' : s.background === 'navy' ? NAVY : CREAM;
  const color = s.background === 'navy' ? '#fff' : NAVY;
  const subColor = s.background === 'navy' ? 'rgba(255,255,255,0.75)' : '#555';
  return (
    <section style={{ background: bg, padding: '72px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <FadeUp>
          {s.heading && <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(24px,5vw,36px)', fontWeight: 700, color, margin: '0 0 24px' }}>{s.heading}</h2>}
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: subColor, lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{s.text}</p>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── News block ───────────────────────────────────────────────────────────────
const TAG_COLORS: Record<string, string> = {
  'Rapport':    '#1a4cdb',
  'Årsrapport': '#7c3aed',
  'Nyhed':      '#059669',
};

function NewsBlock({ s }: { s: NewsSection }) {
  const width = useWindowWidth();
  const isMobile = width < 768;
  return (
    <section id="nyheder" style={{ background: '#fff', padding: '80px 24px' }}>
      <div style={{ maxWidth: 1060, margin: '0 auto' }}>
        <FadeUp>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Newspaper size={18} color={GOLD} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: GOLD, textTransform: 'uppercase' }}>Nyheder</span>
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px,6vw,42px)', fontWeight: 700, color: NAVY, margin: '0 0 16px' }}>{s.heading}</h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: '#666', lineHeight: 1.65, maxWidth: 520, margin: '0 auto' }}>{s.subtitle}</p>
          </div>
        </FadeUp>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 28,
        }}>
          {s.items.map((item, i) => (
            <FadeUp key={item.id} delay={i * 100}>
              <article style={{
                background: '#fff', borderRadius: 18, overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                transition: 'transform 0.25s, box-shadow 0.25s', cursor: 'default',
                display: 'flex', flexDirection: 'column',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 36px rgba(0,0,0,0.13)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
                }}
              >
                {item.imageUrl && (
                  <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
                    <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                    />
                  </div>
                )}
                <div style={{ padding: '24px 28px 28px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <span style={{
                      display: 'inline-block', padding: '4px 12px', borderRadius: 999,
                      background: TAG_COLORS[item.tag] ? `${TAG_COLORS[item.tag]}18` : '#f0f0f0',
                      color: TAG_COLORS[item.tag] ?? '#555',
                      fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                    }}>
                      {item.tag}
                    </span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#999' }}>{item.date}</span>
                  </div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 19, fontWeight: 700, color: NAVY, margin: '0 0 12px', lineHeight: 1.3 }}>{item.title}</h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#666', lineHeight: 1.7, margin: 0, flex: 1 }}>{item.text}</p>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact block ────────────────────────────────────────────────────────────
function ContactBlock({ s, lang }: { s: ContactSection; lang: Lang }) {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus]   = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const ui = CONTACT_UI[lang];
  const width = useWindowWidth();
  const isMobile = width < 768;
  const submitMutation = useSubmitForm();
  const { data: forms } = useListForms();

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 18px', borderRadius: 12,
    border: '2px solid #e0dbd0', fontFamily: 'Inter, sans-serif',
    fontSize: 15, color: NAVY, background: '#fff', boxSizing: 'border-box',
    outline: 'none', minHeight: 52, transition: 'border-color 0.15s',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Find the real contact form (prefer "Contact Form" by name, fallback to first)
    const contactForm = forms?.find(f => f.name === 'Contact Form') ?? forms?.[0];
    if (!contactForm) return;
    setStatus('loading');
    submitMutation.mutate(
      { id: contactForm.id, data: { data: { name, email, subject, message } } },
      {
        onSuccess: () => setStatus('success'),
        onError: () => setStatus('error'),
      }
    );
  };

  return (
    <section id="kontakt" style={{ background: CREAM, padding: '80px 24px 100px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <FadeUp>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px,6vw,42px)', fontWeight: 700, color: NAVY, margin: '0 0 16px' }}>{s.heading}</h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: '#666', lineHeight: 1.65, maxWidth: 520, margin: '0 auto' }}>{s.subtitle}</p>
          </div>
        </FadeUp>
        <FadeUp delay={100}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? 32 : 48,
            alignItems: 'start',
          }}>
            {/* Form */}
            <div style={{ background: '#fff', borderRadius: 20, padding: isMobile ? '28px 20px' : '40px 40px', border: '1px solid #e8e3da', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
              {status === 'success' ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <CheckCircle size={52} color="#059669" style={{ marginBottom: 20 }} />
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: NAVY, margin: '0 0 12px' }}>{ui.successTitle}</h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#666', margin: 0 }}>{ui.successMessage}</p>
                  <button onClick={() => { setStatus('idle'); setName(''); setEmail(''); setSubject(''); setMessage(''); }}
                    style={{ marginTop: 24, background: 'none', border: '2px solid #d8d2c8', borderRadius: 999, padding: '10px 24px', fontFamily: 'Inter, sans-serif', fontSize: 14, color: NAVY, cursor: 'pointer' }}>
                    {ui.sendAnother}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>{ui.nameLabel}</label>
                      <input value={name} onChange={e => setName(e.target.value)} placeholder={ui.namePlaceholder}
                        style={inputStyle}
                        onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = BLUE; }}
                        onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e0dbd0'; }}
                      />
                    </div>
                    <div>
                      <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>{ui.emailLabel}</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={ui.emailPlaceholder}
                        style={inputStyle}
                        onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = BLUE; }}
                        onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e0dbd0'; }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>{ui.subjectLabel}</label>
                    <input value={subject} onChange={e => setSubject(e.target.value)} placeholder={ui.subjectPlaceholder}
                      style={inputStyle}
                      onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = BLUE; }}
                      onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e0dbd0'; }}
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>{ui.messageLabel}</label>
                    <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder={ui.messagePlaceholder} rows={5} required
                      style={{ ...inputStyle, resize: 'vertical', minHeight: 130, lineHeight: 1.6 }}
                      onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = BLUE; }}
                      onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e0dbd0'; }}
                    />
                  </div>
                  <button type="submit" disabled={status === 'loading'}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: BLUE, color: '#fff', border: 'none', borderRadius: 999, padding: '16px', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 16, cursor: status === 'loading' ? 'wait' : 'pointer', opacity: status === 'loading' ? 0.7 : 1, minHeight: 52, transition: 'opacity 0.2s' }}>
                    <Send size={16} /> {status === 'loading' ? '...' : ui.sendLabel}
                  </button>
                </form>
              )}
            </div>

            {/* Contact info side-panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ background: NAVY, borderRadius: 20, padding: '36px 32px', color: '#fff' }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, margin: '0 0 24px' }}>{ui.infoTitle}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Mail size={18} color={GOLD} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', marginBottom: 4 }}>E-mail</div>
                      <a href={`mailto:${s.email}`} style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#fff', textDecoration: 'none' }}>{s.email}</a>
                    </div>
                  </div>
                  {s.phone && (
                    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Phone size={18} color={GOLD} />
                      </div>
                      <div>
                        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', marginBottom: 4 }}>{ui.phoneLabel}</div>
                        <a href={`tel:${s.phone.replace(/\s/g, '')}`} style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#fff', textDecoration: 'none' }}>{s.phone}</a>
                      </div>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MapPin size={18} color={GOLD} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', marginBottom: 4 }}>{ui.addressLabel}</div>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#fff', lineHeight: 1.6 }}>Byparken 75, 1. 1<br />5700 Svendborg</span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ background: '#fff', borderRadius: 20, padding: '28px 32px', border: '1px solid #e8e3da' }}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 17, fontWeight: 700, color: NAVY, marginBottom: 12 }}>{ui.volunteerTitle}</div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#666', lineHeight: 1.7, margin: '0 0 16px' }}>
                  {ui.volunteerText}
                </p>
                <a href={`mailto:${s.email}?subject=${encodeURIComponent(ui.volunteerSubject)}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: BLUE, fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                  <Heart size={14} color={BLUE} /> {ui.volunteerLink}
                </a>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────
function SectionBlock({ section, lang }: { section: AnySection; lang: Lang }) {
  if (!section.visible) return null;
  switch (section.type) {
    case 'hero':    return <HeroBlock s={section} />;
    case 'mission': return <MissionBlock s={section} />;
    case 'how':     return <HowBlock s={section} />;
    case 'stats':   return <StatsBlock s={section} />;
    case 'about':   return <AboutBlock s={section} lang={lang} />;
    case 'board':   return <BoardBlock s={section} />;
    case 'donate':  return <DonateBlock s={section} lang={lang} />;
    case 'text':    return <TextBlock s={section} />;
    case 'news':    return <NewsBlock s={section} />;
    case 'contact': return <ContactBlock s={section} lang={lang} />;
    default:        return null;
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EaucHome() {
  const [daContent, setDaContent] = useState<SiteContent>(loadSiteContent);
  const [lang, setLang] = useState<Lang>(loadLang);

  // Fetch authoritative content from server on mount (overrides localStorage cache)
  useEffect(() => {
    fetchSiteContentFromAPI().then(remote => {
      if (remote) {
        localStorage.setItem('eauc_site_content_v1', JSON.stringify(remote));
        setDaContent(remote);
      }
    });
  }, []);

  useEffect(() => {
    const handleStorage = () => setDaContent(loadSiteContent());
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'eauc-preview') setDaContent(e.data.content);
    };
    window.addEventListener('eauc-content-changed', handleStorage);
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('eauc-content-changed', handleStorage);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleLangChange = (l: Lang) => { setLang(l); saveLang(l); };
  const content = getTranslatedContent(lang, daContent);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: CREAM }}>
      <SiteHeader lang={lang} onLangChange={handleLangChange} />
      {content.sections.map(s => <SectionBlock key={s.id} section={s} lang={lang} />)}
      <SiteFooter lang={lang} />
    </div>
  );
}
