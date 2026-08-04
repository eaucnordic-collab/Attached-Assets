import { useState, useEffect, useRef } from 'react';
import { Heart, Smile, Shield, Users, HandHeart, FileText, Check, Mail, MapPin, ExternalLink, Facebook, Instagram, Youtube } from 'lucide-react';
import { loadSiteContent, type SiteContent, type AnySection, type HeroSection, type MissionSection, type HowSection, type StatsSection, type AboutSection, type BoardSection, type DonateSection, type TextSection } from '@/lib/site-content';
import { LANGUAGES, UI_TRANSLATIONS, loadLang, saveLang, getTranslatedContent, type Lang } from '@/lib/i18n';

// ─── Colours ──────────────────────────────────────────────────────────────────
const CREAM = '#f5f0e8';
const NAVY  = '#0f1523';
const GOLD  = '#e8b400';
const BLUE  = '#3b7dd8';

// ─── Language Picker ─────────────────────────────────────────────────────────
function LanguagePicker({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find(l => l.code === lang)!;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 7,
          border: '1px solid rgba(255,255,255,0.22)', borderRadius: 999,
          padding: '5px 13px', background: 'transparent', cursor: 'pointer',
        }}
      >
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.05em' }}>{current.flag}</span>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#fff', fontWeight: 600 }}>{current.label}</span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ opacity: 0.55, marginLeft: 2, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.18s' }}>
          <path d="M1 1l4 4 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 10px)', right: 0,
          background: '#fff', borderRadius: 14,
          boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)',
          overflow: 'hidden', minWidth: 180, zIndex: 9999,
          animation: 'fadeInDown 0.15s ease',
        }}>
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => { onChange(l.code); setOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                width: '100%', padding: '11px 18px',
                background: l.code === lang ? '#f0f4ff' : 'transparent',
                border: 'none', cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => { if (l.code !== lang) (e.currentTarget as HTMLElement).style.background = '#f7f7f7'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = l.code === lang ? '#f0f4ff' : 'transparent'; }}
            >
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, color: '#aaa', letterSpacing: '0.04em', minWidth: 22 }}>{l.flag}</span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#1a1a2e', fontWeight: l.code === lang ? 600 : 400, flex: 1 }}>{l.label}</span>
              {l.code === lang && <Check size={14} color={BLUE} strokeWidth={2.5} />}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Sitewide Header ──────────────────────────────────────────────────────────
function SiteHeader({ lang, onLangChange }: { lang: Lang; onLangChange: (l: Lang) => void }) {
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      background: 'rgba(8,10,18,0.96)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', height: 52,
    }}>
      <img src="/logo.png" alt="EAUC Nordic" style={{ height: 36, width: 'auto', objectFit: 'contain' }} />
      <LanguagePicker lang={lang} onChange={onLangChange} />
    </header>
  );
}

// ─── Social icon helpers ──────────────────────────────────────────────────────
function SocialIcon({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{
      width: 36, height: 36, borderRadius: '50%',
      border: '1px solid rgba(255,255,255,0.15)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
      transition: 'border-color 0.2s, color 0.2s',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.5)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}
    >
      {children}
    </a>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} style={{
      fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.55)',
      textDecoration: 'none', display: 'block', padding: '4px 0', transition: 'color 0.15s',
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
  const f = UI_TRANSLATIONS[lang].footerFull;

  return (
    <footer style={{ background: '#080c16', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Ukraine solidarity banner ── */}
      <div style={{ background: 'linear-gradient(90deg, #003893 0%, #003893 50%, #ffd500 50%, #ffd500 100%)', height: 4 }} />

      {/* ── Main footer grid ── */}
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '64px 32px 48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '48px 40px' }}>

        {/* Col 1 — Brand */}
        <div>
          <img src="/logo.png" alt="EAUC Nordic" style={{ height: 42, width: 'auto', objectFit: 'contain', marginBottom: 18 }} />
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: '0 0 28px', maxWidth: 260 }}>
            {f.tagline}
          </p>
          <div style={{ marginBottom: 8 }}>
            <FooterColTitle>{f.followUs}</FooterColTitle>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <SocialIcon href="https://facebook.com"><Facebook size={16} /></SocialIcon>
            <SocialIcon href="https://instagram.com"><Instagram size={16} /></SocialIcon>
            <SocialIcon href="https://youtube.com"><Youtube size={16} /></SocialIcon>
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
            <FooterLink href="mailto:info@eaucnordic.com">{f.navContact}</FooterLink>
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
              >
                {f.email}
              </a>
            </div>
          </div>
        </div>

        {/* Col 4 — Legal & Transparency */}
        <div>
          <FooterColTitle>{f.legalTitle}</FooterColTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* CVR badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 14px', width: 'fit-content' }}>
              <ExternalLink size={13} color={GOLD} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.02em' }}>{f.cvr}</span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0 }}>{f.registeredAs}</p>
            {/* Transparency pills */}
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

      {/* ── Divider ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', maxWidth: 1140, margin: '0 auto' }} />

      {/* ── Bottom bar ── */}
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', lineHeight: 1.5 }}>{f.copyright}</span>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <a href="#" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; }}
          >{f.privacy}</a>
          <a href="#" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; }}
          >{f.cookies}</a>
          <a href="/admin/login" style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', textDecoration: 'none', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: 20 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.2)'; }}
          >Admin</a>
        </div>
      </div>
    </footer>
  );
}

// ─── Section renderers ────────────────────────────────────────────────────────

function HeroBlock({ s }: { s: HeroSection }) {
  return (
    <section style={{ position: 'relative', minHeight: 460, display: 'flex', alignItems: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${s.imageUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center 30%' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(8,10,20,0.78) 52%, rgba(8,10,20,0.18) 100%)' }} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, padding: '132px 48px 80px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 999, padding: '5px 14px', marginBottom: 28 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: GOLD, display: 'inline-block' }} />
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', fontFamily: 'Inter, sans-serif' }}>{s.badge}</span>
        </div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px,5vw,58px)', fontWeight: 700, lineHeight: 1.1, color: '#fff', margin: '0 0 6px' }}>{s.heading}</h1>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px,5vw,58px)', fontWeight: 700, lineHeight: 1.15, color: GOLD, margin: '0 0 22px' }}>{s.headingAccent}</h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: 'rgba(255,255,255,0.88)', lineHeight: 1.65, maxWidth: 460, margin: '0 0 36px' }}>{s.subtitle}</p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <a href={s.ctaUrl} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GOLD, color: NAVY, borderRadius: 999, padding: '13px 28px', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 15, cursor: 'pointer', textDecoration: 'none' }}>
            <Heart size={16} fill={NAVY} /> {s.ctaLabel}
          </a>
          <a href={s.cta2Url} style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 999, padding: '13px 28px', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 15, cursor: 'pointer', textDecoration: 'none' }}>
            {s.cta2Label}
          </a>
        </div>
      </div>
    </section>
  );
}

const CARD_ICONS: Record<string, React.ReactNode> = {
  heart: <Heart size={28} color={BLUE} />,
  smile: <Smile size={28} color={BLUE} />,
  shield: <Shield size={28} color={BLUE} />,
};

function MissionBlock({ s }: { s: MissionSection }) {
  return (
    <section id="mission" style={{ background: CREAM, padding: '80px 24px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, fontWeight: 700, color: NAVY, margin: '0 0 20px' }}>{s.heading}</h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: '#555', lineHeight: 1.7, maxWidth: 540, margin: '0 auto 56px' }}>{s.subtitle}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 24 }}>
          {s.cards.map((c, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '36px 28px', border: '1px solid rgba(0,0,0,0.07)', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#e8f0fb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                {CARD_ICONS[c.icon] ?? <Heart size={28} color={BLUE} />}
              </div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: NAVY, margin: '0 0 12px' }}>{c.title}</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#666', lineHeight: 1.65, margin: 0 }}>{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowBlock({ s }: { s: HowSection }) {
  return (
    <section style={{ background: CREAM, padding: '0 24px 80px' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, fontWeight: 700, color: NAVY, textAlign: 'center', margin: '0 0 56px' }}>{s.heading}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px,1fr))', gap: '36px 64px' }}>
          {s.steps.map((st, i) => (
            <div key={i}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: GOLD, marginBottom: 8 }}>{st.n}</div>
              <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 700, color: NAVY, margin: '0 0 8px' }}>{st.title}</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#666', lineHeight: 1.7, margin: 0 }}>{st.text}</p>
            </div>
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
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>{s.heading}</h2>
          <p style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.75)', fontSize: 15, margin: 0 }}>{s.subtitle}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 32, paddingTop: 40 }}>
          {s.items.map((st, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px,5vw,52px)', fontWeight: 700, color: GOLD, lineHeight: 1 }}>{st.value}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.65)', marginTop: 10, textTransform: 'uppercase' }}>{st.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutBlock({ s, lang }: { s: AboutSection; lang: Lang }) {
  const ui = UI_TRANSLATIONS[lang].about;
  return (
    <section id="om-os" style={{ background: CREAM, padding: '80px 24px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', color: GOLD, textTransform: 'uppercase', marginBottom: 12 }}>{s.tagline}</div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 42, fontWeight: 700, color: NAVY, margin: '0 0 24px' }}>{s.heading}</h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#555', lineHeight: 1.75, margin: '0 auto 56px' }}>{s.text}</p>
        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 32 }}>{ui.orgStructure}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ background: NAVY, borderRadius: 14, padding: '24px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: 260 }}>
            <FileText size={28} color={GOLD} />
            <div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#fff', fontSize: 16 }}>EAUC Nordic</div>
              <div style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 2 }}>{ui.nonprofitSub}</div>
            </div>
          </div>
          <div style={{ width: 2, height: 32, background: '#ccc' }} />
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { icon: <Users size={24} color={BLUE} />, title: ui.boardTitle, sub: ui.boardSub },
              { icon: <HandHeart size={24} color={GOLD} />, title: ui.volunteerTitle, sub: ui.volunteerSub },
            ].map(c => (
              <div key={c.title} style={{ background: '#fff', border: '1px solid #e0dbd0', borderRadius: 14, padding: '24px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, minWidth: 200 }}>
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
        <div style={{ background: '#fff', border: '1px solid #e0dbd0', borderRadius: 14, padding: '28px 32px', textAlign: 'left', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 32px' }}>
          <div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#999', textTransform: 'uppercase', marginBottom: 6 }}>{ui.cvrLabel}</div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: NAVY, fontSize: 15 }}>{s.cvr}</div>
          </div>
          <div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#999', textTransform: 'uppercase', marginBottom: 6 }}>{ui.nameLabel}</div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: NAVY, fontSize: 15 }}>{s.orgName}</div>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#999', textTransform: 'uppercase', marginBottom: 6 }}>{ui.addressLabel}</div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: NAVY, fontSize: 15 }}>{s.address}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BoardBlock({ s }: { s: BoardSection }) {
  return (
    <section style={{ background: CREAM, padding: '0 24px 80px' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: NAVY, textAlign: 'center', marginBottom: 32 }}>{s.heading}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px,1fr))', gap: 20 }}>
          {s.members.map((m, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #e0dbd0', borderRadius: 14, padding: '24px 20px', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ede9e0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                {m.photo
                  ? <img src={m.photo} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <Users size={28} color="#aaa" />}
              </div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: NAVY, fontSize: 14 }}>{m.name}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', color: '#888', fontSize: 13, marginTop: 4 }}>{m.role}</div>
            </div>
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
  const ui = UI_TRANSLATIONS[lang].donate;

  // Reset selection when amounts change (language switch)
  useEffect(() => {
    setSelected(s.amounts[1] ?? s.amounts[0]);
    setCustom('');
  }, [s.amounts]);

  return (
    <section id="donér" style={{ background: CREAM, padding: '80px 24px 100px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 42, fontWeight: 700, color: NAVY, margin: '0 0 16px' }}>{s.heading}</h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#555', lineHeight: 1.65, margin: '0 0 40px' }}>{s.subtitle}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 12 }}>
          {s.amounts.map(a => (
            <button key={a} onClick={() => { setSelected(a); setCustom(''); }}
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 16, padding: '16px 0', borderRadius: 12, cursor: 'pointer', border: selected === a && !custom ? `2px solid ${BLUE}` : '2px solid #d8d2c8', background: selected === a && !custom ? '#eef3fc' : '#fff', color: selected === a && !custom ? BLUE : NAVY }}>
              {a.toLocaleString('da-DK')} {ui.currency}
            </button>
          ))}
        </div>
        <input type="number" placeholder={ui.customPlaceholder} value={custom} onChange={e => { setCustom(e.target.value); setSelected(0); }}
          style={{ width: '100%', padding: '15px 20px', borderRadius: 12, border: '2px solid #d8d2c8', fontFamily: 'Inter, sans-serif', fontSize: 15, color: NAVY, marginBottom: 20, boxSizing: 'border-box', background: '#fff' }} />
        <div style={{ marginBottom: 8, textAlign: 'left' }}>
          <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#555' }}>{ui.emailLabel}</label>
        </div>
        <input type="email" placeholder={ui.emailPlaceholder} value={email} onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', padding: '15px 20px', borderRadius: 12, border: '2px solid #d8d2c8', fontFamily: 'Inter, sans-serif', fontSize: 15, color: NAVY, marginBottom: 24, boxSizing: 'border-box', background: '#fff' }} />
        <button style={{ width: '100%', padding: '16px', borderRadius: 999, background: BLUE, color: '#fff', border: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <Heart size={18} fill="#fff" /> {s.buttonLabel}
        </button>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#999', marginTop: 16 }}>{s.note}</p>
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
        {s.heading && <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, fontWeight: 700, color, margin: '0 0 24px' }}>{s.heading}</h2>}
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: subColor, lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{s.text}</p>
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
    default:        return null;
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EaucHome() {
  const [daContent, setDaContent] = useState<SiteContent>(loadSiteContent);
  const [lang, setLang] = useState<Lang>(loadLang);

  // Re-render when admin saves OR sends live preview via postMessage
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

  const handleLangChange = (l: Lang) => {
    setLang(l);
    saveLang(l);
  };

  const content = getTranslatedContent(lang, daContent);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: CREAM }}>
      <SiteHeader lang={lang} onLangChange={handleLangChange} />
      {content.sections.map(s => <SectionBlock key={s.id} section={s} lang={lang} />)}
      <SiteFooter lang={lang} />
    </div>
  );
}
