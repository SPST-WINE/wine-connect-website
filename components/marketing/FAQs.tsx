'use client';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

// stessa “glass card” delle review
const GLASS =
  'rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.25)]';

export default function FAQs() {
  return (
    <section id="faqs" className="py-14 md:py-18">
      {/* stesso wrapper delle review: max-w-6xl */}
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <h2 className="text-center text-xl md:text-2xl font-semibold tracking-tight text-white/90">
          FAQs
        </h2>

        {/* card full-width dentro lo stesso container */}
        <div className={`mt-6 md:mt-8 ${GLASS}`}>
          {/* divider interni, niente glow laterale */}
          <div className="divide-y divide-white/10">
            <Accordion type="single" className="w-full">
              <AccordionItem value="q1" className="border-0 rounded-none bg-transparent">
                <AccordionTrigger className="px-5 md:px-6 py-4 md:py-5 text-white/90 hover:bg-white/0">
                  Can you handle excise and customs?
                </AccordionTrigger>
                <AccordionContent className="px-5 md:px-6 text-white/80">
                  Yes. We manage excise, customs and local paperwork end-to-end
                  with standardized checks and flows.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q2" className="border-0 rounded-none bg-transparent">
                <AccordionTrigger className="px-5 md:px-6 py-4 md:py-5 text-white/90 hover:bg-white/0">
                  How do samples work?
                </AccordionTrigger>
                <AccordionContent className="px-5 md:px-6 text-white/80">
                  Tell us what you need. We prepare standard or custom kits, then
                  ship from our warehouse with tracking.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q3" className="border-0 rounded-none bg-transparent">
                <AccordionTrigger className="px-5 md:px-6 py-4 md:py-5 text-white/90 hover:bg-white/0">
                  Do you work with small wineries?
                </AccordionTrigger>
                <AccordionContent className="px-5 md:px-6 text-white/80">
                  Absolutely. We match buyers to export-ready wineries by style,
                  price range and compliance readiness.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* spazio sotto coerente con le sezioni precedenti */}
        <div className="h-10 md:h-14" />
      </div>
    </section>
  );
}
