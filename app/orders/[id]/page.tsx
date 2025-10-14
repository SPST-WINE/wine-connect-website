import { createSupabaseServer } from "@/lib/supabase/server";

export default async function OrderPage({ params }:{ params:{ id:string }}) {
  const supa=createSupabaseServer();

  const { data: order } = await supa
    .from("orders")
    .select("id, type, status, cart_id, shipping_address_id, created_at, totals, tracking_code")
    .eq("id", params.id)
    .single();

  if(!order) return <div>Ordine non trovato.</div>;

  // righe dall'origin cart
  const { data: items } = await supa
    .from("cart_items")
    .select("quantity, unit_price, list_type, wines(name, vintage)")
    .eq("cart_id", order.cart_id);

  // indirizzo spedizione (se esiste)
  const { data: addr } = await supa
    .from("addresses")
    .select("label,address,city,zip,country")
    .eq("id", order.shipping_address_id)
    .maybeSingle();

  const subtotal = (items||[]).reduce((s:any,i:any)=> s + Number(i.unit_price)*i.quantity, 0);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Ordine #{order.id.slice(0,8)}</h1>
        <div className="text-sm text-neutral-600">
          {order.type.toUpperCase()} • Stato: {order.status} • {new Date(order.created_at).toLocaleString()}
        </div>
      </header>

      {addr && (
        <section className="rounded border bg-white p-4">
          <h2 className="font-medium mb-2">Spedizione</h2>
          <div className="text-sm text-neutral-700">
            {addr.label || addr.address}<br/>
            {addr.address}{addr.city?`, ${addr.city}`:""} {addr.zip?` ${addr.zip}`:""} — {addr.country}
          </div>
        </section>
      )}

      <section className="rounded border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Prodotto</th>
              <th className="text-right p-2">Q.tà</th>
              <th className="text-right p-2">Prezzo</th>
              <th className="text-right p-2">Totale</th>
            </tr>
          </thead>
          <tbody>
            {(items||[]).map((it:any,idx:number)=>(
              <tr key={idx} className="border-b last:border-0">
                <td className="p-2">{it.wines?.name} {it.wines?.vintage?`(${it.wines.vintage})`:""}</td>
                <td className="p-2 text-right">{it.quantity}</td>
                <td className="p-2 text-right">€{Number(it.unit_price).toFixed(2)}</td>
                <td className="p-2 text-right">€{(Number(it.unit_price)*it.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="p-2 text-right font-medium" colSpan={3}>Subtotale</td>
              <td className="p-2 text-right font-medium">€{subtotal.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </section>

      {order.tracking_code && (
        <section className="rounded border bg-white p-4">
          <div className="text-sm">Tracking: <span className="font-mono">{order.tracking_code}</span></div>
        </section>
      )}
    </div>
  );
}
