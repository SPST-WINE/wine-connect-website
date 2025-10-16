import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

/**
 * Aggiorna la modalità di compliance per il buyer corrente.
 * Accetta "self" oppure "delegate" nel form (campo "mode").
 * Su successo: 303 redirect a /profile?ok=compliance_mode_saved
 * Su errore:   4xx/5xx con JSON { error }
 */
export async function POST(req: Request) {
  try {
    const supa = createSupabaseServer();
    const {
      data: { user },
      error: authErr,
    } = await supa.auth.getUser();

    if (authErr) {
      return NextResponse.json({ error: authErr.message }, { status: 500 });
    }
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const raw = String(form.get("mode") ?? "").toLowerCase().trim();

    // normalizza per l'ENUM attuale (self | delegate)
    const mode = raw === "delegate" ? "delegate" : "self";

    // individua il buyer dell'utente
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

    // upsert del record di compliance del buyer
    const { error: upErr } = await supa
      .from("compliance_records")
      .upsert(
        {
          buyer_id: buyer.id,
          mode,            // ENUM: 'self' | 'delegate'
          // NON tocchiamo 'documents' qui: se esiste resta com'è
        },
        { onConflict: "buyer_id" }
      );

    if (upErr) {
      // niente redirect su errore -> vedrai l’errore vero nei log/UI
      return NextResponse.json({ error: upErr.message }, { status: 400 });
    }

    // redirect SOLO su successo
    const url = new URL("/profile?ok=compliance_mode_saved", req.url);
    return NextResponse.redirect(url, { status: 303 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
