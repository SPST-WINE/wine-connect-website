// app/admin/orders/[id]/page.tsx
export const dynamic = 'force-dynamic';

import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";
import ConfirmSubmit from "@/components/ConfirmSubmit";

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
  carrier_code: string | null;
  notes: string | null;
  buyers: { email: string | null; company_name: string | null } | null;
  items: OrderItem[];
};

type Carrier = {
  code: string;
  name: string;
  tracking_url_template: string;
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
  return `€${n.toFixed(2)}`;
}

function buildTrackingUrl(template?: string | null, code?: string | null) {
  if (!template || !code) return null;
  return template.replace("{code}", encodeURIComponent(code));
}

export default async function AdminOrderDetail({ params }: { params: { id: string } }) {
  const { ok } = await requireAdmin();
  if (!ok) {
    return (
      <div className="mt-10">
        Non autorizzato. <Link className="underline" href="/login">Accedi</Link>.
      </div>
    );
  }

  const supa = createSupabaseServer();

  const [orderRes, carriersRes] = await Promise.all([
    supa
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
      .single<OrderRow>(),
    supa.from("shipping_carriers").select("code,name,tracking_url_template").order("name", { ascending: true }) as any as Promise<{ data: Carrier[] | null }>,
  ]);

  const { data: order, error } = orderRes;
  if (error || !order) return notFound();

  const carriers = carriersRes.data || [];
  const currentCarrier = carriers.find(c => c.code === order.carrier_code);
  const trackingHref = buildTrackingUrl(currentCarrier?.tracking_url_template, order.tracking_code);

  const subtotal = order.items.reduce(
    (acc, it) => acc + (it.unit_price ?? 0) * it.quantity,
    0
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Ordine #{order.id.slice(0,8)}</h1>
          <div className="text-sm text-neutral-600">
            {order.type.toUpperCase()} • {new Date(order.created_at).toLocaleString()}
          </div>
          <div className="text-sm text-neutral-600">
            {order.buyers?.company_name || order.buyers?.email || "—"}
          </div>
        </div>
        <nav className="text-sm flex gap-4">
          <Link className="underline" href="/admin">Dashboard</Link>
          <Link className="underline" href="/admin/orders">Ordini</Link>
        </nav>
      </div>

      {/* Stato / Tracking / Note */}
      <section className="rounded border bg-white p-4">
        <h2 className="font-semibold mb-3">Testata ordine</h2>
        <form action="/api/admin/orders/update" method="post" className="grid gap-3 max-w-xl">
          <input type="hidden" name="orderId" value={order.id} />
          <input type="hidden" name="redirect_to" value={`/admin/orders/${order.id}`} />

          <label className="grid gap-1">
            <span className="text-xs text-neutral-600">Stato</span>
            <select name="status" defaultValue={order.status} className="border rounded p-2">
              {STATI.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="grid gap-1">
              <span className="text-xs text-neutral-600">Corriere</span>
              <select
                name="carrier_code"
                defaultValue={order.carrier_code ?? ""}
                className="border rounded p-2"
              >
                <option value="">—</option>
                {carriers.map(c => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-1">
              <span className="text-xs text-neutral-600">Tracking code</span>
              <input
                name="tracking_code"
                defaultValue={order.tracking_code ?? ""}
                className="border rounded p-2"
                placeholder="es. UPS 1Z..."
              />
            </label>
          </div>

          {trackingHref ? (
            <div className="text-sm text-neutral-700">
              Link tracking:&nbsp;
              <a className="underline" href={trackingHref} target="_blank">
                Apri tracciamento {currentCarrier?.name}
              </a>
            </div>
          ) : null}

          <label className="grid gap-1">
            <span className="text-xs text-neutral-600">Note interne</span>
            <textarea
              name="notes"
              defaultValue={order.notes ?? ""}
              className="border rounded p-2 min-h-[100px]"
              placeholder="Note operative, eccezioni, richieste speciali..."
            />
          </label>

          <div className="pt-1">
            <button className="px-4 py-2 rounded bg-black text-white">Salva</button>
          </div>
        </form>
      </section>

      {/* Righe ordine */}
      <section className="rounded border bg-white p-4">
        <h2 className="font-semibold mb-3">Righe</h2>
        <ul className="grid gap-3">
          {order.items.map((it) => {
            const img = it.wines?.image_url;
            const line = (it.unit_price ?? 0) * it.quantity;
            return (
              <li key={it.id} className="flex items-center gap-4 rounded border p-3">
                <div className="w-16 h-16 rounded border overflow-hidden bg-neutral-50 shrink-0 grid place-items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="100%" height="100%" fill="%23f3f4f6"/></svg>'}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">
                    {it.wines?.name || "—"} {it.wines?.vintage ? `(${it.wines.vintage})` : ""}
                  </div>
                  <div className="text-xs text-neutral-600">
                    {it.list_type.toUpperCase()} • {money(it.unit_price)} cad.
                  </div>
                </div>

                {/* Update qty */}
                <form action="/api/admin/orders/item/update" method="post" className="flex items-center gap-2">
                  <input type="hidden" name="orderId" value={order.id} />
                  <input type="hidden" name="itemId" value={it.id} />
                  <input
                    className="border rounded p-2 w-20"
                    type="number"
                    name="qty"
                    min={0}
                    defaultValue={it.quantity}
                  />
                  <button className="px-3 py-2 rounded border text-sm">Aggiorna</button>
                </form>

                {/* Delete riga */}
                <form action="/api/admin/orders/item/delete" method="post" className="ml-2">
                  <input type="hidden" name="orderId" value={order.id} />
                  <input type="hidden" name="itemId" value={it.id} />
                  <ConfirmSubmit
                    confirmMessage="Eliminare questa riga?"
                    className="px-3 py-2 rounded border border-red-600 text-red-600 text-sm"
                  >
                    Elimina
                  </ConfirmSubmit>
                </form>

                <div className="w-24 text-right font-semibold">{money(line)}</div>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 flex justify-end">
          <div className="text-right">
            <div className="text-sm text-neutral-600">Subtotale</div>
            <div className="text-lg font-bold">{money(subtotal)}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
