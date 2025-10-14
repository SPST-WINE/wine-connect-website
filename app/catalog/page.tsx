import { createSupabaseServer } from "@/lib/supabase/server";
import Link from "next/link";

async function getCatalog(searchParams:any){
  const supa=createSupabaseServer();
  let q=supa.from("vw_catalog").select("*").limit(60);
  if(searchParams.q) q=q.ilike("wine_name", `%${searchParams.q}%`);
  if(searchParams.type) q=q.eq("type", searchParams.type);
  if(searchParams.region) q=q.eq("region", searchParams.region);
  const {data,error}=await q;
  if(error) throw error;
  return data!;
}

export default async function Catalog({searchParams}:{searchParams:any}){
  const items=await getCatalog(searchParams);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Catalogo</h1>
        <Link className="underline" href="/cart/samples">Carrello campionature</Link>
      </div>

      <form className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <input name="q" placeholder="Cerca vino..." defaultValue={searchParams.q||""} className="border rounded p-2"/>
        <input name="type" placeholder="Tipo (Red/White...)" defaultValue={searchParams.type||""} className="border rounded p-2"/>
        <input name="region" placeholder="Regione" defaultValue={searchParams.region||""} className="border rounded p-2"/>
        <button className="border rounded p-2">Filtra</button>
      </form>

      <ul className="grid md:grid-cols-3 gap-4">
        {items.map((w:any)=>(
          <li key={w.wine_id} className="border rounded-lg p-4 bg-white">
            <div className="font-medium">{w.wine_name} <span className="text-sm text-neutral-500">({w.vintage})</span></div>
            <div className="text-sm text-neutral-600">{w.winery_name} · {w.region} · {w.type}</div>
            <div className="text-sm mt-1">Ex-cellar: €{w.price_ex_cellar} | Sample: €{w.price_sample ?? 0}</div>
            <form action={`/api/cart/add`} method="post" className="mt-3 flex gap-2">
              <input type="hidden" name="wineId" value={w.wine_id}/>
              <input type="hidden" name="listType" value="sample"/>
              <input className="border rounded p-2 w-20" name="qty" type="number" min={1} defaultValue={1}/>
              <button className="px-3 py-2 rounded bg-black text-white">Aggiungi sample</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
