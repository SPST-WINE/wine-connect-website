// app/api/admin/wines/create/route.ts
import { NextResponse, NextRequest } from "next/server";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function csvToArray(v: FormDataEntryValue | null): string[] | null {
  if (!v) return null;
  const s = String(v).trim();
  if (!s) return null;
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function toNumber(v: FormDataEntryValue | null): number | null {
  if (v == null) return null;
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export async function POST(req: NextRequest) {
  // 1) Auth admin
  const { ok } = await requireAdmin();
  if (!ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 2) Parse form
  const form = await req.formData();

  const winery_id = String(form.get("winery_id") || "");
  const name = String(form.get("name") || "").trim();

  const vintage = String(form.get("vintage") || "").trim() || null;
  const type = String(form.get("type") || "").trim() || null;
  const alcohol = toNumber(form.get("alcohol")); // number | null

  const price_ex_cellar = toNumber(form.get("price_ex_cellar"));
  const price_sample = toNumber(form.get("price_sample"));

  // IMPORTANT: moq in minuscolo
  const moq = form.get("moq") != null ? Number(form.get("moq")) : null;

  const grape_varieties = csvToArray(form.get("grape_varieties"));
  const certifications = csvToArray(form.get("certifications"));

  const description =
    (String(form.get("description") || "").trim() || null) as string | null;

  const available = form.get("available") != null; // checkbox

  if (!winery_id || !name) {
    return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
  }

  // 3) Insert
  const supa = createSupabaseServer();
  const { data, error } = await supa
    .from("wines")
    .insert([
      {
        winery_id,
        name,
        vintage,
        type,
        alcohol,
        price_ex_cellar,
        price_sample,
        moq, // ← salva qui
        grape_varieties,
        certifications,
        description,
        available,
      },
    ])
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // 4) Redirect alla detail page del vino creato
  const nextUrl = new URL(`/admin/wines/${data.id}`, req.url);
  return NextResponse.redirect(nextUrl);
}
