"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  User as UserIcon,
  Store,
  History,
  MapPin,
  Calendar,
  Mail,
  Phone,
  ChevronRight,
  LogOut,
  ArrowRight,
  Recycle,
} from "lucide-react";
import Swal from "sweetalert2";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthUser, getCurrentUser, getMyShop, logout } from "@/app/service/api";
import { ShopData } from "@/types/marketplace";

export default function ProfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [shop, setShop] = useState<ShopData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.replace("/login");
        return;
      }
      setUser(currentUser);

      try {
        const myShop = await getMyShop();
        setShop(myShop);
      } catch {
        setShop(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  const handleLogout = () => {
    Swal.fire({
      title: "Apakah Anda yakin ingin keluar?",
      text: "Anda akan keluar dari sesi akun ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, keluar",
      cancelButtonText: "Batal",
      customClass: {
        popup: "rounded-3xl border border-gray-200",
        confirmButton: "rounded-xl px-6 py-2.5",
        cancelButton: "rounded-xl px-6 py-2.5",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await logout();
        router.replace("/login");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F8F4] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-200 border-t-green-700 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#F7F8F4] text-gray-950 flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="mx-auto max-w-screen-xl px-6 pb-20 pt-36 sm:px-10 lg:px-16 lg:pt-40">
          {/* Header Profil dengan Border Rapih */}
          <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-5">
              {user.avatar_url ? (
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-200 shrink-0">
                  <Image
                    src={user.avatar_url}
                    alt={user.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                    priority
                  />
                </div>
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-green-800 shadow-sm shrink-0">
                  <UserIcon size={36} />
                </div>
              )}

              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  {user.name}
                </h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <Mail size={14} className="text-gray-400" />
                  {user.email}
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-700">
                    Akun Terverifikasi
                  </span>
                  {shop && (
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-800">
                      Pemilik Toko
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="self-start md:self-auto flex items-center gap-2 px-5 py-2.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
            >
              <LogOut size={15} />
              Keluar Akun
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Kolom Kiri / Utama: Status Toko */}
            <div className="lg:col-span-2 space-y-8">
              {shop ? (
                /* Card Jika Sudah Punya Toko */
                <div className="bg-white rounded-3xl p-8 border border-gray-200/90 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-green-900 text-white flex items-center justify-center shrink-0">
                        <Store size={24} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold tracking-widest text-green-700 uppercase">
                          Toko Kerajinan Aktif
                        </span>
                        <h2 className="text-xl font-bold text-gray-950">{shop.name}</h2>
                      </div>
                    </div>

                    <span className="self-start sm:self-auto text-xs px-3.5 py-1.5 rounded-full bg-green-50 text-green-800 font-semibold border border-green-200">
                      /{shop.slug}
                    </span>
                  </div>

                  <div className="py-6 space-y-4">
                    {shop.description && (
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {shop.description}
                      </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600 pt-2">
                      <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#F7F8F4] border border-gray-200/60">
                        <Recycle className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-gray-800 block">Fokus Material Sampah</span>
                          <span>{shop.waste_focus || "Kerajinan Aneka Sampah"}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#F7F8F4] border border-gray-200/60">
                        <MapPin className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-gray-800 block">Lokasi Toko</span>
                          <span>{shop.city}, {shop.province}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#F7F8F4] border border-gray-200/60">
                        <Phone className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-gray-800 block">Kontak Toko</span>
                          <span>{shop.phone_number}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#F7F8F4] border border-gray-200/60">
                        <Calendar className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-gray-800 block">Terdaftar Sejak</span>
                          <span>{new Date(shop.created_at).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <Link
                      href="/toko/dashboard"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-green-800 transition"
                    >
                      <Store size={14} />
                      Dashboard Kelola Toko
                    </Link>
                    <Link
                      href="/marketplace"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-gray-300 bg-white text-gray-700 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition"
                    >
                      Lihat di Marketplace
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ) : (
                /* Card CTA Buka Toko Jika Belum Punya */
                <div className="rounded-[2.5rem] bg-[#1C3E2B] text-white p-8 sm:p-10 shadow-md border border-green-900/30">
                  <div className="max-w-xl">
                    <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-green-300 mb-3">
                      Ekonomi Sirkular Limbara
                    </span>

                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
                      Mulai Jual Karya Daur Ulangmu di Limbara
                    </h2>
                    <p className="mt-3 text-sm text-green-100/90 leading-relaxed">
                      Ubah sampah terpilah seperti botol plastik, kaleng, kardus, hingga tekstil menjadi kerajinan bernilai jual. Daftarkan tokomu secara gratis dalam 4 langkah mudah.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      <Link
                        href="/toko/buat"
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-green-950 text-xs font-black uppercase tracking-wider hover:bg-green-50 shadow-sm transition cursor-pointer"
                      >
                        <Store size={16} />
                        Buka Toko Sekarang
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Pintasan Fitur dengan Border Rapih */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/riwayat"
                  className="group bg-white p-6 rounded-3xl border border-gray-200/90 hover:border-green-700/40 hover:shadow-sm transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center group-hover:scale-105 transition">
                      <History size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-green-800 transition">Riwayat Scan</h3>
                      <p className="text-xs text-gray-500">Histori deteksi & edukasi sampah</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition" />
                </Link>

                <Link
                  href="/marketplace"
                  className="group bg-white p-6 rounded-3xl border border-gray-200/90 hover:border-green-700/40 hover:shadow-sm transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-200/60 text-green-800 flex items-center justify-center group-hover:scale-105 transition">
                      <Store size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-green-800 transition">Marketplace</h3>
                      <p className="text-xs text-gray-500">Jelajahi kerajinan daur ulang</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition" />
                </Link>
              </div>
            </div>

            {/* Kolom Kanan: Panduan & Informasi dengan Border Rapih */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-sm">
                <h3 className="text-base font-bold text-gray-950 flex items-center gap-2 mb-4">
                  <Recycle size={18} className="text-green-700" />
                  Keuntungan Toko di Limbara
                </h3>
                <ul className="space-y-3.5 text-xs text-gray-600 leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-700 mt-1.5 shrink-0" />
                    <span>Terhubung langsung dengan pembeli yang peduli lingkungan dan daur ulang.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-700 mt-1.5 shrink-0" />
                    <span>Rekomendasi otomatis produkmu saat pengguna memindai jenis sampah serupa di fitur Scan.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-700 mt-1.5 shrink-0" />
                    <span>Mendukung gerakan ekonomi sirkular dan pengurangan sampah nasional.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-gray-200/90 text-xs text-gray-700 leading-relaxed shadow-sm">
                <p className="font-bold text-gray-900 mb-1">Butuh Bantuan?</p>
                <p className="text-gray-600">
                  Jika Anda memiliki Bank Sampah Unit atau komunitas daur ulang yang ingin bermitra, Anda dapat menghubungi tim Limbara melalui fitur asisten chat LimbaBot di pojok kanan bawah layar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
