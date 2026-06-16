import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, AlertTriangle, CheckCircle2, Recycle, Info, Download, Bookmark, Loader2 } from "lucide-react";
import Image from "next/image";
import { ScanSuccessResponse, WasteInsightData } from "@/types/scan";
import { createClient } from "@/utils/supabase/client";
import Swal from "sweetalert2";
import { toPng } from "html-to-image";

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  scanData: ScanSuccessResponse | null;
  insightData: WasteInsightData | null;
  isLoadingInsight: boolean;
}

export default function ResultModal({ isOpen, onClose, scanData, insightData, isLoadingInsight }: ResultModalProps) {
  const [user, setUser] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const supabase = createClient();
  const modalContentRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    if (isOpen) {
      const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      };
      checkUser();
    }
  }, [isOpen]);

  if (!isOpen || !scanData) return null;

  // --- FUNGSI 1: SIMPAN KE DATABASE ---
  const handleSaveToHistory = async () => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Belum Login",
        text: "Kamu harus login terlebih dahulu untuk menyimpan riwayat scan.",
        confirmButtonColor: "#166534",
        confirmButtonText: "Mengerti",
        customClass: { popup: "rounded-3xl", confirmButton: "rounded-xl px-6 py-2.5 font-bold" }
      });
      return;
    }

    if (!insightData) return;

    setIsSaving(true);
    try {
      const { error } = await supabase.from('scan_histories').insert([
        {
          user_id: user.id,
          image_url: scanData.image_url,
          detected_objects: scanData.detected_class_names,
          danger_level: insightData.tingkat_bahaya,
          is_recyclable: insightData.dapat_didaur_ulang,
          insight_summary: insightData.ringkasan_bahaya,
          full_insight_data: insightData 
        }
      ]);

      if (error) throw error;

      Swal.fire({
        icon: "success",
        title: "Tersimpan!",
        text: "Hasil scan berhasil ditambahkan ke riwayatmu.",
        showConfirmButton: false,
        timer: 2000,
        customClass: { popup: "rounded-3xl" }
      });

    } catch (error: any) {
      console.error("Gagal menyimpan:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan",
        text: error.message || "Terjadi kesalahan pada server.",
        confirmButtonColor: "#ef4444",
        customClass: { popup: "rounded-3xl" }
      });
    } finally {
      setIsSaving(false);
    }
  };

  // --- FUNGSI 2: UNDUH FULL GAMBAR (Dengan Trik Scroll) ---
  const handleDownloadImage = async () => {
    if (!modalContentRef.current) return;
    
    setIsDownloading(true);
    
    const node = modalContentRef.current;
    
    // Simpan state tinggi aslinya
    const originalHeight = node.style.height;
    const originalOverflow = node.style.overflow;
    
    // Paksa elemen melar sepanjang total konten
    node.style.height = `${node.scrollHeight}px`;
    node.style.overflow = "visible";

    try {
      await new Promise((resolve) => setTimeout(resolve, 300)); 

      const dataUrl = await toPng(node, {
        pixelRatio: 2, 
        backgroundColor: "#F7F8F4", 
        cacheBust: true,
      });
      
      const link = document.createElement("a");
      link.download = `Limbara_Insight_${new Date().getTime()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Gagal membuat gambar:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Mengunduh",
        text: "Terjadi kesalahan saat memproses gambar.",
        confirmButtonColor: "#ef4444",
        customClass: { popup: "rounded-3xl" }
      });
    } finally {
      // Kembalikan ke state asli
      node.style.height = originalHeight;
      node.style.overflow = originalOverflow;
      setIsDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-[#F7F8F4] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
            <h3 className="font-black text-gray-900 text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-600" /> Hasil Analisis AI
            </h3>
            <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Area Konten Scrollable */}
          <div ref={modalContentRef} className="flex flex-col lg:flex-row overflow-y-auto p-6 gap-6 bg-[#F7F8F4]">
            
            {/* KIRI: Gambar Asli, Daftar Deteksi, & Tahukah Kamu */}
            <div className="w-full lg:w-1/2 space-y-4">
              {/* Gambar Asli dari Scan */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200 border-4 border-white shadow-sm">
                <Image src={scanData.image_url} alt="Hasil Deteksi" fill className="object-cover" />
              </div>
              
              {/* Daftar Objek Terdeteksi */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Objek Terdeteksi</p>
                <div className="flex flex-wrap gap-2">
                  {scanData.allDetections.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-green-50 px-3 py-2 rounded-xl w-full">
                      <span className="font-bold text-green-900 capitalize">{item.className.replace(/_/g, ' ')}</span>
                      {item.confidence > 0 && (
                        <span className="text-xs font-bold text-green-700 bg-green-200 px-2 py-1 rounded-md">
                          {(item.confidence * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* POSISI BARU: Fakta Menarik (Tahukah Kamu?) */}
              {insightData && !isLoadingInsight && (
                <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 shadow-sm mt-6">
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-2 flex items-center gap-1.5">💡 Tahukah Kamu?</p>
                  <p className="text-sm text-amber-900/80 italic font-medium leading-relaxed">{insightData.fakta_menarik}</p>
                </div>
              )}
            </div>

            {/* KANAN: Insight Edukasi (Fokus pada Panduan) */}
            <div className="w-full lg:w-1/2 flex flex-col">
              {isLoadingInsight ? (
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-gray-400">
                  <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4" />
                  <p className="font-medium animate-pulse text-sm">Menyusun insight edukasi...</p>
                </div>
              ) : insightData ? (
                <div className="space-y-4">
                  {/* Badge Status */}
                  <div className="flex gap-2">
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${insightData.tingkat_bahaya === 'tinggi' ? 'bg-red-100 text-red-700' : insightData.tingkat_bahaya === 'sedang' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                      <AlertTriangle className="w-3.5 h-3.5" /> Bahaya: {insightData.tingkat_bahaya}
                    </div>
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${insightData.dapat_didaur_ulang ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                      <Recycle className="w-3.5 h-3.5" /> {insightData.dapat_didaur_ulang ? 'Bisa Didaur Ulang' : 'Sulit Didaur Ulang'}
                    </div>
                  </div>

                  {/* Dampak Lingkungan */}
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2"><Info className="w-4 h-4 text-blue-500" /> Dampak Lingkungan</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{insightData.ringkasan_bahaya}</p>
                  </div>

                  {/* Cara Membuang */}
                  <div className="bg-green-800 p-5 rounded-2xl shadow-sm text-white">
                    <h4 className="text-sm font-bold text-green-200 mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-300" /> Cara Membuang</h4>
                    <p className="text-sm font-medium leading-relaxed">{insightData.cara_buang}</p>
                  </div>

                  {/* Ide Praktis Daur Ulang */}
                  {insightData.dapat_didaur_ulang && insightData.ide_daur_ulang.length > 0 && (
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                      <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><Recycle className="w-4 h-4 text-green-600" /> Panduan Praktis Daur Ulang</h4>
                      <div className="space-y-6">
                        {insightData.ide_daur_ulang.map((ide, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <h5 className="font-black text-green-800 mb-3 text-sm flex items-center gap-2">
                              <span className="bg-green-200 text-green-800 w-6 h-6 rounded-full flex items-center justify-center text-xs">{idx + 1}</span>
                              {ide.judul_ide}
                            </h5>
                            <div className="mb-4">
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Bahan yang dibutuhkan:</p>
                              <div className="flex flex-wrap gap-2">
                                {ide.bahan_bahan.map((bahan, bIdx) => (
                                  <span key={bIdx} className="bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-md text-xs font-medium">{bahan}</span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tahapan Pembuatan:</p>
                              <ul className="space-y-2">
                                {ide.tahapan_pembuatan.map((tahap, tIdx) => (
                                  <li key={tIdx} className="text-sm text-gray-600 leading-relaxed flex items-start gap-2">
                                    <span className="text-green-500 font-bold mt-0.5">•</span><span>{tahap}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Kotak Fakta Menarik (Tahukah Kamu?) sudah dipindah ke kolom KIRI */}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-red-500 bg-red-50 rounded-2xl">
                  <AlertTriangle className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm font-bold">Gagal memuat insight edukasi.</p>
                </div>
              )}
            </div>
          </div>

          {/* FOOTER AKSI */}
          {!isLoadingInsight && insightData && (
            <div className="bg-white px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3 justify-end sticky bottom-0 z-10">
              <button 
                onClick={handleDownloadImage}
                disabled={isDownloading}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {isDownloading ? "Memproses..." : "Unduh Gambar"}
              </button>
              
              <button 
                onClick={handleSaveToHistory}
                disabled={isSaving}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-800 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bookmark className="w-4 h-4" />}
                {isSaving ? "Menyimpan..." : "Simpan ke Riwayat"}
              </button>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}