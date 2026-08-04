// ─── Language definitions ─────────────────────────────────────────────────────

export type Lang = 'da' | 'uk' | 'en' | 'de' | 'sv' | 'no' | 'fi' | 'it' | 'es';

export const LANGUAGES: { code: Lang; flag: string; label: string }[] = [
  { code: 'da', flag: 'DK', label: 'Dansk'      },
  { code: 'uk', flag: 'UA', label: 'Українська' },
  { code: 'en', flag: 'GB', label: 'English'    },
  { code: 'de', flag: 'DE', label: 'Deutsch'    },
  { code: 'sv', flag: 'SE', label: 'Svenska'    },
  { code: 'no', flag: 'NO', label: 'Norsk'      },
  { code: 'fi', flag: 'FI', label: 'Suomi'      },
  { code: 'it', flag: 'IT', label: 'Italiano'   },
  { code: 'es', flag: 'ES', label: 'Español'    },
];

const LANG_KEY = 'eauc_lang_v1';

export function loadLang(): Lang {
  try {
    const v = localStorage.getItem(LANG_KEY);
    if (v && LANGUAGES.find(l => l.code === v)) return v as Lang;
  } catch { /* ignore */ }
  return 'da';
}

export function saveLang(lang: Lang) {
  localStorage.setItem(LANG_KEY, lang);
}

// ─── Static UI strings ────────────────────────────────────────────────────────

export type FooterFull = {
  tagline: string;
  navTitle: string;
  navMission: string; navHow: string; navAbout: string; navDonate: string; navContact: string;
  contactTitle: string;
  addressLines: string[];
  emailLabel: string; email: string;
  legalTitle: string;
  cvr: string;
  registeredAs: string;
  taxNote: string;
  transparencyNote: string;
  followUs: string;
  privacy: string; cookies: string; copyright: string;
};

export type ContactForm = {
  nameLabel: string; namePlaceholder: string;
  emailLabel: string; emailPlaceholder: string;
  subjectLabel: string; subjectPlaceholder: string;
  messageLabel: string; messagePlaceholder: string;
  sendLabel: string; successTitle: string; successMessage: string;
};

export type UI = {
  footer: { about: string; contact: string; privacy: string; copyright: string };
  footerFull: FooterFull;
  donate: { customPlaceholder: string; emailLabel: string; emailPlaceholder: string; currency: string };
  about: {
    orgStructure: string; nonprofitSub: string;
    boardTitle: string; boardSub: string; volunteerTitle: string; volunteerSub: string;
    registrationTitle: string; cvrLabel: string; nameLabel: string; addressLabel: string;
  };
};

export const UI_TRANSLATIONS: Record<Lang, UI> = {
  da: {
    footer: { about: 'Om os', contact: 'Kontakt', privacy: 'Privatlivspolitik', copyright: '© 2026 EAUC Nordic. Alle rettigheder forbeholdes.' },
    footerFull: {
      tagline: 'Vi giver ukrainske børn tryghed, oplevelser og håb — ét pusterum ad gangen.',
      navTitle: 'Navigation', navMission: 'Vores mission', navHow: 'Sådan gør vi', navAbout: 'Om foreningen', navDonate: 'Donér nu', navContact: 'Kontakt',
      contactTitle: 'Kontakt os',
      addressLines: ['Byparken 75, 1. 1', '5700 Svendborg', 'Danmark'],
      emailLabel: 'E-mail', email: 'info@eaucnordic.com',
      legalTitle: 'Juridisk information',
      cvr: 'CVR: 46329406',
      registeredAs: 'Registreret som almennyttig, non-profit forening i Danmark',
      taxNote: '🇩🇰 Donationer er fradragsberettigede iht. ligningslovens § 8A',
      transparencyNote: '98% af alle midler går direkte til børnene',
      followUs: 'Følg os',
      privacy: 'Privatlivspolitik', cookies: 'Cookiepolitik', copyright: '© 2026 European Association of Ukrainian Children – Nordic (EAUC Nordic) · CVR 46329406',
    },
    donate: { customPlaceholder: 'Andet beløb', emailLabel: 'Email (til kvittering)', emailPlaceholder: 'din@email.dk', currency: 'kr' },
    about: { orgStructure: 'Organisationsstruktur', nonprofitSub: 'Almennyttig forening · Danmark', boardTitle: 'Bestyrelse', boardSub: 'Strategisk ledelse', volunteerTitle: 'Frivillige', volunteerSub: 'Værtsfamilier & støtter', registrationTitle: 'Registreringsoplysninger', cvrLabel: 'CVR-NUMMER', nameLabel: 'FORENINGENS NAVN', addressLabel: 'ADRESSE' },
  },
  uk: {
    footer: { about: 'Про нас', contact: 'Контакт', privacy: 'Конфіденційність', copyright: '© 2026 EAUC Nordic. Усі права захищено.' },
    footerFull: {
      tagline: 'Ми даємо українським дітям безпеку, враження та надію — один перепочинок за раз.',
      navTitle: 'Навігація', navMission: 'Наша місія', navHow: 'Як ми це робимо', navAbout: 'Про організацію', navDonate: 'Пожертвувати', navContact: 'Контакт',
      contactTitle: 'Звʼяжіться з нами',
      addressLines: ['Byparken 75, 1. 1', '5700 Svendborg', 'Данія'],
      emailLabel: 'E-mail', email: 'info@eaucnordic.com',
      legalTitle: 'Юридична інформація',
      cvr: 'CVR: 46329406',
      registeredAs: 'Зареєстровано як некомерційна організація в Данії',
      taxNote: '🇩🇰 Пожертвування підлягають податковому вирахуванню в Данії',
      transparencyNote: '98% усіх коштів іде безпосередньо дітям',
      followUs: 'Слідкуйте за нами',
      privacy: 'Політика конфіденційності', cookies: 'Політика cookies', copyright: '© 2026 European Association of Ukrainian Children – Nordic (EAUC Nordic) · CVR 46329406',
    },
    donate: { customPlaceholder: 'Інша сума', emailLabel: 'Email (для квитанції)', emailPlaceholder: 'ваш@email.ua', currency: 'kr' },
    about: { orgStructure: 'Структура організації', nonprofitSub: 'Некомерційна організація · Данія', boardTitle: 'Рада директорів', boardSub: 'Стратегічне керівництво', volunteerTitle: 'Волонтери', volunteerSub: 'Сімʼї-господарі та прихильники', registrationTitle: 'Реєстраційна інформація', cvrLabel: 'CVR-НОМЕР', nameLabel: 'НАЗВА ОРГАНІЗАЦІЇ', addressLabel: 'АДРЕСА' },
  },
  en: {
    footer: { about: 'About us', contact: 'Contact', privacy: 'Privacy policy', copyright: '© 2026 EAUC Nordic. All rights reserved.' },
    footerFull: {
      tagline: 'We give Ukrainian children security, experiences and hope — one break at a time.',
      navTitle: 'Navigation', navMission: 'Our mission', navHow: 'How we do it', navAbout: 'About us', navDonate: 'Donate now', navContact: 'Contact',
      contactTitle: 'Get in touch',
      addressLines: ['Byparken 75, 1. 1', '5700 Svendborg', 'Denmark'],
      emailLabel: 'Email', email: 'info@eaucnordic.com',
      legalTitle: 'Legal information',
      cvr: 'CVR: 46329406',
      registeredAs: 'Registered as a non-profit organisation in Denmark',
      taxNote: '🇩🇰 Donations are tax-deductible in Denmark',
      transparencyNote: '98% of all funds go directly to the children',
      followUs: 'Follow us',
      privacy: 'Privacy policy', cookies: 'Cookie policy', copyright: '© 2026 European Association of Ukrainian Children – Nordic (EAUC Nordic) · CVR 46329406',
    },
    donate: { customPlaceholder: 'Custom amount', emailLabel: 'Email (for receipt)', emailPlaceholder: 'your@email.com', currency: 'kr' },
    about: { orgStructure: 'Organisational structure', nonprofitSub: 'Non-profit organisation · Denmark', boardTitle: 'Board of Directors', boardSub: 'Strategic leadership', volunteerTitle: 'Volunteers', volunteerSub: 'Host families & supporters', registrationTitle: 'Registration details', cvrLabel: 'CVR NUMBER', nameLabel: 'ORGANISATION NAME', addressLabel: 'ADDRESS' },
  },
  de: {
    footer: { about: 'Über uns', contact: 'Kontakt', privacy: 'Datenschutz', copyright: '© 2026 EAUC Nordic. Alle Rechte vorbehalten.' },
    footerFull: {
      tagline: 'Wir geben ukrainischen Kindern Sicherheit, Erlebnisse und Hoffnung — eine Auszeit nach der anderen.',
      navTitle: 'Navigation', navMission: 'Unsere Mission', navHow: 'So helfen wir', navAbout: 'Über den Verein', navDonate: 'Jetzt spenden', navContact: 'Kontakt',
      contactTitle: 'Kontaktieren Sie uns',
      addressLines: ['Byparken 75, 1. 1', '5700 Svendborg', 'Dänemark'],
      emailLabel: 'E-Mail', email: 'info@eaucnordic.com',
      legalTitle: 'Rechtliche Informationen',
      cvr: 'CVR: 46329406',
      registeredAs: 'Eingetragen als gemeinnützige Non-Profit-Organisation in Dänemark',
      taxNote: '🇩🇰 Spenden sind in Dänemark steuerlich abzugsfähig',
      transparencyNote: '98% aller Mittel gehen direkt an die Kinder',
      followUs: 'Folgen Sie uns',
      privacy: 'Datenschutzrichtlinie', cookies: 'Cookie-Richtlinie', copyright: '© 2026 European Association of Ukrainian Children – Nordic (EAUC Nordic) · CVR 46329406',
    },
    donate: { customPlaceholder: 'Anderer Betrag', emailLabel: 'E-Mail (für Quittung)', emailPlaceholder: 'deine@email.de', currency: 'kr' },
    about: { orgStructure: 'Organisationsstruktur', nonprofitSub: 'Gemeinnütziger Verein · Dänemark', boardTitle: 'Vorstand', boardSub: 'Strategische Leitung', volunteerTitle: 'Ehrenamtliche', volunteerSub: 'Gastfamilien & Unterstützer', registrationTitle: 'Registrierungsangaben', cvrLabel: 'CVR-NUMMER', nameLabel: 'VEREINSNAME', addressLabel: 'ADRESSE' },
  },
  sv: {
    footer: { about: 'Om oss', contact: 'Kontakt', privacy: 'Integritetspolicy', copyright: '© 2026 EAUC Nordic. Alla rättigheter förbehållna.' },
    footerFull: {
      tagline: 'Vi ger ukrainska barn trygghet, upplevelser och hopp — ett andrum i taget.',
      navTitle: 'Navigation', navMission: 'Vårt uppdrag', navHow: 'Så här gör vi', navAbout: 'Om föreningen', navDonate: 'Donera nu', navContact: 'Kontakt',
      contactTitle: 'Kontakta oss',
      addressLines: ['Byparken 75, 1. 1', '5700 Svendborg', 'Danmark'],
      emailLabel: 'E-post', email: 'info@eaucnordic.com',
      legalTitle: 'Juridisk information',
      cvr: 'CVR: 46329406',
      registeredAs: 'Registrerad som allmännyttig ideell förening i Danmark',
      taxNote: '🇩🇰 Donationer är avdragsgilla i Danmark',
      transparencyNote: '98% av alla medel går direkt till barnen',
      followUs: 'Följ oss',
      privacy: 'Integritetspolicy', cookies: 'Cookiepolicy', copyright: '© 2026 European Association of Ukrainian Children – Nordic (EAUC Nordic) · CVR 46329406',
    },
    donate: { customPlaceholder: 'Annat belopp', emailLabel: 'E-post (för kvitto)', emailPlaceholder: 'din@email.se', currency: 'kr' },
    about: { orgStructure: 'Organisationsstruktur', nonprofitSub: 'Allmännyttig förening · Danmark', boardTitle: 'Styrelse', boardSub: 'Strategisk ledning', volunteerTitle: 'Volontärer', volunteerSub: 'Värdfamiljer & supporters', registrationTitle: 'Registreringsuppgifter', cvrLabel: 'CVR-NUMMER', nameLabel: 'FÖRENINGENS NAMN', addressLabel: 'ADRESS' },
  },
  no: {
    footer: { about: 'Om oss', contact: 'Kontakt', privacy: 'Personvernpolicy', copyright: '© 2026 EAUC Nordic. Alle rettigheter forbeholdt.' },
    footerFull: {
      tagline: 'Vi gir ukrainske barn trygghet, opplevelser og håp — ett pusterom av gangen.',
      navTitle: 'Navigasjon', navMission: 'Vår misjon', navHow: 'Slik gjør vi det', navAbout: 'Om foreningen', navDonate: 'Gi nå', navContact: 'Kontakt',
      contactTitle: 'Ta kontakt',
      addressLines: ['Byparken 75, 1. 1', '5700 Svendborg', 'Danmark'],
      emailLabel: 'E-post', email: 'info@eaucnordic.com',
      legalTitle: 'Juridisk informasjon',
      cvr: 'CVR: 46329406',
      registeredAs: 'Registrert som allmennyttig non-profit forening i Danmark',
      taxNote: '🇩🇰 Donasjoner er skattefradragsberettigede i Danmark',
      transparencyNote: '98% av alle midler går direkte til barna',
      followUs: 'Følg oss',
      privacy: 'Personvernpolicy', cookies: 'Informasjonskapselpolicy', copyright: '© 2026 European Association of Ukrainian Children – Nordic (EAUC Nordic) · CVR 46329406',
    },
    donate: { customPlaceholder: 'Annet beløp', emailLabel: 'E-post (for kvittering)', emailPlaceholder: 'din@email.no', currency: 'kr' },
    about: { orgStructure: 'Organisasjonsstruktur', nonprofitSub: 'Allmennyttig forening · Danmark', boardTitle: 'Styre', boardSub: 'Strategisk ledelse', volunteerTitle: 'Frivillige', volunteerSub: 'Vertsfamilier & støttespillere', registrationTitle: 'Registreringsopplysninger', cvrLabel: 'CVR-NUMMER', nameLabel: 'FORENINGENS NAVN', addressLabel: 'ADRESSE' },
  },
  fi: {
    footer: { about: 'Tietoa meistä', contact: 'Yhteystiedot', privacy: 'Tietosuojakäytäntö', copyright: '© 2026 EAUC Nordic. Kaikki oikeudet pidätetään.' },
    footerFull: {
      tagline: 'Annamme ukrainalaisille lapsille turvallisuutta, elämyksiä ja toivoa — yksi hengähdystauko kerrallaan.',
      navTitle: 'Navigointi', navMission: 'Missiomme', navHow: 'Näin toimimme', navAbout: 'Tietoa yhdistyksestä', navDonate: 'Lahjoita nyt', navContact: 'Yhteystiedot',
      contactTitle: 'Ota yhteyttä',
      addressLines: ['Byparken 75, 1. 1', '5700 Svendborg', 'Tanska'],
      emailLabel: 'Sähköposti', email: 'info@eaucnordic.com',
      legalTitle: 'Oikeudellinen tieto',
      cvr: 'CVR: 46329406',
      registeredAs: 'Rekisteröity yleishyödylliseksi yhdistykseksi Tanskassa',
      taxNote: '🇩🇰 Lahjoitukset ovat verovähennyskelpoisia Tanskassa',
      transparencyNote: '98% kaikista varoista menee suoraan lapsille',
      followUs: 'Seuraa meitä',
      privacy: 'Tietosuojakäytäntö', cookies: 'Evästekäytäntö', copyright: '© 2026 European Association of Ukrainian Children – Nordic (EAUC Nordic) · CVR 46329406',
    },
    donate: { customPlaceholder: 'Muu summa', emailLabel: 'Sähköposti (kuitille)', emailPlaceholder: 'sinun@email.fi', currency: 'kr' },
    about: { orgStructure: 'Organisaatiorakenne', nonprofitSub: 'Yleishyödyllinen yhdistys · Tanska', boardTitle: 'Hallitus', boardSub: 'Strateginen johtaminen', volunteerTitle: 'Vapaaehtoiset', volunteerSub: 'Isäntäperheet & tukijat', registrationTitle: 'Rekisteröintitiedot', cvrLabel: 'CVR-NUMERO', nameLabel: 'YHDISTYKSEN NIMI', addressLabel: 'OSOITE' },
  },
  it: {
    footer: { about: 'Chi siamo', contact: 'Contatti', privacy: 'Privacy', copyright: '© 2026 EAUC Nordic. Tutti i diritti riservati.' },
    footerFull: {
      tagline: 'Diamo ai bambini ucraini sicurezza, esperienze e speranza — una pausa alla volta.',
      navTitle: 'Navigazione', navMission: 'La nostra missione', navHow: 'Come lo facciamo', navAbout: "Sull'associazione", navDonate: 'Dona ora', navContact: 'Contatti',
      contactTitle: 'Contattaci',
      addressLines: ['Byparken 75, 1. 1', '5700 Svendborg', 'Danimarca'],
      emailLabel: 'Email', email: 'info@eaucnordic.com',
      legalTitle: 'Informazioni legali',
      cvr: 'CVR: 46329406',
      registeredAs: "Registrata come associazione senza scopo di lucro in Danimarca",
      taxNote: '🇩🇰 Le donazioni sono deducibili fiscalmente in Danimarca',
      transparencyNote: '98% di tutti i fondi va direttamente ai bambini',
      followUs: 'Seguici',
      privacy: 'Informativa sulla privacy', cookies: 'Informativa sui cookie', copyright: '© 2026 European Association of Ukrainian Children – Nordic (EAUC Nordic) · CVR 46329406',
    },
    donate: { customPlaceholder: 'Importo personalizzato', emailLabel: 'Email (per ricevuta)', emailPlaceholder: 'tua@email.it', currency: 'kr' },
    about: { orgStructure: 'Struttura organizzativa', nonprofitSub: 'Associazione senza scopo di lucro · Danimarca', boardTitle: 'Consiglio di Amministrazione', boardSub: 'Direzione strategica', volunteerTitle: 'Volontari', volunteerSub: 'Famiglie ospitanti & sostenitori', registrationTitle: 'Dati di registrazione', cvrLabel: 'NUMERO CVR', nameLabel: "NOME DELL'ASSOCIAZIONE", addressLabel: 'INDIRIZZO' },
  },
  es: {
    footer: { about: 'Sobre nosotros', contact: 'Contacto', privacy: 'Privacidad', copyright: '© 2026 EAUC Nordic. Todos los derechos reservados.' },
    footerFull: {
      tagline: 'Damos a los niños ucranianos seguridad, experiencias y esperanza — un descanso a la vez.',
      navTitle: 'Navegación', navMission: 'Nuestra misión', navHow: 'Cómo lo hacemos', navAbout: 'Sobre nosotros', navDonate: 'Donar ahora', navContact: 'Contacto',
      contactTitle: 'Contáctanos',
      addressLines: ['Byparken 75, 1. 1', '5700 Svendborg', 'Dinamarca'],
      emailLabel: 'Email', email: 'info@eaucnordic.com',
      legalTitle: 'Información legal',
      cvr: 'CVR: 46329406',
      registeredAs: 'Registrada como asociación sin ánimo de lucro en Dinamarca',
      taxNote: '🇩🇰 Las donaciones son deducibles fiscalmente en Dinamarca',
      transparencyNote: '98% de todos los fondos va directamente a los niños',
      followUs: 'Síguenos',
      privacy: 'Política de privacidad', cookies: 'Política de cookies', copyright: '© 2026 European Association of Ukrainian Children – Nordic (EAUC Nordic) · CVR 46329406',
    },
    donate: { customPlaceholder: 'Otra cantidad', emailLabel: 'Email (para recibo)', emailPlaceholder: 'tu@email.es', currency: 'kr' },
    about: { orgStructure: 'Estructura organizativa', nonprofitSub: 'Asociación sin ánimo de lucro · Dinamarca', boardTitle: 'Junta Directiva', boardSub: 'Dirección estratégica', volunteerTitle: 'Voluntarios', volunteerSub: 'Familias de acogida & colaboradores', registrationTitle: 'Datos de registro', cvrLabel: 'NÚMERO CVR', nameLabel: 'NOMBRE DE LA ASOCIACIÓN', addressLabel: 'DIRECCIÓN' },
  },
};

// ─── Full site content translations ─────────────────────────────────────────
// These are the default translations for each language.
// Da (Danish) is omitted here — it comes from site-content.ts DEFAULT_CONTENT.

import type { SiteContent } from './site-content';

export const CONTENT_TRANSLATIONS: Partial<Record<Lang, SiteContent>> = {
  uk: {
    sections: [
      {
        id: 'hero', type: 'hero', visible: true,
        imageUrl: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=2069&auto=format&fit=crop',
        badge: 'ЗБІР КОШТІВ ТРИВАЄ',
        heading: 'Подаруйте українським дітям',
        headingAccent: 'справжнє дитинство',
        subtitle: 'Допоможіть нам привезти українських дітей до Данії — для пригод, безпеки та радості бути дитиною знову.',
        ctaLabel: 'Пожертвувати',
        ctaUrl: '#donér',
        cta2Label: 'Дізнатися більше',
        cta2Url: '#mission',
      },
      {
        id: 'mission', type: 'mission', visible: true,
        heading: 'Наша місія',
        subtitle: 'Від початку війни українські діти втратили повсякдення, друзів і дитинство. Ми хочемо дати їм перепочинок — сповнений ігор, сміху та нових дружб у Данії.',
        cards: [
          { icon: 'heart',  title: 'Любов і Турбота',    text: 'Ми оточуємо кожну дитину теплом і безпекою з моменту приїзду до Данії.' },
          { icon: 'smile',  title: 'Радість і Пригоди',  text: 'Тіволі, пляж, ліс — ми даруємо дітям спогади на все життя.' },
          { icon: 'shield', title: 'Захист і Надія',     text: 'Відпочинок від війни, де діти можуть знову бути дітьми і знайти сміливість.' },
        ],
      },
      {
        id: 'how', type: 'how', visible: true,
        heading: 'Як ми це робимо',
        steps: [
          { n: '01', title: 'Ви жертвуєте',    text: 'Будь-яка сума має значення. Ваше пожертвування йде безпосередньо на фінансування поїздки, проживання та вражень.' },
          { n: '02', title: 'Ми організовуємо',text: 'Ми співпрацюємо з українськими організаціями, щоб знайти дітей, які найбільше потребують перепочинку.' },
          { n: '03', title: 'Діти переживають',text: 'Діти приїжджають до Данії і отримують тижні, сповнені ігор, природи, культури та нових дружб.' },
          { n: '04', title: 'Надія зростає',   text: 'Діти повертаються додому з новими силами, спогадами і вірою в те, що світ все ще добрий.' },
        ],
      },
      {
        id: 'stats', type: 'stats', visible: true,
        heading: 'Наш вплив',
        subtitle: 'Завдяки вашій щедрості ми вже зробили величезну різницю.',
        imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=2069&auto=format&fit=crop',
        items: [
          { value: '127',    label: 'ДІТЕЙ ОТРИМАЛИ ДОПОМОГУ' },
          { value: '42',     label: 'ЕКСКУРСІЙНИХ ПОЇЗДОК' },
          { value: '1.200+', label: 'ДОНОРІВ' },
          { value: '98%',    label: 'ЙДЕ БЕЗПОСЕРЕДНЬО ДІТЯМ' },
        ],
      },
      {
        id: 'about', type: 'about', visible: true,
        tagline: 'ХТО МИ',
        heading: 'Про організацію',
        text: 'European Association of Ukrainian Children – Nordic (EAUC Nordic) засновано як незалежну, некомерційну організацію в Данії. Ми працюємо для того, щоб дати українським дітям безпеку, враження та надію через перебування у Скандинавії.',
        cvr: '46329406', orgName: 'European Association of Ukrainian Children - Nordic',
        address: 'Byparken 75, 1. 1, 5700 Svendborg',
      },
      {
        id: 'board', type: 'board', visible: true,
        heading: 'Рада директорів',
        members: [
          { name: 'Імʼя буде', role: 'Голова',              photo: '' },
          { name: 'Імʼя буде', role: 'Заступник голови',    photo: '' },
          { name: 'Імʼя буде', role: 'Скарбник',            photo: '' },
          { name: 'Імʼя буде', role: 'Член ради',           photo: '' },
        ],
      },
      {
        id: 'donate', type: 'donate', visible: true,
        heading: 'Зробіть внесок сьогодні',
        subtitle: 'Будь-яка сума має значення. Оберіть суму нижче або пожертвуйте скільки зможете.',
        amounts: [100, 250, 500, 1000],
        buttonLabel: 'Пожертвувати зараз',
        note: 'Безпечний платіж · Податкові пільги · 100% прозорість',
      },
    ],
  },

  en: {
    sections: [
      {
        id: 'hero', type: 'hero', visible: true,
        imageUrl: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=2069&auto=format&fit=crop',
        badge: 'FUNDRAISING IN PROGRESS',
        heading: 'Give Ukrainian children',
        headingAccent: 'their childhood back',
        subtitle: 'Help us bring Ukrainian children to Denmark — for adventures, safety and the joy of being a child again.',
        ctaLabel: 'Donate now',
        ctaUrl: '#donér',
        cta2Label: 'Learn more',
        cta2Url: '#mission',
      },
      {
        id: 'mission', type: 'mission', visible: true,
        heading: 'Our mission',
        subtitle: 'Since the war began, Ukrainian children have lost their everyday life, their friends and their childhood. We want to give them a breathing space — filled with play, laughter and new friendships in Denmark.',
        cards: [
          { icon: 'heart',  title: 'Love & Care',         text: 'We surround every child with warmth and safety from the moment they arrive in Denmark.' },
          { icon: 'smile',  title: 'Joy & Experiences',   text: 'Tivoli, the beach, the forest — we give children memories that last a lifetime.' },
          { icon: 'shield', title: 'Safety & Hope',       text: 'A break from the war, where children can be children again and rediscover courage.' },
        ],
      },
      {
        id: 'how', type: 'how', visible: true,
        heading: 'How we do it',
        steps: [
          { n: '01', title: 'You donate',      text: 'Every amount makes a difference. Your donation goes directly to financing travel, accommodation and experiences.' },
          { n: '02', title: 'We organise',     text: 'We collaborate with Ukrainian organisations to find children who need a break the most.' },
          { n: '03', title: 'Children experience', text: 'Children come to Denmark and get weeks filled with play, nature, culture and new friendships.' },
          { n: '04', title: 'Hope grows',      text: 'Children return home with new strength, memories and the belief that the world is still good.' },
        ],
      },
      {
        id: 'stats', type: 'stats', visible: true,
        heading: 'Our impact',
        subtitle: 'Thanks to your generosity, we have already made an enormous difference.',
        imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=2069&auto=format&fit=crop',
        items: [
          { value: '127',    label: 'CHILDREN HELPED' },
          { value: '42',     label: 'EXPERIENCE TRIPS' },
          { value: '1,200+', label: 'DONORS' },
          { value: '98%',    label: 'GOES DIRECTLY TO CHILDREN' },
        ],
      },
      {
        id: 'about', type: 'about', visible: true,
        tagline: 'WHO WE ARE',
        heading: 'About the organisation',
        text: 'European Association of Ukrainian Children – Nordic (EAUC Nordic) was founded as an independent, non-profit organisation in Denmark. We work to give Ukrainian children security, experiences and hope through stays in the Nordic countries.',
        cvr: '46329406', orgName: 'European Association of Ukrainian Children - Nordic',
        address: 'Byparken 75, 1. 1, 5700 Svendborg',
      },
      {
        id: 'board', type: 'board', visible: true,
        heading: 'Board of Directors',
        members: [
          { name: 'Name pending', role: 'Chairman',       photo: '' },
          { name: 'Name pending', role: 'Vice-chairman',  photo: '' },
          { name: 'Name pending', role: 'Treasurer',      photo: '' },
          { name: 'Name pending', role: 'Board member',   photo: '' },
        ],
      },
      {
        id: 'donate', type: 'donate', visible: true,
        heading: 'Make a contribution today',
        subtitle: 'Every amount makes a difference. Choose an amount below, or donate what you can.',
        amounts: [100, 250, 500, 1000],
        buttonLabel: 'Donate now',
        note: 'Secure payment · Tax deductible · 100% transparency',
      },
    ],
  },

  de: {
    sections: [
      {
        id: 'hero', type: 'hero', visible: true,
        imageUrl: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=2069&auto=format&fit=crop',
        badge: 'SPENDENAKTION LÄUFT',
        heading: 'Geben Sie ukrainischen Kindern',
        headingAccent: 'ihre Kindheit zurück',
        subtitle: 'Helfen Sie uns, ukrainische Kinder nach Dänemark zu bringen — für Erlebnisse, Sicherheit und die Freude, wieder Kind zu sein.',
        ctaLabel: 'Jetzt spenden',
        ctaUrl: '#donér',
        cta2Label: 'Mehr erfahren',
        cta2Url: '#mission',
      },
      {
        id: 'mission', type: 'mission', visible: true,
        heading: 'Unsere Mission',
        subtitle: 'Seit Kriegsbeginn haben ukrainische Kinder ihren Alltag, ihre Freunde und ihre Kindheit verloren. Wir möchten ihnen eine Auszeit geben — erfüllt mit Spiel, Lachen und neuen Freundschaften in Dänemark.',
        cards: [
          { icon: 'heart',  title: 'Liebe & Fürsorge',    text: 'Wir umgeben jedes Kind mit Wärme und Geborgenheit, sobald es in Dänemark ankommt.' },
          { icon: 'smile',  title: 'Freude & Erlebnisse', text: 'Tivoli, der Strand, der Wald — wir schenken den Kindern Erinnerungen, die ein Leben lang halten.' },
          { icon: 'shield', title: 'Sicherheit & Hoffnung', text: 'Eine Auszeit vom Krieg, in der Kinder wieder Kinder sein und neuen Mut fassen können.' },
        ],
      },
      {
        id: 'how', type: 'how', visible: true,
        heading: 'So helfen wir',
        steps: [
          { n: '01', title: 'Sie spenden',      text: 'Jeder Betrag macht einen Unterschied. Ihre Spende fließt direkt in die Finanzierung von Reise, Unterkunft und Erlebnissen.' },
          { n: '02', title: 'Wir organisieren', text: 'Wir arbeiten mit ukrainischen Organisationen zusammen, um Kinder zu finden, die eine Auszeit am dringendsten benötigen.' },
          { n: '03', title: 'Kinder erleben',   text: 'Die Kinder kommen nach Dänemark und bekommen Wochen voller Spiel, Natur, Kultur und neuer Freundschaften.' },
          { n: '04', title: 'Hoffnung wächst',  text: 'Die Kinder kehren mit neuer Kraft, Erinnerungen und dem Glauben nach Hause, dass die Welt noch gut ist.' },
        ],
      },
      {
        id: 'stats', type: 'stats', visible: true,
        heading: 'Unsere Wirkung',
        subtitle: 'Dank Ihrer Großzügigkeit haben wir bereits einen riesigen Unterschied gemacht.',
        imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=2069&auto=format&fit=crop',
        items: [
          { value: '127',    label: 'KINDER UNTERSTÜTZT' },
          { value: '42',     label: 'ERLEBNISREISEN' },
          { value: '1.200+', label: 'SPENDER' },
          { value: '98%',    label: 'GEHT DIREKT AN KINDER' },
        ],
      },
      {
        id: 'about', type: 'about', visible: true,
        tagline: 'WER SIND WIR',
        heading: 'Über den Verein',
        text: 'European Association of Ukrainian Children – Nordic (EAUC Nordic) wurde als unabhängige, gemeinnützige Non-Profit-Organisation in Dänemark gegründet. Wir arbeiten daran, ukrainischen Kindern Sicherheit, Erlebnisse und Hoffnung durch Aufenthalte in den nordischen Ländern zu geben.',
        cvr: '46329406', orgName: 'European Association of Ukrainian Children - Nordic',
        address: 'Byparken 75, 1. 1, 5700 Svendborg',
      },
      {
        id: 'board', type: 'board', visible: true,
        heading: 'Vorstand',
        members: [
          { name: 'Name folgt', role: 'Vorsitzender',          photo: '' },
          { name: 'Name folgt', role: 'Stellvertretender Vors.', photo: '' },
          { name: 'Name folgt', role: 'Schatzmeister',         photo: '' },
          { name: 'Name folgt', role: 'Vorstandsmitglied',     photo: '' },
        ],
      },
      {
        id: 'donate', type: 'donate', visible: true,
        heading: 'Heute einen Beitrag leisten',
        subtitle: 'Jeder Betrag macht einen Unterschied. Wählen Sie unten einen Betrag oder spenden Sie, was Sie können.',
        amounts: [100, 250, 500, 1000],
        buttonLabel: 'Jetzt spenden',
        note: 'Sichere Zahlung · Steuerabzugsfähig · 100% Transparenz',
      },
    ],
  },

  sv: {
    sections: [
      {
        id: 'hero', type: 'hero', visible: true,
        imageUrl: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=2069&auto=format&fit=crop',
        badge: 'INSAMLING PÅGÅR',
        heading: 'Ge ukrainska barn',
        headingAccent: 'deras barndom tillbaka',
        subtitle: 'Hjälp oss att ta ukrainska barn till Danmark — för upplevelser, trygghet och glädjen att vara barn igen.',
        ctaLabel: 'Donera nu',
        ctaUrl: '#donér',
        cta2Label: 'Läs mer',
        cta2Url: '#mission',
      },
      {
        id: 'mission', type: 'mission', visible: true,
        heading: 'Vårt uppdrag',
        subtitle: 'Sedan kriget startade har ukrainska barn förlorat sin vardag, sina vänner och sin barndom. Vi vill ge dem ett andrum — fyllt med lek, skratt och nya vänskaper i Danmark.',
        cards: [
          { icon: 'heart',  title: 'Kärlek & Omsorg',    text: 'Vi omger varje barn med värme och trygghet från det ögonblick de anländer till Danmark.' },
          { icon: 'smile',  title: 'Glädje & Upplevelser', text: 'Tivoli, stranden, skogen — vi ger barnen minnen som varar hela livet.' },
          { icon: 'shield', title: 'Trygghet & Hopp',    text: 'Ett andrum från kriget, där barn kan vara barn igen och återfinna modet.' },
        ],
      },
      {
        id: 'how', type: 'how', visible: true,
        heading: 'Så här gör vi',
        steps: [
          { n: '01', title: 'Du donerar',     text: 'Varje belopp gör skillnad. Din donation går direkt till att finansiera resa, boende och upplevelser.' },
          { n: '02', title: 'Vi organiserar', text: 'Vi samarbetar med ukrainska organisationer för att hitta barn som mest behöver ett andrum.' },
          { n: '03', title: 'Barnen upplever',text: 'Barnen kommer till Danmark och får veckor fyllda med lek, natur, kultur och nya vänskaper.' },
          { n: '04', title: 'Hoppet växer',   text: 'Barnen reser hem med nya krafter, minnen och tron på att världen fortfarande är god.' },
        ],
      },
      {
        id: 'stats', type: 'stats', visible: true,
        heading: 'Vår genomslagskraft',
        subtitle: 'Tack vare er generositet har vi redan gjort en enorm skillnad.',
        imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=2069&auto=format&fit=crop',
        items: [
          { value: '127',    label: 'BARN HJÄLPTA' },
          { value: '42',     label: 'UPPLEVELSETURER' },
          { value: '1 200+', label: 'DONATORER' },
          { value: '98%',    label: 'GÅR DIREKT TILL BARNEN' },
        ],
      },
      {
        id: 'about', type: 'about', visible: true,
        tagline: 'VEM STÅR BAKOM',
        heading: 'Om föreningen',
        text: 'European Association of Ukrainian Children – Nordic (EAUC Nordic) grundades som en oberoende, allmännyttig ideell förening i Danmark. Vi arbetar för att ge ukrainska barn trygghet, upplevelser och hopp genom vistelser i Norden.',
        cvr: '46329406', orgName: 'European Association of Ukrainian Children - Nordic',
        address: 'Byparken 75, 1. 1, 5700 Svendborg',
      },
      {
        id: 'board', type: 'board', visible: true,
        heading: 'Styrelsen',
        members: [
          { name: 'Namn kommer', role: 'Ordförande',       photo: '' },
          { name: 'Namn kommer', role: 'Vice ordförande',  photo: '' },
          { name: 'Namn kommer', role: 'Kassör',           photo: '' },
          { name: 'Namn kommer', role: 'Styrelseledamot',  photo: '' },
        ],
      },
      {
        id: 'donate', type: 'donate', visible: true,
        heading: 'Ge ett bidrag idag',
        subtitle: 'Varje belopp gör skillnad. Välj ett belopp nedan, eller donera vad du kan.',
        amounts: [100, 250, 500, 1000],
        buttonLabel: 'Donera nu',
        note: 'Säker betalning · Skatteavdrag · 100% transparens',
      },
    ],
  },

  no: {
    sections: [
      {
        id: 'hero', type: 'hero', visible: true,
        imageUrl: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=2069&auto=format&fit=crop',
        badge: 'INNSAMLING PÅGÅR',
        heading: 'Gi ukrainske barn',
        headingAccent: 'barndommen tilbake',
        subtitle: 'Hjelp oss med å bringe ukrainske barn til Danmark — for opplevelser, trygghet og gleden ved å være barn igjen.',
        ctaLabel: 'Gi nå',
        ctaUrl: '#donér',
        cta2Label: 'Les mer',
        cta2Url: '#mission',
      },
      {
        id: 'mission', type: 'mission', visible: true,
        heading: 'Vår misjon',
        subtitle: 'Siden krigens start har ukrainske barn mistet hverdagen, vennene sine og barndommen. Vi ønsker å gi dem et pusterom — fylt med lek, latter og nye vennskap i Danmark.',
        cards: [
          { icon: 'heart',  title: 'Kjærlighet & Omsorg', text: 'Vi omgir hvert barn med varme og trygghet fra det øyeblikket de ankommer Danmark.' },
          { icon: 'smile',  title: 'Glede & Opplevelser', text: 'Tivoli, stranden, skogen — vi gir barna minner som varer hele livet.' },
          { icon: 'shield', title: 'Trygghet & Håp',      text: 'Et pusterom fra krigen, der barn kan være barn igjen og gjenfinne motet.' },
        ],
      },
      {
        id: 'how', type: 'how', visible: true,
        heading: 'Slik gjør vi det',
        steps: [
          { n: '01', title: 'Du donerer',     text: 'Ethvert beløp gjør en forskjell. Din donasjon går direkte til å finansiere reise, opphold og opplevelser.' },
          { n: '02', title: 'Vi organiserer', text: 'Vi samarbeider med ukrainske organisasjoner for å finne barn som trenger et pusterom mest.' },
          { n: '03', title: 'Barna opplever', text: 'Barna kommer til Danmark og får uker fylt med lek, natur, kultur og nye vennskap.' },
          { n: '04', title: 'Håpet vokser',   text: 'Barna reiser hjem med nye krefter, minner og troen på at verden fortsatt er god.' },
        ],
      },
      {
        id: 'stats', type: 'stats', visible: true,
        heading: 'Vår gjennomslagskraft',
        subtitle: 'Takket være din generøsitet har vi allerede gjort en enorm forskjell.',
        imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=2069&auto=format&fit=crop',
        items: [
          { value: '127',    label: 'BARN HJULPET' },
          { value: '42',     label: 'OPPLEVELSESTURER' },
          { value: '1 200+', label: 'DONATORER' },
          { value: '98%',    label: 'GÅR DIREKTE TIL BARNA' },
        ],
      },
      {
        id: 'about', type: 'about', visible: true,
        tagline: 'HVEM STÅR BAK',
        heading: 'Om foreningen',
        text: 'European Association of Ukrainian Children – Nordic (EAUC Nordic) ble stiftet som en uavhengig, allmennyttig non-profit forening i Danmark. Vi jobber for å gi ukrainske barn trygghet, opplevelser og håp gjennom opphold i Norden.',
        cvr: '46329406', orgName: 'European Association of Ukrainian Children - Nordic',
        address: 'Byparken 75, 1. 1, 5700 Svendborg',
      },
      {
        id: 'board', type: 'board', visible: true,
        heading: 'Styret',
        members: [
          { name: 'Navn kommer', role: 'Leder',              photo: '' },
          { name: 'Navn kommer', role: 'Nestleder',          photo: '' },
          { name: 'Navn kommer', role: 'Kasserer',           photo: '' },
          { name: 'Navn kommer', role: 'Styremedlem',        photo: '' },
        ],
      },
      {
        id: 'donate', type: 'donate', visible: true,
        heading: 'Gi et bidrag i dag',
        subtitle: 'Ethvert beløp gjør en forskjell. Velg et beløp nedenfor, eller gi det du kan.',
        amounts: [100, 250, 500, 1000],
        buttonLabel: 'Gi nå',
        note: 'Sikker betaling · Skattefradrag · 100% gjennomsiktighet',
      },
    ],
  },

  fi: {
    sections: [
      {
        id: 'hero', type: 'hero', visible: true,
        imageUrl: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=2069&auto=format&fit=crop',
        badge: 'KERÄYS KÄYNNISSÄ',
        heading: 'Anna ukrainalaisille lapsille',
        headingAccent: 'lapsuus takaisin',
        subtitle: 'Auta meitä tuomaan ukrainalaislapsia Tanskaan — seikkailujen, turvallisuuden ja lapsena olemisen ilon vuoksi.',
        ctaLabel: 'Lahjoita nyt',
        ctaUrl: '#donér',
        cta2Label: 'Lue lisää',
        cta2Url: '#mission',
      },
      {
        id: 'mission', type: 'mission', visible: true,
        heading: 'Missiomme',
        subtitle: 'Sodan alettua ukrainalaislapset ovat menettäneet arkensa, ystävänsä ja lapsuutensa. Haluamme antaa heille hengähdystauon — täynnä leikkiä, naurua ja uusia ystävyyksiä Tanskassa.',
        cards: [
          { icon: 'heart',  title: 'Rakkaus & Hoiva',  text: 'Ympäröimme jokaisen lapsen lämmöllä ja turvallisuudella heti heidän saapuessaan Tanskaan.' },
          { icon: 'smile',  title: 'Ilo & Elämykset',  text: 'Tivoli, ranta, metsä — annamme lapsille muistoja, jotka kestävät koko elämän.' },
          { icon: 'shield', title: 'Turva & Toivo',    text: 'Hengähdystauko sodasta, jossa lapset voivat jälleen olla lapsia ja löytää rohkeutensa.' },
        ],
      },
      {
        id: 'how', type: 'how', visible: true,
        heading: 'Näin toimimme',
        steps: [
          { n: '01', title: 'Sinä lahjoitat',  text: 'Jokainen summa tekee eron. Lahjoituksesi menee suoraan matkan, majoituksen ja elämysten rahoittamiseen.' },
          { n: '02', title: 'Me järjestämme', text: 'Teemme yhteistyötä ukrainalaisten järjestöjen kanssa löytääksemme lapsia, jotka tarvitsevat eniten hengähdystaukoa.' },
          { n: '03', title: 'Lapset kokevat', text: 'Lapset tulevat Tanskaan ja saavat viikkoja täynnä leikkiä, luontoa, kulttuuria ja uusia ystävyyksiä.' },
          { n: '04', title: 'Toivo kasvaa',   text: 'Lapset palaavat kotiin uusilla voimilla, muistoilla ja uskolla siihen, että maailma on yhä hyvä.' },
        ],
      },
      {
        id: 'stats', type: 'stats', visible: true,
        heading: 'Vaikuttavuutemme',
        subtitle: 'Anteliaisuutenne ansiosta olemme jo tehneet valtavan eron.',
        imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=2069&auto=format&fit=crop',
        items: [
          { value: '127',    label: 'AUTETTUA LASTA' },
          { value: '42',     label: 'ELÄMYSRETKIÄ' },
          { value: '1 200+', label: 'LAHJOITTAJAA' },
          { value: '98%',    label: 'MENEE SUORAAN LAPSILLE' },
        ],
      },
      {
        id: 'about', type: 'about', visible: true,
        tagline: 'KEITÄ ME OLEMME',
        heading: 'Tietoa yhdistyksestä',
        text: 'European Association of Ukrainian Children – Nordic (EAUC Nordic) on perustettu itsenäiseksi, yleishyödylliseksi voittoa tavoittelemattomaksi yhdistykseksi Tanskaan. Työskentelemme ukrainalaislasten turvallisuuden, elämysten ja toivon eteen pohjoismaisilla oleskelujaksoilla.',
        cvr: '46329406', orgName: 'European Association of Ukrainian Children - Nordic',
        address: 'Byparken 75, 1. 1, 5700 Svendborg',
      },
      {
        id: 'board', type: 'board', visible: true,
        heading: 'Hallitus',
        members: [
          { name: 'Nimi tulossa', role: 'Puheenjohtaja',          photo: '' },
          { name: 'Nimi tulossa', role: 'Varapuheenjohtaja',      photo: '' },
          { name: 'Nimi tulossa', role: 'Rahastonhoitaja',        photo: '' },
          { name: 'Nimi tulossa', role: 'Hallituksen jäsen',      photo: '' },
        ],
      },
      {
        id: 'donate', type: 'donate', visible: true,
        heading: 'Tee lahjoitus tänään',
        subtitle: 'Jokainen summa tekee eron. Valitse summa alta tai lahjoita mitä voit.',
        amounts: [100, 250, 500, 1000],
        buttonLabel: 'Lahjoita nyt',
        note: 'Turvallinen maksu · Verovähennyskelpoinen · 100% läpinäkyvyys',
      },
    ],
  },

  it: {
    sections: [
      {
        id: 'hero', type: 'hero', visible: true,
        imageUrl: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=2069&auto=format&fit=crop',
        badge: 'RACCOLTA FONDI IN CORSO',
        heading: 'Ridona ai bambini ucraini',
        headingAccent: 'la loro infanzia',
        subtitle: 'Aiutaci a portare bambini ucraini in Danimarca — per avventure, sicurezza e la gioia di essere bambini di nuovo.',
        ctaLabel: 'Dona ora',
        ctaUrl: '#donér',
        cta2Label: 'Scopri di più',
        cta2Url: '#mission',
      },
      {
        id: 'mission', type: 'mission', visible: true,
        heading: 'La nostra missione',
        subtitle: "Dall'inizio della guerra, i bambini ucraini hanno perso la loro quotidianità, i loro amici e la loro infanzia. Vogliamo dare loro una pausa — piena di giochi, risate e nuove amicizie in Danimarca.",
        cards: [
          { icon: 'heart',  title: 'Amore & Cura',        text: 'Circondiamo ogni bambino con calore e sicurezza dal momento in cui arriva in Danimarca.' },
          { icon: 'smile',  title: 'Gioia & Esperienze',  text: 'Tivoli, la spiaggia, il bosco — regaliamo ai bambini ricordi che durano tutta la vita.' },
          { icon: 'shield', title: 'Sicurezza & Speranza',text: 'Una pausa dalla guerra, dove i bambini possono tornare a essere bambini e ritrovare il coraggio.' },
        ],
      },
      {
        id: 'how', type: 'how', visible: true,
        heading: 'Come lo facciamo',
        steps: [
          { n: '01', title: 'Tu doni',          text: 'Qualsiasi importo fa la differenza. La tua donazione va direttamente a finanziare viaggio, soggiorno ed esperienze.' },
          { n: '02', title: 'Noi organizziamo', text: 'Collaboriamo con organizzazioni ucraine per trovare i bambini che hanno più bisogno di una pausa.' },
          { n: '03', title: 'I bambini vivono', text: 'I bambini vengono in Danimarca e trascorrono settimane piene di giochi, natura, cultura e nuove amicizie.' },
          { n: '04', title: 'La speranza cresce', text: 'I bambini tornano a casa con nuove energie, ricordi e la convinzione che il mondo è ancora buono.' },
        ],
      },
      {
        id: 'stats', type: 'stats', visible: true,
        heading: 'Il nostro impatto',
        subtitle: 'Grazie alla vostra generosità, abbiamo già fatto un\'enorme differenza.',
        imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=2069&auto=format&fit=crop',
        items: [
          { value: '127',    label: 'BAMBINI AIUTATI' },
          { value: '42',     label: 'GITE ESPERIENZIALI' },
          { value: '1.200+', label: 'DONATORI' },
          { value: '98%',    label: 'VA DIRETTAMENTE AI BAMBINI' },
        ],
      },
      {
        id: 'about', type: 'about', visible: true,
        tagline: 'CHI SIAMO',
        heading: "Sull'associazione",
        text: "European Association of Ukrainian Children – Nordic (EAUC Nordic) è stata fondata come un'associazione indipendente, senza scopo di lucro in Danimarca. Lavoriamo per dare ai bambini ucraini sicurezza, esperienze e speranza attraverso soggiorni nei paesi nordici.",
        cvr: '46329406', orgName: 'European Association of Ukrainian Children - Nordic',
        address: 'Byparken 75, 1. 1, 5700 Svendborg',
      },
      {
        id: 'board', type: 'board', visible: true,
        heading: 'Il Consiglio',
        members: [
          { name: 'Nome in arrivo', role: 'Presidente',             photo: '' },
          { name: 'Nome in arrivo', role: 'Vicepresidente',         photo: '' },
          { name: 'Nome in arrivo', role: 'Tesoriere',              photo: '' },
          { name: 'Nome in arrivo', role: 'Membro del consiglio',   photo: '' },
        ],
      },
      {
        id: 'donate', type: 'donate', visible: true,
        heading: 'Fai un contributo oggi',
        subtitle: 'Qualsiasi importo fa la differenza. Scegli un importo qui sotto, o dona quello che puoi.',
        amounts: [100, 250, 500, 1000],
        buttonLabel: 'Dona ora',
        note: 'Pagamento sicuro · Deducibile fiscalmente · 100% trasparenza',
      },
    ],
  },

  es: {
    sections: [
      {
        id: 'hero', type: 'hero', visible: true,
        imageUrl: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=2069&auto=format&fit=crop',
        badge: 'RECAUDACIÓN EN MARCHA',
        heading: 'Devuelve a los niños ucranianos',
        headingAccent: 'su infancia',
        subtitle: 'Ayúdanos a traer niños ucranianos a Dinamarca — para aventuras, seguridad y la alegría de ser niño de nuevo.',
        ctaLabel: 'Donar ahora',
        ctaUrl: '#donér',
        cta2Label: 'Saber más',
        cta2Url: '#mission',
      },
      {
        id: 'mission', type: 'mission', visible: true,
        heading: 'Nuestra misión',
        subtitle: 'Desde el inicio de la guerra, los niños ucranianos han perdido su cotidianidad, sus amigos y su infancia. Queremos darles un respiro — lleno de juegos, risas y nuevas amistades en Dinamarca.',
        cards: [
          { icon: 'heart',  title: 'Amor & Cuidado',     text: 'Rodeamos a cada niño de calidez y seguridad desde el momento en que llegan a Dinamarca.' },
          { icon: 'smile',  title: 'Alegría & Experiencias', text: 'Tivoli, la playa, el bosque — damos a los niños recuerdos que duran toda la vida.' },
          { icon: 'shield', title: 'Seguridad & Esperanza', text: 'Un descanso de la guerra, donde los niños pueden volver a ser niños y recuperar el valor.' },
        ],
      },
      {
        id: 'how', type: 'how', visible: true,
        heading: 'Cómo lo hacemos',
        steps: [
          { n: '01', title: 'Tú donas',           text: 'Cualquier cantidad marca la diferencia. Tu donación va directamente a financiar el viaje, el alojamiento y las experiencias.' },
          { n: '02', title: 'Nosotros organizamos', text: 'Colaboramos con organizaciones ucranianas para encontrar a los niños que más necesitan un descanso.' },
          { n: '03', title: 'Los niños viven',    text: 'Los niños vienen a Dinamarca y pasan semanas llenas de juegos, naturaleza, cultura y nuevas amistades.' },
          { n: '04', title: 'La esperanza crece', text: 'Los niños vuelven a casa con nuevas fuerzas, recuerdos y la creencia de que el mundo todavía es bueno.' },
        ],
      },
      {
        id: 'stats', type: 'stats', visible: true,
        heading: 'Nuestro impacto',
        subtitle: 'Gracias a vuestra generosidad, ya hemos marcado una enorme diferencia.',
        imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=2069&auto=format&fit=crop',
        items: [
          { value: '127',    label: 'NIÑOS AYUDADOS' },
          { value: '42',     label: 'EXCURSIONES' },
          { value: '1.200+', label: 'DONANTES' },
          { value: '98%',    label: 'VA DIRECTAMENTE A LOS NIÑOS' },
        ],
      },
      {
        id: 'about', type: 'about', visible: true,
        tagline: 'QUIÉNES SOMOS',
        heading: 'Sobre la asociación',
        text: 'European Association of Ukrainian Children – Nordic (EAUC Nordic) fue fundada como una asociación independiente y sin ánimo de lucro en Dinamarca. Trabajamos para dar a los niños ucranianos seguridad, experiencias y esperanza a través de estancias en los países nórdicos.',
        cvr: '46329406', orgName: 'European Association of Ukrainian Children - Nordic',
        address: 'Byparken 75, 1. 1, 5700 Svendborg',
      },
      {
        id: 'board', type: 'board', visible: true,
        heading: 'La Junta',
        members: [
          { name: 'Nombre pendiente', role: 'Presidente',         photo: '' },
          { name: 'Nombre pendiente', role: 'Vicepresidente',     photo: '' },
          { name: 'Nombre pendiente', role: 'Tesorero',           photo: '' },
          { name: 'Nombre pendiente', role: 'Miembro de la junta', photo: '' },
        ],
      },
      {
        id: 'donate', type: 'donate', visible: true,
        heading: 'Haz una contribución hoy',
        subtitle: 'Cualquier cantidad marca la diferencia. Elige una cantidad a continuación o dona lo que puedas.',
        amounts: [100, 250, 500, 1000],
        buttonLabel: 'Donar ahora',
        note: 'Pago seguro · Deducible fiscalmente · 100% transparencia',
      },
    ],
  },
};

// ─── Contact form UI translations ────────────────────────────────────────────

export const CONTACT_UI: Record<Lang, ContactForm> = {
  da: { nameLabel: 'Navn', namePlaceholder: 'Dit fulde navn', emailLabel: 'E-mail', emailPlaceholder: 'din@email.dk', subjectLabel: 'Emne', subjectPlaceholder: 'Hvad drejer din henvendelse sig om?', messageLabel: 'Besked', messagePlaceholder: 'Skriv din besked her...', sendLabel: 'Send besked', successTitle: 'Tak for din besked!', successMessage: 'Vi vender tilbage hurtigst muligt.' },
  uk: { nameLabel: 'Ім\'я', namePlaceholder: 'Ваше повне ім\'я', emailLabel: 'E-mail', emailPlaceholder: 'ваш@email.ua', subjectLabel: 'Тема', subjectPlaceholder: 'Про що ваше звернення?', messageLabel: 'Повідомлення', messagePlaceholder: 'Напишіть ваше повідомлення...', sendLabel: 'Надіслати повідомлення', successTitle: 'Дякуємо за повідомлення!', successMessage: 'Ми відповімо вам якнайшвидше.' },
  en: { nameLabel: 'Name', namePlaceholder: 'Your full name', emailLabel: 'Email', emailPlaceholder: 'your@email.com', subjectLabel: 'Subject', subjectPlaceholder: 'What is your message about?', messageLabel: 'Message', messagePlaceholder: 'Write your message here...', sendLabel: 'Send message', successTitle: 'Thank you for your message!', successMessage: 'We will get back to you as soon as possible.' },
  de: { nameLabel: 'Name', namePlaceholder: 'Ihr vollständiger Name', emailLabel: 'E-Mail', emailPlaceholder: 'deine@email.de', subjectLabel: 'Betreff', subjectPlaceholder: 'Worum geht es in Ihrer Nachricht?', messageLabel: 'Nachricht', messagePlaceholder: 'Schreiben Sie Ihre Nachricht hier...', sendLabel: 'Nachricht senden', successTitle: 'Vielen Dank!', successMessage: 'Wir melden uns so schnell wie möglich.' },
  sv: { nameLabel: 'Namn', namePlaceholder: 'Ditt fullständiga namn', emailLabel: 'E-post', emailPlaceholder: 'din@email.se', subjectLabel: 'Ämne', subjectPlaceholder: 'Vad handlar ditt meddelande om?', messageLabel: 'Meddelande', messagePlaceholder: 'Skriv ditt meddelande här...', sendLabel: 'Skicka meddelande', successTitle: 'Tack för ditt meddelande!', successMessage: 'Vi återkommer till dig så snart som möjligt.' },
  no: { nameLabel: 'Navn', namePlaceholder: 'Ditt fulle navn', emailLabel: 'E-post', emailPlaceholder: 'din@email.no', subjectLabel: 'Emne', subjectPlaceholder: 'Hva handler meldingen din om?', messageLabel: 'Melding', messagePlaceholder: 'Skriv meldingen din her...', sendLabel: 'Send melding', successTitle: 'Takk for meldingen!', successMessage: 'Vi kontakter deg så snart som mulig.' },
  fi: { nameLabel: 'Nimi', namePlaceholder: 'Koko nimesi', emailLabel: 'Sähköposti', emailPlaceholder: 'sinun@email.fi', subjectLabel: 'Aihe', subjectPlaceholder: 'Mistä viestisi kertoo?', messageLabel: 'Viesti', messagePlaceholder: 'Kirjoita viestisi tähän...', sendLabel: 'Lähetä viesti', successTitle: 'Kiitos viestistäsi!', successMessage: 'Palaamme sinulle mahdollisimman pian.' },
  it: { nameLabel: 'Nome', namePlaceholder: 'Il tuo nome completo', emailLabel: 'Email', emailPlaceholder: 'tua@email.it', subjectLabel: 'Oggetto', subjectPlaceholder: 'Di cosa tratta il tuo messaggio?', messageLabel: 'Messaggio', messagePlaceholder: 'Scrivi il tuo messaggio qui...', sendLabel: 'Invia messaggio', successTitle: 'Grazie per il messaggio!', successMessage: 'Ti risponderemo il prima possibile.' },
  es: { nameLabel: 'Nombre', namePlaceholder: 'Tu nombre completo', emailLabel: 'Email', emailPlaceholder: 'tu@email.es', subjectLabel: 'Asunto', subjectPlaceholder: '¿De qué trata tu mensaje?', messageLabel: 'Mensaje', messagePlaceholder: 'Escribe tu mensaje aquí...', sendLabel: 'Enviar mensaje', successTitle: '¡Gracias por tu mensaje!', successMessage: 'Nos pondremos en contacto contigo pronto.' },
};

/** Returns translated content for the given language, falling back to Danish content. */
export function getTranslatedContent(lang: Lang, daContent: import('./site-content').SiteContent): import('./site-content').SiteContent {
  if (lang === 'da') return daContent;
  const translated = CONTENT_TRANSLATIONS[lang];
  if (!translated) return daContent;
  // Merge visibility and custom image overrides from Danish admin-saved content
  return {
    sections: translated.sections.map(ts => {
      const da = daContent.sections.find(s => s.id === ts.id);
      return da ? { ...ts, visible: da.visible } : ts;
    }),
  };
}
