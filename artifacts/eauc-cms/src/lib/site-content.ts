// ─── Types ────────────────────────────────────────────────────────────────────

export type CardItem   = { icon: 'heart' | 'smile' | 'shield'; title: string; text: string };
export type StepItem   = { n: string; title: string; text: string };
export type StatItem   = { value: string; label: string };
export type MemberItem = { name: string; role: string; photo: string };
export type NewsItem   = { id: string; title: string; date: string; text: string; imageUrl: string; tag: string };

export type SectionBase = { id: string; visible: boolean };

export type HeroSection    = SectionBase & { type: 'hero';    imageUrl: string; badge: string; heading: string; headingAccent: string; subtitle: string; ctaLabel: string; ctaUrl: string; cta2Label: string; cta2Url: string };
export type MissionSection = SectionBase & { type: 'mission'; heading: string; subtitle: string; cards: CardItem[] };
export type HowSection     = SectionBase & { type: 'how';     heading: string; steps: StepItem[] };
export type StatsSection   = SectionBase & { type: 'stats';   heading: string; subtitle: string; imageUrl: string; items: StatItem[] };
export type AboutSection   = SectionBase & { type: 'about';   tagline: string; heading: string; text: string; cvr: string; orgName: string; address: string };
export type BoardSection   = SectionBase & { type: 'board';   heading: string; members: MemberItem[] };
export type DonateSection  = SectionBase & {
  type: 'donate';
  heading: string;
  subtitle: string;
  amounts: number[];
  buttonLabel: string;
  note: string;
  bankName?: string;
  bankRegistration?: string;
  bankAccount?: string;
  bankIban?: string;
  bankSwift?: string;
};
export type TextSection    = SectionBase & { type: 'text';    heading: string; text: string; background: 'cream' | 'white' | 'navy' };
export type NewsSection    = SectionBase & { type: 'news';    heading: string; subtitle: string; items: NewsItem[] };
export type ContactSection = SectionBase & { type: 'contact'; heading: string; subtitle: string; email: string; phone: string };
export type FooterLocaleContent = {
  tagline: string; followUs: string; navTitle: string;
  navMission: string; navHow: string; navAbout: string; navDonate: string; navContact: string;
  contactTitle: string; address: string; legalTitle: string; registeredAs: string;
  taxNote: string; transparencyNote: string; privacyLabel: string; cookiesLabel: string; copyright: string;
};
export type FooterSection = SectionBase & {
  type: 'footer';
  logoUrl: string; email: string; cvr: string;
  facebookUrl: string; instagramUrl: string; privacyUrl: string; cookiesUrl: string;
  locales: { da: FooterLocaleContent; uk: FooterLocaleContent; en: FooterLocaleContent };
};

export type AnySection =
  | HeroSection | MissionSection | HowSection | StatsSection
  | AboutSection | BoardSection | DonateSection | TextSection
  | NewsSection | ContactSection | FooterSection;

export type SiteContent = { sections: AnySection[]; copyRevision?: number };

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_CONTENT: SiteContent = {
  copyRevision: 2,
  sections: [
    {
      id: 'hero', type: 'hero', visible: true,
      imageUrl: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=2069&auto=format&fit=crop',
      badge: 'STØTTEN TIL UKRAINE FORTSÆTTER',
      heading: 'Sammen for Ukraine',
      headingAccent: 'Fra omsorg til handling',
      subtitle: 'EAUC Nordic støtter børn, familier og andre, der er berørt af krigen, og styrker ukrainske lokalsamfund gennem målrettet hjælp, pålidelige partnerskaber og samarbejde mellem Ukraine, Danmark og resten af Norden.',
      ctaLabel: 'Donér',
      ctaUrl: '#donér',
      cta2Label: 'Læs om vores arbejde',
      cta2Url: '#mission',
    },
    {
      id: 'mission', type: 'mission', visible: true,
      heading: 'Vores mission',
      subtitle: 'EAUC Nordic støtter mennesker, der er berørt af krigen i Ukraine, med særlig fokus på børn, familier og udsatte grupper. Vi forbinder behovene i ukrainske lokalsamfund med ressourcer, faglig viden og menneskelig støtte fra Danmark og resten af Norden. Sammen med pålidelige partnere gennemfører vi humanitære, sociale og genopbyggende initiativer, der styrker tryghed, værdighed og langsigtet trivsel.',
      cards: [
        { icon: 'heart',  title: 'Værdighed og omsorg',  text: 'Vi møder hvert enkelt menneske med respekt og tager udgangspunkt i reelle behov, livssituationer og retten til at træffe egne valg.' },
        { icon: 'smile',  title: 'Ansvarligt partnerskab',  text: 'Vi samarbejder med pålidelige organisationer, fagpersoner og lokalsamfund i Ukraine, Danmark og resten af Norden.' },
        { icon: 'shield', title: 'Åbenhed og varig effekt', text: 'Vi anvender ressourcer ansvarligt, følger resultaterne og forklarer tydeligt, hvad støtten gør muligt.' },
      ],
    },
    {
      id: 'how', type: 'how', visible: true,
      heading: 'Sådan arbejder vi',
      steps: [
        { n: '01', title: 'Du støtter', text: 'Hver donation er med til at finansiere kvalitetssikrede indsatser, der bygger på dokumenterede behov.' },
        { n: '02', title: 'Vi lytter og koordinerer', text: 'Sammen med ukrainske partnere fastlægger vi prioriteter, verificerer behov og vælger den mest relevante form for støtte.' },
        { n: '03', title: 'Støtten når frem, hvor den er nødvendig', text: 'Vi målretter ressourcer til konkrete indsatser for børn, familier, udsatte mennesker, institutioner og lokalsamfund.' },
        { n: '04', title: 'Vi følger op og rapporterer', text: 'Vi offentliggør resultater, projektopdateringer og økonomiske oplysninger, så vores arbejde forbliver gennemsigtigt.' },
      ],
    },
    {
      id: 'stats', type: 'stats', visible: true,
      heading: 'Vores resultater',
      subtitle: 'Vi offentliggør dokumenterede projektresultater, historier om partnerskaber og økonomiske rapporter, så alle støtter kan se, hvordan deres bidrag bliver anvendt.',
      imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=2069&auto=format&fit=crop',
      items: [
        { value: '127',     label: 'BØRN HJULPET' },
        { value: '42',      label: 'OPLEVELSESTURE' },
        { value: '1.200+',  label: 'DONORER' },
        { value: '98%',     label: 'GÅR DIREKTE TIL BØRNENE' },
      ],
    },
    {
      id: 'news', type: 'news', visible: true,
      heading: 'Nyheder og rapporter',
      subtitle: 'Læs om vores projekter, partnerskaber og resultater i Ukraine, Danmark og resten af Norden.',
      items: [
        {
          id: 'news_1',
          title: 'Sommerlejr 2025: 34 børn fik en uforglemmelig uge',
          date: 'August 2025',
          text: 'I august tog vi imod 34 ukrainske børn i alderen 7–14 år. De besøgte Tivoli, Naturhistorisk Museum og tilbragte dage ved havet — minder de vil bære med sig hjem.',
          imageUrl: 'https://images.unsplash.com/photo-1526976668912-1a811878dd37?q=80&w=2070&auto=format&fit=crop',
          tag: 'Rapport',
        },
        {
          id: 'news_2',
          title: 'Ny partnerskabsaftale med ukrainsk børneorganisation',
          date: 'Juni 2025',
          text: 'EAUC Nordic har indgået et formelt samarbejde med "Сонячний дім" fra Lviv, der hjælper os med at identificere de børn, der har mest brug for et pusterum.',
          imageUrl: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=2070&auto=format&fit=crop',
          tag: 'Nyhed',
        },
        {
          id: 'news_3',
          title: 'Årsrapport 2024: 127 børn hjulpet, 98% til børnene',
          date: 'Januar 2025',
          text: 'Vores årsrapport for 2024 er nu tilgængelig. Vi er stolte over resultaterne og klar til endnu et år fyldt med håb, oplevelser og kærlighed.',
          imageUrl: 'https://images.unsplash.com/photo-1536094908688-b0b7e8a57e60?q=80&w=2070&auto=format&fit=crop',
          tag: 'Årsrapport',
        },
      ],
    },
    {
      id: 'about', type: 'about', visible: true,
      tagline: 'OM OS',
      heading: 'Om os',
      text: 'European Association of Ukrainian Children - Nordic (EAUC Nordic) er en uafhængig non-profit forening registreret i Danmark. Børn er fortsat en af de centrale prioriteter i vores arbejde, samtidig med at støtten udvides til familier, udsatte voksne, ældre, mennesker med handicap samt lokale institutioner og lokalsamfund, der er berørt af krigen i Ukraine. Vi forbinder konkrete behov i Ukraine med ressourcer, viden og engagerede mennesker og organisationer i Danmark og resten af Norden.',
      cvr: '46329406',
      orgName: 'European Association of Ukrainian Children - Nordic',
      address: 'Byparken 75, 1. 1, 5700 Svendborg',
    },
    {
      id: 'board', type: 'board', visible: true,
      heading: 'Bestyrelsen',
      members: [
        { name: 'Serhieiev Volodymyr', role: 'Formand',     photo: '' },
        { name: 'Khoren Pogossian',   role: 'Næstformand', photo: '' },
        { name: 'Navn kommer', role: 'Kasserer',            photo: '' },
        { name: 'Navn kommer', role: 'Bestyrelsesmedlem',   photo: '' },
      ],
    },
    {
      id: 'donate', type: 'donate', visible: true,
      heading: 'Støt vores arbejde',
      subtitle: 'Hver donation hjælper os med at gennemføre ansvarlige indsatser baseret på reelle behov. Vælg et beløb nedenfor, eller giv det, du kan.',
      amounts: [100, 250, 500, 1000],
      buttonLabel: 'Donér 250 DKK',
      note: 'Donationer behandles sikkert via Stripe. Se vores rapporter for information om, hvordan midlerne anvendes.',
      bankName: 'Danske Bank',
      bankRegistration: '9570',
      bankAccount: '14146679',
      bankIban: 'DK2630000014146679',
      bankSwift: 'DABADKKK',
    },
    {
      id: 'contact', type: 'contact', visible: true,
      heading: 'Kontakt og frivillighed',
      subtitle: 'Har du spørgsmål, ønsker du at blive frivillig, eller vil du drøfte et muligt partnerskab? Kontakt os – vi hører gerne fra dig.',
      email: 'info@eaucnordic.com',
      phone: '+45 25 56 81 31',
    },
    {
      id: 'footer', type: 'footer', visible: true,
      logoUrl: '/logo.png',
      email: 'info@eaucnordic.com',
      cvr: '46329406',
      facebookUrl: 'https://www.facebook.com/profile.php?id=61592491217605',
      instagramUrl: 'https://www.instagram.com/eaucnordic/',
      privacyUrl: '#',
      cookiesUrl: '#',
      locales: {
        da: {
          tagline: 'Vi forbinder mennesker, ressourcer og muligheder for Ukraine.',
          followUs: 'Følg os', navTitle: 'Navigation', navMission: 'Mission', navHow: 'Vores arbejde',
          navAbout: 'Om os', navDonate: 'Donér', navContact: 'Kontakt', contactTitle: 'Kontakt os',
          address: 'Byparken 75, 1. 1\n5700 Svendborg\nDanmark', legalTitle: 'Juridisk information',
          registeredAs: 'Registreret som almennyttig, non-profit forening i Danmark',
          taxNote: '🇩🇰 Donationer er fradragsberettigede iht. ligningslovens § 8A',
          transparencyNote: '98% af alle midler går direkte til børnene',
          privacyLabel: 'Privatlivspolitik', cookiesLabel: 'Cookiepolitik',
          copyright: '© 2026 European Association of Ukrainian Children – Nordic (EAUC Nordic) · CVR 46329406',
        },
        uk: {
          tagline: 'Поєднуємо людей, ресурси та можливості заради України.',
          followUs: 'Слідкуйте за нами', navTitle: 'Навігація', navMission: 'Місія', navHow: 'Наша робота',
          navAbout: 'Про нас', navDonate: 'Пожертвувати', navContact: 'Контакти', contactTitle: 'Звʼяжіться з нами',
          address: 'Byparken 75, 1. 1\n5700 Svendborg\nДанія', legalTitle: 'Юридична інформація',
          registeredAs: 'Зареєстровано як некомерційна організація в Данії',
          taxNote: '🇩🇰 Пожертвування підлягають податковому вирахуванню в Данії',
          transparencyNote: '98% усіх коштів іде безпосередньо дітям',
          privacyLabel: 'Політика конфіденційності', cookiesLabel: 'Політика cookies',
          copyright: '© 2026 European Association of Ukrainian Children – Nordic (EAUC Nordic) · CVR 46329406',
        },
        en: {
          tagline: 'Connecting people, resources and opportunities for Ukraine.',
          followUs: 'Follow us', navTitle: 'Navigation', navMission: 'Mission', navHow: 'Our work',
          navAbout: 'About us', navDonate: 'Donate', navContact: 'Contact', contactTitle: 'Get in touch',
          address: 'Byparken 75, 1. 1\n5700 Svendborg\nDenmark', legalTitle: 'Legal information',
          registeredAs: 'Registered as a non-profit organisation in Denmark',
          taxNote: '🇩🇰 Donations are tax-deductible in Denmark',
          transparencyNote: '98% of all funds go directly to the children',
          privacyLabel: 'Privacy policy', cookiesLabel: 'Cookie policy',
          copyright: '© 2026 European Association of Ukrainian Children – Nordic (EAUC Nordic) · CVR 46329406',
        },
      },
    },
  ],
};

// ─── Storage helpers ──────────────────────────────────────────────────────────

const KEY = 'eauc_site_content_v1';
const CURRENT_COPY_REVISION = 2;

function applyCurrentCopy(content: SiteContent): SiteContent {
  if ((content.copyRevision ?? 0) >= CURRENT_COPY_REVISION) return content;
  const defaults = new Map(DEFAULT_CONTENT.sections.map(section => [section.id, section]));

  const sections = content.sections.map(section => {
    const source = defaults.get(section.id);
    if (!source || source.type !== section.type) return section;

    switch (section.type) {
      case 'hero': {
        const copy = source as HeroSection;
        return { ...section, badge: copy.badge, heading: copy.heading, headingAccent: copy.headingAccent, subtitle: copy.subtitle, ctaLabel: copy.ctaLabel, cta2Label: copy.cta2Label };
      }
      case 'mission': {
        const copy = source as MissionSection;
        return { ...section, heading: copy.heading, subtitle: copy.subtitle, cards: copy.cards };
      }
      case 'how': {
        const copy = source as HowSection;
        return { ...section, heading: copy.heading, steps: copy.steps };
      }
      case 'stats': {
        const copy = source as StatsSection;
        return { ...section, heading: copy.heading, subtitle: copy.subtitle };
      }
      case 'news': {
        const copy = source as NewsSection;
        return { ...section, heading: copy.heading, subtitle: copy.subtitle };
      }
      case 'about': {
        const copy = source as AboutSection;
        return { ...section, tagline: copy.tagline, heading: copy.heading, text: copy.text };
      }
      case 'donate': {
        const copy = source as DonateSection;
        return { ...section, heading: copy.heading, subtitle: copy.subtitle, buttonLabel: copy.buttonLabel, note: copy.note };
      }
      case 'contact': {
        const copy = source as ContactSection;
        return { ...section, heading: copy.heading, subtitle: copy.subtitle };
      }
      case 'footer': {
        const copy = source as FooterSection;
        return {
          ...section,
          locales: {
            da: { ...section.locales.da, tagline: copy.locales.da.tagline, navMission: copy.locales.da.navMission, navHow: copy.locales.da.navHow, navAbout: copy.locales.da.navAbout, navDonate: copy.locales.da.navDonate, navContact: copy.locales.da.navContact },
            uk: { ...section.locales.uk, tagline: copy.locales.uk.tagline, navMission: copy.locales.uk.navMission, navHow: copy.locales.uk.navHow, navAbout: copy.locales.uk.navAbout, navDonate: copy.locales.uk.navDonate, navContact: copy.locales.uk.navContact },
            en: { ...section.locales.en, tagline: copy.locales.en.tagline, navMission: copy.locales.en.navMission, navHow: copy.locales.en.navHow, navAbout: copy.locales.en.navAbout, navDonate: copy.locales.en.navDonate, navContact: copy.locales.en.navContact },
          },
        };
      }
      default:
        return section;
    }
  });

  return { ...content, sections, copyRevision: CURRENT_COPY_REVISION };
}

export function loadSiteContent(): SiteContent {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const original = JSON.parse(raw) as SiteContent;
      const parsed = applyCurrentCopy(original);
      let dirty = parsed !== original;

      // Migrate: add news/contact/footer sections if missing
      const hasNews    = parsed.sections.some(s => s.type === 'news');
      const hasContact = parsed.sections.some(s => s.type === 'contact');
      const hasFooter  = parsed.sections.some(s => s.type === 'footer');
      if (!hasNews || !hasContact || !hasFooter) {
        const extras = DEFAULT_CONTENT.sections.filter(s =>
          (s.type === 'news' && !hasNews) || (s.type === 'contact' && !hasContact) || (s.type === 'footer' && !hasFooter)
        );
        parsed.sections = [...parsed.sections, ...extras];
        dirty = true;
      }

      // Migrate: update board member placeholder names to real names
      const defaultBoard = DEFAULT_CONTENT.sections.find(s => s.type === 'board') as BoardSection | undefined;
      if (defaultBoard) {
        parsed.sections = parsed.sections.map(s => {
          if (s.type !== 'board') return s;
          const board = s as BoardSection;
          const updatedMembers = board.members.map((m, i) => {
            const def = defaultBoard.members[i];
            // Replace only if still holding a placeholder name
            if (def && m.name === 'Navn kommer') {
              dirty = true;
              return { ...m, name: def.name, role: def.role };
            }
            return m;
          });
          return { ...board, members: updatedMembers };
        });
      }

      // Migrate: fill in contact phone if it was empty
      parsed.sections = parsed.sections.map(s => {
        if (s.type !== 'contact') return s;
        const contact = s as ContactSection;
        const defaultContact = DEFAULT_CONTENT.sections.find(d => d.type === 'contact') as ContactSection | undefined;
        if (defaultContact && !contact.phone && defaultContact.phone) {
          dirty = true;
          return { ...contact, phone: defaultContact.phone };
        }
        return s;
      });

      // Migrate: fix "og" → "of" typo in orgName
      parsed.sections = parsed.sections.map(s => {
        if (s.type !== 'about') return s;
        const about = s as AboutSection;
        if (about.orgName === 'European Association og Ukrainian Children - Nordic') {
          dirty = true;
          return { ...about, orgName: 'European Association of Ukrainian Children - Nordic' };
        }
        return s;
      });

      if (dirty) localStorage.setItem(KEY, JSON.stringify(parsed));
      return parsed;
    }
  } catch { /* ignore */ }
  return DEFAULT_CONTENT;
}

// ─── API helpers ──────────────────────────────────────────────────────────────

const API_URL = '/api/site-content';

/** Fetch content from the server. Returns null if none stored yet. */
export async function fetchSiteContentFromAPI(): Promise<SiteContent | null> {
  try {
    const res = await fetch(API_URL);
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const content = applyCurrentCopy((await res.json()) as SiteContent);
    if (!content.sections.some(section => section.type === 'footer')) {
      const footer = DEFAULT_CONTENT.sections.find(section => section.type === 'footer');
      if (footer) content.sections.push(footer);
    }
    return content;
  } catch {
    return null;
  }
}

/** Persist content to the server and update localStorage cache. */
export async function saveSiteContentToAPI(content: SiteContent): Promise<void> {
  localStorage.setItem(KEY, JSON.stringify(content));
  await fetch(API_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(content),
  });
  window.dispatchEvent(new CustomEvent('eauc-content-changed'));
}

export function saveSiteContent(content: SiteContent): void {
  localStorage.setItem(KEY, JSON.stringify(content));
  window.dispatchEvent(new CustomEvent('eauc-content-changed'));
}

export function resetSiteContent(): void {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent('eauc-content-changed'));
}

// ─── Section meta ─────────────────────────────────────────────────────────────

export const SECTION_LABELS: Record<AnySection['type'], string> = {
  hero:    'Hero',
  mission: 'Vores mission',
  how:     'Sådan gør vi',
  stats:   'Gennemslagskraft',
  about:   'Om foreningen',
  board:   'Bestyrelsen',
  donate:  'Donér nu',
  text:    'Tekstblok',
  news:    'Nyheder & Rapporter',
  contact: 'Kontaktformular',
  footer:  'Footer',
};

export const TEXT_SECTION_TEMPLATE: TextSection = {
  id: '', type: 'text', visible: true,
  heading: 'Ny overskrift',
  text: 'Skriv din tekst her...',
  background: 'cream',
};

export const NEWS_ITEM_TEMPLATE: NewsItem = {
  id: '', title: 'Ny artikel', date: '2025',
  text: 'Beskriv nyheden her...',
  imageUrl: 'https://images.unsplash.com/photo-1526976668912-1a811878dd37?q=80&w=800&auto=format&fit=crop',
  tag: 'Nyhed',
};

export const CONTACT_SECTION_TEMPLATE: ContactSection = {
  id: '', type: 'contact', visible: true,
  heading: 'Kontakt os',
  subtitle: 'Vi hører gerne fra dig.',
  email: 'info@eaucnordic.com',
  phone: '',
};
