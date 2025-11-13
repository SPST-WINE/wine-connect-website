"use client";

export default function KoreaSuccessStep({
  onRestart,
}: {
  onRestart: () => void;
}) {
  return (
    <section className="flex flex-1 flex-col justify-between">
      <div>
        <h2 className="mb-2 text-2xl font-semibold">Request received</h2>
        <p className="mb-4 text-sm text-slate-300">
          Thanks for building your tasting box for Wine Connect Korea.
        </p>
        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-300">
          <p>
            Our team will review your selection and send you an authentication
            email with your Wine Connect access.
          </p>
          <p>In that email you’ll find:</p>
          <ul className="list-inside list-disc space-y-1">
            <li>Your temporary password (you can change it anytime).</li>
            <li>A summary of your tasting box.</li>
            <li>Next steps to confirm orders after the event.</li>
          </ul>
        </div>
      </div>

      <button
        type="button"
        onClick={onRestart}
        className="mt-6 w-full rounded-2xl border border-slate-700 py-2 text-center text-xs text-slate-300"
      >
        Back to start
      </button>
    </section>
  );
}
