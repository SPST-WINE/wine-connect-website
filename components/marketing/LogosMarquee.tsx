// components/marketing/LogosMarquee.tsx
"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/components/site/LanguageProvider";
import { WC_COLORS } from "@/lib/theme";

const REGIONS_IT = [
  "Abruzzo","Basilicata","Calabria","Campania","Emilia-Romagna","Friuli-Venezia Giulia","Lazio",
  "Liguria","Lombardia","Marche","Molise","Piemonte","Puglia","Sardegna","Sicilia","Toscana",
  "Trentino-Alto Adige","Umbria","Valle d’Aosta","Veneto",
] as const;

const REGIONS_EN = [
  "Abruzzo","Basilicata","Calabria","Campania","Emilia-Romagna","Friuli-Venezia Giulia","Lazio",
  "Liguria","Lombardy","Marche","Molise","Piedmont","Apulia (Puglia)","Sardinia","Sicily","Tuscany",
  "Trentino-South Tyrol","Umbria","Aosta Valley","Veneto",
] as const;

export default function LogosMarquee() {
  const { lang } = useI18n();
  const regions = (lang === "it" ? REGIONS_IT : REGIONS_EN) as readonly string[];
  // duplico per loop continuo senza scatti
  const items = [...regions, ...regions];

  return (
    <section className="py-8 border-y" style={{ borderColor: WC_COLORS.CARD_BORDER }}>
      <div className="mx-auto max-w-[1200px] px-5">
        <p className="text-center text-[11px] uppercase tracking-[.2em] mb-4" style={{ color: "rgba(255,255,255,.6)" }}>
          {lang === "it" ? "Regioni & Denominazioni curate" : "Curated Regions & Appellations"}
        </p>
        <div className="relative overflow-hidden">
          <motion.div
            role="list"
            aria-label="Regions"
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
            className="flex gap-3 whitespace-nowrap will-change-transform"
            style={{ paddingBlock: 6 }}
          >
            {items.map((l, i) => (
              <span
                role="listitem"
                key={`${l}-${i}`}
                className="px-4 h-9 inline-flex items-center rounded-2xl text-sm"
                style={{
                  border: `1px solid ${WC_COLORS.CARD_BORDER}`,
                  background: WC_COLORS.CARD_BG,
                  color: WC_COLORS.MUTED,
                }}
              >
                {l}
              </span>
            ))}
          </motion.div>

          {/* fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10"
               style={{ background: "linear-gradient(90deg, rgba(10,23,34,1), rgba(10,23,34,0))" }} />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10"
               style={{ background: "linear-gradient(270deg, rgba(10,23,34,1), rgba(10,23,34,0))" }} />
        </div>
      </div>
    </section>
  );
}
