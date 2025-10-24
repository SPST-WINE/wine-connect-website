// components/marketing/Testimonials.tsx
import { Card, CardContent } from "@/components/ui/card";

const quotes = [
  {
    q: "Samples arrived in 3 days. Shortlist was spot-on for our by-the-glass program.",
    a: "Daniel K., Importer (NY)",
  },
  {
    q: "Clear paperwork and fast consolidation. Made our first pallet to Seoul painless.",
    a: "Marco L., Distributor (KR)",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl sm:text-3xl font-semibold">What buyers say</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {quotes.map((t) => (
            <Card key={t.q} className="rounded-2xl">
              <CardContent className="p-6">
                <p className="text-base">“{t.q}”</p>
                <p className="mt-3 text-sm text-zinc-500">{t.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
