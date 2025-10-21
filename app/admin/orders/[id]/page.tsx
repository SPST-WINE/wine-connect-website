// app/admin/orders/[id]/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";
import ConfirmSubmit from "@/components/ConfirmSubmit";

type OrderRow = {
  id: string;
  buyer_id: string;
  type: "samples" | "order";
  status: "pending" | "processing" | "shipped" | "completed" | "cancelled";
  created_at: string;
  tracking_code: string | null;
  carrier_code: string | null; // <-- opzionale se hai già aggiunto i corrieri
  notes: string | null;
};

type Buyer = { email: string | null; company_name: string | null } | null;

type OrderItem = {
  id: string;
  wine_id: string;
  quantity: number;
  unit_price: number | null;
  list_type: "sample" | "order";
};

type Wine = {
  id: string;
  name: string | null;
  vintage: string | null;
  image_url: string | null;
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

  // 1) Leggi ordine "semplice"
  const { data: ord, error: ordErr } = await supa
    .from("orders")
    .select("id,buyer_id,type,status,created_at,tracking_code,carrier_code,notes")
    .eq("id", params.id)
    .maybeSingle<OrderRow>();

  if (ordErr || !ord) return notFound();

  // 1b) Buyer (non blocca la pagina se manca)
  let buyer: Buyer = null;
  {
    const { data } = await supa
      .from("buyers")
      .select("email,company_name")
      .eq("id", ord.buyer_id)
      .maybeSingle();
    buyer = (data as Buyer) ?? null;
  }

  // 2) Righe ordine
  const { data: itemsRaw } = await supa
    .from("order_items")
    .select("id,wine_id,quantity,unit_price,list_type")
    .eq("order_id", ord.id);
  const items: OrderItem[] = (itemsRaw ?? []) as OrderItem[];

  // 3) Vini per le righe
  const wineIds = Array.from(new Set(items.map(i => i.wine_id))).filter(Boolean);
  const winesById = new Map<string, Wine>();
  if (wineIds.length) {
    const { data: wines } = await supa
      .from("wines")
      .select("id,name,vintage,image_url")
      .in("id", wineIds);
    (wines as Wine[] | null ?? []).forEach(w => winesById.set(w.id, w));
  }

  const subtotal = items.reduce(
    (acc, it) => acc + (it.unit_price ?? 0) * it.quantity,
    0
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Ordine #{ord.id.slice(0, 8)}</h1>
          <div className="text-sm text-neutral-600">
            {ord.type.toUpperCase()} • {new Date(ord.created_at).toLocaleString()}
          </div>
          <div className="text-sm text-neutral-600">
            {buyer?.company_name || buyer?.email || "—"}
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
          <input type="hidden" name="orderId" value={ord.id} />
          <label className="grid gap-1">
            <span className="text-xs text-neutral-600">Stato</span>
            <select name="status" defaultValue={ord.status} className="border rounded p-2">
              {STATI.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>

          {/* Se hai introdotto i corrieri in DB, mostra anche carrier_code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="grid gap-1">
              <span className="text-xs text-neutral-600">Tracking code</span>
              <input
                name="tracking_code"
                defaultValue={ord.tracking_code ?? ""}
                className="border rounded p-2"
                placeholder="es. UPS 1Z..."
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs text-neutral-600">Corriere</span>
              <select
                name="carrier_code"
                defaultValue={ord.carrier_code ?? ""}
                className="border rounded p-2"
              >
                <option value="">—</option>
                <option value="ups">UPS</option>
                <option value="dhl">DHL</option>
                <option value="fedex">FedEx</option>
                <option value="tnt">TNT</option>
                <option value="other">Altro</option>
              </select>
            </label>
          </div>

          <label className="grid gap-1">
            <span className="text-xs text-neutral-600">Note interne</span>
            <textarea
              name="notes"
              defaultValue={ord.notes ?? ""}
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
          {items.map((it) => {
            const w = winesById.get(it.wine_id);
            const line = (it.unit_price ?? 0) * it.quantity;
            return (
              <li key={it.id} className="flex items-center gap-4 rounded border p-3">
                <div className="w-16 h-16 rounded border overflow-hidden bg-neutral-50 shrink-0 grid place-items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      w?.image_url ||
                      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="100%" height="100%" fill="%23f3f4f6"/></svg>'
                    }
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">
                    {w?.name || "—"} {w?.vintage ? `(${w.vintage})` : ""}
                  </div>
                  <div className="text-xs text-neutral-600">
                    {it.list_type.toUpperCase()} • {money(it.unit_price)} cad.
                  </div>
                </div>

                {/* Update qty */}
                <form action="/api/admin/orders/item/update" method="post" className="flex items-center gap-2">
                  <input type="hidden" name="orderId" value={ord.id} />
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
                  <input type="hidden" name="orderId" value={ord.id} />
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
