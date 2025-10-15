"use client";

import * as React from "react";

type AddressRow = {
  id: string;
  label: string | null;
  address: string | null;
  city: string | null;
  zip: string | null;
  country: string | null;
  is_default: boolean | null;
};

export default function Addresses({
  buyerId,
  initial,
}: {
  buyerId: string;
  initial: AddressRow[];
}) {
  // Solo per UX immediata dopo submit: non salviamo client-side, facciamo refresh.
  const [submitting, setSubmitting] = React.useState(false);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      {/* Form nuovo indirizzo */}
      <form
        action="/api/profile/address/create"
        method="post"
        onSubmit={() => setSubmitting(true)}
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        <input type="hidden" name="buyerId" value={buyerId} />

        <FormField label="Label (e.g., Warehouse)">
          <input
            name="label"
            placeholder="Label"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-3 outline-none text-white placeholder:text-white/40"
          />
        </FormField>

        <div />

        <FormField label="Address">
          <input
            name="address"
            placeholder="Street and number"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-3 outline-none text-white placeholder:text-white/40"
            required
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="City">
            <input
              name="city"
              placeholder="City"
              className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-3 outline-none text-white placeholder:text-white/40"
            />
          </FormField>
          <FormField label="ZIP / Postal code">
            <input
              name="zip"
              placeholder="ZIP / Postal code"
              className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-3 outline-none text-white placeholder:text-white/40"
            />
          </FormField>
        </div>

        <FormField label="Country">
          <input
            name="country"
            placeholder="Country"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-3 outline-none text-white placeholder:text-white/40"
          />
        </FormField>

        <div className="flex items-center gap-2">
          <input
            id="is_default"
            name="is_default"
            type="checkbox"
            className="h-4 w-4 rounded border-white/20 bg-black/30"
          />
          <label htmlFor="is_default" className="text-sm text-white/80">
            Set as default
          </label>
        </div>

        <div className="md:col-span-2">
          <button
            disabled={submitting}
            className="h-11 rounded-xl px-4 w-full md:w-auto text-sm font-semibold text-[#0f1720]"
            style={{ background: "#E33955" }}
          >
            {submitting ? "Saving…" : "Add address"}
          </button>
        </div>
      </form>

      {/* Lista indirizzi */}
      <div className="mt-4 rounded-xl border border-white/10 bg-black/20">
        {(!initial || initial.length === 0) && (
          <div className="p-4 text-sm text-white/60">No addresses yet.</div>
        )}

        {initial && initial.length > 0 && (
          <ul className="divide-y divide-white/10">
            {initial.map((a) => {
              const line = [
                a.address,
                a.city,
                a.zip,
                a.country,
              ]
                .filter(Boolean)
                .join(", ");

              return (
                <li
                  key={a.id}
                  className="p-4 flex items-start justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-wide text-white/50">
                      {a.label || "Address"}
                    </div>
                    <div className="text-white/90">{line || "—"}</div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {a.is_default ? (
                      <span className="rounded-full border border-white/15 bg-white/10 px-2 py-1 text-[11px] text-white/80">
                        Default
                      </span>
                    ) : null}

                    <form action="/api/profile/address/delete" method="post">
                      <input type="hidden" name="addressId" value={a.id} />
                      <button
                        className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80 hover:bg-white/5"
                        aria-label="Delete address"
                      >
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

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-[11px] text-white/60">{label}</span>
      {children}
    </label>
  );
}
