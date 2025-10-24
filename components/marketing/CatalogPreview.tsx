// components/marketing/CatalogPreview.tsx
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const demoWines = [
  { id: "w1", winery: "Masseria Frattasi", name: "Falanghina del Sannio DOC", region: "Campania", price: "€€" },
  { id: "w2", winery: "Piemonte Estate", name: "Barbera d'Asti DOCG", region: "Piedmont", price: "€€€" },
  { id: "w3", winery: "Toscana Collective", name: "Chianti Classico DOCG", region: "Tuscany", price: "€€" },
  { id: "w4", winery: "Etna Selezione", name: "Etna Rosso DOC", region: "Sicily", price: "€€€" },
];

export default function CatalogPreview() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl sm:text-3xl font-semibold">Browse the catalog</h2>
          <Link href="/catalog" className="text-sm underline">
            See all
          </Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {demoWines.map((w) => (
            <Card key={w.id} className="rounded-2xl">
              <CardHeader>
                <div className="text-sm text-zinc-500">{w.winery}</div>
                <div className="text-base font-medium">{w.name}</div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-zinc-600">
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
