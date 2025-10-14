import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { ok } = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const form = await req.formData();
  const id = String(form.get("id") || "");
  const name = String(form.get("name") || "");
  const region = String(form.get("region") || "");
  const country = String(form.get("country") || "");
  const description = String(form.get("description") || "");

  if (!id || !name) return NextResponse.json({ error: "invalid data" }, { status: 400 });

  const supa = createSupabaseServer();
  const { error } = await supa.from("wineries").update({ name, region, country, description }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.redirect(new URL(`/admin/wineries/${id}`, req.url));
}
