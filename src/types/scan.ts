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