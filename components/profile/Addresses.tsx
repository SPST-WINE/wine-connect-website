"use client";

import * as React from "react";

/** Address shape used only for rendering the list */
type Address = {
  id: string;
  label: string | null;
  address: string | null;
  city: string | null;
  zip: string | null;
  country: string | null;
  is_default?: boolean | null;
};

export default function Addresses({
  buyerId,
  initial,
}: {
  buyerId: string;
  initial: Address[];
}) {
  // keep a local list so delete feels instant; create uses a full POST reload
  const [items, setItems] = React.useState<Address[]>(initial || []);

  return (
    <div className="grid gap-3">
      {/* Create (server POST, names aligned to your API) */}
      <form
        action="/api/profile/address/create"
        method="post"
        className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
      >
        <input type="hidden" name="buyerId" value={buyerId} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Label (e.g., Warehouse)">
            <Input name="label" placeholder="Label" />
          </Field>

          <div />{/* spacer to keep grid balanced */}

          <Field label="Address">
            <Input
              name="address"
              placeholder="Street and number"
              required
            />
          </Field>
          <Field label="City">
            <Input name="city" placeholder="City" required />
          </Field>

          <Field label="ZIP / Postal code">
            <Input name="zip" placeholder="ZIP / Postal code" required />
          </Field>
          <Field label="Country">
            <Input name="country" placeholder="Country" required />
          </Field>

          <label className="flex items-center gap-2 text-sm text-white/80 md:col-span-2">
            <input
              type="checkbox"
              name="is_default"
              className="h-4 w-4 rounded border-white/20 bg-black/40"
            />
            Set as default
          </label>
        </div>

        <div className="mt-4">
          <button
            className="h-11 w-full md:w-auto rounded-xl px-5 font-semibold text-[#0f1720]"
            style={{ background: "#E33955" }}
          >
            Add address
          </button>
        </div>
      </form>

      {/* Empty state */}
      {(!items || items.length === 0) && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/70">
          No addresses yet.
        </div>
      )}

      {/* List */}
      <ul className="grid gap-3">
        {items.map((a) => {
          const line = [a.address].filter(Boolean).join("");
          const tail = [a.city, a.zip, a.country].filter(Boolean).join(" — ");
          return (
            <li
              key={a.id}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-wider text-white/60">
                    {a.label || "Address"}
                  </div>
                  <div className="text-white/90 text-sm">{line || "—"}</div>
                  <div className="text-white/70 text-sm">{tail || "—"}</div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {a.is_default ? (
                    <span className="text-[11px] rounded-full border border-white/10 px-2 py-1 text-white/80">
                      Default
                    </span>
                  ) : null}

                  {/* Delete: server POST so it hits your existing route */}
                  <form action="/api/profile/address/delete" method="post">
                    <input type="hidden" name="addressId" value={a.id} />
                    <button className="rounded border border-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/5">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Field({
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

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 outline-none placeholder:text-white/40 text-white"
    />
  );
}
