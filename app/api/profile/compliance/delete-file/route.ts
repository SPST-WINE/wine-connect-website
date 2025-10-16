import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

/**
 * Soft-delete di un file di compliance:
 * - NON rimuove il file dal bucket
 * - Aggiorna soltanto il JSONB `documents` in `compliance_records` per nascondere l'item all'utente.
 *
 * Accetta form POST con:
 *  - buyerId   : string
 *  - docType   : "importer_license" | "company_vat" | string
 *  - fileId    : string opzionale (id dell'oggetto, se presente nel JSON)
 *  - index     : number opzionale (fallback, se non esiste fileId)
 *
 * La funzione cerca di:
 *  1) se l'item è un oggetto con `id`, setta { active:false }
 *  2) altrimenti sposta la stringa in documents._archived[docType] e la rimuove dalla lista visibile
 */
export async function POST(req: Request) {
  try {
    const supa = createSupabaseServer();
    const { data: { user }, error: authErr } = await supa.auth.getUser();
    if (authErr) return NextResponse.json({ error: authErr.message }, { status: 500 });
    if (!user)   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const form = await req.formData();
    const buyerId = String(form.get("buyerId") ?? "");
    const docType = String(form.get("docType") ?? "").trim();
    const fileId  = form.get("fileId") ? String(form.get("fileId")) : null;
    const index   = form.get("index")  ? Number(form.get("index"))  : null;

    if (!buyerId || !docType) {
      return NextResponse.json({ error: "Missing buyerId or docType" }, { status: 400 });
    }

    // Verifica ownership buyer
    const { data: buyer, error: buyerErr } = await supa
      .from("buyers")
      .select("id, auth_user_id")
      .eq("id", buyerId)
      .maybeSingle();

    if (buyerErr) return NextResponse.json({ error: buyerErr.message }, { status: 500 });
    if (!buyer || buyer.auth_user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Leggi record di compliance
    const { data: rec, error: recErr } = await supa
      .from("compliance_records")
      .select("id, documents")
      .eq("buyer_id", buyerId)
      .maybeSingle();

    if (recErr) return NextResponse.json({ error: recErr.message }, { status: 500 });
    if (!rec)   return NextResponse.json({ error: "Record not found" }, { status: 404 });

    const documents: any = rec.documents ?? {};
    const list: any[] = Array.isArray(documents[docType]) ? documents[docType] : [];

    let changed = false;

    // Caso A: oggetti con { id, ... }
    if (fileId) {
      for (let i = 0; i < list.length; i++) {
        const it = list[i];
        if (it && typeof it === "object" && it.id === fileId) {
          // soft flag
          list[i] = { ...it, active: false };
          changed = true;
          break;
        }
      }
      documents[docType] = list;
    }
    // Caso B: fallback per array di stringhe o indice noto
    else if (typeof index === "number" && index >= 0 && index < list.length) {
      const item = list[index];
      // sposta in _archived[docType]
      const archived = documents._archived ?? {};
      const archList = Array.isArray(archived[docType]) ? archived[docType] : [];
      archList.push(item);
      archived[docType] = archList;
      documents._archived = archived;

      // rimuove dalla lista visibile
      list.splice(index, 1);
      documents[docType] = list;
      changed = true;
    }

    if (!changed) {
      return NextResponse.json({ error: "Nothing to delete" }, { status: 400 });
    }

    const { error: upErr } = await supa
      .from("compliance_records")
      .update({ documents })
      .eq("buyer_id", buyerId);

    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 400 });

    // Redirect di successo
    return NextResponse.redirect(new URL("/profile?ok=compliance_file_removed", req.url), { status: 303 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unexpected error" }, { status: 500 });
  }
}
