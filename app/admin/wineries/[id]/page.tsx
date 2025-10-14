export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";
import ConfirmSubmit from "@/components/ConfirmSubmit";

type Winery = {
  id: string;
  name: string;
  region: string | null;
  country: string | null;
  description: string | null;
  certifications: string[] | null;
  website: string | null;
  logo_url: string | null;
  active: boolean | null;
};

function csv(a?: string[] | null) { return (a ?? []).join(", "); }

export default async function EditWinery({ params }: { params: { id: string } }) {
  const { ok } = await requireAdmin();
  if (!ok) return <div className="mt-10">Non autorizzato.</div>;

  const supa = createSupabaseServer();
  const { data: w, error } = await supa.from("wineries").select("*").eq("id", params.id).single<Winery>();
  if (error || !w) return notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Modifica cantina</h1>
        <Link className="underline" href="/admin/wineries">← Tutte le cantine</Link>
      </div>

      <section className="rounded border bg-white p-4 grid gap-6 md:grid-cols-[2fr_1fr]">
        <form action="/api/admin/wineries/update" method="post" className="grid gap-3">
          <input type="hidden" name="id" value={w.id} />
          <div className="grid md:grid-cols-2 gap-3">
            <label className="grid gap-1">
              <span className="text-sm">Nome *</span>
              <input name="name" required defaultValue={w.name ?? ""} className="border rounded p-2" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Sito web</span>
              <input name="website" defaultValue={w.website ?? ""} className="border rounded p-2" placeholder="https://..." />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Regione</span>
              <input name="region" defaultValue={w.region ?? ""} className="border rounded p-2" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Paese</span>
              <input name="country" defaultValue={w.country ?? ""} className="border rounded p-2" />
            </label>
          </div>

          <label className="grid gap-1">
            <span className="text-sm">Certificazioni (CSV)</span>
            <input name="certifications" defaultValue={csv(w.certifications)} className="border rounded p-2" placeholder="BIO, DOCG, ..." />
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Descrizione</span>
            <textarea name="description" rows={6} defaultValue={w.description ?? ""} className="border rounded p-2" />
          </label>

          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="active" defaultChecked={!!w.active} />
            Cantina attiva
          </label>

          <div className="pt-2">
            <button className="px-4 py-2 rounded bg-black text-white">Salva</button>
          </div>
        </form>

        <div className="space-y-4">
          <div className="rounded border p-3">
            <div className="text-sm font-medium mb-2">Logo</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={w.logo_url || "/placeholder.png"}
              alt=""
              className="w-full aspect-square object-cover bg-neutral-100 rounded"
            />
            <form action="/api/admin/wineries/upload-logo" method="post" encType="multipart/form-data" className="mt-3 grid gap-2">
              <input type="hidden" name="wineryId" value={w.id} />
              <input type="file" name="file" accept="image/*" required className="text-sm" />
              <button className="px-3 py-1.5 rounded border text-sm">Carica logo</button>
            </form>
          </div>

          <form action="/api/admin/wineries/delete" method="post" className="rounded border p-3">
            <input type="hidden" name="id" value={w.id} />
            <ConfirmSubmit confirmMessage="Eliminare la cantina?" className="w-full px-3 py-2 rounded border border-red-600 text-red-600">
              Elimina cantina
            </ConfirmSubmit>
          </form>
        </div>
      </section>
    </div>
  );
}
