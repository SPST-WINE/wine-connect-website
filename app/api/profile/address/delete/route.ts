import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supa = createSupabaseServer();

    const { data: { user } } = await supa.auth.getUser();
    if (!user) return NextResponse.redirect(new URL("/login", req.url));

    const form = await req.formData();
    const addressId = String(form.get("addressId") || "");
    if (!addressId) {
      return NextResponse.redirect(new URL("/profile?err=not_found", req.url));
    }

    // Buyer corrente
    const { data: buyer } = await supa
      .from("buyers")
      .select("id")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (!buyer) {
      return NextResponse.redirect(new URL("/profile?err=forbidden", req.url));
    }

    // Recupero indirizzo (verifico proprietà)
    const { data: addr } = await supa
      .from("addresses")
      .select("id,buyer_id,is_default,is_active")
      .eq("id", addressId)
      .maybeSingle();

    if (!addr || addr.buyer_id !== buyer.id) {
      return NextResponse.redirect(new URL("/profile?err=forbidden", req.url));
    }
    if (addr.is_active === false) {
      // Già archiviato: idempotente
      return NextResponse.redirect(new URL("/profile?ok=address_deleted", req.url));
    }

    // 1) Soft-delete: nascondi ma conserva per gli ordini
    const { error: updErr } = await supa
      .from("addresses")
      .update({ is_active: false, archived_at: new Date().toISOString(), is_default: false })
      .eq("id", addressId)
      .eq("buyer_id", buyer.id);

    if (updErr) {
      return NextResponse.redirect(new URL("/profile?err=forbidden", req.url));
    }

    // 2) Se era default, promuovi un altro indirizzo attivo a default
    if (addr.is_default) {
      const { data: another } = await supa
        .from("addresses")
        .select("id")
        .eq("buyer_id", buyer.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1);

      const nextDefaultId = another?.[0]?.id;
      if (nextDefaultId) {
        await supa
          .from("addresses")
          .update({ is_default: true })
          .eq("id", nextDefaultId)
          .eq("buyer_id", buyer.id);
      }
    }

    return NextResponse.redirect(new URL("/profile?ok=address_deleted", req.url));
  } catch (e) {
    return NextResponse.redirect(new URL("/profile?err=forbidden", req.url));
  }
}
