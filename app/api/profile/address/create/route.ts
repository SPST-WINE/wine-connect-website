import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supa = createSupabaseServer();
  const form = await req.formData();
  const buyerId = String(form.get("buyerId"));
  const payload = {
    buyer_id: buyerId,
    label: String(form.get("label") || ""),
    address: String(form.get("address") || ""),
    city: String(form.get("city") || ""),
    zip: String(form.get("zip") || ""),
    country: String(form.get("country") || ""),
    is_default: !!form.get("is_default"),
  };

  // se set default, resetta gli altri
  if (payload.is_default) {
    await supa.from("addresses").update({ is_default: false }).eq("buyer_id", buyerId);
  }

  const { data, error } = await supa.from("addresses").insert(payload).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
