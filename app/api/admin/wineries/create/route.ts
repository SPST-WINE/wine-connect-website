import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { ok } = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const form = await req.formData();
  const payload = {
    name: String(form.get("name") || "").trim(),
    region: String(form.get("region") || "").trim() || null,
    country: String(form.get("country") || "").trim() || null,
    website: String(form.get("website") || "").trim() || null,
    description: String(form.get("description") || "").trim() || null,
    active: form.get("active") ? true : false,
  };
  if (!payload.name) return NextResponse.json({ error: "Nome richiesto" }, { status: 400 });

  const supa = createSupabaseServer();
  const { data, error } = await supa.from("wineries").insert(payload).select("id").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.redirect(new URL(`/admin/wineries/${data!.id}`, req.url));
}
