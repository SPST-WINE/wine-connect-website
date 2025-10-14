import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supa = createSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));

  // check admin
  const { data: isAdmin } = await supa
    .from("admins")
    .select("id")
    .eq("auth_user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const wineId = String(form.get("wineId") || "");
  if (!file || !wineId) {
    return NextResponse.json({ error: "file e wineId richiesti" }, { status: 400 });
  }

  // path: wines/{wineId}/{timestamp}_{filename}
  const ext = file.name.split(".").pop() || "jpg";
  const path = `wines/${wineId}/${Date.now()}.${ext}`;

  // upload
  const { error: upErr } = await supa.storage
    .from("wines")
    .upload(path, file, { cacheControl: "3600", upsert: true });
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 400 });

  // public URL
  const { data: pub } = await supa.storage.from("wines").getPublicUrl(path);
  const publicUrl = pub?.publicUrl;

  // salva su wines.image_url
  if (publicUrl) {
    await supa.from("wines").update(
