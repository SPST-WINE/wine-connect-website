// app/api/admin/orders/update/route.ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";

const STATI = ["pending", "processing", "shipped", "completed", "cancelled"] as const;
type Stato = typeof STATI[number];

type FallbackCarrier = {
  code: string;
  name: string;
  tracking_url_template: string | null;
  active?: boolean;
};

const FALLBACK_CARRIERS: FallbackCarrier[] = [
  { code: "UPS",   name: "UPS",   tracking_url_template: "https://www.ups.com/track?tracknum={{TRACKING}}" },
  { code: "DHL",   name: "DHL",   tracking_url_template: "https://www.dhl.com/it-it/home/tracking/tracking-express.html?submit=1&tracking-id={{TRACKING}}" },
  { code: "FEDEX", name: "FedEx", tracking_url_template: "https://www.fedex.com/fedextrack/?trknbr={{TRACKING}}" },
  { code: "TNT",   name: "TNT",   tracking_url_template: "https://www.tnt.com/express/it_it/site/shipping-tools/tracking.html?cons={{TRACKING}}" },
  { code: "GLS",   name: "GLS",   tracking_url_template: "https://gls-group.com/IT/it/servizi-online/ricerca-spedizioni?match={{TRACKING}}" },
  { code: "OTHER", name: "Altro corriere", tracking_url_template: null },
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
  if (!STATI.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  const tracking_code = tracking_code_raw === "" ? null : tracking_code_raw;
  const carrier_code  = carrier_code_raw  === "" ? null : carrier_code_raw;

  const supa = createSupabaseServer();

  // Se è stato scelto un corriere, assicura che esista in DB (per rispettare il FK)
  if (carrier_code) {
    const { data: existing, error: qErr } = await supa
      .from("shipping_carriers")
      .select("code")
      .eq("code", carrier_code)
      .maybeSingle();

    const foundInDb = !!existing && !qErr;

    if (!foundInDb) {
      const fb = FALLBACK_CARRIERS.find((c) => c.code === carrier_code);
      if (!fb) {
        return NextResponse.json({ error: "Invalid carrier_code" }, { status: 400 });
      }

      // Upsert del corriere mancante
      const { error: upsertErr } = await supa.from("shipping_carriers").upsert(
        {
          code: fb.code,
          name: fb.name,
          tracking_url_template: fb.tracking_url_template,
          active: true,
        },
        { onConflict: "code" }
      );

      if (upsertErr) {
        return NextResponse.json({ error: upsertErr.message }, { status: 400 });
      }
    }
  }

  // Aggiornamento ordine
  const { error: upErr } = await supa
    .from("orders")
    .update({
      status,
      tracking_code,
      carrier_code, // può essere NULL o un code valido presente in shipping_carriers
    })
    .eq("id", orderId);

  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 400 });

  // Redirect "pulito" alla pagina admin dell’ordine
  const url = new URL(`/admin/orders/${orderId}?saved=1`, req.url);
  return NextResponse.redirect(url, 303);
}
