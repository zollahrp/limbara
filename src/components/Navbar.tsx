"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AuthUser, getCurrentUser, getMyShop, logout } from "@/app/service/api";
import { User as UserIcon, LogOut, Store, History, ShoppingBag, Package } from "lucide-react";
import { ShopData } from "@/types/marketplace";
import { getCart } from "@/utils/cart";
import Swal from "sweetalert2";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [user, setUser] = useState<AuthUser | null>(null);
  const [shop, setShop] = useState<ShopData | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

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

  useEffect(() => {
    getCurrentUser().then((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        getMyShop().then(setShop).catch(() => setShop(null));
      } else {
        setShop(null);
      }
    });
  }, []);

  useEffect(() => {
    const update = () => {
      const items = getCart();
      setCartCount(items.reduce((sum, it) => sum + it.quantity, 0));
    };
    update();
    window.addEventListener("cart_updated", update);
    return () => window.removeEventListener("cart_updated", update);
  }, []);

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
        await logout();
        setUser(null);
        
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
    { name: "Marketplace", href: "/marketplace" },
  ];

  // Ekstrak data metadata Google/Email
  const userName = user?.name || "Pengguna";
  const userAvatar = user?.avatar_url || "";

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

        {/* LOGIN / PROFIL & CART */}
        <div className="flex items-center gap-3 sm:gap-4 relative">
          <Link
            href="/keranjang"
            className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-200/80 bg-white/70 hover:bg-white text-gray-700 hover:text-green-900 transition-all shadow-sm"
            aria-label="Keranjang Belanja"
          >
            <ShoppingBag size={17} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-green-900 px-1 text-[9px] font-bold text-white shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>

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
                      className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col z-50"
                    >
                      <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                        <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>

                      <div className="py-2 border-b border-gray-100 flex flex-col">
                        <Link
                          href="/profil"
                          onClick={() => setIsDropdownOpen(false)}
                          className="px-5 py-2.5 text-xs font-semibold text-gray-700 hover:text-green-800 hover:bg-green-50/60 transition-colors flex items-center gap-3"
                        >
                          <UserIcon size={16} className="text-gray-500" />
                          <span>Detail Profil</span>
                        </Link>

                        <Link
                          href="/pesanan"
                          onClick={() => setIsDropdownOpen(false)}
                          className="px-5 py-2.5 text-xs font-semibold text-gray-700 hover:text-green-800 hover:bg-green-50/60 transition-colors flex items-center gap-3"
                        >
                          <Package size={16} className="text-gray-500" />
                          <span>Pesanan Saya</span>
                        </Link>

                        {shop ? (
                          <Link
                            href="/toko/dashboard"
                            onClick={() => setIsDropdownOpen(false)}
                            className="px-5 py-2.5 text-xs font-semibold text-gray-700 hover:text-green-800 hover:bg-green-50/60 transition-colors flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <Store size={16} className="text-green-700" />
                              <span>Dashboard Toko</span>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-800 uppercase">
                              Aktif
                            </span>
                          </Link>
                        ) : (
                          <Link
                            href="/toko/buat"
                            onClick={() => setIsDropdownOpen(false)}
                            className="px-5 py-2.5 text-xs font-semibold text-green-800 hover:bg-green-50 transition-colors flex items-center gap-3"
                          >
                            <Store size={16} className="text-green-700" />
                            <span>Buka Toko</span>
                          </Link>
                        )}

                        <Link
                          href="/riwayat"
                          onClick={() => setIsDropdownOpen(false)}
                          className="px-5 py-2.5 text-xs font-semibold text-gray-700 hover:text-green-800 hover:bg-green-50/60 transition-colors flex items-center gap-3"
                        >
                          <History size={16} className="text-gray-500" />
                          <span>Riwayat Scan</span>
                        </Link>
                      </div>

                      <button 
                        onClick={handleLogout}
                        className="px-5 py-3 text-left text-xs font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2.5 uppercase tracking-wider"
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
                <button className="relative overflow-hidden cursor-pointer bg-green-800 text-white px-8 py-3 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-green-700 transition">
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

                <div className="w-full flex flex-col gap-2 pt-2 border-t border-gray-100">
                  <Link
                    href="/profil"
                    onClick={() => setMenuOpen(false)}
                    className="w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-green-800 hover:bg-green-50 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <UserIcon size={16} />
                    Detail Profil
                  </Link>
                  <Link
                    href="/pesanan"
                    onClick={() => setMenuOpen(false)}
                    className="w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-green-800 hover:bg-green-50 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <Package size={16} />
                    Pesanan Saya
                  </Link>
                  {shop ? (
                    <Link
                      href="/toko/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-green-800 hover:bg-green-50 rounded-xl transition flex items-center justify-center gap-2"
                    >
                      <Store size={16} className="text-green-700" />
                      Dashboard Toko
                    </Link>
                  ) : (
                    <Link
                      href="/toko/buat"
                      onClick={() => setMenuOpen(false)}
                      className="w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-green-800 bg-green-50/80 hover:bg-green-100/70 rounded-xl transition flex items-center justify-center gap-2"
                    >
                      <Store size={16} className="text-green-700" />
                      Buka Toko
                    </Link>
                  )}
                  <Link
                    href="/riwayat"
                    onClick={() => setMenuOpen(false)}
                    className="w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-green-800 hover:bg-green-50 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <History size={16} />
                    Riwayat Scan
                  </Link>
                </div>

                <button 
                  onClick={handleLogout}
                  className="bg-red-50 hover:bg-red-100 transition-colors text-red-600 border border-red-100 px-8 py-3 text-[11px] font-bold uppercase tracking-[0.3em] mt-1 w-full rounded-full flex items-center justify-center gap-2"
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
