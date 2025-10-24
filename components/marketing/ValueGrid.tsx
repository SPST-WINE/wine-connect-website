// components/marketing/ValueGrid.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Handshake, Boxes, FileCheck } from "lucide-react";
import { WC_COLORS } from "@/lib/theme";
import { useI18n } from "@/components/site/LanguageProvider";

type Feature = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  titleEN: string;
  titleIT: string;
  bodyEN: string;
  bodyIT: string;
};

const FEATURES: Feature[] = [
  {
    icon: ShieldCheck,
    titleEN: "Compliance-first",
    titleIT: "Compliance-first",
    bodyEN:
      "Excise, customs, and documentation automated with standardized checks and flows.",
    bodyIT:
      "Accise, dogana e documentazione automatizzati con flussi e controlli standardizzati.",
  },
  {
    icon: Handshake,
    titleEN: "Buyer-first",
    titleIT: "Buyer-first",
    bodyEN:
      "Tell us what you need. We deliver shortlists and samples aligned to price points and audience.",
    bodyIT:
      "Dicci di cosa hai bisogno. Forniamo shortlist e campioni allineati a prezzi e target.",
  },
  {
    icon: Boxes, // in-house warehouse
    titleEN: "In-house logistics",
    titleIT: "Logistica interna",
    bodyEN:
      "Samples and B2B pallets dispatched from our own warehouse. Consolidation, tracking, and local regulations handled end-to-end.",
    bodyIT:
      "Campioni e pallet B2B spediti dal nostro magazzino. Consolidamento, tracking e adempimenti locali gestiti end-to-end.",
  },
  {
    icon: FileCheck,
    titleEN: "One-stop process",
    titleIT: "Processo unico",
    bodyEN:
      "Samples → orders → payment → shipping. Track everything in your dashboard.",
    bodyIT:
      "Campioni → ordini → pagamenti → spedizioni. Tutto tracciabile dalla dashboard.",
  },
];

export default function ValueGrid() {
  const { lang } = useI18n();
  const kicker = "WHAT WE OFFER"; // bianco
  const title = lang === "it" ? "Operatività, non promesse" : "Operational, not aspirational";

  return (
    <section className="pt-6 pb-14">
      <div className="mx-auto max-w-[1200px] px-5">
        {/* Header: kicker bianco, titolo invariato (teniamo gradient attuale rosso→bianco?) */}
        <div className="mb-8 text-center">
          <div className="text-[11px] uppercase tracking-[.2em] mb-2 text-white/80">
            {kicker}
          </div>
          <h2
            className="text-2xl md:text-3xl font-semibold"
            style={{
              backgroundImage: `linear-gradient(90deg, ${WC_COLORS.PINK}, #ffffff)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {title}
          </h2>

          {/* underline SPECCHIATO: pieno in alto a destra, sfuma in basso a sinistra */}
          <div
            className="mx-auto mt-3 h-[3px] w-40 rounded-full"
            style={{
              backgroundImage: `linear-gradient(225deg, ${WC_COLORS.PINK} 0%, rgba(255,255,255,0) 70%)`,
              // un po' di prospettiva: 225deg = dall'angolo in alto a destra verso il basso a sinistra
            }}
          />
        </div>

        {/* Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            const tTitle = lang === "it" ? f.titleIT : f.titleEN;
            const tBody = lang === "it" ? f.bodyIT : f.bodyEN;

            return (
              <Card
                key={tTitle}
                className="rounded-2xl"
                style={{ borderColor: WC_COLORS.CARD_BORDER, background: WC_COLORS.CARD_BG }}
              >
                <CardHeader className="pb-2">
                  <div
                    className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ border: `1px solid ${WC_COLORS.CARD_BORDER}`, background: "rgba(255,255,255,0.03)" }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base text-white">{tTitle}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-white/75">
                  {tBody}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
