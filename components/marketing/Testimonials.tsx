// components/marketing/Testimonials.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { WC_COLORS } from "@/lib/theme";
import { useI18n } from "@/components/site/LanguageProvider";
import { MessageSquareQuote } from "lucide-react";

type TItem = {
  qEN: string;
  qIT: string;
  authorEN: string;
  authorIT: string;
  country: "US" | "KR" | "UK" | "IT" | "EU";
};

/** Bandierine via emoji unicode (niente asset esterni) */
const FLAG: Record<TItem["country"], string> = {
  US: "🇺🇸",
  KR: "🇰🇷",
  UK: "🇬🇧",
  IT: "🇮🇹",
  EU: "🇪🇺",
};

export default function Testimonials() {
  const { lang } = useI18n();
  const title = lang === "it" ? "Cosa dicono i buyer" : "What buyers say";

  const items: TItem[] = [
    {
      qEN:
        "Samples arrived in 3 days. Shortlist was spot-on for our by-the-glass program.",
      qIT:
        "I campioni sono arrivati in 3 giorni. Shortlist perfetta per il nostro by-the-glass.",
      authorEN: "Daniel K., Importer",
      authorIT: "Daniel K., Importatore",
      country: "US",
    },
    {
      qEN:
        "Clear paperwork and fast consolidation. Made our first pallet to Seoul painless.",
      qIT:
        "Documenti chiari e consolidamento rapido. Il nostro primo pallet per Seoul è stato semplice.",
      authorEN: "Marco L., Distributor",
      authorIT: "Marco L., Distributore",
      country: "KR",
    },
    {
      qEN:
        "Fantastic service — saves us hours, even on urgent orders. Exactly what we needed for HoReCa.",
      qIT:
        "Servizio fantastico — ci fa risparmiare ore, anche su ordini urgenti. Esattamente ciò che serviva per l’HoReCa.",
      authorEN: "Angelica, Buyer HoReCa",
      authorIT: "Angelica, Buyer HoReCa",
      country: "UK",
    },
  ];

  return (
    <section className="relative py-14">
      {/* === STRISCIA BIANCA (stacco netto) === */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.04))",
        }}
      />
      {/* linee nette sopra/sotto per separare la band */}
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: "rgba(255,255,255,.10)" }} />
      <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: "rgba(255,255,255,.10)" }} />

      <div className="mx-auto max-w-[1200px] px-5">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white">{title}</h2>

        {/* 3 card su una riga con altezze uguali; gutters coerenti */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
          {items.map((t, idx) => {
            const quote = lang === "it" ? t.qIT : t.qEN;
            const author = lang === "it" ? t.authorIT : t.authorEN;
            const flag = FLAG[t.country];

            return (
              <Card
                key={idx}
                className="group rounded-2xl h-full transition-transform will-change-transform hover:-translate-y-[1px]"
                style={{
                  borderColor: "rgba(255,255,255,.12)",
                  background: "rgba(255,255,255,.04)",
                  boxShadow:
                    "0 6px 20px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.05)",
                }}
              >
                <CardContent className="p-6 flex flex-col h-full">
                  {/* header: icona + chip bandiera (margini perfetti) */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
                      style={{
                        border: "1px solid rgba(255,255,255,.12)",
                        background: "rgba(255,255,255,.06)",
                      }}
                      aria-hidden
                    >
                      <MessageSquareQuote className="h-4 w-4" />
                    </div>

                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs leading-none"
                      style={{
                        border: "1px solid rgba(255,255,255,.12)",
                        background: "rgba(0,0,0,.18)",
                        color: "rgba(255,255,255,.85)",
                      }}
                      aria-label="country"
                      title={t.country}
                    >
                      <span role="img" aria-hidden>
                        {flag}
                      </span>
                      {t.country}
                    </span>
                  </div>

                  {/* quote */}
                  <p className="text-[15px] md:text-base text-white/90 leading-relaxed flex-1">
                    “{quote}”
                  </p>

                  {/* author */}
                  <p className="mt-4 text-sm text-white/60">{author}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
