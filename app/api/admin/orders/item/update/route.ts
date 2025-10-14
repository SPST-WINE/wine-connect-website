// app/api/admin/orders/item/update/route.ts
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
  const qty = Number(form.get("qty") || "0");

  if (!orderId || !itemId || Number.isNaN(qty))
    return NextResponse.json({ error: "Dati non validi" }, { status: 400 });

  if (qty <= 0) {
    await supa.from("order_items").delete().eq("id", itemId);
  } else {
    const { error } = await supa.from("order_items").update({ quantity: qty }).eq("id", itemId);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.redirect(new URL(`/admin/orders/${orderId}`, req.url));
}
