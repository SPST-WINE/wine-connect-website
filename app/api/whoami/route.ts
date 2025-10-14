import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const supa = createSupabaseServer();

  const { data: { user }, error: eUser } = await supa.auth.getUser();

  let admin: any = null;
  if (user) {
    const { data } = await supa
      .from("admins")
      .select("id, role, auth_user_id")
      .eq("auth_user_id", user.id)
      .maybeSingle();
    admin = data;
  }

  return NextResponse.json({
    host: new URL(req.url).host,
    user: user ? { id: user.id, email: user.email } : null,
    admin,
    eUser: eUser?.message || null,
  });
}
