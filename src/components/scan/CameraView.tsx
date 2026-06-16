import { motion } from "framer-motion";
import { Camera, X, AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CameraViewProps {
  onCancel: () => void;
  onCapture: (file: File) => void;
}

export default function CameraView({ onCancel, onCapture }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        setError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment", // Use back camera on mobile
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          // Don't set active yet - wait for onCanPlay event
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Gagal mengakses kamera. Periksa izin browser Anda.";
        setError(errorMsg);
        console.error("Camera error:", err);
      }
    };

    initCamera();

    // Cleanup: Stop all tracks when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Handle when video is ready to play
  const handleVideoCanPlay = () => {
    setIsCameraActive(true);
  };

  // Capture photo from video
  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      setIsCapturing(true);
      const context = canvasRef.current.getContext("2d");
      if (!context) return;

      // Set canvas size to match video
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;

      // Draw current frame from video
      context.drawImage(videoRef.current, 0, 0);

      // Convert canvas to blob and create File
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
          onCapture(file);
        }
      }, "image/jpeg", 0.95);

      // Stop camera after capture
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    } catch (err) {
      console.error("Capture error:", err);
      setError("Gagal menangkap foto. Coba lagi.");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleCancelClick = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    onCancel();
  };

  return (
    <motion.div
      key="camera-view"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white/80 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-6 border border-white/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] w-full"
    >
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="relative rounded-[1.5rem] overflow-hidden bg-black aspect-[4/3] sm:aspect-video flex items-center justify-center">
        {/* Video Stream - Always render so onCanPlay can fire */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onCanPlay={handleVideoCanPlay}
          className={`w-full h-full object-cover ${
            isCameraActive ? "block" : "hidden"
          }`}
        />
        {/* Hidden Canvas untuk capture */}
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* Loading atau Error State */}
        {!isCameraActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center text-gray-400">
              <Camera className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">
                {error ? "Kamera tidak tersedia" : "Menginisialisasi kamera..."}
              </p>
            </div>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="absolute bottom-4 left-0 w-full px-6 flex justify-between items-center z-20">
          {/* Cancel Button */}
          <button
            onClick={handleCancelClick}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white hover:bg-red-500/80 transition-colors"
          >
            <X size={18} />
          </button>

          {/* Capture Button (Shutter) */}
          <button
            onClick={handleCapture}
            disabled={!isCameraActive || isCapturing || !!error}
            className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 transition-transform bg-white/20 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-12 h-12 bg-white rounded-full shadow-lg" />
          </button>

          {/* Spacer untuk balance layout */}
          <div className="w-10"></div>
        </div>
      </div>
    </motion.div>
  );
}