export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireAdmin } from "@/lib/is-admin";

export default async function NewWinery() {
  const { ok } = await requireAdmin();
  if (!ok) return <div className="mt-10">Non autorizzato. <Link className="underline" href="/login">Accedi</Link>.</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Nuova cantina</h1>
      <form action="/api/admin/wineries/create" method="post" className="grid gap-3 max-w-xl">
        <label className="grid gap-1">
          <span className="text-xs text-neutral-600">Nome</span>
          <input name="name" required className="border rounded p-2" />
        </label>
        <label className="grid gap-1">
          <span className="text-xs text-neutral-600">Regione</span>
          <input name="region" className="border rounded p-2" />
        </label>
        <label className="grid gap-1">
          <span className="text-xs text-neutral-600">Paese</span>
          <input name="country" className="border rounded p-2" />
        </label>
        <label className="grid gap-1">
          <span className="text-xs text-neutral-600">Descrizione</span>
          <textarea name="description" className="border rounded p-2 min-h-[100px]" />
        </label>
        <button className="px-4 py-2 rounded bg-black text-white">Crea</button>
      </form>
    </div>
  );
}
