// app/admin/orders/[id]/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";

type OrderItem = {
  id: string;
  wine_id: string;
  quantity: number;
  unit_price: number | null;
  list_type: "sample" | "order";
  wines: { name: string; vintage: string | null; image_url: string | null };
};

type OrderRow = {
  id: string;
  buyer_id: string;
  type: "samples" | "order";
  status: "pending" | "processing" | "shipped" | "completed" | "cancelled";
  created_at: string;
  tracking_code: string | null;
  carrier_code: string | null; // <— nuovo
  notes: string | null;        // se non esiste in DB, rimuovi/aggiungi tu
  buyers:
    | {
        email: string | null;
        company_name: string | null;
      }
    | null;
  items: OrderItem[];
};

type Carrier = {
  code: string;
  name: string;
  tracking_url_template: string | null;
  active: boolean | null;
};

const STATI: OrderRow["status"][] = [
  "pending",
  "processing",
  "shipped",
  "completed",
  "cancelled",
];

function money(n: number | null | undefined) {
  if (n == null) return "—";
  return `€ ${n.toFixed(2)}`;
}

function buildTrackingUrl(
  t?: string | null,
  template?: string | null
): string | null {
  if (!t || !template) return null;
  return template.replace(/\{tracking\}/g, encodeURIComponent(t));
}

export default async function AdminOrderDetail({
  params,
}: {
  params: { id: string };
}) {
  const { ok } = await requireAdmin();
  if (!ok) {
    return (
      <div className="mt-10">
        Non autorizzato. <Link className="underline" href="/login">Accedi</Link>.
      </div>
    );
  }

  const supa = createSupabaseServer();

  // Ordine
  const { data: order, error } = await supa
    .from("orders")
    .select(
      `
      id, buyer_id, type, status, created_at, tracking_code, carrier_code, notes,
      buyers:buyer_id(email, company_name),
      items:order_items(
        id, wine_id, quantity, unit_price, list_type,
        wines:wine_id(name, vintage, image_url)
      )
    `
    )
    .eq("id", params.id)
    .single<OrderRow>();

  if (error || !order) return notFound();

  // Carrier attivi
  const { data: carriers } = await supa
    .from("shipping_carriers")
    .select("code,name,tracking_url_template,active")
    .eq("active", true)
    .order("name", { ascending: true }) as unknown as {
    data: Carrier[] | null;
  };

  const subtotal = order.items.reduce(
    (acc, it) => acc + (it.unit_price ?? 0) * it.quantity,
    0
  );

  // URL tracking (preview)
  const selectedCarrier = (carriers ?? []).find(
    (c) => c.code === order.carrier_code
  );
  const trackingHref = buildTrackingUrl(
    order.tracking_code,
    selectedCarrier?.tracking_url_template ?? null
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wider text-white/60">
              Admin · Order
            </div>
            <h1 className="text-2xl font-bold text-white">
              #{order.id.slice(0, 8)} · {order.type.toUpperCase()}
            </h1>
            <div className="text-white/70 text-sm">
              {new Date(order.created_at).toLocaleString()} —{" "}
              {order.buyers?.company_name || order.buyers?.email || "—"}
            </div>
          </div>
          <Link
            href="/admin/orders"
            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/85 hover:bg-white/5"
          >
            ← Back to orders
          </Link>
        </div>
      </div>

      {/* Stato / Tracking / Totale */}
      <section className="grid gap-4 md:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
          <div className="text-xs uppercase tracking-wider text-white/60">
            Status & Tracking
          </div>

          <form
            action="/api/admin/orders/update"
            method="post"
            className="mt-3 grid gap-3 md:grid-cols-[200px_1fr_220px_auto]"
          >
            <input type="hidden" name="orderId" value={order.id} />

            {/* Stato */}
            <label className="grid gap-1">
              <span className="text-[11px] text-white/60">Status</span>
              <select
                name="status"
                defaultValue={order.status}
                className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white"
              >
                {STATI.map((s) => (
                  <option key={s} value={s} className="bg-[#0a1722]">
                    {s}
                  </option>
                ))}
              </select>
            </label>

            {/* Tracking code */}
            <label className="grid gap-1">
              <span className="text-[11px] text-white/60">Tracking code</span>
              <input
                name="tracking_code"
                defaultValue={order.tracking_code ?? ""}
                placeholder="es. 1Z..."
                className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white"
              />
            </label>

            {/* Carrier */}
            <label className="grid gap-1">
              <span className="text-[11px] text-white/60">Carrier</span>
              <select
                name="carrier_code"
                defaultValue={order.carrier_code ?? ""}
                className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white"
              >
                <option value="" className="bg-[#0a1722]">
                  — Nessuno —
                </option>
                {(carriers ?? []).map((c) => (
                  <option key={c.code} value={c.code} className="bg-[#0a1722]">
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex items-end">
              <button
                className="h-10 rounded-lg px-4 font-semibold text-[#0f1720]"
                style={{ background: "#E33955" }}
              >
                Salva
              </button>
            </div>
          </form>

          {/* Badge + preview tracking */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full border border-white/10 bg-white/10 px-2 py-1 text-white/80">
              {order.status.toUpperCase()}
            </span>
            {order.tracking_code && (
              <span className="rounded-full border border-white/10 bg-white/10 px-2 py-1 text-white/80">
                Tracking {order.tracking_code}
              </span>
            )}
            {trackingHref && (
              <a
                href={trackingHref}
                target="_blank"
                className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-white/80 underline"
              >
                Apri tracking {selectedCarrier?.name}
              </a>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
          <div className="text-xs uppercase tracking-wider text-white/60">
            Total
          </div>
          <div className="mt-2 text-2xl font-bold text-white">
            {money(subtotal)}
          </div>
          <div className="text-xs text-white/60 mt-1">
            (item × qty, tasse/sped. non incluse)
          </div>
        </div>
      </section>

      {/* Items */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
        <div className="text-xs uppercase tracking-wider text-white/60">
          Items
        </div>

        <ul className="mt-3 grid gap-3">
          {order.items.map((it) => {
            const img = it.wines?.image_url;
            const line = (it.unit_price ?? 0) * it.quantity;
            return (
              <li
                key={it.id}
                className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/30 p-3"
              >
                <div className="w-16 h-16 rounded border border-white/10 overflow-hidden bg-neutral-900/40 shrink-0 grid place-items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      img ||
                      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='100%' height='100%' fill='%231f2937'/></svg>"
                    }
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1 text-white">
                  <div className="font-medium truncate">
                    {it.wines?.name || "—"}{" "}
                    {it.wines?.vintage ? `(${it.wines.vintage})` : ""}
                  </div>
                  <div className="text-xs text-white/60">
                    {it.list_type.toUpperCase()} • {money(it.unit_price)} cad.
                  </div>
                </div>

                <div className="w-24 text-right font-semibold text-white">
                  {money(line)}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
