"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Axios from "axios";
import Navbar from "@/components/Navbar";
import { getNearbyFasilitas } from "@/app/service/api";
import { Fasilitas } from "@/types/BankSampah";

import BankSampahHeader from "@/components/bank-sampah/BankSampahHeader";
import BankSampahControls from "@/components/bank-sampah/BankSampahControls";
import BankSampahList from "@/components/bank-sampah/BankSampahList";
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

const RESULT_LIMIT = 100;
const AVAILABLE_RADII = [3, 5, 10, 25, 50];

function getErrorMessage(error: unknown): string {
  if (Axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
  }
  return "Gagal mengambil data bank sampah dari server.";
}

export default function BankSampahPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [results, setResults] = useState<Fasilitas[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [radius, setRadius] = useState<number>(5);

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const latestRequestId = useRef<number>(0);

  const fetchNearby = useCallback(async (lat: number, lng: number, searchRadius: number) => {
    const requestId = latestRequestId.current + 1;
    latestRequestId.current = requestId;

    setStatus("loading");
    setErrorMsg("");

    try {
      const response = await getNearbyFasilitas({ lat, lng, radiusKm: searchRadius, limit: RESULT_LIMIT });
      if (requestId !== latestRequestId.current) return;

      setTotalCount(response.total);
      if (response.count === 0) {
        setResults([]);
        setSelectedId(null);
        setStatus("not_found");
        return;
      }

      setResults(response.data);
      setSelectedId(response.data[0].id);
      setStatus("success");
    } catch (error) {
      if (requestId !== latestRequestId.current) return;
      setResults([]);
      setTotalCount(0);
      setSelectedId(null);
      setErrorMsg(getErrorMessage(error));
      setStatus("error");
    }
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
        fetchNearby(latitude, longitude, radius);
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
  }, [radius, fetchNearby]);

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
      fetchNearby(userLocation.lat, userLocation.lng, newRadius);
    }
  };

  const nextRadius = AVAILABLE_RADII.find((value) => value > radius) ?? radius;

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
        totalCount={totalCount}
      />

      {status === "idle" && (
        <EmptyState icon="📍" title="Aktifkan Lokasi" desc='Klik tombol "Izinkan Lokasi & Cari" untuk mulai mencari bank sampah terdekat dari posisimu.' />
      )}
      {status === "denied" && (
        <EmptyState icon="🔒" title="Akses Lokasi Ditolak" desc="Izinkan akses lokasi di pengaturan browser kamu, lalu klik tombol cari kembali." isError />
      )}
      {status === "not_found" && (
        <EmptyState icon="🗂️" title={`Tidak Ditemukan dalam ${radius} km`} desc={`Data bank sampah terdekat di radii ini belum tersedia. Coba perluas radius pencarian menjadi ${nextRadius} km.`} />
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
                  banks={results}
                  userLocation={userLocation}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}