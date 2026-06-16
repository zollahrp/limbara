import { BankSampahControlsProps } from "@/types/BankSampah";

export default function BankSampahControls({ radius, onRadiusChange, onRequestLocation, status, resultCount }: BankSampahControlsProps) {
  return (
    <section className="px-6 sm:px-10 lg:px-16 max-w-screen-xl mx-auto mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Radius Selector */}
        <div className="flex items-center gap-3 bg-white border border-black/10 px-4 py-3 shadow-sm rounded-xl">
          <span className="text-xs text-black/50 uppercase tracking-widest font-bold">
            Radius
          </span>
          {[3, 5, 10].map((r) => (
            <button
              key={r}
              onClick={() => onRadiusChange(r)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all rounded-md ${
                radius === r
                  ? "bg-green-800 text-white"
                  : "text-black/60 hover:bg-black/5"
              }`}
            >
              {r} km
            </button>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={onRequestLocation}
          disabled={status === "requesting" || status === "loading"}
          className="flex items-center gap-3 bg-green-800 hover:bg-green-700 disabled:bg-green-900/50 text-white px-8 py-3.5 text-xs font-bold uppercase tracking-[0.25em] rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          {status === "requesting" || status === "loading" ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {status === "requesting" ? "Meminta Lokasi..." : "Mencari..."}
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {status === "success" ? "Perbarui Lokasi" : "Izinkan Lokasi & Cari"}
            </>
          )}
        </button>

        {status === "success" && (
          <p className="text-xs text-black/50 tracking-wide font-medium">
            Ditemukan <span className="text-green-700 font-bold">{resultCount} lokasi</span> dalam radius {radius} km
          </p>
        )}
      </div>
    </section>
  );
}