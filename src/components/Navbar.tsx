"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { User as UserIcon, LogOut } from "lucide-react";
import Swal from "sweetalert2";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // State untuk Supabase Auth
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const supabase = createClient();

  // 1. Deteksi Scroll (Bawaan dari desain barumu)
  useEffect(() => {
    const container = document.querySelector("main");

    if (!container) return;

    const handleScroll = () => {
      setIsScrolled(container.scrollTop > 80);
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
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
  }, [supabase.auth]);

  // 3. Fungsi Logout dengan SweetAlert Konfirmasi & Toast
  const handleLogout = () => {
    setIsDropdownOpen(false);
    setMenuOpen(false);

    Swal.fire({
      title: "Apakah Anda yakin ingin keluar?",
      text: "Anda akan keluar dari akun Anda saat ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, keluar!",
      cancelButtonText: "Batal",
      customClass: { popup: "rounded-3xl", confirmButton: "rounded-xl px-6 py-2", cancelButton: "rounded-xl px-6 py-2" }
    }).then(async (result) => {
      if (result.isConfirmed) {
        await supabase.auth.signOut();
        
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          customClass: { popup: "rounded-xl" }
        });

        Toast.fire({
          icon: "success",
          title: "Berhasil keluar dari akun"
        });
      }
    });
  };

  const menus = [
    { name: "Beranda", href: "/" },
    { name: "Scan", href: "/scan" },
    { name: "Bank Sampah", href: "/bank-sampah" },
  ];

  // Ekstrak data metadata Google/Email
  const userName = user?.user_metadata?.full_name || "Pengguna";
  const userAvatar = user?.user_metadata?.avatar_url || "";

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`
      fixed top-0 left-0 w-full z-50 transition-all duration-500
      ${isScrolled ? "px-6 lg:px-20 pt-5" : "px-8 lg:px-20 pt-8"}
      `}
    >
      <div
        className={`
      mx-auto flex items-center justify-between transition-all duration-500
      ${
        isScrolled
          ? "max-w-6xl bg-white/80 backdrop-blur-xl border border-black/10 shadow-xl px-8 py-3 rounded-full"
          : "max-w-full"
      }
      `}
      >
        {/* LOGO */}
        <Link href="/" className="relative">
          <Image
            src="/img/logo/limbara.png"
            alt="Limbara"
            width={300}
            height={100}
            priority
            className="object-contain w-auto h-8 lg:h-10"
          />
        </Link>

        {/* MENU */}
        <div className="hidden md:flex items-center gap-12">
          {menus.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group relative text-[11px] uppercase tracking-[0.35em] font-bold text-gray-800"
            >
              {item.name}
              <span className="absolute left-0 -bottom-2 h-[2px] w-0 bg-green-700 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* LOGIN / PROFIL */}
        <div className="flex items-center gap-5 relative">
          <div className="hidden sm:block">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 bg-white/50 hover:bg-white cursor-pointer border border-gray-200 pl-1.5 pr-4 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all"
                >
                  {userAvatar ? (
                    <img 
                      src={userAvatar} 
                      alt="Avatar" 
                      className="w-8 h-8 rounded-full object-cover border border-gray-100"
                      referrerPolicy="no-referrer" 
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-800">
                      <UserIcon size={16} />
                    </div>
                  )}
                  {/* Styling disesuaikan agar senada dengan link navigasimu (huruf kecil kapital & spasi lebar) */}
                  <span className="text-[10px] font-bold text-gray-800 uppercase tracking-[0.2em] truncate max-w-[120px]">
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
                      className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col"
                    >
                      <div className="px-5 py-4 border-b border-gray-50">
                        <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="px-5 py-4 text-left text-xs font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 uppercase tracking-wider"
                      >
                        <LogOut size={16} />
                        Keluar Akun
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login">
                <button className="relative overflow-hidden bg-green-800 text-white px-8 py-3 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-green-700 transition">
                  Login
                </button>
              </Link>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-2xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 mx-6 bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 flex flex-col items-center gap-6 md:hidden"
          >
            {menus.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="uppercase tracking-[0.3em] text-xs font-bold text-gray-800"
              >
                {item.name}
              </Link>
            ))}

            <div className="w-full h-[1px] bg-gray-100 my-2"></div>

            {/* Bagian Profil / Login untuk Mobile */}
            {user ? (
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="flex items-center gap-3 px-4 w-full justify-center">
                  {userAvatar ? (
                    <img src={userAvatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover shadow-sm" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-800">
                      <UserIcon size={24} />
                    </div>
                  )}
                  <div className="text-left overflow-hidden">
                    <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{userName}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{user.email}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-red-50 hover:bg-red-100 transition-colors text-red-600 border border-red-100 px-8 py-3 text-[11px] font-bold uppercase tracking-[0.3em] mt-2 w-full rounded-full flex items-center justify-center gap-2"
                >
                  <LogOut size={16} /> Keluar
                </button>
              </div>
            ) : (
              <Link href="/login" className="w-full flex justify-center" onClick={() => setMenuOpen(false)}>
                <button className="bg-green-800 text-white px-8 py-4 text-[11px] font-bold uppercase tracking-[0.3em] w-full rounded-full shadow-lg">
                  Login ke Limbara
                </button>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}