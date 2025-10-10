// app/(wineconnect)/presentazione/page.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Maximize2, Minimize2,
  LayoutGrid, X, TriangleAlert, Ship, Globe2,
  Route, FileCheck2, TrendingUp, Building2,
  LineChart, MessageSquareMore, ShoppingCart,
  Users2, BadgeCheck, Handshake, Search, Palette
} from 'lucide-react';

/* ===================== THEME SET =====================
 * A: Rosso dominante, dettagli blu (solido)
 * B: Rosso con glass + glow
 * C: Rosso scuro + blu elettrico (accent più brillante)
 * Puoi cambiare i colori qui e vedere l’effetto live.
 */
const THEMES = [
  {
    id: 'A',
    name: 'Rosso Solido',
    vars: {
      '--wc-primary': '#E33955',      // rosso main
      '--wc-accent' : '#1c3e5e',      // blu dettagli
      '--wc-bg1'    : '#0a1722',      // sfondo scuro
      '--wc-bg2'    : '#000000',
      '--wc-card'   : 'rgba(255,255,255,0.03)',
      '--wc-border' : 'rgba(255,255,255,0.10)',
      '--wc-ring'   : 'rgba(227,57,85,0.35)',
      '--wc-shadow' : '0 8px 30px rgba(0,0,0,.25)',
      '--wc-radius' : '16px',
      '--wc-underline': 'linear-gradient(90deg, var(--wc-primary), transparent)',
      '--wc-progress' : 'linear-gradient(90deg, var(--wc-primary), transparent)',
      '--wc-gradient' : 'radial-gradient(140% 140% at 50% -10%, var(--wc-accent) 0%, var(--wc-bg1) 60%, var(--wc-bg2) 140%)',
    },
  },
  {
    id: 'B',
    name: 'Rosso Glass',
    vars: {
      '--wc-primary': '#E33955',
      '--wc-accent' : '#1c3e5e',
      '--wc-bg1'    : '#0a1722',
      '--wc-bg2'    : '#000000',
      '--wc-card'   : 'rgba(255,255,255,0.05)',
      '--wc-border' : 'rgba(255,255,255,0.12)',
      '--wc-ring'   : 'rgba(227,57,85,0.45)',
      '--wc-shadow' : '0 12px 40px rgba(0,0,0,.35)',
      '--wc-radius' : '20px',
      '--wc-underline': 'linear-gradient(90deg, var(--wc-primary), white)',
      '--wc-progress' : 'linear-gradient(90deg, white, var(--wc-primary))',
      '--wc-gradient' : 'radial-gradient(140% 140% at 50% -10%, #112433 0%, var(--wc-bg1) 55%, var(--wc-bg2) 140%)',
    },
  },
  {
    id: 'C',
    name: 'Rosso + Blu Elettrico',
    vars: {
      '--wc-primary': '#E33955',
      '--wc-accent' : '#2f79b7',      // blu più brillante
      '--wc-bg1'    : '#071018',
      '--wc-bg2'    : '#000000',
      '--wc-card'   : 'rgba(255,255,255,0.04)',
      '--wc-border' : 'rgba(255,255,255,0.14)',
      '--wc-ring'   : 'rgba(47,121,183,0.45)',
      '--wc-shadow' : '0 16px 50px rgba(0,0,0,.38)',
      '--wc-radius' : '24px',
      '--wc-underline': 'linear-gradient(90deg, var(--wc-accent), var(--wc-primary))',
      '--wc-progress' : 'linear-gradient(90deg, var(--wc-accent), transparent)',
      '--wc-gradient' : 'radial-gradient(140% 140% at 50% -10%, #123a57 0%, var(--wc-bg1) 55%, var(--wc-bg2) 140%)',
    },
  },
] as const;

type ThemeId = typeof THEMES[number]['id'];

/* ===================== ASSETS ===================== */
const LOGO_PNG = '/wc-logo.png';
const LOGO_SVG = '/wc-logo.svg'; // opzionale se presente

/* ===================== LINK CTA ===================== */
const CTA_WINE_URL = 'https://www.wearewineconnect.com/apply/winery';
const TUTORIAL_URL = 'https://www.wearewineconnect.com';

/* ===================== SLIDES ===================== */
type Slide =
  | { kind: 'title'; kicker?: string; title: React.ReactNode; subtitle?: string }
  | { kind: 'column'; kicker?: string; title: string; description?: string; items?: Array<{ icon?: React.ReactNode; title: string; desc?: string }> }
  | { kind: 'cta'; title: string; bullets?: string[]; primary: { label: string; href: string }; secondary?: { label: string; href: string } };

const slides: Slide[] = [
  {
    kind: 'title',
    kicker: 'Marketplace B2B + Logistica integrata',
    title: (
      <>
        Il tuo vino incontra i{' '}
        <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(90deg, var(--wc-primary), var(--wc-accent))` }}>
          buyer giusti
        </span>
        .
      </>
    ),
    subtitle:
      'Wine Connect collega cantine italiane e buyer qualificati, gestendo campionature, ordini e compliance — con logistica SPST integrata e assistenza reale.',
  },
  {
    kind: 'column',
    kicker: 'I problemi reali',
    title: 'Perché vendere B2B all’estero è difficile',
    description:
      'Senza rete, metodo e documenti corretti si spreca tempo e si perdono margini: i deal si allungano, le spedizioni si bloccano.',
    items: [
      { icon: <Search className="h-5 w-5" />, title: 'Trovare i buyer giusti', desc: 'Qualificarli, capire volumi, canali e affidabilità richiede tempo.' },
      { icon: <TriangleAlert className="h-5 w-5" />, title: 'Compliance complessa', desc: 'Accise, COLA/Prior Notice, e-DAS, etichettatura: basta un errore per fermare tutto.' },
      { icon: <Ship className="h-5 w-5" />, title: 'Logistica non standard', desc: 'Campionature, pallet, multi-paese: costi e tempi cambiano a seconda della rotta.' },
    ],
  },
  {
    kind: 'column',
    kicker: 'Come funziona',
    title: 'Dal match all’ordine, in 4 step',
    description:
      'Un funnel chiaro per trasformare interesse in ordini, con visibilità e tracciamento end-to-end.',
    items: [
      { icon: <Users2 className="h-5 w-5" />, title: '1) Onboarding & profilo', desc: 'Crei il profilo cantina o buyer con target, listini e preferenze.' },
      { icon: <Handshake className="h-5 w-5" />, title: '2) Matchmaking', desc: 'Connessioni adatte al tuo posizionamento e ai mercati target.' },
      { icon: <ShoppingCart className="h-5 w-5" />, title: '3) Campionature & RFQ', desc: 'Carrello campionature e richieste d’offerta con condizioni chiare.' },
      { icon: <Route className="h-5 w-5" />, title: '4) Ordine & spedizione', desc: 'Logistica SPST integrata: documenti, ritiro, tracking e consegna.' },
    ],
  },
  {
    kind: 'column',
    kicker: 'La Piattaforma',
    title: 'Un’unica piattaforma per tutto',
    description:
      'Catalogo digitale, shortlist, messaggistica, carrello campionature e documenti pronti: meno email, più controllo.',
    items: [
      { icon: <Building2 className="h-5 w-5" />, title: 'Dashboard cantine & buyer', desc: 'Anagrafiche, listini, disponibilità, preferenze e mercati di interesse.' },
      { icon: <FileCheck2 className="h-5 w-5" />, title: 'Documenti a norma', desc: 'Proforma/Commercial, COLA waiver, Prior Notice, e-DAS, dichiarazioni export.' },
      { icon: <LineChart className="h-5 w-5" />, title: 'KPI & funnel', desc: 'Tasso di risposta, conversione campioni→ordini, tempi medi e marginalità.' },
      { icon: <MessageSquareMore className="h-5 w-5" />, title: 'Assistenza integrata', desc: 'Supporto reale via chat/WhatsApp/telefono quando serve.' },
    ],
  },
  {
    kind: 'column',
    kicker: 'Perché Wine Connect',
    title: 'Rete, metodo e execution',
    description:
      'Un network qualificato e regole chiare per chiudere accordi più velocemente — con logistica già pronta a scalare.',
    items: [
      { icon: <BadgeCheck className="h-5 w-5" />, title: 'Buyer qualificati', desc: 'Verifiche su società, storico acquisti e mercati serviti.' },
      { icon: <Globe2 className="h-5 w-5" />, title: 'Mercati prioritari', desc: 'UK, USA, UE e Asia (Korea, Hong Kong, Singapore) con regole paese preimpostate.' },
      { icon: <TrendingUp className="h-5 w-5" />, title: 'Time-to-deal ridotto', desc: 'Dati e processi per accorciare il ciclo di vendita e difendere i margini.' },
    ],
  },
  {
    kind: 'cta',
    title: 'Pronto a connetterti?',
    bullets: ['Buyer verificati', 'Campionature veloci', 'Compliance e logistica integrate'],
    primary: { label: 'Registra la Cantina', href: CTA_WINE_URL },
    secondary: { label: 'Scopri la piattaforma', href: TUTORIAL_URL },
  },
];

/* ===================== PAGE ===================== */
export default function PresentationPage() {
  const [i, setI] = React.useState(0);
  const [grid, setGrid] = React.useState(false);
  const [fs, setFs] = React.useState(false);
  const [theme, setTheme] = React.useState<ThemeId>('A');

  const current = React.useMemo(() => THEMES.find(t => t.id === theme)!, [theme]);
  const styleVars = current.vars as React.CSSProperties;

  const total = slides.length;
  const clamp = (n: number) => Math.max(0, Math.min(total - 1, n));
  const go = (dir: number) => setI((v) => clamp(v + dir));
  const goto = (idx: number) => setI(clamp(idx));

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (grid) {
        if (e.key === 'Escape') setGrid(false);
        return;
      }
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
    if (!document.fullscreenElement) {
      await el.requestFullscreen?.();
      setFs(true);
    } else {
      await document.exitFullscreen?.();
      setFs(false);
    }
  };

  return (
    <main
      className="min-h-[100svh] antialiased font-sans text-slate-100"
      style={{
        ...styleVars,
        background: `var(--wc-gradient)`,
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[color:var(--wc-border)] bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-black/20">
        <div className="mx-auto max-w-[1200px] px-4 h-14 flex items-center justify-between gap-3">
          <a href="/" className="flex items-center gap-2 text-white font-extrabold">
            <picture>
              <source srcSet={LOGO_SVG} type="image/svg+xml" />
              <img src={LOGO_PNG} alt="Wine Connect" className="h-7 w-auto object-contain" />
            </picture>
            <span className="hidden sm:inline">Wine Connect</span>
          </a>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* THEME SWITCHER */}
            <div className="hidden md:flex items-center gap-1 pr-1 mr-1 border-r border-[color:var(--wc-border)]">
              <span className="text-xs text-white/70 mr-1 flex items-center gap-1"><Palette className="h-4 w-4" /> Stile</span>
              {THEMES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`px-2 py-1 rounded-md text-xs font-semibold hover:bg-white/10 border border-transparent ${theme === t.id ? 'bg-white/10 border-[color:var(--wc-border)]' : ''}`}
                  title={t.name}
                >
                  {t.id}
                </button>
              ))}
            </div>

            <button onClick={() => setGrid((v) => !v)} title="Indice (G)" className="rounded-lg hover:bg-white/10 p-2">
              {grid ? <X className="h-5 w-5" /> : <LayoutGrid className="h-5 w-5" />}
            </button>
            <button onClick={toggleFs} title="Fullscreen (F)" className="rounded-lg hover:bg-white/10 p-2">
              {fs ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* progress */}
        <div className="h-1" style={{ background: 'rgba(255,255,255,.06)' }}>
          <div
            className="h-1"
            style={{
              width: `${((i + 1) / slides.length) * 100}%`,
              backgroundImage: 'var(--wc-progress)',
            }}
          />
        </div>
      </header>

      {/* Viewport */}
      <section className="mx-auto max-w-[1400px] px-4 py-4 md:py-6">
        <div
          className="relative mx-auto w-full overflow-hidden"
          style={{
            borderRadius: 'var(--wc-radius)',
            border: '1px solid var(--wc-border)',
            background: 'var(--wc-card)',
            boxShadow: 'var(--wc-shadow)',
            height: 'calc(100svh - 56px - 4px - 2rem)',
          }}
        >
          {/* Nav: mobile bottom, desktop laterali */}
          <div className="md:hidden absolute inset-x-0 bottom-3 flex items-center justify-between px-3 pointer-events-none">
            <button
              className="pointer-events-auto p-3 rounded-xl bg-black/40 border border-[color:var(--wc-border)] backdrop-blur hover:bg-white/10"
              onClick={() => go(-1)} title="Indietro"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              className="pointer-events-auto p-3 rounded-xl bg-black/40 border border-[color:var(--wc-border)] backdrop-blur hover:bg-white/10"
              onClick={() => go(1)} title="Avanti"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          <button
            className="hidden md:inline-flex absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-black/30 border border-[color:var(--wc-border)] hover:bg-white/10"
            onClick={() => go(-1)} title="Indietro"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            className="hidden md:inline-flex absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-black/30 border border-[color:var(--wc-border)] hover:bg-white/10"
            onClick={() => go(1)} title="Avanti"
          >
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
                  className="text-left p-3 sm:p-4 transition"
                  style={{
                    borderRadius: 'calc(var(--wc-radius) - 4px)',
                    border: '1px solid var(--wc-border)',
                    background: 'var(--wc-card)',
                  }}
                >
                  <div className="text-[11px] text-white/60 mb-1">Slide {idx + 1}</div>
                  <Preview slide={s} />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Helper comandi tastiera */}
        <div className="mt-4 text-center text-white/60 text-[11px] sm:text-xs">
          Usa <kbd className="px-1 py-[2px] bg-white/10 rounded">←</kbd> / <kbd className="px-1 py-[2px] bg-white/10 rounded">→</kbd>,{' '}
          <kbd className="px-1 py-[2px] bg-white/10 rounded">G</kbd> per indice, <kbd className="px-1 py-[2px] bg-white/10 rounded">F</kbd> per fullscreen.
        </div>
      </section>
    </main>
  );
}

/* ---------------- RENDERERS ---------------- */
function SlideRenderer({ slide }: { slide: Slide }) {
  if (slide.kind === 'title') {
    return (
      <div className="w-full h-full grid place-items-center p-4 sm:p-6 text-center">
        <div className="max-w-[80ch] px-1">
          {slide.kicker && <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-white/70">{slide.kicker}</div>}
          <h1 className="mt-1 text-[26px] sm:text-[34px] md:text-[44px] font-black leading-tight">{slide.title}</h1>
          {slide.subtitle && <p className="mt-3 text-white/80 text-[14px] sm:text-base">{slide.subtitle}</p>}
        </div>
      </div>
    );
  }

  if (slide.kind === 'column') {
    return (
      <div className="w-full h-full p-4 sm:p-6 md:p-10">
        <div className="mx-auto max-w-[980px] md:h-full md:flex md:flex-col md:justify-center">
          <div className="mb-3 sm:mb-4">
            {slide.kicker && <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-white/70">{slide.kicker}</div>}
            <h2 className="text-[22px] sm:text-[28px] md:text-[34px] font-black">
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(90deg, var(--wc-primary), #fff)` }}>
                {slide.title}
              </span>
            </h2>
            {slide.description && <p className="text-white/80 mt-2 text-[14px] sm:text-[15px]">{slide.description}</p>}
            <div className="mt-3 h-[2px] w-20 rounded-full opacity-80" style={{ backgroundImage: 'var(--wc-underline)' }} />
          </div>

          {slide.items && (
            <div className="grid grid-cols-1 gap-3">
              {slide.items.map((it, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 sm:p-5"
                  style={{
                    borderRadius: 'var(--wc-radius)',
                    border: '1px solid var(--wc-border)',
                    background: 'var(--wc-card)',
                  }}
                >
                  <div className="flex items-start gap-3">
                    {it.icon && (
                      <div className="w-9 h-9 sm:w-10 sm:h-10 grid place-items-center shrink-0"
                        style={{
                          borderRadius: '12px',
                          border: '1px solid var(--wc-border)',
                          background: 'rgba(255,255,255,0.05)'
                        }}>
                        {it.icon}
                      </div>
                    )}
                    <div>
                      <div className="font-extrabold text-[15px] sm:text-base">{it.title}</div>
                      {it.desc && <div className="text-white/75 text-[13px] sm:text-sm">{it.desc}</div>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* link tutorial per la slide Piattaforma */}
          {slide.title.includes('Un’unica piattaforma') && (
            <div className="mt-4">
              <a
                href={TUTORIAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold border border-white/30 hover:bg-white/10 transition text-sm"
                style={{ borderColor: 'var(--wc-border)' }}
              >
                <MessageSquareMore className="h-4 w-4" />
                Scopri la piattaforma
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
          {slide.bullets && (
            <ul className="mt-3 text-white/80 text-[14px] sm:text-[15px]">
              {slide.bullets.map((b, i) => (<li key={i}>• {b}</li>))}
            </ul>
          )}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={slide.primary.href}
              className="px-4 py-2 rounded-full font-bold text-[#0f1720] transition-all duration-200 hover:-translate-y-[1px] active:translate-y-[1px]"
              style={{
                background: 'var(--wc-primary)',
                boxShadow: '0 0 0 2px rgba(227,57,85,.20)',
                outline: '2px solid transparent',
              }}
            >
              {slide.primary.label}
            </a>
            {slide.secondary && (
              <a
                href={slide.secondary.href}
                className="px-4 py-2 rounded-full font-bold transition-all duration-200 hover:-translate-y-[1px] active:translate-y-[1px]"
                style={{
                  border: '1px solid var(--wc-border)',
                  background: 'transparent',
                }}
              >
                {slide.secondary.label}
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function Preview({ slide }: { slide: Slide }) {
  if (slide.kind === 'title') return <div className="font-semibold">Intro</div>;
  if (slide.kind === 'column')
    return (
      <div>
        <div className="font-semibold">{slide.title}</div>
        {slide.items && <div className="text-white/70 text-[11px]">{slide.items.map((i) => i.title).join(' • ')}</div>}
      </div>
    );
  if (slide.kind === 'cta') return <div className="font-semibold">{slide.title}</div>;
  return null;
}
