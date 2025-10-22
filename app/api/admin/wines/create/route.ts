import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function csvToArray(v?: string | null) {
  if (!v) return null;
  const arr = v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return arr.length ? arr : null;
}

export async function POST(req: Request) {
  const { ok } = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const form = await req.formData();

  // Prendi valori grezzi
  const winery_id = String(form.get("winery_id") ?? "");
  const name = String(form.get("name") ?? "");
  const vintage = (form.get("vintage") as string) || null;
  const type = (form.get("type") as string) || null;
  const alcohol = form.get("alcohol");
  const price_ex_cellar = form.get("price_ex_cellar");
  const price_sample = form.get("price_sample");
  const moq = form.get("moq"); // 👈 in minuscolo
  const grape_varieties = csvToArray(form.get("grape_varieties") as string);
  const certifications = csvToArray(form.get("certifications") as string);
  const description = (form.get("description") as string) || null;
  const available = form.get("available") ? true : false;

  if (!winery_id || !name) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supa = createSupabaseServer();

  const { data, error } = await supa
    .from("wines")
    .insert({
      winery_id,
      name,
      vintage,
      type,
      alcohol: alcohol ? Number(alcohol) : null,
      price_ex_cellar: price_ex_cellar ? Number(price_ex_cellar) : null,
      price_sample: price_sample ? Number(price_sample) : null,
      moq: moq ? Number(moq) : null,
      grape_varieties,
      certifications,
      description,
      available,
      image_url: null,
      bottle_size_ml: null,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Vai alla pagina di dettaglio per continuare
  return NextResponse.redirect(new URL(`/admin/wines/${data!.id}`, req.url));
}
