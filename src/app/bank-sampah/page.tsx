"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import {
  getNearbyBankSampah,
  BankSampah,
  BankSampahResponse,
} from "@/app/service/api";

// Leaflet hanya bisa dipakai di client-side
const MapView = dynamic(() => import("@/components/BankSampahMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-green-700 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400 tracking-widest uppercase">Memuat Peta</p>
      </div>
    </div>
  ),
});

type Status = "idle" | "requesting" | "loading" | "success" | "error" | "denied" | "not_found";

export default function BankSampahPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [results, setResults] = useState<BankSampah[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [radius, setRadius] = useState<number>(3);
  const [radiusKm, setRadiusKm] = useState<number>(3);
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const fetchNearby = useCallback(
    async (lat: number, lng: number, r: number) => {
      setStatus("loading");
      try {
        const res: BankSampahResponse = await getNearbyBankSampah(lat, lng, r);
        setRadiusKm(res.radius_km);
        if (!res.found || res.data.length === 0) {
          setStatus("not_found");
        } else {
          setResults(res.data);
          setSelectedId(res.data[0].id);
          setStatus("success");
        }
      } catch (err: any) {
        setStatus("error");
        if (err.code === "ECONNABORTED" || err.message.includes("timeout")) {
            setErrorMsg("Pencarian terlalu lama (Timeout). Area ini terlalu padat atau server peta sedang sibuk.");
        } else {
            setErrorMsg("Gagal mengambil data dari server. Pastikan backend sudah berjalan.");
        }
        }
    },
    []
  );

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
          setErrorMsg("Gagal mendapatkan lokasi. Coba lagi.");
        }
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, [radius, fetchNearby]);

  // Auto-scroll ke card yang dipilih dari peta
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
        // HAPUS syarat status === "success".
        // Selama kita sudah punya koordinat (userLocation), izinkan fetch ulang
        if (userLocation) {
        fetchNearby(userLocation.lat, userLocation.lng, newRadius);
        }
    };

  const selectedBank = results.find((b) => b.id === selectedId) ?? null;

  return (
    <div className="min-h-screen bg-[#F7F8F4] font-sans">
      <Navbar />

      {/* ── Hero Header ─────────────────────────────────────────── */}
      <header className="pt-32 pb-10 px-6 sm:px-10 lg:px-16 max-w-screen-xl mx-auto">
        <p className="text-xs uppercase tracking-[0.35em] text-green-700 font-bold mb-3">
          Limbara · Komunitas
        </p>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight max-w-xl">
          Bank Sampah
          <br />
          <span className="text-green-700">Terdekat</span>
        </h1>
        <p className="mt-4 text-gray-500 max-w-md leading-relaxed">
          Temukan lokasi bank sampah dan pusat daur ulang di sekitar kamu. Data bersumber
          dari OpenStreetMap.
        </p>
      </header>

      {/* ── Kontrol Pencarian ───────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-16 max-w-screen-xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Radius selector */}
          <div className="flex items-center gap-3 bg-white border border-gray-200 px-4 py-3 shadow-sm">
            <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">
              Radius
            </span>
            {[3, 4, 5].map((r) => (
              <button
                key={r}
                onClick={() => handleRadiusChange(r)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                  radius === r
                    ? "bg-green-800 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {r} km
              </button>
            ))}
          </div>

          {/* Tombol Cari */}
          <button
            onClick={requestLocation}
            disabled={status === "requesting" || status === "loading"}
            className="flex items-center gap-3 bg-green-800 hover:bg-green-700 disabled:bg-green-900/50 text-white px-8 py-3 text-xs font-bold uppercase tracking-[0.25em] transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            {status === "requesting" || status === "loading" ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {status === "requesting" ? "Meminta Lokasi..." : "Mencari..."}
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {status === "success" ? "Perbarui Lokasi" : "Izinkan Lokasi & Cari"}
              </>
            )}
          </button>

          {/* Status badge setelah sukses */}
          {status === "success" && (
            <p className="text-xs text-gray-400 tracking-wide">
              Ditemukan{" "}
              <span className="text-green-700 font-bold">{results.length} lokasi</span>{" "}
              dalam radius {radiusKm} km
            </p>
          )}
        </div>
      </section>

      {/* ── State: Idle ─────────────────────────────────────────── */}
      {status === "idle" && (
        <EmptyState
          icon="📍"
          title="Aktifkan Lokasi"
          desc='Klik tombol "Izinkan Lokasi & Cari" untuk mulai mencari bank sampah terdekat.'
        />
      )}

      {/* ── State: Denied ───────────────────────────────────────── */}
      {status === "denied" && (
        <EmptyState
          icon="🔒"
          title="Akses Lokasi Ditolak"
          desc="Izinkan akses lokasi di pengaturan browser kamu, lalu klik tombol cari kembali."
          isError
        />
      )}

      {/* ── State: Not Found ────────────────────────────────────── */}
      {status === "not_found" && (
        <EmptyState
          icon="🗂️"
          title={`Tidak Ada Bank Sampah dalam Radius ${radiusKm} km`}
          desc="Coba perluas radius pencarian hingga 5 km, atau periksa koneksi internet kamu."
        />
      )}

      {/* ── State: Error ────────────────────────────────────────── */}
      {status === "error" && (
        <EmptyState icon="⚠️" title="Terjadi Kesalahan" desc={errorMsg} isError />
      )}

      {/* ── State: Success — Layout Split ───────────────────────── */}
      {status === "success" && results.length > 0 && (
        <main className="px-6 sm:px-10 lg:px-16 max-w-screen-xl mx-auto pb-16">
          <div className="flex flex-col lg:flex-row gap-6" style={{ height: "620px" }}>

            {/* ── Card List (kiri) ──────────────────────────────── */}
            <div className="lg:w-[380px] flex-shrink-0 overflow-y-auto pr-1 space-y-3 scrollbar-thin">
              {results.map((bank) => (
                <div
                  key={bank.id}
                  ref={(el) => { cardRefs.current[bank.id] = el; }}
                  onClick={() => setSelectedId(bank.id)}
                  className={`group cursor-pointer bg-white border-l-4 transition-all duration-200 shadow-sm hover:shadow-md p-5 ${
                    selectedId === bank.id
                      ? "border-green-700 shadow-md"
                      : "border-transparent hover:border-green-300"
                  }`}
                >
                  {/* Badge kategori */}
                  <span className="inline-block text-[10px] uppercase tracking-[0.25em] font-bold text-green-700 bg-green-50 px-2 py-1 mb-3">
                    {bank.category}
                  </span>

                  <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1 group-hover:text-green-800 transition-colors">
                    {bank.name}
                  </h3>

                  <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    {bank.address}
                  </p>

                  {/* Meta info */}
                  <div className="space-y-1 mb-4">
                    {bank.opening_hours && (
                      <p className="text-xs text-gray-500 flex items-center gap-2">
                        <span>🕐</span> {bank.opening_hours}
                      </p>
                    )}
                    {bank.phone && (
                      <p className="text-xs text-gray-500 flex items-center gap-2">
                        <span>📞</span> {bank.phone}
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <a
                    href={bank.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-white bg-green-800 hover:bg-green-700 px-4 py-2 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Buka di Google Maps
                  </a>
                </div>
              ))}
            </div>

            {/* ── Peta (kanan) ──────────────────────────────────── */}
            <div className="flex-1 min-h-[400px] lg:min-h-0 border border-gray-200 overflow-hidden shadow-sm">
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

// ─── Komponen EmptyState ──────────────────────────────────────────────────────
function EmptyState({
  icon,
  title,
  desc,
  isError = false,
}: {
  icon: string;
  title: string;
  desc: string;
  isError?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <span className="text-5xl mb-5">{icon}</span>
      <h2
        className={`text-lg font-bold mb-2 ${
          isError ? "text-red-700" : "text-gray-800"
        }`}
      >
        {title}
      </h2>
      <p className="text-sm text-gray-400 max-w-sm leading-relaxed">{desc}</p>
    </div>
  );
}