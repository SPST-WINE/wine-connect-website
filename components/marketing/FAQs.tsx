// components/marketing/FAQs.tsx
"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useI18n } from "@/components/site/LanguageProvider";
import { WC_COLORS } from "@/lib/theme";

type QA = {
  q_en: string;
  a_en: string;
  q_it: string;
  a_it: string;
};

const QAS: QA[] = [
  {
    q_en: "Can you handle excise and customs?",
    a_en:
      "Yes. We manage excise, customs and local paperwork end-to-end, with standardized checks and flows.",
    q_it: "Gestite accise e dogana?",
    a_it:
      "Sì. Gestiamo accise, dogana e documentazione locale end-to-end, con controlli e flussi standardizzati.",
  },
  {
    q_en: "How do samples work?",
    a_en:
      "Tell us what you need. We prepare standard or custom kits, then ship from our warehouse with tracking.",
    q_it: "Come funzionano i campioni?",
    a_it:
      "Dicci cosa ti serve. Prepariamo kit standard o custom e spediamo dal nostro magazzino con tracking.",
  },
  {
    q_en: "Do you work with small wineries?",
    a_en:
      "Yes. We match buyers to export-ready wineries by style, price range and compliance readiness.",
    q_it: "Lavorate anche con piccole cantine?",
    a_it:
      "Sì. Abbiniamo buyer a cantine export-ready per stile, fascia prezzo e prontezza normativa.",
  },
];

export default function FAQs() {
  const { lang } = useI18n();
  const title = lang === "it" ? "Domande frequenti" : "FAQs";

  return (
    <section className="relative py-14">
      {/* banda glass full-width */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.04))",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: "rgba(255,255,255,.10)" }} />
      <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: "rgba(255,255,255,.10)" }} />

      <div className="mx-auto w-full max-w-[1200px] px-5">
        <h2 className="text-center text-2xl md:text-3xl font-semibold mb-8">
          {title}
        </h2>

        <div
          className="rounded-2xl w-full mx-auto"
          style={{
            border: `1px solid ${WC_COLORS.CARD_BORDER}`,
            background: WC_COLORS.CARD_BG,
            boxShadow:
              "0 6px 20px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.05)",
          }}
        >
          <Accordion type="single" collapsible>
            {QAS.map((qa, i) => {
              const q = lang === "it" ? qa.q_it : qa.q_en;
              const a = lang === "it" ? qa.a_it : qa.a_en;
              return (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border-b border-white/10 last:border-b-0"
                >
                  <AccordionTrigger
                    className="px-5 md:px-6 py-4 md:py-5 text-left text-[15px] md:text-base hover:no-underline transition-colors data-[state=open]:bg-white/5"
                    style={{ color: "rgba(255,255,255,.95)" }}
                  >
                    {q}
                  </AccordionTrigger>

                  {/* HIDE by default; reveal on open + smooth height */}
                  <AccordionContent
                    className="
                      px-5 md:px-6
                      text-[14px] leading-relaxed
                      overflow-hidden
                      max-h-0
                      hidden
                      data-[state=open]:block
                      data-[state=open]:max-h-[480px]
                      transition-[max-height] duration-300 ease-out
                    "
                    style={{ color: "rgba(255,255,255,.75)" }}
                  >
                    <div className="py-4 md:py-5">
                      {a}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
