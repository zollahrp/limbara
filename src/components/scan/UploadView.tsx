import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ImagePlus } from "lucide-react";

interface UploadViewProps {
  onFileSelect: (file: File) => void;
}

export default function UploadView({ onFileSelect }: UploadViewProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <motion.div
      key="upload-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white/80 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border border-white/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] w-full flex flex-col items-center"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full aspect-[4/3] sm:aspect-video rounded-[1.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group ${
          isDragging
            ? "border-green-500 bg-green-50 scale-[1.02]"
            : "border-gray-200 bg-gray-50/50 hover:border-green-300 hover:bg-green-50/30"
        }`}
      >
        <div className="mb-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-500">
          <ImagePlus className="w-10 h-10 text-green-700/70" />
        </div>
        <h4 className="text-xl font-bold text-gray-900 mb-2">Siap untuk Scan?</h4>
        <p className="text-gray-400 text-xs sm:text-sm text-center px-6">
          Tarik & Lepaskan gambar di sini, atau <b>klik</b> untuk memilih dari perangkat.
        </p>
      </div>
    </motion.div>
  );
}