"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BankSampah } from "@/app/service/api";

// Fix ikon default Leaflet yang hilang saat pakai webpack/Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Ikon marker hijau untuk bank sampah
const bankIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Ikon marker biru untuk lokasi user
const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Props {
  banks: BankSampah[];
  userLocation: { lat: number; lng: number };
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function BankSampahMap({ banks, userLocation, selectedId, onSelect }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<number, L.Marker>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Inisialisasi peta sekali saja
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [userLocation.lat, userLocation.lng],
      zoom: 14,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Marker lokasi user
    L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(map)
      .bindPopup(
        `<div style="font-family:sans-serif;font-size:12px">
          <strong>📍 Lokasi Kamu</strong>
        </div>`
      );

    // Marker setiap bank sampah
    banks.forEach((bank) => {
      const marker = L.marker([bank.lat, bank.lng], { icon: bankIcon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:sans-serif;font-size:12px;min-width:180px">
            <span style="display:inline-block;background:#f0fdf4;color:#15803d;font-size:10px;padding:2px 6px;font-weight:bold;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.1em">${bank.category}</span>
            <br/>
            <strong style="font-size:13px;color:#1a1a1a">${bank.name}</strong>
            <p style="color:#6b7280;margin:4px 0 8px">${bank.address}</p>
            <a href="${bank.google_maps_url}" target="_blank" style="background:#166534;color:white;padding:5px 10px;font-size:11px;text-decoration:none;font-weight:bold;display:inline-block">
              Buka Google Maps ↗
            </a>
          </div>`
        );

      marker.on("click", () => {
        onSelect(bank.id);
      });

      markersRef.current[bank.id] = marker;
    });

    // Sesuaikan tampilan peta agar semua marker terlihat
    if (banks.length > 0) {
      const allCoords: L.LatLngTuple[] = [
        [userLocation.lat, userLocation.lng],
        ...banks.map((b): L.LatLngTuple => [b.lat, b.lng]),
      ];
      map.fitBounds(L.latLngBounds(allCoords), { padding: [40, 40] });
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pan & buka popup ketika selectedId berubah (dari klik card)
  useEffect(() => {
    if (!mapRef.current || selectedId === null) return;
    const marker = markersRef.current[selectedId];
    if (!marker) return;

    mapRef.current.setView(marker.getLatLng(), 16, { animate: true });
    marker.openPopup();
  }, [selectedId]);

  return <div ref={containerRef} className="w-full h-full" />;
}