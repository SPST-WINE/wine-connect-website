"use client";

import * as React from "react";

type DocObj = { id?: string; url?: string; name?: string; uploaded_at?: string; active?: boolean };
type Docs = Record<string, any>;

export default function Compliance({
  buyerId,
  initial,
}: {
  buyerId: string;
  initial: { id?: string; mode?: "self" | "delegate"; documents?: Docs } | null;
}) {
  const [mode, setMode] = React.useState<"self" | "delegate">(initial?.mode ?? "self");
  const docs = (initial?.documents ?? {}) as Docs;

  function visibleItems(arr: any[]): { kind: "obj" | "str"; value: DocObj | string; index: number }[] {
    if (!Array.isArray(arr)) return [];
    const onlyActive = arr.filter((x: any) => {
      if (x && typeof x === "object") return x.active !== false;
      return true; // stringhe sempre visibili a meno che non siano state spostate in _archived server-side
    });
    return onlyActive.map((value, index) => ({
      kind: typeof value === "object" ? "obj" : "str",
      value,
      index,
    }));
  }

  const importer = visibleItems(docs["importer_license"] || []);
  const company  = visibleItems(docs["company_vat"] || []);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-white">
      {/* MODE */}
      <form
        action="/api/profile/compliance/update-mode"
        method="post"
        className="flex items-center justify-between gap-3"
      >
        <input type="hidden" name="buyerId" value={buyerId} />
        <div className="flex items-center gap-4">
          <label className="inline-flex items-center gap-2 text-sm text-white/80">
            <input
              type="radio"
              name="mode"
              value="self"
              checked={mode === "self"}
              onChange={() => setMode("self")}
            />
            Self
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-white/80">
            <input
              type="radio"
              name="mode"
              value="delegate"
              checked={mode === "delegate"}
              onChange={() => setMode("delegate")}
            />
            Delegate to Wine Connect
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
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <UploadCard
          title="Importer license"
          help="PDF / PNG / JPG — max 10MB"
          action="/api/profile/compliance/upload"
          buyerId={buyerId}
          docType="importer_license"
        />
        <UploadCard
          title="Company ID / VAT"
          help="PDF / PNG / JPG — max 10MB"
          action="/api/profile/compliance/upload"
          buyerId={buyerId}
          docType="company_vat"
        />
      </div>

      {/* LISTE FILE */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <ListCard
          title="Importer license files"
          buyerId={buyerId}
          docType="importer_license"
          items={importer}
        />
        <ListCard
          title="Company ID / VAT files"
          buyerId={buyerId}
          docType="company_vat"
          items={company}
        />
      </div>
    </div>
  );
}

function UploadCard({
  title,
  help,
  action,
  buyerId,
  docType,
}: {
  title: string;
  help?: string;
  action: string;
  buyerId: string;
  docType: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="text-sm font-semibold">{title}</div>
      {help ? <div className="text-xs text-white/60 mt-0.5">{help}</div> : null}
      <form action={action} method="post" encType="multipart/form-data" className="mt-3 flex items-center gap-3">
        <input type="hidden" name="buyerId" value={buyerId} />
        <input type="hidden" name="docType" value={docType} />
        <input
          required
          name="file"
          type="file"
          className="text-sm file:mr-3 file:rounded file:border file:border-white/10 file:bg-white/10 file:px-3 file:py-2 file:text-white"
        />
        <button
          className="rounded-xl px-3 py-2 text-sm font-semibold text-[#0f1720]"
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
  buyerId,
  docType,
  items,
}: {
  title: string;
  buyerId: string;
  docType: string;
  items: { kind: "obj" | "str"; value: DocObj | string; index: number }[];
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="text-sm font-semibold">{title}</div>
      {items.length === 0 ? (
        <div className="mt-2 text-sm text-white/60">No files yet.</div>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map(({ kind, value, index }) => {
            const url = kind === "obj" ? (value as DocObj).url : (value as string);
            const name =
              kind === "obj"
                ? (value as DocObj).name || (value as DocObj).url || "File"
                : typeof value === "string"
                ? value.split("/").pop() || "File"
                : "File";

            const fileId = kind === "obj" ? (value as DocObj).id ?? "" : "";

            return (
              <li key={(fileId || "") + ":" + index} className="flex items-center justify-between gap-3 rounded border border-white/10 bg-white/[0.03] px-3 py-2">
                <a href={url || "#"} target="_blank" className="truncate text-sm text-white/90">
                  {name}
                </a>
                <form action="/api/profile/compliance/delete-file" method="post" className="shrink-0">
                  <input type="hidden" name="buyerId" value={buyerId} />
                  <input type="hidden" name="docType" value={docType} />
                  {fileId ? (
                    <input type="hidden" name="fileId" value={fileId} />
                  ) : (
                    <input type="hidden" name="index" value={String(index)} />
                  )}
                  <button className="rounded border border-white/15 px-3 py-1.5 text-xs hover:bg-white/10">
                    Delete
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
