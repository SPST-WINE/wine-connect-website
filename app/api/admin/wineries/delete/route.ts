// app/api/admin/wineries/delete/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supa = createSupabaseServer();

  // auth
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));

  // admin check
  const { data: isAdmin } = await supa
    .from("admins")
    .select("id")
    .eq("auth_user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // payload
  const form = await req.formData();
  const id = String(form.get("id") || "");
  if (!id) return NextResponse.json({ error: "id mancante" }, { status: 400 });

  // delete
  const { error } = await supa.from("wineries").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.redirect(new URL("/admin/wineries", req.url));
}
