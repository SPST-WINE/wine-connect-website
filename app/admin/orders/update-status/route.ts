import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supa = createSupabaseServer();

  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));

  const { data: isAdmin } = await supa
    .from("admins").select("id").eq("auth_user_id", user.id).eq("role","admin").maybeSingle();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const form = await req.formData();
  const orderId = String(form.get("orderId") || "");
  const status = String(form.get("status") || "");
  const tracking_code = form.get("tracking_code")?.toString() ?? null;

  if (!orderId || !status)
    return NextResponse.json({ error: "Parametri mancanti" }, { status: 400 });

  const { error } = await supa
    .from("orders")
    .update({ status, tracking_code })
    .eq("id", orderId);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.redirect(new URL(`/admin/orders/${orderId}`, req.url));
}
