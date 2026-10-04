export interface Fasilitas {
  id: string;
  name: string;
  address: string;
  province: string;
  regency: string;
  managed_by: string;
  scope: string;
  latitude: number;
  longitude: number;
  waste_received: number | null;
  waste_managed: number | null;
  year: number;
  distance_km: number;
  google_maps_url: string;
}

export interface FasilitasNearbyResponse {
  data: Fasilitas[];
  total: number;
  count: number;
  radius_km: number;
}

export interface FasilitasNearbyParams {
  lat: number;
  lng: number;
  radiusKm: number;
  limit?: number;
}

export interface BankSampahControlsProps {
  radius: number;
  onRadiusChange: (r: number) => void;
  onRequestLocation: () => void;
  status: string;
  resultCount: number;
  totalCount: number;
}

export interface BankSampahListProps {
  results: Fasilitas[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  cardRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}

export interface BankSampahMapProps {
  banks: Fasilitas[];
  userLocation: { lat: number; lng: number };
  selectedId: string | null;
  onSelect: (id: string) => void;
}