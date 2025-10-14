import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supa = createSupabaseServer();
  const form = await req.formData();
  const addressId = String(form.get("addressId"));

  const { data: addr } = await supa.from("addresses").select("id,buyer_id").eq("id", addressId).single();
  if (!addr) return NextResponse.json({ error: "Address not found" }, { status: 404 });

  await supa.from("addresses").update({ is_default: false }).eq("buyer_id", addr.buyer_id);
  const { error } = await supa.from("addresses").update({ is_default: true }).eq("id", addressId);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.redirect(new URL("/profile", req.url));
}
