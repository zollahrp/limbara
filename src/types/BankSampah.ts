export interface BankSampahControlsProps {
  radius: number;
  onRadiusChange: (r: number) => void;
  onRequestLocation: () => void;
  status: string;
  resultCount: number;
}

export interface UI_BankSampah {
  id: string;
  name: string;
  address: string;
  category: string;
  lat: number;          
  lng: number;          
  phone?: string;
  opening_hours?: string; 
  website?: string;
  google_maps_url: string;
}

export interface BankSampahListProps {
  results: UI_BankSampah[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  cardRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}