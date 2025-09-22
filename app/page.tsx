'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';
import Image from 'next/image';
import logoPng from '@/public/wc-logo.png'; // <-- import static, niente 404

/* ===================== THEME ===================== */
const WC_BLUE_SOFT = '#1c3e5e';
const WC_PINK = '#E33955';

/* ===================== I18N ===================== */
const I18N = {
  it: {
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
  },
  en: {
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
        'Excise, COLA, e-DAS, HS codes managed',
        'Optimized shipping & live tracking',
      ],
      cta1: 'Wine Connect for Wineries',
      cta2: 'How it works',
    },
  },
} as const;

type RootStyle = React.CSSProperties & Record<'--wc', string>;

/* ===================== PAGE ===================== */
export default function Home() {
  const [lang, setLang] = useState<'it' | 'en'>('it');
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
    <main
      className="font-sans text-slate-100 selection:bg-[color:var(--wc)]/30"
      style={rootStyle}
    >
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-black/20">
        <div className="mx-auto max-w-[1200px] px-5 h-16 flex items-center justify-between gap-4">
          <a href="#" className="flex items-center gap-2 text-white font-extrabold">
            {/* Logo con import static: non può fallire */}
            <Image
              src={logoPng}
              alt="Wine Connect"
              className="h-8 w-auto object-contain"
              priority
              // width/height necessari per <Image>
              width={128}
              height={32}
            />
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
        {/* brand glows */}
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

        {/* Headline/desc */}
        <div className="mx-auto max-w-[1200px] px-5 text-center mb-8">
          <span className="inline-block text-xs tracking-wider uppercase text-white/70">
            {t.hero_kicker}
          </span>
          <h1 className="mt-2 text-[30px] sm:text-[40px] md:text-[56px] font-black leading-[1.05]">
            {t.hero_title_a}
            <span
              className="block text-transparent bg-clip-text"
              style={{ backgroundImage: `linear-gradient(90deg, ${WC_PINK}, ${WC_BLUE_SOFT})` }}
            >
              {t.hero_title_b}
            </span>
          </h1>
          <p className="mt-3 mx-auto max-w-[70ch] text-white/80 text-[15px] sm:text-base">
            {t.hero_desc}
          </p>
        </div>

        {/* Split Buyers / Wineries */}
        <div className="mx-auto max-w-[1200px] px-5 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-center">
          {/* LEFT: Buyers */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:pr-4"
          >
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
              <a
                href="#buyers"
                className="inline-flex items-center justify-center rounded-full bg-[color:var(--wc)] px-5 py-2.5 text-sm font-bold text-[#0f1720] shadow hover:translate-y-[-1px] transition"
              >
                {t.buyers.cta1}
              </a>
              <a
                href="#funziona"
                className="inline-flex items-center justify-center rounded-full border px-5 py-2.5 text-sm font-semibold hover:bg-white/5"
                style={{ borderColor: `${WC_PINK}55` }}
              >
                {t.buyers.cta2}
              </a>
            </div>
          </motion.div>

          {/* CENTER: Logo */}
          <div className="relative grid place-items-center">
            <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-2xl border border-white/10 bg-black/40 backdrop-blur grid place-items-center shadow-[0_8px_40px_rgba(227,57,85,.25)]">
              <Image
                src={logoPng}
                alt="Wine Connect"
                width={128}
                height={128}
                className="w-20 md:w-24 h-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* RIGHT: Wineries (right-aligned, dot dopo) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:pl-4 text-right"
          >
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
              <a
                href="#wineries"
                className="inline-flex items-center justify-center rounded-full border px-5 py-2.5 text-sm font-semibold hover:bg-white/5"
                style={{ borderColor: `${WC_PINK}55` }}
              >
                {t.wineries.cta1}
              </a>
              <a
                href="#funziona"
                className="inline-flex items-center justify-center rounded-full bg-[color:var(--wc)] px-5 py-2.5 text-sm font-bold text-[#0f1720] shadow hover:translate-y-[-1px] transition"
              >
                {t.wineries.cta2}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
