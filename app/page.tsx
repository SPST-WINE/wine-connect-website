'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Languages, TriangleAlert, Ship, Globe2, Route, FileCheck2, TrendingUp, Building2, Mail, Phone } from 'lucide-react';

/* ===================== THEME ===================== */
const WC_BLUE = '#0a1722';
const WC_BLUE_SOFT = '#1c3e5e';
const WC_PINK = '#E33955';

// preferisci SVG con fallback PNG, entrambi in /public
const LOGO_SVG = '/wc-logo.svg';
const LOGO_PNG = '/wc-logo.png';

/* ===================== I18N ===================== */
const I18N = {
  it: {
    nav: ['Come funziona', 'Servizi', 'Per chi', 'Perché Wine Connect'],
    hero_kicker: 'Matchmaking cantine ↔ buyer',
    hero_title_a: 'Il tuo ponte verso buyer internazionali,',
    hero_title_b: 'senza frizioni.',
    hero_desc:
      'Wine Connect seleziona cantine italiane e le abbina a buyer esteri in base a stile, volume e prezzo. Con SPST gestiamo documenti, accise e spedizioni end-to-end.',
    buyers: {
      kicker: 'Per i Buyer',
      title: 'Cantine italiane selezionate',
      points: [
        'Brief → Shortlist → Kit degustazione',
        'Prezzi allineati al tuo FOB',
        'Documenti e spedizioni gestiti',
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
    problemi_kicker: 'I problemi reali',
    problemi_title: 'Perché è difficile crescere all’estero',
    prob: [
      ['Scouting inefficiente', 'Tanto rumore, pochi contatti qualificati. Email a freddo che non convertono.'],
      ['Documenti complessi', 'e-DAS, HS Code, accise, COLA: errori costano tempo e denaro.'],
      ['Spedizioni incerte', 'Costi e transit time variabili. Temperature, dogana, resi.'],
    ],
    funz_kicker: 'Come funziona',
    funz_title: 'Dalla selezione al tracking, in 3 step',
    step: [
      ['1) Brief & shortlist', 'Profilo buyer → selezione mirata per stile, terroir, punteggi e target FOB.'],
      ['2) Campionature & ordini', 'Kit rapidi con tracking. Un referente per proposte, contratti e prezzi.'],
      ['3) Export & logistica', 'Documenti, accise e spedizione gestiti da SPST. Una fattura, tracking live.'],
    ],
    servizi_kicker: 'Cosa facciamo',
    servizi_title: 'Operatività, non promesse',
    servizi: [
      ['Curazione buyer-first', 'Match solo rilevanti. Filtri per stile, prezzo, volume, denominazione.'],
      ['Documenti & compliance', 'Accise, COLA, Prior Notice, e-DAS. Archiviazione smart e audit-ready.'],
      ['Spedizioni ottimizzate', 'Express / pallet, consolidamenti e soluzioni temperature-safe.'],
      ['Dashboard & supporto', 'Tracking in tempo reale, SLA chiari, WhatsApp dedicato.'],
    ],
    perchi_kicker: 'Per chi',
    perchi_title: 'Cantine, importatori, distributori ed e-commerce',
    vant_kicker: 'Perché Wine Connect',
    vant_title: 'Unico partner, meno attrito, più risultati',
    vant: [
      ['Unico referente', 'Matchmaking + documenti + logistica → meno errori, più velocità.'],
      ['Tariffe & rotte ottimizzate', 'Multi-corriere e selezione dinamica riducono costi e transit time.'],
      ['Assistenza reale', 'Persone vere, canali diretti e KPI condivisi.'],
    ],
    cta2_title: 'Pronto a connetterti con nuovi buyer?',
    cta2_btn1: 'Richiedi una demo',
    cta2_btn2: 'Parla con noi',
    lead_kicker: 'Parliamo della tua azienda',
    lead_title: 'Richiedi informazioni',
    footer_legal: '© SPST SRL · P.IVA IT03218840647 · Sede Legale: Piazzale Gambale 23, Avellino (AV) 83100',
  },
  en: {
    nav: ['How it works', 'Services', 'Who we serve', 'Why Wine Connect'],
    hero_kicker: 'Curated winery ↔ buyer matchmaking',
    hero_title_a: 'Your bridge to international buyers,',
    hero_title_b: 'without friction.',
    hero_desc:
      'Wine Connect matches Italian wineries to qualified buyers by style, volume and price points. SPST handles docs, duties and shipping end-to-end.',
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
        'Qualified buyers by style & price range',
        'Excise, COLA, e-DAS, HS codes fully managed',
        'Optimized shipping & live tracking',
      ],
      cta1: 'Wine Connect for Wineries',
      cta2: 'How it works',
    },
    problemi_kicker: 'Real pain points',
    problemi_title: 'Why growing abroad is hard',
    prob: [
      ['Inefficient scouting', 'Lots of noise, few qualified contacts. Cold emails rarely convert.'],
      ['Complex paperwork', 'e-DAS, HS codes, excise, COLA: mistakes cost time and money.'],
      ['Uncertain shipping', 'Variable costs and transit times. Temperature, customs, returns.'],
    ],
    funz_kicker: 'How it works',
    funz_title: 'From shortlist to tracking in 3 steps',
    step: [
      ['1) Brief & shortlist', 'Buyer profile → focused selection by style, terroir, scores and target FOB.'],
      ['2) Samples & orders', 'Fast tasting kits with tracking. Single counterpart for proposals and contracts.'],
      ['3) Export & logistics', 'Docs, duties and shipping handled by SPST. One invoice, live tracking.'],
    ],
    servizi_kicker: 'What we do',
    servizi_title: 'Operations, not promises',
    servizi: [
      ['Buyer-first curation', 'Only relevant matches. Filters by style, price, volume, appellation.'],
      ['Docs & compliance', 'Excise, COLA, Prior Notice, e-DAS. Smart archiving, audit-ready.'],
      ['Optimized shipping', 'Express / pallets, consolidations and temperature-safe solutions.'],
      ['Dashboard & support', 'Live tracking, clear SLAs, dedicated WhatsApp.'],
    ],
    perchi_kicker: 'Who we serve',
    perchi_title: 'Wineries, importers, distributors & e-commerce',
    vant_kicker: 'Why Wine Connect',
    vant_title: 'One partner, less friction, better results',
    vant: [
      ['Single counterpart', 'Matchmaking + docs + logistics → fewer errors, faster cycles.'],
      ['Optimized rates & routes', 'Multi-carrier dynamic selection lowers costs and transit times.'],
      ['Real assistance', 'Humans, direct channels, shared KPIs.'],
    ],
    cta2_title: 'Ready to connect with new buyers?',
    cta2_btn1: 'Request a demo',
    cta2_btn2: 'Talk to us',
    lead_kicker: 'Tell us about your company',
    lead_title: 'Request information',
    footer_legal: '© SPST SRL · VAT IT03218840647 · Registered office: Piazzale Gambale 23, Avellino 83100, IT',
  },
} as const;

/* ===================== PAGE ===================== */
export default function Home() {
  const [lang, setLang] = useState<'it' | 'en'>('it');
  const t = I18N[lang];

  useEffect(() => {
    console.assert(['it', 'en'].includes(lang), '[WC] lang key valid');
  }, [lang]);

  return (
    <main
      className="font-sans text-slate-100 selection:bg-[color:var(--wc)]/30"
      style={{
        ['--wc']: WC_PINK as any,
        background: 'radial-gradient(140% 140% at 50% -10%, #1c3e5e 0%, #0a1722 60%, #000 140%)',
      }}
    >
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-black/20">
        <div className="mx-auto max-w-[1200px] px-5 h-16 flex items-center justify-between gap-4">
          <a href="#" className="flex items-center gap-2 text-white font-extrabold">
            <picture>
              <source srcSet={LOGO_SVG} type="image/svg+xml" />
              <img src={LOGO_PNG} alt="Wine Connect" className="h-8 w-auto object-contain" />
            </picture>
            <span className="hidden sm:inline">Wine Connect</span>
          </a>

          <nav className="hidden md:flex items-center gap-3 text-[0.95rem] font-semibold">
            {t.nav.map((label, i) => (
              <a key={label} href={['#funziona', '#servizi', '#chi', '#vantaggi'][i]} className="px-2 py-1 rounded-lg hover:bg-white/5 transition-colors">
                {label}
              </a>
            ))}
            <button onClick={() => setLang(lang === 'it' ? 'en' : 'it')} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/15 hover:bg-white/5">
              <Languages size={14} /> {lang.toUpperCase()}
            </button>
          </nav>

          <button
            onClick={() => setLang(lang === 'it' ? 'en' : 'it')}
            className="md:hidden inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-2 text-sm"
          >
            <Languages size={14} /> {lang.toUpperCase()}
          </button>
        </div>
      </header>

      {/* ===== HERO (split Buyers / Wineries, logo centrale) ===== */}
      <section className="relative overflow-hidden py-12">
        {/* soft brand glows */}
        <motion.div aria-hidden initial={{ opacity: 0, y: -10 }} animate={{ opacity: 0.5, y: 0 }} transition={{ duration: 0.8 }}
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[620px] w-[620px] rounded-full blur-3xl"
          style={{ background: `radial-gradient(60% 60% at 35% 35%, ${WC_PINK}55, transparent 60%)` }} />
        <motion.div aria-hidden initial={{ opacity: 0, y: 10 }} animate={{ opacity: 0.35, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          className="pointer-events-none absolute -bottom-24 right-1/2 translate-x-1/2 h-[560px] w-[560px] rounded-full blur-3xl"
          style={{ background: `radial-gradient(60% 60% at 70% 70%, ${WC_BLUE_SOFT}66, transparent 60%)` }} />

        <div className="mx-auto max-w-[1200px] px-5">
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

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-center">
            {/* LEFT: Buyers */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="md:pr-4">
              <div className="text-xs uppercase tracking-wider text-white/60">{t.buyers.kicker}</div>
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

            {/* CENTER: logo */}
            <div className="relative grid place-items-center">
              <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-2xl border border-white/10 bg-black/40 backdrop-blur grid place-items-center shadow-[0_8px_40px_rgba(227,57,85,.25)]">
                <picture>
                  <source srcSet={LOGO_SVG} type="image/svg+xml" />
                  <img src={LOGO_PNG} alt="Wine Connect" className="w-20 md:w-24 h-auto object-contain" />
                </picture>
              </div>
            </div>

            {/* RIGHT: Wineries (right-aligned) */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="md:pl-4 text-right">
              <div className="text-xs uppercase tracking-wider text-white/60">{t.wineries.kicker}</div>
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

      {/* ===== Problemi ===== */}
      <section id="scopri" className="py-10">
        <SectionHeader kicker={t.problemi_kicker} title={t.problemi_title} tone="problem" />
        <div className="mx-auto max-w-[1200px] px-5 grid gap-4 md:grid-cols-3">
          {t.prob.map(([title, desc], i) => (
            <FCard key={i} title={title} text={desc} iconIdx={i} />
          ))}
        </div>
      </section>

      {/* ===== Come funziona ===== */}
      <section id="funziona" className="py-12">
        <SectionHeader kicker={t.funz_kicker} title={t.funz_title} tone="solution" />
        <div className="mx-auto max-w-[1200px] px-5 grid gap-4 md:grid-cols-3">
          {t.step.map(([title, text], i) => (
            <Card key={i} title={title} text={text} iconIdx={i} />
          ))}
        </div>
      </section>

      {/* ===== Cosa facciamo ===== */}
      <section id="servizi" className="py-12">
        <SectionHeader kicker={t.servizi_kicker} title={t.servizi_title} tone="accent" />
        <div className="mx-auto max-w-[1200px] px-5 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {t.servizi.map(([title, text], i) => (
            <Card key={i} title={title} text={text} />
          ))}
        </div>
      </section>

      {/* ===== Per chi ===== */}
      <section id="chi" className="py-12">
        <SectionHeader kicker={t.perchi_kicker} title={t.perchi_title} tone="plain" />
        <div className="mx-auto max-w-[1200px] px-5 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {[
            ['Cantine', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'],
            ['Distributori', 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'],
            ['Importatori', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.'],
            ['E-commerce', 'Duis aute irure dolor in reprehenderit in voluptate velit esse.'],
          ].map(([title, text], i) => (
            <Card key={i} title={title} text={text} />
          ))}
        </div>
      </section>

      {/* ===== Perché WC ===== */}
      <section id="vantaggi" className="py-12">
        <SectionHeader kicker={t.vant_kicker} title={t.vant_title} tone="plain" />
        <div className="mx-auto max-w-[1200px] px-5 grid gap-4 md:grid-cols-3">
          {t.vant.map(([title, text], i) => (
            <Card key={i} title={title} text={text} />
          ))}
        </div>
      </section>

      {/* ===== CTA Blur ===== */}
      <section className="py-12">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="rounded-2xl p-6 md:p-7 flex flex-col md:flex-row items-center justify-between gap-4 border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,.25)]">
            <h3 className="text-xl font-bold text-white m-0">{t.cta2_title}</h3>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <a className="px-4 py-2 rounded-full font-bold text-[#0f1720] transition-all duration-200 hover:-translate-y-[1px] active:translate-y-[1px] hover:ring-2 ring-[color:var(--wc)]/40" style={{ background: WC_PINK }} href="#contatti">
                {t.cta2_btn1}
              </a>
              <a className="px-4 py-2 rounded-full font-bold border border-white/70 transition-all duration-200 hover:-translate-y-[1px] active:translate-y-[1px] hover:bg-white/10" href="#contatti">
                {t.cta2_btn2}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Contatti ===== */}
      <section id="contatti" className="py-12">
        <SectionHeader kicker={t.lead_kicker} title={t.lead_title} tone="accent" />
        <div className="mx-auto max-w-[820px] px-5">
          <QuickForm />
          <div className="mt-3 text-center text-[12px] text-white/60">
            {lang === 'it' ? 'Compili in 30 secondi. Ti rispondiamo in giornata.' : '30 seconds to fill. We reply within one business day.'}
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="py-8">
        <div className="mx-auto max-w-[1200px] px-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a className="flex items-center gap-2 text-white font-extrabold" href="#">
            <picture>
              <source srcSet={LOGO_SVG} type="image/svg+xml" />
              <img src={LOGO_PNG} alt="Wine Connect" className="h-7 w-auto object-contain" />
            </picture>
          </a>
          <small className="text-white/80 leading-tight text-center sm:text-right">{t.footer_legal}</small>
        </div>
      </footer>
    </main>
  );
}

/* ===================== COMPONENTS ===================== */
function SectionHeader({
  kicker,
  title,
  tone = 'plain',
}: {
  kicker: string;
  title: React.ReactNode;
  tone?: 'problem' | 'solution' | 'accent' | 'plain';
}) {
  const gradients: Record<string, string> = {
    problem: `linear-gradient(90deg, ${WC_PINK}, #fff)`,
    solution: `linear-gradient(90deg, ${WC_PINK}, #fff)`,
    accent: `linear-gradient(90deg, ${WC_PINK}, #fff)`,
    plain: `linear-gradient(90deg, #fff, #fff)`,
  };
  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-5 text-center md:text-left">
      <motion.div initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-[11px] tracking-wider uppercase text-white/60">
        {kicker}
      </motion.div>
      <div className="relative inline-block">
        <div
          aria-hidden
          className="absolute -inset-x-6 -inset-y-2 blur-xl md:blur-2xl opacity-25 pointer-events-none"
          style={{
            background: `radial-gradient(50% 60% at 50% 55%, rgba(255,255,255,.45) 0%, ${WC_PINK}33 40%, transparent 65%), radial-gradient(90% 120% at 50% 50%, rgba(28,62,94,.18) 0%, transparent 60%)`,
          }}
        />
        <motion.h2 initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative text-[26px] sm:text-[30px] md:text-[38px] font-black mt-1">
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: gradients[tone] }}>
            {title}
          </span>
        </motion.h2>
      </div>
      <div className="mt-2 h-[3px] w-24 rounded-full" style={{ backgroundImage: `linear-gradient(90deg, ${WC_PINK}, transparent)` }} />
    </div>
  );
}

function Card({ title, text, iconIdx }: { title: string; text: string; iconIdx?: number }) {
  const icon = iconIdx === 0 ? <FileCheck2 className="h-5 w-5" /> : iconIdx === 1 ? <Route className="h-5 w-5" /> : iconIdx === 2 ? <TrendingUp className="h-5 w-5" /> : null;
  return (
    <motion.div initial={{ y: 18, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.4 }} className="rounded-2xl p-5 border border-white/10 bg-white/[0.03]">
      {icon && <div className="w-10 h-10 rounded-xl grid place-items-center text-white/90 bg-white/5 border border-white/10 mb-2">{icon}</div>}
      <h3 className="text-white font-extrabold text-[1.1rem]">{title}</h3>
      <p className="text-white/80 text-[0.98rem]">{text}</p>
    </motion.div>
  );
}

function FCard({ title, text, iconIdx }: { title: string; text: string; iconIdx?: number }) {
  const icon = iconIdx === 0 ? <TriangleAlert className="h-5 w-5" /> : iconIdx === 1 ? <Ship className="h-5 w-5" /> : <Globe2 className="h-5 w-5" />;
  return <Card title={title} text={text} iconIdx={undefined} children={undefined as never} />;
}

function QuickForm() {
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const payload = Object.fromEntries(d.entries());
    try {
      const res = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const j = await res.json();
      alert(j.ok ? 'Grazie! Ti contatteremo a breve.' : 'Errore, riprova.');
      (e.currentTarget as HTMLFormElement).reset();
    } catch (_) {
      alert('Errore, riprova.');
    }
  }
  return (
    <form onSubmit={onSubmit} className="rounded-2xl p-5 grid gap-4 border border-white/10 bg-white/[0.04]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Azienda">
          <Building2 className="h-4 w-4 text-white/60" />
          <input name="company" required placeholder="Cantina / Azienda" className="bg-transparent outline-none w-full placeholder:text-white/40" />
        </Field>
        <Field label="Nome referente">
          <Building2 className="h-4 w-4 text-white/60" />
          <input name="name" required placeholder="Nome e cognome" className="bg-transparent outline-none w-full placeholder:text-white/40" />
        </Field>
        <Field label="Email">
          <Mail className="h-4 w-4 text-white/60" />
          <input name="email" required type="email" placeholder="nome@azienda.it" className="bg-transparent outline-none w-full placeholder:text-white/40" />
        </Field>
        <Field label="Telefono">
          <Phone className="h-4 w-4 text-white/60" />
          <input name="phone" inputMode="tel" placeholder="+39 ..." className="bg-transparent outline-none w-full placeholder:text-white/40" />
        </Field>
      </div>
      <motion.button whileTap={{ scale: 0.98 }} className="mt-1 h-12 rounded-xl font-semibold text-base text-[#0f1720] w-full transition-all duration-200 hover:-translate-y-[1px] active:translate-y-[1px] hover:ring-2 ring-[color:var(--wc)]/40" style={{ background: WC_PINK }}>
        Richiedi informazioni
      </motion.button>
      <div className="text-[11px] text-white/50 text-center">Invio protetto. Nessuno spam.</div>
    </form>
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
