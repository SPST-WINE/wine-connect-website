// components/wines/AddSampleForm.tsx
import React from "react";

export default function AddSampleForm({
  wineId,
  defaultQty = 1,
  className = "",
  submitLabel = "Add sample",
}: {
  wineId: string;
  defaultQty?: number;
  className?: string;
  submitLabel?: string;
}) {
  return (
    <form
      action="/api/cart/add"
      method="post"
      className={`flex items-center gap-2 ${className}`}
    >
      <input type="hidden" name="wineId" value={wineId} />
      <input type="hidden" name="listType" value="sample" />
      <input
        className="w-20 rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-white"
        name="qty"
        type="number"
        min={1}
        defaultValue={defaultQty}
      />
      <button
        className="rounded-lg px-3 py-2 text-sm font-semibold text-[#0f1720]"
        style={{ background: "#E33955" }}
      >
        {submitLabel}
      </button>
    </form>
  );
}
