import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";

function toArrayCsv(v: string | null): string[] | null {
  if (!v) return null;
  const parts = v.split(",").map(s => s.trim()).filter(Boolean);
  return parts.length ? parts : null;
}

export async function POST(req: Request) {
  const { ok } = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const form = await req.formData();
  const id = String(form.get("id") || "");
  if (!id) return NextResponse.json({ error: "id mancante" }, { status: 400 });

  const supa = createSupabaseServer();
  const payload: Record<string, any> = {
    name: String(form.get("name") || "").trim(),
    region: String(form.get("region") || "").trim() || null,
    country: String(form.get("country") || "").trim() || null,
    website: String(form.get("website") || "").trim() || null,
    description: String(form.get("description") || "").trim() || null,
    active: form.get("active") ? true : false,
    certifications: toArrayCsv(String(form.get("certifications") || "") || null),
  };
  if (!payload.name) return NextResponse.json({ error: "Nome richiesto" }, { status: 400 });

  const { error } = await supa.from("wineries").update(payload).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.redirect(new URL(`/admin/wineries/${id}`, req.url));
}
