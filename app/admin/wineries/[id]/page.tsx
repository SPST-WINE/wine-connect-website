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
  AdminPrimaryButton,
  AdminFileInput,
} from "@/components/admin/UI";

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
  if (!ok)
    return (
      <main className="flex-1 px-5 grid place-items-center">
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 text-center">Non autorizzato.</div>
      </main>
    );

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
        <AdminToolbar
          title="Edit winery"
          right={
            <Link href="/admin/wineries" className="rounded-xl border border-white/10 px-3 py-2 text-white/85 hover:bg-white/5">
              ← All wineries
            </Link>
          }
        />

        <AdminCard className="p-5 grid gap-6 md:grid-cols-[2fr_1fr]">
          {/* LEFT: form */}
          <form action="/api/admin/wineries/update" method="post" className="grid gap-3">
            <input type="hidden" name="id" value={w.id} />

            <div className="grid md:grid-cols-2 gap-3">
              <label className="grid gap-1">
                <span className="text-[12px] text-white/70">Name *</span>
                <AdminInput name="name" required defaultValue={w.name ?? ""} />
              </label>

              <label className="grid gap-1">
                <span className="text-[12px] text-white/70">Website</span>
                <AdminInput name="website" defaultValue={w.website ?? ""} placeholder="https://..." />
              </label>

              <label className="grid gap-1">
                <span className="text-[12px] text-white/70">Region</span>
                <AdminInput name="region" defaultValue={w.region ?? ""} />
              </label>

              <label className="grid gap-1">
                <span className="text-[12px] text-white/70">Country</span>
                <AdminInput name="country" defaultValue={w.country ?? ""} />
              </label>
            </div>

            <label className="grid gap-1">
              <span className="text-[12px] text-white/70">Certifications (CSV)</span>
              <AdminInput
                name="certifications"
                defaultValue={csv(w.certifications)}
                placeholder="BIO, DOCG, ..."
              />
            </label>

            <label className="grid gap-1">
              <span className="text-[12px] text-white/70">Description</span>
              <AdminTextarea name="description" rows={6} defaultValue={w.description ?? ""} />
            </label>

            <label className="inline-flex items-center gap-2 text-sm text-white/85">
              <input type="checkbox" name="active" defaultChecked={!!w.active} />
              Active winery
            </label>

            <div className="pt-2">
              <AdminPrimaryButton>Save changes</AdminPrimaryButton>
            </div>
          </form>

          {/* RIGHT: logo & delete */}
          <div className="space-y-4">
            <AdminCard className="p-3">
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
                <AdminFileInput name="file" accept="image/*" required />
                <button className="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-white/90 hover:bg-white/5">
                  Upload logo
                </button>
              </form>
            </AdminCard>

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
        </AdminCard>
      </div>
    </main>
  );
}
