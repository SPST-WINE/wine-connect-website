"use client";

import * as React from "react";

type Address = {
  id: string;
  label: string | null;
  address: string | null;
  city: string | null;
  zip: string | null;
  country: string | null;
  is_default: boolean | null;
};

type Props = {
  buyerId: string;
  initial: Address[];
  usage?: Record<string, number>; // addressId -> count
};

export default function Addresses({ buyerId, initial, usage = {} }: Props) {
  const [rows] = React.useState<Address[]>(initial);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      {/* CREATE */}
      <form action="/api/profile/address/create" method="post" className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input type="hidden" name="buyerId" value={buyerId} />

        <Field label="Label (e.g., Warehouse)">
          <input name="label" placeholder="Label"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-3 outline-none text-white placeholder:text-white/40" />
        </Field>

        <Field label="Full name">
          <input name="full_name" placeholder="Full name"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-3 outline-none text-white placeholder:text-white/40" />
        </Field>

        <Field label="Address line 1">
          <input name="address" placeholder="Street and number"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-3 outline-none text-white placeholder:text-white/40" />
        </Field>

        <Field label="City">
          <input name="city" placeholder="City"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-3 outline-none text-white placeholder:text-white/40" />
        </Field>

        <Field label="ZIP / Postal code">
          <input name="zip" placeholder="ZIP / Postal code"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-3 outline-none text-white placeholder:text-white/40" />
        </Field>

        <Field label="Country">
          <input name="country" placeholder="Country"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-3 outline-none text-white placeholder:text-white/40" />
        </Field>

        <div className="md:col-span-2 flex items-center justify-between pt-1">
          <label className="inline-flex items-center gap-2 text-white/80 text-sm">
            <input type="checkbox" name="is_default" className="accent-[#E33955]" />
            Set as default
          </label>

          <button className="h-11 rounded-xl px-4 text-sm font-semibold text-[#0f1720]" style={{ background: "#E33955" }}>
            Add address
          </button>
        </div>
      </form>

      {/* LIST */}
      <div className="mt-4 rounded-xl border border-white/10">
        {rows.length === 0 ? (
          <div className="px-4 py-3 text-white/70 text-sm">No addresses yet.</div>
        ) : (
          <ul className="divide-y divide-white/10">
            {rows.map((a) => {
              const count = usage[a.id] ?? 0;
              const line = [
                a.address,
                a.city ? ` ${a.city}` : "",
                a.zip ? ` ${a.zip}` : "",
                a.country ? ` — ${a.country}` : "",
              ].join("");

              return (
                <li key={a.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-[11px] text-white/60 uppercase tracking-wide flex items-center gap-2">
                        {a.label || "Address"}
                        {a.is_default ? (
                          <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-[11px]">Default</span>
                        ) : null}
                        {count > 0 ? (
                          <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-[11px]">In use</span>
                        ) : null}
                      </div>
                      <div className="text-white font-medium">{line || "—"}</div>
                    </div>

                    <form action="/api/profile/address/delete" method="post">
                      <input type="hidden" name="addressId" value={a.id} />
                      <button className="rounded border border-white/10 px-3 py-2 text-sm hover:bg-white/5 text-white/90">
                        Delete
                      </button>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1">
      <span className="text-[11px] text-white/60">{label}</span>
      {children}
    </label>
  );
}
