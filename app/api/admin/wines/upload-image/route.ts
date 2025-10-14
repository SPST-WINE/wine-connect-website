import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supa = createSupabaseServer();

  // 1) Auth
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));

  // 2) Check admin
  const { data: isAdmin } = await supa
    .from("admins")
    .select("id")
    .eq("auth_user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // 3) FormData: file + wineId
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const wineId = String(form.get("wineId") || "");
  if (!file || !wineId) {
    return NextResponse.json({ error: "file e wineId richiesti" }, { status: 400 });
  }

  // 4) Upload su Storage (bucket "wines")
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `wines/${wineId}/${Date.now()}.${ext}`;

  const { error: upErr } = await supa
    .storage
    .from("wines")
    .upload(path, file, { cacheControl: "3600", upsert: true });

  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 400 });

  // 5) Public URL e salvataggio su wines.image_url
  const { data: pub } = await supa.storage.from("wines").getPublicUrl(path);
  const publicUrl = pub?.publicUrl ?? null;

  if (publicUrl) {
    const { error: updErr } = await supa
      .from("wines")
      .update({ image_url: publicUrl })
      .eq("id", wineId);

    if (updErr) return NextResponse.json({ error: updErr.message }, { status: 400 });
  }

  // 6) Torna alla lista vini admin
  return NextResponse.redirect(new URL("/admin/wines", req.url));
}
