'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const supabase = createClient();

  // --- 1. HANDLING GOOGLE AUTH ---
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`, 
      },
    });

    if (error) {
      console.error("Gagal login dengan Google:", error.message);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat mencoba login dengan Google.",
        confirmButtonColor: "#ef4444"
      });
    }
  };

  // --- 2. HANDLING MAGIC LINK (PASSWORDLESS) ---
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      // Popup Sukses Kirim Email
      Swal.fire({
        icon: "success",
        title: "Tautan Terkirim!",
        text: "Silakan cek kotak masuk (atau folder spam) email kamu untuk tautan masuk otomatis.",
        confirmButtonColor: "#14532d", 
        customClass: { popup: "rounded-3xl", confirmButton: "rounded-xl px-6 py-2" }
      });

      setEmail(""); // Kosongkan input setelah berhasil terkirim

    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal Mengirim Tautan",
        text: error.message || "Pastikan email yang kamu masukkan valid.",
        confirmButtonColor: "#ef4444",
        customClass: { popup: "rounded-3xl", confirmButton: "rounded-xl px-6 py-2" }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f7f4ee] p-4 sm:p-8">
      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] w-full max-w-5xl flex overflow-hidden relative z-10">
        
        {/* KIRI: Area Form Login */}
        <div className="w-full lg:w-1/2 p-8 sm:p-14 lg:p-16 flex flex-col justify-center bg-white relative z-20">
          <div className="mb-10 text-center sm:text-left">
            <Link href="/" className="inline-block mb-10 hover:opacity-80 transition-opacity">
              <Image
                src="/img/logo/limbara.png"
                alt="Limbara Logo"
                width={150}
                height={45}
                className="object-contain mx-auto sm:mx-0"
              />
            </Link>
            
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-3">
              Selamat Datang
            </h1>
            <p className="text-gray-500 font-medium text-sm sm:text-base">
              Masuk dengan mudah tanpa perlu menghafal kata sandi. Cukup gunakan Google atau alamat emailmu.
            </p>
          </div>

          {/* Tombol Login Google */}
          <button onClick={handleGoogleLogin} type="button" className="w-full flex items-center justify-center gap-4 bg-white border-2 border-gray-100 p-4 rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-all font-bold text-gray-700 shadow-sm mb-6 group">
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="tracking-wide">Lanjutkan dengan Google</span>
          </button>

          {/* Garis Pemisah (Divider) */}
          <div className="relative flex items-center py-6">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink-0 mx-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Atau tautan ajaib</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          {/* Form Magic Link */}
          <form onSubmit={handleMagicLink} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 ml-1">
                Alamat Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="nama@email.com"
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-900/10 focus:border-green-800 transition-all font-medium text-gray-800 placeholder:text-gray-400"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading || !email}
              className="w-full bg-green-900 text-white font-bold uppercase tracking-[0.2em] text-sm py-5 rounded-2xl hover:bg-green-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 mt-4 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
            >
              {isLoading ? "Mengirim Tautan..." : "Kirim Tautan Masuk"}
            </button>
          </form>

          {/* Catatan Kecil */}
          <p className="mt-8 text-center text-xs text-gray-400 font-medium leading-relaxed px-4">
            Dengan melanjutkan, kamu menyetujui Ketentuan Layanan dan Kebijakan Privasi Limbara.
          </p>
        </div>

        {/* KANAN: Area Visual */}
        <div className="hidden lg:flex w-1/2 relative bg-green-950 items-end justify-start p-16 overflow-hidden group">
          <div className="absolute inset-0 bg-[url('/img/botol_plastik_pot_bunga.png')] bg-cover bg-center opacity-40 mix-blend-luminosity group-hover:scale-105 transition-transform duration-1000"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-green-950 via-green-950/80 to-transparent"></div>
          <div className="absolute top-10 right-10 w-32 h-32 border border-green-800/30 rounded-full"></div>
          <div className="absolute top-16 right-16 w-20 h-20 border border-green-800/50 rounded-full"></div>

          <div className="relative z-10 max-w-md">
            <div className="bg-green-800/20 backdrop-blur-sm border border-green-700/30 text-green-300 px-4 py-2 rounded-full inline-block text-xs font-black uppercase tracking-widest mb-6">
              Tanpa Kata Sandi
            </div>
            <h2 className="text-4xl font-black text-white leading-[1.1] mb-6">
              Akses Lebih <br />
              <span className="text-green-400">Cepat & Aman.</span>
            </h2>
            <p className="text-green-100/70 text-sm leading-relaxed font-medium">
              Sistem kami menggunakan tautan sekali pakai (*magic link*) langsung ke emailmu untuk keamanan tingkat tinggi tanpa perlu mengingat kata sandi.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}