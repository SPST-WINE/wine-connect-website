// components/marketing/HowItWorks.tsx
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    n: "01",
    title: "Share your brief",
    body: "Regions, styles, certifications, price points, audience. 2 minutes.",
  },
  { n: "02", title: "Get a shortlist", body: "Curated matches from export-ready wineries." },
  { n: "03", title: "Request samples", body: "Standard kits or custom. Delivered fast, tracked." },
  { n: "04", title: "Order & ship", body: "Consolidation, excise, customs, documents… handled." },
];

export default function HowItWorks() {
  return (
    <section className="py-16 border-t">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl sm:text-3xl font-semibold">How it works</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <Card key={s.n} className="rounded-2xl">
              <CardContent className="p-6">
                <div className="text-xs text-zinc-500">{s.n}</div>
                <div className="mt-2 text-lg font-medium">{s.title}</div>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{s.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
