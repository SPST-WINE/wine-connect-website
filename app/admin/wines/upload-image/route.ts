// app/api/admin/wines/upload-image/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supa = createSupabaseServer();

  // Auth
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));

  // Admin check
  const { data: isAdmin } = await supa
    .from("admins")
    .select("id")
    .eq("auth_user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Form data
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const wineId = form.get("wineId")?.toString() ?? "";
  if (!file || !wineId) {
    return NextResponse.json({ error: "file e wineId richiesti" }, { status: 400 });
  }

  // Storage path
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `wines/${wineId}/${Date.now()}.${ext}`;

  // Upload su bucket "wines"
  const { error: upErr } = await supa.storage
    .from("wines")
    .upload(path, file, { cacheControl: "3600", upsert: true });
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 400 });

  // Public URL
  const { data: pub } = await supa.storage.from("wines").getPublicUrl(path);
  const publicUrl = pub?.publicUrl ?? null;

  // Aggiorna wines.image_url
  if (publicUrl) {
    const { error: updErr } = await supa
      .from("wines")
      .update({ image_url: publicUrl })
      .eq("id", wineId);
    if (updErr) return NextResponse.json({ error: updErr.message }, { status: 400 });
  }

  // Torna alla lista
  return NextResponse.redirect(new URL("/admin/wines", req.url));
}
