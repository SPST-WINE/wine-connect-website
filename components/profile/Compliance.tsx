"use client";

import * as React from "react";

type DocItem = {
  id: string;
  name: string;
  url: string;
  uploaded_at?: string;
  hidden?: boolean;
};

type Docs = {
  importer_license?: DocItem[];
  company_vat?: DocItem[];
  // in futuro puoi aggiungere altre chiavi qui
};

export default function Compliance({
  buyerId,
  initial,
}: {
  buyerId: string;
  initial: { id: string | null; mode: "self" | "delegate"; documents: Docs };
}) {
  const docs = normalizeDocs(initial.documents);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-white">
      {/* Mode toggle */}
      <form
        action="/api/profile/compliance/update-mode"
        method="post"
        className="flex items-center justify-between gap-3"
      >
        <input type="hidden" name="buyerId" value={buyerId} />
        <div className="flex items-center gap-6">
          <label className="inline-flex items-center gap-2 text-white/80">
            <input
              type="radio"
              name="mode"
              value="self"
              defaultChecked={initial.mode === "self"}
            />
            <span>Self</span>
          </label>
          <label className="inline-flex items-center gap-2 text-white/80">
            <input
              type="radio"
              name="mode"
              value="delegate"
              defaultChecked={initial.mode === "delegate"}
            />
            <span>Delegate to Wine Connect</span>
          </label>
        </div>
        <button
          className="rounded-xl px-4 py-2 text-sm font-semibold text-[#0f1720]"
          style={{ background: "#E33955" }}
        >
          Save
        </button>
      </form>

      {/* Upload blocks */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <UploadCard
          title="Importer license"
          helper="PDF / PNG / JPG — max 10MB"
          buyerId={buyerId}
          kind="importer_license"
        />
        <UploadCard
          title="Company ID / VAT"
          helper="PDF / PNG / JPG — max 10MB"
          buyerId={buyerId}
          kind="company_vat"
        />
      </div>

      {/* Files lists */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <ListCard
          title="Importer license files"
          buyerId={buyerId}
          kind="importer_license"
          items={(docs.importer_license || []).filter((d) => !d.hidden)}
        />
        <ListCard
          title="Company ID / VAT files"
          buyerId={buyerId}
          kind="company_vat"
          items={(docs.company_vat || []).filter((d) => !d.hidden)}
        />
      </div>
    </div>
  );
}

/* ---------- Helpers & small components ---------- */

function normalizeDocs(value: unknown): Docs {
  if (!value || typeof value !== "object") return {};
  const v = value as Record<string, unknown>;
  const out: Docs = {};
  if (Array.isArray(v.importer_license)) out.importer_license = v.importer_license as DocItem[];
  if (Array.isArray(v.company_vat)) out.company_vat = v.company_vat as DocItem[];
  return out;
}

function UploadCard({
  title,
  helper,
  buyerId,
  kind,
}: {
  title: string;
  helper: string;
  buyerId: string;
  kind: "importer_license" | "company_vat";
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="text-sm text-white/80">{title}</div>
      <div className="text-[11px] text-white/50">{helper}</div>
      <form
        action="/api/profile/compliance/upload"
        method="post"
        encType="multipart/form-data"
        className="mt-3 flex items-center gap-3"
      >
        <input type="hidden" name="buyerId" value={buyerId} />
        <input type="hidden" name="kind" value={kind} />
        <input
          name="file"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          className="max-w-[220px] text-xs file:mr-3 file:rounded file:border file:border-white/10 file:bg-black/30 file:px-3 file:py-2 file:text-white"
          required
        />
        <button
          className="rounded-xl px-4 py-2 text-sm font-semibold text-[#0f1720]"
          style={{ background: "#E33955" }}
        >
          Upload
        </button>
      </form>
    </div>
  );
}

function ListCard({
  title,
  items,
  buyerId,
  kind,
}: {
  title: string;
  items: DocItem[];
  buyerId: string;
  kind: "importer_license" | "company_vat";
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="text-sm text-white/80">{title}</div>
      {(!items || items.length === 0) && (
        <div className="mt-2 text-sm text-white/50">No files yet.</div>
      )}
      {items && items.length > 0 && (
        <ul className="mt-2 space-y-2">
          {items.map((f) => (
            <li
              key={f.id}
              className="flex items-center justify-between gap-3 rounded border border-white/10 bg-white/[0.03] px-3 py-2"
            >
              <a
                href={f.url}
                target="_blank"
                rel="noreferrer"
                className="truncate text-sm text-white/90 hover:underline"
                title={f.name}
              >
                {f.name}
              </a>
              <form action="/api/profile/compliance/remove" method="post">
                <input type="hidden" name="buyerId" value={buyerId} />
                <input type="hidden" name="kind" value={kind} />
                <input type="hidden" name="docId" value={f.id} />
                <button className="rounded border border-white/15 bg-transparent px-3 py-1.5 text-xs text-white/80 hover:bg-white/5">
                  Delete
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
