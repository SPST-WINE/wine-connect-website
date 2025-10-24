// components/marketing/StatsStrip.tsx
"use client";

import { WC_COLORS } from "@/lib/theme";
import { useI18n } from "@/components/site/LanguageProvider";
import { Building2, Tag, Globe2, Timer } from "lucide-react";

type Stat = {
  key: "wineries" | "labels" | "markets" | "shipout";
  value: string;
  labelEN: string;
  labelIT: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export default function StatsStrip() {
  const { lang } = useI18n();

  const kicker = lang === "it" ? "La forza della rete" : "We are wine connect";
  const titleEN = "A global B2B wine network";
  const titleIT = "Il network globale B2B del vino italino";

  const stats: Stat[] = [
    { key: "wineries", value: "50+", labelEN: "Wineries", labelIT: "Cantine", Icon: Building2 },
    { key: "labels", value: "300+", labelEN: "Labels", labelIT: "Etichette", Icon: Tag },
    { key: "markets", value: "UK · EU · ASIA", labelEN: "Markets", labelIT: "Mercati", Icon: Globe2 },
    { key: "shipout", value: "24h", labelEN: "Samples ship-out", labelIT: "Spedizione campioni", Icon: Timer },
  ];

  return (
    <section className="py-14">
      <div className="mx-auto max-w-[1200px] px-5">
        {/* Header del blocco: kicker + titolo con gradiente e halo */}
        <div className="mb-8 text-center">
          <div className="text-[11px] uppercase tracking-[.2em] mb-2" style={{ color: "rgba(255,255,255,.6)" }}>
            {kicker}
          </div>

          <div className="relative inline-block">
            {/* halo morbido dietro al titolo */}
            <span
              aria-hidden
              className="absolute inset-[-14%] -z-10 rounded-[32px] blur-2xl"
              style={{
                background: `radial-gradient(60% 60% at 50% 50%, ${WC_COLORS.PINK}22, transparent 70%)`,
              }}
            />
            <h2
              className="text-xl md:text-2xl font-semibold"
              style={{
                backgroundImage: `linear-gradient(90deg, ${WC_COLORS.PINK}, ${WC_COLORS.BLUE_SOFT})`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {lang === "it" ? titleIT : titleEN}
            </h2>
          </div>

          {/* linea/underline gradient molto sottile */}
          <div
            className="mx-auto mt-3 h-[3px] w-40 rounded-full"
            style={{ backgroundImage: `linear-gradient(90deg, ${WC_COLORS.PINK}, transparent)` }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ key, value, labelEN, labelIT, Icon }) => (
            <div
              key={key}
              className="rounded-2xl p-5 flex items-start gap-4"
              style={{ border: `1px solid ${WC_COLORS.CARD_BORDER}`, background: WC_COLORS.CARD_BG }}
            >
              <div
                className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ border: `1px solid ${WC_COLORS.CARD_BORDER}`, background: "rgba(255,255,255,0.03)" }}
                aria-hidden
              >
                <Icon className="h-5 w-5" />
              </div>

              <div>
                <div className="text-2xl font-semibold text-white leading-tight">{value}</div>
                <div className="text-sm" style={{ color: "rgba(255,255,255,.75)" }}>
                  {lang === "it" ? labelIT : labelEN}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
