import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supa = createSupabaseServer();
  const { data:{ user } } = await supa.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));

  // check admin
  const { data: admin } = await supa.from("admins")
    .select("id,role").eq("auth_user_id", user.id).eq("role","admin").maybeSingle();
  if (!admin) return NextResponse.json({ error: "Not admin" }, { status: 403 });

  const form = await req.formData();
  const orderId = String(form.get("orderId")||"");
  const status = String(form.get("status")||"");

  const { error } = await supa.from("orders")
    .update({ status }) // enum order_status
    .eq("id", orderId);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.redirect(new URL("/admin/orders", req.url));
}
