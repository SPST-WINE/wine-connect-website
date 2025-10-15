import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supa = createSupabaseServer();

  // Autenticazione
  const {
    data: { user },
  } = await supa.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));

  // Buyer dall'utente (ignoriamo qualsiasi buyerId dal client)
  const { data: buyer, error: buyerErr } = await supa
    .from("buyers")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (buyerErr || !buyer) {
    return NextResponse.redirect(new URL("/profile?err=no-buyer", req.url));
  }

  // Form data
  const form = await req.formData();
  const label = String(form.get("label") || "").trim() || null;
  const address = String(form.get("address") || "").trim();
  const city = String(form.get("city") || "").trim();
  const zip = String(form.get("zip") || "").trim();
  const country = String(form.get("country") || "").trim();
  const isDefault = !!form.get("is_default");

  if (!address || !city || !zip || !country) {
    return NextResponse.redirect(new URL("/profile?err=missing-fields", req.url));
  }

  // Se spuntato "default", rimuovi il default dagli altri
  if (isDefault) {
    await supa.from("addresses").update({ is_default: false }).eq("buyer_id", buyer.id);
  }

  const { error }
