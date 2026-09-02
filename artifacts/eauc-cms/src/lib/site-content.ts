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
  donateUrl?: string;
  paypalUrl?: string;
  bankName?: string;
  bankRegistration?: string;
  bankAccount?: string;
  bankIban?: string;
  bankSwift?: string;
};
export type TextSection    = SectionBase & { type: 'text';    heading: string; text: string; background: 'cream' | 'white' | 'navy' };
export type NewsSection    = SectionBase & { type: 'news';    heading: string; subtitle: string; items: NewsItem[] };
export type ContactSection = SectionBase & { type: 'contact'; heading: string; subtitle: string; email: string; phone: string };

export type AnySection =
  | HeroSection | MissionSection | HowSection | StatsSection
  | AboutSection | BoardSection | DonateSection | TextSection
  | NewsSection | ContactSection;

export type SiteContent = { sections: AnySection[] };

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_CONTENT: SiteContent = {
  sections: [
    {
      id: 'hero', type: 'hero', visible: true,
      imageUrl: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=2069&auto=format&fit=crop',
      badge: 'INDSAMLING I GANG',
      heading: 'Giv ukrainske børn',
      headingAccent: 'en barndom tilbage',
      subtitle: 'Hjælp os med at bringe ukrainske børn til Danmark — for oplevelser, tryghed og glæden ved at være barn igen.',
      ctaLabel: 'Donér nu',
      ctaUrl: '#donér',
      cta2Label: 'Læs mere',
      cta2Url: '#mission',
    },
    {
      id: 'mission', type: 'mission', visible: true,
      heading: 'Vores mission',
      subtitle: 'Siden krigens start har ukrainske børn mistet deres hverdag, deres venner og deres barndom. Vi vil give dem et pusterum — fyldt med leg, latter og nye venskaber i Danmark.',
      cards: [
        { icon: 'heart',  title: 'Kærlighed & Omsorg',  text: 'Vi omgiver hvert barn med varme og tryghed fra det øjeblik, de ankommer til Danmark.' },
        { icon: 'smile',  title: 'Glæde & Oplevelser',  text: 'Tivoli, stranden, skoven — vi giver børnene minder, der varer hele livet.' },
        { icon: 'shield', title: 'Tryghed & Håb',       text: 'Et pusterum fra krigen, hvor børn kan være børn igen og genfinde modet.' },
      ],
    },
    {
      id: 'how', type: 'how', visible: true,
      heading: 'Sådan gør vi',
      steps: [
        { n: '01', title: 'Du donerer',     text: 'Ethvert beløb gør en forskel. Din donation går direkte til at finansiere rejse, ophold og oplevelser.' },
        { n: '02', title: 'Vi organiserer', text: 'Vi samarbejder med ukrainske organisationer for at finde børn, der har mest brug for et pusterum.' },
        { n: '03', title: 'Børnene oplever',text: 'Børnene kommer til Danmark og får uger fyldt med leg, natur, kultur og nye venskaber.' },
        { n: '04', title: 'Håbet vokser',   text: 'Børnene rejser hjem med nye kræfter, minder og troen på, at verden stadig er god.' },
      ],
    },
    {
      id: 'stats', type: 'stats', visible: true,
      heading: 'Vores gennemslagskraft',
      subtitle: 'Takket være jeres generøsitet har vi allerede gjort en kæmpe forskel.',
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
      heading: 'Nyheder & Rapporter',
      subtitle: 'Følg med i vores arbejde og se, hvad jeres donationer gør muligt.',
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
      tagline: 'HVEM STÅR BAG',
      heading: 'Om foreningen',
      text: 'European Association of Ukrainian Children – Nordic (EAUC Nordic) er stiftet som en uafhængig, almennyttig non-profit forening i Danmark. Vi arbejder for at give ukrainske børn tryghed, oplevelser og håb gennem ophold i Norden.',
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
      heading: 'Giv et bidrag i dag',
      subtitle: 'Ethvert beløb gør en forskel. Vælg et beløb herunder, eller donér hvad du kan.',
      amounts: [100, 250, 500, 1000],
      buttonLabel: 'Donér nu',
      note: 'Sikker betaling · Skattefradrag · 100% gennemsigtighed',
      paypalUrl: '',
      bankName: 'Danske Bank',
      bankRegistration: '9570',
      bankAccount: '14146679',
      bankIban: 'DK2630000014146679',
      bankSwift: 'DABADKKK',
    },
    {
      id: 'contact', type: 'contact', visible: true,
      heading: 'Kontakt os',
      subtitle: 'Har du spørgsmål, vil du hjælpe som frivillig, eller ønsker du at samarbejde? Vi hører gerne fra dig.',
      email: 'info@eaucnordic.com',
      phone: '+45 25 56 81 31',
    },
  ],
};

// ─── Storage helpers ──────────────────────────────────────────────────────────

const KEY = 'eauc_site_content_v1';

export function loadSiteContent(): SiteContent {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SiteContent;
      let dirty = false;

      // Migrate: add news/contact sections if missing
      const hasNews    = parsed.sections.some(s => s.type === 'news');
      const hasContact = parsed.sections.some(s => s.type === 'contact');
      if (!hasNews || !hasContact) {
        const extras = DEFAULT_CONTENT.sections.filter(s =>
          (s.type === 'news' && !hasNews) || (s.type === 'contact' && !hasContact)
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
    return (await res.json()) as SiteContent;
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
