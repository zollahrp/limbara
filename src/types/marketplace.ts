export type MarketplaceCategory = string;

export interface MarketplaceShop {
  id?: string;
  slug?: string;
  name: string;
  city: string;
  province?: string;
  logoUrl?: string;
  isVerified?: boolean;
  rating: number;
  totalProducts: number;
  joinedYear: number;
}

export interface MarketplaceProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  material: string;
  price: number;
  previousPrice?: number;
  image: string;
  images: string[];
  shortDescription: string;
  description: string;
  stock: number;
  sold: number;
  rating: number;
  reviewCount: number;
  weightGrams: number;
  dimensions: string;
  productionTime: string;
  impact: string;
  features: string[];
  shop: MarketplaceShop;
}

export interface ShopData {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description?: string | null;
  waste_focus?: string | null;
  province: string;
  city: string;
  district?: string | null;
  address: string;
  postal_code?: string | null;
  phone_number: string;
  email?: string | null;
  courier_options?: string[] | null;
  logo_url?: string | null;
  banner_url?: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateShopPayload {
  name: string;
  description?: string;
  waste_focus?: string;
  province: string;
  city: string;
  district?: string;
  address: string;
  postal_code?: string;
  phone_number: string;
  email?: string;
  courier_options?: string[];
  logo_url: string;
}

export type UpdateShopPayload = Partial<CreateShopPayload>;

export interface ProductItem {
  id: string;
  shop_id: string;
  name: string;
  slug: string;
  category: string;
  waste_material: string;
  price: number;
  previous_price?: number | null;
  stock: number;
  image_url: string;
  images?: string[] | null;
  short_description?: string | null;
  description?: string | null;
  weight_grams: number;
  dimensions?: string | null;
  production_time?: string | null;
  impact?: string | null;
  is_active: boolean;
  sold_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProductPayload {
  name: string;
  category: string;
  waste_material: string;
  price: number;
  previous_price?: number;
  stock: number;
  image_url: string;
  images?: string[];
  short_description?: string;
  description?: string;
  weight_grams?: number;
  dimensions?: string;
  production_time?: string;
  impact?: string;
  is_active?: boolean;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

export interface MarketplaceShopApi {
  id: string;
  slug: string;
  name: string;
  city: string;
  province: string;
  logo_url?: string | null;
  is_verified: boolean;
  total_products: number;
  created_at: string;
}

export interface MarketplaceProductApi extends ProductItem {
  shop: MarketplaceShopApi;
}

export interface MarketplaceProductPageApi {
  items: MarketplaceProductApi[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface DashboardStats {
  total_products: number;
  active_products: number;
  inactive_products: number;
  total_stock: number;
  total_sold: number;
  shop_name: string;
  shop_slug: string;
  waste_focus?: string | null;
  city: string;
}
