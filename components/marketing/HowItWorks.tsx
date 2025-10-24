// components/marketing/HowItWorks.tsx
import { Card, CardContent } from "@/components/ui/card";
import { WC_COLORS } from "@/lib/theme";

const steps = [
  { n: "01", title: "Share your brief", body: "Regions, styles, certifications, price points, audience. 2 minutes." },
  { n: "02", title: "Get a shortlist", body: "Curated matches from export-ready wineries." },
  { n: "03", title: "Request samples", body: "Standard kits or custom. Delivered fast, tracked." },
  { n: "04", title: "Order & ship", body: "Consolidation, excise, customs, documents… handled." },
];

export default function HowItWorks() {
  return (
    <section className="py-14 border-t" style={{ borderColor: WC_COLORS.CARD_BORDER }}>
      <div className="mx-auto max-w-[1200px] px-5">
        <h2 className="text-2xl md:text-3xl font-semibold">How it works</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <Card
              key={s.n}
              className="rounded-2xl"
              style={{ borderColor: WC_COLORS.CARD_BORDER, background: WC_COLORS.CARD_BG }}
            >
              <CardContent className="p-6">
                <div className="text-xs" style={{ color: WC_COLORS.MUTED }}>{s.n}</div>
                <div className="mt-2 text-lg font-medium text-white">{s.title}</div>
                <p className="mt-1 text-sm" style={{ color: WC_COLORS.MUTED }}>{s.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
