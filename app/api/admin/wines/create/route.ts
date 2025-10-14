import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";

function toArrayCsv(v: string | null): string[] | null {
  if (!v) return null;
  const arr = v.split(",").map(s => s.trim()).filter(Boolean);
  return arr.length ? arr : null;
}

export async function POST(req: Request) {
  const { ok } = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const form = await req.formData();

  const payload: Record<string, any> = {
    winery_id: String(form.get("winery_id") || ""),
    name: String(form.get("name") || "").trim(),
    vintage: String(form.get("vintage") || "").trim() || null,
    type: String(form.get("type") || "").trim() || null,
    alcohol: form.get("alcohol") ? Number(form.get("alcohol")) : null,
    price_ex_cellar: form.get("price_ex_cellar") ? Number(form.get("price_ex_cellar")) : null,
    price_sample: form.get("price_sample") ? Number(form.get("price_sample")) : null,
    MOQ: form.get("MOQ") ? Number(form.get("MOQ")) : null,
    grape_varieties: toArrayCsv(String(form.get("grape_varieties") || "") || null),
    certifications: toArrayCsv(String(form.get("certifications") || "") || null),
    description: String(form.get("description") || "").trim() || null,
    available: form.get("available") ? true : false,
  };

  if (!payload.winery_id) return NextResponse.json({ error: "winery_id richiesto" }, { status: 400 });
  if (!payload.name) return NextResponse.json({ error: "name richiesto" }, { status: 400 });

  const supa = createSupabaseServer();
  const { data, error } = await supa.from("wines").insert(payload).select("id").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.redirect(new URL(`/admin/wines/${data!.id}`, req.url));
}
