import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { ok } = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const form = await req.formData();
  const name = String(form.get("name") || "");
  const region = String(form.get("region") || "");
  const country = String(form.get("country") || "");
  const description = String(form.get("description") || "");

  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });

  const supa = createSupabaseServer();
  const { data, error } = await supa.from("wineries").insert({ name, region, country, description }).select("id").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.redirect(new URL(`/admin/wineries/${data!.id}`, req.url));
}
