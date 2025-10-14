import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supa = createSupabaseServer();

  // auth + admin
  const { data:{ user } } = await supa.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));
  const { data: admin } = await supa.from("admins")
    .select("id,role").eq("auth_user_id", user.id).eq("role","admin").maybeSingle();
  if (!admin) return NextResponse.json({ error: "Not admin" }, { status: 403 });

  const form = await req.formData();
  const wineId = String(form.get("wineId")||"");
  const file = form.get("file") as File | null;
  if (!wineId || !file) return NextResponse.json({ error:"Invalid payload" }, { status:400 });

  // path: wines/<wineId>/<timestamp>-<filename>
  const path = `${wineId}/${Date.now()}-${file.name}`;
  const up = await supa.storage.from("wines").upload(path, file, { upsert:false });
  if (up.error) return NextResponse.json({ error: up.error.message }, { status: 400 });

  // public URL
  const { data: pub } = supa.storage.from("wines").getPublicUrl(path);
  const image_url = pub.publicUrl;

  const { error } = await supa.from("wines")
    .update({ image_url })
    .eq("id", wineId);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.redirect(new URL("/admin/wines", req.url));
}
