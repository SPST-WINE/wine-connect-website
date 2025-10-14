// app/admin/orders/page.tsx
export const dynamic = 'force-dynamic';

import Link from "next/link";
import { requireAdmin } from "@/lib/is-admin";

type OrderRow = {
  id: string;
  type: "sample" | "order";
  status: "pending" | "processing" | "shipped" | "completed" | "cancelled";
  created_at: string;
  tracking_code: string | null;
  buyers: { email: string | null; company_name: string | null } | null;
};

const STATUS = ["pending","processing","shipped","completed","cancelled"] as const;

export default async function AdminOrders() {
  const { ok, supa } = await requireAdmin();
  if (!ok || !supa) return <div className="mt-10">Non autorizzato.</div>;

  const { data: orders, error } = await supa
    .from("orders")
    .select("id, type, status, created_at, tracking_code, buyers:buyer_id(email,company_name)")
    .order("created_at", { ascending:false });

  if (error) {
    return <div className="mt-10 text-red-600">Errore: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Ordini</h1>

      <ul className="grid gap-3">
        {(orders as OrderRow[] | null)?.map((o) => (
          <li key={o.id} className="rounded border bg-white p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="font-medium">
                  <Link className="underline" href={`/orders/${o.id}`}>
                    #{o.id.slice(0,8)}
                  </Link>{" "}
                  • {o.type.toUpperCase()}
                </div>
                <div className="text-sm text-neutral-600 truncate">
                  {o.buyers?.company_name || o.buyers?.email || "—"} •{" "}
                  {new Date(o.created_at).toLocaleString()}
                </div>
                {o.tracking_code && (
                  <div className="text-xs text-neutral-600 mt-1">
                    Tracking: <code>{o.tracking_code}</code>
                  </div>
                )}
              </div>

              <form
                action="/api/admin/orders/update-status"
                method="post"
                className="flex items-center gap-2 shrink-0"
              >
                <input type="hidden" name="orderId" value={o.id} />
                <select
                  name="status"
                  defaultValue={o.status}
                  className="border rounded p-1 text-sm"
                >
                  {STATUS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <input
                  name="tracking_code"
                  placeholder="Tracking"
                  defaultValue={o.tracking_code ?? ""}
                  className="border rounded p-1 text-sm"
                />
                <button className="px-3 py-1.5 rounded bg-black text-white text-sm">
                  Salva
                </button>
              </form>
            </div>
          </li>
        ))}

        {(!orders || orders.length === 0) && (
          <li className="rounded border bg-white p-4 text-sm">Nessun ordine.</li>
        )}
      </ul>
    </div>
  );
}
