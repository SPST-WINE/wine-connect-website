import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = createSupabaseServer();
  const form = await req.formData();
  const wineId = String(form.get("wineId"));
  const qty = Number(form.get("qty") || 1);
  const listType = (String(form.get("listType")||"sample") as "sample"|"order");

  // 1) get buyer_id from auth user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));

  const { data: buyer, error: bErr } = await supabase
    .from("buyers").select("id").eq("auth_user_id", user.id).single();
  if (bErr || !buyer) return NextResponse.json({ error: "Buyer not found" }, { status: 400 });

  // 2) RPC add_to_cart
  const { data: cartId, error } = await supabase
    .rpc("add_to_cart", { p_buyer: buyer.id, p_wine: wineId, p_qty: qty, p_list: listType });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // back to catalog
  return NextResponse.redirect(new URL("/catalog?added=1", req.url));
}
