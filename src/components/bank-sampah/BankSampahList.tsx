import { BankSampahListProps } from "@/types/BankSampah";
import { formatDistance, formatNumber } from "@/utils/format";

export default function BankSampahList({ results, selectedId, onSelect, cardRefs }: BankSampahListProps) {
  return (
    <div className="lg:w-[380px] flex-shrink-0 overflow-y-auto pr-2 space-y-3 scrollbar-thin">
      {results.map((bank) => {
        const region = [bank.regency, bank.province].filter(Boolean).join(", ");
        const wasteReceived = formatNumber(bank.waste_received);

        return (
          <div
            key={bank.id}
            ref={(el) => { cardRefs.current[bank.id] = el; }}
            onClick={() => onSelect(bank.id)}
            className={`group cursor-pointer bg-white border-l-4 transition-all duration-200 rounded-r-xl shadow-sm hover:shadow-md p-5 ${
              selectedId === bank.id
                ? "border-green-700 shadow-md bg-green-50/30"
                : "border-transparent hover:border-green-300"
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <span className="inline-block text-[10px] uppercase tracking-[0.25em] font-bold text-green-700 bg-green-100/50 px-2.5 py-1 rounded-md">
                Bank Sampah
              </span>
              <span className="shrink-0 text-[10px] uppercase tracking-[0.15em] font-bold text-black/40 bg-black/5 px-2.5 py-1 rounded-md">
                {formatDistance(bank.distance_km)}
              </span>
            </div>

            <h3 className="font-black text-black text-sm leading-snug mb-1 group-hover:text-green-800 transition-colors">
              {bank.name}
            </h3>
            <p className="text-xs text-black/50 leading-relaxed mb-1">{bank.address}</p>
            {region && <p className="text-[11px] text-black/40 leading-relaxed mb-3">{region}</p>}

            <div className="flex flex-wrap gap-1.5 mb-4">
              {bank.managed_by && (
                <span className="text-[10px] font-bold text-black/60 bg-black/5 px-2 py-1 rounded-md">
                  {`Pengelola: ${bank.managed_by}`}
                </span>
              )}
              {bank.scope && (
                <span className="text-[10px] font-bold text-black/60 bg-black/5 px-2 py-1 rounded-md">
                  {bank.scope}
                </span>
              )}
              {wasteReceived && (
                <span className="text-[10px] font-bold text-black/60 bg-black/5 px-2 py-1 rounded-md">
                  Sampah ditampung {wasteReceived} ({bank.year})
                </span>
              )}
            </div>

            <a
              href={bank.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-white bg-green-800 hover:bg-green-700 px-4 py-2.5 rounded-lg transition-colors"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Buka di Peta
            </a>
          </div>
        );
      })}
    </div>
  );
}