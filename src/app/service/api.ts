// service/api.ts
import Axios from "axios";
import { ScanResponse, InsightResponse } from "@/types/scan";

// Gunakan environment variable jika ada, fallback ke localhost
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function ScanImage(image: File): Promise<ScanResponse> {
  try {
    const formData = new FormData();
    // 'file' harus sesuai dengan nama parameter di FastAPI: async def process_image_and_detect(file: UploadFile)
    formData.append("file", image);

    // Pastikan ada garis miring '/' sebelum path endpoint
    const response = await Axios.post<ScanResponse>(`${BASE_URL}/api/scan`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const data = response.data;

    // 1. JIKA BERHASIL MENDETEKSI OBJEK (YOLO / Gemini)
    if (data.status === "success" && "allDetections" in data && data.allDetections.length > 0) {
      // Deduplikasi: hanya simpan detection dengan confidence tertinggi per className
      const deduplicatedDetections = Array.from(
        data.allDetections.reduce((map, detection) => {
          const existing = map.get(detection.className);
          if (!existing || detection.confidence > existing.confidence) {
            map.set(detection.className, detection);
          }
          return map;
        }, new Map()).values()
      );

      // Urutkan dari confidence paling tinggi ke rendah
      const sortedDetections = deduplicatedDetections.sort(
        (a, b) => b.confidence - a.confidence
      );

      const uniqueClassNames = Array.from(new Set(sortedDetections.map(d => d.className)));

      return {
        status: "success",
        message: data.message,
        image_url: data.image_url,
        totalDetected: uniqueClassNames.length,
        detected_class_names: uniqueClassNames,
        allDetections: sortedDetections,
      };
    }

    // 2. JIKA API MERESPONS 'NOT FOUND'
    if (data.status === "not_found" || ("allDetections" in data && data.allDetections?.length === 0)) {
      return {
        status: "not_found",
        message: data.message || "Tidak ada sampah yang terdeteksi pada gambar.",
      };
    }

    // 3. JIKA API MERESPONS 'ERROR' (Misal: YOLO gagal dimuat / Gemini Overload)
    if (data.status === "error") {
      return {
        status: "error",
        message: data.message || "Terjadi kesalahan sistem di server.",
      };
    }

    throw new Error("Respons tidak valid dari server.");
  } catch (error: any) {
    console.error("Error detecting waste:", error);
    
    // Alih-alih throw error yang bisa membuat aplikasi Next.js crash (Red Screen),
    // kita kembalikan status "error" agar komponen UI bisa menampilkannya dengan elegan.
    return {
      status: "error",
      message: error?.response?.data?.message || "Gagal terhubung ke server. Pastikan backend FastAPI sedang berjalan.",
    };
  }
}

export async function GetWasteInsight(detectedClasses: string[]): Promise<InsightResponse> {
  try {
    const payload = {
      detected_classes: detectedClasses,
    };

    const response = await Axios.post<InsightResponse>(`${BASE_URL}/api/insight`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = response.data;

    // Jika backend berhasil memberikan insight
    if (data.status === "success" && data.data) {
      return {
        status: "success",
        data: data.data,
      };
    }

    // Jika terjadi error dari blok except di Python
    if (data.status === "error") {
      return {
        status: "error",
        message: data.message || "Gagal mendapatkan insight dari AI.",
        data: null,
      };
    }

    throw new Error("Format respons insight tidak dikenali.");
  } catch (error: any) {
    console.error("Error fetching insight:", error);
    
    return {
      status: "error",
      message: error?.response?.data?.message || "Koneksi ke server gagal saat mengambil insight edukasi.",
      data: null,
    };
  }
}

// ─── Tambahan untuk app/service/api.ts ────────────────────────────────────────
// Sisipkan import & fungsi berikut ke dalam file api.ts yang sudah ada.

import { createClient } from "@/utils/supabase/client";
import { ScanHistoryItem, ScanHistoryPage } from "@/types/scan";


export async function getScanHistories(
  page: number = 1,
  pageSize: number = 9
): Promise<ScanHistoryPage> {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return { data: [], total: 0, page, pageSize, totalPages: 0 };
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("scan_histories")
    .select("*", { count: "exact" })
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  const total = count ?? 0;

  return {
    data: (data ?? []) as ScanHistoryItem[],
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

/**
 * Mengambil satu riwayat scan berdasarkan ID (opsional, untuk deep-link).
 */
export async function getScanHistoryById(id: string): Promise<ScanHistoryItem | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("scan_histories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data as ScanHistoryItem;
}