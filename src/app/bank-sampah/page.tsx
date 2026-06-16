"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import { bankSampahList } from "@/constants/BankSampahData";

import BankSampahHeader from "@/components/bank-sampah/BankSampahHeader";
import BankSampahControls from "@/components/bank-sampah/BankSampahControls";
import BankSampahList from "@/components/bank-sampah/BankSampahList";
import { UI_BankSampah } from "@/types/BankSampah";
import EmptyState from "@/components/bank-sampah/EmptyState";

const MapView = dynamic(() => import("@/components/BankSampahMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-2xl border border-black/5">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-green-700 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-black/40 tracking-widest uppercase font-bold">Memuat Peta</p>
      </div>
    </div>
  ),
});

type Status = "idle" | "requesting" | "loading" | "success" | "error" | "denied" | "not_found";

// Fungsi Haversine untuk menghitung jarak (dalam KM) antar dua koordinat
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export default function BankSampahPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [results, setResults] = useState<UI_BankSampah[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [radius, setRadius] = useState<number>(5);
  
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const fetchNearbyLocal = useCallback((lat: number, lng: number, r: number) => {
    setStatus("loading");
    
    setTimeout(() => {
      const filtered = bankSampahList
        .filter((bank) => {
          const dist = getDistance(lat, lng, bank.latitude, bank.longitude);
          return dist <= r;
        })
        .map((bank) => ({
          id: bank.id,
          name: bank.nama,
          address: bank.alamat,
          category: "Pusat Daur Ulang",
          // PEMBARUAN DI SINI: Gunakan lat dan lng agar peta Leaflet tidak error
          lat: bank.latitude,
          lng: bank.longitude,
          phone: "Belum tersedia",
          opening_hours: "08:00 - 15:00",
          google_maps_url: `https://www.google.com/maps/search/?api=1&query=${bank.latitude},${bank.longitude}`
        }));

      if (filtered.length === 0) {
        setStatus("not_found");
      } else {
        setResults(filtered);
        setSelectedId(filtered[0].id);
        setStatus("success");
      }
    }, 600);
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("error");
      setErrorMsg("Browser kamu tidak mendukung geolokasi.");
      return;
    }

    setStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        fetchNearbyLocal(latitude, longitude, radius);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setStatus("denied");
        } else {
          setStatus("error");
          setErrorMsg("Gagal mendapatkan lokasi. Pastikan GPS menyala.");
        }
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, [radius, fetchNearbyLocal]);

  useEffect(() => {
    if (selectedId !== null && cardRefs.current[selectedId]) {
      cardRefs.current[selectedId]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedId]);

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    if (userLocation) {
      fetchNearbyLocal(userLocation.lat, userLocation.lng, newRadius);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F4] font-sans">
      <Navbar />
      <BankSampahHeader />
      <BankSampahControls 
        radius={radius} 
        onRadiusChange={handleRadiusChange} 
        onRequestLocation={requestLocation} 
        status={status} 
        resultCount={results.length} 
      />

      {status === "idle" && (
        <EmptyState icon="📍" title="Aktifkan Lokasi" desc='Klik tombol "Izinkan Lokasi & Cari" untuk mulai mencari bank sampah terdekat dari posisimu.' />
      )}
      {status === "denied" && (
        <EmptyState icon="🔒" title="Akses Lokasi Ditolak" desc="Izinkan akses lokasi di pengaturan browser kamu, lalu klik tombol cari kembali." isError />
      )}
      {status === "not_found" && (
        <EmptyState icon="🗂️" title={`Tidak Ditemukan dalam ${radius} km`} desc="Coba perluas radius pencarian menjadi 10 km." />
      )}
      {status === "error" && (
        <EmptyState icon="⚠️" title="Terjadi Kesalahan" desc={errorMsg} isError />
      )}

      {status === "success" && results.length > 0 && (
        <main className="px-6 sm:px-10 lg:px-16 max-w-screen-xl mx-auto pb-16">
          <div className="flex flex-col lg:flex-row gap-8" style={{ height: "620px" }}>
            <BankSampahList 
              results={results} 
              selectedId={selectedId} 
              onSelect={setSelectedId} 
              cardRefs={cardRefs} 
            />
            
            <div className="flex-1 min-h-[400px] lg:min-h-0 border border-black/10 rounded-2xl overflow-hidden shadow-sm bg-white">
              {userLocation && (
                <MapView
                  banks={results} // Jika tipe UI_BankSampah[] dan BankSampah[] sudah sama, hapus "as any"
                  userLocation={userLocation}
                  selectedId={selectedId} // <-- Langsung masukkan tanpa casting ke number
                  onSelect={(id) => setSelectedId(id)} // <-- id dari MapView sudah pasti string
                />
              )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}