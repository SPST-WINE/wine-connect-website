// components/marketing/FAQs.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQs() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center">FAQs</h2>
        <Accordion type="single" collapsible className="mt-6">
          <AccordionItem value="item-1">
            <AccordionTrigger>Can you handle excise and customs?</AccordionTrigger>
            <AccordionContent>
              Yes. We operate with standardized flows for EU/UK/US. Documents and duties are managed
              with our logistics partners.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>How do samples work?</AccordionTrigger>
            <AccordionContent>
              You can request pre-built sample kits or custom kits based on your brief. Express delivery
              with tracking.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Do you work with small wineries?</AccordionTrigger>
            <AccordionContent>
              Yes. We curate export-ready producers and help structure compliance and shipping for
              first-time markets.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
