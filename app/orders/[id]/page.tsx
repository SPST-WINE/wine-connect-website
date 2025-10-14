export const dynamic = 'force-dynamic';

import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function OrderDetail({ params }: { params: { id: string } }) {
  const supa = createSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return <div className="mt-10">Devi <a className="underline" href="/login">accedere</a>.</div>;

  // buyer
  const { data: buyer } = await supa
    .from("buyers")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();
  if (!buyer) return <div>Profilo buyer non trovato.</div>;

  // order (ownership)
  const { data: order } = await supa
    .from("orders")
    .select("id, type, status, totals, tracking_code, cart_id, created_at")
    .eq("id", params.id)
    .eq("buyer_id", buyer.id)
    .maybeSingle();
  if (!order) return <div>Ordine non trovato.</div>;

  // items from that cart
  const { data: items } = await supa
    .from("cart_items")
    .select(`
      id, quantity, unit_price,
      wines ( id, name, vintage, image_url )
    `)
    .eq("cart_id", order.cart_id);

  const subtotal = (items || []).reduce(
    (s: number, it: any) => s + Number(it.unit_price) * it.quantity,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Ordine #{order.id.slice(0,8)}</h1>
        <Link href="/catalog" className="text-sm underline">Torna al catalogo</Link>
      </div>

      <div className="rounded border bg-white p-4 text-sm">
        <div>Stato: <b>{order.status}</b> — Tipo: {order.type.toUpperCase()}</div>
        {order.tracking_code && <div className="mt-1">Tracking: <code>{order.tracking_code}</code></div>}
        <div className="mt-1">Creato: {new Date(order.created_at!).toLocaleString()}</div>
      </div>

      <ul className="grid gap-3">
        {(items || []).map((it: any) => {
          const w = it.wines;
          const img = w?.image_url || null;
          const title = w?.name + (w?.vintage ? ` (${w.vintage})` : "");
          const line = Number(it.unit_price) * it.quantity;
          return (
            <li key={it.id} className="rounded border bg-white p-3 flex items-center gap-3">
              <div className="w-16 h-16 rounded border overflow-hidden shrink-0">
                {img ? (
                  <img src={img} alt={w?.name || "Wine"} className="w-full h-full object-cover"/>
                ) : (
                  <div className="w-full h-full grid place-items-center text-[11px] text-neutral-500">no img</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{title}</div>
                <div className="text-sm text-neutral-600">
                  {it.quantity} × €{Number(it.unit_price).toFixed(2)}
                </div>
              </div>
              <div className="w-24 text-right font-medium">€{line.toFixed(2)}</div>
            </li>
          );
        })}
        <li className="rounded border bg-white p-3 flex justify-between font-medium">
          <span>Subtotale</span>
          <span>€{subtotal.toFixed(2)}</span>
        </li>
      </ul>
    </div>
  );
}
