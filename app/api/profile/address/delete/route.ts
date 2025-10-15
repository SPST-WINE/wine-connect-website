import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supa = createSupabaseServer();
  const {
    data: { user },
  } = await supa.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const form = await req.formData();
  const addressId = String(form.get("addressId") ?? "");

  // recupera il buyer dell’indirizzo e verifica ownership
  const { data: addr } = await supa
    .from("addresses")
    .select("id,buyer_id,is_default, buyers:buyer_id(auth_user_id)")
    .eq("id", addressId)
    .maybeSingle();

  if (!addr || addr.buyers?.auth_user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await supa.from("addresses").delete().eq("id", addressId);

  // redirect alla pagina profilo (evita restare sull’API route)
  return NextResponse.redirect(new URL("/profile", req.url), { status: 303 });
}
