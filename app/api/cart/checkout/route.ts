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

    // Auth
    const { data: { user } } = await supa.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
    }

    // Buyer
    const { data: buyer } = await supa
      .from("buyers")
      .select("id")
      .eq("auth_user_id", user.id)
      .maybeSingle();
    if (!buyer) {
      return NextResponse.json({ error: "buyer_not_found" }, { status: 400 });
    }

    // Body parser (JSON o x-www-form-urlencoded)
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

    const listType = body.type || "sample";
    let shipping_address_id = body.shipping_address_id;

    // Fallback: se il form non passa l'ID, usa default attivo o primo attivo
    if (!shipping_address_id) {
      const { data: defAddr } = await supa
        .from("addresses")
        .select("id")
        .eq("buyer_id", buyer.id)
        .eq("is_active", true)
        .eq("is_default", true)
        .order("created_at", { ascending: false })
        .maybeSingle();

      if (defAddr?.id) {
        shipping_address_id = defAddr.id;
      } else {
        const { data: anyAddr } = await supa
          .from("addresses")
          .select("id")
          .eq("buyer_id", buyer.id)
          .eq("is_active", true)
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle();
        if (anyAddr?.id) shipping_address_id = anyAddr.id;
      }
    }

    if (!shipping_address_id) {
      return NextResponse.json({ error: "missing_shipping_address" }, { status: 400 });
    }

    // Verifica indirizzo appartenga al buyer ed è attivo
    const { data: address, error: addrErr } = await supa
      .from("addresses")
      .select("id,is_active,buyer_id")
      .eq("id", shipping_address_id)
      .maybeSingle();
    if (addrErr || !address || address.is_active === false || address.buyer_id !== buyer.id) {
      return NextResponse.json({ error: "invalid_address" }, { status: 400 });
    }

    // Trova carrello open
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
    if (!cartId) {
      return NextResponse.json({ error: "no_open_cart" }, { status: 400 });
    }

    // Items del carrello
    const { data: cartItems, error: ciErr } = await supa
      .from("cart_items")
      .select("wine_id, quantity, unit_price, list_type")
      .eq("cart_id", cartId);
    if (ciErr) {
      return NextResponse.json({ error: "cart_items_fetch_failed", details: ciErr.message }, { status: 500 });
    }
    if (!cartItems?.length) {
      return NextResponse.json({ error: "cart_empty" }, { status: 400 });
    }

    // Crea ordine (usa 'totals' numeric — inizializzato a 0)
    const { data: order, error: orderErr } = await supa
      .from("orders")
      .insert({
        buyer_id: buyer.id,
        cart_id: cartId,
        shipping_address_id,
        status: "pending",
        totals: 0,
        type: listType,
      } as any)
      .select("*")
      .single();
    if (orderErr || !order) {
      return NextResponse.json({ error: "order_create_failed", details: orderErr?.message }, { status: 500 });
    }

    // Copia in order_items
    const rows = cartItems.map(ci => ({
      order_id: order.id,
      wine_id: ci.wine_id,
      quantity: ci.quantity,
      unit_price: ci.unit_price ?? 0,
      list_type: ci.list_type ?? listType,
    }));

    const { error: oiErr } = await supa.from("order_items").insert(rows);
    if (oiErr) {
      return NextResponse.json(
        { error: "order_items_insert_failed", details: oiErr.message },
        { status: 500 }
      );
    }

    // Calcola totals
    const totals = rows.reduce((s, r) => s + (Number(r.unit_price) || 0) * (Number(r.quantity) || 0), 0);
    const { error: upTotErr } = await supa.from("orders").update({ totals }).eq("id", order.id);
    if (upTotErr) {
      return NextResponse.json({ error: "order_update_totals_failed", details: upTotErr.message }, { status: 500 });
    }

    // Chiudi carrello
    const { error: closeErr } = await supa.from("carts").update({ status: "checked_out" }).eq("id", cartId);
    if (closeErr) {
      // Non blocchiamo l'ordine se il cart non si chiude; lo segnaliamo soltanto.
      console.warn("cart_close_failed", closeErr.message);
    }

    return NextResponse.json({
      ok: true,
      order_id: order.id,
      order_code: (order as any).order_code ?? null,
    });
  } catch (err: any) {
    console.error("checkout error", err);
    return NextResponse.json({ error: "unexpected_error", details: String(err?.message || err) }, { status: 500 });
  }
}
