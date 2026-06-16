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

// const api = Axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   timeout: 30000, // 30 detik (Overpass API bisa lambat)
// });

// // ─── Tipe Data ────────────────────────────────────────────────────────────────

// export interface BankSampah {
//   id: number;
//   name: string;
//   category: string;
//   address: string;
//   lat: number;
//   lng: number;
//   phone: string | null;
//   opening_hours: string | null;
//   website: string | null;
//   google_maps_url: string;
// }

// export interface BankSampahResponse {
//   status: string;
//   message: string;
//   found: boolean;
//   total: number;
//   radius_km: number;
//   user_location: {
//     lat: number;
//     lng: number;
//   };
//   data: BankSampah[];
// }

// // ─── Fungsi API ───────────────────────────────────────────────────────────────

// export async function getNearbyBankSampah(
//   lat: number,
//   lng: number,
//   radius: number = 3
// ): Promise<BankSampahResponse> {
//   const response = await api.get<BankSampahResponse>("/api/bank-sampah/nearby", {
//     params: { lat, lng, radius },
//   });
//   return response.data;
// }