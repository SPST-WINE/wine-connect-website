"use client";

import * as React from "react";

type Doc = {
  id: string;          // uuid lato storage (o random)
  name: string;        // nome file originale
  path: string;        // path su storage (compliance/{buyer_id}/...)
  type: string;        // e.g. "importer_license" | "company_vat"
  url?: string | null; // public URL (opzionale)
};

type ComplianceRecord = {
  id: string;
  buyer_id: string;
  mode: "self" | "delegate";
  documents: Doc[] | null;
};

export default function Compliance({
  buyerId,
  initial,
}: {
  buyerId: string;
  initial: ComplianceRecord | null;
}) {
  const mode = initial?.mode ?? "self";
  const docs = (initial?.documents ?? []) as Doc[];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-white">
      {/* MODE */}
      <form
        action="/api/profile/compliance/update-mode"
        method="post"
        className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 p-3"
      >
        <input type="hidden" name="buyerId" value={buyerId} />

        <div className="flex items-center gap-6">
          <label className="inline-flex items-center gap-2 text-white/90 text-sm">
            <input
              type="radio"
              name="mode"
              value="self"
              defaultChecked={mode === "self"}
              className="accent-[color:#E33955]"
            />
            <span>Self</span>
          </label>

          <label className="inline-flex items-center gap-2 text-white/90 text-sm">
            <input
              type="radio"
              name="mode"
              value="delegate"
              defaultChecked={mode === "delegate"}
              className="accent-[color:#E33955]"
            />
            <span>Delegate to Wine Connect</span>
          </label>
        </div>

        <button
          className="h-10 rounded-xl px-4 text-sm font-semibold text-[#0f1720]"
          style={{ background: "#E33955" }}
        >
          Save
        </button>
      </form>

      {/* UPLOADS */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <UploadCard
          title="Importer license"
          hint="PDF, PNG or JPG — up to 10MB"
          buyerId={buyerId}
          docType="importer_license"
        />
        <UploadCard
          title="Company ID / VAT"
          hint="PDF, PNG or JPG — up to 10MB"
          buyerId={buyerId}
          docType="company_vat"
        />
      </div>

      {/* LISTA DOCUMENTI */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-white/90">Uploaded documents</h3>
        {(!docs || docs.length === 0) ? (
          <div className="mt-2 rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
            No documents uploaded yet.
          </div>
        ) : (
          <ul className="mt-3 space-y-2">
            {docs.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="text-white font-medium truncate">{d.name}</div>
                  <div className="text-xs text-white/60 truncate">
                    {labelFromType(d.type)} · {d.path}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {d.url ? (
                    <a
                      href={d.url}
                      target="_blank"
                      className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/5"
                    >
                      View
                    </a>
                  ) : null}
                  <form action="/api/profile/compliance/delete" method="post">
                    <input type="hidden" name="buyerId" value={buyerId} />
                    <input type="hidden" name="docId" value={d.id} />
                    <button className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/5">
                      Delete
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function UploadCard({
  title,
  hint,
  buyerId,
  docType,
}: {
  title: string;
  hint: string;
  buyerId: string;
  docType: "importer_license" | "company_vat";
}) {
  return (
    <form
      action="/api/profile/compliance/upload"
      method="post"
      encType="multipart/form-data"
      className="rounded-xl border border-white/10 bg-black/20 p-4"
    >
      <input type="hidden" name="buyerId" value={buyerId} />
      <input type="hidden" name="docType" value={docType} />

      <div className="text-sm font-semibold text-white/90">{title}</div>
      <div className="text-xs text-white/60">{hint}</div>

      <div className="mt-3 flex items-center gap-2">
        <input
          name="file"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          className="text-xs file:mr-3 file:rounded-md file:border file:border-white/10 file:bg-white/[0.06] file:px-3 file:py-2 file:text-white/90 file:hover:bg-white/10"
          required
        />
        <button
          className="h-10 rounded-xl px-4 text-sm font-semibold text-[#0f1720]"
          style={{ background: "#E33955" }}
        >
          Upload
        </button>
      </div>
    </form>
  );
}

function labelFromType(t: string) {
  switch (t) {
    case "importer_license":
      return "Importer license";
    case "company_vat":
      return "Company ID/VAT";
    default:
      return t;
  }
}
