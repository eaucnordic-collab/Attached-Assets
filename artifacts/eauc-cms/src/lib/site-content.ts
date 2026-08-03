// ─── Types ────────────────────────────────────────────────────────────────────

export type CardItem   = { icon: 'heart' | 'smile' | 'shield'; title: string; text: string };
export type StepItem   = { n: string; title: string; text: string };
export type StatItem   = { value: string; label: string };
export type MemberItem = { name: string; role: string; photo: string };

export type SectionBase = { id: string; visible: boolean };

export type HeroSection    = SectionBase & { type: 'hero';    imageUrl: string; badge: string; heading: string; headingAccent: string; subtitle: string; ctaLabel: string; ctaUrl: string; cta2Label: string; cta2Url: string };
export type MissionSection = SectionBase & { type: 'mission'; heading: string; subtitle: string; cards: CardItem[] };
export type HowSection     = SectionBase & { type: 'how';     heading: string; steps: StepItem[] };
export type StatsSection   = SectionBase & { type: 'stats';   heading: string; subtitle: string; imageUrl: string; items: StatItem[] };
export type AboutSection   = SectionBase & { type: 'about';   tagline: string; heading: string; text: string; cvr: string; orgName: string; address: string };
export type BoardSection   = SectionBase & { type: 'board';   heading: string; members: MemberItem[] };
export type DonateSection  = SectionBase & { type: 'donate';  heading: string; subtitle: string; amounts: number[]; buttonLabel: string; note: string };
export type TextSection    = SectionBase & { type: 'text';    heading: string; text: string; background: 'cream' | 'white' | 'navy' };

export type AnySection =
  | HeroSection | MissionSection | HowSection | StatsSection
  | AboutSection | BoardSection | DonateSection | TextSection;

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
      id: 'about', type: 'about', visible: true,
      tagline: 'HVEM STÅR BAG',
      heading: 'Om foreningen',
      text: 'European Association of Ukrainian Children – Nordic (EAUC Nordic) er stiftet som en uafhængig, almennyttig non-profit forening i Danmark. Vi arbejder for at give ukrainske børn tryghed, oplevelser og håb gennem ophold i Norden.',
      cvr: '46329406',
      orgName: 'European Association og Ukrainian Children - Nordic',
      address: 'Byparken 75, 1. 1, 5700 Svendborg',
    },
    {
      id: 'board', type: 'board', visible: true,
      heading: 'Bestyrelsen',
      members: [
        { name: 'Navn kommer', role: 'Formand',             photo: '' },
        { name: 'Navn kommer', role: 'Næstformand',         photo: '' },
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
    },
  ],
};

// ─── Storage helpers ──────────────────────────────────────────────────────────

const KEY = 'eauc_site_content_v1';

export function loadSiteContent(): SiteContent {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as SiteContent;
  } catch { /* ignore */ }
  return DEFAULT_CONTENT;
}

export function saveSiteContent(content: SiteContent): void {
  localStorage.setItem(KEY, JSON.stringify(content));
  // Notify other hooks in the same tab
  window.dispatchEvent(new CustomEvent('eauc-content-changed'));
}

export function resetSiteContent(): void {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent('eauc-content-changed'));
}

// ─── Section meta (labels / icons for admin) ─────────────────────────────────

export const SECTION_LABELS: Record<AnySection['type'], string> = {
  hero:    'Hero',
  mission: 'Vores mission',
  how:     'Sådan gør vi',
  stats:   'Gennemslagskraft',
  about:   'Om foreningen',
  board:   'Bestyrelsen',
  donate:  'Donér nu',
  text:    'Tekstblok',
};

export const TEXT_SECTION_TEMPLATE: TextSection = {
  id: '',
  type: 'text',
  visible: true,
  heading: 'Ny overskrift',
  text: 'Skriv din tekst her...',
  background: 'cream',
};
