"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";


export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Deteksi scroll untuk mengubah tampilan navbar menjadi glassmorphism
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

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
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
            width={700}
            height={250}
            // Ubah h-8 menjadi h-12 (48px) atau h-16 (64px) agar jauh lebih besar
            className="object-contain h-20 sm:h-20 lg:h-[120px] w-auto drop-shadow-sm"
            priority
          />
        </Link>

        {/* AREA MENU (DESKTOP) */}
        <div className="hidden md:flex items-center gap-10">
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.3em] font-bold text-gray-800 hover:text-green-700 transition-colors"
          >
            Beranda
          </Link>
          <Link
            href="/scan"
            className="text-xs uppercase tracking-[0.3em] font-bold text-gray-800 hover:text-green-700 transition-colors"
          >
            Scan
          </Link>
          <Link
            href="/bank-sampah"
            className="text-xs uppercase tracking-[0.3em] font-bold text-gray-800 hover:text-green-700 transition-colors"
          >
            Bank Sampah
          </Link>
        </div>

        {/* AREA TOMBOL LOGIN & HAMBURGER (MOBILE) */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:block bg-green-800 hover:bg-green-700 text-white px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-all hover:shadow-lg hover:-translate-y-0.5">
            Login
          </button>

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
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 md:hidden flex flex-col items-center py-6 gap-6"
        >
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-sm uppercase tracking-[0.3em] font-bold text-gray-800 hover:text-green-700"
          >
            Beranda
          </Link>
          <Link
            href="/scan"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-sm uppercase tracking-[0.3em] font-bold text-gray-800 hover:text-green-700"
          >
            Scan
          </Link>
          <button className="bg-green-800 text-white px-10 py-3 text-sm font-bold uppercase tracking-[0.2em] mt-2 w-11/12">
            Login
          </button>
        </motion.div>
      )}
    </motion.nav>
  );
}