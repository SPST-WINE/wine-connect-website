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
  const payload = {
    name: String(form.get("name") || ""),
    vintage: String(form.get("vintage") || ""),
    type: String(form.get("type") || ""),
    price_ex_cellar: Number(form.get("price_ex_cellar") || 0),
    price_sample: form.get("price_sample") ? Number(form.get("price_sample")) : null,
    winery_id: String(form.get("winery_id") || ""),
    available: String(form.get("available") || "false") === "true",
  };
  if (!payload.name || !payload.vintage || !payload.type || !payload.winery_id)
    return NextResponse.json({ error: "Campi obbligatori mancanti" }, { status: 400 });

  const { error } = await supa.from("wines").insert(payload);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.redirect(new URL("/admin/wines", req.url));
}
