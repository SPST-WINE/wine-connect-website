export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireAdmin } from "@/lib/is-admin";

type Params = { params: { id: string } };

const STATUS = ["pending","processing","shipped","completed","cancelled"] as const;

export default async function AdminOrderDetail({ params }: Params) {
  const { ok, supa } = await requireAdmin();
  if (!ok || !supa) return <div className="mt-10">Non autorizzato.</div>;

  const orderId = params.id;

  // 1) Testata ordine + buyer + shipping
  const { data: order, error } = await supa
    .from("orders")
    .select(`
      id, type, status, created_at, tracking_code, totals, cart_id,
      buyer_id, shipping_address_id,
      buyers:buyer_id ( email, company_name ),
      addresses:shipping_address_id ( label, address, city, zip, country )
    `)
    .eq("id", orderId)
    .maybeSingle();

  if (error) return <div className="text-red-600">Errore: {error.message}</div>;
  if (!order) return <div className="text-sm">Ordine non trovato.</div>;

  // 2) Righe (cart_items) + vini
  const { data: items } = await supa
    .from("cart_items")
    .select(`
      id, wine_id, quantity, unit_price, list_type,
      wines:wine_id ( id, name, vintage, image_url, winery_id, wineries:winery_id ( name ) )
    `)
    .eq("cart_id", order.cart_id)
    .order("id");

  const rows = (items ?? []) as any[];
  const buyer = Array.isArray(order.buyers) ? order.buyers[0] : order.buyers;
  const addr  = Array.isArray(order.addresses) ? order.addresses[0] : order.addresses;

  const totals = (order.totals ?? {}) as any;
  const subtotal = Number(
    rows.reduce((s, r) => s + Number(r.unit_price ?? 0) * Number(r.quantity ?? 0), 0)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Ordine #{String(order.id).slice(0, 8)} · {String(order.type).toUpperCase()}
        </h1>
        <Link className="underline" href="/admin/orders">← Tutti gli ordini</Link>
      </div>

      {/* Meta + Update */}
      <section className="rounded border bg-white p-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <div className="text-sm text-neutral-600">
            Creato il {new Date(order.created_at).toLocaleString()}
          </div>
          <div className="text-sm">
            Buyer: <strong>{buyer?.company_name || buyer?.email || "—"}</strong>
          </div>
          <div className="text-sm">
            Shipping:{" "}
            {addr ? (
              <span>
                {addr.label ? `${addr.label} · ` : ""}
                {addr.address}, {addr.city} {addr.zip}, {addr.country}
              </span>
            ) : "—"}
          </div>
          <div className="text-sm">
            Totale (calcolato righe): <strong>€{subtotal.toFixed(2)}</strong>
          </div>
          {"grand_total" in totals && (
            <div className="text-xs text-neutral-600">
              Grand total (JSON): €{Number(totals.grand_total).toFixed(2)}
            </div>
          )}
        </div>

        <form
          action="/api/admin/orders/update-status"
          method="post"
          className="flex flex-col gap-2 md:items-end"
        >
          <input type="hidden" name="orderId" value={order.id} />
          <label className="text-sm">
            Stato
            <select
              name="status"
              defaultValue={order.status}
              className="border rounded p-2 ml-2"
            >
              {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>

          <label className="text-sm">
            Tracking
            <input
              name="tracking_code"
              defaultValue={order.tracking_code ?? ""}
              placeholder="Inserisci tracking"
              className="border rounded p-2 ml-2"
            />
          </label>

          <button className="px-4 py-2 rounded bg-black text-white w-fit">
            Salva
          </button>
        </form>
      </section>

      {/* Righe */}
      <section className="rounded border bg-white">
        <div className="p-4 border-b font-semibold">Righe</div>
        <div className="divide-y">
          {rows.map((r) => {
            const w = Array.isArray(r.wines) ? r.wines[0] : r.wines;
            const winery = w?.wineries?.name || "—";
            const lineTotal = Number(r.unit_price ?? 0) * Number(r.quantity ?? 0);
            return (
              <div key={r.id} className="p-4 flex items-center gap-4">
                <img
                  src={w?.image_url || "/placeholder.png"}
                  alt=""
                  className="h-14 w-14 rounded object-cover bg-neutral-100"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">
                    {w?.name} <span className="text-neutral-500">({w?.vintage})</span>
                  </div>
                  <div className="text-sm text-neutral-600 truncate">
                    {winery} · {String(r.list_type)} · Unit €{Number(r.unit_price ?? 0).toFixed(2)}
                  </div>
                </div>
                <div className="text-sm w-24">Q.ty: {r.quantity}</div>
                <div className="font-medium w-28 text-right">€{lineTotal.toFixed(2)}</div>
              </div>
            );
          })}

          {rows.length === 0 && (
            <div className="p-4 text-sm text-neutral-600">Nessuna riga.</div>
          )}
        </div>
      </section>
    </div>
  );
}
