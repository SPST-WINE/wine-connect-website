import KoreaHowItWorks from "./KoreaHowItWorks";

export default function KoreaLandingStep({
  onNext,
}: {
  onNext: () => void;
}) {
  return (
    <section className="flex flex-1 flex-col justify-between">
      <div>
        <h1 className="mb-3 text-3xl font-semibold leading-tight">
          Italian wineries, <br />
          one tasting box <span className="text-pink-400">in Korea</span>.
        </h1>

        <p className="mb-2 text-sm text-slate-300">
          Discover a curated selection of Italian producers attending the
          Wine Connect event in Seoul. Build your own 6 or 12-bottle tasting
          box and we’ll take care of logistics and compliance.
        </p>

        <KoreaHowItWorks />
      </div>

      <button
        onClick={onNext}
        className="mt-8 w-full rounded-2xl bg-gradient-to-r from-pink-500 to-orange-400 py-3 text-center text-sm font-semibold text-slate-950 shadow-lg shadow-pink-500/25"
      >
        Enter Wine Connect
      </button>
    </section>
  );
}
