export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supa = createSupabaseServer();
  const {
    data: { user },
  } = await supa.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const form = await req.formData();
  const addressId = String(form.get("addressId") || "").trim();

  if (!addressId) {
    return NextResponse.redirect(new URL("/profile?err=missing_address_id", req.url));
  }

  // Buyer corrente
  const { data: buyer } = await supa
    .from("buyers")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!buyer) {
    return NextResponse.redirect(new URL("/profile?err=no_buyer", req.url));
  }

  // Address esiste e appartiene al buyer?
  const { data: addr } = await supa
    .from("addresses")
    .select("id,buyer_id,is_default")
    .eq("id", addressId)
    .maybeSingle();

  if (!addr || addr.buyer_id !== buyer.id) {
    return NextResponse.redirect(new URL("/profile?err=forbidden", req.url));
  }

  // È usato in qualche ordine?
  const { count: refsCount } = await supa
    .from("orders")
    .select("id", { head: true, count: "exact" })
    .eq("shipping_address_id", addressId);

  if ((refsCount ?? 0) > 0) {
    // Blocco la cancellazione perché ci sono ordini che lo referenziano
    return NextResponse.redirect(new URL("/profile?err=address_in_use", req.url));
  }

  // Cancello
  await supa.from("addresses").delete().eq("id", addressId);

  return NextResponse.redirect(new URL("/profile?msg=address_deleted", req.url));
}
