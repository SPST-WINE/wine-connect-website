import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supa = createSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));

  const { data: isAdmin } = await supa.from("admins")
    .select("id").eq("auth_user_id", user.id).eq("role","admin").maybeSingle();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const form = await req.formData();
  const id = String(form.get("id") || "");
  if (!id) return NextResponse.json({ error: "id mancante" }, { status: 400 });

  const patch: any = {};
  if (form.get("name")) patch.name = String(form.get("name"));
  if (form.get("vintage")) patch.vintage = String(form.get("vintage"));
  if (form.get("type")) patch.type = String(form.get("type"));
  if (form.get("price_ex_cellar")) patch.price_ex_cellar = Number(form.get("price_ex_cellar"));
  if (form.get("price_sample")) patch.price_sample = Number(form.get("price_sample"));
  if (form.get("winery_id")) patch.winery_id = String(form.get("winery_id"));
  if (form.get("available") !== null) patch.available = String(form.get("available")) === "true";

  if (Object.keys(patch).length === 0)
    return NextResponse.redirect(new URL("/admin/wines", req.url));

  const { error } = await supa.from("wines").update(patch).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.redirect(new URL("/admin/wines", req.url));
}
