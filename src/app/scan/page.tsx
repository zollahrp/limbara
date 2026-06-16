"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, RotateCcw, History } from "lucide-react";
import { ScanImage, GetWasteInsight } from "@/app/service/api";
import { ScanSuccessResponse, WasteInsightData } from "@/types/scan";

import ScanHeader from "@/components/scan/ScanHeader";
import UploadView from "@/components/scan/UploadView";
import CameraView from "@/components/scan/CameraView";
import ScanNavTabs, { TabMode } from "@/components/scan/ScanNavTabs";
import ResultModal from "@/components/scan/ResultModal";
import Navbar from "@/components/Navbar";

export default function ScanPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabMode>("upload");
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanSuccessResponse | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  
  const [insightResult, setInsightResult] = useState<WasteInsightData | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileSelect = async (file: File) => {
    setIsScanning(true);
    setScanResult(null);
    setInsightResult(null);
    setIsModalOpen(false);
    setScanError(null); 
    
    try {
      const response = await ScanImage(file);
      
      if (response.status === "success") {
        setScanResult(response);
        // PERUBAHAN UTAMA: Buka modal di sini seketika setelah YOLO berhasil
        setIsModalOpen(true); 
      } else {
        setScanError(response.message || "Objek tidak dikenali sebagai sampah."); 
      }
    } catch (error) {
      setScanError("Terjadi kesalahan sistem saat memproses gambar.");
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    // Pastikan insightResult masih kosong agar tidak ter-trigger berulang
    if (scanResult && scanResult.detected_class_names.length > 0 && !insightResult) {
      const fetchInsight = async () => {
        setIsLoadingInsight(true);
        const response = await GetWasteInsight(scanResult.detected_class_names);
        
        if (response.status === "success" && response.data) {
          setInsightResult(response.data);
        } else {
          // Jika insight gagal, tutup modal dan tampilkan Error UI di halaman utama
          setIsModalOpen(false);
          setScanResult(null);
          setScanError("Gagal meracik edukasi AI. Silakan scan ulang.");
        }
        setIsLoadingInsight(false);
      };

      fetchInsight();
    }
  }, [scanResult, insightResult]); // Tambahkan insightResult ke dalam dependency

  const handleReset = () => {
    setScanError(null);
    setScanResult(null);
    setInsightResult(null);
  };

  return (
    <div className="min-h-screen bg-[#F7F8F4] font-sans pb-20 flex flex-col items-center">
      <Navbar />

      {/* Tombol Riwayat Saya — pojok kanan atas, di bawah Navbar */}
      <div className="w-full max-w-[650px] px-4 sm:px-6 flex justify-end pt-24 sm:pt-28">
        <button
          onClick={() => router.push("/riwayat")}
          className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-sm transition-colors"
        >
          <History className="w-4 h-4 text-green-700" />
          Riwayat Saya
        </button>
      </div>

      <ScanHeader />

      <main className="w-full max-w-[650px] px-4 sm:px-6 relative">
        
        {isScanning && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#F7F8F4]/80 backdrop-blur-sm rounded-[2.5rem]">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-700 rounded-full animate-spin mb-4" />
            <p className="font-bold text-green-900 animate-pulse">Menganalisis gambar...</p>
          </div>
        )}

        <AnimatePresence mode="wait">
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