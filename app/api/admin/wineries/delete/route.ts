import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { ok } = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const form = await req.formData();
  const id = String(form.get("id") || "");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const supa = createSupabaseServer();
  // opzionale: controlli su vini collegati
  await supa.from("wineries").delete().eq("id", id);

  return NextResponse.redirect(new URL("/admin/wineries", req.url));
}
