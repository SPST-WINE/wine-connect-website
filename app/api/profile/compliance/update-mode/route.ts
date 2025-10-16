import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supa = createSupabaseServer();

  const {
    data: { user },
  } = await supa.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/profile?err=forbidden", req.url));
  }

  const form = await req.formData();
  const buyerId = String(form.get("buyerId") || "");
  const mode = String(form.get("mode") || "self") as "self" | "delegate";

  if (!buyerId || !["self", "delegate"].includes(mode)) {
    return NextResponse.redirect(new URL("/profile?err=bad_request", req.url));
  }

  // Permesso: buyer deve appartenere all’utente corrente
  const { data: buyer } = await supa
    .from("buyers")
    .select("id")
    .eq("id", buyerId)
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!buyer) {
    return NextResponse.redirect(new URL("/profile?err=forbidden", req.url));
  }

  // Preleva documenti esistenti
  const { data: rec } = await supa
    .from("compliance_records")
    .select("documents")
    .eq("buyer_id", buyerId)
    .maybeSingle();

  const docs = Array.isArray(rec?.documents) ? rec!.documents : [];

  const { error } = await supa
    .from("compliance_records")
    .upsert(
      { buyer_id: buyerId, mode, documents: docs },
      { onConflict: "buyer_id" }
    );

  const u = new URL("/profile", req.url);
  if (error) {
    u.searchParams.set("err", "update_failed");
  } else {
    u.searchParams.set("ok", "compliance_mode_saved");
  }
  return NextResponse.redirect(u);
}
