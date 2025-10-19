// app/admin/orders/[id]/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";
import ConfirmSubmit from "@/components/ConfirmSubmit";
import {
  AdminToolbar,
  AdminCard,
  AdminSelect,
  AdminInput,
  AdminTextarea,
  AdminPrimaryButton,
} from "@/components/admin/UI";

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
  notes: string | null;
  buyers: { email: string | null; company_name: string | null } | null;
  items: OrderItem[];
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

export default async function AdminOrderDetail({ params }: { params: { id: string } }) {
  const { ok } = await requireAdmin();
  if (!ok) {
    return (
      <main className="flex-1 px-5 grid place-items-center">
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 text-center">
          Non autorizzato. <a className="underline" href="/login">Accedi</a>.
        </div>
      </main>
    );
  }

  const supa = createSupabaseServer();
  const { data: order, error } = await supa
    .from("orders")
    .select(
      `
      id, buyer_id, type, status, created_at, tracking_code, notes,
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

  const subtotal = order.items.reduce(
    (acc, it) => acc + (it.unit_price ?? 0) * it.quantity,
    0
  );

  return (
    <main className="flex-1 px-5">
      <div className="mx-auto max-w-[1200px] py-6 space-y-6">
        <AdminToolbar
          title={`Order #${order.id.slice(0, 8)}`}
          subtitle={`${order.type.toUpperCase()} • ${new Date(order.created_at).toLocaleString()}`}
          right={
            <Link
              href="/admin/orders"
              className="rounded-xl border border-white/10 px-3 py-2 text-white/85 hover:bg-white/5"
            >
              ← All orders
            </Link>
          }
        />

        {/* Header card */}
        <AdminCard className="p-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="text-[12px] uppercase tracking-wider text-white/60">Buyer</div>
              <div className="mt-1 text-white">
                {order.buyers?.company_name || order.buyers?.email || "—"}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="text-[12px] uppercase tracking-wider text-white/60">Status</div>
              <div className="mt-1 text-white">{order.status}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="text-[12px] uppercase tracking-wider text-white/60">Subtotal</div>
              <div className="mt-1 text-white font-semibold">{money(subtotal)}</div>
            </div>
          </div>
        </AdminCard>

        {/* Testata ordine */}
        <AdminCard className="p-5">
          <div className="text-sm font-medium text-white/90 mb-3">Order head</div>
          <form action="/api/admin/orders/update" method="post" className="grid gap-3 max-w-xl">
            <input type="hidden" name="orderId" value={order.id} />
            <label className="grid gap-1">
              <span className="text-[12px] text-white/70">Status</span>
              <AdminSelect name="status" defaultValue={order.status}>
                {STATI.map((s) => (
                  <option key={s} value={s} className="bg-[#0a1722]">
                    {s}
                  </option>
                ))}
              </AdminSelect>
            </label>

            <label className="grid gap-1">
              <span className="text-[12px] text-white/70">Tracking code</span>
              <AdminInput
                name="tracking_code"
                defaultValue={order.tracking_code ?? ""}
                placeholder="es. UPS 1Z…"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-[12px] text-white/70">Internal notes</span>
              <AdminTextarea
                name="notes"
                defaultValue={order.notes ?? ""}
                placeholder="Note operative, eccezioni, richieste speciali…"
              />
            </label>

            <div className="pt-1">
              <AdminPrimaryButton>Save</AdminPrimaryButton>
            </div>
          </form>
        </AdminCard>

        {/* Righe */}
        <AdminCard className="p-5">
          <div className="text-sm font-medium text-white/90 mb-3">Lines</div>
          <ul className="grid gap-3">
            {order.items.map((it) => {
              const img = it.wines?.image_url;
              const line = (it.unit_price ?? 0) * it.quantity;
              return (
                <li key={it.id} className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/30 p-3">
                  <div className="w-16 h-16 rounded-lg border border-white/10 overflow-hidden bg-black/40 shrink-0 grid place-items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        img ||
                        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='100%' height='100%' fill='%23111'/></svg>"
                      }
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-white truncate">
                      {it.wines?.name || "—"} {it.wines?.vintage ? `(${it.wines.vintage})` : ""}
                    </div>
                    <div className="text-xs text-white/70">
                      {it.list_type.toUpperCase()} • {money(it.unit_price)} cad.
                    </div>
                  </div>

                  {/* Update qty */}
                  <form action="/api/admin/orders/item/update" method="post" className="flex items-center gap-2">
                    <input type="hidden" name="orderId" value={order.id} />
                    <input type="hidden" name="itemId" value={it.id} />
                    <AdminInput
                      type="number"
                      name="qty"
                      min={0}
                      defaultValue={it.quantity}
                      className="w-24"
                    />
                    <button className="px-3 py-2 rounded-xl border border-white/10 text-sm text-white/90 hover:bg-white/5">
                      Aggiorna
                    </button>
                  </form>

                  {/* Delete riga */}
                  <form action="/api/admin/orders/item/delete" method="post" className="ml-2">
                    <input type="hidden" name="orderId" value={order.id} />
                    <input type="hidden" name="itemId" value={it.id} />
                    <ConfirmSubmit
                      confirmMessage="Eliminare questa riga?"
                      className="px-3 py-2 rounded-xl border border-red-500/60 text-red-200 text-sm"
                    >
                      Elimina
                    </ConfirmSubmit>
                  </form>

                  <div className="w-24 text-right font-semibold text-white">{money(line)}</div>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex justify-end">
            <div className="text-right">
              <div className="text-sm text-white/70">Subtotal</div>
              <div className="text-lg font-bold text-white">{money(subtotal)}</div>
            </div>
          </div>
        </AdminCard>
      </div>
    </main>
  );
}
