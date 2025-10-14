import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supa = createSupabaseServer();

  // auth
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));
  const { data: isAdmin } = await supa
    .from("admins").select("id").eq("auth_user_id", user.id).eq("role","admin").maybeSingle();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // form
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const wineryId = String(form.get("wineryId") || "");
  if (!file || !wineryId) return NextResponse.json({ error: "file e wineryId richiesti" }, { status: 400 });

  // upload
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `wineries/${wineryId}/${Date.now()}.${ext}`;
  const { error: upErr } = await supa.storage.from("wineries").upload(path, file, { cacheControl: "3600", upsert: true });
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 400 });

  // public url + update record
  const { data: pub } = await supa.storage.from("wineries").getPublicUrl(path);
  const publicUrl = pub?.publicUrl ?? null;

  if (publicUrl) {
    const { error: updErr } = await supa.from("wineries").update({ logo_url: publicUrl }).eq("id", wineryId);
    if (updErr) return NextResponse.json({ error: updErr.message }, { status: 400 });
  }

  return NextResponse.redirect(new URL("/admin/wineries", req.url));
}
