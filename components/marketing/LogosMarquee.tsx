// components/marketing/LogosMarquee.tsx
"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/components/site/LanguageProvider";
import { WC_COLORS } from "@/lib/theme";

/**
 * Dataset: regioni + denominazioni (20+). EN mantiene nomi internazionalmente usati.
 * Se vuoi più/meno voci basta editare gli array sotto.
 */
const REGIONS_IT = [
  "Abruzzo","Basilicata","Calabria","Campania","Emilia-Romagna","Friuli-Venezia Giulia","Lazio",
  "Liguria","Lombardia","Marche","Molise","Piemonte","Puglia","Sardegna","Sicilia","Toscana",
  "Trentino-Alto Adige","Umbria","Valle d’Aosta","Veneto",
] as const;

const REGIONS_EN = [
  "Abruzzo","Basilicata","Calabria","Campania","Emilia-Romagna","Friuli Venezia Giulia","Lazio",
  "Liguria","Lombardy","Marche","Molise","Piedmont","Apulia","Sardinia","Sicily","Tuscany",
  "Trentino–South Tyrol","Umbria","Aosta Valley","Veneto",
] as const;

const APPELLATIONS_IT = [
  "Barolo","Barbaresco","Barbera d’Asti","Chianti Classico","Brunello di Montalcino","Valpolicella",
  "Amarone della Valpolicella","Prosecco","Soave","Franciacorta","Etna Rosso","Etna Bianco",
  "Nero d’Avola","Primitivo di Manduria","Aglianico del Vulture","Taurasi","Verdicchio dei Castelli di Jesi",
  "Montepulciano d’Abruzzo","Cannonau di Sardegna","Vermentino di Gallura","Lugana","Trento DOC",
  "Alto Adige DOC","Lambrusco di Sorbara","Sagrantino di Montefalco",
] as const;

const APPELLATIONS_EN = [
  "Barolo","Barbaresco","Barbera d’Asti","Chianti Classico","Brunello di Montalcino","Valpolicella",
  "Amarone della Valpolicella","Prosecco","Soave","Franciacorta","Etna Rosso","Etna Bianco",
  "Nero d’Avola","Primitivo di Manduria","Aglianico del Vulture","Taurasi","Verdicchio dei Castelli di Jesi",
  "Montepulciano d’Abruzzo","Cannonau di Sardegna","Vermentino di Gallura","Lugana","Trento DOC",
  "Alto Adige / Südtirol DOC","Lambrusco di Sorbara","Sagrantino di Montefalco",
] as const;

/** Interleave: alterna regioni e denominazioni (region, denomination, region, ...) */
function interleave<A, B>(a: readonly A[], b: readonly B[]): (A | B)[] {
  const max = Math.max(a.length, b.length);
  const out: (A | B)[] = [];
  for (let i = 0; i < max; i++) {
    if (i < a.length) out.push(a[i]);
    if (i < b.length) out.push(b[i]);
  }
  return out;
}

export default function LogosMarquee() {
  const { lang } = useI18n();

  const regions = (lang === "it" ? REGIONS_IT : REGIONS_EN) as readonly string[];
  const apps = (lang === "it" ? APPELLATIONS_IT : APPELLATIONS_EN) as readonly string[];
  const mixed = interleave(regions, apps);

  // Duplichiamo per lo scorrimento continuo
  const items = [...mixed, ...mixed];

  return (
    <section
      className="py-10 border-y relative"
      style={{ borderColor: WC_COLORS.CARD_BORDER }}
      aria-label={lang === "it" ? "Regioni e denominazioni" : "Regions and appellations"}
    >
      <div className="mx-auto max-w-[1200px] px-5">
        <p
          className="text-center text-[11px] uppercase tracking-[.2em] mb-5"
          style={{ color: "rgba(255,255,255,.6)" }}
        >
          {lang === "it" ? "Regioni & Denominazioni curate" : "Curated Regions & Appellations"}
        </p>

        <div className="relative overflow-hidden rounded-[20px]">
          {/* fascia sottile per stacco visivo */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35)",
              borderRadius: 20,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.03))",
            }}
          />

          <motion.div
            role="list"
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-6 whitespace-nowrap will-change-transform py-3 px-1"
          >
            {items.map((label, i) => (
              <span
                role="listitem"
                key={`${label}-${i}`}
                className="h-9 px-4 inline-flex items-center rounded-2xl text-sm"
                style={{
                  border: `1px solid ${WC_COLORS.CARD_BORDER}`,
                  background: WC_COLORS.CARD_BG,
                  color: WC_COLORS.MUTED,
                  backdropFilter: "blur(6px)",
                }}
              >
                {label}
              </span>
            ))}
          </motion.div>

          {/* Fade + shadow ai lati per “staccare” dai bordi */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-16"
            style={{
              background:
                "linear-gradient(90deg, rgba(10,23,34,1) 30%, rgba(10,23,34,0))",
              boxShadow: "8px 0 24px rgba(0,0,0,0.35)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-16"
            style={{
              background:
                "linear-gradient(270deg, rgba(10,23,34,1) 30%, rgba(10,23,34,0))",
              boxShadow: "-8px 0 24px rgba(0,0,0,0.35)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
