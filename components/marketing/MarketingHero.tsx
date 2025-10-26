// components/marketing/MarketingHero.tsx
"use client";

import * as React from "react";
import { WC_COLORS } from "@/lib/theme";
import { useI18n } from "@/components/site/LanguageProvider";
import HowItWorksModal from "@/components/marketing/modals/HowItWorksModal";
import ContactModal from "@/components/marketing/modals/ContactModal";

export default function MarketingHero() {
  const { lang } = useI18n();
  const [howOpen, setHowOpen] = React.useState(false);
  const [contactOpen, setContactOpen] = React.useState(false);

  const KICKER =
    lang === "it" ? "L’hub tra chi produce e chi compra" : "The hub between producers and buyers";
  const TITLE_A =
    lang === "it" ? "Matchmaking su misura." : "Tailored matchmaking.";
  const TITLE_B =
    lang === "it" ? "Documenti e spedizioni già integrati." : "Docs and shipping built-in.";
  const DESC =
    lang === "it"
      ? "Allineiamo cantine e buyer per stile, fascia prezzo e volumi. SPST gestisce accise, documenti e logistica end-to-end: meno attrito, più ordini."
      : "We match Italian wineries and international buyers by style, price range and volumes. SPST handles excise, paperwork and end-to-end logistics: less friction, more orders.";

  return (
    <section className="relative overflow-visible">
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:py-20">
        <div className="text-center">
          <span className="inline-block text-[11px] tracking-[.2em] uppercase text-white/70">
            {KICKER}
          </span>
        </div>

        <h1 className="mt-3 text-center font-black leading-[1.08] text-[34px] sm:text-[46px] md:text-[60px]">
          <span className="block text-white">{TITLE_A}</span>
          <span
            className="inline-block bg-clip-text text-transparent pb-[3px] mt-1"
            style={{
              backgroundImage: `linear-gradient(90deg, ${WC_COLORS.PINK}, ${WC_COLORS.BLUE_SOFT})`,
              WebkitBackgroundClip: "text",
            }}
          >
            {TITLE_B}
          </span>
        </h1>

        <p className="mt-4 mx-auto max-w-[70ch] text-center text-white/80 text-[15px] sm:text-base">
          {DESC}
        </p>

        {/* CTAs → aprono le modali */}
        <div className="mt-7 flex items-center justify-center gap-3">
          <button
            onClick={() => setHowOpen(true)}
            className="inline-flex items-center justify-center rounded-full border px-5 py-2.5 text-sm font-semibold hover:bg-white/5 transition"
            style={{ borderColor: "rgba(255,255,255,.18)" }}
          >
            {lang === "it" ? "Come funziona" : "How it works"}
          </button>

          <button
            onClick={() => setContactOpen(true)}
            className="inline-flex items-center justify-center rounded-full bg-[color:var(--wc)] px-5 py-2.5 text-sm font-bold text-[#0f1720] shadow hover:translate-y-[-1px] transition"
            style={{ ["--wc" as any]: WC_COLORS.PINK }}
          >
            {lang === "it" ? "Contattaci" : "Get in touch"}
          </button>
        </div>
      </div>

      {/* Modali */}
      <HowItWorksModal open={howOpen} onClose={() => setHowOpen(false)} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </section>
  );
}
