// components/marketing/Testimonials.tsx
import { Card, CardContent } from "@/components/ui/card";
import { WC_COLORS } from "@/lib/theme";

const quotes = [
  { q: "Samples arrived in 3 days. Shortlist was spot-on for our by-the-glass program.", a: "Daniel K., Importer (NY)" },
  { q: "Clear paperwork and fast consolidation. Made our first pallet to Seoul painless.", a: "Marco L., Distributor (KR)" },
];

export default function Testimonials() {
  return (
    <section className="py-14">
      <div className="mx-auto max-w-[1200px] px-5">
        <h2 className="text-2xl md:text-3xl font-semibold">What buyers say</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {quotes.map((t) => (
            <Card key={t.q} className="rounded-2xl" style={{ borderColor: WC_COLORS.CARD_BORDER, background: WC_COLORS.CARD_BG }}>
              <CardContent className="p-6">
                <p className="text-base text-white">“{t.q}”</p>
                <p className="mt-3 text-sm" style={{ color: WC_COLORS.MUTED }}>{t.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
