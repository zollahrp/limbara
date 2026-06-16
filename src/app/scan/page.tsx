"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react"; // Tambahan icon
import { ScanImage, GetWasteInsight } from "@/app/service/api";
import { ScanSuccessResponse, WasteInsightData } from "@/types/scan";

import ScanHeader from "@/components/scan/ScanHeader";
import UploadView from "@/components/scan/UploadView";
import CameraView from "@/components/scan/CameraView";
import ScanNavTabs, { TabMode } from "@/components/scan/ScanNavTabs";
import ResultModal from "@/components/scan/ResultModal"; // Import Modal
import Navbar from "@/components/Navbar";

export default function ScanPage() {
  const [activeTab, setActiveTab] = useState<TabMode>("upload");
  
  // States untuk Proses Deteksi & UI
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanSuccessResponse | null>(null);
  const [scanError, setScanError] = useState<string | null>(null); // State error baru
  
  // States untuk Proses Insight
  const [insightResult, setInsightResult] = useState<WasteInsightData | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  
  // State untuk Kontrol Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // FUNGSI UTAMA: Menerima file dan memanggil API Deteksi
  const handleFileSelect = async (file: File) => {
    // 1. Reset semua state sebelum mulai
    setIsScanning(true);
    setScanResult(null);
    setInsightResult(null);
    setIsModalOpen(false);
    setScanError(null); 
    
    try {
      const response = await ScanImage(file);
      
      if (response.status === "success") {
        setScanResult(response);
        // Lanjut ke useEffect untuk mencari insight
      } else {
        // 2. Tangkap status 'not_found' atau 'error' dari API
        setScanError(response.message || "Objek tidak dikenali sebagai sampah."); 
      }
    } catch (error) {
      setScanError("Terjadi kesalahan sistem saat memproses gambar.");
    } finally {
      setIsScanning(false);
    }
  };

  // EFFECT: Otomatis mencari Insight
  useEffect(() => {
    if (scanResult && scanResult.detected_class_names.length > 0) {
      const fetchInsight = async () => {
        setIsLoadingInsight(true);
        const response = await GetWasteInsight(scanResult.detected_class_names);
        
        if (response.status === "success" && response.data) {
          setInsightResult(response.data);
          setIsModalOpen(true); // Buka modal hanya jika sukses total
        } else {
          // Jika YOLO sukses tapi Gemini gagal, arahkan juga ke UI Error
          setScanResult(null);
          setScanError("Gagal meracik edukasi AI. Silakan scan ulang.");
        }
        setIsLoadingInsight(false);
      };

      fetchInsight();
    }
  }, [scanResult]);

  // FUNGSI RESET: Mengembalikan UI ke kondisi awal
  const handleReset = () => {
    setScanError(null);
    setScanResult(null);
    setInsightResult(null);
  };

  return (
    <div className="min-h-screen bg-[#F7F8F4] font-sans pb-20 flex flex-col items-center">
      <Navbar />
      <ScanHeader />

      <main className="w-full max-w-[650px] px-4 sm:px-6 relative">
        
        {/* Indikator Loading Utama */}
        {isScanning && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#F7F8F4]/80 backdrop-blur-sm rounded-[2.5rem]">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-700 rounded-full animate-spin mb-4" />
            <p className="font-bold text-green-900 animate-pulse">Menganalisis gambar...</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* JIKA ADA ERROR, TAMPILKAN INI (Menggantikan Upload/Kamera) */}
          {scanError ? (
            <motion.div
              key="error-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/80 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-12 border border-red-100 shadow-[0_20px_60px_-15px_rgba(255,0,0,0.08)] w-full flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-5">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">Deteksi Gagal</h3>
              <p className="text-gray-500 text-sm sm:text-base mb-8 max-w-sm leading-relaxed">
                {scanError}
              </p>
              <button
                onClick={handleReset}
                className="px-8 py-3.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl transition-all flex items-center gap-2 hover:shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
                Scan Ulang
              </button>
            </motion.div>
          ) : (
            /* JIKA TIDAK ADA ERROR, TAMPILKAN UPLOAD ATAU KAMERA NORMAL */
            <>
              {activeTab === "upload" && (
                <UploadView onFileSelect={handleFileSelect} />
              )}

              {activeTab === "camera" && (
                <CameraView 
                  onCancel={() => setActiveTab("upload")} 
                  onCapture={handleFileSelect}
                />
              )}
            </>
          )}
        </AnimatePresence>

        {/* Sembunyikan navigasi tab saat ada error agar user fokus ke tombol reset */}
        {!scanError && (
          <ScanNavTabs activeTab={activeTab} onChangeTab={setActiveTab} />
        )}
      </main>

      <ResultModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        scanData={scanResult}
        insightData={insightResult}
        isLoadingInsight={isLoadingInsight}
      />
    </div>
  );
}