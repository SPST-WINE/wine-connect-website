import { createSupabaseServer } from "@/lib/supabase/server";
import Link from "next/link";

async function getCatalog(params: { q?: string; type?: string; region?: string }) {
  const supabase = createSupabaseServer();
  let query = supabase.from("vw_catalog").select("*");
  if (params.q) query = query.ilike("wine_name", `%${params.q}%`);
  if (params.type) query = query.eq("type", params.type);
  if (params.region) query = query.eq("region", params.region);
  const { data, error } = await query.limit(60);
  if (error) throw error;
  return data!;
}

export default async function Catalog({ searchParams }: { searchParams: any }) {
  const items = await getCatalog({
    q: searchParams.q,
    type: searchParams.type,
    region: searchParams.region,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Catalog</h1>
        <Link className="underline" href="/cart/samples">Samples cart</Link>
      </div>

      <form className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <input name="q" placeholder="Search wine..." defaultValue={searchParams.q||""} className="border rounded p-2" />
        <input name="type" placeholder="Type (Red/White...)" defaultValue={searchParams.type||""} className="border rounded p-2" />
        <input name="region" placeholder="Region" defaultValue={searchParams.region||""} className="border rounded p-2" />
        <button className="border rounded p-2">Filter</button>
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
              <button className="px-3 py-2 rounded bg-black text-white">Add sample</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
