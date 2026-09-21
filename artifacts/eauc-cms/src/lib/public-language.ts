import { Lang, loadLang, saveLang } from './i18n';

const QUERY_TO_LANG: Record<string, Lang> = { da: 'da', ua: 'uk', uk: 'uk', en: 'en' };
const LANG_TO_QUERY: Record<Lang, string> = { da: 'da', uk: 'ua', en: 'en' };
export const DATE_LOCALE: Record<Lang, string> = { da: 'da-DK', uk: 'uk-UA', en: 'en-GB' };

export function getPublicLang(): Lang {
  if (typeof window === 'undefined') return 'da';
  const queryLang = new URLSearchParams(window.location.search).get('lang');
  const lang = queryLang ? QUERY_TO_LANG[queryLang.toLowerCase()] : undefined;
  return lang ?? loadLang();
}

export function localizedHref(path: string, lang: Lang): string {
  if (typeof window === 'undefined') return path;
  const url = new URL(path, window.location.origin);
  url.searchParams.set('lang', LANG_TO_QUERY[lang]);
  return `${url.pathname}${url.search}${url.hash}`;
}

export function setPublicLang(lang: Lang) {
  saveLang(lang);
  const href = localizedHref(`${window.location.pathname}${window.location.search}${window.location.hash}`, lang);
  window.history.replaceState({}, '', href);
}

export function formatPublicDate(value: string | Date, lang: Lang): string {
  return new Date(value).toLocaleDateString(DATE_LOCALE[lang], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}