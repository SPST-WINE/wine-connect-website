// components/marketing/ValueGrid.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Plane, Handshake, FileCheck } from "lucide-react";
import { WC_COLORS } from "@/lib/theme";

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
    <section className="py-14">
      <div className="mx-auto max-w-[1200px] px-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((v) => (
          <Card
            key={v.title}
            className="rounded-2xl"
            style={{ borderColor: WC_COLORS.CARD_BORDER, background: WC_COLORS.CARD_BG }}
          >
            <CardHeader className="pb-2">
              <div
                className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ border: `1px solid ${WC_COLORS.CARD_BORDER}`, background: "rgba(255,255,255,0.03)" }}
              >
                <v.icon className="h-5 w-5" />
              </div>
              <CardTitle className="text-base text-white">{v.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm" style={{ color: WC_COLORS.MUTED }}>
              {v.body}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
