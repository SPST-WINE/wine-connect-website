"use client";

import { useMemo, useState } from "react";

type Address = {
  id: string;
  label?: string | null;
  address?: string | null;
  city?: string | null;
  zip?: string | null;
  country?: string | null;
  is_default?: boolean | null;
};

export default function ShippingAddressPicker({
  addresses,
  defaultId,
}: {
  addresses: Address[];
  defaultId?: string;
}) {
  const [selected, setSelected] = useState<string>(defaultId || addresses?.[0]?.id || "");

  const current = useMemo(
    () => addresses.find((a) => a.id === selected),
    [addresses, selected]
  );

  return (
    <div className="space-y-2">
      <label className="block text-sm text-white/80">Shipping address</label>

      {/* wrapper relativo per caret custom */}
      <div className="relative">
        <select
          name="shipping_address_id"
          required
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="
            w-full appearance-none pr-10
            rounded-lg bg-black/30 border border-white/10 px-3 py-2
            text-white
          "
        >
          {addresses.map((a) => (
            <option key={a.id} value={a.id} className="bg-[#0a1722] text-white">
              {(a.label || a.address) ?? "—"} ({a.country || "—"})
              {a.is_default ? " · default" : ""}
            </option>
          ))}
        </select>

        {/* caret custom, più vicino al bordo ma non attaccato */}
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

      {/* dettaglio indirizzo */}
      {current && (
        <div className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm text-white/85">
          <div className="font-medium">
            {current.label || current.address || "—"}{" "}
            {current.is_default ? (
              <span className="ml-1 rounded-full border border-white/20 px-1.5 py-[1px] text-[11px] text-white/75">
                default
              </span>
            ) : null}
          </div>
          <div className="text-white/70">
            {[
              current.address,
              [current.zip, current.city].filter(Boolean).join(" "),
              current.country,
            ]
              .filter(Boolean)
              .join(" · ") || "—"}
          </div>
        </div>
      )}
    </div>
  );
}
