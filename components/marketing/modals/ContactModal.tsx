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
    <Modal open={open} onClose={onClose} title={t.title} maxWidthClass="max-w-lg">
      {sent ? (
        <div className="text-emerald-400 text-sm">{t.ok}</div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const payload = serializeFormData(fd);
            console.log("Contact form:", payload); // integra qui (email/API/Supabase)
            setSent(true);
          }}
          className="grid gap-3"
        >
          <Label>
            <span className="label">{t.company}</span>
            <input name="company" required placeholder={t.company} className="input" />
          </Label>

          <div className="grid md:grid-cols-2 gap-3">
            <Label>
              <span className="label">{t.email}</span>
              <input name="email" type="email" required placeholder="name@company.com" className="input" />
            </Label>
            <Label>
              <span className="label">{t.phone}</span>
              <input name="phone" placeholder="+39 ..."
