"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  Recycle,
  Inbox,
} from "lucide-react";
import { getScanHistories } from "@/app/service/api";
import {
  ScanHistoryItem,
  historyItemToScanData,
  historyItemToInsightData,
} from "@/types/scan";
import ResultModal from "@/components/scan/ResultModal";

interface HistoryListProps {
  pageSize?: number;
}

export default function HistoryList({ pageSize = 9 }: HistoryListProps) {
  const [items, setItems] = useState<ScanHistoryItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ScanHistoryItem | null>(null);

  const fetchPage = useCallback(async (targetPage: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getScanHistories(targetPage, pageSize);
      setItems(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);
      setPage(result.page);
    } catch {
      setError("Gagal memuat riwayat scan. Coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToPage = (target: number) => {
    if (target < 1 || target > totalPages || target === page) return;
    fetchPage(target);
  };

  const dangerBadgeClass = (level: string | null) => {
    if (level === "tinggi") return "bg-red-100 text-red-700";
    if (level === "sedang") return "bg-amber-100 text-amber-700";
    return "bg-blue-100 text-blue-700";
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ── Loading State ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: pageSize }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
          >
            <div className="w-full aspect-[4/3] bg-gray-200" />
            <div className="p-4 space-y-2">
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Error State ───────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="w-10 h-10 text-red-400 mb-3" />
        <p className="text-gray-500 text-sm">{error}</p>
        <button
          onClick={() => fetchPage(page)}
          className="mt-4 text-xs font-bold uppercase tracking-widest text-green-700 hover:text-green-800"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  // ── Empty State ───────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Inbox className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="font-bold text-gray-800 mb-1">Belum Ada Riwayat</h3>
        <p className="text-sm text-gray-400 max-w-xs">
          Mulai scan sampah untuk melihat riwayat dan insight di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Grid Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            {/* Thumbnail */}
            <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
              <Image
                src={item.image_url}
                alt="Riwayat scan"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {item.danger_level && (
                <span
                  className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${dangerBadgeClass(
                    item.danger_level
                  )}`}
                >
                  {item.danger_level}
                </span>
              )}
            </div>

            {/* Konten */}
            <div className="p-4">
              <p className="text-[11px] text-gray-400 flex items-center gap-1.5 mb-2">
                <Clock className="w-3 h-3" />
                {formatDate(item.created_at)}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {item.detected_objects.slice(0, 3).map((name, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold text-green-800 bg-green-50 px-2 py-1 rounded-md capitalize"
                  >
                    {name.replace(/_/g, " ")}
                  </span>
                ))}
                {item.detected_objects.length > 3 && (
                  <span className="text-xs font-semibold text-gray-400 px-2 py-1">
                    +{item.detected_objects.length - 3}
                  </span>
                )}
              </div>

              {item.is_recyclable !== null && (
                <p className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                  <Recycle
                    className={`w-3.5 h-3.5 ${
                      item.is_recyclable ? "text-green-600" : "text-gray-400"
                    }`}
                  />
                  {item.is_recyclable ? "Bisa Didaur Ulang" : "Sulit Didaur Ulang"}
                </p>
              )}

              <button
                onClick={() => setSelectedItem(item)}
                className="w-full flex items-center justify-center gap-2 bg-green-800 hover:bg-green-700 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Lihat Insight
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            // Tampilkan maksimal 5 nomor halaman di sekitar halaman aktif
            if (
              totalPages > 7 &&
              pageNum !== 1 &&
              pageNum !== totalPages &&
              Math.abs(pageNum - page) > 1
            ) {
              if (pageNum === 2 || pageNum === totalPages - 1) {
                return (
                  <span key={pageNum} className="text-gray-300 text-sm px-1">
                    …
                  </span>
                );
              }
              return null;
            }

            return (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
                  pageNum === page
                    ? "bg-green-800 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <p className="text-center text-xs text-gray-400">
        Menampilkan {items.length} dari {total} riwayat
      </p>

      {/* Modal Insight (reuse ResultModal yang sudah ada) */}
      <AnimatePresence>
        {selectedItem && (
          <ResultModal
            isOpen={!!selectedItem}
            onClose={() => setSelectedItem(null)}
            scanData={historyItemToScanData(selectedItem)}
            insightData={historyItemToInsightData(selectedItem)}
            isLoadingInsight={false}
          />
        )}
      </AnimatePresence>
    </div>
  );
}