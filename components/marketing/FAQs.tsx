// components/marketing/FAQs.tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { WC_COLORS } from "@/lib/theme";

export default function FAQs() {
  return (
    <section className="py-14">
      <div className="mx-auto max-w-[900px] px-5">
        <h2 className="text-2xl md:text-3xl font-semibold text-center">FAQs</h2>
        <div className="mt-6 rounded-2xl" style={{ border: `1px solid ${WC_COLORS.CARD_BORDER}`, background: WC_COLORS.CARD_BG }}>
          <Accordion type="single" collapsible className="divide-y" >
            <AccordionItem value="item-1" className="px-4" >
              <AccordionTrigger>Can you handle excise and customs?</AccordionTrigger>
              <AccordionContent>
                Yes. We operate with standardized flows for EU/UK/US. Documents and duties are managed with our logistics partners.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="px-4">
              <AccordionTrigger>How do samples work?</AccordionTrigger>
              <AccordionContent>
                You can request pre-built sample kits or custom kits based on your brief. Express delivery with tracking.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="px-4">
              <AccordionTrigger>Do you work with small wineries?</AccordionTrigger>
              <AccordionContent>
                Yes. We curate export-ready producers and help structure compliance and shipping for first-time markets.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
