"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
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
  
  // States untuk Proses Insight
  const [insightResult, setInsightResult] = useState<WasteInsightData | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  
  // State untuk Kontrol Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // FUNGSI UTAMA: Menerima file dan memanggil API Deteksi
  const handleFileSelect = async (file: File) => {
    setIsScanning(true);
    // Reset state sebelumnya jika ada
    setScanResult(null);
    setInsightResult(null);
    
    try {
      const response = await ScanImage(file);
      
      if (response.status === "success") {
        setScanResult(response);
        setIsModalOpen(true); // Buka modal seketika setelah YOLO selesai
      } else {
        alert(response.message); // Bisa diganti dengan toast/komponen alert nanti
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem saat memproses gambar.");
    } finally {
      setIsScanning(false);
    }
  };

  // EFFECT: Otomatis mencari Insight sesaat setelah scanResult berubah dan modal terbuka
  useEffect(() => {
    if (scanResult && scanResult.detected_class_names.length > 0) {
      const fetchInsight = async () => {
        setIsLoadingInsight(true);
        const response = await GetWasteInsight(scanResult.detected_class_names);
        
        if (response.status === "success" && response.data) {
          setInsightResult(response.data);
        }
        setIsLoadingInsight(false);
      };

      fetchInsight();
    }
  }, [scanResult]); // Trigger ini hanya berjalan ketika scanResult mendapatkan data baru

  return (
    <div className="min-h-screen bg-[#F7F8F4] font-sans pb-20 flex flex-col items-center">
      <Navbar />
      <ScanHeader />

      <main className="w-full max-w-[650px] px-4 sm:px-6 relative">
        
        {/* Indikator Loading Utama (Menimpa area scan) */}
        {isScanning && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#F7F8F4]/80 backdrop-blur-sm rounded-[2.5rem]">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-700 rounded-full animate-spin mb-4" />
            <p className="font-bold text-green-900 animate-pulse">Menganalisis gambar...</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === "upload" && (
            <UploadView onFileSelect={handleFileSelect} />
          )}

          {activeTab === "camera" && (
             // Nanti logika CameraView juga diarahkan ke handleFileSelect saat tombol jepret ditekan
            <CameraView onCancel={() => setActiveTab("upload")} />
          )}
        </AnimatePresence>

        <ScanNavTabs activeTab={activeTab} onChangeTab={setActiveTab} />
      </main>

      {/* Komponen Modal yang akan merender dirinya sendiri saat isModalOpen = true */}
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