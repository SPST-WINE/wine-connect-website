// components/ui/Modal.tsx
"use client";
import * as React from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidthClass?: string; // es. "max-w-xl"
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  maxWidthClass = "max-w-xl",
}: ModalProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Card */}
      <div
        className={`relative w-full ${maxWidthClass} rounded-2xl border border-white/10 bg-white/[0.04] text-slate-100 shadow-2xl`}
        style={{ boxShadow: "0 20px 120px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.06)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-white/5"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}
