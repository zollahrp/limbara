import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, AlertTriangle, CheckCircle2, Recycle, Info } from "lucide-react";
import Image from "next/image";
import { ScanSuccessResponse, WasteInsightData } from "@/types/scan";

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  scanData: ScanSuccessResponse | null;
  insightData: WasteInsightData | null;
  isLoadingInsight: boolean;
}

export default function ResultModal({ isOpen, onClose, scanData, insightData, isLoadingInsight }: ResultModalProps) {
  if (!isOpen || !scanData) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm">
        {/* Latar Belakang Klik untuk Tutup */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0" onClick={onClose} 
        />

        {/* Kontainer Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-[#F7F8F4] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header Modal */}
          <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
            <h3 className="font-black text-gray-900 text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-600" /> Hasil Analisis AI
            </h3>
            <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Area Konten Scrollable */}
          <div className="flex flex-col lg:flex-row overflow-y-auto p-6 gap-6">
            
            {/* KIRI: Gambar & Info Deteksi */}
            <div className="w-full lg:w-1/2 space-y-4">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200 border-4 border-white shadow-sm">
                <Image 
                  src={scanData.image_url} 
                  alt="Hasil Deteksi" 
                  fill 
                  className="object-cover"
                />
              </div>
              
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Objek Terdeteksi</p>
                <div className="flex flex-wrap gap-2">
                  {scanData.allDetections.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-green-50 px-3 py-2 rounded-xl w-full">
                      <span className="font-bold text-green-900 capitalize">{item.className.replace(/_/g, ' ')}</span>
                      <span className="text-xs font-bold text-green-700 bg-green-200 px-2 py-1 rounded-md">
                        {(item.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* KANAN: Insight Edukasi */}
            <div className="w-full lg:w-1/2 flex flex-col">
              {isLoadingInsight ? (
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-gray-400">
                  <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4" />
                  <p className="font-medium animate-pulse text-sm">Menyusun insight edukasi...</p>
                </div>
              ) : insightData ? (
                <div className="space-y-4">
                  {/* Badge Bahaya & Daur Ulang */}
                  <div className="flex gap-2">
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5
                      ${insightData.tingkat_bahaya === 'tinggi' ? 'bg-red-100 text-red-700' : 
                        insightData.tingkat_bahaya === 'sedang' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Bahaya: {insightData.tingkat_bahaya}
                    </div>
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5
                      ${insightData.dapat_didaur_ulang ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                      <Recycle className="w-3.5 h-3.5" />
                      {insightData.dapat_didaur_ulang ? 'Bisa Didaur Ulang' : 'Sulit Didaur Ulang'}
                    </div>
                  </div>

                  {/* Ringkasan Bahaya */}
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2"><Info className="w-4 h-4 text-blue-500" /> Dampak Lingkungan</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{insightData.ringkasan_bahaya}</p>
                  </div>

                  {/* Cara Buang */}
                  <div className="bg-green-800 p-5 rounded-2xl shadow-sm text-white">
                    <h4 className="text-sm font-bold text-green-200 mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-300" /> Cara Membuang</h4>
                    <p className="text-sm font-medium leading-relaxed">{insightData.cara_buang}</p>
                  </div>

                  {/* Ide Daur Ulang */}
                  {insightData.dapat_didaur_ulang && insightData.ide_daur_ulang.length > 0 && (
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                      <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><Recycle className="w-4 h-4 text-green-600" /> Ide Praktis Daur Ulang</h4>
                      <ul className="space-y-3">
                        {insightData.ide_daur_ulang.map((ide, idx) => (
                          <li key={idx} className="flex gap-3 text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl">
                            <span className="font-black text-green-300 mt-0.5">{idx + 1}.</span> {ide}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Fakta Menarik */}
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                    <p className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-1">💡 Tahukah Kamu?</p>
                    <p className="text-sm text-amber-900/80 italic font-medium">{insightData.fakta_menarik}</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-red-500 bg-red-50 rounded-2xl">
                  <AlertTriangle className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm font-bold">Gagal memuat insight edukasi.</p>
                </div>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}