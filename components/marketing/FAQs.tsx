'use client';

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

export default function FAQs() {
  return (
    <section aria-labelledby="faqs" className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8">
      <h2 id="faqs" className="text-center text-2xl font-semibold mb-6">FAQs</h2>

      <Accordion type="single" className="space-y-3">
        <AccordionItem value="q1" className="bg-white/[0.03]">
          <AccordionTrigger>Can you handle excise and customs?</AccordionTrigger>
          <AccordionContent>
            Yes. We manage excise, customs and local paperwork end-to-end with standardized checks and flows.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q2" className="bg-white/[0.03]">
          <AccordionTrigger>How do samples work?</AccordionTrigger>
          <AccordionContent>
            Tell us what you need. We prepare standard or custom kits, then ship from our warehouse with tracking.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q3" className="bg-white/[0.03]">
          <AccordionTrigger>Do you work with small wineries?</AccordionTrigger>
          <AccordionContent>
            Yes — we match buyers to export-ready wineries by style, price range and compliance readiness.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
