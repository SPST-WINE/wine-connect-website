// app/admin/orders/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";

type OrderRow = {
  id: string;
  type: "samples" | "order" | "SAMPLE" | "ORDER";
  status: "pending" | "processing" | "shipped" | "completed" | "cancelled";
  created_at: string;
  tracking_code: string | null;
  carrier_code: string | null;
};

type Carrier = {
  code: string;
  name: string;
  tracking_url_template: string | null;
};

const STATI: OrderRow["status"][] = [
  "pending",
  "processing",
  "shipped",
  "completed",
  "cancelled",
];

function fmtMoney(n?: number | null) {
  if (n == null) return "€ 0.00";
  return `€ ${Number(n).toFixed(2)}`;
}

function badgeClass(status: OrderRow["status"]) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold";
  switch (status) {
    case "pending":
      return `${base} bg-yellow-500/15 text-yellow-300 ring-1 ring-yellow-500/25`;
    case "processing":
      return `${base} bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/25`;
    case "shipped":
      return `${base} bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/25`;
    case "completed":
      return `${base} bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25`;
    case "cancelled":
      return `${base} bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/25`;
  }
}

/** Normalizza i template dei corrieri: {TRACKING}, {code}, {TRACKING_CODE} */
function buildTrackingUrl(tpl: string | null | undefined, code: string | null | undefined) {
  if (!tpl || !code) return null;
  return tpl.replace(/\{TRACKING\}|\{code\}|\{TRACKING_CODE\}/g, encodeURIComponent(code));
}

export default async function AdminOrders() {
  const { ok } = await requireAdmin();
  if (!ok) return <div className="mt-10">Non autorizzato.</div>;

  const supa = createSupabaseServer();

  const { data: carriers = [] } = await supa
    .from("shipping_carriers")
    .select("code,name,tracking_url_template")
    .eq("active", true)
    .order("name", { ascending: true });

  const CARRIERS_MAP = new Map<string, Carrier>(
    (carriers as Carrier[]).map((c) => [c.code, c])
  );

  const { data: orders = [] } = await supa
    .from("orders")
    .select("id,type,status,created_at,tracking_code,carrier_code")
    .order("created_at", { ascending: false });

  return (
    <main className="px-5">
      <div className="mx-auto max-w-6xl py-6 space-y-6">
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-white/60">
                Admin · Orders
              </div>
              <h1 className="text-2xl font-bold">Ordini</h1>
              <p className="text-white/70 text-sm">
                Panoramica ordini, tracking e stato.
              </p>
            </div>
            <Link
              href="/admin"
              className="rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
            >
              ← Dashboard
            </Link>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-white/10 px-2.5 py-1">Orders</span>
            <Link href="/admin/wineries" className="rounded-full bg-white/5 px-2.5 py-1 hover:bg-white/10">Wineries</Link>
            <Link href="/admin/wines" className="rounded-full bg-white/5 px-2.5 py-1 hover:bg-white/10">Wines</Link>
            <Link href="/admin/buyers" className="rounded-full bg-white/5 px-2.5 py-1 hover:bg-white/10">Buyers</Link>
          </div>
        </section>

        <ul className="space-y-4">
          {(orders as OrderRow[]).map((o) => {
            const carrier = o.carrier_code ? CARRIERS_MAP.get(o.carrier_code) : undefined;
            const trackHref = buildTrackingUrl(carrier?.tracking_url_template, o.tracking_code);

            return (
              <li key={o.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">
                      {`#${o.id.slice(0, 8)}`}{" "}
                      <span className="text-white/60">· {String(o.type).toUpperCase()}</span>
                    </div>
                    <div className="text-xs text-white/60">
                      {new Date(o.created_at).toLocaleString()}
                    </div>
                  </div>
                  <span className={badgeClass(o.status)}>{o.status.toUpperCase()}</span>
                </div>

                {/* FORM */}
                <form action="/api/admin/orders/update" method="post" className="mt-3 grid gap-3 md:grid-cols-[1fr,1fr,2fr,auto,auto] items-end">
                  <input type="hidden" name="orderId" value={o.id} />

                  <label className="grid gap-1">
                    <span className="text-[11px] uppercase tracking-wider text-white/60">status</span>
                    <select name="status" defaultValue={o.status} className="h-10 rounded-lg border border-white/10 bg-black/30 px-3">
                      {STATI.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </label>

                  <label className="grid gap-1">
                    <span className="text-[11px] uppercase tracking-wider text-white/60">carrier</span>
                    <select name="carrier_code" defaultValue={o.carrier_code ?? ""} className="h-10 rounded-lg border border-white/10 bg-black/30 px-3">
                      <option value="">— Nessuno —</option>
                      {(carriers as Carrier[]).map((c) => (
                        <option key={c.code} value={c.code}>{c.name}</option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-1">
                    <span className="text-[11px] uppercase tracking-wider text-white/60">tracking</span>
                    <input
                      name="tracking_code"
                      defaultValue={o.tracking_code ?? ""}
                      className="h-10 rounded-lg border border-white/10 bg-black/30 px-3"
                      placeholder="es. 1Z..."
                    />
                  </label>

                  {/* Bottoni: stessa altezza e baseline */}
                  <div className="flex items-end">
                    <button className="h-10 rounded-lg bg-rose-500 px-4 font-semibold text-[#0f1720]">
                      Salva
                    </button>
                  </div>

                  <div className="flex items-end">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="h-10 inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-4 text-sm hover:bg-white/10"
                    >
                      Dettagli →
                    </Link>
                  </div>
                </form>

                {/* Chips info */}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className={badgeClass(o.status)}>{o.status.toUpperCase()}</span>
                  {o.tracking_code && (
                    <span className="rounded-full bg-white/10 px-2.5 py-1">
                      Tracking <span className="opacity-75">{o.tracking_code}</span>
                    </span>
                  )}
                  {trackHref && (
                    <a
                      href={trackHref}
                      target="_blank"
                      className="rounded-full bg-white/10 px-2.5 py-1 hover:bg-white/15"
                    >
                      Apri tracking {carrier?.code}
                    </a>
                  )}
                </div>
              </li>
            );
          })}

          {(orders ?? []).length === 0 && (
            <li className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center text-sm text-white/70">
              Nessun ordine presente.
            </li>
          )}
        </ul>
      </div>
    </main>
  );
}
