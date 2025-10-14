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

  const parseArr = (v: FormDataEntryValue | null) =>
    v ? String(v).split(",").map(s => s.trim()).filter(Boolean) : undefined;

  const patch: any = {};
  if (f.get("name")) patch.name = String(f.get("name"));
  if (f.get("vintage")) patch.vintage = String(f.get("vintage"));
  if (f.get("type")) patch.type = String(f.get("type"));
  if (f.get("alcohol")) patch.alcohol = Number(f.get("alcohol"));
  if (f.get("bottle_size_ml")) patch.bottle_size_ml = Number(f.get("bottle_size_ml"));
  if (f.get("MOQ")) patch.MOQ = Number(f.get("MOQ"));
  if (f.get("price_ex_cellar")) patch.price_ex_cellar = Number(f.get("price_ex_cellar"));
  if (f.get("price_sample")) patch.price_sample = Number(f.get("price_sample"));
  if (f.get("winery_id")) patch.winery_id = String(f.get("winery_id"));
  if (f.get("description") !== null) patch.description = String(f.get("description") || "");

  const grapes = parseArr(f.get("grape_varieties"));
  if (grapes !== undefined) patch.grape_varieties = grapes;

  const certs = parseArr(f.get("certifications"));
  if (certs !== undefined) patch.certifications = certs;

  if (f.get("available") !== null) {
    // checkbox: se presente => true, se assente => non toccare; qui è presente, quindi:
    patch.available = true;
  }
  // se vuoi interpretare esplicitamente "false":
  if (String(f.get("available")) === "false") patch.available = false;

  if (Object.keys(patch).length === 0)
    return NextResponse.redirect(new URL(`/admin/wines/${id}`, req.url));

  const { error } = await supa.from("wines").update(patch).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.redirect(new URL(`/admin/wines/${id}`, req.url));
}
