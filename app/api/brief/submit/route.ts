// app/api/brief/submit/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supa = createSupabaseServer();
    const { data: { user } } = await supa.auth.getUser();
    if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

    const form = await req.formData();

    // Hidden field dal client
    const buyer_id = String(form.get("buyer_id") || "");

    // Helper per normalizzare array checkbox
    const toArr = (v: FormDataEntryValue | null) => {
      if (!v) return [];
      if (Array.isArray(v)) return v.map(String);
      // il client invia JSON.stringify([...]) per i multi-select
      try { return JSON.parse(String(v)); } catch { return [String(v)]; }
    };

    const wine_styles          = toArr(form.get("wine_styles"));
    const price_range          = String(form.get("price_range") || "");
    const certifications       = toArr(form.get("certifications"));
    const target_audience      = toArr(form.get("target_audience"));
    const quantity_estimate    = String(form.get("quantity_estimate") || "");
    const regions_interest     = toArr(form.get("regions_interest"));
    const frequency_orders     = String(form.get("frequency_orders") || "");
    const brief_notes          = String(form.get("brief_notes") || "");
    const shortlist_preference = String(form.get("shortlist_preference") || "");

    // Upload opzionale
    let uploaded_file_url: string | null = null;
    const file = form.get("uploaded_file") as File | null;
    if (file && file.size > 0) {
      const ext = (file.name.split(".").pop() || "bin").toLowerCase();
      const path = `${user.id}/${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      const { error: upErr } = await supa.storage.from("brief_uploads").upload(path, file, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });
      if (upErr) {
        // non blocco l’intero brief se l’upload fallisce
        console.error("upload error", upErr);
      } else {
        const { data: publicUrl } = supa.storage.from("brief_uploads").getPublicUrl(path);
        uploaded_file_url = publicUrl?.publicUrl ?? null;
      }
    }

    // Inserimento
    const { error: insErr } = await supa.from("buyer_briefs").insert({
      buyer_id,
      wine_styles,
      price_range: price_range || null,
      certifications,
      target_audience,
      quantity_estimate: quantity_estimate || null,
      regions_interest,
      frequency_orders: frequency_orders || null,
      brief_notes: brief_notes || null,
      shortlist_preference: shortlist_preference || null,
      uploaded_file_url: uploaded_file_url || null,
    } as any);

    if (insErr) {
      console.error(insErr);
      return NextResponse.json({ error: "insert_failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
  }
}
