import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supa = createSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));

  const form = await req.formData();
  const buyerId = form.get("buyerId")?.toString() || "";
  const mode = (form.get("mode")?.toString() || "self") as "self" | "delegate";

  // check ownership
  const { data: buyer } = await supa
    .from("buyers")
    .select("id, auth_user_id")
    .eq("id", buyerId)
    .maybeSingle();

  if (!buyer || buyer.auth_user_id !== user.id) {
    return NextResponse.redirect(new URL("/profile?err=forbidden", req.url));
  }

  // upsert compliance record
  const { error } = await supa
    .from("compliance_records")
    .upsert(
      { buyer_id: buyerId, mode },
      { onConflict: "buyer_id" }
    );

  if (error) {
    return NextResponse.redirect(new URL("/profile?err=save_failed", req.url));
  }
  return NextResponse.redirect(new URL("/profile?ok=compliance_mode_saved", req.url));
}
