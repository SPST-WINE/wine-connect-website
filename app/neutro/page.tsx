// app/presentazione-neutra/page.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Maximize2, Minimize2, LayoutGrid, X,
  TriangleAlert, Ship, Globe2, Route, FileCheck2, TrendingUp,
  Building2, LineChart, MessageSquareMore, ShoppingCart, Users2,
  BadgeCheck, Handshake, Search
} from 'lucide-react';

/* ===================== PALETTE NEUTRA (più chiara) ===================== */
const BG_DARK = '#121a24';   // prima #0b1117 -> più chiaro
const BG_DARK_2 = '#0d141c'; // prima #060a0f -> più chiaro
const WHITE = '#ffffff';
const ACCENT_LIGHT = '#AFC0CA';   // grafite chiaro
const BORDER = 'rgba(255,255,255,.18)';
const GLASS_TOP = 'rgba(255,255,255,.10)';   // più chiaro
const GLASS_BOTTOM = 'rgba(255,255,255,.05)';// più chiaro

/* ===================== SLIDES ===================== */
type Slide =
  | { kind: 'title'; kicker?: string; title: React.ReactNode; subtitle?: string }
  | { kind: 'column'; kicker?: string; title: string; description?: string; items?: Array<{ icon?: React.ReactNode; title: string; desc?: string }> }
  | { kind: 'cta'; title: string; bullets?: string[]; primary: { label: string; href: string }; secondary?: { label: string; href: string } };

const slides: Slide[] = [
  {
    kind: 'title',
    kicker: 'Panorama export vino',
    title: (
      <>
        Il vino italiano nel mondo,{' '}
        <span
          className="text-transparent bg-clip-text"
          style={{ backgroundImage: `linear-gradient(90deg, ${WHITE}, ${ACCENT_LIGHT})` }}
        >
          senza filtri.
        </span>
      </>
    ),
    subtitle:
      'Valore del mercato, destinazioni chiave, tendenze 2024–25 e perché oggi è più difficile crescere all’estero.',
  },
  {
    kind: 'column',
    kicker: 'Fotografia 2024',
    title: 'Valore dell’export e mercati principali',
    description: 'L’export ha toccato nuovi massimi, ma la domanda globale è sempre più selettiva.',
    items: [
      { icon: <LineChart className="h-5 w-5" />, title: '€8,1 mld · 21,7 Mhl', desc: 'Record per valore e volumi su base annua.' },
      { icon: <Globe2 className="h-5 w-5" />, title: 'Dove va il vino italiano (per volumi)', desc: 'USA, Germania e Regno Unito restano i primi sbocchi; la domanda chiede però maggiore qualità.' },
      { icon: <TrendingUp className="h-5 w-5" />, title: 'Mercati ad alto valore', desc: 'Svizzera, Giappone, USA e alcune piazze asiatiche (Hong Kong, Singapore, Corea) pagano prezzi medi più alti.' },
    ],
  },
  {
    kind: 'column',
    kicker: '2024–2025',
    title: 'Le tendenze che contano',
    description: 'In parole semplici: le etichette migliori tengono, quelle da prezzo soffrono.',
    items: [
      { icon: <SparklesIcon />, title: 'Bollicine in crescita', desc: 'Le bollicine stanno tirando: aumentano la loro quota rispetto ai vini fermi.' },
      { icon: <LineChart className="h-5 w-5" />, title: 'Consumi non brillanti', desc: 'Gli acquisti nei principali Paesi sono stabili o in leggero calo: si compra meno, ma meglio.' },
      { icon: <FileCheck2 className="h-5 w-5" />, title: 'Regole e costi più pesanti', desc: 'Accise, etichette e logistica incidono di più sul conto economico.' },
    ],
  },
  {
    kind: 'column',
    kicker: 'Ostacoli operativi',
    title: 'Perché è complicato scalare l’export',
    description: 'Margini e tempi si giocano su logistica, canali e compliance.',
    items: [
      { icon: <Ship className="h-5 w-5" />, title: 'Dipendenza logistica', desc: 'Campionature, groupage e pallet multi-paese con costi/tempi variabili e tracking non uniforme.' },
      { icon: <TrendingUp className="h-5 w-5" />, title: 'Margini “a fisarmonica”', desc: 'Sconti, resi, promo e pagamenti allungano il ciclo e comprimono la marginalità.' },
      { icon: <Search className="h-5 w-5" />, title: 'Costo apertura canali', desc: 'Fiere, registrazioni, campioni, PR e viaggi senza garanzia di contatti davvero interessati.' },
      { icon: <TriangleAlert className="h-5 w-5" />, title: 'Compliance complessa', desc: 'Accise/e-DAS, HS code, requisiti sanitari, COLA/Prior Notice (USA): un errore blocca la spedizione.' },
    ],
  },
  {
    kind: 'column',
    kicker: 'Nuove prospettive',
    title: 'Cambiare assetto, non prodotto',
    description: 'La leva è organizzativa: come ci si presenta, come si spedisce, come si misura.',
    items: [
      { icon: <Globe2 className="h-5 w-5" />, title: 'Mercati ad alto valore', desc: 'Presidiare piazze dove il prezzo medio regge: USA, Svizzera, Giappone e hub asiatici.' },
      { icon: <ShoppingCart className="h-5 w-5" />, title: 'Funnel campioni → ordini', desc: 'Meno attriti su spedizioni prova e richieste d’offerta; tempi e conversione sotto controllo.' },
      { icon: <FileCheck2 className="h-5 w-5" />, title: 'Standard di compliance', desc: 'Checklist per destinazione per ridurre blocchi e costi nascosti.' },
    ],
  },
  {
    kind: 'column',
    kicker: 'Approccio',
    title: 'Ridurre rischio, tempi e dispersioni',
    description: 'Non serve un nuovo canale: serve un metodo unico che unisca domanda qualificata e operatività.',
    items: [
      { icon: <Users2 className="h-5 w-5" />, title: 'Matchmaking verificato', desc: 'Contatti filtrati per stile, fascia prezzo, volumi e canali di vendita.' },
      { icon: <FileCheck2 className="h-5 w-5" />, title: 'Documenti a norma “by default”', desc: 'Proforma, accise e pratiche Paese pronti prima del ritiro.' },
      { icon: <Route className="h-5 w-5" />, title: 'Logistica multi-rotta', desc: 'Campioni, express o pallet con scelta tratta per costo e tempi; tracking unificato.' },
      { icon: <LineChart className="h-5 w-5" />, title: 'KPI e feedback loop', desc: 'Tempi medi, win-rate, prezzo medio per mercato e alert su marginalità.' },
    ],
  },
  {
    kind: 'cta',
    title: 'Grazie per essere arrivati fin qui.',
    // niente bullets, solo contatto e 1 CTA
    primary: { label: 'Prenota un confronto', href: '#' },
    secondary: { label: 'Gianluca Laudante, Wine Export Manager', href: '#' },
  },
];

/* Piccola icona “sparkles” neutra (per non importare librerie extra) */
function SparklesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2l1.6 3.8L18 7.4l-3.4 2.2L15.6 14 12 11.9 8.4 14l1-4.4L6 7.4l4.4-1.6L12 2z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 16l.8 1.9L8 18.7l-1.7 1  .5 2.2L5 20.5l-1.8 1.4.5-2.2L2 18.7l2.2-.8L5 16z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/* ===================== PAGINA ===================== */
export default function PresentationPage() {
  const [i, setI] = React.useState(0);
  const [grid, setGrid] = React.useState(false);
  const [fs, setFs] = React.useState(false);

  const total = slides.length;
  const clamp = (n: number) => Math.max(0, Math.min(total - 1, n));
  const go = (dir: number) => setI((v) => clamp(v + dir));
  const goto = (idx: number) => setI(clamp(idx));

  // keyboard
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (grid) { if (e.key === 'Escape') setGrid(false); return; }
      if (e.key === 'ArrowRight' || e.key === 'PageDown') go(1);
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(-1);
      if (e.key.toLowerCase() === 'g') setGrid((v) => !v);
      if (e.key.toLowerCase() === 'f') toggleFs();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [grid]);

  // swipe
  const startX = React.useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (startX.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    startX.current = null;
  };

  // fullscreen
  const toggleFs = async () => {
    const el: any = document.documentElement;
    if (!document.fullscreenElement) { await el.requestFullscreen?.(); setFs(true); }
    else { await document.exitFullscreen?.(); setFs(false); }
  };

  return (
    <main
      className="min-h-[100svh] antialiased font-sans text-slate-100 selection:bg-white/20"
      style={{
        background: `radial-gradient(140% 140% at 50% -10%, ${BG_DARK} 0%, ${BG_DARK_2} 60%, #000 140%)`,
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Header neutro */}
      <header className="sticky top-0 z-50 border-b border-white/15 bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-black/20">
        <div className="mx-auto max-w-[1200px] px-4 h-14 flex items-center justify-between">
          <div className="text-white/90 font-extrabold tracking-tight">Una fotografia del mercato</div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={() => setGrid((v) => !v)} title="Indice (G)" className="rounded-lg hover:bg-white/10 p-2">
              {grid ? <X className="h-5 w-5" /> : <LayoutGrid className="h-5 w-5" />}
            </button>
            <button onClick={toggleFs} title="Fullscreen (F)" className="rounded-lg hover:bg-white/10 p-2">
              {fs ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {/* progress bianco */}
        <div className="h-1 bg-white/15">
          <div className="h-1" style={{ width: `${((i + 1) / total) * 100}%`, background: WHITE }} />
        </div>
      </header>

      {/* Viewport compatto (come SPST): 16:9 su desktop */}
      <section className="mx-auto max-w-[1400px] px-4 py-4 md:py-6">
        <div
          className="
            relative mx-auto w-full rounded-2xl border overflow-hidden
            h-[calc(100svh-56px-4px-2rem)] md:h-auto md:max-w-[1200px] md:aspect-[16/9]
            shadow-[0_8px_30px_rgba(0,0,0,.35)]
          "
          style={{
            borderColor: BORDER,
            background: `linear-gradient(180deg, ${GLASS_TOP}, ${GLASS_BOTTOM})`,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          {/* Nav mobile */}
          <div className="md:hidden absolute inset-x-0 bottom-3 flex items-center justify-between px-3 pointer-events-none">
            <button className="pointer-events-auto p-3 rounded-xl bg-black/50 border border-white/15 backdrop-blur hover:bg-white/10" onClick={() => go(-1)} title="Indietro">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button className="pointer-events-auto p-3 rounded-xl bg-black/50 border border-white/15 backdrop-blur hover:bg-white/10" onClick={() => go(1)} title="Avanti">
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          {/* Nav desktop */}
          <button className="hidden md:inline-flex absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-black/30 border border-white/15 hover:bg-white/10" onClick={() => go(-1)} title="Indietro">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button className="hidden md:inline-flex absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-black/30 border border-white/15 hover:bg-white/10" onClick={() => go(1)} title="Avanti">
            <ArrowRight className="h-5 w-5" />
          </button>

          {/* Slide */}
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 md:p-0 overflow-auto md:overflow-hidden"
              onClick={() => go(1)}
            >
              <SlideRenderer slide={slides[i]} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Index grid */}
        <AnimatePresence>
          {grid && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 grid gap-3 grid-cols-2 md:grid-cols-3">
              {slides.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => { goto(idx); setGrid(false); }}
                  className="text-left rounded-xl p-3 sm:p-4 hover:bg-white/[0.08] transition"
                  style={{ border: `1px solid ${BORDER}`, background: `linear-gradient(180deg, ${GLASS_TOP}, ${GLASS_BOTTOM})` }}
                >
                  <div className="text-[11px] text-white/70 mb-1">Slide {idx + 1}</div>
                  <Preview slide={s} />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Helper */}
        <div className="mt-4 text-center text-white/80 text-[11px] sm:text-xs">
          Usa <kbd className="px-1 py-[2px] bg-white/15 rounded">←</kbd> / <kbd className="px-1 py-[2px] bg-white/15 rounded">→</kbd>, <kbd className="px-1 py-[2px] bg-white/15 rounded">G</kbd> per indice, <kbd className="px-1 py-[2px] bg-white/15 rounded">F</kbd> per fullscreen.
        </div>
      </section>
    </main>
  );
}

/* ---------------- RENDERER ---------------- */
function SlideRenderer({ slide }: { slide: Slide }) {
  if (slide.kind === 'title') {
    return (
      <div className="w-full h-full grid place-items-center p-4 sm:p-6 text-center">
        <div className="max-w-[80ch] px-1">
          {slide.kicker && <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-white/90">{slide.kicker}</div>}
          <h1 className="mt-1 text-[26px] sm:text-[34px] md:text-[44px] font-black leading-tight">{slide.title}</h1>
          {slide.subtitle && <p className="mt-3 text-white/95 text-[14px] sm:text-base">{slide.subtitle}</p>}
        </div>
      </div>
    );
  }

  if (slide.kind === 'column') {
    return (
      <div className="w-full h-full p-4 sm:p-6 md:p-10">
        <div className="mx-auto max-w-[980px] md:h-full md:flex md:flex-col md:justify-center">
          <div className="mb-3 sm:mb-4">
            {slide.kicker && <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-white/90">{slide.kicker}</div>}
            <h2 className="text-[22px] sm:text-[28px] md:text-[34px] font-black">
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(90deg, ${WHITE}, ${ACCENT_LIGHT})` }}>
                {slide.title}
              </span>
            </h2>
            {slide.description && <p className="text-white/90 mt-2 text-[14px] sm:text-[15px]">{slide.description}</p>}
            <div className="mt-3 h-[2px] w-24 rounded-full" style={{ backgroundImage: `linear-gradient(90deg, ${ACCENT_LIGHT}, transparent)` }} />
          </div>

          {slide.items && (
            <div className="grid grid-cols-1 gap-3">
              {slide.items.map((it, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl p-4 sm:p-5"
                  style={{
                    border: `1px solid ${BORDER}`,
                    background: `linear-gradient(180deg, ${GLASS_TOP}, ${GLASS_BOTTOM})`,
                    backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                  }}
                >
                  <div className="flex items-start gap-3">
                    {it.icon && (
                      <div className="w-9 h-9 sm:w-10 sm:h-10 grid place-items-center rounded-xl bg-white/10 border border-white/15 shrink-0 text-white">
                        {it.icon}
                      </div>
                    )}
                    <div>
                      <div className="font-extrabold text-[15px] sm:text-base text-white">{it.title}</div>
                      {it.desc && <div className="text-white/90 text-[13px] sm:text-sm">{it.desc}</div>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* callout neutro opzionale */}
          {slide.title.includes('metodo') && (
            <div className="mt-4">
              <a
                href="#"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold border transition text-sm"
                style={{ borderColor: 'rgba(255,255,255,.9)', color: WHITE }}
              >
                <MessageSquareMore className="h-4 w-4" />
                Approfondisci l’approccio operativo
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (slide.kind === 'cta') {
    return (
      <div className="w-full h-full grid place-items-center p-4 sm:p-6 text-center">
        <div className="max-w-[70ch]">
          <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-black">{slide.title}</h2>

          {/* Contatto singolo */}
          <div className="mt-4 text-white/95 text-[15px] sm:text-base font-semibold">
            Gianluca Laudante, Wine Export Manager
          </div>

          <div className="mt-6 flex items-center justify-center">
            <a
              href="#"
              className="px-5 py-2.5 rounded-full font-bold text-[#0f1720] transition-all duration-200 hover:-translate-y-[1px] active:translate-y-[1px]"
              style={{ background: WHITE, boxShadow: '0 0 0 2px rgba(255,255,255,.15)' }}
            >
              Prenota un confronto
            </a>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function Preview({ slide }: { slide: Slide }) {
  if (slide.kind === 'title') return <div className="font-semibold">Intro</div>;
  if (slide.kind === 'column') {
    return (
      <div>
        <div className="font-semibold">{slide.title}</div>
        {slide.items && <div className="text-white/70 text-[11px]">{slide.items.map((i) => i.title).join(' • ')}</div>}
      </div>
    );
  }
  if (slide.kind === 'cta') return <div className="font-semibold">{slide.title}</div>;
  return null;
}
