// components/marketing/LogosMarquee.tsx
"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/components/site/LanguageProvider";
import { WC_COLORS } from "@/lib/theme";

/* --- dataset: regioni + denominazioni --- */
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
  "Nero d’Avola","Primitivo di Manduria","Aglianico del Vulture","Taurasi",
  "Verdicchio dei Castelli di Jesi","Montepulciano d’Abruzzo","Cannonau di Sardegna",
  "Vermentino di Gallura","Lugana","Trento DOC","Alto Adige DOC","Lambrusco di Sorbara","Sagrantino di Montefalco",
] as const;

const APPELLATIONS_EN = [
  "Barolo","Barbaresco","Barbera d’Asti","Chianti Classico","Brunello di Montalcino","Valpolicella",
  "Amarone della Valpolicella","Prosecco","Soave","Franciacorta","Etna Rosso","Etna Bianco",
  "Nero d’Avola","Primitivo di Manduria","Aglianico del Vulture","Taurasi",
  "Verdicchio dei Castelli di Jesi","Montepulciano d’Abruzzo","Cannonau di Sardinia",
  "Vermentino di Gallura","Lugana","Trento DOC","Alto Adige / Südtirol DOC","Lambrusco di Sorbara","Sagrantino di Montefalco",
] as const;

/* alterna regioni e denominazioni */
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
  const items = [...mixed, ...mixed]; // loop continuo

  return (
    <section
      className="py-10 border-y"
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

        {/* glass strip con fade ai lati via mask */}
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            // glass: leggero gradiente + blur
            background:
              "linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.02))",
            border: `1px solid ${WC_COLORS.CARD_BORDER}`,
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            // fade pulito ai lati (niente ombre extra)
            WebkitMaskImage:
              "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
            maskImage:
              "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
        >
          {/* sheen morbido dall’alto */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,0) 45%)",
              opacity: 0.18,
            }}
          />

          <motion.div
            role="list"
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            className="flex gap-6 whitespace-nowrap will-change-transform py-3 px-2"
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
        </div>
      </div>
    </section>
  );
}
