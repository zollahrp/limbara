import Axios from "axios";
import { InsightResponse, ScanHistoryItem, ScanHistoryPage, ScanResponse, WasteInsightData } from "@/types/scan";
import { FasilitasNearbyParams, FasilitasNearbyResponse } from "@/types/BankSampah";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const api = Axios.create({ baseURL: `${BASE_URL}/api`, withCredentials: true });

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
}

export interface CreateScanHistoryPayload {
  image_url: string;
  detected_objects: string[];
  danger_level: WasteInsightData["tingkat_bahaya"];
  is_recyclable: boolean;
  insight_summary: string;
  full_insight_data: WasteInsightData;
}

export function loginWithGoogle() {
  const returnTo = encodeURIComponent(window.location.origin);
  window.location.assign(`${BASE_URL}/api/auth/google/login?return_to=${returnTo}`);
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const response = await api.get<AuthUser>("/auth/me");
    return response.data;
  } catch {
    return null;
  }
}

export async function logout() {
  await api.post("/auth/logout");
}

export async function ScanImage(image: File): Promise<ScanResponse> {
  try {
    const formData = new FormData();
    formData.append("file", image);
    const response = await api.post<ScanResponse>("/scan", formData);
    const data = response.data;

    if (data.status === "success" && data.allDetections.length > 0) {
      const detections = Array.from(
        data.allDetections.reduce((map, detection) => {
          const existing = map.get(detection.className);
          if (!existing || detection.confidence > existing.confidence) map.set(detection.className, detection);
          return map;
        }, new Map<string, (typeof data.allDetections)[number]>()).values(),
      ).sort((a, b) => b.confidence - a.confidence);

      return {
        ...data,
        totalDetected: new Set(detections.map((detection) => detection.className)).size,
        detected_class_names: Array.from(new Set(detections.map((detection) => detection.className))),
        allDetections: detections,
      };
    }

    if (data.status === "not_found") return data;
    return { status: "error", message: data.message || "Terjadi kesalahan sistem di server." };
  } catch (error: unknown) {
    const message = Axios.isAxiosError(error) ? error.response?.data?.detail : undefined;
    return { status: "error", message: message || "Gagal terhubung ke server." };
  }
}

export async function GetWasteInsight(detectedClasses: string[]): Promise<InsightResponse> {
  try {
    const response = await api.post<InsightResponse>("/insight", { detected_classes: detectedClasses });
    return response.data;
  } catch (error: unknown) {
    const message = Axios.isAxiosError(error) ? error.response?.data?.detail : undefined;
    return { status: "error", message: message || "Gagal mengambil insight edukasi.", data: null };
  }
}

export async function saveScanHistory(payload: CreateScanHistoryPayload): Promise<ScanHistoryItem> {
  const response = await api.post<ScanHistoryItem>("/histories", payload);
  return response.data;
}

export async function getScanHistories(page = 1, pageSize = 9): Promise<ScanHistoryPage> {
  const response = await api.get<ScanHistoryPage>("/histories", { params: { page, page_size: pageSize } });
  return response.data;
}

export async function getScanHistoryById(id: string): Promise<ScanHistoryItem | null> {
  try {
    const response = await api.get<ScanHistoryItem>(`/histories/${id}`);
    return response.data;
  } catch {
    return null;
  }
}

export async function sendChatMessage(message: string): Promise<string> {
  const response = await api.post<{ reply: string }>("/chat", { message });
  return response.data.reply;
}

export async function getNearbyFasilitas({ lat, lng, radiusKm, limit }: FasilitasNearbyParams): Promise<FasilitasNearbyResponse> {
  const response = await api.get<FasilitasNearbyResponse>("/fasilitas/nearby", {
    params: { lat, lng, radius_km: radiusKm, limit },
  });
  return response.data;
}
