// app/api/admin/orders/update/route.ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";

const STATI = ["pending", "processing", "shipped", "completed", "cancelled"] as const;
type Stato = typeof STATI[number];

const FALLBACK_CARRIERS = [
  { code: "UPS", name: "UPS" },
  { code: "DHL", name: "DHL" },
  { code: "FEDEX", name: "FedEx" },
  { code: "TNT", name: "TNT" },
  { code: "GLS", name: "GLS" },
  { code: "OTHER", name: "Altro corriere" },
];

export async function POST(req: Request) {
  const { ok } = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const form = await req.formData();
  const orderId = String(form.get("orderId") || "").trim();
  const status = String(form.get("status") || "").trim() as Stato;
  const tracking_code_raw = String(form.get("tracking_code") || "").trim();
  const carrier_code_raw = String(form.get("carrier_code") || "").trim();

  if (!orderId) return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  if (!STATI.includes(status))
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  // Normalizziamo i campi opzionali
  const tracking_code = tracking_code_raw === "" ? null : tracking_code_raw;
  const carrier_code = carrier_code_raw === "" ? null : carrier_code_raw;

  const supa = createSupabaseServer();

  // Validazione carrier_code (se presente)
  if (carrier_code) {
    // prima proviamo sul DB
    const { data: dbCarrier, error: dbErr } = await supa
      .from("shipping_carriers")
      .select("code")
      .eq("code", carrier_code)
      .maybeSingle();

    const inDB = !dbErr && !!dbCarrier;

    // se non in DB, accettiamo solo se presente in fallback
    const inFallback = FALLBACK_CARRIERS.some((c) => c.code === carrier_code);

    if (!inDB && !inFallback) {
      return NextResponse.json({ error: "Invalid carrier_code" }, { status: 400 });
    }
  }

  // Update ordine
  const { error: upErr } = await supa
    .from("orders")
    .update({
      status,
      tracking_code,
      carrier_code, // può essere NULL o un codice valido
    })
    .eq("id", orderId);

  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 400 });
  }

  // Redirect 303 alla pagina dettaglio admin per evitare il 404 dopo il POST
  const url = new URL(`/admin/orders/${orderId}?saved=1`, req.url);
  return NextResponse.redirect(url, 303);
}
