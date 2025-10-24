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

/** emoji bandierine via unicode (nessuna dipendenza immagini) */
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
    <section className="py-12">
      <div className="mx-auto max-w-[1200px] px-5">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">{title}</h2>

        {/* 3 colonne stabili su desktop, cards stessa altezza */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 auto-rows-fr">
          {items.map((t, idx) => {
            const quote = lang === "it" ? t.qIT : t.qEN;
            const author = lang === "it" ? t.authorIT : t.authorEN;
            const flag = FLAG[t.country];

            return (
              <Card
                key={idx}
                className="rounded-2xl h-full"
                style={{
                  borderColor: WC_COLORS.CARD_BORDER,
                  background: WC_COLORS.CARD_BG,
                }}
              >
                <CardContent className="p-6 flex flex-col h-full">
                  {/* header icona + chip bandiera */}
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
                      style={{
                        border: `1px solid ${WC_COLORS.CARD_BORDER}`,
                        background: "rgba(255,255,255,0.03)",
                      }}
                      aria-hidden
                    >
                      <MessageSquareQuote className="h-4 w-4" />
                    </div>

                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs"
                      style={{
                        border: `1px solid ${WC_COLORS.CARD_BORDER}`,
                        background: "rgba(255,255,255,0.03)",
                        color: "rgba(255,255,255,.8)",
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
                  <p className="text-base text-white/90 leading-relaxed">
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
