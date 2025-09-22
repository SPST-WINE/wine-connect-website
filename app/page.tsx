'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';

/* ===================== PALETTE ===================== */
const WC_BLUE = '#0a1722';
const WC_BLUE_SOFT = '#1c3e5e';
const WC_PINK = '#E33955';

/* Assets in /public */
const LOGO_PNG = '/wc-logo.png';
const LOGO_SVG = '/wc-logo.svg'; // opzionale (fallback automatico via <source>)

/* ===================== I18N ===================== */
const I18N = {
  it: {
    hero_kicker: 'La scorciatoia tra chi produce e chi compra',
    hero_title_a: 'Matchmaking su misura.',
    hero_title_b: 'Documenti e spedizioni già integrati.',
    hero_desc:
      'Colleghiamo cantine italiane e buyer internazionali per stile, fascia prezzo e volumi. Con SPST gestiamo accise, burocrazia e logistica end-to-end: meno attrito, più ordini.',
    buyers: {
      kicker: 'Per i Buyer',
      title: 'Cantine italiane selezionate',
      points: [
        'Brief → Shortlist → Kit degustazione',
        'Prezzi allineati al tuo FOB',
        'Documenti, dazi e spedizioni gestiti',
      ],
      cta1: 'Wine Connect for Buyers',
      cta2: 'Come funziona',
    },
    wineries: {
      kicker: 'Per le Cantine',
      title: 'Nuovi mercati, meno attrito',
      points: [
        'Buyer qualificati per stile e prezzo',
        'Accise, COLA, e-DAS, HS Code gestiti',
        'Spedizioni ottimizzate e tracking',
      ],
      cta1: 'Wine Connect for Wineries',
      cta2: 'Come funziona',
    },
    how: {
      kicker: 'Come funziona',
      steps: [
        {
          t: 'Brief & Criteri',
          d: 'Definiamo stile, denominazioni, volumi e fascia prezzo. Per le cantine: mercati target e disponibilità.',
        },
        {
          t: 'Shortlist & Degustazione',
          d: 'Selezione mirata (no cold email). Tasting kit e feedback strutturato. Dati e punteggi in chiaro.',
        },
        {
          t: 'Ordine & Spedizione',
          d: 'Unico referente: documenti, accise e spedizione (express o pallet). Tracking e reportistica.',
        },
      ],
      cta_b: 'Per i Buyer',
      cta_w: 'Per le Cantine',
    },
    value: {
      kicker: 'Cosa offriamo',
      rows: [
        ['Matching intelligente', 'Allineiamo stile, terroir, riconoscimenti e FOB.'],
        ['Compliance integrata', 'COLA, e-DAS, HS Code, accise: zero sorprese doganali.'],
        ['Logistica ottimizzata', 'Express/campionature o pallet con consolidamento.'],
        ['Un solo referente', 'Un’unica fattura e assistenza reale durante tutto il flusso.'],
      ],
    },
    kpi: {
      kicker: 'Mercati & KPI',
      items: [
        ['50+', 'Cantine pronte'],
        ['20+', 'Buyer qualificati'],
        ['USA, ASIA, UE', 'Mercati attivi'],
      ],
    },
    contact: {
      kicker: 'Parliamone',
      title: 'Richiedi informazioni',
      note: 'Compili in 30 secondi. Rispondiamo in giornata.',
      ok: 'Inviato! Ti ricontatteremo a breve ✅',
      send: 'Invia richiesta',
    },
  },
  en: {
    hero_kicker: 'The shortcut between producers and buyers',
    hero_title_a: 'Tailored matchmaking.',
    hero_title_b: 'Docs and shipping built-in.',
    hero_desc:
      'We match Italian wineries and international buyers by style, price range and volumes. SPST handles excise, paperwork and end-to-end logistics: less friction, more orders.',
    buyers: {
      kicker: 'For Buyers',
      title: 'Curated Italian wineries',
      points: [
        'Brief → Shortlist → Tasting kit',
        'Pricing aligned to your FOB',
        'Docs, duties & shipping handled',
      ],
      cta1: 'Wine Connect for Buyers',
      cta2: 'How it works',
    },
    wineries: {
      kicker: 'For Wineries',
      title: 'New markets, less friction',
      points: [
        'Qualified buyers by style & price',
        'Excise, COLA, e-DAS, HS codes managed',
        'Optimized shipping & live tracking',
      ],
      cta1: 'Wine Connect for Wineries',
      cta2: 'How it works',
    },
    how: {
      kicker: 'How it works',
      steps: [
        {
          t: 'Brief & Criteria',
          d: 'We define styles, appellations, volumes and price points. For wineries: target markets and availability.',
        },
        {
          t: 'Shortlist & Tasting',
          d: 'No cold emails. Tasting kit and structured feedback. Scores and data in the open.',
        },
        {
          t: 'Order & Shipping',
          d: 'Single counterpart: paperwork, excise and shipping (express or pallet). Tracking and reporting.',
        },
      ],
      cta_b: 'For Buyers',
      cta_w: 'For Wineries',
    },
    value: {
      kicker: 'What we offer',
      rows: [
        ['Smart matching', 'We align style, terroir, awards and target FOB.'],
        ['Built-in compliance', 'COLA, e-DAS, HS codes, excise: no customs surprises.'],
        ['Optimized logistics', 'Express/samples or pallet with consolidation.'],
        ['One counterpart', 'One invoice and real assistance throughout.'],
      ],
    },
    kpi: {
      kicker: 'Markets & KPIs',
      items: [
        ['50+', 'Wineries ready'],
        ['20+', 'Qualified buyers'],
        ['USA, ASIA, EU', 'Active markets'],
      ],
    },
    contact: {
      kicker: 'Let’s talk',
      title: 'Request information',
      note: '30 seconds to fill. We reply within a business day.',
      ok: 'Sent! We’ll get back to you shortly ✅',
      send: 'Send request',
    },
  },
} as const;

type Lang = 'it' | 'en';
type RootStyle = React.CSSProperties & Record<'--wc', string>;

/* ===================== PAGE ===================== */
export default function WineConnectHome() {
  const [lang, setLang] = useState<Lang>('it');
  const [sent, setSent] = useState(false);
  const t = I18N[lang];

  useEffect(() => {
    console.assert(['it', 'en'].includes(lang), '[WC] lang key valid');
  }, [lang]);

  const rootStyle: RootStyle = {
    '--wc': WC_PINK,
    background:
      'radial-gradient(140% 140% at 50% -10%, #1c3e5e 0%, #0a1722 60%, #000 140%)',
  };

  return (
    <main className="font-sans text-slate-100 selection:bg-[color:var(--wc)]/30" style={rootStyle}>
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-black/20">
        <div className="mx-auto max-w-[1200px] px-5 h-16 flex items-center justify-between gap-4">
          <a href="#" className="flex items-center gap-2 text-white font-extrabold">
            <picture>
              <source srcSet={LOGO_SVG} type="image/svg+xml" />
              <img src={LOGO_PNG} alt="Wine Connect" className="h-8 w-auto object-contain" />
            </picture>
            <span className="hidden sm:inline">Wine Connect</span>
          </a>
          <button
            onClick={() => setLang(lang === 'it' ? 'en' : 'it')}
            className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-2 text-sm hover:bg-white/5"
            aria-label="Toggle language"
          >
            <Languages size={14} /> {lang.toUpperCase()}
          </button>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden py-12">
        {/* soft glows */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[620px] w-[620px] rounded-full blur-3xl"
          style={{ background: `radial-gradient(60% 60% at 35% 35%, ${WC_PINK}55, transparent 60%)` }}
        />
        <motion.div
          aria-hidden
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.35, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="pointer-events-none absolute -bottom-24 right-1/2 translate-x-1/2 h-[560px] w-[560px] rounded-full blur-3xl"
          style={{ background: `radial-gradient(60% 60% at 70% 70%, ${WC_BLUE_SOFT}66, transparent 60%)` }}
        />

        <div className="mx-auto max-w-[1200px] px-5">
          {/* headline */}
          <div className="text-center mb-8">
            <span className="inline-block text-xs tracking-wider uppercase text-white/70">{t.hero_kicker}</span>
            <h1 className="mt-2 text-[30px] sm:text-[40px] md:text-[56px] font-black leading-[1.05]">
              {t.hero_title_a}
              <span className="block text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(90deg, ${WC_PINK}, ${WC_BLUE_SOFT})` }}>
                {t.hero_title_b}
              </span>
            </h1>
            <p className="mt-3 mx-auto max-w-[70ch] text-white/80 text-[15px] sm:text-base">{t.hero_desc}</p>
          </div>

          {/* split */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-center">
            {/* buyers */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="md:pr-4">
              <div className="uppercase text-white/60 text-sm tracking-wide">{t.buyers.kicker}</div>
              <h2 className="mt-1 text-2xl font-bold">{t.buyers.title}</h2>
              <ul className="mt-3 space-y-2 text-[15px] text-white/80">
                {t.buyers.points.map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span aria-hidden className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--wc)]" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href="#buyers" className="inline-flex items-center justify-center rounded-full bg-[color:var(--wc)] px-5 py-2.5 text-sm font-bold text-[#0f1720] shadow hover:translate-y-[-1px] transition">
                  {t.buyers.cta1}
                </a>
                <a href="#funziona" className="inline-flex items-center justify-center rounded-full border px-5 py-2.5 text-sm font-semibold hover:bg-white/5" style={{ borderColor: `${WC_PINK}55` }}>
                  {t.buyers.cta2}
                </a>
              </div>
            </motion.div>

            {/* center logo with blue badge (static) */}
            <div className="relative grid place-items-center">
              {/* blue badge */}
              <div aria-hidden className="absolute inset-0 -z-10 grid place-items-center">
                <div
                  className="relative w-36 h-36 md:w-48 md:h-48 rounded-full"
                  style={{
                    background: `radial-gradient(60% 60% at 50% 45%, ${WC_BLUE_SOFT}, ${WC_BLUE})`,
                    boxShadow: '0 20px 60px rgba(0,0,0,.35), inset 0 8px 24px rgba(255,255,255,.08)',
                  }}
                >
                  <span
                    className="absolute inset-[-6px] rounded-full"
                    style={{
                      background: 'conic-gradient(from 0deg, rgba(227,57,85,.0), rgba(227,57,85,.5), rgba(227,57,85,.0) 60%)',
                      filter: 'blur(8px)',
                    }}
                  />
                </div>
              </div>

              <div className="relative w-28 h-28 md:w-36 md:h-36 grid place-items-center">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 w-28 md:w-36 h-10 rounded-full"
                  style={{
                    background: 'radial-gradient(60% 50% at 50% 50%, rgba(255,255,255,.25), rgba(255,255,255,0))',
                    filter: 'blur(10px)',
                  }}
                />
                <picture>
                  <source srcSet={LOGO_SVG} type="image/svg+xml" />
                  <img src={LOGO_PNG} alt="Wine Connect" className="w-20 md:w-28 h-auto object-contain drop-shadow-[0_0_30px_rgba(227,57,85,.35)]" />
                </picture>
              </div>
            </div>

            {/* wineries (right-aligned) */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="md:pl-4 text-right">
              <div className="uppercase text-white/60 text-sm tracking-wide">{t.wineries.kicker}</div>
              <h2 className="mt-1 text-2xl font-bold">{t.wineries.title}</h2>
              <ul className="mt-3 space-y-2 text-[15px] text-white/80">
                {t.wineries.points.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 justify-end">
                    <span>{p}</span>
                    <span aria-hidden className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--wc)]" />
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-3 justify-end">
                <a href="#wineries" className="inline-flex items-center justify-center rounded-full border px-5 py-2.5 text-sm font-semibold hover:bg-white/5" style={{ borderColor: `${WC_PINK}55` }}>
                  {t.wineries.cta1}
                </a>
                <a href="#funziona" className="inline-flex items-center justify-center rounded-full bg-[color:var(--wc)] px-5 py-2.5 text-sm font-bold text-[#0f1720] shadow hover:translate-y-[-1px] transition">
                  {t.wineries.cta2}
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== COME FUNZIONA ===== */}
      <section id="funziona" className="py-12">
        <div className="mx-auto max-w-[1200px] px-5">
          <Header kicker={t.how.kicker} title="3 step, un solo referente" gradient />
          <div className="grid gap-4 md:grid-cols-3">
            {t.how.steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ y: 18, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-2xl p-5 border border-white/10 bg-white/[0.03]"
              >
                <div className="text-sm uppercase tracking-wide text-white/60">{String(i + 1).padStart(2, '0')}</div>
                <div className="mt-1 font-extrabold text-lg">{s.t}</div>
                <p className="mt-1 text-white/75 text-sm leading-snug">{s.d}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <a href="#buyers" className="px-5 py-2.5 rounded-full bg-[color:var(--wc)] text-[#0f1720] font-bold shadow hover:translate-y-[-1px] transition">{t.how.cta_b}</a>
            <a href="#wineries" className="px-5 py-2.5 rounded-full border border-white/20 hover:bg-white/5 font-semibold transition">{t.how.cta_w}</a>
          </div>
        </div>
      </section>

      {/* ===== COSA OFFRIAMO ===== */}
      <section className="py-12">
        <div className="mx-auto max-w-[1200px] px-5">
          <Header kicker={t.value.kicker} title="Operatività, non promesse" />
          <div className="grid gap-3">
            {t.value.rows.map(([title, desc], i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 md:px-6 md:py-5"
              >
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1">
                  <h3 className="font-bold text-white">{title}</h3>
                  <p className="text-white/75 text-sm md:text-[15px]">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== KPI ===== */}
      <section className="py-10">
        <div className="mx-auto max-w-[1200px] px-5">
          <Header kicker={t.kpi.kicker} title="Numeri in chiaro" gradient />
          <div className="grid grid-cols-3 gap-3 text-center">
            {t.kpi.items.map(([n, l], i) => (
              <motion.div key={i} initial={{ y: 8, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <div className="text-2xl font-extrabold">{n}</div>
                <div className="text-xs text-white/70">{l}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTATTI ===== */}
      <section id="contatti" className="py-12">
        <div className="mx-auto max-w-[820px] px-5">
          <Header kicker={t.contact.kicker} title={t.contact.title} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="rounded-2xl p-5 grid gap-4 border border-white/10 bg-white/[0.04]"
          >
            <Field label={lang === 'it' ? 'Azienda' : 'Company'}>
              <input required placeholder={lang === 'it' ? 'Cantina / Azienda' : 'Winery / Company'} className="bg-transparent outline-none w-full placeholder:text-white/40" />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Email">
                <input required type="email" placeholder="name@company.com" className="bg-transparent outline-none w-full placeholder:text-white/40" />
              </Field>
              <Field label={lang === 'it' ? 'Telefono' : 'Phone (optional)'}>
                <input inputMode="tel" placeholder="+39 ..." className="bg-transparent outline-none w-full placeholder:text-white/40" />
              </Field>
            </div>
            <button className="mt-1 h-12 rounded-xl font-semibold text-base text-[#0f1720] w-full transition-all duration-200 hover:-translate-y-[1px] active:translate-y-[1px] hover:shadow-[0_0_0_2px_rgba(227,57,85,.25)]" style={{ background: WC_PINK }}>
              {t.contact.send}
            </button>
            <div className="text-[11px] text-white/60 text-center">{t.contact.note}</div>
            {sent && <div className="text-[12px] text-emerald-400 text-center">{t.contact.ok}</div>}
          </form>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-8">
        <div className="mx-auto max-w-[1200px] px-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a className="flex items-center gap-2 text-white font-extrabold" href="#">
            <picture>
              <source srcSet={LOGO_SVG} type="image/svg+xml" />
              <img src={LOGO_PNG} alt="Wine Connect" className="h-7 w-auto" />
            </picture>
            <span className="sr-only">Wine Connect</span>
          </a>
          <small className="text-white/80 leading-tight text-center sm:text-right">
            © {new Date().getFullYear()} Wine Connect — SPST · VAT IT03218840647
          </small>
        </div>
      </footer>
    </main>
  );
}

/* ===================== UI helpers ===================== */

function Header({ kicker, title, gradient = false }: { kicker: string; title: string; gradient?: boolean }) {
  return (
    <div className="pb-5 text-center md:text-left">
      <div className="text-[11px] tracking-wider uppercase text-white/60">{kicker}</div>
      <h2 className="relative text-[26px] sm:text-[30px] md:text-[36px] font-black mt-1">
        <span
          className={gradient ? 'bg-clip-text text-transparent' : ''}
          style={gradient ? { backgroundImage: `linear-gradient(90deg, ${WC_PINK}, #fff)` } : undefined}
        >
          {title}
        </span>
      </h2>
      <div className="mt-2 h-[3px] w-24 rounded-full" style={{ backgroundImage: `linear-gradient(90deg, ${WC_PINK}, transparent)` }} />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="group grid gap-1">
      <div className="text-[11px] text-white/60">{label}</div>
      <div className="flex items-center gap-2 rounded-xl px-3 py-3 bg-black/30 border border-white/10 ring-0 focus-within:ring-1 focus-within:ring-white/30">
        {children}
      </div>
    </label>
  );
}
