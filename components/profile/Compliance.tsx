"use client";

import * as React from "react";

type Doc = {
  id: string;           // `${docType}-${timestamp}`
  type: "importer_license" | "company_vat";
  url: string;          // public or signed url
  name: string;         // original filename
  uploaded_at: string;  // ISO
};

export default function Compliance({
  buyerId,
  initial,
}: {
  buyerId: string;
  initial: { id?: string; buyer_id?: string; mode?: "self" | "delegate"; documents?: Doc[] } | null;
}) {
  // fallback sicuri → mai .map su undefined
  const initialMode: "self" | "delegate" = (initial?.mode === "delegate" ? "delegate" : "self");
  const initialDocs: Doc[] = Array.isArray(initial?.documents) ? (initial!.documents as Doc[]) : [];

  const [mode, setMode] = React.useState<"self" | "delegate">(initialMode);
  const [docs, setDocs] = React.useState<Doc[]>(initialDocs);
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  // Aggiorna localmente dopo redirect (facoltativo, ma utile se in futuro passiamo a fetch inline)
  React.useEffect(() => {
    // no-op: il server rinfresca i dati con redirect, qui solo placeholder
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-white">
      {/* Banner inline */}
      {err && (
        <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 px-3 py-2 text-sm">
          {err}
        </div>
      )}
      {msg && (
        <div className="mb-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 px-3 py-2 text-sm">
          {msg}
        </div>
      )}

      {/* MODE */}
      <form
        action="/api/profile/compliance/update-mode"
        method="post"
        className="flex items-center gap-4"
        onSubmit={() => {
          setBusy(true);
          setMsg(null);
          setErr(null);
        }}
      >
        <input type="hidden" name="buyerId" value={buyerId} />
        <fieldset className="flex items-center gap-4">
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
        </fieldset>
        <button
          className="ml-auto rounded-xl px-4 py-2 text-sm font-semibold text-[#0f1720]"
          style={{ background: "#E33955" }}
          disabled={busy}
        >
          Save
        </button>
      </form>

      {/* UPLOADS */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Importer license */}
        <UploadCard
          title="Importer license"
          docType="importer_license"
          buyerId={buyerId}
        />
        {/* Company ID / VAT */}
        <UploadCard
          title="Company ID / VAT"
          docType="company_vat"
          buyerId={buyerId}
        />
      </div>

      {/* LISTA DOCUMENTI */}
      <div className="mt-6">
        <div className="text-sm text-white/70 mb-2">Uploaded documents</div>
        {docs.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/60">
            No documents yet.
          </div>
        ) : (
          <ul className="space-y-2">
            {docs.map((d) => (
              <li
                key={d.id}
                className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="font-medium truncate">{d.name}</div>
                  <div className="text-white/60 text-xs">
                    {labelForType(d.type)} — {new Date(d.uploaded_at).toLocaleString()}
                  </div>
                </div>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs underline text-white/80 hover:text-white"
                >
                  View
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function labelForType(t: Doc["type"]) {
  switch (t) {
    case "importer_license":
      return "Importer license";
    case "company_vat":
      return "Company ID / VAT";
    default:
      return t;
  }
}

function UploadCard({
  title,
  docType,
  buyerId,
}: {
  title: string;
  docType: "importer_license" | "company_vat";
  buyerId: string;
}) {
  return (
    <form
      action="/api/profile/compliance/upload"
      method="post"
      encType="multipart/form-data"
      className="rounded-xl border border-white/10 bg-black/20 p-4"
    >
      <div className="text-sm text-white/80 mb-2">{title}</div>
      <input type="hidden" name="buyerId" value={buyerId} />
      <input type="hidden" name="docType" value={docType} />
      <input
        required
        name="file"
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        className="block w-full text-sm file:mr-3 file:rounded-lg file:border file:border-white/10 file:bg-white/10 file:px-3 file:py-2 file:text-white file:hover:bg-white/15"
      />
      <button
        className="mt-3 rounded-xl px-4 py-2 text-sm font-semibold text-[#0f1720]"
        style={{ background: "#E33955" }}
      >
        Upload
      </button>
    </form>
  );
}
