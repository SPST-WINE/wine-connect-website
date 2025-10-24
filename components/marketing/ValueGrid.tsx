// components/marketing/ValueGrid.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Plane, Handshake, FileCheck } from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Compliance-first",
    body:
      "Excise, customs, and docs automated. We work with certified partners and standardized flows.",
  },
  {
    icon: Handshake,
    title: "Buyer-first",
    body:
      "Tell us what you need. Get shortlists and samples aligned with your price points and audience.",
  },
  {
    icon: Plane,
    title: "Integrated logistics",
    body:
      "Express samples and B2B pallets. DHL/FedEx for air, trusted 3PLs for consolidation.",
  },
  {
    icon: FileCheck,
    title: "One-stop process",
    body:
      "Samples → orders → payment → shipping. Track everything in your dashboard.",
  },
];

export default function ValueGrid() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <Card key={v.title} className="rounded-2xl">
              <CardHeader>
                <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl border">
                  <v.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{v.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-zinc-600 dark:text-zinc-300">
                {v.body}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
