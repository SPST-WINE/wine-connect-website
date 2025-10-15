// app/api/profile/address/delete/route.ts
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
  const addressId = String(form.get("addressId") || "");

  if (!addressId) {
    return NextResponse.json({ error: "Missing addressId" }, { status: 400 });
  }

  // 1) Trova il buyer dell'utente
  const { data: buyer, error: buyerErr } = await supa
    .from("buyers")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (buyerErr) {
    return NextResponse.json({ error: buyerErr.message }, { status: 500 });
  }
  if (!buyer) {
    return NextResponse.json({ error: "Buyer not found" }, { status: 404 });
  }

  // 2) Carica l'indirizzo, verifica ownership
  const { data: addr, error: addrErr } = await supa
    .from("addresses")
    .select("id,buyer_id")
    .eq("id", addressId)
    .maybeSingle();

  if (addrErr) {
    return NextResponse.json({ error: addrErr.message }, { status: 500 });
  }
  if (!addr || addr.buyer_id !== buyer.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 3) Cancella
  const { error: delErr } = await supa
    .from("addresses")
    .delete()
    .eq("id", addressId);

  if (delErr) {
    return NextResponse.json({ error: delErr.message }, { status: 500 });
  }

  // 4) Redirect back al profilo
  return NextResponse.redirect(new URL("/profile", req.url));
}
