import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supa = createSupabaseServer();
  const form = await req.formData();
  const addressId = String(form.get("addressId"));
  const { error } = await supa.from("addresses").delete().eq("id", addressId);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.redirect(new URL("/profile", req.url));
}
