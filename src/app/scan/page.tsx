"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";

// Impor komponen yang sudah dipecah
import ScanHeader from "@/components/scan/ScanHeader";
import UploadView from "@/components/scan/UploadView";
import CameraView from "@/components/scan/CameraView";
import ScanNavTabs, { TabMode } from "@/components/scan/ScanNavTabs";
import Navbar from "@/components/Navbar";

export default function ScanPage() {
  const [activeTab, setActiveTab] = useState<TabMode>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fungsi untuk menangani saat file dipilih dari UploadView
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    console.log("File diterima di page utama:", file.name);
    // TODO: Arahkan ke proses preview / API deteksi
  };

  return (
    <div className="min-h-screen bg-[#F7F8F4] font-sans pb-20 flex flex-col items-center">
      <Navbar />
      <ScanHeader />

      <main className="w-full max-w-[650px] px-4 sm:px-6">
        <AnimatePresence mode="wait">
          {activeTab === "upload" && (
            <UploadView onFileSelect={handleFileSelect} />
          )}

          {activeTab === "camera" && (
            <CameraView onCancel={() => setActiveTab("upload")} />
          )}
        </AnimatePresence>

        <ScanNavTabs 
          activeTab={activeTab} 
          onChangeTab={setActiveTab} 
        />
      </main>
    </div>
  );
}