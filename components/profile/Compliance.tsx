"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

type Rec = { id: string; mode: "self" | "delegate_wc"; documents: any };

export default function Compliance({ buyerId, initial }: { buyerId: string; initial: Rec | null }) {
  const [mode, setMode] = useState<"self"|"delegate_wc">(initial?.mode || "self");
  const [docs, setDocs] = useState<any>(initial?.documents || {});
  const [saving, setSaving] = useState(false);
  const supa = supabaseBrowser();

  async function saveMode() {
    setSaving(true);
    const r = await fetch("/api/profile/compliance/save", {
      method: "POST",
      body: new URLSearchParams({ buyerId, mode })
    });
    setSaving(false);
    if (!r.ok) alert("Errore salvataggio");
  }

  async function uploadFile(e: React.ChangeEvent<HTMLInputElement>, key: string) {
    const file = e.target.files?.[0];
    if (!file) return;
    const path = `${buyerId}/${Date.now()}-${file.name}`;
    const up = await supa.storage.from("compliance").upload(path, file, { upsert: false });
    if (up.error) { alert(up.error.message); return; }

    // ottieni URL firmato (valido 7 giorni)
    const signed = await supa.storage.from("compliance").createSignedUrl(path, 60 * 60 * 24 * 7);
    const nextDocs = { ...docs, [key]: { path, url: signed.data?.signedUrl } };
    setDocs(nextDocs);

    await fetch("/api/profile/compliance/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ buyerId, mode, documents: nextDocs })
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3 items-center">
        <label className="flex items-center gap-2">
          <input type="radio" name="mode" checked={mode==="self"} onChange={()=>setMode("self")}/> Self
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="mode" checked={mode==="delegate_wc"} onChange={()=>setMode("delegate_wc")}/> Delegate to Wine Connect
        </label>
        <button onClick={saveMode} disabled={saving} className="px-3 py-1.5 rounded bg-black text-white">
          {saving?"…":"Save"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-3 bg-white border rounded p-3">
        <div>
          <div className="text-sm font-medium mb-1">Importer license</div>
          <input type="file" accept="application/pdf,image/*" onChange={(e)=>uploadFile(e,"importer_license")} />
          {docs?.importer_license?.url && <a className="block text-xs underline mt-1" href={docs.importer_license.url} target="_blank">View</a>}
        </div>
        <div>
          <div className="text-sm font-medium mb-1">Company ID / VAT</div>
          <input type="file" accept="application/pdf,image/*" onChange={(e)=>uploadFile(e,"company_id")} />
          {docs?.company_id?.url && <a className="block text-xs underline mt-1" href={docs.company_id.url} target="_blank">View</a>}
        </div>
      </div>
    </div>
  );
}
