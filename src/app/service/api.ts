import Axios from "axios";
import { InsightResponse, ScanHistoryItem, ScanHistoryPage, ScanResponse, WasteInsightData } from "@/types/scan";
import { FasilitasNearbyParams, FasilitasNearbyResponse } from "@/types/BankSampah";
import {
  CreateProductPayload,
  CreateShopPayload,
  DashboardStats,
  ProductItem,
  MarketplaceProductApi,
  MarketplaceProductPageApi,
  ShopData,
  UpdateShopPayload,
  UpdateProductPayload,
} from "@/types/marketplace";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const api = Axios.create({ baseURL: `${BASE_URL}/api`, withCredentials: true });

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
}

export interface RegisterPayload {
  email: string;
  name: string;
  password: string;
}

export interface RegistrationResponse {
  message: string;
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

export async function loginWithEmail(email: string, password: string): Promise<AuthUser> {
  try {
    const response = await api.post<AuthUser>("/auth/login", { email, password });
    return response.data;
  } catch (error: unknown) {
    const message = Axios.isAxiosError(error) ? error.response?.data?.detail : undefined;
    throw new Error(message || "Tidak dapat masuk. Coba lagi beberapa saat.");
  }
}

export async function registerWithEmail(payload: RegisterPayload): Promise<RegistrationResponse> {
  try {
    const response = await api.post<RegistrationResponse>("/auth/register", payload);
    return response.data;
  } catch (error: unknown) {
    const message = Axios.isAxiosError(error) ? error.response?.data?.detail : undefined;
    throw new Error(message || "Tidak dapat membuat akun. Coba lagi beberapa saat.");
  }
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

export async function getMyShop(): Promise<ShopData | null> {
  try {
    const response = await api.get<ShopData | null>("/shops/me");
    return response.data;
  } catch {
    return null;
  }
}

export async function createShop(payload: CreateShopPayload): Promise<ShopData> {
  try {
    const response = await api.post<ShopData>("/shops", payload);
    return response.data;
  } catch (error: unknown) {
    const message = Axios.isAxiosError(error) ? error.response?.data?.detail : undefined;
    throw new Error(message || "Gagal membuat toko. Silakan coba lagi.");
  }
}

async function uploadMarketplaceImage(path: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await api.post<{ image_url: string }>(path, formData);
    return response.data.image_url;
  } catch (error: unknown) {
    const message = Axios.isAxiosError(error) ? error.response?.data?.detail : undefined;
    throw new Error(message || "Gagal mengunggah gambar.");
  }
}

export function uploadShopImage(file: File): Promise<string> {
  return uploadMarketplaceImage("/shops/images", file);
}

export async function updateShop(payload: UpdateShopPayload): Promise<ShopData> {
  try {
    const response = await api.patch<ShopData>("/shops/me", payload);
    return response.data;
  } catch (error: unknown) {
    const message = Axios.isAxiosError(error) ? error.response?.data?.detail : undefined;
    throw new Error(message || "Gagal memperbarui informasi toko.");
  }
}

export async function uploadProductImage(file: File): Promise<string> {
  return uploadMarketplaceImage("/shops/me/products/upload", file);
}

export async function getMarketplaceProducts(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
}): Promise<MarketplaceProductPageApi> {
  const response = await api.get<MarketplaceProductPageApi>("/products", {
    params: {
      page: params?.page ?? 1,
      page_size: params?.pageSize ?? 48,
      search: params?.search || undefined,
      category: params?.category && params.category !== "Semua" ? params.category : undefined,
    },
  });
  return response.data;
}

export async function getMarketplaceProduct(slug: string): Promise<MarketplaceProductApi | null> {
  try {
    const response = await api.get<MarketplaceProductApi>(`/products/${encodeURIComponent(slug)}`);
    return response.data;
  } catch (error: unknown) {
    if (Axios.isAxiosError(error) && error.response?.status === 404) return null;
    throw error;
  }
}

export async function getShopDashboardStats(): Promise<DashboardStats> {
  const response = await api.get<DashboardStats>("/shops/me/dashboard");
  return response.data;
}

export async function getMyProducts(search?: string, isActive?: boolean): Promise<ProductItem[]> {
  const params: Record<string, string | boolean> = {};
  if (search) params.search = search;
  if (isActive !== undefined) params.is_active = isActive;
  const response = await api.get<ProductItem[]>("/shops/me/products", { params });
  return response.data;
}

export async function getMyProductById(id: string): Promise<ProductItem> {
  const response = await api.get<ProductItem>(`/shops/me/products/${id}`);
  return response.data;
}

export async function createProduct(payload: CreateProductPayload): Promise<ProductItem> {
  try {
    const response = await api.post<ProductItem>("/shops/me/products", payload);
    return response.data;
  } catch (error: unknown) {
    const message = Axios.isAxiosError(error) ? error.response?.data?.detail : undefined;
    throw new Error(message || "Gagal menyimpan produk baru.");
  }
}

export async function updateProduct(id: string, payload: UpdateProductPayload): Promise<ProductItem> {
  try {
    const response = await api.put<ProductItem>(`/shops/me/products/${id}`, payload);
    return response.data;
  } catch (error: unknown) {
    const message = Axios.isAxiosError(error) ? error.response?.data?.detail : undefined;
    throw new Error(message || "Gagal memperbarui produk.");
  }
}

export async function toggleProductActive(id: string, isActive: boolean): Promise<ProductItem> {
  const response = await api.patch<ProductItem>(`/shops/me/products/${id}/toggle-active`, {
    is_active: isActive,
  });
  return response.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/shops/me/products/${id}`);
}

export interface ShippingProvince {
  province_id: string;
  province: string;
}

export interface ShippingCity {
  city_id: string;
  province_id: string;
  province: string;
  type: string;
  city_name: string;
  postal_code: string;
}

export interface ShippingCostOption {
  service: string;
  description: string;
  cost: Array<{
    value: number;
    etd: string;
    note: string;
  }>;
}

export interface ShippingCourierResult {
  code: string;
  name: string;
  costs: ShippingCostOption[];
}

export interface CheckoutPayload {
  items: Array<{
    product_id: string;
    quantity: number;
  }>;
  recipient_name: string;
  recipient_phone: string;
  shipping_address: string;
  shipping_province: string;
  shipping_city: string;
  shipping_postal_code?: string;
  courier: string;
  courier_service: string;
  shipping_cost: number;
  notes?: string;
}

export interface OrderDetail {
  id: string;
  order_number: string;
  status: string;
  total_product_amount: number;
  shipping_cost: number;
  total_amount: number;
  courier: string;
  courier_service: string;
  recipient_name: string;
  recipient_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_province: string;
  shipping_postal_code?: string;
  notes?: string;
  snap_token?: string;
  snap_redirect_url?: string;
  payment_type?: string;
  tracking_number?: string;
  paid_at?: string;
  shipped_at?: string;
  completed_at?: string;
  created_at: string;
  items: Array<{
    id: string;
    product_id: string;
    product_name: string;
    product_image?: string;
    price: number;
    quantity: number;
    subtotal: number;
  }>;
}

export interface BackendReview {
  id: string;
  order_id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string | null;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ReviewEligibility {
  can_review: boolean;
  order_id?: string | null;
  message: string;
}

export async function getShippingProvinces(): Promise<ShippingProvince[]> {
  const response = await api.get<ShippingProvince[]>("/shipping/provinces");
  return response.data;
}

export async function getShippingCities(provinceId?: string): Promise<ShippingCity[]> {
  const response = await api.get<ShippingCity[]>("/shipping/cities", {
    params: provinceId ? { province_id: provinceId } : undefined,
  });
  return response.data;
}

export async function calculateShippingCost(payload: {
  origin_city_id?: string;
  destination_city_id: string;
  weight_grams?: number;
  courier: string;
}): Promise<ShippingCourierResult[]> {
  const response = await api.post<ShippingCourierResult[]>("/shipping/cost", payload);
  return response.data;
}

export async function createCheckoutOrder(payload: CheckoutPayload): Promise<OrderDetail> {
  try {
    const response = await api.post<OrderDetail>("/orders/checkout", payload);
    return response.data;
  } catch (error: unknown) {
    const message = Axios.isAxiosError(error) ? error.response?.data?.detail : undefined;
    throw new Error(message || "Gagal membuat pesanan checkout.");
  }
}

export async function getMyOrders(): Promise<OrderDetail[]> {
  const response = await api.get<OrderDetail[]>("/orders/me");
  return response.data;
}

export async function markOrderPaid(orderId: string): Promise<OrderDetail> {
  const response = await api.post<OrderDetail>(`/orders/${orderId}/mark-paid`);
  return response.data;
}

export async function completeOrder(orderId: string): Promise<OrderDetail> {
  try {
    const response = await api.post<OrderDetail>(`/orders/${orderId}/complete`);
    return response.data;
  } catch (error: unknown) {
    const message = Axios.isAxiosError(error) ? error.response?.data?.detail : undefined;
    throw new Error(message || "Gagal menyelesaikan pesanan.");
  }
}

export async function getShopOrders(statusFilter?: string): Promise<OrderDetail[]> {
  const response = await api.get<OrderDetail[]>("/orders/shop/me", {
    params: statusFilter ? { status_filter: statusFilter } : undefined,
  });
  return response.data;
}

export async function shipShopOrder(orderId: string, trackingNumber: string): Promise<OrderDetail> {
  try {
    const response = await api.post<OrderDetail>(`/orders/shop/me/${orderId}/ship`, {
      tracking_number: trackingNumber,
    });
    return response.data;
  } catch (error: unknown) {
    const message = Axios.isAxiosError(error) ? error.response?.data?.detail : undefined;
    throw new Error(message || "Gagal memperbarui status pengiriman pesanan.");
  }
}

export async function getProductReviews(productId: string): Promise<BackendReview[]> {
  const response = await api.get<BackendReview[]>(`/products/${productId}/reviews`);
  return response.data;
}

export async function checkReviewEligibility(productId: string): Promise<ReviewEligibility> {
  const response = await api.get<ReviewEligibility>(`/products/${productId}/review-eligibility`);
  return response.data;
}

export async function submitProductReview(
  productId: string,
  payload: { order_id: string; rating: number; comment: string }
): Promise<BackendReview> {
  try {
    const response = await api.post<BackendReview>(`/products/${productId}/reviews`, payload);
    return response.data;
  } catch (error: unknown) {
    const message = Axios.isAxiosError(error) ? error.response?.data?.detail : undefined;
    throw new Error(message || "Gagal mengirimkan ulasan produk.");
  }
}
