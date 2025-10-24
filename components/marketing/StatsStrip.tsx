// components/marketing/StatsStrip.tsx
import { WC_COLORS } from "@/lib/theme";

export default function StatsStrip() {
  const stats = [
    { k: "Wineries", v: "50+" },
    { k: "Labels", v: "300+" },
    { k: "Markets", v: "EU · UK · US · HK" },
    { k: "Avg. lead time", v: "7–12 days" },
  ];
  return (
    <section className="py-10">
      <div className="mx-auto max-w-[1200px] px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.k}
            className="rounded-2xl p-5"
            style={{ border: `1px solid ${WC_COLORS.CARD_BORDER}`, background: WC_COLORS.CARD_BG }}
          >
            <div className="text-2xl font-semibold text-white">{s.v}</div>
            <div className="text-sm" style={{ color: WC_COLORS.MUTED }}>{s.k}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
