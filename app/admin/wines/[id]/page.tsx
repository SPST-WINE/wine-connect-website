// app/admin/wines/[id]/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";
import ConfirmSubmit from "@/components/ConfirmSubmit";
import {
  AdminCard,
  AdminToolbar,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminPrimaryButton,
  AdminFileInput,
} from "@/components/admin/UI";

type Wine = {
  id: string;
  winery_id: string | null;
  name: string;
  vintage: string | null;
  type: string | null;
  grape_varieties: string[] | null;
  alcohol: number | null;
  price_ex_cellar: number | null;
  price_sample: number | null;
  moq: number | null;
  certifications: string[] | null;
  bottle_size_ml: number | null;
  description: string | null;
  image_url: string | null;
  available: boolean | null;
};

type WineryOpt = { id: string; name: string };

function arrToCsv(a?: string[] | null) {
  return (a ?? []).join(", ");
}

export default async function AdminWineDetail({ params }: { params: { id: string } }) {
  const { ok } = await requireAdmin();
  if (!ok) {
    return (
      <main className="flex-1 px-5 grid place-items-center">
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 text-center">
          Non autorizzato. <a className="underline" href="/login">Accedi</a>.
        </div>
      </main>
    );
  }

  const supa = createSupabaseServer();
  const [{ data: wine, error }, { data: wineries }] = await Promise.all([
    supa.from("wines").select("*").eq("id", params.id).single<Wine>(),
    supa
      .from("wineries")
      .select("id,name")
      .eq("active", true)
      .order("name", { ascending: true }) as any as Promise<{ data: WineryOpt[] | null }>,
  ]);

  if (error || !wine) return notFound();

  return (
    <main className="flex-1 px-5">
      <div className="mx-auto max-w-[1200px] py-6 space-y-6">
        <AdminToolbar
          title="Edit wine"
          subtitle={`#${wine.id}`}
          right={
            <>
              <Link
                href="/admin/wines"
                className="rounded-xl border border-white/10 px-3 py-2 text-white/85 hover:bg-white/5"
              >
                ← All wines
              </Link>
              <Link
                href="/admin"
                className="rounded-xl border border-white/10 px-3 py-2 text-white/85 hover:bg-white/5"
              >
                Dashboard
              </Link>
            </>
          }
        />

        {/* Preview + Form */}
        <AdminCard className="p-5 grid gap-6 lg:grid-cols-[360px,1fr]">
          {/* LEFT: Image + upload */}
          <div className="space-y-4">
            <div className="text-sm font-medium text-white/90">Image</div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-black/40 grid place-items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    wine.image_url ||
                    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512'><rect width='100%' height='100%' fill='%23111'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%238aa'>no image</text></svg>"
                  }
                  alt="Wine image"
                  className="h-full w-full object-contain"
                />
              </div>

              {wine.image_url && (
                <div className="mt-2 text-xs text-white/70 break-all">{wine.image_url}</div>
              )}

              <form
                action="/api/admin/wines/upload-image"
                method="post"
                encType="multipart/form-data"
                className="mt-3 grid gap-2"
              >
                <input type="hidden" name="wineId" value={wine.id} />
                <AdminFileInput name="file" accept="image/*" required />
                <button className="px-3 py-2 rounded-xl border border-white/10 text-white/90 hover:bg-white/5 text-sm">
                  Upload / Replace image
                </button>
              </form>
            </div>

            <AdminCard className="p-3 border-red-500/30 bg-red-500/5">
              <div className="text-sm font-medium text-white/90 mb-2">Danger zone</div>
              <form action="/api/admin/wines/delete" method="post" className="grid gap-2">
                <input type="hidden" name="id" value={wine.id} />
                <ConfirmSubmit
                  confirmMessage="Eliminare il vino?"
                  className="w-full px-3 py-2 rounded-xl border border-red-500/50 text-red-200 hover:bg-red-500/10"
                >
                  Delete wine
                </ConfirmSubmit>
              </form>
            </AdminCard>
          </div>

          {/* RIGHT: Details form */}
          <div>
            <div className="text-sm font-medium text-white/90 mb-3">Details</div>
            <form action="/api/admin/wines/update" method="post" className="grid gap-4">
              <input type="hidden" name="id" value={wine.id} />

              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="grid gap-1">
                  <span className="text-[12px] text-white/70">Name</span>
                  <AdminInput name="name" defaultValue={wine.name ?? ""} required />
                </label>

                <label className="grid gap-1">
                  <span className="text-[12px] text-white/70">Vintage</span>
                  <AdminInput name="vintage" defaultValue={wine.vintage ?? ""} placeholder="2021" />
                </label>

                <label className="grid gap-1">
                  <span className="text-[12px] text-white/70">Type</span>
                  <AdminInput
                    name="type"
                    defaultValue={wine.type ?? ""}
                    placeholder="Red / White / Rosé / Sparkling …"
                  />
                </label>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="grid gap-1">
                  <span className="text-[12px] text-white/70">Winery</span>
                  <AdminSelect name="winery_id" defaultValue={wine.winery_id ?? ""} required>
                    <option value="" disabled className="bg-[#0a1722]">
                      Select a winery
                    </option>
                    {(wineries ?? []).map((w) => (
                      <option key={w.id} value={w.id} className="bg-[#0a1722]">
                        {w.name}
                      </option>
                    ))}
                  </AdminSelect>
                </label>

                <label className="grid gap-1">
                  <span className="text-[12px] text-white/70">Alcohol (% vol)</span>
                  <AdminInput
                    name="alcohol"
                    type="number"
                    step="0.1"
                    defaultValue={wine.alcohol ?? undefined}
                    placeholder="13.5"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-[12px] text-white/70">Bottle size (ml)</span>
                  <AdminInput
                    name="bottle_size_ml"
                    type="number"
                    defaultValue={wine.bottle_size_ml ?? undefined}
                    placeholder="750"
                  />
                </label>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="grid gap-1">
                  <span className="text-[12px] text-white/70">Grapes (CSV)</span>
                  <AdminInput
                    name="grape_varieties"
                    defaultValue={arrToCsv(wine.grape_varieties)}
                    placeholder="Sangiovese, Canaiolo"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-[12px] text-white/70">Certifications (CSV)</span>
                  <AdminInput
                    name="certifications"
                    defaultValue={arrToCsv(wine.certifications)}
                    placeholder="BIO, DOCG"
                  />
                </label>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="grid gap-1">
                  <span className="text-[12px] text-white/70">Ex-cellar price (€)</span>
                  <AdminInput
                    name="price_ex_cellar"
                    type="number"
                    step="0.01"
                    defaultValue={wine.price_ex_cellar ?? undefined}
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-[12px] text-white/70">Sample price (€)</span>
                  <AdminInput
                    name="price_sample"
                    type="number"
                    step="0.01"
                    defaultValue={wine.price_sample ?? undefined}
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-[12px] text-white/70">MOQ (bottles)</span>
                  <AdminInput name="moq" type="number" defaultValue={wine.moq ?? undefined} />
                </label>
              </div>

              {/* Description + availability */}
              <label className="grid gap-1">
                <span className="text-[12px] text-white/70">Description</span>
                <AdminTextarea
                  name="description"
                  rows={6}
                  defaultValue={wine.description ?? ""}
                  placeholder="Tasting notes, vinification, pairings…"
                />
              </label>

              <label className="inline-flex items-center gap-2 text-sm text-white/85">
                <input type="checkbox" name="available" defaultChecked={!!wine.available} />
                Available in catalog
              </label>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <AdminPrimaryButton>Save changes</AdminPrimaryButton>
                <Link
                  href="/admin/wines"
                  className="rounded-xl border border-white/10 px-3 py-2 text-white/85 hover:bg-white/5"
                >
                  Back
                </Link>
              </div>
            </form>
          </div>
        </AdminCard>
      </div>
    </main>
  );
}
