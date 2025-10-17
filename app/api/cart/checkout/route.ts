// app/api/cart/checkout/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

type Body = {
  shipping_address_id?: string;
  type?: string;   // "sample" di default
  cart_id?: string;
};

export async function POST(req: Request) {
  try {
    const supa = createSupabaseServer();

    const { data: { user } } = await supa.auth.getUser();
    if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

    const { data: buyer } = await supa
      .from("buyers")
      .select("id")
      .eq("auth_user_id", user.id)
      .maybeSingle();
    if (!buyer) return NextResponse.json({ error: "buyer_not_found" }, { status: 400 });

    // body
    let body: Body = {};
    const ctype = req.headers.get("content-type") || "";
    if (ctype.includes("application/json")) {
      body = await req.json();
    } else if (ctype.includes("application/x-www-form-urlencoded")) {
      const form = await req.formData();
      body = {
        shipping_address_id: String(form.get("shipping_address_id") || ""),
        type: String(form.get("type") || "") || undefined,
        cart_id: String(form.get("cart_id") || "") || undefined,
      };
    } else {
      try { body = await req.json(); } catch {}
    }

    const shipping_address_id = body.shipping_address_id;
    const listType = body.type || "sample";
    if (!shipping_address_id) {
      return NextResponse.json({ error: "missing_shipping_address" }, { status: 400 });
    }

    // check address
    const { data: address, error: addrErr } = await supa
      .from("addresses")
      .select("id,is_active")
      .eq("id", shipping_address_id)
      .maybeSingle();
    if (addrErr || !address || address.is_active === false) {
      return NextResponse.json({ error: "invalid_address" }, { status: 400 });
    }

    // find cart
    let cartId = body.cart_id;
    if (!cartId) {
      const { data: cart } = await supa
        .from("carts")
        .select("id")
        .eq("buyer_id", buyer.id)
        .eq("type", listType)
        .eq("status", "open")
        .order("created_at", { ascending: false })
        .maybeSingle();
      cartId = cart?.id;
    }
    if (!cartId) return NextResponse.json({ error: "no_open_cart" }, { status: 400 });

    // cart items
    const { data: cartItems, error: ciErr } = await supa
      .from("cart_items")
      .select("wine_id, quantity, unit_price, list_type")
      .eq("cart_id", cartId);
    if (ciErr) return NextResponse.json({ error: "cart_items_fetch_failed" }, { status: 500 });
    if (!cartItems?.length) return NextResponse.json({ error: "cart_empty" }, { status: 400 });

    // create order (collego cart_id)
    const { data: order, error: orderErr } = await supa
      .from("orders")
      .insert({
        buyer_id: buyer.id,
        cart_id: cartId,
        shipping_address_id,
        status: "pending",
        totals: 0,        // <-- usa 'totals'
        type: listType,   // se la colonna esiste in orders
      } as any)
      .select("*")
      .single();
    if (orderErr || !order) return NextResponse.json({ error: "order_create_failed" }, { status: 500 });

    // copy to order_items
    const rows = cartItems.map(ci => ({
      order_id: order.id,
      wine_id: ci.wine_id,
      quantity: ci.quantity,
      unit_price: ci.unit_price ?? 0,
      list_type: ci.list_type ?? listType,
    }));
    const { error: oiErr } = await supa.from("order_items").insert(rows);
    if (oiErr) return NextResponse.json({ error: "order_items_insert_failed" }, { status: 500 });

    // compute totals
    const totals = rows.reduce((s, r) => s + (Number(r.unit_price) || 0) * (Number(r.quantity) || 0), 0);
    await supa.from("orders").update({ totals }).eq("id", order.id);  // <-- 'totals'

    // close cart
    await supa.from("carts").update({ status: "checked_out" }).eq("id", cartId);

    return NextResponse.json({
      ok: true,
      order_id: order.id,
      order_code: (order as any).order_code ?? null,
    });
  } catch (err) {
    console.error("checkout error", err);
    return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
  }
}
