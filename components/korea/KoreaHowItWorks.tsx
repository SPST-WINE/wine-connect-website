const WC_COLOR = "#E33854";

export default function KoreaHowItWorks() {
  const steps = [
    {
      num: 1,
      title: "Enter Wine Connect",
      text: "Tell us who you are and share your work email.",
    },
    {
      num: 2,
      title: "Explore the wineries",
      text: "Browse the producers attending the Korea event.",
    },
    {
      num: 3,
      title: "Build your tasting box",
      text: "Add 6 or 12-bottle samples from the wineries you’re interested in.",
    },
    {
      num: 4,
      title: "Send your request",
      text: "We’ll follow up with details, logistics and compliance.",
    },
  ];

  return (
    <div className="mt-6 rounded-3xl bg-slate-900/70 p-4 shadow-xl shadow-black/40">
      <p className="mb-3 text-sm font-semibold text-slate-100">How it works</p>

      <div className="space-y-3">
        {steps.map((s) => (
          <div
            key={s.num}
            className="flex items-center gap-3 rounded-2xl bg-slate-900/80 px-3 py-2"
          >
            {/* Cerchio NUM perfettamente regolare */}
            <div
              className="flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-bold text-slate-950"
              style={{ backgroundColor: WC_COLOR }}
            >
              {s.num}
            </div>

            <div className="text-xs text-slate-300">
              <p className="font-semibold text-slate-100">{s.title}</p>
              <p>{s.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
