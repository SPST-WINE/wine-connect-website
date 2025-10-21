// app/api/admin/orders/update/route.ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { ok } = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const form = await req.formData();
  const orderId = String(form.get("orderId") || "");
  const status = form.get("status") ? String(form.get("status")) : undefined;
  const tracking_code = form.get("tracking_code")
    ? String(form.get("tracking_code"))
    : undefined;
  const carrier_code = form.get("carrier_code")
    ? String(form.get("carrier_code"))
    : undefined;

  // redirect sicuro (preferisci sempre il campo esplicito)
  const redirect_to =
    (form.get("redirect_to") && String(form.get("redirect_to"))) ||
    req.headers.get("referer") ||
    "/admin/orders";

  if (!orderId) {
    return NextResponse.json(
      { error: "Missing orderId" },
      { status: 400 }
    );
  }

  const supa = createSupabaseServer();

  // opzionale: validazione carrier (se presente)
  if (carrier_code) {
    const { data: carr } = await supa
      .from("shipping_carriers")
      .select("code")
      .eq("code", carrier_code)
      .maybeSingle();
    if (!carr) {
      return NextResponse.json(
        { error: "Invalid carrier_code" },
        { status: 400 }
      );
    }
  }

  const payload: Record<string, any> = {};
  if (status !== undefined) payload.status = status;
  if (tracking_code !== undefined) payload.tracking_code = tracking_code;
  if (carrier_code !== undefined) payload.carrier_code = carrier_code;

  const { error } = await supa
    .from("orders")
    .update(payload)
    .eq("id", orderId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.redirect(new URL(redirect_to, req.url));
}
