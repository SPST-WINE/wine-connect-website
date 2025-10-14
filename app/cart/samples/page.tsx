import { createSupabaseServer } from "@/lib/supabase/server";

export default async function SamplesCart() {
  const supabase = createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <div className="mt-10">You must <a className="underline" href="/login">login</a>.</div>;

  const { data: buyer } = await supabase.from("buyers").select("id").eq("auth_user_id", user.id).single();
  if (!buyer) return <div>No buyer profile.</div>;

  // find open sample cart
  const { data: carts } = await supabase.from("carts").select("id").eq("buyer_id", buyer.id).eq("type", "sample").eq("status", "open").limit(1);
  const cartId = carts?.[0]?.id;
  if (!cartId) return <div className="mt-10">Cart is empty.</div>;

  const { data: items } = await supabase
    .from("cart_items")
    .select("id, quantity, unit_price, wines(name, vintage)")
    .eq("cart_id", cartId);

  const { data: addresses } = await supabase
    .from("addresses")
    .select("id,label,address,country,is_default")
    .eq("buyer_id", buyer.id)
    .order("is_default", { ascending: false });

  const subtotal = (items||[]).reduce((s:any,i:any)=> s + i.quantity * Number(i.unit_price), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Samples cart</h1>
      <ul className="divide-y rounded-lg border bg-white">
        {(items||[]).map((it:any)=>(
          <li key={it.id} className="p-3 flex justify-between">
            <span>{it.wines.name} {it.wines.vintage ? `(${it.wines.vintage})`:""}</span>
            <span>{it.quantity} × €{it.unit_price}</span>
          </li>
        ))}
        <li className="p-3 flex justify-between font-medium">
          <span>Subtotal</span><span>€{subtotal.toFixed(2)}</span>
        </li>
      </ul>

      <form action="/api/cart/checkout" method="post" className="space-y-3">
        <input type="hidden" name="type" value="sample"/>
        <label className="block text-sm">Shipping address</label>
        <select name="addressId" className="border rounded p-2 w-full" required>
          {(addresses||[]).map((a:any)=>(
            <option value={a.id} key={a.id}>
              {a.label || a.address} ({a.country}) {a.is_default ? "• default":""}
            </option>
          ))}
        </select>
        <button className="px-4 py-2 rounded bg-black text-white">Checkout</button>
      </form>
    </div>
  );
}
