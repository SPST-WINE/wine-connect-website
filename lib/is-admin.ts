// lib/is-admin.ts
import { createSupabaseServer } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supa = createSupabaseServer();

  const { data: { user } } = await supa.auth.getUser();
  if (!user) return { ok: false as const, supa: null };

  const { data: admin } = await supa
    .from("admins")
    .select("id, role")
    .eq("auth_user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  return { ok: !!admin, supa };
}
