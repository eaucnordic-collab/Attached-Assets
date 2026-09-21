import { useEffect } from 'react';
import { Lang } from './i18n';
import { localizedHref } from './public-language';

const SITE_URL = 'https://eaucnordic.org';

function setMeta(selector: string, content: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content);
}

function upsertLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let link = document.querySelector<HTMLLinkElement>(selector);
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    if (hreflang) link.hreflang = hreflang;
    document.head.appendChild(link);
  }
  link.href = href;
}

export function usePublicSeo(lang: Lang, title: string, description: string) {
  useEffect(() => {
    const path = window.location.pathname;
    const canonicalPath = localizedHref(path, lang);
    const canonical = `${SITE_URL}${canonicalPath}`;
    document.documentElement.lang = lang;
    document.title = title;
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:url"]', canonical);
    setMeta('meta[property="og:locale"]', lang === 'da' ? 'da_DK' : lang === 'uk' ? 'uk_UA' : 'en_GB');
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    upsertLink('canonical', canonical);
    upsertLink('alternate', `${SITE_URL}${localizedHref(path, 'da')}`, 'da');
    upsertLink('alternate', `${SITE_URL}${localizedHref(path, 'uk')}`, 'uk');
    upsertLink('alternate', `${SITE_URL}${localizedHref(path, 'en')}`, 'en');
    upsertLink('alternate', `${SITE_URL}${window.location.pathname}`, 'x-default');
  }, [lang, title, description]);
}