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
  const payload = {
    name: String(f.get("name") || ""),
    region: String(f.get("region") || ""),
    country: String(f.get("country") || ""),
    website: String(f.get("website") || ""),
    certifications: String(f.get("certifications") || "")
      .split(",").map(s => s.trim()).filter(Boolean),
    active: String(f.get("active") || "false") === "true",
  };
  if (!payload.name) return NextResponse.json({ error: "Nome obbligatorio" }, { status: 400 });

  const { error } = await supa.from("wineries").insert(payload);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.redirect(new URL("/admin/wineries", req.url));
}
