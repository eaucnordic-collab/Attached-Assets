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
    paymentCard: string; paymentBank: string;
    cardTitle: string; cardSubtitle: string; oneTime: string; monthly: string;
    monthlyWhy: string; monthlyDescription: string; otherAmount: string; donate: string; perMonth: string;
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
      tagline: 'Vi forbinder mennesker, ressourcer og muligheder for Ukraine.',
      navTitle: 'Navigation', navMission: 'Mission', navHow: 'Vores arbejde', navAbout: 'Om os', navDonate: 'Donér', navContact: 'Kontakt',
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
      paymentCard: 'Kort', paymentBank: 'Bank',
      cardTitle: 'Kort / betalingskort', cardSubtitle: 'Støt med et engangsbeløb eller fast hver måned.',
      oneTime: 'Engangsbeløb', monthly: 'Månedligt',
      monthlyWhy: 'Derfor hjælper månedligt os mest', monthlyDescription: 'En fast månedlig donation betyder rigtig meget for os. Den gør det muligt at planlægge transport, indkøb af medicinsk udstyr og aktiviteter for børnene i god tid.',
      otherAmount: 'Andet beløb', donate: 'Donér', perMonth: '/ md',
      bankTitle: 'Bankoverførsel', bankSubtitle: 'Overfør direkte til vores konto.',
      bankName: 'Bank', bankRegistration: 'Reg.nr.', bankAccount: 'Kontonr.', bankIban: 'IBAN', bankSwift: 'SWIFT / BIC',
      copy: 'Kopiér', copied: 'Kopieret',
    },
    about: { orgStructure: 'Organisationsstruktur', nonprofitSub: 'Almennyttig forening · Danmark', boardTitle: 'Bestyrelse', boardSub: 'Strategisk ledelse', volunteerTitle: 'Frivillige', volunteerSub: 'Partnere og støtter', registrationTitle: 'Registreringsoplysninger', cvrLabel: 'CVR-NUMMER', nameLabel: 'FORENINGENS NAVN', addressLabel: 'ADRESSE' },
  },
  uk: {
    footer: { about: 'Про нас', contact: 'Контакт', privacy: 'Конфіденційність', copyright: '© 2026 EAUC Nordic. Усі права захищено.' },
    footerFull: {
      tagline: 'Поєднуємо людей, ресурси та можливості заради України.',
      navTitle: 'Навігація', navMission: 'Місія', navHow: 'Наша робота', navAbout: 'Про нас', navDonate: 'Пожертвувати', navContact: 'Контакти',
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
      paymentCard: 'Картка', paymentBank: 'Банк',
      cardTitle: 'Картка', cardSubtitle: 'Підтримайте нас одноразовим або щомісячним внеском.',
      oneTime: 'Одноразово', monthly: 'Щомісяця',
      monthlyWhy: 'Чому щомісячна підтримка особливо важлива', monthlyDescription: 'Регулярна пожертва допомагає нам заздалегідь планувати транспорт, закупівлю медичного обладнання та активності для дітей.',
      otherAmount: 'Інша сума', donate: 'Пожертвувати', perMonth: '/ міс.',
      bankTitle: 'Банківський переказ', bankSubtitle: 'Переказ безпосередньо на наш рахунок.',
      bankName: 'Банк', bankRegistration: 'Реєстр. номер', bankAccount: 'Номер рахунку', bankIban: 'IBAN', bankSwift: 'SWIFT / BIC',
      copy: 'Копіювати', copied: 'Скопійовано',
    },
    about: { orgStructure: 'Структура організації', nonprofitSub: 'Некомерційна організація · Данія', boardTitle: 'Правління', boardSub: 'Стратегічне керівництво', volunteerTitle: 'Волонтери', volunteerSub: 'Партнери та прихильники', registrationTitle: 'Реєстраційна інформація', cvrLabel: 'CVR-НОМЕР', nameLabel: 'НАЗВА ОРГАНІЗАЦІЇ', addressLabel: 'АДРЕСА' },
  },
  en: {
    footer: { about: 'About us', contact: 'Contact', privacy: 'Privacy policy', copyright: '© 2026 EAUC Nordic. All rights reserved.' },
    footerFull: {
      tagline: 'Connecting people, resources and opportunities for Ukraine.',
      navTitle: 'Navigation', navMission: 'Mission', navHow: 'Our work', navAbout: 'About us', navDonate: 'Donate', navContact: 'Contact',
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
      paymentCard: 'Card', paymentBank: 'Bank',
      cardTitle: 'Card payment', cardSubtitle: 'Support us with a one-time or monthly donation.',
      oneTime: 'One-time', monthly: 'Monthly',
      monthlyWhy: 'Why monthly support helps us most', monthlyDescription: 'A regular monthly donation helps us plan transport, medical equipment and activities for children well in advance.',
      otherAmount: 'Other amount', donate: 'Donate', perMonth: '/ mo.',
      bankTitle: 'Bank transfer', bankSubtitle: 'Transfer directly to our account.',
      bankName: 'Bank', bankRegistration: 'Reg. no.', bankAccount: 'Account no.', bankIban: 'IBAN', bankSwift: 'SWIFT / BIC',
      copy: 'Copy', copied: 'Copied',
    },
    about: { orgStructure: 'Organisational structure', nonprofitSub: 'Non-profit organisation · Denmark', boardTitle: 'Board', boardSub: 'Strategic leadership', volunteerTitle: 'Volunteers', volunteerSub: 'Partners and supporters', registrationTitle: 'Registration details', cvrLabel: 'CVR NUMBER', nameLabel: 'ORGANISATION NAME', addressLabel: 'ADDRESS' },
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
        badge: 'ПІДТРИМКА УКРАЇНИ ТРИВАЄ',
        heading: 'Разом для України',
        headingAccent: 'Від турботи до дії',
        subtitle: 'EAUC Nordic підтримує дітей, родини та всіх людей, котрі постраждали від війни, та допомагає українським громадам через цільову допомогу, надійні партнерства та співпрацю між Україною, Данією й іншими країнами Північної Європи.',
        ctaLabel: 'Пожертвувати',
        ctaUrl: '#donér',
        cta2Label: 'Дізнатися про нашу роботу',
        cta2Url: '#mission',
      },
      {
        id: 'mission', type: 'mission', visible: true,
        heading: 'Наша місія',
        subtitle: 'Місія EAUC Nordic – підтримувати людей, котрі постраждали від війни в Україні, з особливою увагою до дітей, родин і вразливих груп. Ми поєднуємо потреби українських громад із ресурсами, професійними знаннями та людською підтримкою Данії й інших країн Північної Європи. Разом із надійними партнерами ми розвиваємо гуманітарні, соціальні та відновлювальні ініціативи, що зміцнюють безпеку і довгострокове благополуччя.',
        cards: [
          { icon: 'heart',  title: 'Гідність і турбота', text: 'Ми ставимося до кожної людини з повагою та враховуємо її реальні потреби, життєві обставини й право на власний вибір.' },
          { icon: 'smile',  title: 'Відповідальне партнерство', text: 'Ми співпрацюємо з надійними організаціями, фахівцями та громадами в Україні, Данії й інших країнах Північної Європи.' },
          { icon: 'shield', title: 'Прозорість і тривалий вплив', text: 'Ми відповідально використовуємо ресурси, відстежуємо результати та зрозуміло пояснюємо, що саме стає можливим завдяки підтримці.' },
        ],
      },
      {
        id: 'how', type: 'how', visible: true,
        heading: 'Як ми працюємо',
        steps: [
          { n: '01', title: 'Ви підтримуєте', text: 'Кожна пожертва допомагає фінансувати перевірені програми, сформовані відповідно до документованих потреб.' },
          { n: '02', title: 'Ми слухаємо й координуємо', text: 'Разом з українськими партнерами ми визначаємо пріоритети, перевіряємо потреби та обираємо відповідний формат підтримки.' },
          { n: '03', title: 'Допомога надходить туди, де вона потрібна', text: 'Ми спрямовуємо ресурси на конкретні ініціативи для дітей, родин, вразливих людей, установ і громад.' },
          { n: '04', title: 'Ми звітуємо', text: 'Ми публікуємо результати, оновлення про проєкти та фінансову інформацію, щоб підтримка залишалася прозорою.' },
        ],
      },
      {
        id: 'stats', type: 'stats', visible: true,
        heading: 'Наші результати',
        subtitle: 'Ми публікуємо перевірені результати проєктів, історії партнерств і фінансову звітність, щоб кожен доброчинець бачив, як використовується підтримка.',
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
        tagline: 'ПРО НАС',
        heading: 'Про нас',
        text: 'European Association of Ukrainian Children - Nordic (EAUC Nordic) – незалежна неприбуткова асоціація, зареєстрована в Данії. Діти залишаються одним із ключових пріоритетів нашої роботи, водночас ми розширюємо підтримку на родини, вразливих дорослих, людей старшого віку, людей з інвалідністю, місцеві установи та громади, які постраждали від війни в Україні. Ми поєднуємо конкретні потреби в Україні з ресурсами, знаннями та небайдужістю людей і організацій у Данії та інших країнах Північної Європи.',
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
        heading: 'Підтримайте нашу роботу',
        subtitle: 'Кожна пожертва допомагає втілювати відповідальні програми відповідно до реальних потреб. Оберіть суму або підтримайте нас довільним внеском.',
        amounts: [100, 250, 500, 1000],
        buttonLabel: 'Пожертвувати 250 DKK',
        note: 'Пожертви безпечно обробляються через Stripe. Перегляньте наші звіти, щоб дізнатися, як використовуються кошти.',
      },
      {
        id: 'news', type: 'news', visible: true,
        heading: 'Новини та звіти',
        subtitle: 'Читайте про наші проєкти, партнерства та результати роботи в Україні, Данії й інших країнах Північної Європи.',
        items: [],
      },
      {
        id: 'contact', type: 'contact', visible: true,
        heading: 'Контакти та волонтерство',
        subtitle: 'Маєте запитання, хочете стати волонтером або запропонувати партнерство? Напишіть нам – ми будемо раді поспілкуватися.',
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
        badge: 'SUPPORT FOR UKRAINE CONTINUES',
        heading: 'Together for Ukraine',
        headingAccent: 'Turning care into action',
        subtitle: 'EAUC Nordic supports children, families and other people affected by the war, while strengthening Ukrainian communities through targeted assistance, trusted partnerships and cooperation between Ukraine, Denmark and the wider Nordic region.',
        ctaLabel: 'Donate',
        ctaUrl: '#donér',
        cta2Label: 'Learn about our work',
        cta2Url: '#mission',
      },
      {
        id: 'mission', type: 'mission', visible: true,
        heading: 'Our mission',
        subtitle: 'EAUC Nordic supports people affected by the war in Ukraine, with particular attention to children, families and vulnerable groups. We connect the needs of Ukrainian communities with resources, professional expertise and human support from Denmark and the wider Nordic region. Together with trusted partners, we develop humanitarian, social and recovery initiatives that strengthen safety, dignity and long-term wellbeing.',
        cards: [
          { icon: 'heart', title: 'Dignity and care', text: 'We treat every person with respect and respond to their real needs, circumstances and right to make their own choices.' },
          { icon: 'smile', title: 'Responsible partnership', text: 'We work with trusted organisations, professionals and communities in Ukraine, Denmark and across the Nordic region.' },
          { icon: 'shield', title: 'Transparency and lasting impact', text: 'We use resources responsibly, monitor results and explain clearly what becomes possible through your support.' },
        ],
      },
      {
        id: 'how', type: 'how', visible: true,
        heading: 'How we work',
        steps: [
          { n: '01', title: 'You support', text: 'Every donation helps fund verified programmes shaped around documented needs.' },
          { n: '02', title: 'We listen and coordinate', text: 'Together with Ukrainian partners, we set priorities, verify needs and select the most appropriate form of support.' },
          { n: '03', title: 'Support reaches where it is needed', text: 'We direct resources to specific initiatives for children, families, vulnerable people, institutions and communities.' },
          { n: '04', title: 'We report', text: 'We publish results, project updates and financial information so that our work remains transparent.' },
        ],
      },
      {
        id: 'stats', type: 'stats', visible: true,
        heading: 'Our impact',
        subtitle: 'We publish verified project results, partnership stories and financial reports so that every supporter can see how their contribution is used.',
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
        tagline: 'ABOUT US',
        heading: 'About us',
        text: 'European Association of Ukrainian Children - Nordic (EAUC Nordic) is an independent non-profit association registered in Denmark. Children remain one of the central priorities of our work, while our support is expanding to include families, vulnerable adults, older people, people with disabilities, local institutions and communities affected by the war in Ukraine. We connect specific needs in Ukraine with resources, knowledge and committed people and organisations in Denmark and across the Nordic region.',
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
        heading: 'Support our work',
        subtitle: 'Every donation helps us deliver responsible programmes based on real needs. Choose an amount below or give what you can.',
        amounts: [100, 250, 500, 1000],
        buttonLabel: 'Donate DKK 250',
        note: 'Donations are processed securely through Stripe. See our reports for information about how funds are used.',
      },
      {
        id: 'news', type: 'news', visible: true,
        heading: 'News and reports',
        subtitle: 'Read about our projects, partnerships and results in Ukraine, Denmark and across the Nordic region.',
        items: [],
      },
      {
        id: 'contact', type: 'contact', visible: true,
        heading: 'Contact and volunteering',
        subtitle: 'Have a question, want to volunteer or would like to explore a partnership? Get in touch – we would be glad to hear from you.',
        email: 'info@eaucnordic.com',
        phone: '+45 25 56 81 31',
      },
    ],
  },






};

// ─── Nav translations ─────────────────────────────────────────────────────────

export type NavUI = {
  mission: string; work: string; about: string; contact: string; news: string; donateNow: string;
};

export const NAV_UI: Record<Lang, NavUI> = {
  da: { mission: 'Mission', work: 'Vores arbejde', about: 'Om os', contact: 'Kontakt', news: 'Nyheder', donateNow: 'Donér' },
  uk: { mission: 'Місія', work: 'Наша робота', about: 'Про нас', contact: 'Контакти', news: 'Новини', donateNow: 'Пожертвувати' },
  en: { mission: 'Mission', work: 'Our work', about: 'About us', contact: 'Contact', news: 'News', donateNow: 'Donate' },
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
    volunteerText: 'Vi søger engagerede frivillige, der kan bidrage til programmer, logistik, kommunikation, arrangementer, faglig rådgivning og andre dele af vores arbejde.',
    volunteerLink: 'Kontakt os om frivilligt arbejde', volunteerSubject: 'Frivilligt arbejde',
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
    volunteerText: 'Ми шукаємо відповідальних людей, готових допомагати з програмами, логістикою, комунікацією, заходами, професійною експертизою та іншими напрямами роботи.',
    volunteerLink: 'Написати нам про волонтерство', volunteerSubject: 'Волонтерство',
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
    volunteerText: 'We welcome responsible volunteers who can support programmes, logistics, communications, events, professional expertise and other areas of our work.',
    volunteerLink: 'Contact us about volunteering', volunteerSubject: 'Volunteering',
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
