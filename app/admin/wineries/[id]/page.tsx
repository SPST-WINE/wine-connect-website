export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function EditWinery({ params }: { params: { id: string } }) {
  const { ok } = await requireAdmin();
  if (!ok) return <div className="mt-10">Non autorizzato. <Link className="underline" href="/login">Accedi</Link>.</div>;

  const supa = createSupabaseServer();
  const { data: w } = await supa.from("wineries")
    .select("id,name,region,country,description")
    .eq("id", params.id)
    .single();
  if (!w) return notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Modifica cantina</h1>
      <form action="/api/admin/wineries/update" method="post" className="grid gap-3 max-w-xl">
        <input type="hidden" name="id" value={w.id}/>
        <label className="grid gap-1">
          <span className="text-xs text-neutral-600">Nome</span>
          <input name="name" defaultValue={w.name ?? ""} required className="border rounded p-2" />
        </label>
        <label className="grid gap-1">
          <span className="text-xs text-neutral-600">Regione</span>
          <input name="region" defaultValue={w.region ?? ""} className="border rounded p-2" />
        </label>
        <label className="grid gap-1">
          <span className="text-xs text-neutral-600">Paese</span>
          <input name="country" defaultValue={w.country ?? ""} className="border rounded p-2" />
        </label>
        <label className="grid gap-1">
          <span className="text-xs text-neutral-600">Descrizione</span>
          <textarea name="description" defaultValue={w.description ?? ""} className="border rounded p-2 min-h-[100px]" />
        </label>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded bg-black text-white">Salva</button>
          <Link href="/admin/wineries" className="px-4 py-2 rounded border">Indietro</Link>
        </div>
      </form>
    </div>
  );
}
