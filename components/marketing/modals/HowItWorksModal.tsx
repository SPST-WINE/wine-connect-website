// components/marketing/modals/HowItWorksModal.tsx
"use client";
import Modal from "@/components/ui/Modal";
import { useI18n } from "@/components/site/LanguageProvider";

export default function HowItWorksModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const { lang } = useI18n();

  const steps =
    lang === "it"
      ? [
          ["Condividi il brief", "Stili, fasce prezzo, certificazioni, mercati. 2 minuti."],
          ["Ricevi una shortlist", "Selezioni curate da cantine export-ready."],
          ["Richiedi campioni", "Kit standard o custom. Spediti dal nostro magazzino."],
          ["Ordina & spediamo", "Consolidamento, accise, documenti. Tracking end-to-end."],
        ]
      : [
          ["Share your brief", "Styles, price points, certifications, markets. 2 minutes."],
          ["Get a shortlist", "Curated matches from export-ready wineries."],
          ["Request samples", "Standard or custom kits. Dispatched from our warehouse."],
          ["Order & ship", "Consolidation, excise, docs. End-to-end tracking."],
        ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={lang === "it" ? "How it works" : "How it works"}
      maxWidthClass="max-w-2xl"
    >
      <ol className="grid gap-3">
        {steps.map(([t, d], i) => (
          <li
            key={i}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
          >
            <div className="flex items-baseline gap-3">
              <span className="text-xs px-2 py-1 rounded-md border border-white/10 bg-white/[0.04]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <div className="font-semibold">{t}</div>
                <div className="text-sm text-white/75">{d}</div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Modal>
  );
}
