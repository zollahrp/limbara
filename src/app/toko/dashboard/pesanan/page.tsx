"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function TokoDashboardPesananRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/toko/dashboard?tab=orders");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F7F8F4] flex flex-col items-center justify-center p-4">
      <Loader2 className="h-8 w-8 animate-spin text-green-900" />
      <p className="mt-3 text-xs font-semibold text-gray-600">
        Membuka manajemen pesanan toko...
      </p>
    </div>
  );
}
