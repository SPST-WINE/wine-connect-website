// app/api/cart/add/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supa = createSupabaseServer();

  // 1) Auth utente
  const { data: { user } } = await supa.auth.getUser();
  if (!user) {
    // se non loggato → login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 2) Profilo buyer
  const { data: buyer, error: eBuyer } = await supa
    .from("buyers")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (eBuyer || !buyer) {
    return NextResponse.json({ error: "Profilo buyer non trovato" }, { status: 400 });
  }

  // 3) Dati form
  const form = await req.formData();
  const wineId = String(form.get("wineId") || "");
  const listType = String(form.get("listType") || "sample"); // 'sample' | 'order'
  const qtyRaw = String(form.get("qty") || "1");
  const qty = Math.max(1, parseInt(qtyRaw, 10) || 1);

  if (!wineId) {
    return NextResponse.json({ error: "wineId mancante" }, { status: 400 });
  }

  // 4) Call RPC add_to_cart (usa TEXT per p_list)
  const { error: eRpc } = await supa.rpc("add_to_cart", {
    p_buyer: buyer.id,
    p_wine: wineId,
    p_qty: qty,
    p_list: listType,
  });

  if (eRpc) {
    return NextResponse.json({ error: eRpc.message }, { status: 400 });
  }

  // 5) Redirect al carrello corretto (qui campionature)
  const target =
    listType === "order" ? "/cart/orders" : "/cart/samples";

  return NextResponse.redirect(new URL(target, req.url));
}
