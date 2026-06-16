"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { LogOut, User } from "lucide-react";
import Swal from "sweetalert2"; // Impor SweetAlert2

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State untuk menyimpan data user
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const supabase = createClient();

  // 1. Deteksi Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Deteksi Sesi Login Supabase
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 3. Fungsi Logout dengan SweetAlert Konfirmasi & Toast
  const handleLogout = () => {
    // Tutup dropdown agar UI bersih saat popup muncul
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);

    Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Kamu akan keluar dari sesi saat ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#166534", // Warna hijau khas Limbara (green-800)
      cancelButtonColor: "#ef4444", // Warna merah (red-500)
      confirmButtonText: "Ya, Keluar!",
      cancelButtonText: "Batal",
      shape: "rounded",
      customClass: {
        popup: "rounded-3xl",
        confirmButton: "rounded-xl px-6 py-2.5 font-bold",
        cancelButton: "rounded-xl px-6 py-2.5 font-bold"
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Eksekusi logout Supabase
        await supabase.auth.signOut();
        
        // Konfigurasi Toast Alert untuk sukses
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: "rounded-xl"
          },
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          }
        });

        Toast.fire({
          icon: "success",
          title: "Berhasil keluar dari akun"
        });
      }
    });
  };

  // Ekstrak data metadata Google
  const userName = user?.user_metadata?.full_name || "Pengguna";
  const userAvatar = user?.user_metadata?.avatar_url || "";

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 50, damping: 15 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.05)] py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between">
        
        {/* AREA LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/img/logo/limbara.png" 
            alt="Limbara Logo"
            width={300}
            height={250}
            className="object-contain h-20 sm:h-20 lg:h-[60px] w-auto drop-shadow-sm"
            priority
          />
        </Link>

        {/* AREA MENU (DESKTOP) */}
        <div className="hidden md:flex items-center gap-10">
          <Link href="/" className="text-xs uppercase tracking-[0.3em] font-bold text-gray-800 hover:text-green-700 transition-colors">
            Beranda
          </Link>
          <Link href="/scan" className="text-xs uppercase tracking-[0.3em] font-bold text-gray-800 hover:text-green-700 transition-colors">
            Scan
          </Link>
          <Link href="/bank-sampah" className="text-xs uppercase tracking-[0.3em] font-bold text-gray-800 hover:text-green-700 transition-colors">
            Bank Sampah
          </Link>
        </div>

        {/* AREA KANAN (TOMBOL LOGIN / PROFIL & HAMBURGER MOBILE) */}
        <div className="flex items-center gap-4 relative">
          
          <div className="hidden sm:block">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 bg-white border border-gray-100 pl-2 pr-4 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all"
                >
                  {userAvatar ? (
                    <img 
                      src={userAvatar} 
                      alt="Avatar" 
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      referrerPolicy="no-referrer" 
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-800">
                      <User size={16} />
                    </div>
                  )}
                  {/* Teks dimodifikasi agar menampilkan nama lengkap asli tanpa di-split, max-width dinaikkan agar pas */}
                  <span className="text-xs font-bold text-gray-700 truncate max-w-[150px]">
                    {userName}
                  </span>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col"
                    >
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Keluar
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login">
                <button className="bg-green-800 hover:bg-green-700 text-white px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-all hover:shadow-lg hover:-translate-y-0.5 rounded-xl">
                  Login
                </button>
              </Link>
            )}
          </div>

          {/* Tombol Mobile Menu */}
          <button 
            className="block md:hidden text-2xl text-green-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 md:hidden flex flex-col overflow-hidden"
          >
            <div className="flex flex-col items-center py-8 gap-6">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-sm uppercase tracking-[0.3em] font-bold text-gray-800 hover:text-green-700">
                Beranda
              </Link>
              <Link href="/scan" onClick={() => setIsMobileMenuOpen(false)} className="text-sm uppercase tracking-[0.3em] font-bold text-gray-800 hover:text-green-700">
                Scan
              </Link>
              <Link href="/bank-sampah" onClick={() => setIsMobileMenuOpen(false)} className="text-sm uppercase tracking-[0.3em] font-bold text-gray-800 hover:text-green-700">
                Bank Sampah
              </Link>

              <div className="w-11/12 border-t border-gray-100 my-2"></div>

              {/* Kondisional Rendering Mobile */}
              {user ? (
                <div className="flex flex-col items-center gap-4 w-full">
                  <div className="flex items-center gap-3 px-4 w-full justify-center">
                    {userAvatar ? (
                      <img src={userAvatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-800">
                        <User size={20} />
                      </div>
                    )}
                    <div className="text-left overflow-hidden">
                      <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{userName}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-50 hover:bg-red-100 transition-colors text-red-600 border border-red-100 px-10 py-3 text-sm font-bold uppercase tracking-[0.2em] mt-2 w-11/12 rounded-xl flex items-center justify-center gap-2"
                  >
                    <LogOut size={16} /> Keluar
                  </button>
                </div>
              ) : (
                <Link href="/login" className="w-full flex justify-center" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="bg-green-800 text-white px-10 py-3 text-sm font-bold uppercase tracking-[0.2em] w-11/12 rounded-xl">
                    Login
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}