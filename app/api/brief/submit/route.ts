// app/api/brief/submit/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supa = createSupabaseServer();
    const { data: { user } } = await supa.auth.getUser();
    if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

    const form = await req.formData();

    const buyer_id = String(form.get("buyer_id") || "");
    if (!buyer_id) return NextResponse.json({ error: "missing_buyer_id" }, { status: 400 });

    // opzionale: verifica ownership buyer
    const { data: buyer } = await supa
      .from("buyers")
      .select("id")
      .eq("id", buyer_id)
      .eq("auth_user_id", user.id)
      .maybeSingle();
    if (!buyer) return NextResponse.json({ error: "buyer_mismatch" }, { status: 403 });

    const parseJSON = (v: FormDataEntryValue | null) => {
      if (!v) return [];
      try { return JSON.parse(String(v)) } catch { return [] }
    };

    const payload = {
      buyer_id,
      wine_styles: parseJSON(form.get("wine_styles")),
      price_range: String(form.get("price_range") || ""),
      certifications: parseJSON(form.get("certifications")),
      target_audience: parseJSON(form.get("target_audience")),
      quantity_estimate: String(form.get("quantity_estimate") || ""),
      regions_interest: parseJSON(form.get("regions_interest")),
      frequency_orders: String(form.get("frequency_orders") || ""),
      brief_notes: String(form.get("brief_notes") || ""),
      shortlist_preference: String(form.get("shortlist_preference") || ""),
      uploaded_file_url: null as string | null,
    };

    // Upload file (opzionale)
    const file = form.get("uploaded_file") as File | null;
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const path = `${buyer_id}/${Date.now()}_${file.name}`;
      const { data: up, error: upErr } = await supa
        .storage
        .from("briefs")            // <-- crea il bucket "briefs" (vedi SQL sotto)
        .upload(path, Buffer.from(arrayBuffer), {
          contentType: file.type || "application/octet-stream",
          upsert: true,
        });

      if (upErr) {
        // non blocco l’inserimento del brief se l’upload fallisce
        console.warn("brief upload error", upErr);
      } else {
        // se il bucket è pubblico, prendi l'URL pubblico:
        const { data: pub } = supa.storage.from("briefs").getPublicUrl(up.path);
        payload.uploaded_file_url = pub?.publicUrl ?? up.path;
      }
    }

    const { error: insErr } = await supa.from("buyer_briefs").insert(payload);
    if (insErr) {
      console.error("brief insert error", insErr);
      return NextResponse.json({ error: "insert_failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("brief submit error", e);
    return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
  }
}
