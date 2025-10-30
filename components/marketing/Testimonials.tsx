"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function FAQs() {
  return (
    <section id="faqs" className="py-12">
      {/* stesso wrapper delle testimonials */}
      <div className="mx-auto max-w-[1200px] px-5">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white/90 text-center md:text-left">
          FAQs
        </h2>

        {/* glass card identica alle review */}
        <div
          className="rounded-2xl"
          style={{
            border: "1px solid rgba(255,255,255,.12)",
            background: "rgba(255,255,255,.04)",
            boxShadow:
              "0 6px 20px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.05)",
          }}
        >
          {/* divider interni sottili, niente hover-outline */}
          <Accordion type="single" collapsible className="divide-y divide-white/10">
            <AccordionItem value="q1" className="border-0">
              <AccordionTrigger className="px-5 md:px-6 py-4 md:py-5 text-[15px] md:text-base text-white/90 hover:bg-transparent">
                Can you handle excise and customs?
              </AccordionTrigger>
              <AccordionContent className="px-5 md:px-6 pb-5 -mt-1 text-white/80">
                Yes. We manage excise, customs and local paperwork end-to-end
                with standardized checks and flows.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q2" className="border-0">
              <AccordionTrigger className="px-5 md:px-6 py-4 md:py-5 text-[15px] md:text-base text-white/90 hover:bg-transparent">
                How do samples work?
              </AccordionTrigger>
              <AccordionContent className="px-5 md:px-6 pb-5 -mt-1 text-white/80">
                Tell us what you need. We prepare standard or custom kits, then
                ship from our warehouse with tracking.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q3" className="border-0">
              <AccordionTrigger className="px-5 md:px-6 py-4 md:py-5 text-[15px] md:text-base text-white/90 hover:bg-transparent">
                Do you work with small wineries?
              </AccordionTrigger>
              <AccordionContent className="px-5 md:px-6 pb-5 -mt-1 text-white/80">
                Absolutely. We match buyers to export-ready wineries by style,
                price range and compliance readiness.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
