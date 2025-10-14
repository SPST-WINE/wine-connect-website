// app/api/admin/orders/update/route.ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { ok } = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supa = createSupabaseServer();
  const form = await req.formData();

  const orderId = String(form.get("orderId") || "");
  const status = form.get("status") ? String(form.get("status")) : undefined;
  const tracking = form.get("tracking_code") ? String(form.get("tracking_code")) : undefined;
  const notes = form.get("notes") ? String(form.get("notes")) : undefined;

  if (!orderId) return NextResponse.json({ error: "orderId mancante" }, { status: 400 });

  const payload: Record<string, any> = {};
  if (status) payload.status = status;
  if (typeof tracking !== "undefined") payload.tracking_code = tracking;
  if (typeof notes !== "undefined") payload.notes = notes;

  const { error } = await supa.from("orders").update(payload).eq("id", orderId);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.redirect(new URL(`/admin/orders/${orderId}`, req.url));
}
