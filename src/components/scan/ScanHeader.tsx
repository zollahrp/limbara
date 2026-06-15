import { Zap } from "lucide-react";

export default function ScanHeader() {
  return (
    <header className="pt-24 sm:pt-32 pb-8 px-6 max-w-3xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-black mb-6">
        <Zap className="w-3 h-3 fill-green-800" />
        AI Powered Scanner
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-3">
        Deteksi Sampah <span className="text-green-700">dengan AI</span>
      </h1>
      <p className="text-gray-500 text-xs sm:text-sm md:text-base leading-relaxed max-w-lg mx-auto font-medium">
        Ambil atau unggah gambar untuk mengidentifikasi jenis sampah dan potensi daur ulangnya.
      </p>
    </header>
  );
}