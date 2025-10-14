import Link from "next/link";
import { requireAdmin } from "@/lib/is-admin";

export default async function AdminHome() {
  const { ok } = await requireAdmin();
  if (!ok) return <div className="mt-10">Non autorizzato. <a className="underline" href="/login">Accedi</a>.</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <ul className="grid gap-3">
        <li><Link className="underline" href="/admin/orders">Ordini</Link></li>
        <li><Link className="underline" href="/admin/wines">Wines (immagini)</Link></li>
      </ul>
    </div>
  );
}
