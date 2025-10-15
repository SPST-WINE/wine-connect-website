"use client";

import * as React from "react";

type Address = {
  id: string;
  label: string | null;
  address?: string | null; // legacy
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  region?: string | null;
  postal_code?: string | null;
  zip?: string | null; // legacy
  country: string | null;
  phone?: string | null;
  is_default?: boolean | null;
};

export default function Addresses({
  buyerId,
  initial,
}: {
  buyerId: string;
  initial: Address[];
}) {
  const [items, setItems] = React.useState<Address[]>(initial || []);
  const [loading, setLoading] = React.useState(false);

  async function create(form: HTMLFormElement) {
    setLoading(true);
    try {
      const fd = new FormData(form);
      const res = await fetch("/api/profile/address/create", {
        method: "POST",
        body: fd,
      });
      if (res.ok) {
        // @ts-ignore
        const { id } = await res.json().catch(() => ({}));
        // optimistic reload
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  }

  async function remove(addressId: string) {
    if (!confirm("Delete this address?")) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("addressId", addressId);
      const res = await fetch("/api/profile/address/delete", {
        method: "POST",
        body: fd,
      });
      if (res.ok) {
        setItems((prev) => prev.filter((x) => x.id !== addressId));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-3">
      {/* Create */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          create(e.currentTarget);
        }}
        className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
      >
        <input type="hidden" name="buyerId" value={buyerId} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Label (e.g., Warehouse)">
            <Input name="label" placeholder="Label" />
          </Field>
          <Field label="Full name">
            <Input name="full_name" placeholder="Full name" />
          </Field>
          <Field label="Address line 1">
            <Input name="line1" placeholder="Address line 1" />
          </Field>
          <Field label="Address line 2">
            <Input name="line2" placeholder="Address line 2" />
          </Field>
          <Field label="City">
            <Input name="city" placeholder="City" />
          </Field>
          <Field label="Region / State">
            <Input name="region" placeholder="Region / State" />
          </Field>
          <Field label="Postal code">
            <Input name="postal_code" placeholder="ZIP / Postal code" />
          </Field>
          <Field label="Country">
            <Input name="country" placeholder="Country" />
          </Field>
          <Field label="Phone">
            <Input name="phone" placeholder="+1 ..." />
          </Field>
          <label className="flex items-center gap-2 text-sm text-white/80">
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
            disabled={loading}
            className="h-11 w-full md:w-auto rounded-xl px-5 font-semibold text-[#0f1720] disabled:opacity-60"
            style={{ background: "#E33955" }}
          >
            {loading ? "Saving…" : "Add address"}
          </button>
        </div>
      </form>

      {/* List */}
      {(!items || items.length === 0) && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/70">
          No addresses yet.
        </div>
      )}

      <ul className="grid gap-3">
        {items.map((a) => {
          const zip = a.postal_code || a.zip || "";
          const line = a.line1 || a.address || "";
          const line2 = a.line2 ? `, ${a.line2}` : "";
          const cityLine = [a.city, a.region, zip].filter(Boolean).join(", ");
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
                  <div className="text-white font-medium">
                    {a.full_name || "—"}
                  </div>
                  <div className="text-white/80 text-sm">
                    {line}
                    {line2} — {cityLine} — {a.country || "—"}
                  </div>
                  {a.phone ? (
                    <div className="text-white/70 text-sm mt-0.5">{a.phone}</div>
                  ) : null}
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {a.is_default ? (
                    <span className="text-[11px] rounded-full border border-white/10 px-2 py-1 text-white/80">
                      Default
                    </span>
                  ) : null}
                  <button
                    onClick={() => remove(a.id)}
                    className="rounded border border-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/5"
                  >
                    Delete
                  </button>
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
