import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/is-admin";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const { ok } = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const form = await req.formData();
  const wineryId = String(form.get("wineryId") || "");
  const file = form.get("file") as File | null;

  if (!wineryId || !file) {
    return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
  }

  // (opzionale) valida mime coerente col bucket
  const allowed = new Set([
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/avif",
    "image/svg+xml",
  ]);
  if (!allowed.has(file.type)) {
    return NextResponse.json({ error: "Tipo file non supportato" }, { status: 415 });
  }

  // filename sicuro
  const extFromName = file.name.includes(".")
    ? file.name.split(".").pop()!
    : (file.type.split("/")[1] || "png");
  const ext = extFromName.toLowerCase().replace(/[^a-z0-9+.-]/g, "") || "png";
  const key = `${wineryId}/${crypto.randomUUID()}.${ext}`;

  // upload sul bucket CORRETTO: "wineries"
  const { error: upErr } = await supabaseAdmin.storage
    .from("wineries")
    .upload(key, file, {
      cacheControl: "31536000",
      upsert: true,
      contentType: file.type || undefined,
    });

  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 400 });
  }

  // url pubblico e salvataggio su DB
  const { data: pub } = supabaseAdmin.storage.from("wineries").getPublicUrl(key);
  const publicUrl = pub?.publicUrl ?? null;

  if (publicUrl) {
    const { error: dbErr } = await supabaseAdmin
      .from("wineries")
      .update({ logo_url: publicUrl })
      .eq("id", wineryId);

    if (dbErr) {
      return NextResponse.json({ error: dbErr.message }, { status: 400 });
    }
  }

  return NextResponse.redirect(new URL(`/admin/wineries/${wineryId}`, req.url));
}
