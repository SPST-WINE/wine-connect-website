// components/common/CaretSelect.tsx
"use client";

import * as React from "react";

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  children: React.ReactNode;
};

export default function CaretSelect({ children, className = "", ...rest }: Props) {
  return (
    <div className="relative">
      <select
        {...rest}
        className={[
          "w-full appearance-none pr-10",
          "rounded-xl bg-black/30 border border-white/10 px-3 py-2",
          "text-white placeholder:text-white/40",
          className,
        ].join(" ")}
      >
        {children}
      </select>

      {/* caret custom, coerente su tutti i browser */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        width="18"
        height="18"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-80"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}
