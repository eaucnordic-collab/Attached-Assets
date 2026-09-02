// ─── Language definitions ─────────────────────────────────────────────────────

export type Lang = 'da' | 'uk' | 'en';

export const LANGUAGES: { code: Lang; flag: string; label: string }[] = [
  { code: 'da', flag: 'DK', label: 'Dansk'      },
  { code: 'uk', flag: 'UA', label: 'Українська' },
  { code: 'en', flag: 'GB', label: 'English'    },
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
  sendAnother: string;
  infoTitle: string; phoneLabel: string; addressLabel: string;
  volunteerTitle: string; volunteerText: string; volunteerLink: string; volunteerSubject: string;
};

export type UI = {
  footer: { about: string; contact: string; privacy: string; copyright: string };
  footerFull: FooterFull;
  donate: {
    paymentBank: string;
    bankTitle: string; bankSubtitle: string;
    bankName: string; bankRegistration: string; bankAccount: string; bankIban: string; bankSwift: string;
    copy: string; copied: string;
  };
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
    donate: {
      paymentBank: 'Bank',
      bankTitle: 'Bankoverførsel', bankSubtitle: 'Overfør direkte til vores konto.',
      bankName: 'Bank', bankRegistration: 'Reg.nr.', bankAccount: 'Kontonr.', bankIban: 'IBAN', bankSwift: 'SWIFT / BIC',
      copy: 'Kopiér', copied: 'Kopieret',
    },
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
    donate: {
      paymentBank: 'Банк',
      bankTitle: 'Банківський переказ', bankSubtitle: 'Переказ безпосередньо на наш рахунок.',
      bankName: 'Банк', bankRegistration: 'Реєстр. номер', bankAccount: 'Номер рахунку', bankIban: 'IBAN', bankSwift: 'SWIFT / BIC',
      copy: 'Копіювати', copied: 'Скопійовано',
    },
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
    donate: {
      paymentBank: 'Bank',
      bankTitle: 'Bank transfer', bankSubtitle: 'Transfer directly to our account.',
      bankName: 'Bank', bankRegistration: 'Reg. no.', bankAccount: 'Account no.', bankIban: 'IBAN', bankSwift: 'SWIFT / BIC',
      copy: 'Copy', copied: 'Copied',
    },
    about: { orgStructure: 'Organisational structure', nonprofitSub: 'Non-profit organisation · Denmark', boardTitle: 'Board of Directors', boardSub: 'Strategic leadership', volunteerTitle: 'Volunteers', volunteerSub: 'Host families & supporters', registrationTitle: 'Registration details', cvrLabel: 'CVR NUMBER', nameLabel: 'ORGANISATION NAME', addressLabel: 'ADDRESS' },
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
          { name: 'Serhieiev Volodymyr', role: 'Голова',           photo: '' },
          { name: 'Khoren Pogossian',    role: 'Заступник голови', photo: '' },
          { name: 'Імʼя буде',           role: 'Скарбник',         photo: '' },
          { name: 'Імʼя буде',           role: 'Член ради',        photo: '' },
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
      {
        id: 'news', type: 'news', visible: true,
        heading: 'Новини та звіти',
        subtitle: 'Стежте за нашою роботою і дивіться, що дозволяють ваші пожертвування.',
        items: [],
      },
      {
        id: 'contact', type: 'contact', visible: true,
        heading: 'Звʼяжіться з нами',
        subtitle: 'Маєте питання, хочете волонтерити або співпрацювати? Ми раді почути від вас.',
        email: 'info@eaucnordic.com',
        phone: '+45 25 56 81 31',
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
          { name: 'Serhieiev Volodymyr', role: 'Chairman',      photo: '' },
          { name: 'Khoren Pogossian',    role: 'Vice-chairman', photo: '' },
          { name: 'Name pending',        role: 'Treasurer',     photo: '' },
          { name: 'Name pending',        role: 'Board member',  photo: '' },
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
      {
        id: 'news', type: 'news', visible: true,
        heading: 'News & Reports',
        subtitle: 'Follow our work and see what your donations make possible.',
        items: [],
      },
      {
        id: 'contact', type: 'contact', visible: true,
        heading: 'Contact us',
        subtitle: 'Have a question, want to volunteer, or wish to collaborate? We would love to hear from you.',
        email: 'info@eaucnordic.com',
        phone: '+45 25 56 81 31',
      },
    ],
  },






};

// ─── Nav translations ─────────────────────────────────────────────────────────

export type NavUI = {
  mission: string; about: string; contact: string; news: string; donateNow: string;
};

export const NAV_UI: Record<Lang, NavUI> = {
  da: { mission: 'mission', about: 'om os',         contact: 'kontakt',        news: 'nyheder',       donateNow: 'Donér nu' },
  uk: { mission: 'місія',   about: 'про нас',        contact: 'контакт',        news: 'новини',        donateNow: 'Донувати' },
  en: { mission: 'mission', about: 'about us',       contact: 'contact',        news: 'news',          donateNow: 'Donate now' },
};

// ─── Contact form UI translations ────────────────────────────────────────────

export const CONTACT_UI: Record<Lang, ContactForm> = {
  da: {
    nameLabel: 'Navn', namePlaceholder: 'Dit fulde navn',
    emailLabel: 'E-mail', emailPlaceholder: 'din@email.dk',
    subjectLabel: 'Emne', subjectPlaceholder: 'Hvad drejer din henvendelse sig om?',
    messageLabel: 'Besked', messagePlaceholder: 'Skriv din besked her...',
    sendLabel: 'Send besked', successTitle: 'Tak for din besked!', successMessage: 'Vi vender tilbage hurtigst muligt.',
    sendAnother: 'Send en ny besked',
    infoTitle: 'Kontaktoplysninger', phoneLabel: 'Telefon', addressLabel: 'Adresse',
    volunteerTitle: 'Bliv frivillig',
    volunteerText: 'Vi søger altid engagerede frivillige, der vil gøre en forskel for ukrainske børn.',
    volunteerLink: 'Skriv til os om frivillighed →', volunteerSubject: 'Frivillig',
  },
  uk: {
    nameLabel: 'Імʼя', namePlaceholder: 'Ваше повне імʼя',
    emailLabel: 'E-mail', emailPlaceholder: 'ваш@email.ua',
    subjectLabel: 'Тема', subjectPlaceholder: 'Про що ваше звернення?',
    messageLabel: 'Повідомлення', messagePlaceholder: 'Напишіть ваше повідомлення...',
    sendLabel: 'Надіслати повідомлення', successTitle: 'Дякуємо за повідомлення!', successMessage: 'Ми відповімо вам якнайшвидше.',
    sendAnother: 'Надіслати нове повідомлення',
    infoTitle: 'Контактна інформація', phoneLabel: 'Телефон', addressLabel: 'Адреса',
    volunteerTitle: 'Стати волонтером',
    volunteerText: 'Ми завжди шукаємо небайдужих волонтерів, які хочуть змінити життя українських дітей.',
    volunteerLink: 'Напишіть нам про волонтерство →', volunteerSubject: 'Волонтер',
  },
  en: {
    nameLabel: 'Name', namePlaceholder: 'Your full name',
    emailLabel: 'Email', emailPlaceholder: 'your@email.com',
    subjectLabel: 'Subject', subjectPlaceholder: 'What is your message about?',
    messageLabel: 'Message', messagePlaceholder: 'Write your message here...',
    sendLabel: 'Send message', successTitle: 'Thank you for your message!', successMessage: 'We will get back to you as soon as possible.',
    sendAnother: 'Send another message',
    infoTitle: 'Contact information', phoneLabel: 'Phone', addressLabel: 'Address',
    volunteerTitle: 'Become a volunteer',
    volunteerText: 'We are always looking for committed volunteers who want to make a difference for Ukrainian children.',
    volunteerLink: 'Write to us about volunteering →', volunteerSubject: 'Volunteer',
  },
};

/** Returns translated content for the given language, falling back to Danish content. */
export function getTranslatedContent(lang: Lang, daContent: import('./site-content').SiteContent): import('./site-content').SiteContent {
  if (lang === 'da') return daContent;
  const translated = CONTENT_TRANSLATIONS[lang];
  if (!translated) return daContent;
  // Build a lookup of translated sections
  const translatedMap = new Map(translated.sections.map(s => [s.id, s]));
  // Iterate over ALL Danish sections so nothing is lost;
  // use the translated version when available, otherwise fall back to Danish.
  return {
    sections: daContent.sections.map(daSection => {
      const ts = translatedMap.get(daSection.id);
      if (!ts) return daSection; // no translation → show Danish

       if (ts.type === 'donate' && daSection.type === 'donate') {
         return { ...daSection, ...ts, visible: daSection.visible };
       }

      // News items are content (not UI labels) — always use the Danish items
      // so articles appear on every language. Only heading/subtitle is translated.
      if (ts.type === 'news' && daSection.type === 'news') {
        return {
          ...ts,
          items: (daSection as import('./site-content').NewsSection).items,
          visible: daSection.visible,
        };
      }

      return { ...ts, visible: daSection.visible };
    }),
  };
}
