'use client';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

export default function FAQs() {
  return (
    <section id="faqs" className="py-14 md:py-18">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <h2 className="text-center text-xl md:text-2xl font-semibold tracking-tight text-white/90">
          FAQs
        </h2>

        {/* Card contenitore glass come le review */}
        <div
          className="
            mt-6 md:mt-8 rounded-3xl border border-white/10
            bg-white/[0.04] backdrop-blur-md
            shadow-[0_8px_30px_rgba(0,0,0,0.25)]
          "
        >
          {/* divider gestiti qui: gli item non hanno bordi propri */}
          <div className="divide-y divide-white/10">
            <Accordion type="single" className="w-full">
              {/* ITEM #1 */}
              <AccordionItem value="q1" className="border-0 rounded-none bg-transparent">
                <AccordionTrigger className="px-5 md:px-6 py-4 md:py-5 text-white/90">
                  Can you handle excise and customs?
                </AccordionTrigger>
                <AccordionContent className="px-5 md:px-6">
                  Yes. We manage excise, customs and local paperwork end-to-end
                  with standardized checks and flows.
                </AccordionContent>
              </AccordionItem>

              {/* ITEM #2 */}
              <AccordionItem value="q2" className="border-0 rounded-none bg-transparent">
                <AccordionTrigger className="px-5 md:px-6 py-4 md:py-5 text-white/90">
                  How do samples work?
                </AccordionTrigger>
                <AccordionContent className="px-5 md:px-6">
                  Tell us what you need. We prepare standard or custom kits, then
                  ship from our warehouse with tracking.
                </AccordionContent>
              </AccordionItem>

              {/* ITEM #3 */}
              <AccordionItem value="q3" className="border-0 rounded-none bg-transparent">
                <AccordionTrigger className="px-5 md:px-6 py-4 md:py-5 text-white/90">
                  Do you work with small wineries?
                </AccordionTrigger>
                <AccordionContent className="px-5 md:px-6">
                  Absolutely. We match buyers to export-ready wineries by style,
                  price range and compliance readiness.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
