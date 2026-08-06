import { useState, useEffect, useCallback, useRef } from 'react';
import { AdminLayout } from '@/components/admin-layout';
import {
  loadSiteContent, saveSiteContent, resetSiteContent, DEFAULT_CONTENT,
  fetchSiteContentFromAPI, saveSiteContentToAPI,
  SECTION_LABELS, TEXT_SECTION_TEMPLATE, NEWS_ITEM_TEMPLATE, CONTACT_SECTION_TEMPLATE,
  type SiteContent, type AnySection, type CardItem, type StepItem,
  type StatItem, type MemberItem, type NewsItem,
  type HeroSection, type MissionSection, type HowSection, type StatsSection,
  type AboutSection, type BoardSection, type DonateSection, type TextSection,
  type NewsSection, type ContactSection,
} from '@/lib/site-content';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy,
  useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  GripVertical, Eye, EyeOff, Plus, Trash2, ChevronRight,
  ExternalLink, RotateCcw, Save, PlusCircle, Monitor, PanelRight,
} from 'lucide-react';

// ─── Sortable section row ──────────────────────────────────────────────────────
function SectionRow({
  section, selected, onSelect, onToggle, onDelete,
}: {
  section: AnySection;
  selected: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };
  const FIXED = ['hero', 'donate'];
  const canDelete = !FIXED.includes(section.type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer group transition-colors ${selected ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted border border-transparent'}`}
    >
      <span {...attributes} {...listeners} className="text-muted-foreground cursor-grab active:cursor-grabbing shrink-0" onClick={e => e.stopPropagation()}>
        <GripVertical size={15} />
      </span>
      <div className="flex-1 min-w-0">
        <span className={`text-sm font-medium truncate block ${!section.visible ? 'text-muted-foreground line-through' : ''}`}>
          {SECTION_LABELS[section.type]}
        </span>
      </div>
      <button
        onClick={e => { e.stopPropagation(); onToggle(); }}
        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        title={section.visible ? 'Skjul sektion' : 'Vis sektion'}
      >
        {section.visible ? <Eye size={14} /> : <EyeOff size={14} className="text-muted-foreground/40" />}
      </button>
      {canDelete && (
        <button
          onClick={e => { e.stopPropagation(); onDelete(); }}
          className="shrink-0 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
          title="Slet sektion"
        >
          <Trash2 size={14} />
        </button>
      )}
      <ChevronRight size={14} className={`shrink-0 transition-colors ${selected ? 'text-primary' : 'text-muted-foreground'}`} />
    </div>
  );
}

// ─── Field helpers ─────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <Field label={label}>
      <Input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="h-9" />
    </Field>
  );
}

function TextareaInput({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <Field label={label}>
      <Textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} className="resize-none" />
    </Field>
  );
}

function ImageInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input value={value} onChange={e => onChange(e.target.value)} placeholder="https://..." className="h-9 flex-1" />
          {value && (
            <a href={value} target="_blank" rel="noreferrer">
              <Button variant="outline" size="sm" className="h-9 px-2.5"><ExternalLink size={14} /></Button>
            </a>
          )}
        </div>
        {value && (
          <div className="w-full h-24 rounded-lg overflow-hidden bg-muted border">
            <img src={value} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
        )}
      </div>
    </Field>
  );
}

// ─── Section editors ──────────────────────────────────────────────────────────

function HeroEditor({ s, onChange }: { s: HeroSection; onChange: (s: HeroSection) => void }) {
  const u = (k: keyof HeroSection, v: string) => onChange({ ...s, [k]: v });
  return (
    <div className="space-y-5">
      <ImageInput label="Baggrundsbillede URL" value={s.imageUrl} onChange={v => u('imageUrl', v)} />
      <TextInput label="Badge tekst" value={s.badge} onChange={v => u('badge', v)} placeholder="INDSAMLING I GANG" />
      <TextInput label="Overskrift (hvid)" value={s.heading} onChange={v => u('heading', v)} />
      <TextInput label="Overskrift (guld)" value={s.headingAccent} onChange={v => u('headingAccent', v)} />
      <TextareaInput label="Undertekst" value={s.subtitle} onChange={v => u('subtitle', v)} rows={2} />
      <div className="grid grid-cols-2 gap-4">
        <TextInput label="Knap 1 tekst" value={s.ctaLabel} onChange={v => u('ctaLabel', v)} />
        <TextInput label="Knap 1 URL" value={s.ctaUrl} onChange={v => u('ctaUrl', v)} />
        <TextInput label="Knap 2 tekst" value={s.cta2Label} onChange={v => u('cta2Label', v)} />
        <TextInput label="Knap 2 URL" value={s.cta2Url} onChange={v => u('cta2Url', v)} />
      </div>
    </div>
  );
}

function MissionEditor({ s, onChange }: { s: MissionSection; onChange: (s: MissionSection) => void }) {
  const updateCard = (i: number, key: keyof CardItem, val: string) => {
    const cards = s.cards.map((c, idx) => idx === i ? { ...c, [key]: val } : c);
    onChange({ ...s, cards });
  };
  return (
    <div className="space-y-5">
      <TextInput label="Overskrift" value={s.heading} onChange={v => onChange({ ...s, heading: v })} />
      <TextareaInput label="Undertekst" value={s.subtitle} onChange={v => onChange({ ...s, subtitle: v })} rows={3} />
      <div className="border-t pt-5 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Kort ({s.cards.length} stk.)</p>
        {s.cards.map((card, i) => (
          <div key={i} className="rounded-lg border p-4 space-y-3 bg-muted/20">
            <p className="text-xs font-medium text-muted-foreground">Kort {i + 1}</p>
            <TextInput label="Titel" value={card.title} onChange={v => updateCard(i, 'title', v)} />
            <TextareaInput label="Tekst" value={card.text} onChange={v => updateCard(i, 'text', v)} rows={2} />
          </div>
        ))}
      </div>
    </div>
  );
}

function HowEditor({ s, onChange }: { s: HowSection; onChange: (s: HowSection) => void }) {
  const updateStep = (i: number, key: keyof StepItem, val: string) => {
    const steps = s.steps.map((st, idx) => idx === i ? { ...st, [key]: val } : st);
    onChange({ ...s, steps });
  };
  const addStep = () => onChange({ ...s, steps: [...s.steps, { n: String(s.steps.length + 1).padStart(2, '0'), title: 'Nyt trin', text: '' }] });
  const removeStep = (i: number) => onChange({ ...s, steps: s.steps.filter((_, idx) => idx !== i) });
  return (
    <div className="space-y-5">
      <TextInput label="Overskrift" value={s.heading} onChange={v => onChange({ ...s, heading: v })} />
      <div className="border-t pt-5 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Trin ({s.steps.length})</p>
        {s.steps.map((step, i) => (
          <div key={i} className="rounded-lg border p-4 space-y-3 bg-muted/20">
            <div className="flex justify-between items-center">
              <p className="text-xs font-medium text-muted-foreground">Trin {i + 1}</p>
              {s.steps.length > 1 && (
                <button onClick={() => removeStep(i)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 size={13} />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextInput label="Nummer" value={step.n} onChange={v => updateStep(i, 'n', v)} placeholder="01" />
              <TextInput label="Titel" value={step.title} onChange={v => updateStep(i, 'title', v)} />
            </div>
            <TextareaInput label="Tekst" value={step.text} onChange={v => updateStep(i, 'text', v)} rows={2} />
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-full" onClick={addStep}>
          <PlusCircle size={14} className="mr-2" /> Tilføj trin
        </Button>
      </div>
    </div>
  );
}

function StatsEditor({ s, onChange }: { s: StatsSection; onChange: (s: StatsSection) => void }) {
  const updateItem = (i: number, key: keyof StatItem, val: string) => {
    const items = s.items.map((it, idx) => idx === i ? { ...it, [key]: val } : it);
    onChange({ ...s, items });
  };
  const addItem = () => onChange({ ...s, items: [...s.items, { value: '0', label: 'NY STAT' }] });
  const removeItem = (i: number) => onChange({ ...s, items: s.items.filter((_, idx) => idx !== i) });
  return (
    <div className="space-y-5">
      <TextInput label="Overskrift" value={s.heading} onChange={v => onChange({ ...s, heading: v })} />
      <TextInput label="Undertekst" value={s.subtitle} onChange={v => onChange({ ...s, subtitle: v })} />
      <ImageInput label="Baggrundsbillede URL" value={s.imageUrl} onChange={v => onChange({ ...s, imageUrl: v })} />
      <div className="border-t pt-5 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Statistikker ({s.items.length})</p>
        {s.items.map((item, i) => (
          <div key={i} className="rounded-lg border p-3 bg-muted/20">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-medium text-muted-foreground">Stat {i + 1}</p>
              {s.items.length > 1 && (
                <button onClick={() => removeItem(i)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 size={13} />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextInput label="Værdi" value={item.value} onChange={v => updateItem(i, 'value', v)} placeholder="127" />
              <TextInput label="Label" value={item.label} onChange={v => updateItem(i, 'label', v)} placeholder="BØRN HJULPET" />
            </div>
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-full" onClick={addItem}>
          <PlusCircle size={14} className="mr-2" /> Tilføj statistik
        </Button>
      </div>
    </div>
  );
}

function AboutEditor({ s, onChange }: { s: AboutSection; onChange: (s: AboutSection) => void }) {
  const u = (k: keyof AboutSection, v: string) => onChange({ ...s, [k]: v });
  return (
    <div className="space-y-5">
      <TextInput label="Lille label (gul)" value={s.tagline} onChange={v => u('tagline', v)} placeholder="HVEM STÅR BAG" />
      <TextInput label="Overskrift" value={s.heading} onChange={v => u('heading', v)} />
      <TextareaInput label="Brødtekst" value={s.text} onChange={v => u('text', v)} rows={4} />
      <div className="border-t pt-5 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Registreringsoplysninger</p>
        <TextInput label="CVR-nummer" value={s.cvr} onChange={v => u('cvr', v)} />
        <TextInput label="Foreningens navn" value={s.orgName} onChange={v => u('orgName', v)} />
        <TextInput label="Adresse" value={s.address} onChange={v => u('address', v)} />
      </div>
    </div>
  );
}

function BoardEditor({ s, onChange }: { s: BoardSection; onChange: (s: BoardSection) => void }) {
  const updateMember = (i: number, key: keyof MemberItem, val: string) => {
    const members = s.members.map((m, idx) => idx === i ? { ...m, [key]: val } : m);
    onChange({ ...s, members });
  };
  const addMember = () => onChange({ ...s, members: [...s.members, { name: 'Navn', role: 'Rolle', photo: '' }] });
  const removeMember = (i: number) => onChange({ ...s, members: s.members.filter((_, idx) => idx !== i) });
  return (
    <div className="space-y-5">
      <TextInput label="Overskrift" value={s.heading} onChange={v => onChange({ ...s, heading: v })} />
      <div className="border-t pt-5 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Bestyrelsesmedlemmer ({s.members.length})</p>
        {s.members.map((m, i) => (
          <div key={i} className="rounded-lg border p-4 space-y-3 bg-muted/20">
            <div className="flex justify-between items-center">
              <p className="text-xs font-medium text-muted-foreground">Medlem {i + 1}</p>
              <button onClick={() => removeMember(i)} className="text-muted-foreground hover:text-destructive">
                <Trash2 size={13} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextInput label="Navn" value={m.name} onChange={v => updateMember(i, 'name', v)} />
              <TextInput label="Rolle" value={m.role} onChange={v => updateMember(i, 'role', v)} />
            </div>
            <ImageInput label="Foto URL (valgfrit)" value={m.photo} onChange={v => updateMember(i, 'photo', v)} />
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-full" onClick={addMember}>
          <PlusCircle size={14} className="mr-2" /> Tilføj medlem
        </Button>
      </div>
    </div>
  );
}

function DonateEditor({ s, onChange }: { s: DonateSection; onChange: (s: DonateSection) => void }) {
  return (
    <div className="space-y-5">
      <TextInput label="Overskrift" value={s.heading} onChange={v => onChange({ ...s, heading: v })} />
      <TextareaInput label="Undertekst" value={s.subtitle} onChange={v => onChange({ ...s, subtitle: v })} rows={2} />
      <Field label="Beløb (kommasepareret, kr)">
        <Input
          value={s.amounts.join(', ')}
          onChange={e => {
            const amounts = e.target.value.split(',').map(x => parseInt(x.trim())).filter(n => !isNaN(n));
            onChange({ ...s, amounts });
          }}
          placeholder="100, 250, 500, 1000"
          className="h-9"
        />
      </Field>
      <TextInput label="Knaptekst" value={s.buttonLabel} onChange={v => onChange({ ...s, buttonLabel: v })} />
      <TextInput label="Notat under knap" value={s.note} onChange={v => onChange({ ...s, note: v })} />
    </div>
  );
}

function TextSectionEditor({ s, onChange }: { s: TextSection; onChange: (s: TextSection) => void }) {
  return (
    <div className="space-y-5">
      <TextInput label="Overskrift" value={s.heading} onChange={v => onChange({ ...s, heading: v })} />
      <TextareaInput label="Tekst" value={s.text} onChange={v => onChange({ ...s, text: v })} rows={6} />
      <Field label="Baggrund">
        <select
          value={s.background}
          onChange={e => onChange({ ...s, background: e.target.value as TextSection['background'] })}
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="cream">Creme</option>
          <option value="white">Hvid</option>
          <option value="navy">Mørk (navy)</option>
        </select>
      </Field>
    </div>
  );
}

// ─── News editor ───────────────────────────────────────────────────────────────
function NewsEditor({ s, onChange }: { s: NewsSection; onChange: (s: NewsSection) => void }) {
  const updateItem = (i: number, key: keyof NewsItem, val: string) => {
    const items = s.items.map((it, idx) => idx === i ? { ...it, [key]: val } : it);
    onChange({ ...s, items });
  };
  const addItem = () => {
    const id = `news_${Date.now()}`;
    onChange({ ...s, items: [...s.items, { ...NEWS_ITEM_TEMPLATE, id }] });
  };
  const removeItem = (i: number) => onChange({ ...s, items: s.items.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-5">
      <TextInput label="Overskrift" value={s.heading} onChange={v => onChange({ ...s, heading: v })} />
      <TextareaInput label="Undertekst" value={s.subtitle} onChange={v => onChange({ ...s, subtitle: v })} rows={2} />
      <div className="border-t pt-5 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Artikler ({s.items.length})
        </p>
        {s.items.map((item, i) => (
          <div key={item.id} className="rounded-lg border p-4 space-y-3 bg-muted/20">
            <div className="flex justify-between items-center">
              <p className="text-xs font-medium text-muted-foreground">Artikel {i + 1}</p>
              {s.items.length > 1 && (
                <button onClick={() => removeItem(i)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 size={13} />
                </button>
              )}
            </div>
            <TextInput label="Titel" value={item.title} onChange={v => updateItem(i, 'title', v)} />
            <div className="grid grid-cols-2 gap-3">
              <TextInput label="Dato" value={item.date} onChange={v => updateItem(i, 'date', v)} placeholder="August 2025" />
              <TextInput label="Tag" value={item.tag} onChange={v => updateItem(i, 'tag', v)} placeholder="Rapport" />
            </div>
            <TextareaInput label="Tekst" value={item.text} onChange={v => updateItem(i, 'text', v)} rows={3} />
            <ImageInput label="Billede URL" value={item.imageUrl} onChange={v => updateItem(i, 'imageUrl', v)} />
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-full" onClick={addItem}>
          <PlusCircle size={14} className="mr-2" /> Tilføj artikel
        </Button>
      </div>
    </div>
  );
}

// ─── Contact editor ────────────────────────────────────────────────────────────
function ContactEditor({ s, onChange }: { s: ContactSection; onChange: (s: ContactSection) => void }) {
  const u = (k: keyof ContactSection, v: string) => onChange({ ...s, [k]: v });
  return (
    <div className="space-y-5">
      <TextInput label="Overskrift" value={s.heading} onChange={v => u('heading', v)} />
      <TextareaInput label="Undertekst" value={s.subtitle} onChange={v => u('subtitle', v)} rows={2} />
      <div className="border-t pt-5 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Kontaktoplysninger</p>
        <TextInput label="E-mail" value={s.email} onChange={v => u('email', v)} placeholder="info@eaucnordic.com" />
        <TextInput label="Telefon (valgfrit)" value={s.phone} onChange={v => u('phone', v)} placeholder="+45 12 34 56 78" />
      </div>
      <div className="rounded-lg bg-blue-50 border border-blue-100 p-3 text-xs text-blue-700">
        💡 Formularen åbner brugerens e-mail-klient ved indsendelse, forudfyldt med emne og besked. Ingen backend nødvendig.
      </div>
    </div>
  );
}

// ─── Section editor dispatcher ─────────────────────────────────────────────────
function SectionEditor({ section, onChange }: { section: AnySection; onChange: (s: AnySection) => void }) {
  switch (section.type) {
    case 'hero':    return <HeroEditor       s={section} onChange={onChange as (s: any) => void} />;
    case 'mission': return <MissionEditor    s={section} onChange={onChange as (s: any) => void} />;
    case 'how':     return <HowEditor        s={section} onChange={onChange as (s: any) => void} />;
    case 'stats':   return <StatsEditor      s={section} onChange={onChange as (s: any) => void} />;
    case 'about':   return <AboutEditor      s={section} onChange={onChange as (s: any) => void} />;
    case 'board':   return <BoardEditor      s={section} onChange={onChange as (s: any) => void} />;
    case 'donate':  return <DonateEditor     s={section} onChange={onChange as (s: any) => void} />;
    case 'text':    return <TextSectionEditor s={section} onChange={onChange as (s: any) => void} />;
    case 'news':    return <NewsEditor       s={section} onChange={onChange as (s: any) => void} />;
    case 'contact': return <ContactEditor    s={section} onChange={onChange as (s: any) => void} />;
  }
}

// ─── Add section panel ────────────────────────────────────────────────────────
function AddSectionPanel({ onAdd, onClose }: { onAdd: (type: AnySection['type']) => void; onClose: () => void }) {
  const types: Array<{ type: AnySection['type']; label: string; desc: string }> = [
    { type: 'text',    label: 'Tekstblok',           desc: 'Overskrift + fri tekst med valgbar baggrund' },
    { type: 'news',    label: 'Nyheder & Rapporter',  desc: 'Kortsvisning af artikler med billede og tag' },
    { type: 'contact', label: 'Kontaktformular',      desc: 'Formular med name/email/emne/besked' },
    { type: 'mission', label: 'Kort-sektion',         desc: '3 ikonkort med titel og tekst' },
    { type: 'how',     label: 'Trin-sektion',         desc: 'Nummererede trin (1–N)' },
    { type: 'stats',   label: 'Statistik-sektion',    desc: 'Mørk baggrund med nøgletal' },
    { type: 'board',   label: 'Teamsektion',          desc: 'Personkort med foto, navn og rolle' },
  ];
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <p className="font-semibold text-sm">Tilføj ny sektion</p>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xs underline">Annuller</button>
      </div>
      {types.map(t => (
        <button
          key={t.type}
          onClick={() => onAdd(t.type)}
          className="w-full text-left rounded-lg border p-3 hover:bg-muted transition-colors"
        >
          <p className="font-medium text-sm">{t.label}</p>
          <p className="text-xs text-muted-foreground">{t.desc}</p>
        </button>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SiteEditor() {
  const [content, setContent] = useState<SiteContent>(loadSiteContent);
  const [selectedId, setSelectedId] = useState<string>('hero');
  const [isDirty, setIsDirty] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const send = () => {
      try {
        iframe.contentWindow?.postMessage({ type: 'eauc-preview', content }, '*');
      } catch { /* cross-origin guard */ }
    };
    iframe.addEventListener('load', send);
    send();
    return () => iframe.removeEventListener('load', send);
  }, [content]);

  // Load authoritative content from server on mount
  useEffect(() => {
    fetchSiteContentFromAPI().then(remote => {
      if (remote) {
        localStorage.setItem('eauc_site_content_v1', JSON.stringify(remote));
        setContent(remote);
      }
    });
  }, []);

  useEffect(() => {
    const handler = () => setContent(loadSiteContent());
    window.addEventListener('eauc-content-changed', handler);
    return () => window.removeEventListener('eauc-content-changed', handler);
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setContent(prev => {
        const oldIdx = prev.sections.findIndex(s => s.id === active.id);
        const newIdx = prev.sections.findIndex(s => s.id === over.id);
        return { ...prev, sections: arrayMove(prev.sections, oldIdx, newIdx) };
      });
      setIsDirty(true);
    }
  };

  const updateSection = useCallback((updated: AnySection) => {
    setContent(prev => ({ ...prev, sections: prev.sections.map(s => s.id === updated.id ? updated : s) }));
    setIsDirty(true);
  }, []);

  const toggleVisible = (id: string) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, visible: !s.visible } : s),
    }));
    setIsDirty(true);
  };

  const deleteSection = (id: string) => {
    setContent(prev => ({ ...prev, sections: prev.sections.filter(s => s.id !== id) }));
    if (selectedId === id) setSelectedId(content.sections[0]?.id ?? '');
    setIsDirty(true);
  };

  const addSection = (type: AnySection['type']) => {
    const id = `${type}_${Date.now()}`;
    let newSection: AnySection;
    if (type === 'text') {
      newSection = { ...TEXT_SECTION_TEMPLATE, id };
    } else if (type === 'contact') {
      newSection = { ...CONTACT_SECTION_TEMPLATE, id };
    } else {
      const template = DEFAULT_CONTENT.sections.find((s: AnySection) => s.type === type);
      newSection = template ? { ...template, id } : { ...TEXT_SECTION_TEMPLATE, id };
    }
    setContent(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
    setSelectedId(id);
    setShowAdd(false);
    setIsDirty(true);
  };

  const handleSave = () => {
    saveSiteContentToAPI(content).then(() => {
      setIsDirty(false);
      toast.success('Ændringer gemt! Siden er opdateret for alle.', { duration: 2500 });
    }).catch(() => {
      toast.error('Fejl ved gemning. Prøv igen.');
    });
  };

  const handleReset = () => {
    if (!confirm('Er du sikker? Dette nulstiller alle ændringer til standardindholdet.')) return;
    saveSiteContentToAPI(DEFAULT_CONTENT).then(() => {
      resetSiteContent();
      setContent(DEFAULT_CONTENT);
      setIsDirty(false);
      toast.info('Siden er nulstillet til standardindhold.');
    }).catch(() => {
      toast.error('Fejl ved nulstilling. Prøv igen.');
    });
  };

  const selected = content.sections.find(s => s.id === selectedId);

  return (
    <AdminLayout>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b bg-background sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="font-semibold text-base">Sidedesigner</h1>
          {isDirty && <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50 text-xs">Ikke gemt</Badge>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowPreview(v => !v)} title="Vis/skjul forhåndsvisning">
            {showPreview ? <PanelRight size={13} className="mr-1.5" /> : <Monitor size={13} className="mr-1.5" />}
            {showPreview ? 'Skjul preview' : 'Vis preview'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw size={13} className="mr-1.5" /> Nulstil
          </Button>
          <a href="/" target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm">
              <ExternalLink size={13} className="mr-1.5" /> Se siden
            </Button>
          </a>
          <Button size="sm" onClick={handleSave} disabled={!isDirty} className="min-w-[130px]">
            <Save size={13} className="mr-1.5" /> Gem ændringer
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 57px)' }}>
        {/* Left: section list */}
        <aside className="w-56 shrink-0 border-r bg-muted/20 flex flex-col overflow-hidden">
          <div className="p-3 border-b shrink-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sektioner</p>
            <p className="text-xs text-muted-foreground mt-0.5">Træk ≡ for at flytte · 👁 for at skjule</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={content.sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                {content.sections.map(s => (
                  <SectionRow
                    key={s.id}
                    section={s}
                    selected={selectedId === s.id}
                    onSelect={() => { setSelectedId(s.id); setShowAdd(false); }}
                    onToggle={() => toggleVisible(s.id)}
                    onDelete={() => deleteSection(s.id)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
          <div className="p-2 border-t shrink-0">
            <Button variant="outline" size="sm" className="w-full" onClick={() => { setShowAdd(v => !v); }}>
              <Plus size={14} className="mr-1.5" /> Tilføj sektion
            </Button>
          </div>
        </aside>

        {/* Middle: edit form */}
        <div className="w-96 shrink-0 border-r overflow-y-auto bg-background">
          {showAdd ? (
            <div className="p-5">
              <AddSectionPanel onAdd={addSection} onClose={() => setShowAdd(false)} />
            </div>
          ) : selected ? (
            <div className="p-5">
              <div className="flex items-center gap-3 mb-5">
                <h2 className="font-semibold text-base flex-1">{SECTION_LABELS[selected.type]}</h2>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={selected.visible}
                    onCheckedChange={() => toggleVisible(selected.id)}
                    id={`vis-${selected.id}`}
                  />
                  <label htmlFor={`vis-${selected.id}`} className="text-xs text-muted-foreground cursor-pointer select-none">
                    {selected.visible ? 'Synlig' : 'Skjult'}
                  </label>
                </div>
              </div>
              <div className="rounded-xl border bg-muted/10 p-5">
                <SectionEditor section={selected} onChange={updateSection} />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Vælg en sektion til venstre
            </div>
          )}
        </div>

        {/* Right: live preview iframe */}
        {showPreview && (
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-100 dark:bg-gray-800">
            <div className="flex items-center gap-2 px-3 py-1.5 border-b bg-background/80 backdrop-blur shrink-0">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-xs text-muted-foreground flex-1 text-center">Live forhåndsvisning — opdateres i realtid</span>
            </div>
            <iframe
              ref={iframeRef}
              src="/"
              className="flex-1 w-full border-0"
              title="Live preview"
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
