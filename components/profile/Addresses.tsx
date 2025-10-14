"use client";
import { useState } from "react";

type Address = {
  id: string; label: string | null; address: string; city: string | null;
  zip: string | null; country: string; is_default: boolean;
};

export default function Addresses({ buyerId, initial }: { buyerId: string; initial: Address[] }) {
  const [items, setItems] = useState<Address[]>(initial);
  const [loading, setLoading] = useState(false);

  async function create(formData: FormData) {
    setLoading(true);
    const res = await fetch("/api/profile/address/create", { method: "POST", body: formData });
    setLoading(false);
    if (!res.ok) return alert("Errore creazione");
    const a = await res.json();
    setItems([a, ...items].sort((x,y)=> Number(y.is_default)-Number(x.is_default)));
  }

  async function remove(id: string) {
    if (!confirm("Eliminare l'indirizzo?")) return;
    setLoading(true);
    const res = await fetch("/api/profile/address/delete", { method: "POST", body: new FormData(Object.assign(new FormData(), { })) as any });
    // Workaround per creare FormData velocemente:
  }

  return (
    <div className="space-y-4">
      <form action={create} className="grid gap-2 md:grid-cols-2 bg-white border rounded p-3">
        <input type="hidden" name="buyerId" value={buyerId}/>
        <input className="border rounded p-2" name="label" placeholder="Label (es. Ufficio)"/>
        <input className="border rounded p-2 md:col-span-2" name="address" placeholder="Address" required/>
        <input className="border rounded p-2" name="city" placeholder="City"/>
        <input className="border rounded p-2" name="zip" placeholder="ZIP"/>
        <input className="border rounded p-2" name="country" placeholder="Country" required/>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_default"/> Imposta come predefinito
        </label>
        <button disabled={loading} className="px-3 py-2 rounded bg-black text-white md:col-start-2 justify-self-start">
          {loading ? "…" : "Add address"}
        </button>
      </form>

      <ul className="divide-y rounded border bg-white">
        {items.map(a=>(
          <li key={a.id} className="p-3 flex items-center justify-between gap-3">
            <div>
              <div className="font-medium">{a.label || a.address}</div>
              <div className="text-sm text-neutral-600">{a.address}{a.city?`, ${a.city}`:""} {a.zip?` ${a.zip}`:""} — {a.country}</div>
            </div>
            <div className="flex items-center gap-2">
              {a.is_default ? (
                <span className="text-xs px-2 py-1 rounded bg-black text-white">Default</span>
              ) : (
                <form action="/api/profile/address/default" method="post">
                  <input type="hidden" name="addressId" value={a.id}/>
                  <button className="text-xs underline">Set default</button>
                </form>
              )}
              <form action="/api/profile/address/delete" method="post" onSubmit={(e)=>{
                if(!confirm("Eliminare l'indirizzo?")) e.preventDefault();
              }}>
                <input type="hidden" name="addressId" value={a.id}/>
                <button className="text-xs text-red-600 underline">Delete</button>
              </form>
            </div>
          </li>
        ))}
        {items.length===0 && <li className="p-3 text-sm text-neutral-600">Nessun indirizzo.</li>}
      </ul>
    </div>
  );
}
