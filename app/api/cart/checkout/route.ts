// app/api/cart/checkout/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supa = createSupabaseServer();

  try {
    // 1) Auth
    const { data: { user } } = await supa.auth.getUser();
    if (!user) return NextResponse.redirect(new URL("/login", req.url));

    // 2) Buyer
    const { data: buyer, error: eBuyer } = await supa
      .from("buyers")
      .select("id")
      .eq("auth_user_id", user.id)
      .maybeSingle();
    if (eBuyer) {
      console.error("[CHECKOUT] buyer query error:", eBuyer);
      return NextResponse.json({ error: eBuyer.message }, { status: 400 });
    }
    if (!buyer) {
      console.error("[CHECKOUT] buyer not found for user", user.id);
      return NextResponse.json({ error: "Profilo buyer non trovato" }, { status: 400 });
    }

    // 3) Form
    const form = await req.formData();
    const type = String(form.get("type") || "sample"); // 'sample' | 'order'
    const shippingAddressId = String(form.get("addressId") || "");
    if (!shippingAddressId) {
      return NextResponse.json({ error: "Seleziona un indirizzo di spedizione" }, { status: 400 });
    }

    // 4) Address (ownership)
    const { data: addr, error: eAddr } = await supa
      .from("addresses")
      .select("id,buyer_id")
      .eq("id", shippingAddressId)
      .maybeSingle();
    if (eAddr) {
      console.error("[CHECKOUT] address query error:", eAddr);
      return NextResponse.json({ error: eAddr.message }, { status: 400 });
    }
    if (!addr || addr.buyer_id !== buyer.id) {
      console.error("[CHECKOUT] address invalid or not owned:", shippingAddressId, "buyer", buyer.id);
      return NextResponse.json({ error: "Indirizzo non valido" }, { status: 403 });
    }

    // 5) Cart open del tipo richiesto
    const { data: cart, error: eCart } = await supa
      .from("carts")
      .select("id")
      .eq("buyer_id", buyer.id)
      .eq("type", type)
      .eq("status", "open")
      .limit(1)
      .maybeSingle();
    if (eCart) {
      console.error("[CHECKOUT] cart query error:", eCart);
      return NextResponse.json({ error: eCart.message }, { status: 400 });
    }
    if (!cart) {
      console.error("[CHECKOUT] no open cart for type", type, "buyer", buyer.id);
      return NextResponse.json({ error: "Carrello vuoto" }, { status: 400 });
    }

    // 6) Items
    const { data: items, error: eItems } = await supa
      .from("cart_items")
      .select("quantity, unit_price")
      .eq("cart_id", cart.id);
    if (eItems) {
      console.error("[CHECKOUT] items query error:", eItems);
      return NextResponse.json({ error: eItems.message }, { status: 400 });
    }
    if (!items || items.length === 0) {
      console.error("[CHECKOUT] cart has no items:", cart.id);
      return NextResponse.json({ error: "Carrello vuoto" }, { status: 400 });
    }

    const subtotal = items.reduce(
      (s, it) => s + Number(it.unit_price) * it.quantity,
      0
    );
    const totals = {
      currency: "EUR",
      subtotal,
      shipping: 0,
      duties: 0,
      grand_total: subtotal,
    };

    // 7) Insert ordine
    const payload = {
      buyer_id: buyer.id,
      cart_id: cart.id,
      type,                  // enum cart_type
      status: "pending",     // enum order_status
      shipping_address_id: shippingAddressId,
      totals,
    } as const;

    const { data: order, error: eOrder } = await supa
      .from("orders")
      .insert(payload)
      .select("id")
      .maybeSingle();
    if (eOrder || !order) {
      console.error("[CHECKOUT] order insert error:", eOrder);
      return NextResponse.json({ error: eOrder?.message || "Errore creazione ordine" }, { status: 400 });
    }

    // 8) Chiudi carrello (non blocca il redirect se fallisce, ma logghiamo)
    const { error: eClose } = await supa
      .from("carts")
      .update({ status: "checked_out" })
      .eq("id", cart.id);
    if (eClose) console.error("[CHECKOUT] close cart error:", eClose);

    // 9) Redirect al dettaglio
    return NextResponse.redirect(new URL(`/orders/${order.id}`, req.url));
  } catch (err: any) {
    console.error("[CHECKOUT] unhandled error:", err);
    return NextResponse.json({ error: err?.message || "Errore imprevisto" }, { status: 500 });
  }
}
