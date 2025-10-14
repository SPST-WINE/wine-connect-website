export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireAdmin } from "@/lib/is-admin";

export default async function NewWinery() {
  const { ok } = await requireAdmin();
  if (!ok) return <div className="mt-10">Non autorizzato.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Nuova cantina</h1>
        <Link className="underline" href="/admin/wineries">← Tutte le cantine</Link>
      </div>

      <form action="/api/admin/wineries/create" method="post" className="rounded border bg-white p-4 grid gap-3 max-w-2xl">
        <label className="grid gap-1">
          <span className="text-sm">Nome *</span>
          <input name="name" required className="border rounded p-2" />
        </label>

        <div className="grid md:grid-cols-2 gap-3">
          <label className="grid gap-1">
            <span className="text-sm">Regione</span>
            <input name="region" className="border rounded p-2" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Paese</span>
            <input name="country" className="border rounded p-2" />
          </label>
        </div>

        <label className="grid gap-1">
          <span className="text-sm">Sito web</span>
          <input name="website" className="border rounded p-2" placeholder="https://..." />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Descrizione</span>
          <textarea name="description" rows={5} className="border rounded p-2" />
        </label>

        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked />
          Cantina attiva
        </label>

        <div className="pt-2">
          <button className="px-4 py-2 rounded bg-black text-white">Crea cantina</button>
        </div>
      </form>
    </div>
  );
}
