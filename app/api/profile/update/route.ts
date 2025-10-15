import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supa = createSupabaseServer();
  const { data: auth } = await supa.auth.getUser();
  const user = auth.user;
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const buyerId = String(form.get("buyerId") || "");
  const company_name = String(form.get("company_name") || "").trim();
  const contact_name = String(form.get("contact_name") || "").trim();
  const email = String(form.get("email") || "").trim();
  const country = String(form.get("country") || "").trim();

  if (!buyerId) {
    return NextResponse.json({ error: "Missing buyerId" }, { status: 400 });
  }

  // Ensure the buyer belongs to the current user
  const { data: buyer } = await supa
    .from("buyers")
    .select("id, auth_user_id")
    .eq("id", buyerId)
    .maybeSingle();

  if (!buyer || buyer.auth_user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const payload: Record<string, any> = {
    company_name,
    contact_name,
    email,
    country,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supa.from("buyers").update(payload).eq("id", buyerId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Back to Profile
  return NextResponse.redirect(new URL("/profile", req.url));
}
