// app/api/admin/orders/update/route.ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";

function redirectBack(req: Request, fallbackPath = "/admin/orders") {
  const ref = req.headers.get("referer");
  // Usiamo 303 per dire al browser di fare una GET alla pagina di destinazione
  const to = ref ? new URL(ref) : new URL(fallbackPath, req.url);
  return NextResponse.redirect(to, { status: 303 });
}

export async function POST(req: Request) {
  const { ok } = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const form = await req.formData();
  const orderId = String(form.get("orderId") || "");
  const status = String(form.get("status") || "");
  const tracking_code = String(form.get("tracking_code") || "").trim();

  if (!orderId) {
    return NextResponse.json({ error: "missing_orderId" }, { status: 400 });
  }

  const supa = createSupabaseServer();

  const payload: Record<string, any> = {};
  if (status) payload.status = status;
  // Permette di svuotare il tracking mettendo stringa vuota
  payload.tracking_code = tracking_code || null;

  const { error } = await supa.from("orders").update(payload).eq("id", orderId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Redirect alla pagina precedente (lista ordini) invece che a una rotta che può 404
  return redirectBack(req, "/admin/orders");
}
