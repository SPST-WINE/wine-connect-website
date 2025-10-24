// components/marketing/Testimonials.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/components/site/LanguageProvider";
import { MessageSquareQuote } from "lucide-react";

/* ===== Flag badge rotondo (FIX: usare ring-* via className, non ringColor inline) ===== */
function FlagBadge({ emoji, label }: { emoji: string; label: string }) {
  return (
    <span
      className="inline-flex h-7 w-7 items-center justify-center rounded-full ring-1 ring-white/20"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,.04))",
        boxShadow:
          "inset 0 1px 1px rgba(255,255,255,.25), inset 0 -2px 6px rgba(0,0,0,.25)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
      aria-label={label}
      title={label}
    >
      <span className="text-[13px] leading-none">{emoji}</span>
    </span>
  );
}

type TItem = {
  qEN: string;
  qIT: string;
  authorEN: string;
  authorIT: string;
  country: "US" | "KR" | "UK" | "IT" | "EU";
};

const FLAG_EMOJI: Record<TItem["country"], string> = {
  US: "🇺🇸",
  KR: "🇰🇷",
  UK: "🇬🇧",
  IT: "🇮🇹",
  EU: "🇪🇺",
};

const COUNTRY_LABEL: Record<TItem["country"], string> = {
  US: "United States",
  KR: "Korea",
  UK: "United Kingdom",
  IT: "Italy",
  EU: "European Union",
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
          {items.map((t, idx) => {
            const quote = lang === "it" ? t.qIT : t.qEN;
            const author = lang === "it" ? t.authorIT : t.authorEN;
            const emoji = FLAG_EMOJI[t.country];
            const label = COUNTRY_LABEL[t.country];

            return (
              <Card
                key={idx}
                className="rounded-2xl h-full transition-transform hover:-translate-y-[1px]"
                style={{
                  borderColor: "rgba(255,255,255,.12)",
                  background: "rgba(255,255,255,.04)",
                  boxShadow:
                    "0 6px 20px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.05)",
                }}
              >
                <CardContent className="px-6 pt-7 pb-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
                      style={{
                        border: "1px solid rgba(255,255,255,.12)",
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.04))",
                      }}
                      aria-hidden
                    >
                      <MessageSquareQuote className="h-4 w-4" />
                    </div>

                    <FlagBadge emoji={emoji} label={label} />
                  </div>

                  <p className="text-[15px] md:text-base text-white/90 leading-relaxed flex-1">
                    “{quote}”
                  </p>

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
