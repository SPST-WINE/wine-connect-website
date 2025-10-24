// components/marketing/Testimonials.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { WC_COLORS } from "@/lib/theme";
import { useI18n } from "@/components/site/LanguageProvider";
import { Quote } from "lucide-react";

type TItem = { qEN: string; qIT: string; aEN: string; aIT: string };

export default function Testimonials() {
  const { lang } = useI18n();

  const title = lang === "it" ? "Cosa dicono i buyer" : "What buyers say";

  const items: TItem[] = [
    {
      qEN:
        "Samples arrived in 3 days. Shortlist was spot-on for our by-the-glass program.",
      qIT:
        "I campioni sono arrivati in 3 giorni. La shortlist perfetta per il nostro by-the-glass.",
      aEN: "Daniel K., Importer (NY)",
      aIT: "Daniel K., Importatore (NY)",
    },
    {
      qEN:
        "Clear paperwork and fast consolidation. Made our first pallet to Seoul painless.",
      qIT:
        "Documenti chiari e consolidamento rapido. Il nostro primo pallet per Seoul è stato semplice.",
      aEN: "Marco L., Distributor (KR)",
      aIT: "Marco L., Distributore (KR)",
    },
    {
      qEN:
        "Fantastic service — saves us hours, even on urgent orders. Exactly what we needed for HoReCa.",
      qIT:
        "Servizio fantastico — ci fa risparmiare ore, anche su ordini urgenti. Esattamente ciò che serviva per l’HoReCa.",
      aEN: "Angelica, Buyer HoReCa (UK)",
      aIT: "Angelica, Buyer HoReCa (UK)",
    },
  ];

  return (
    <section className="py-14">
      <div className="mx-auto max-w-[1200px] px-5">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">{title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((t, idx) => (
            <Card
              key={idx}
              className="rounded-2xl h-full"
              style={{ borderColor: WC_COLORS.CARD_BORDER, background: WC_COLORS.CARD_BG }}
            >
              <CardContent className="p-6 flex flex-col h-full">
                <div
                  className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ border: `1px solid ${WC_COLORS.CARD_BORDER}`, background: "rgba(255,255,255,0.03)" }}
                >
                  <Quote className="h-4 w-4" />
                </div>

                <p className="text-base text-white/90 leading-relaxed">
                  “{lang === "it" ? t.qIT : t.qEN}”
                </p>

                <p className="mt-4 text-sm text-white/60">
                  {lang === "it" ? t.aIT : t.aEN}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
