import { useState } from 'react';
import { Link } from 'wouter';
import { Heart, Smile, Shield, Users, HandHeart, FileText } from 'lucide-react';

// ─── Colours & shared style ───────────────────────────────────────────────────
const CREAM = '#f5f0e8';
const NAVY  = '#0f1523';
const GOLD  = '#e8b400';
const BLUE  = '#3b7dd8';

// ─── Sitewide Header ──────────────────────────────────────────────────────────
function SiteHeader() {
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      background: 'rgba(8,10,18,0.96)',
      backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', height: 52,
    }}>
      <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: '#fff', letterSpacing: '0.06em' }}>
        EAUC
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid rgba(255,255,255,0.22)', borderRadius: 999, padding: '5px 13px' }}>
        <span style={{ fontSize: 14 }}>🌐</span>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#fff', fontWeight: 600 }}>DA</span>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>DK</span>
      </div>
    </header>
  );
}

// ─── Sitewide Footer ──────────────────────────────────────────────────────────
function SiteFooter() {
  return (
    <footer style={{
      background: NAVY,
      padding: '28px 40px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: 16,
    }}>
      <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>EAUC</span>
      <nav style={{ display: 'flex', gap: 24 }}>
        {['Om os', 'Kontakt', 'Privatlivspolitik'].map(l => (
          <a key={l} href="#" style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>{l}</a>
        ))}
      </nav>
      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
        © 2026 Håb for Ukraine. Alle rettigheder forbeholdes.
      </span>
    </footer>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ position: 'relative', minHeight: 460, display: 'flex', alignItems: 'center' }}>
      {/* background photo — group of children laughing in sunny meadow */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: "url('https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=2069&auto=format&fit=crop')",
        backgroundSize: 'cover', backgroundPosition: 'center 30%',
      }} />
      {/* dark overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(8,10,20,0.78) 52%, rgba(8,10,20,0.18) 100%)' }} />
      {/* content — top padding accounts for the 52px fixed header */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, padding: '132px 48px 80px' }}>
        {/* badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 999, padding: '5px 14px', marginBottom: 28,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: GOLD, display: 'inline-block' }} />
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', fontFamily: 'Inter, sans-serif' }}>
            INDSAMLING I GANG
          </span>
        </div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px,5vw,58px)', fontWeight: 700, lineHeight: 1.1, color: '#fff', margin: '0 0 6px' }}>
          Giv ukrainske børn
        </h1>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px,5vw,58px)', fontWeight: 700, lineHeight: 1.15, color: GOLD, margin: '0 0 22px' }}>
          en barndom tilbage
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: 'rgba(255,255,255,0.88)', lineHeight: 1.65, maxWidth: 460, margin: '0 0 36px' }}>
          Hjælp os med at bringe ukrainske børn til Danmark — for oplevelser, tryghed og glæden ved at være barn igen.
        </p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <a href="#donér"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: GOLD, color: NAVY, border: 'none',
              borderRadius: 999, padding: '13px 28px',
              fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 15,
              cursor: 'pointer', textDecoration: 'none',
            }}>
            <Heart size={16} fill={NAVY} /> Donér nu
          </a>
          <a href="#mission"
            style={{
              display: 'inline-flex', alignItems: 'center',
              background: 'rgba(255,255,255,0.15)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: 999, padding: '13px 28px',
              fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 15,
              cursor: 'pointer', textDecoration: 'none',
            }}>
            Læs mere
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Mission ──────────────────────────────────────────────────────────────────
function Mission() {
  const cards = [
    {
      icon: <Heart size={28} color={BLUE} />,
      title: 'Kærlighed & Omsorg',
      text: 'Vi omgiver hvert barn med varme og tryghed fra det øjeblik, de ankommer til Danmark.',
    },
    {
      icon: <Smile size={28} color={BLUE} />,
      title: 'Glæde & Oplevelser',
      text: 'Tivoli, stranden, skoven — vi giver børnene minder, der varer hele livet.',
    },
    {
      icon: <Shield size={28} color={BLUE} />,
      title: 'Tryghed & Håb',
      text: 'Et pusterum fra krigen, hvor børn kan være børn igen og genfinde modet.',
    },
  ];

  return (
    <section id="mission" style={{ background: CREAM, padding: '80px 24px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, fontWeight: 700, color: NAVY, margin: '0 0 20px' }}>
          Vores mission
        </h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: '#555', lineHeight: 1.7, maxWidth: 540, margin: '0 auto 56px' }}>
          Siden krigens start har ukrainske børn mistet deres hverdag, deres venner og deres barndom. Vi vil give dem et pusterum — fyldt med leg, latter og nye venskaber i Danmark.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 24 }}>
          {cards.map(c => (
            <div key={c.title} style={{
              background: '#fff', borderRadius: 16, padding: '36px 28px',
              border: '1px solid rgba(0,0,0,0.07)', textAlign: 'center',
            }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#e8f0fb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                {c.icon}
              </div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: NAVY, margin: '0 0 12px' }}>{c.title}</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#666', lineHeight: 1.65, margin: 0 }}>{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How we work ──────────────────────────────────────────────────────────────
function HowWeWork() {
  const steps = [
    { n: '01', title: 'Du donerer', text: 'Ethvert beløb gør en forskel. Din donation går direkte til at finansiere rejse, ophold og oplevelser.' },
    { n: '02', title: 'Vi organiserer', text: 'Vi samarbejder med ukrainske organisationer for at finde børn, der har mest brug for et pusterum.' },
    { n: '03', title: 'Børnene oplever', text: 'Børnene kommer til Danmark og får uger fyldt med leg, natur, kultur og nye venskaber.' },
    { n: '04', title: 'Håbet vokser', text: 'Børnene rejser hjem med nye kræfter, minder og troen på, at verden stadig er god.' },
  ];

  return (
    <section style={{ background: CREAM, padding: '0 24px 80px' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, fontWeight: 700, color: NAVY, textAlign: 'center', margin: '0 0 56px' }}>
          Sådan gør vi
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px,1fr))', gap: '36px 64px' }}>
          {steps.map(s => (
            <div key={s.n}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: GOLD, marginBottom: 8 }}>{s.n}</div>
              <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 700, color: NAVY, margin: '0 0 8px' }}>{s.title}</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#666', lineHeight: 1.7, margin: 0 }}>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function Stats() {
  const stats = [
    { value: '127', label: 'BØRN HJULPET' },
    { value: '42', label: 'OPLEVELSESTURE' },
    { value: '1.200+', label: 'DONORER' },
    { value: '98%', label: 'GÅR DIREKTE TIL BØRNENE' },
  ];

  return (
    <section style={{
      position: 'relative', padding: '72px 24px',
    }}>
      {/* sunflower background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: "url('https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=2069&auto=format&fit=crop')",
        backgroundSize: 'cover', backgroundPosition: 'center',
      }} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,12,24,0.78)' }} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>
            Vores gennemslagskraft
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.75)', fontSize: 15, margin: 0 }}>
            Takket være jeres generøsitet har vi allerede gjort en kæmpe forskel.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 32, paddingTop: 40 }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px,5vw,52px)', fontWeight: 700, color: GOLD, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.65)', marginTop: 10, textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="om-os" style={{ background: CREAM, padding: '80px 24px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', color: GOLD, textTransform: 'uppercase', marginBottom: 12 }}>
          HVEM STÅR BAG
        </div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 42, fontWeight: 700, color: NAVY, margin: '0 0 24px' }}>
          Om foreningen
        </h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#555', lineHeight: 1.75, margin: '0 auto 56px' }}>
          European Association of Ukrainian Children – Nordic (EAUC Nordic) er stiftet som en uafhængig, almennyttig non-profit forening i Danmark. Vi arbejder for at give ukrainske børn tryghed, oplevelser og håb gennem ophold i Norden.
        </p>

        {/* Org structure */}
        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 32 }}>Organisationsstruktur</h3>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          {/* Top card */}
          <div style={{
            background: NAVY, borderRadius: 14, padding: '24px 40px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            width: 260,
          }}>
            <FileText size={28} color={GOLD} />
            <div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#fff', fontSize: 16 }}>EAUC Nordic</div>
              <div style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 2 }}>Almennyttig forening · Danmark</div>
            </div>
          </div>
          {/* connector */}
          <div style={{ width: 2, height: 32, background: '#ccc' }} />
          {/* two sub cards */}
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { icon: <Users size={24} color={BLUE} />, title: 'Bestyrelse', sub: 'Strategisk ledelse' },
              { icon: <HandHeart size={24} color={GOLD} />, title: 'Frivillige', sub: 'Værtsfamilier & støtter' },
            ].map(c => (
              <div key={c.title} style={{
                background: '#fff', border: '1px solid #e0dbd0', borderRadius: 14,
                padding: '24px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                minWidth: 200,
              }}>
                {c.icon}
                <div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: NAVY, fontSize: 15 }}>{c.title}</div>
                  <div style={{ fontFamily: 'Inter, sans-serif', color: '#777', fontSize: 13, marginTop: 2 }}>{c.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Registration */}
        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: NAVY, margin: '60px 0 24px' }}>Registreringsoplysninger</h3>
        <div style={{
          background: '#fff', border: '1px solid #e0dbd0', borderRadius: 14,
          padding: '28px 32px', textAlign: 'left',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 32px',
        }}>
          <div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#999', textTransform: 'uppercase', marginBottom: 6 }}>CVR-NUMMER</div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: NAVY, fontSize: 15 }}>46329406</div>
          </div>
          <div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#999', textTransform: 'uppercase', marginBottom: 6 }}>FORENINGENS NAVN</div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: NAVY, fontSize: 15 }}>European Association og Ukrainian Children - Nordic</div>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#999', textTransform: 'uppercase', marginBottom: 6 }}>ADRESSE</div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: NAVY, fontSize: 15 }}>Byparken 75, 1. 1, 5700 Svendborg</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Board ────────────────────────────────────────────────────────────────────
function Board() {
  const members = [
    { name: 'Navn kommer', role: 'Formand' },
    { name: 'Navn kommer', role: 'Næstformand' },
    { name: 'Navn kommer', role: 'Kasserer' },
    { name: 'Navn kommer', role: 'Bestyrelsesmedlem' },
  ];

  return (
    <section style={{ background: CREAM, padding: '0 24px 80px' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: NAVY, textAlign: 'center', marginBottom: 32 }}>Bestyrelsen</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px,1fr))', gap: 20 }}>
          {members.map((m, i) => (
            <div key={i} style={{
              background: '#fff', border: '1px solid #e0dbd0', borderRadius: 14,
              padding: '24px 20px', textAlign: 'center',
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', background: '#ede9e0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <Users size={28} color="#aaa" />
              </div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: NAVY, fontSize: 14 }}>{m.name}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', color: '#888', fontSize: 13, marginTop: 4 }}>{m.role}</div>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#999', textAlign: 'center', fontStyle: 'italic', marginTop: 20 }}>
          Send mig navnene på bestyrelsesmedlemmerne, så sætter jeg dem ind.
        </p>
      </div>
    </section>
  );
}

// ─── Donate ───────────────────────────────────────────────────────────────────
function Donate() {
  const amounts = [100, 250, 500, 1000];
  const [selected, setSelected] = useState(250);
  const [custom, setCustom] = useState('');
  const [email, setEmail] = useState('');

  return (
    <section id="donér" style={{ background: CREAM, padding: '80px 24px 100px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 42, fontWeight: 700, color: NAVY, margin: '0 0 16px' }}>
          Giv et bidrag i dag
        </h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#555', lineHeight: 1.65, margin: '0 0 40px' }}>
          Ethvert beløb gør en forskel. Vælg et beløb herunder, eller donér hvad du kan.
        </p>

        {/* amount grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 12 }}>
          {amounts.map(a => (
            <button key={a} onClick={() => { setSelected(a); setCustom(''); }}
              style={{
                fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 16,
                padding: '16px 0', borderRadius: 12, cursor: 'pointer',
                border: selected === a && !custom ? `2px solid ${BLUE}` : '2px solid #d8d2c8',
                background: selected === a && !custom ? '#eef3fc' : '#fff',
                color: selected === a && !custom ? BLUE : NAVY,
              }}>
              {a.toLocaleString('da-DK')} kr
            </button>
          ))}
        </div>

        {/* custom input */}
        <input
          type="number"
          placeholder="Andet beløb"
          value={custom}
          onChange={e => { setCustom(e.target.value); setSelected(0); }}
          style={{
            width: '100%', padding: '15px 20px', borderRadius: 12,
            border: '2px solid #d8d2c8', fontFamily: 'Inter, sans-serif', fontSize: 15,
            color: NAVY, marginBottom: 20, boxSizing: 'border-box', outline: 'none',
            background: '#fff',
          }}
        />

        {/* email */}
        <div style={{ marginBottom: 8, textAlign: 'left' }}>
          <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#555' }}>Email (til kvittering)</label>
        </div>
        <input
          type="email"
          placeholder="din@email.dk"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            width: '100%', padding: '15px 20px', borderRadius: 12,
            border: '2px solid #d8d2c8', fontFamily: 'Inter, sans-serif', fontSize: 15,
            color: NAVY, marginBottom: 24, boxSizing: 'border-box', outline: 'none',
            background: '#fff',
          }}
        />

        {/* submit */}
        <button
          style={{
            width: '100%', padding: '16px', borderRadius: 999,
            background: BLUE, color: '#fff', border: 'none',
            fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 17,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
          <Heart size={18} fill="#fff" /> Donér nu
        </button>

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#999', marginTop: 16 }}>
          Sikker betaling · Skattefradrag · 100% gennemsigtighed
        </p>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EaucHome() {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: CREAM }}>
      <SiteHeader />
      <Hero />
      <Mission />
      <HowWeWork />
      <Stats />
      <About />
      <Board />
      <Donate />
      <SiteFooter />
    </div>
  );
}
