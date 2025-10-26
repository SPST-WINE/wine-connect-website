// components/marketing/modals/ContactModal.tsx
"use client";
import * as React from "react";
import Modal from "@/components/ui/Modal";
import { useI18n } from "@/components/site/LanguageProvider";

export default function ContactModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const { lang } = useI18n();
  const [sent, setSent] = React.useState(false);
  const companyRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      // autofocus gradevole dopo animazione
      const t = setTimeout(() => companyRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [open]);

  const t =
    lang === "it"
      ? {
          title: "Get in touch",
          company: "Azienda",
          email: "Email",
          phone: "Telefono (opzionale)",
          notes: "Note / Richiesta",
          send: "Invia",
          ok: "Inviato! Ti ricontattiamo a breve.",
        }
      : {
          title: "Get in touch",
          company: "Company",
          email: "Email",
          phone: "Phone (optional)",
          notes: "Notes / Request",
          send: "Send",
          ok: "Sent! We’ll get back to you shortly.",
        };

  return (
    <Modal open={open} onClose={onClose} title={t.title} maxWidthClass="max-w-md">
      {sent ? (
        <div className="text-emerald-400 text-sm">{t.ok}</div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget as HTMLFormElement;
            const fd = new FormData(form);
            const payload: Record<string, FormDataEntryValue> = {};
            fd.forEach((v, k) => (payload[k] = v));
            console.log("Contact form:", payload); // TODO: wire API/email
            setSent(true);
          }}
          className="grid gap-4"
        >
          <Field label={t.company}>
            <input
              ref={companyRef}
              name="company"
              required
              placeholder={t.company}
              className="wc-input"
            />
          </Field>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label={t.email}>
              <input
                name="email"
                type="email"
                required
                placeholder="name@company.com"
                className="wc-input"
              />
            </Field>
            <Field label={t.phone}>
              <input name="phone" placeholder="+39 ..." className="wc-input" />
            </Field>
          </div>

          <Field label={t.notes}>
            <textarea
              name="notes"
              rows={4}
              placeholder=""
              className="wc-input resize-none"
            />
          </Field>

          <button
            type="submit"
            className="h-11 rounded-xl font-semibold text-[#0f1720] transition-all duration-150 hover:-translate-y-[1px]"
            style={{
              background:
                "linear-gradient(180deg, #E33955, #d5344f)",
              boxShadow:
                "0 10px 24px rgba(227,57,85,.25), inset 0 1px 0 rgba(255,255,255,.25)",
            }}
          >
            {t.send}
          </button>
        </form>
      )}
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1">
      <span className="text-[11px] tracking-wide text-white/70">{label}</span>
      <div className="relative">{children}</div>
    </label>
  );
}

/* Stile input “glass” coerente con la home (niente CSS esterno richiesto) */
// Suggerimento: se preferisci tenerlo in globals.css, sposta questa stringa.
const style = `
.wc-input{
  width:100%;
  border-radius:0.75rem; /* xl */
  padding:0.65rem 0.8rem;
  background: rgba(0,0,0,.35);
  border: 1px solid rgba(255,255,255,.12);
  color: rgba(255,255,255,.95);
  outline: none;
}
.wc-input::placeholder{ color: rgba(255,255,255,.40); }
.wc-input:focus{
  box-shadow: 0 0 0 2px rgba(255,255,255,.12), 0 8px 24px rgba(0,0,0,.25);
  border-color: rgba(255,255,255,.28);
  background: rgba(0,0,0,.28);
}
`;

// Inject stile una sola volta
if (typeof window !== "undefined" && !document.getElementById("wc-input-style")) {
  const s = document.createElement("style");
  s.id = "wc-input-style";
  s.innerHTML = style;
  document.head.appendChild(s);
}
