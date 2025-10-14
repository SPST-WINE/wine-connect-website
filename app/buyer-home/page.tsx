'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserRound, Sparkles, ShoppingBasket, Compass, MessageSquare } from 'lucide-react';

/* ===================== PALETTE (coerente con home) ===================== */
const WC_BLUE = '#0a1722';
const WC_BLUE_SOFT = '#1c3e5e';
const WC_PINK = '#E33955';

const LOGO_PNG = '/wc-logo.png';
const LOGO_SVG = '/wc-logo.svg';

export default function BuyerHome() {
  return (
    <main
      className="min-h-screen font-sans text-slate-100 selection:bg-[color:var(--wc)]/30"
      style={{
        ['--wc' as any]: WC_PINK,
        background:
          'radial-gradient(140% 140% at 50% -10%, #1c3e5e 0%, #0a1722 60%, #000 140%)',
      }}
    >
      {/* HEADER minimal */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-black/20">
        <div className="mx-auto max-w-[1200px] px-5 h-16 flex items-center justify-between gap-4">
          <Link href="/buyer-home" className="flex items-center gap-2 text-white font-extrabold">
            <picture>
              <source srcSet={LOGO_SVG} type="image/svg+xml" />
              <img src={LOGO_PNG} alt="Wine Connect" className="h-8 w-auto object-contain" />
            </picture>
            <span className="hidden sm:inline">Wine Connect</span>
          </Link>

          <nav className="flex items-center gap-3 text-sm">
            <Link href="/catalog" className="hover:underline text-white/90">Catalogo</Link>
            <Link href="/cart/samples" className="hover:underline text-white/90">Carrello</Link>
            <Link href="/profile" className="hover:underline text-white/90">Profilo</Link>
          </nav>
        </div>
      </header>

      {/* SOFT GLOWS */}
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

      {/* HERO */}
      <section className="relative py-10">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="mb-6">
            <span className="inline-block text-xs tracking-wider uppercase text-white/70">Benvenuto</span>
            <h1 className="mt-2 text-[28px] sm:text-[40px] md:text-[48px] font-black leading-[1.05]">
              Scegli come iniziare su{' '}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(90deg, ${WC_PINK}, ${WC_BLUE_SOFT})` }}>
                Wine Connect
              </span>
            </h1>
            <p className="mt-2 max-w-[70ch] text-white/80">
              Puoi farti seguire da un consulente per una selezione su misura, oppure esplorare il
              catalogo e richiedere campionature in autonomia.
            </p>
          </div>

          {/* 2 CARDS */}
          <div className="grid gap-5 md:grid-cols-2">
            {/* Tailored Service */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-[color:var(--wc)] text-black p-2">
                  <Sparkles size={18} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-bold">Tailored service</h2>
                  <p className="text-sm text-white/80 mt-1">
                    Brief → shortlist dedicata → kit degustazione → onboarding acquisti.
                  </p>
                  <ul className="text-sm text-white/80 mt-3 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <span aria-hidden className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--wc)]" />
                      Matching per stile, target FOB e volumi
                    </li>
                    <li className="flex items-start gap-2">
                      <span aria-hidden className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--wc)]" />
                      Documenti e spedizioni gestiti (SPST)
                    </li>
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href="/brief"
                      className="inline-flex items-center justify-center rounded-full bg-[color:var(--wc)] px-5 py-2.5 text-sm font-bold text-[#0f1720] shadow hover:translate-y-[-1px] transition"
                    >
                      Parla con un consulente
                    </Link>
                    <Link
                      href="/profile"
                      className="inline-flex items-center justify-center rounded-full border px-5 py-2.5 text-sm font-semibold hover:bg-white/5"
                      style={{ borderColor: `${WC_PINK}55` }}
                    >
                      Completa il profilo
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Browse Yourself */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-black/60 p-2 border border-white/10">
                  <Compass size={18} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-bold">Browse yourself</h2>
                  <p className="text-sm text-white/80 mt-1">
                    Esplora le etichette, aggiungi campionature e invia la richiesta.
                  </p>
                  <ul className="text-sm text-white/80 mt-3 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <span aria-hidden className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-white/40" />
                      Filtri per regione, stile, annata e certificazioni
                    </li>
                    <li className="flex items-start gap-2">
                      <span aria-hidden className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-white/40" />
                      Carrello campionature con prezzi allineati al tuo FOB
                    </li>
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href="/catalog"
                      className="inline-flex items-center justify-center rounded-full border px-5 py-2.5 text-sm font-semibold hover:bg-white/5"
                      style={{ borderColor: `${WC_PINK}55` }}
                    >
                      Vai al catalogo
                    </Link>
                    <Link
                      href="/cart/samples"
                      className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-semibold hover:bg-black/80 border border-white/10"
                    >
                      <ShoppingBasket className="mr-2" size={16} /> Carrello
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* QUICK LINKS */}
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <QuickLink href="/catalog" icon={<Compass size={16} />} label="Sfoglia etichette" />
            <QuickLink href="/cart/samples" icon={<ShoppingBasket size={16} />} label="Campionature" />
            <QuickLink href="/contact" icon={<MessageSquare size={16} />} label="Scrivi al team" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
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
            © {new Date().getFullYear()} Wine Connect — SPST
          </small>
        </div>
      </footer>
    </main>
  );
}

function QuickLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm flex items-center gap-2 hover:bg-white/[0.06] transition"
    >
      <span className="inline-grid w-6 h-6 place-items-center rounded-lg bg-black/50 border border-white/10">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
