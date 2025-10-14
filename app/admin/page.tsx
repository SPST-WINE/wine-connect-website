export const dynamic = "force-dynamic";

import { requireAdmin } from "@/lib/is-admin";

export default async function AdminHome() {
  const { ok, supa } = await requireAdmin();
  if (!ok || !supa) return <div className="mt-10">Non autorizzato.</div>;

  const [{ count: wines }, { count: wineries }, { count: buyers }] = await Promise.all([
    supa.from("wines").select("id", { count: "exact", head: true }),
    supa.from("wineries").select("id", { count: "exact", head: true }),
    supa.from("buyers").select("id", { count: "exact", head: true }),
  ]);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card k="Vini" v={wines ?? 0} />
      <Card k="Cantine" v={wineries ?? 0} />
      <Card k="Buyer" v={buyers ?? 0} />
    </div>
  );
}

function Card({ k, v }: { k: string; v: number }) {
  return (
    <div className="rounded border bg-white p-6">
      <div className="text-sm text-neutral-600">{k}</div>
      <div className="text-3xl font-extrabold mt-1">{v}</div>
    </div>
  );
}
