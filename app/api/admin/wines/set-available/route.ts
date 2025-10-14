import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { ok } = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const form = await req.formData();
  const id = String(form.get("id") || "");
  const available = String(form.get("available") || "") === "true";

  if (!id) return NextResponse.json({ error: "id mancante" }, { status: 400 });

  const supa = createSupabaseServer();
  const { error } = await supa.from("wines").update({ available }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.redirect(new URL("/admin/wines", req.url));
}
