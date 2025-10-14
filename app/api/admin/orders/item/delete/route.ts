// app/api/admin/orders/item/delete/route.ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { ok } = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supa = createSupabaseServer();
  const form = await req.formData();
  const orderId = String(form.get("orderId") || "");
  const itemId = String(form.get("itemId") || "");

  if (!orderId || !itemId)
    return NextResponse.json({ error: "Dati non validi" }, { status: 400 });

  await supa.from("order_items").delete().eq("id", itemId);

  return NextResponse.redirect(new URL(`/admin/orders/${orderId}`, req.url));
}
