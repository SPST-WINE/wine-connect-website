import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supa = createSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));

  const { data: isAdmin } = await supa.from("admins")
    .select("id").eq("auth_user_id", user.id).eq("role","admin").maybeSingle();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const f = await req.formData();
  const id = String(f.get("id") || "");
  if (!id) return NextResponse.json({ error: "id mancante" }, { status: 400 });

  const patch: any = {};
  if (f.get("name")) patch.name = String(f.get("name"));
  if (f.get("region")) patch.region = String(f.get("region"));
  if (f.get("country")) patch.country = String(f.get("country"));
  if (f.get("website")) patch.website = String(f.get("website"));
  if (f.get("certifications")) {
    patch.certifications = String(f.get("certifications")).split(",").map(s=>s.trim()).filter(Boolean);
  }
  if (f.get("active") !== null) patch.active = String(f.get("active")) === "true";

  if (Object.keys(patch).length === 0)
    return NextResponse.redirect(new URL("/admin/wineries", req.url));

  const { error } = await supa.from("wineries").update(patch).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.redirect(new URL("/admin/wineries", req.url));
}
