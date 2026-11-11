"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Phone,
  Mail,
  ShieldCheck,
  ChevronDown,
  Check,
  ImagePlus,
  Loader2,
} from "lucide-react";
import Swal from "sweetalert2";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createShop, getCurrentUser, getMyShop, uploadShopImage } from "@/app/service/api";
import { CreateShopPayload } from "@/types/marketplace";

interface RegionItem {
  id: string;
  name: string;
}

const MATERIAL_SUGGESTIONS = [
  { label: "Plastik PET (Botol)", tag: "Plastik PET" },
  { label: "Plastik HDPE (Tutup/Wadah)", tag: "Plastik HDPE" },
  { label: "Kardus & Kertas", tag: "Kardus & Kertas" },
  { label: "Kaca & Botol Beling", tag: "Kaca" },
  { label: "Logam & Kaleng Minuman", tag: "Logam" },
  { label: "Tekstil & Kain Perca", tag: "Tekstil Perca" },
  { label: "Limbah Kayu Palet", tag: "Kayu" },
  { label: "E-Waste (Elektronik)", tag: "E-Waste" },
];

const COURIER_OPTIONS = [
  { name: "JNE", desc: "Reguler & YES" },
  { name: "J&T Express", desc: "EZ & Jemari" },
  { name: "SiCepat", desc: "SiUntung & BEST" },
  { name: "GoSend", desc: "Instant / Sameday" },
  { name: "GrabExpress", desc: "Instant" },
  { name: "Anteraja", desc: "Reguler" },
  { name: "Pos Indonesia", desc: "Pos Kilat Khusus" },
];

export default function BuatTokoPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Wizard state: 1, 2, 3, 4
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form state
  const [formData, setFormData] = useState<CreateShopPayload>({
    name: "",
    description: "",
    waste_focus: "",
    province: "",
    city: "",
    district: "",
    address: "",
    postal_code: "",
    phone_number: "",
    email: "",
    courier_options: ["JNE", "J&T Express", "SiCepat"],
    logo_url: "",
  });

  // Regional API state (emsifa)
  const [provinces, setProvinces] = useState<RegionItem[]>([]);
  const [regencies, setRegencies] = useState<RegionItem[]>([]);
  const [districts, setDistricts] = useState<RegionItem[]>([]);

  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedRegencyId, setSelectedRegencyId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingRegencies, setIsLoadingRegencies] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);

  // 1. Auth & Existing Shop check
  useEffect(() => {
    async function checkAuthAndShop() {
      const user = await getCurrentUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
      }));

      try {
        const existingShop = await getMyShop();
        if (existingShop) {
          Swal.fire({
            title: "Toko Sudah Terdaftar",
            text: `Akun Anda sudah memiliki toko "${existingShop.name}". Anda akan diarahkan ke profil.`,
            icon: "info",
            confirmButtonColor: "#1C3E2B",
            confirmButtonText: "Buka Profil",
            customClass: { popup: "rounded-[2rem] border border-black/[0.08]" },
          }).then(() => {
            router.replace("/profil");
          });
          return;
        }
      } catch {
        // Safe to proceed
      } finally {
        setIsChecking(false);
      }
    }

    checkAuthAndShop();
  }, [router]);

  // 2. Fetch Provinces from emsifa API
  useEffect(() => {
    async function fetchProvinces() {
      setIsLoadingProvinces(true);
      try {
        const res = await fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json");
        if (res.ok) {
          const data: RegionItem[] = await res.json();
          setProvinces(data);
        }
      } catch (err) {
        console.error("Gagal memuat provinsi:", err);
      } finally {
        setIsLoadingProvinces(false);
      }
    }

    fetchProvinces();
  }, []);

  // 3. Handle Province Change
  const handleProvinceChange = async (provinceId: string) => {
    setSelectedProvinceId(provinceId);
    setSelectedRegencyId("");
    setSelectedDistrictId("");
    setRegencies([]);
    setDistricts([]);

    const foundProvince = provinces.find((p) => p.id === provinceId);
    setFormData((prev) => ({
      ...prev,
      province: foundProvince ? foundProvince.name : "",
      city: "",
      district: "",
    }));

    if (!provinceId) return;

    setIsLoadingRegencies(true);
    try {
      const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`);
      if (res.ok) {
        const data: RegionItem[] = await res.json();
        setRegencies(data);
      }
    } catch (err) {
      console.error("Gagal memuat kota:", err);
    } finally {
      setIsLoadingRegencies(false);
    }
  };

  // 4. Handle Regency Change
  const handleRegencyChange = async (regencyId: string) => {
    setSelectedRegencyId(regencyId);
    setSelectedDistrictId("");
    setDistricts([]);

    const foundRegency = regencies.find((r) => r.id === regencyId);
    setFormData((prev) => ({
      ...prev,
      city: foundRegency ? foundRegency.name : "",
      district: "",
    }));

    if (!regencyId) return;

    setIsLoadingDistricts(true);
    try {
      const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${regencyId}.json`);
      if (res.ok) {
        const data: RegionItem[] = await res.json();
        setDistricts(data);
      }
    } catch (err) {
      console.error("Gagal memuat kecamatan:", err);
    } finally {
      setIsLoadingDistricts(false);
    }
  };

  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrictId(districtId);
    const foundDistrict = districts.find((d) => d.id === districtId);
    setFormData((prev) => ({
      ...prev,
      district: foundDistrict ? foundDistrict.name : "",
    }));
  };

  // Toggle courier chip
  const toggleCourier = (courierName: string) => {
    setFormData((prev) => {
      const current = prev.courier_options || [];
      const updated = current.includes(courierName)
        ? current.filter((c) => c !== courierName)
        : [...current, courierName];
      return { ...prev, courier_options: updated };
    });
  };

  // Toggle material tag
  const toggleMaterial = (tag: string) => {
    setFormData((prev) => {
      const current = prev.waste_focus ? prev.waste_focus.split(", ").filter(Boolean) : [];
      let updated: string[];
      if (current.includes(tag)) {
        updated = current.filter((t) => t !== tag);
      } else {
        updated = [...current, tag];
      }
      return { ...prev, waste_focus: updated.join(", ") };
    });
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "Foto Toko Tidak Valid",
        text: "Gunakan JPG, PNG, atau WEBP dengan ukuran maksimal 5 MB.",
        confirmButtonColor: "#1C3E2B",
      });
      event.target.value = "";
      return;
    }
    setIsUploadingLogo(true);
    try {
      const logoUrl = await uploadShopImage(file);
      setFormData((prev) => ({ ...prev, logo_url: logoUrl }));
    } catch (error: unknown) {
      Swal.fire({
        icon: "error",
        title: "Foto Gagal Diunggah",
        text: error instanceof Error ? error.message : "Silakan coba lagi.",
        confirmButtonColor: "#1C3E2B",
      });
    } finally {
      setIsUploadingLogo(false);
      event.target.value = "";
    }
  };

  // Step Validation
  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!formData.logo_url) {
        Swal.fire({
          icon: "warning",
          title: "Foto Profil Toko Wajib Ada",
          text: "Unggah logo atau foto yang mewakili tokomu terlebih dahulu.",
          confirmButtonColor: "#1C3E2B",
        });
        return false;
      }
      if (!formData.name.trim() || formData.name.trim().length < 3) {
        Swal.fire({
          icon: "warning",
          title: "Nama Toko Wajib Diisi",
          text: "Silakan masukkan nama toko minimal 3 karakter.",
          confirmButtonColor: "#1C3E2B",
          customClass: { popup: "rounded-[2rem] border border-black/[0.08]" },
        });
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      if (!formData.province) {
        Swal.fire({
          icon: "warning",
          title: "Provinsi Belum Dipilih",
          text: "Pilih provinsi lokasi workshop atau pengiriman Anda.",
          confirmButtonColor: "#1C3E2B",
          customClass: { popup: "rounded-[2rem] border border-black/[0.08]" },
        });
        return false;
      }
      if (!formData.city) {
        Swal.fire({
          icon: "warning",
          title: "Kota Belum Dipilih",
          text: "Pilih kabupaten atau kota lokasi Anda.",
          confirmButtonColor: "#1C3E2B",
          customClass: { popup: "rounded-[2rem] border border-black/[0.08]" },
        });
        return false;
      }
      if (!formData.address.trim() || formData.address.trim().length < 5) {
        Swal.fire({
          icon: "warning",
          title: "Alamat Belum Lengkap",
          text: "Mohon isi detail alamat jalan/gedung minimal 5 karakter.",
          confirmButtonColor: "#1C3E2B",
          customClass: { popup: "rounded-[2rem] border border-black/[0.08]" },
        });
        return false;
      }
      return true;
    }

    if (currentStep === 3) {
      const digits = formData.phone_number.replace(/\D/g, "");
      if (!digits || digits.length < 8) {
        Swal.fire({
          icon: "warning",
          title: "Nomor WhatsApp Diperlukan",
          text: "Masukkan nomor kontak aktif minimal 8 digit.",
          confirmButtonColor: "#1C3E2B",
          customClass: { popup: "rounded-[2rem] border border-black/[0.08]" },
        });
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => (Math.min(prev + 1, 4) as 1 | 2 | 3 | 4));
      window.scrollTo({ top: 100, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    setStep((prev) => (Math.max(prev - 1, 1) as 1 | 2 | 3 | 4));
    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  // Submit
  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) return;

    setIsSubmitting(true);
    try {
      const res = await createShop(formData);
      Swal.fire({
        title: "Toko Berhasil Terdaftar!",
        text: `Toko "${res.name}" Anda telah siap di Marketplace Upcycling Limbara.`,
        icon: "success",
        confirmButtonColor: "#1C3E2B",
        confirmButtonText: "Buka Profil Toko",
        customClass: {
          popup: "rounded-[2rem] border border-black/[0.08] shadow-2xl",
          confirmButton: "rounded-full px-8 py-3 text-sm font-bold",
        },
      }).then(() => {
        router.replace("/profil");
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mendaftarkan toko.";
      Swal.fire({
        title: "Pendaftaran Gagal",
        text: msg,
        icon: "error",
        confirmButtonColor: "#ef4444",
        confirmButtonText: "Kembali",
        customClass: { popup: "rounded-[2rem] border border-black/[0.08]" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="w-9 h-9 border-2 border-black/10 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  const stepsList = [
    { num: 1, title: "Identitas", subtitle: "Nama & Bahan" },
    { num: 2, title: "Lokasi", subtitle: "Wilayah & Alamat" },
    { num: 3, title: "Pengiriman", subtitle: "Kontak & Kurir" },
    { num: 4, title: "Konfirmasi", subtitle: "Review Akhir" },
  ];

  return (
    <main className="min-h-screen bg-[#F7F8F4] text-gray-950 flex flex-col justify-between selection:bg-green-900 selection:text-white">
      <div>
        <Navbar />

        <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-28 sm:px-8 lg:px-10 lg:pt-32">
          {/* Header Section */}
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-sm font-bold text-green-800">Pembukaan toko Limbara</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-[-0.035em] text-gray-950">
              Buka Toko Kerajinan
            </h1>
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-gray-600 leading-relaxed">
              Daftarkan workshop upcycling Anda untuk mulai memasarkan karya olahan sampah ke masyarakat luas.
            </p>
          </div>

          {/* Progress pendaftaran */}
          <div className="mb-5 overflow-x-auto rounded-2xl border border-gray-200 bg-white p-2">
            <div className="grid min-w-[640px] grid-cols-4 gap-2">
              {stepsList.map((s) => {
                const isActive = step === s.num;
                const isPassed = step > s.num;

                return (
                  <button
                    key={s.num}
                    type="button"
                    onClick={() => {
                      if (isPassed) setStep(s.num as 1 | 2 | 3 | 4);
                    }}
                    disabled={!isPassed && !isActive}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-xs font-bold transition ${
                      isActive
                        ? "bg-green-950 text-white"
                        : isPassed
                        ? "bg-green-50 text-green-950 hover:bg-green-100 cursor-pointer"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                        isActive
                          ? "bg-white text-green-950"
                          : isPassed
                          ? "bg-green-700 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {isPassed ? <Check size={13} aria-hidden="true" /> : s.num}
                    </span>
                    <span>
                      <span className="block whitespace-nowrap">{s.title}</span>
                      <span className={`mt-0.5 block whitespace-nowrap text-[10px] font-medium ${isActive ? "text-green-100" : "text-gray-500"}`}>
                        {s.subtitle}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form utama */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 lg:p-10">
            <AnimatePresence mode="wait">
              {/* STEP 1: IDENTITAS TOKO */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="pb-4 border-b border-black/[0.06]">
                    <span className="mb-1 block text-xs font-bold text-green-800">
                      Langkah 1 dari 4
                    </span>
                    <h2 className="text-2xl font-black text-gray-950 tracking-tight">
                      Identitas & Karya Toko
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Beri nama yang mewakili ciri khas dan material daur ulang kreasi Anda.
                    </p>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-2">
                    <div className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-[#F7F8F4] p-4 lg:col-span-2">
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="relative grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-white text-gray-500 transition hover:border-green-700"
                      >
                        {formData.logo_url ? (
                          <Image src={formData.logo_url} alt="Foto profil toko" fill sizes="96px" className="object-cover" />
                        ) : isUploadingLogo ? (
                          <Loader2 className="animate-spin text-green-800" size={24} />
                        ) : (
                          <ImagePlus size={25} aria-hidden="true" />
                        )}
                      </button>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Foto Profil Toko <span className="text-red-500">*</span></p>
                        <p className="mt-1 text-xs leading-5 text-gray-500">Gunakan logo atau foto workshop berbentuk persegi. JPG, PNG, atau WEBP maksimal 5 MB.</p>
                        <button type="button" onClick={() => logoInputRef.current?.click()} disabled={isUploadingLogo} className="mt-2 text-xs font-bold text-green-800 disabled:opacity-50">
                          {formData.logo_url ? "Ganti foto" : "Unggah foto"}
                        </button>
                      </div>
                      <input ref={logoInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleLogoUpload} className="hidden" />
                    </div>
                    {/* Nama Toko */}
                    <div>
                    <label className="mb-2 block text-sm font-bold text-gray-800">
                      Nama Toko <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: Ruang Daur Bandung, Kreasi Botol Lestari"
                      className="w-full h-13 px-4.5 rounded-2xl border border-black/[0.12] text-sm text-gray-900 focus:border-green-800 focus:ring-4 focus:ring-green-800/10 outline-none transition bg-[#FCFCFD]"
                    />
                    <p className="text-[11px] text-gray-400 mt-1.5">
                      Nama toko akan tercantum pada katalog barang upcycling dan kartu penjual.
                    </p>
                    </div>

                    {/* Slogan / Deskripsi */}
                    <div>
                    <label className="mb-2 block text-sm font-bold text-gray-800">
                      Slogan & Deskripsi Singkat
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Contoh: Kami mengolah limbah botol PET dan kaca menjadi lampu dekorasi ruangan yang estetik dan ramah bumi..."
                      className="w-full p-4 rounded-2xl border border-black/[0.12] text-sm text-gray-900 focus:border-green-800 focus:ring-4 focus:ring-green-800/10 outline-none transition bg-[#FCFCFD] resize-none"
                    />
                    </div>
                  </div>

                  {/* Fokus Material Sampah */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-800">
                      Pilihan Fokus Material Sampah
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                      Pilih satu atau lebih kategori limbah yang menjadi bahan baku karya Anda:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {MATERIAL_SUGGESTIONS.map((mat) => {
                        const isSelected = (formData.waste_focus || "").includes(mat.tag);

                        return (
                          <button
                            key={mat.tag}
                            type="button"
                            onClick={() => toggleMaterial(mat.tag)}
                            className={`flex items-center justify-between rounded-2xl border p-3.5 text-left transition cursor-pointer ${
                              isSelected
                                ? "bg-green-50/80 border-green-800/40 text-green-950 font-bold"
                                : "bg-[#F9F9FB] border-black/[0.06] text-gray-700 hover:bg-white hover:border-black/[0.14]"
                            }`}
                          >
                            <span className="text-xs">{mat.label}</span>
                            <span
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${
                                isSelected ? "bg-green-900 text-white" : "border border-black/[0.15]"
                              }`}
                            >
                              {isSelected && <Check size={12} aria-hidden="true" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: LOKASI PENGIRIMAN (EMSIFA) */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="pb-4 border-b border-black/[0.06]">
                    <span className="mb-1 block text-xs font-bold text-green-800">
                      Langkah 2 dari 4
                    </span>
                    <h2 className="text-2xl font-black text-gray-950 tracking-tight">
                      Lokasi Workshop & Pengiriman
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Data ini digunakan untuk menghitung estimasi ongkos kirim dan filter penjual terdekat.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Provinsi */}
                    <div>
                      <label className="mb-2 block text-sm font-bold text-gray-800">
                        Provinsi <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={selectedProvinceId}
                          onChange={(e) => handleProvinceChange(e.target.value)}
                          disabled={isLoadingProvinces}
                          className="w-full h-13 pl-4 pr-10 rounded-2xl border border-black/[0.12] text-sm text-gray-900 focus:border-green-800 focus:ring-4 focus:ring-green-800/10 outline-none transition bg-[#FCFCFD] appearance-none"
                        >
                          <option value="">Pilih Provinsi</option>
                          {provinces.map((prov) => (
                            <option key={prov.id} value={prov.id}>
                              {prov.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      </div>
                      {isLoadingProvinces && (
                        <p className="mt-1.5 text-xs text-green-800">Memuat daftar provinsi...</p>
                      )}
                    </div>

                    {/* Kabupaten/Kota */}
                    <div>
                      <label className="mb-2 block text-sm font-bold text-gray-800">
                        Kota / Kabupaten <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={selectedRegencyId}
                          onChange={(e) => handleRegencyChange(e.target.value)}
                          disabled={!selectedProvinceId || isLoadingRegencies}
                          className="w-full h-13 pl-4 pr-10 rounded-2xl border border-black/[0.12] text-sm text-gray-900 focus:border-green-800 focus:ring-4 focus:ring-green-800/10 outline-none transition bg-[#FCFCFD] appearance-none disabled:bg-gray-100 disabled:text-gray-400"
                        >
                          <option value="">
                            {!selectedProvinceId ? "Pilih Provinsi Dahulu" : "Pilih Kota/Kabupaten"}
                          </option>
                          {regencies.map((reg) => (
                            <option key={reg.id} value={reg.id}>
                              {reg.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      </div>
                      {isLoadingRegencies && (
                        <p className="mt-1.5 text-xs text-green-800">Memuat daftar kota...</p>
                      )}
                    </div>

                    {/* Kecamatan */}
                    <div>
                      <label className="mb-2 block text-sm font-bold text-gray-800">
                        Kecamatan
                      </label>
                      <div className="relative">
                        <select
                          value={selectedDistrictId}
                          onChange={(e) => handleDistrictChange(e.target.value)}
                          disabled={!selectedRegencyId || isLoadingDistricts}
                          className="w-full h-13 pl-4 pr-10 rounded-2xl border border-black/[0.12] text-sm text-gray-900 focus:border-green-800 focus:ring-4 focus:ring-green-800/10 outline-none transition bg-[#FCFCFD] appearance-none disabled:bg-gray-100 disabled:text-gray-400"
                        >
                          <option value="">
                            {!selectedRegencyId ? "Pilih Kota Dahulu" : "Pilih Kecamatan"}
                          </option>
                          {districts.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      </div>
                    </div>

                    {/* Kode Pos */}
                    <div>
                      <label className="mb-2 block text-sm font-bold text-gray-800">
                        Kode Pos
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={formData.postal_code || ""}
                        onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                        placeholder="Contoh: 40132"
                        className="w-full h-13 px-4.5 rounded-2xl border border-black/[0.12] text-sm text-gray-900 focus:border-green-800 focus:ring-4 focus:ring-green-800/10 outline-none transition bg-[#FCFCFD]"
                      />
                    </div>
                  </div>

                  {/* Detail Alamat Lengkap */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-800">
                      Detail Alamat Lengkap <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Sebutkan nama jalan, nomor bangunan, RT/RW, atau patokan lokasi workshop daur ulang..."
                      className="w-full p-4 rounded-2xl border border-black/[0.12] text-sm text-gray-900 focus:border-green-800 focus:ring-4 focus:ring-green-800/10 outline-none transition bg-[#FCFCFD] resize-none"
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 3: KONTAK & KURIR */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="pb-4 border-b border-black/[0.06]">
                    <span className="mb-1 block text-xs font-bold text-green-800">
                      Langkah 3 dari 4
                    </span>
                    <h2 className="text-2xl font-black text-gray-950 tracking-tight">
                      Kontak Pelanggan & Ekspedisi
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Saluran komunikasi untuk konfirmasi pesanan dan pilihan kurir yang Anda sediakan.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Nomor WhatsApp */}
                    <div>
                      <label className="mb-2 block text-sm font-bold text-gray-800">
                        Nomor WhatsApp Toko <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="tel"
                          value={formData.phone_number}
                          onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                          placeholder="081234567890"
                          className="w-full h-13 pl-11 pr-4 rounded-2xl border border-black/[0.12] text-sm text-gray-900 focus:border-green-800 focus:ring-4 focus:ring-green-800/10 outline-none transition bg-[#FCFCFD]"
                        />
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1.5">
                        Digunakan oleh pembeli untuk menanyakan pesanan kustom kerajinan.
                      </p>
                    </div>

                    {/* Email Toko */}
                    <div>
                      <label className="mb-2 block text-sm font-bold text-gray-800">
                        Email Korespondensi
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="email"
                          value={formData.email || ""}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="toko@limbara.id"
                          className="w-full h-13 pl-11 pr-4 rounded-2xl border border-black/[0.12] text-sm text-gray-900 focus:border-green-800 focus:ring-4 focus:ring-green-800/10 outline-none transition bg-[#FCFCFD]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pilihan Kurir */}
                  <div className="pt-2">
                    <label className="mb-2 block text-sm font-bold text-gray-800">
                      Dukungan Layanan Pengiriman
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                      Pilih kurir yang dapat menjangkau atau memiliki agen terdekat dari lokasi Anda:
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {COURIER_OPTIONS.map((c) => {
                        const isChecked = (formData.courier_options || []).includes(c.name);

                        return (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => toggleCourier(c.name)}
                            className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition cursor-pointer ${
                              isChecked
                                ? "bg-green-50/70 border-green-800/40 text-green-950 font-bold"
                                : "bg-[#F9F9FB] border-black/[0.06] text-gray-700 hover:bg-white hover:border-black/[0.14]"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-bold">{c.name}</span>
                              <span
                                className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                                  isChecked ? "bg-green-900 text-white" : "border border-black/[0.15]"
                                }`}
                              >
                                {isChecked && <Check size={10} aria-hidden="true" />}
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-400 font-normal">{c.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: REVIEW & BUAT TOKO (APPLE SPEC SHEET / RECEIPT) */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="pb-4 border-b border-black/[0.06]">
                    <span className="mb-1 block text-xs font-bold text-green-800">
                      Langkah 4 dari 4
                    </span>
                    <h2 className="text-2xl font-black text-gray-950 tracking-tight">
                      Review & Konfirmasi Toko
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Pastikan informasi toko Anda sudah benar sebelum diterbitkan ke ekosistem Limbara.
                    </p>
                  </div>

                  {/* Apple Spec Sheet / Receipt */}
                  <div className="bg-[#F5F5F7] rounded-3xl border border-black/[0.08] p-6 divide-y divide-black/[0.06] space-y-4">
                    {/* Block 1 */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="mb-0.5 block text-xs font-semibold text-gray-500">
                          Nama Toko & Deskripsi
                        </span>
                        <p className="text-base font-bold text-gray-950">{formData.name}</p>
                        {formData.description ? (
                          <p className="text-xs text-gray-600 mt-1 italic">&ldquo;{formData.description}&rdquo;</p>
                        ) : (
                          <p className="text-xs text-gray-400 italic">Tanpa deskripsi tambahan</p>
                        )}
                        <p className="text-xs text-gray-700 mt-2 font-medium">
                          <span className="text-gray-500">Material Olahan:</span>{" "}
                          {formData.waste_focus || "Aneka Bahan Daur Ulang"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-xs font-bold text-green-800 hover:underline shrink-0"
                      >
                        Ubah
                      </button>
                    </div>

                    {/* Block 2 */}
                    <div className="pt-4 flex items-start justify-between gap-4">
                      <div>
                        <span className="mb-0.5 block text-xs font-semibold text-gray-500">
                          Lokasi Asal Pengiriman
                        </span>
                        <p className="text-xs font-bold text-gray-900">
                          {formData.city}, {formData.province}
                          {formData.district ? ` (Kec. ${formData.district})` : ""}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">{formData.address}</p>
                        {formData.postal_code && (
                          <p className="mt-0.5 text-xs text-gray-500">Kode Pos: {formData.postal_code}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="text-xs font-bold text-green-800 hover:underline shrink-0"
                      >
                        Ubah
                      </button>
                    </div>

                    {/* Block 3 */}
                    <div className="pt-4 flex items-start justify-between gap-4">
                      <div>
                        <span className="mb-0.5 block text-xs font-semibold text-gray-500">
                          Kontak & Kurir
                        </span>
                        <p className="text-xs font-semibold text-gray-800">
                          WhatsApp: <span className="font-bold">{formData.phone_number}</span>
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">Email: {formData.email || "-"}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {(formData.courier_options || []).map((c) => (
                            <span
                              key={c}
                              className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white border border-black/[0.08] text-gray-800 shadow-2xs"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="text-xs font-bold text-green-800 hover:underline shrink-0"
                      >
                        Ubah
                      </button>
                    </div>
                  </div>

                  {/* Eco Pledge */}
                  <div className="p-4.5 rounded-2xl bg-green-50/70 border border-green-800/15 flex items-start gap-3">
                    <ShieldCheck size={20} className="text-green-800 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-green-950">Komitmen Karya Upcycling</p>
                      <p className="text-[11px] text-green-900/80 mt-0.5 leading-relaxed">
                        Dengan menekan tombol buat toko, Anda mengonfirmasi bahwa produk kerajinan yang dijual merupakan produk ramah lingkungan berbasis pemilahan dan daur ulang limbah.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Actions Bar */}
            <div className="mt-8 pt-6 border-t border-black/[0.06] flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-full border border-black/[0.12] px-6 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 active:scale-[0.98] cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  Sebelumnya
                </button>
              ) : (
                <Link
                  href="/profil"
                  className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] px-6 py-3 text-sm font-bold text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
                >
                  Batal
                </Link>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 rounded-full bg-green-950 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-green-900 active:scale-[0.98] cursor-pointer"
                >
                  Lanjutkan
                  <ArrowRight size={13} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-full bg-green-950 px-8 py-3.5 text-sm font-black text-white transition hover:bg-green-900 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Mendaftarkan Toko...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={15} />
                      Konfirmasi & Buka Toko
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
