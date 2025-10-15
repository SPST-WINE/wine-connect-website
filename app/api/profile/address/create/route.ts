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

  const buyerId = String(form.get("buyerId") ?? "");
  const label = (form.get("label") ?? "") as string;
  const address = (form.get("address") ?? "") as string;
  const city = (form.get("city") ?? "") as string;
  const zip = (form.get("zip") ?? "") as string;
  const country = (form.get("country") ?? "") as string;
  const isDefault = !!form.get("is_default");

  // security: il buyer deve essere dell’utente loggato
  const { data: buyer } = await supa
    .from("buyers")
    .select("id")
    .eq("id", buyerId)
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!buyer) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // crea indirizzo
  const { data: created, error: insErr } = await supa
    .from("addresses")
    .insert({
      buyer_id: buyerId,
      label,
      address,
      city,
      zip,
      country,
      is_default: isDefault,
    })
    .select("id")
    .single();

  if (insErr) {
    return NextResponse.json({ error: insErr.message }, { status: 400 });
  }

  // se default, azzera gli altri
  if (isDefault && created?.id) {
    await supa
      .from("addresses")
      .update({ is_default: false })
      .eq("buyer_id", buyerId)
      .neq("id", created.id);
  }

  // redirect pulito alla pagina profilo
  return NextResponse.redirect(new URL("/profile", req.url), { status: 303 });
}
