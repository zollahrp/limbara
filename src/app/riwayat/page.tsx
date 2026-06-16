"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { History } from "lucide-react";
import Navbar from "@/components/Navbar";
import HistoryList from "@/components/HistoryList";
import { createClient } from "@/utils/supabase/client";

export default function RiwayatPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/login");
        return;
      }

      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [router]);

  // Hindari flash konten sebelum status auth diketahui
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#F7F8F4] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-200 border-t-green-700 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8F4] font-sans">
      <Navbar />

      <header className="pt-32 pb-10 px-6 sm:px-10 lg:px-16 max-w-screen-xl mx-auto">
        <p className="text-xs uppercase tracking-[0.35em] text-green-700 font-bold mb-3 flex items-center gap-2">
          <History className="w-3.5 h-3.5" />
          Limbara · Riwayat
        </p>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight">
          Riwayat Scan Anda
        </h1>
        <p className="mt-4 text-gray-500 max-w-md leading-relaxed">
          Semua hasil scan dan insight daur ulang yang pernah kamu simpan, tersusun
          dari yang terbaru.
        </p>
      </header>

      <main className="px-6 sm:px-10 lg:px-16 max-w-screen-xl mx-auto pb-20">
        <HistoryList pageSize={9} />
      </main>
    </div>
  );
}