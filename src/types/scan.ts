// types/scan.ts

export interface DetectionDetail {
  className: string;
  confidence: number;
  box: number[];
}

export interface ScanSuccessResponse {
  status: "success";
  message: string;
  image_url: string;
  totalDetected: number;
  detected_class_names: string[];
  allDetections: DetectionDetail[];
}

export interface ScanErrorResponse {
  status: "error" | "not_found";
  message: string;
}

export interface IdeDaurUlang {
  judul_ide: string;
  bahan_bahan: string[];
  tahapan_pembuatan: string[];
}


// ssjjssjjss

// Tambahkan ini di file types yang sudah kamu buat sebelumnya
export interface WasteInsightData {
  ringkasan_bahaya: string;
  cara_buang: string;
  ide_daur_ulang: IdeDaurUlang[];
  fakta_menarik: string;
  tingkat_bahaya: "rendah" | "sedang" | "tinggi";
  dapat_didaur_ulang: boolean;
}

export interface InsightResponse {
  status: "success" | "error";
  message?: string;
  data: WasteInsightData | null;
}

// Union type untuk memfasilitasi semua kemungkinan respons
export type ScanResponse = ScanSuccessResponse | ScanErrorResponse;

// ─── Riwayat Scan (Supabase: table scan_histories) ────────────────────────────

export interface ScanHistoryItem {
  id: string;
  user_id: string;
  image_url: string;
  detected_objects: string[];
  danger_level: "rendah" | "sedang" | "tinggi" | null;
  is_recyclable: boolean | null;
  insight_summary: string | null;
  full_insight_data: WasteInsightData | null;
  created_at: string;
}

export interface ScanHistoryPage {
  data: ScanHistoryItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Adapter: ubah satu row riwayat menjadi bentuk yang dipahami ResultModal
// (allDetections tanpa confidence karena tabel hanya menyimpan nama objek)
export function historyItemToScanData(item: ScanHistoryItem): ScanSuccessResponse {
  return {
    status: "success",
    message: "Dimuat dari riwayat",
    image_url: item.image_url,
    totalDetected: item.detected_objects.length,
    detected_class_names: item.detected_objects,
    allDetections: item.detected_objects.map((className) => ({
      className,
      confidence: 0,
      box: [],
    })),
  };
}

export function historyItemToInsightData(item: ScanHistoryItem): WasteInsightData | null {
  return item.full_insight_data ?? null;
}