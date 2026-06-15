import Axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const api = Axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 detik (Overpass API bisa lambat)
});

// ─── Tipe Data ────────────────────────────────────────────────────────────────

export interface BankSampah {
  id: number;
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  phone: string | null;
  opening_hours: string | null;
  website: string | null;
  google_maps_url: string;
}

export interface BankSampahResponse {
  status: string;
  message: string;
  found: boolean;
  total: number;
  radius_km: number;
  user_location: {
    lat: number;
    lng: number;
  };
  data: BankSampah[];
}

// ─── Fungsi API ───────────────────────────────────────────────────────────────

export async function getNearbyBankSampah(
  lat: number,
  lng: number,
  radius: number = 3
): Promise<BankSampahResponse> {
  const response = await api.get<BankSampahResponse>("/api/bank-sampah/nearby", {
    params: { lat, lng, radius },
  });
  return response.data;
}