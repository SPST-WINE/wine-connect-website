import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { ok } = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const form = await req.formData();
  const wineryId = String(form.get("wineryId") || "");
  const file = form.get("file") as File | null;

  if (!wineryId || !file) return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });

  const supa = createSupabaseServer();

  const ext = file.name.split(".").pop() || "png";
  const path = `wineries/${wineryId}/${Date.now()}.${ext}`;
  const { error: upErr } = await supa.storage.from("public").upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 400 });

  const { data: pub } = supa.storage.from("public").getPublicUrl(path);
  const publicUrl = pub?.publicUrl || null;

  if (publicUrl) {
    await supa.from("wineries").update({ logo_url: publicUrl }).eq("id", wineryId);
  }

  return NextResponse.redirect(new URL(`/admin/wineries/${wineryId}`, req.url));
}
