export interface UI_BankSampah {
  id: string;
  name: string;
  address: string;
  category: string;
  lat: number;          // Diubah dari latitude
  lng: number;          // Diubah dari longitude
  phone?: string;       // Properti yang diminta TypeScript
  opening_hours?: string; 
  website?: string;
  google_maps_url: string;
}

interface Props {
  results: UI_BankSampah[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  cardRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}

// apa aja
export default function BankSampahList({ results, selectedId, onSelect, cardRefs }: Props) {
  return (
    <div className="lg:w-[380px] flex-shrink-0 overflow-y-auto pr-2 space-y-3 scrollbar-thin">
      {results.map((bank) => (
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
          <span className="inline-block text-[10px] uppercase tracking-[0.25em] font-bold text-green-700 bg-green-100/50 px-2.5 py-1 mb-3 rounded-md">
            {bank.category}
          </span>
          <h3 className="font-black text-black text-sm leading-snug mb-1 group-hover:text-green-800 transition-colors">
            {bank.name}
          </h3>
          <p className="text-xs text-black/50 leading-relaxed mb-4">
            {bank.address}
          </p>

          {/* Jam Buka & Telepon */}
          <div className="space-y-1 mb-4">
            {bank.opening_hours && (
              <p className="text-xs text-black/50 flex items-center gap-2">
                <span>🕐</span> {bank.opening_hours}
              </p>
            )}
            {bank.phone && (
              <p className="text-xs text-black/50 flex items-center gap-2">
                <span>📞</span> {bank.phone}
              </p>
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
      ))}
    </div>
  );
}