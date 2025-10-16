"use client";

import * as React from "react";

type DocItem = {
  id: string;
  name: string;
  url: string;
  uploaded_at?: string;
  hidden?: boolean;
};

type ComplianceRecord = {
  id: string | null;
  buyer_id: string;
  mode: "self" | "delegate";
  documents: {
    importer_license?: DocItem[];
    company_vat?: DocItem[];
  };
};

export default function Compliance({
  buyerId,
  initial,
}: {
  buyerId: string;
  initial: ComplianceRecord;
}) {
  const [mode, setMode] = React.useState<"self" | "delegate">(initial.mode);
  const [impFile, setImpFile] = React.useState<File | null>(null);
  const [vatFile, setVatFile] = React.useState<File | null>(null);

  // visible (not hidden) documents
  const importerDocs = (initial.documents?.importer_license || []).filter(
    (d) => !d.hidden
  );
  const vatDocs = (initial.documents?.company_vat || []).filter(
    (d) => !d.hidden
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-white">
      {/* Mode selector */}
      <form
        action="/api/profile/compliance/update-mode"
        method="post"
        className="flex items-center justify-between gap-3"
      >
        <input type="hidden" name="buyerId" value={buyerId} />
        <div className="flex items-center gap-5 text-sm">
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="mode"
              value="self"
              checked={mode === "self"}
              onChange={() => setMode("self")}
            />
            <span>Self</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="mode"
              value="delegate"
              checked={mode === "delegate"}
              onChange={() => setMode("delegate")}
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

      {/* Upload cards */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <UploadCard
          title="Importer license"
          hint="PDF / PNG / JPG — max 10MB"
          inputName="file"
          kind="importer_license"
          buyerId={buyerId}
          file={impFile}
          setFile={setImpFile}
        />

        <UploadCard
          title="Company ID / VAT"
          hint="PDF / PNG / JPG — max 10MB"
          inputName="file"
          kind="company_vat"
          buyerId={buyerId}
          file={vatFile}
          setFile={setVatFile}
        />
      </div>

      {/* Lists */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <DocList
          title="Importer license files"
          docs={importerDocs}
          buyerId={buyerId}
          kind="importer_license"
        />
        <DocList
          title="Company ID / VAT files"
          docs={vatDocs}
          buyerId={buyerId}
          kind="company_vat"
        />
      </div>
    </div>
  );
}

/* ---------------- UI helpers ---------------- */

function UploadCard({
  title,
  hint,
  inputName,
  kind,
  buyerId,
  file,
  setFile,
}: {
  title: string;
  hint?: string;
  inputName: string;
  kind: "importer_license" | "company_vat";
  buyerId: string;
  file: File | null;
  setFile: (f: File | null) => void;
}) {
  const inputId = React.useId();

  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="text-sm text-white/90">{title}</div>
      {hint ? (
        <div className="text-xs text-white/60 mt-0.5">{hint}</div>
      ) : null}

      <form
        className="mt-3 flex items-center gap-3"
        action="/api/profile/compliance/upload"
        method="post"
        encType="multipart/form-data"
      >
        <input type="hidden" name="buyerId" value={buyerId} />
        <input type="hidden" name="kind" value={kind} />

        {/* Hidden native input */}
        <input
          id={inputId}
          name={inputName}
          type="file"
          accept=".pdf,image/png,image/jpeg"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />

        {/* Visible English-only picker */}
        <label
          htmlFor={inputId}
          className="cursor-pointer rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm hover:bg-white/[0.06]"
        >
          Select file
        </label>

        <span className="text-sm text-white/60 min-w-0 truncate">
          {file ? file.name : "No file selected"}
        </span>

        <button
          className="ml-auto rounded-lg px-3 py-2 text-sm font-semibold text-[#0f1720]"
          style={{ background: "#E33955" }}
          disabled={!file}
        >
          Upload
        </button>
      </form>
    </div>
  );
}

function DocList({
  title,
  docs,
  buyerId,
  kind,
}: {
  title: string;
  docs: DocItem[];
  buyerId: string;
  kind: "importer_license" | "company_vat";
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="text-sm text-white/90">{title}</div>
      {docs.length === 0 ? (
        <div className="text-sm text-white/50 mt-2">No files yet.</div>
      ) : (
        <ul className="mt-3 space-y-2">
          {docs.map((d) => (
            <li
              key={d.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
            >
              <a
                href={d.url}
                target="_blank"
                rel="noreferrer"
                className="truncate hover:underline text-white/90"
                title={d.name}
              >
                {d.name}
              </a>

              <form action="/api/profile/compliance/remove" method="post">
                <input type="hidden" name="buyerId" value={buyerId} />
                <input type="hidden" name="kind" value={kind} />
                <input type="hidden" name="docId" value={d.id} />
                <button className="rounded border border-white/15 px-3 py-1.5 text-sm hover:bg-white/5">
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
