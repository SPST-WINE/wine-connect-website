export const dynamic = 'force-dynamic';

import { requireAdmin } from "@/lib/is-admin";

const STATUS = ["pending","processing","shipped","completed","cancelled"] as const;

export default async function AdminOrders() {
  const { ok, supa } = await requireAdmin();
  if (!ok || !supa) return <div className="mt-10">Non autorizzato.</div>;

  const { data: orders } = await supa
    .from("orders")
    .select("id, type, status, created_at, buyers:buyer_id(email,company_name)")
    .order("created_at", { ascending:false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Ordini</h1>
      <ul className="grid gap-3">
        {(orders || []).map((o:any)=>(
          <li key={o.id} className="rounded border bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">#{o.id.slice(0,8)} • {o.type.toUpperCase()}</div>
                <div className="text-sm text-neutral-600">
                  {o.buyers?.company_name || o.buyers?.email || "—"} • {new Date(o.created_at).toLocaleString()}
                </div>
              </div>
              <form action="/api/admin/orders/update-status" method="post" className="flex items-center gap-2">
                <input type="hidden" name="orderId" value={o.id}/>
                <select name="status" defaultValue={o.status} className="border rounded p-1 text-sm">
                  {STATUS.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
                <button className="px-3 py-1.5 rounded bg-black text-white text-sm">Aggiorna</button>
              </form>
            </div>
          </li>
        ))}
        {(orders||[]).length===0 && <li className="rounded border bg-white p-4 text-sm">Nessun ordine.</li>}
      </ul>
    </div>
  );
}
