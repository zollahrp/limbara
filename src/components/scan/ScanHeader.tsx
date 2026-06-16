import { Zap } from "lucide-react";

export default function ScanHeader() {
  return (
    <header className="pt-24 sm:pt-32 pb-8 px-6 max-w-3xl mx-auto text-center">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-3">
        Deteksi Sampah <span className="text-green-700">dengan AI</span>
      </h1>
      <p className="text-gray-500 text-xs sm:text-sm md:text-base leading-relaxed max-w-lg mx-auto font-medium">
        Ambil atau unggah gambar untuk mengidentifikasi jenis sampah dan potensi daur ulangnya.
      </p>
    </header>
  );
}