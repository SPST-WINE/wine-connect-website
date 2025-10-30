'use client';

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

export default function FAQs() {
  return (
    <section id="faqs" className="relative w-full py-14 md:py-18">
      {/* Titolo */}
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-xl md:text-2xl font-semibold tracking-tight text-white/90 mb-6">
          FAQs
        </h2>
      </div>

      {/* Pannello glass full width dentro il container di pagina */}
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div
          className="
            rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-md
            shadow-[0_10px_40px_-10px_rgba(0,0,0,.45)]
            px-3 sm:px-4 md:px-6
            py-2 md:py-3
            mb-20
          "
        >
          {/* group accordion con separatori interni, niente hover */}
          <Accordion type="single" className="divide-y divide-white/10">
            <AccordionItem value="q1" className="rounded-none border-none bg-transparent">
              <AccordionTrigger className="rounded-none px-2 md:px-1 py-4 md:py-5">
                Can you handle excise and customs?
              </AccordionTrigger>
              <AccordionContent className="px-2 md:px-1 pb-5 text-white/80">
                Yes. We manage excise, customs and local paperwork end-to-end with standardized checks and flows.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q2" className="rounded-none border-none bg-transparent">
              <AccordionTrigger className="rounded-none px-2 md:px-1 py-4 md:py-5">
                How do samples work?
              </AccordionTrigger>
              <AccordionContent className="px-2 md:px-1 pb-5 text-white/80">
                Tell us what you need. We prepare standard or custom kits, then ship from our warehouse with tracking.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q3" className="rounded-none border-none bg-transparent">
              <AccordionTrigger className="rounded-none px-2 md:px-1 py-4 md:py-5">
                Do you work with small wineries?
              </AccordionTrigger>
              <AccordionContent className="px-2 md:px-1 pb-5 text-white/80">
                Absolutely. We match buyers to export-ready wineries by style, price range and compliance readiness.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
