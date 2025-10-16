import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supa = createSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const form = await req.formData();

  const company_name = (form.get("company_name") || "").toString().trim() || null;
  const contact_name = (form.get("contact_name") || "").toString().trim() || null;
  const country      = (form.get("country") || "").toString().trim() || null;

  // Verifica che il buyer esista
  const { data: buyer, error: buyerErr } = await supa
    .from("buyers")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (buyerErr) {
    return NextResponse.redirect(new URL("/profile?err=buyer_not_found", req.url));
  }

  // Se non esiste la riga buyers, opzionalmente creala (fallback sicuro)
  if (!buyer) {
    const { error: insErr } = await supa.from("buyers").insert({
      auth_user_id: user.id,
      email: user.email,
      company_name,
      contact_name,
      country,
    });
    if (insErr) {
      return NextResponse.redirect(new URL("/profile?err=save_failed", req.url));
    }
  } else {
    // Aggiorna senza toccare updated_at
    const { error: updErr } = await supa
      .from("buyers")
      .update({ company_name, contact_name, country })
      .eq("auth_user_id", user.id);

    if (updErr) {
      return NextResponse.redirect(new URL("/profile?err=save_failed", req.url));
    }
  }

  return NextResponse.redirect(new URL("/profile?ok=profile_saved", req.url));
}
