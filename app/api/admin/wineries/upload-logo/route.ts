import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/is-admin";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  // Solo admin
  const { ok } = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Leggi form-data
  const form = await req.formData();
  const wineryId = String(form.get("wineryId") || "");
  const file = form.get("file") as File | null;

  if (!wineryId || !file) {
    return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
  }

  // Validazione mimetype (coerente con il bucket)
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

  // Nome file sicuro
  const extFromName = file.name.includes(".")
    ? file.name.split(".").pop()!
    : (file.type.split("/")[1] || "png");
  const ext = extFromName.toLowerCase().replace(/[^a-z0-9+.-]/g, "") || "png";
  const key = `${wineryId}/${crypto.randomUUID()}.${ext}`;

  // Upload su bucket "wineries"
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

  // URL pubblico
  const { data: pub } = supabaseAdmin.storage.from("wineries").getPublicUrl(key);
  const publicUrl = pub?.publicUrl ?? null;

  // Salva su DB
  if (publicUrl) {
    const { error: dbErr } = await supabaseAdmin
      .from("wineries")
      .update({ logo_url: publicUrl })
      .eq("id", wineryId);

    if (dbErr) {
      return NextResponse.json({ error: dbErr.message }, { status: 400 });
    }
  }

  // Redirect alla pagina cantina
  return NextResponse.redirect(new URL(`/admin/wineries/${wineryId}`, req.url));
}
