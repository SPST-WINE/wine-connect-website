// components/marketing/CatalogPreview.tsx
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { WC_COLORS } from "@/lib/theme";

const demoWines = [
  { id: "w1", winery: "Masseria Frattasi", name: "Falanghina del Sannio DOC", region: "Campania", price: "€€" },
  { id: "w2", winery: "Piemonte Estate", name: "Barbera d'Asti DOCG", region: "Piemonte", price: "€€€" },
  { id: "w3", winery: "Toscana Collective", name: "Chianti Classico DOCG", region: "Toscana", price: "€€" },
  { id: "w4", winery: "Etna Selezione", name: "Etna Rosso DOC", region: "Sicilia", price: "€€€" },
];

export default function CatalogPreview() {
  return (
    <section className="py-14">
      <div className="mx-auto max-w-[1200px] px-5">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl md:text-3xl font-semibold">Browse the catalog</h2>
          <Link href="/catalog" className="text-sm underline">See all</Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {demoWines.map((w) => (
            <Card
              key={w.id}
              className="rounded-2xl"
              style={{ borderColor: WC_COLORS.CARD_BORDER, background: WC_COLORS.CARD_BG }}
            >
              <CardHeader className="pb-2">
                <div className="text-sm" style={{ color: WC_COLORS.MUTED }}>{w.winery}</div>
                <div className="text-base font-medium text-white">{w.name}</div>
              </CardHeader>
              <CardContent>
                <div className="text-sm" style={{ color: WC_COLORS.MUTED }}>
                  {w.region} · {w.price}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
