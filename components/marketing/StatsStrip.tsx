// components/marketing/StatsStrip.tsx
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

  const title = lang === "it" ? "Un network B2B del vino globale" : "A global B2B wine network";

  const stats: Stat[] = [
    { key: "wineries", value: "50+", labelEN: "Wineries", labelIT: "Cantine", Icon: Building2 },
    { key: "labels", value: "300+", labelEN: "Labels", labelIT: "Etichette", Icon: Tag },
    { key: "markets", value: "UK · USA · EU · ASIA", labelEN: "Markets", labelIT: "Mercati", Icon: Globe2 },
    { key: "shipout", value: "24h", labelEN: "Samples ship-out", labelIT: "Spedizione campioni", Icon: Timer },
  ];

  return (
    <section className="py-12">
      <div className="mx-auto max-w-[1200px] px-5">
        <h2 className="text-center text-xl md:text-2xl font-semibold mb-6">{title}</h2>

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
                <div className="text-sm" style={{ color: WC_COLORS.MUTED }}>
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
