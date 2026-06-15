import { motion } from "framer-motion";
import { Camera, X } from "lucide-react";

interface CameraViewProps {
  onCancel: () => void;
}

export default function CameraView({ onCancel }: CameraViewProps) {
  return (
    <motion.div
      key="camera-view"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white/80 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-6 border border-white/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] w-full"
    >
      <div className="relative rounded-[1.5rem] overflow-hidden bg-black aspect-[4/3] sm:aspect-video flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Camera className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">Kamera Aktif di sini</p>
        </div>

        <div className="absolute bottom-4 left-0 w-full px-6 flex justify-between items-center z-20">
          <button
            onClick={onCancel}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white hover:bg-red-500/80 transition-colors"
          >
            <X size={18} />
          </button>
          <button className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 transition-transform bg-white/20 backdrop-blur-sm">
            <div className="w-12 h-12 bg-white rounded-full shadow-lg"></div>
          </button>
          <div className="w-10"></div>
        </div>
      </div>
    </motion.div>
  );
}