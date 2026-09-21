import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Lang, NAV_UI } from '@/lib/i18n';
import { getPublicLang, localizedHref } from '@/lib/public-language';

const NAVY = '#0d1b3e';
const GOLD = '#c8a84b';

const LEGAL = {
  da: { privacy: 'Privatlivspolitik', cookies: 'Cookiepolitik', language: 'Sprog' },
  uk: { privacy: 'Політика конфіденційності', cookies: 'Політика cookies', language: 'Мова' },
  en: { privacy: 'Privacy Policy', cookies: 'Cookie Policy', language: 'Language' },
};

export function PublicLayout({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(getPublicLang);
  const [location] = useLocation();
  const ui = NAV_UI[lang];
  const legal = LEGAL[lang];

  const changeLanguage = (next: Lang) => {
    setLang(next);
    window.location.assign(localizedHref(location, next));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(13,27,62,0.98)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1180, minHeight: 68, margin: '0 auto', padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <Link href={localizedHref('/', lang)} aria-label="EAUC Nordic — home">
            <img src="/logo.png" alt="EAUC Nordic" style={{ height: 48, width: 'auto', objectFit: 'contain' }} />
          </Link>
          <nav aria-label="Main navigation" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 18, flexWrap: 'wrap' }}>
            <Link href={localizedHref('/#mission', lang)} className="hidden text-sm text-white/75 no-underline transition-colors hover:text-white md:inline">{ui.mission}</Link>
            <Link href={localizedHref('/#vores-arbejde', lang)} className="hidden text-sm text-white/75 no-underline transition-colors hover:text-white md:inline">{ui.work}</Link>
            <Link href={localizedHref('/news', lang)} className="hidden text-sm text-white/75 no-underline transition-colors hover:text-white sm:inline">{ui.news}</Link>
            <Link href={localizedHref('/contact', lang)} className="hidden text-sm text-white/75 no-underline transition-colors hover:text-white sm:inline">{ui.contact}</Link>
            <Link href={localizedHref('/#donér', lang)} style={{ color: NAVY, background: GOLD, borderRadius: 999, padding: '9px 15px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>{ui.donateNow}</Link>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff', fontSize: 12 }}>
              <span className="sr-only">{legal.language}</span>
              <select value={lang} onChange={event => changeLanguage(event.target.value as Lang)} aria-label={legal.language} style={{ color: '#fff', background: 'transparent', border: '1px solid rgba(255,255,255,0.28)', borderRadius: 999, padding: '8px 10px' }}>
                <option value="da" style={{ color: NAVY }}>DA</option>
                <option value="uk" style={{ color: NAVY }}>UA</option>
                <option value="en" style={{ color: NAVY }}>EN</option>
              </select>
            </label>
          </nav>
        </div>
      </header>
      <main style={{ flex: 1 }}>{children}</main>
      <footer style={{ background: '#080c16', color: '#fff' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '38px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <img src="/logo.png" alt="EAUC Nordic" style={{ height: 54, width: 'auto', objectFit: 'contain', marginBottom: 10 }} />
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>CVR 46329406 · eaucnordic@gmail.com</p>
          </div>
          <nav aria-label="Footer navigation" style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <Link href={localizedHref('/#om-os', lang)} style={{ color: 'rgba(255,255,255,0.68)', textDecoration: 'none', fontSize: 13 }}>{ui.about}</Link>
            <Link href={localizedHref('/#vores-arbejde', lang)} style={{ color: 'rgba(255,255,255,0.68)', textDecoration: 'none', fontSize: 13 }}>{ui.work}</Link>
            <Link href={localizedHref('/contact', lang)} style={{ color: 'rgba(255,255,255,0.68)', textDecoration: 'none', fontSize: 13 }}>{ui.contact}</Link>
            <Link href={localizedHref('/privacy', lang)} style={{ color: 'rgba(255,255,255,0.68)', textDecoration: 'none', fontSize: 13 }}>{legal.privacy}</Link>
            <Link href={localizedHref('/cookies', lang)} style={{ color: 'rgba(255,255,255,0.68)', textDecoration: 'none', fontSize: 13 }}>{legal.cookies}</Link>
          </nav>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>© 2026 EAUC Nordic</span>
        </div>
      </footer>
    </div>
  );
}