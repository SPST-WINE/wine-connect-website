import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supa = createSupabaseServer();

  // 1) Utente + Buyer
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));

  const { data: buyer, error: eBuyer } = await supa
    .from("buyers")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (eBuyer || !buyer) {
    return NextResponse.json({ error: "Profilo buyer non trovato" }, { status: 400 });
  }

  // 2) Dati form
  const form = await req.formData();
  const type = String(form.get("type") || "sample"); // 'sample' | 'order'
  const shippingAddressId = String(form.get("addressId") || "");

  if (!shippingAddressId) {
    return NextResponse.json({ error: "Seleziona un indirizzo di spedizione" }, { status: 400 });
  }

  // 3) Verifica che l'indirizzo appartenga al buyer
  const { data: addr } = await supa
    .from("addresses")
    .select("id,buyer_id")
    .eq("id", shippingAddressId)
    .single();

  if (!addr || addr.buyer_id !== buyer.id) {
    return NextResponse.json({ error: "Indirizzo non valido" }, { status: 403 });
  }

  // 4) Trova carrello "open" del tipo richiesto
  const { data: cart } = await supa
    .from("carts")
    .select("id")
    .eq("buyer_id", buyer.id)
    .eq("type", type)
    .eq("status", "open")
    .limit(1)
    .maybeSingle();

  if (!cart) {
    return NextResponse.json({ error: "Carrello vuoto" }, { status: 400 });
  }

  // 5) Calcola totals dal carrello
  const { data: items } = await supa
    .from("cart_items")
    .select("quantity, unit_price")
    .eq("cart_id", cart.id);

  const subtotal = (items || []).reduce(
    (s, it) => s + Number(it.unit_price) * it.quantity,
    0
  );

  const totals = {
    currency: "EUR",
    subtotal,
    shipping: 0,    // placeholder (da calcolare più avanti)
    duties: 0,      // placeholder
    grand_total: subtotal, // per ora = subtotal
  };

  // 6) Crea ordine
  const payload = {
    buyer_id: buyer.id,
    cart_id: cart.id,
    type, // enum cart_type
    status: "pending", // enum order_status
    shipping_address_id: shippingAddressId,
    totals, // JSONB
  };

  const { data: order, error: eOrder } = await supa
    .from("orders")
    .insert(payload)
    .select("id")
    .single();

  if (eOrder || !order) {
    return NextResponse.json({ error: eOrder?.message || "Errore creazione ordine" }, { status: 400 });
  }

  // 7) Chiudi il carrello
  await supa.from("carts").update({ status: "checked_out" }).eq("id", cart.id);

  // 8) Redirect al dettaglio ordine
  return NextResponse.redirect(new URL(`/orders/${order.id}`, req.url));
}
