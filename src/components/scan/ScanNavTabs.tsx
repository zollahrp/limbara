import { motion } from "framer-motion";
import { Camera, Image as ImageIcon } from "lucide-react";

export type TabMode = "upload" | "camera";

interface ScanNavTabsProps {
  activeTab: TabMode;
  onChangeTab: (tab: TabMode) => void;
}

const tabItems = [
  { id: "upload", label: "Unggah Foto", icon: <ImageIcon size={18} /> },
  { id: "camera", label: "Kamera", icon: <Camera size={18} /> },
] as const;

export default function ScanNavTabs({ activeTab, onChangeTab }: ScanNavTabsProps) {
  return (
    <div className="mt-8 flex bg-gray-200/60 backdrop-blur-md p-1.5 rounded-[2rem] max-w-sm mx-auto shadow-inner">
      {tabItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChangeTab(item.id as TabMode)}
            className="relative flex-1 py-3 px-4 rounded-[1.5rem] text-sm font-bold outline-none"
          >
            <span
              className={`relative z-20 flex items-center justify-center gap-2 transition-colors duration-300 ${
                isActive ? "text-green-900" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {item.icon}
              {item.label}
            </span>

            {isActive && (
               <motion.div
                 layoutId="active-nav-pill"
                 className="absolute inset-0 bg-white rounded-[1.5rem] shadow-sm z-10 border border-gray-100"
                 transition={{ type: "spring", stiffness: 400, damping: 30 }}
               />
            )}
          </button>
        );
      })}
    </div>
  );
}