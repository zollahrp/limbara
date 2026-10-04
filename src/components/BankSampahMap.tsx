"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BankSampahMapProps, Fasilitas } from "@/types/BankSampah";
import { formatDistance, formatNumber } from "@/utils/format";
import { escapeHtml } from "@/utils/text";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const bankIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const FOCUS_ZOOM = 16;
const FIT_PADDING: [number, number] = [40, 40];

export default function BankSampahMap({ banks, userLocation, selectedId, onSelect }: BankSampahMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelect);
  const initialLocationRef = useRef(userLocation);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const { lat, lng } = initialLocationRef.current;
    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: 14,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current = {};
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(map)
      .bindPopup('<div style="font-family:sans-serif;font-size:12px"><strong>Lokasi Kamu</strong></div>');

    banks.forEach((bank) => {
      const marker = L.marker([bank.latitude, bank.longitude], { icon: bankIcon })
        .addTo(map)
        .bindPopup(buildPopup(bank));
      marker.on("click", () => onSelectRef.current(bank.id));
      markersRef.current[bank.id] = marker;
    });

    const coordinates: L.LatLngTuple[] = [
      [userLocation.lat, userLocation.lng],
      ...banks.map((bank): L.LatLngTuple => [bank.latitude, bank.longitude]),
    ];
    if (coordinates.length > 1) {
      map.fitBounds(L.latLngBounds(coordinates), { padding: FIT_PADDING });
    }
  }, [banks, userLocation.lat, userLocation.lng]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || selectedId === null) return;

    const marker = markersRef.current[selectedId];
    if (!marker) return;

    map.setView(marker.getLatLng(), FOCUS_ZOOM, { animate: true });
    marker.openPopup();
  }, [selectedId]);

  return <div ref={containerRef} className="w-full h-full" />;
}

function buildPopup(bank: Fasilitas): string {
  const region = [bank.regency, bank.province].filter(Boolean).join(", ");
  const wasteReceived = formatNumber(bank.waste_received);

  return [
    '<div style="font-family:sans-serif;font-size:12px;min-width:200px">',
    `<span style="display:inline-block;background:#f0fdf4;color:#15803d;font-size:10px;padding:2px 6px;font-weight:bold;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.1em">${escapeHtml(formatDistance(bank.distance_km))}</span>`,
    `<br/><strong style="font-size:13px;color:#1a1a1a">${escapeHtml(bank.name)}</strong>`,
    `<p style="color:#6b7280;margin:4px 0 2px">${escapeHtml(bank.address)}</p>`,
    region ? `<p style="color:#9ca3af;margin:0 0 4px">${escapeHtml(region)}</p>` : "",
    wasteReceived
      ? `<p style="color:#6b7280;margin:0 0 8px">Sampah ditampung ${escapeHtml(wasteReceived)} (${bank.year})</p>`
      : '<div style="height:8px"></div>',
    `<a href="${escapeHtml(bank.google_maps_url)}" target="_blank" rel="noopener noreferrer" style="background:#166534;color:white;padding:5px 10px;font-size:11px;text-decoration:none;font-weight:bold;display:inline-block">Buka Google Maps</a>`,
    "</div>",
  ].join("");
}