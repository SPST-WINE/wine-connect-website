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

function csv(a?: string[] | null) {
  return (a ?? []).join(", ");
}

export default async function EditWinery({ params }: { params: { id: string } }) {
  const { ok } = await requireAdmin();
  if (!ok) {
    return (
      <main className="flex-1 px-5 grid place-items-center">
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 text-center">
          Non autorizzato.
        </div>
      </main>
    );
  }

  const supa = createSupabaseServer();
  const { data: w, error } = await supa
    .from("wineries")
    .select("*")
    .eq("id", params.id)
    .single<Winery>();
  if (error || !w) return notFound();

  return (
    <main className="flex-1 px-5">
      <div className="mx-auto max-w-[1200px] py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-white/60">Wineries</div>
            <h1 className="mt-1 text-3xl font-extrabold">Edit winery</h1>
          </div>
          <Link
            className="rounded-xl border border-white/10 px-3 py-2 text-white/85 hover:bg-white/5"
            href="/admin/wineries"
          >
            ← All wineries
          </Link>
        </div>

        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 grid gap-6 md:grid-cols-[2fr_1fr]">
          {/* LEFT: form */}
          <form action="/api/admin/wineries/update" method="post" className="grid gap-3">
            <input type="hidden" name="id" value={w.id} />

            <div className="grid md:grid-cols-2 gap-3">
              <label className="grid gap-1">
                <span className="text-[12px] text-white/70">Name *</span>
                <input
                  name="name"
                  required
                  defaultValue={w.name ?? ""}
                  className="rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white outline-none"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-[12px] text-white/70">Website</span>
                <input
                  name="website"
                  defaultValue={w.website ?? ""}
                  placeholder="https://..."
                  className="rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white outline-none"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-[12px] text-white/70">Region</span>
                <input
                  name="region"
                  defaultValue={w.region ?? ""}
                  className="rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white outline-none"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-[12px] text-white/70">Country</span>
                <input
                  name="country"
                  defaultValue={w.country ?? ""}
                  className="rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white outline-none"
                />
              </label>
            </div>

            <label className="grid gap-1">
              <span className="text-[12px] text-white/70">Certifications (CSV)</span>
              <input
                name="certifications"
                defaultValue={csv(w.certifications)}
                placeholder="BIO, DOCG, ..."
                className="rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white outline-none"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-[12px] text-white/70">Description</span>
              <textarea
                name="description"
                rows={6}
                defaultValue={w.description ?? ""}
                className="rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white outline-none"
              />
            </label>

            <label className="inline-flex items-center gap-2 text-sm text-white/85">
              <input type="checkbox" name="active" defaultChecked={!!w.active} />
              Active winery
            </label>

            <div className="pt-2">
              <button
                className="h-11 rounded-xl px-4 font-semibold text-[#0f1720]"
                style={{ background: "#E33955" }}
              >
                Save changes
              </button>
            </div>
          </form>

          {/* RIGHT: logo & delete */}
          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="text-sm font-medium mb-2 text-white/90">Logo</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={w.logo_url || "/placeholder.png"}
                alt=""
                className="w-full aspect-square object-cover bg-black/30 rounded-lg border border-white/10"
              />
              <form
                action="/api/admin/wineries/upload-logo"
                method="post"
                encType="multipart/form-data"
                className="mt-3 grid gap-2"
              >
                <input type="hidden" name="wineryId" value={w.id} />
                <input
                  type="file"
                  name="file"
                  accept="image/*"
                  required
                  className="text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-white/15 file:px-3 file:py-1 file:text-white"
                />
                <button className="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-white/90 hover:bg-white/5">
                  Upload logo
                </button>
              </form>
            </div>

            <form
              action="/api/admin/wineries/delete"
              method="post"
              className="rounded-xl border border-red-500/30 bg-red-500/5 p-3"
            >
              <input type="hidden" name="id" value={w.id} />
              <ConfirmSubmit
                confirmMessage="Eliminare la cantina?"
                className="w-full px-3 py-2 rounded-lg border border-red-500/50 text-red-200 hover:bg-red-500/10"
              >
                Delete winery
              </ConfirmSubmit>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
