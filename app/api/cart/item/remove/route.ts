import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supa = createSupabaseServer();

  // Auth + buyer
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));

  const form = await req.formData();
  const itemId = String(form.get("itemId") || "");

  // Recupera item + cart per verificare ownership
  const { data: item } = await supa
    .from("cart_items")
    .select("id, cart_id")
    .eq("id", itemId)
    .maybeSingle();
  if (!item) return NextResponse.json({ error: "Item non trovato" }, { status: 404 });

  const { data: cart } = await supa
    .from("carts")
    .select("id, buyer_id, status")
    .eq("id", item.cart_id)
    .single();

  const { data: buyer } = await supa
    .from("buyers")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (!buyer || cart.buyer_id !== buyer.id || cart.status !== "open")
    return NextResponse.json({ error: "Non autorizzato" }, { status: 403 });

  const { error } = await supa.from("cart_items").delete().eq("id", itemId);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.redirect(new URL("/cart/samples", req.url));
}
