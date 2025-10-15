"use client";

import * as React from "react";

type ComplianceRecord = {
  id: string;
  mode: "self" | "delegate" | null;
  documents?: any;
};

export default function Compliance({
  buyerId,
  initial,
}: {
  buyerId: string;
  initial: ComplianceRecord | null;
}) {
  const [mode, setMode] = React.useState<"self" | "delegate">(
    (initial?.mode as any) || "self"
  );
  const [saving, setSaving] = React.useState(false);

  async function saveMode() {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("buyerId", buyerId);
      fd.append("mode", mode);
      await fetch("/api/profile/compliance/save", { method: "POST", body: fd });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 grid gap-4">
      {/* Mode toggle */}
      <div className="flex items-center gap-5">
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="mode"
            value="self"
            checked={mode === "self"}
            onChange={() => setMode("self")}
            className="h-4 w-4 rounded-full border-white/20 bg-black/40"
          />
          <span>Self</span>
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="mode"
            value="delegate"
            checked={mode === "delegate"}
            onChange={() => setMode("delegate")}
            className="h-4 w-4 rounded-full border-white/20 bg-black/40"
          />
          <span>Delegate to Wine Connect</span>
        </label>

        <button
          onClick={saveMode}
          disabled={saving}
          className="ml-auto rounded-xl px-4 py-2 text-sm font-semibold text-[#0f1720] disabled:opacity-60"
          style={{ background: "#E33955" }}
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      {/* Documents upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <UploadBox
          label="Importer license"
          name="importer_license"
          buyerId={buyerId}
        />
        <UploadBox label="Company ID / VAT" name="company_id" buyerId={buyerId} />
      </div>
    </div>
  );
}

function UploadBox({
  label,
  name,
  buyerId,
}: {
  label: string;
  name: string;
  buyerId: string;
}) {
  const [loading, setLoading] = React.useState(false);
  async function upload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    fd.append("buyerId", buyerId);
    await fetch("/api/profile/compliance/upload", { method: "POST", body: fd });
    setLoading(false);
  }
  return (
    <form
      onSubmit={upload}
      className="rounded-xl border border-white/10 bg-black/30 px-4 py-4 grid gap-2"
    >
      <div className="text-sm text-white/80">{label}</div>
      <input
        type="file"
        name={name}
        className="text-sm file:mr-3 file:rounded file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-white hover:file:bg-white/20"
      />
      <div>
        <button
          disabled={loading}
          className="rounded-xl px-4 py-2 text-sm font-semibold text-[#0f1720] disabled:opacity-60"
          style={{ background: "#E33955" }}
        >
          {loading ? "Uploading…" : "Upload"}
        </button>
      </div>
    </form>
  );
}
