import React, { useState, useEffect, useRef } from 'react';
import {
  Heart, Shield, Smile, Facebook, Instagram,
  Users, FileText, HandHeart, Mail, MapPin, Phone, ExternalLink,
  ChevronDown, Menu, X, Send, CheckCircle, Newspaper,
  CreditCard, Landmark, Copy, Check,
} from 'lucide-react';
import {
  AnySection, HeroSection, MissionSection, HowSection, StatsSection,
  AboutSection, BoardSection, DonateSection, TextSection,
  NewsSection, ContactSection, FooterSection,
  SiteContent, loadSiteContent, saveSiteContent, fetchSiteContentFromAPI,
} from '../../lib/site-content';
import { useSubmitForm, useListForms, useListNews } from '@workspace/api-client-react';
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

function SiteFooter({ lang, footer }: { lang: Lang; footer: FooterSection }) {
  const width = useWindowWidth();
  const isMobile = width < 768;
  const f = footer.locales[lang] ?? footer.locales.da;

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
          <img src={footer.logoUrl || '/logo.png'} alt="EAUC Nordic" style={{ height: 150, width: 'auto', objectFit: 'contain', marginBottom: 18 }} />
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: '0 0 28px', maxWidth: 260 }}>{f.tagline}</p>
          <div style={{ marginBottom: 8 }}><FooterColTitle>{f.followUs}</FooterColTitle></div>
          <div style={{ display: 'flex', gap: 10 }}>
            {footer.facebookUrl && <SocialIcon href={footer.facebookUrl}><Facebook size={16} /></SocialIcon>}
            {footer.instagramUrl && <SocialIcon href={footer.instagramUrl}><Instagram size={16} /></SocialIcon>}
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
                {f.address.split('\n').filter(Boolean).map((line, i) => (
                  <div key={i} style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{line}</div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Mail size={16} color={GOLD} style={{ flexShrink: 0 }} />
              <a href={`mailto:${footer.email}`} style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'; }}
              >{footer.email}</a>
            </div>
          </div>
        </div>
        {/* Col 4 — Legal */}
        <div>
          <FooterColTitle>{f.legalTitle}</FooterColTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 14px', width: 'fit-content' }}>
              <ExternalLink size={13} color={GOLD} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.02em' }}>CVR: {footer.cvr}</span>
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
          <a href={footer.privacyUrl || '#'} style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', minHeight: 44, display: 'flex', alignItems: 'center' } as React.CSSProperties}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; }}
          >{f.privacyLabel}</a>
          <a href={footer.cookiesUrl || '#'} style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', minHeight: 44, display: 'flex', alignItems: 'center' } as React.CSSProperties}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; }}
          >{f.cookiesLabel}</a>
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
         padding: isMobile ? '110px 20px 60px' : '92px 48px 48px',
         boxSizing: 'border-box',
         display: 'grid',
         gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'minmax(0, 560px) minmax(240px, 340px)',
        alignItems: 'center',
        justifyContent: 'space-between',
         columnGap: isMobile ? 0 : 'clamp(24px, 5vw, 72px)',
         rowGap: isMobile ? 32 : 0,
      }}>
        {/* Left: text */}
        <div style={{
          width: '100%',
          minWidth: 0,
          maxWidth: isMobile ? '100%' : 560,
          boxSizing: 'border-box',
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, maxWidth: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 999, padding: '5px 14px', marginBottom: 28 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: GOLD, display: 'inline-block' }} />
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', fontFamily: 'Inter, sans-serif', overflowWrap: 'anywhere' }}>{s.badge}</span>
          </div>
          <h1 style={{ width: '100%', maxWidth: '100%', minWidth: 0, overflowWrap: 'anywhere', wordBreak: 'break-word', fontFamily: 'Playfair Display, serif', fontSize: isMobile ? 'clamp(30px,9vw,44px)' : 'clamp(30px,5vw,56px)', fontWeight: 700, lineHeight: 1.1, color: '#fff', margin: '0 0 6px' }}>{s.heading}</h1>
          <h1 style={{ width: '100%', maxWidth: '100%', minWidth: 0, overflowWrap: 'anywhere', wordBreak: 'break-word', fontFamily: 'Playfair Display, serif', fontSize: isMobile ? 'clamp(30px,9vw,44px)' : 'clamp(30px,5vw,56px)', fontWeight: 700, lineHeight: 1.15, color: GOLD, margin: '0 0 22px' }}>{s.headingAccent}</h1>
          <p style={{ width: '100%', minWidth: 0, fontFamily: 'Inter, sans-serif', fontSize: isMobile ? 15 : 16, color: 'rgba(255,255,255,0.82)', lineHeight: 1.65, maxWidth: 460, overflowWrap: 'anywhere', wordBreak: 'break-word', margin: '0 0 36px' }}>{s.subtitle}</p>
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
  type PaymentMethod = 'card' | 'bank';
  type DonationFrequency = 'once' | 'monthly';

  const suggestedAmounts = s.amounts.length ? s.amounts.slice(0, 3) : [100, 250, 500];
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [frequency, setFrequency] = useState<DonationFrequency>('once');
  const [selectedAmount, setSelectedAmount] = useState(suggestedAmounts[1] ?? suggestedAmounts[0] ?? 250);
  const [customAmount, setCustomAmount] = useState('');
  const [donateStatus, setDonateStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const donationReturnHandled = useRef(false);
  const width = useWindowWidth();
  const isMobile = width < 768;
  const ui = UI_TRANSLATIONS[lang].donate;
  const bankDetails = [
    { key: 'bank', label: ui.bankName, value: s.bankName || 'Danske Bank' },
    { key: 'registration', label: ui.bankRegistration, value: s.bankRegistration || '9570' },
    { key: 'account', label: ui.bankAccount, value: s.bankAccount || '14146679' },
    { key: 'iban', label: ui.bankIban, value: s.bankIban || 'DK2630000014146679' },
    { key: 'swift', label: ui.bankSwift, value: s.bankSwift || 'DABADKKK' },
  ];
  const copyBankValue = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value.replace(/\s/g, ''));
      setCopiedField(key);
      window.setTimeout(() => setCopiedField(current => current === key ? null : current), 1600);
    } catch {
      setCopiedField(null);
    }
  };

  useEffect(() => {
    setSelectedAmount(suggestedAmounts[1] ?? suggestedAmounts[0] ?? 250);
    setCustomAmount('');
  }, [s.amounts]);

  useEffect(() => {
    if (donationReturnHandled.current) return;
    const params = new URLSearchParams(window.location.search);
    const donationResult = params.get('donation');
    if (!donationResult) return;
    donationReturnHandled.current = true;
    setPaymentMethod('card');

    const clearDonationParams = () => {
      params.delete('donation');
      params.delete('session_id');
      const query = params.toString();
      window.history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`);
    };

    if (donationResult !== 'success') {
      clearDonationParams();
      return;
    }

    const sessionId = params.get('session_id');
    if (!sessionId) {
      setDonateStatus('error');
      clearDonationParams();
      return;
    }

    let cancelled = false;
    setDonateStatus('loading');
    fetch(`/api/donate/complete?session_id=${encodeURIComponent(sessionId)}`)
      .then(async response => {
        const result = await response.json() as { paid?: boolean };
        if (!response.ok || result.paid !== true) throw new Error('Payment was not confirmed');
        if (!cancelled) setDonateStatus('success');
      })
      .catch(() => {
        if (!cancelled) setDonateStatus('error');
      })
      .finally(() => {
        if (!cancelled) clearDonationParams();
      });

    return () => { cancelled = true; };
  }, []);

  const amount = customAmount ? Math.floor(Number(customAmount)) : selectedAmount;

  const startStripeCheckout = async () => {
    if (!Number.isInteger(amount) || amount < 1) {
      setDonateStatus('error');
      return;
    }

    setDonateStatus('loading');
    try {
      const response = await fetch('/api/donate/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, recurring: frequency === 'monthly' }),
      });
      const result = await response.json() as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error || 'Unable to start payment');
      window.location.assign(result.url);
    } catch {
      setDonateStatus('error');
    }
  };

  return (
    <section id="donér" style={{ background: 'linear-gradient(180deg, #eef4ff 0%, #f7f4ef 100%)', padding: isMobile ? '64px 16px 80px' : '88px 24px 110px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <FadeUp>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(30px,6vw,44px)', fontWeight: 700, color: NAVY, margin: '0 0 12px' }}>{s.heading}</h2>
          <p style={{ maxWidth: 720, fontFamily: 'Inter, sans-serif', fontSize: isMobile ? 15 : 17, color: '#5f6673', lineHeight: 1.65, margin: '0 auto 38px' }}>{s.subtitle}</p>

          <div style={{ background: '#fff', border: '1px solid #d9dee7', borderRadius: 14, boxShadow: '0 2px 8px rgba(13,27,62,0.08)', overflow: 'hidden' }}>
            <div role="tablist" aria-label="Payment methods" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', background: '#f7f8fa', borderBottom: '1px solid #dfe3e9' }}>
              {([
                { id: 'card' as const, label: ui.paymentCard, icon: <CreditCard size={17} /> },
                { id: 'bank' as const, label: ui.paymentBank, icon: <Landmark size={17} /> },
              ]).map(method => {
                const active = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setPaymentMethod(method.id)}
                    style={{ minHeight: isMobile ? 58 : 54, margin: active ? 5 : 0, padding: isMobile ? '10px 8px' : '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: 'none', borderRadius: active ? 8 : 0, background: active ? '#fff' : 'transparent', boxShadow: active ? '0 1px 5px rgba(13,27,62,0.12)' : 'none', color: active ? NAVY : '#646b75', fontFamily: 'Inter, sans-serif', fontSize: isMobile ? 13 : 15, fontWeight: active ? 700 : 500, cursor: 'pointer' }}
                  >
                    {method.icon}
                    <span>{method.label}</span>
                  </button>
                );
              })}
            </div>

            <div role="tabpanel" style={{ minHeight: isMobile ? 420 : 455, padding: isMobile ? '32px 18px 28px' : '34px 44px 36px' }}>
              {paymentMethod === 'card' && (
                <div style={{ maxWidth: 560, margin: '0 auto' }}>
                  <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: isMobile ? 22 : 24, fontWeight: 750, color: NAVY, margin: '0 0 8px' }}>{ui.cardTitle}</h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#68707c', margin: '0 0 22px' }}>{ui.cardSubtitle}</p>

                  {donateStatus === 'success' ? (
                    <div style={{ padding: '42px 0 24px' }}>
                      <CheckCircle size={46} color="#059669" style={{ marginBottom: 14 }} />
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 17, fontWeight: 700, color: NAVY, margin: '0 0 6px' }}>
                        {lang === 'da' ? 'Tak for din donation!' : lang === 'uk' ? 'Дякуємо за вашу пожертву!' : 'Thank you for your donation!'}
                      </p>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#68707c', margin: '0 0 20px' }}>
                        {lang === 'da' ? 'Din betaling er gennemført.' : lang === 'uk' ? 'Ваш платіж успішно завершено.' : 'Your payment was completed successfully.'}
                      </p>
                      <button onClick={() => setDonateStatus('idle')} style={{ border: '1px solid #d4d8df', borderRadius: 8, background: '#fff', padding: '10px 20px', color: NAVY, fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>
                        {lang === 'da' ? 'Donér igen' : lang === 'uk' ? 'Пожертвувати знову' : 'Donate again'}
                      </button>
                    </div>
                  ) : (
                    <>
                      <div style={{ maxWidth: 380, margin: '0 auto 10px', display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1px solid #d9dde4', borderRadius: 7, overflow: 'hidden' }}>
                        {(['once', 'monthly'] as DonationFrequency[]).map(option => {
                          const active = frequency === option;
                          return (
                            <button key={option} onClick={() => { setFrequency(option); setDonateStatus('idle'); }} style={{ minHeight: 40, border: 'none', background: active ? '#171925' : '#fff', color: active ? '#fff' : NAVY, fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 650, cursor: 'pointer' }}>
                              {option === 'once' ? ui.oneTime : ui.monthly}
                            </button>
                          );
                        })}
                      </div>

                      {frequency === 'monthly' && (
                        <div style={{ margin: '0 auto 14px', maxWidth: 440 }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 999, background: '#edf4ff', color: BLUE, fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700 }}>
                            <Heart size={13} /> {ui.monthlyWhy} <ChevronDown size={13} />
                          </div>
                          <p style={{ margin: '10px 0 0', padding: isMobile ? '13px 14px' : '14px 16px', borderRadius: 10, background: '#f0f3f8', color: '#656c77', fontFamily: 'Inter, sans-serif', fontSize: 13, lineHeight: 1.55, textAlign: 'left' }}>{ui.monthlyDescription}</p>
                        </div>
                      )}

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8, margin: '0 0 10px' }}>
                        {suggestedAmounts.map(value => {
                          const active = selectedAmount === value && !customAmount;
                          return (
                            <button key={value} onClick={() => { setSelectedAmount(value); setCustomAmount(''); setDonateStatus('idle'); }} style={{ minHeight: 46, border: active ? '1px solid #171925' : '1px solid #d9dde4', borderRadius: 7, background: active ? '#171925' : '#fff', color: active ? '#fff' : NAVY, fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                              {value.toLocaleString('da-DK')} kr
                            </button>
                          );
                        })}
                      </div>

                      <div style={{ position: 'relative', marginBottom: 14 }}>
                        <input type="number" min="1" step="1" inputMode="numeric" value={customAmount} onChange={event => { setCustomAmount(event.target.value); setDonateStatus('idle'); }} placeholder={ui.otherAmount} style={{ width: '100%', minHeight: 46, boxSizing: 'border-box', border: '1px solid #d9dde4', borderRadius: 7, padding: '11px 48px 11px 14px', color: NAVY, fontFamily: 'Inter, sans-serif', fontSize: 14 }} />
                        <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#8a9099', fontFamily: 'Inter, sans-serif', fontSize: 14 }}>kr</span>
                      </div>

                      {donateStatus === 'error' && (
                        <p role="alert" style={{ color: '#b42318', fontFamily: 'Inter, sans-serif', fontSize: 13, margin: '0 0 10px' }}>
                          {lang === 'da' ? 'Betalingen kunne ikke startes. Prøv igen.' : lang === 'uk' ? 'Не вдалося розпочати оплату. Спробуйте ще раз.' : 'The payment could not be started. Please try again.'}
                        </p>
                      )}

                      <button onClick={startStripeCheckout} disabled={donateStatus === 'loading'} style={{ width: '100%', minHeight: 50, border: 'none', borderRadius: 7, background: '#ffd400', color: '#171925', fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 750, cursor: donateStatus === 'loading' ? 'wait' : 'pointer', opacity: donateStatus === 'loading' ? 0.7 : 1 }}>
                        {donateStatus === 'loading' ? '...' : `${ui.donate} ${Number.isInteger(amount) && amount > 0 ? `${amount.toLocaleString('da-DK')} kr` : ''}${frequency === 'monthly' ? ` ${ui.perMonth}` : ''}`}
                      </button>
                    </>
                  )}
                </div>
              )}

              {paymentMethod === 'bank' && (
                <div style={{ maxWidth: 590, margin: '0 auto' }}>
                  <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 24, fontWeight: 750, color: NAVY, margin: '0 0 8px' }}>{ui.bankTitle}</h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#68707c', margin: '0 0 26px' }}>{ui.bankSubtitle}</p>
                  <div style={{ border: '1px solid #d9dee6', borderRadius: 9, overflow: 'hidden', textAlign: 'left' }}>
                    {bankDetails.map((detail, index) => (
                      <div key={detail.key} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '150px minmax(0, 1fr)', alignItems: 'center', gap: isMobile ? 6 : 20, padding: isMobile ? '12px 14px' : '12px 16px', borderBottom: index < bankDetails.length - 1 ? '1px solid #e2e5ea' : 'none' }}>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#747b85' }}>{detail.label}</span>
                        <span style={{ minWidth: 0, display: 'flex', justifyContent: isMobile ? 'space-between' : 'flex-end', alignItems: 'center', gap: 10 }}>
                          <strong style={{ minWidth: 0, color: NAVY, fontFamily: 'Inter, sans-serif', fontSize: isMobile ? 14 : 15, textAlign: 'right', overflowWrap: 'anywhere' }}>{detail.value}</strong>
                          <button onClick={() => copyBankValue(detail.key, detail.value)} title={copiedField === detail.key ? ui.copied : ui.copy} aria-label={`${ui.copy}: ${detail.label}`} style={{ flexShrink: 0, width: 30, height: 30, border: 'none', borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: copiedField === detail.key ? '#e7f7ef' : 'transparent', color: copiedField === detail.key ? '#059669' : '#8a919c', cursor: 'pointer' }}>
                            {copiedField === detail.key ? <Check size={15} /> : <Copy size={15} />}
                          </button>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
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

function NewsBlock({ s, lang }: { s: NewsSection; lang: Lang }) {
  const width = useWindowWidth();
  const isMobile = width < 768;
  const { data: newsData, isLoading } = useListNews({ status: 'published' });
  const articles = newsData?.items ?? [];
  const allArticlesLabel: Record<Lang, string> = {
    da: 'Se alle artikler',
    uk: 'Переглянути всі статті',
    en: 'View all articles',
  };
  const emptyLabel: Record<Lang, string> = {
    da: 'Der er endnu ingen offentliggjorte artikler.',
    uk: 'Опублікованих статей поки немає.',
    en: 'There are no published articles yet.',
  };
  const loadingLabel: Record<Lang, string> = {
    da: 'Indlæser artikler...',
    uk: 'Завантаження статей...',
    en: 'Loading articles...',
  };
  const dateLocale: Record<Lang, string> = {
    da: 'da-DK',
    uk: 'uk-UA',
    en: 'en-GB',
  };
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
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
          gap: 28,
          alignItems: 'stretch',
        }}>
          {isLoading ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666', fontFamily: 'Inter, sans-serif' }}>
              {loadingLabel[lang]}
            </p>
          ) : articles.length === 0 ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666', fontFamily: 'Inter, sans-serif' }}>
              {emptyLabel[lang]}
            </p>
          ) : articles.map((article, i) => (
            <FadeUp key={article.id} delay={i * 100} style={{ height: '100%' }}>
              <article style={{
                background: '#fff', borderRadius: 18, overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                transition: 'transform 0.25s, box-shadow 0.25s',
                display: 'flex', flexDirection: 'column', height: '100%',
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
                <a href={`/news/${article.id}`} style={{ display: 'block', aspectRatio: '16/9', overflow: 'hidden', background: '#f1f3f5', textDecoration: 'none' }}>
                  {article.coverImage ? (
                    <img src={article.coverImage} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                    />
                  ) : (
                    <span style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9aa1ad', fontFamily: 'Inter, sans-serif' }}>
                      EAUC Nordic
                    </span>
                  )}
                </a>
                <div style={{ padding: '24px 28px 28px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <span style={{
                      display: 'inline-block', padding: '4px 12px', borderRadius: 999,
                      background: article.category && TAG_COLORS[article.category] ? `${TAG_COLORS[article.category]}18` : '#f0f0f0',
                      color: article.category && TAG_COLORS[article.category] ? TAG_COLORS[article.category] : '#555',
                      fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                    }}>
                      {article.category || 'EAUC Nordic'}
                    </span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#999' }}>
                      {new Date(article.publishedAt || article.createdAt).toLocaleDateString(dateLocale[lang], { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 19, fontWeight: 700, color: NAVY, margin: '0 0 12px', lineHeight: 1.3 }}>
                    <a href={`/news/${article.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>{article.title}</a>
                  </h3>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 14,
                    color: '#666',
                    lineHeight: 1.7,
                    margin: 0,
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {article.excerpt || article.content}
                  </p>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>
        <FadeUp delay={150}>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
            <a
              href="/news"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 48,
                padding: '12px 26px',
                borderRadius: 8,
                background: '#1d7d6b',
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
                fontSize: 15,
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 8px 20px rgba(29,125,107,0.2)',
                transition: 'transform 0.2s, background 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#176858';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#1d7d6b';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {allArticlesLabel[lang]}
            </a>
          </div>
        </FadeUp>
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
    case 'news':    return <NewsBlock s={section} lang={lang} />;
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
  const footer = content.sections.find((section): section is FooterSection => section.type === 'footer');

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: CREAM }}>
      <SiteHeader lang={lang} onLangChange={handleLangChange} />
      {content.sections.filter(s => s.type !== 'footer').map(s => <SectionBlock key={s.id} section={s} lang={lang} />)}
      {footer?.visible && <SiteFooter lang={lang} footer={footer} />}
    </div>
  );
}
