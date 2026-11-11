import type { Metadata } from "next";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import MarketplaceCatalog from "@/components/marketplace/MarketplaceCatalog";

export const metadata: Metadata = {
  title: "Marketplace Upcycling | Limbara",
  description: "Temukan karya dan produk kerajinan bernilai baru yang dibuat dari material sampah terpilah.",
};

export default function MarketplacePage() {
  return (
    <main className="h-dvh overflow-y-auto bg-[#F7F8F4] text-gray-950">
      <Navbar />

      <header className="mx-auto max-w-screen-xl px-6 pb-16 pt-36 sm:px-10 lg:px-16 lg:pb-24 lg:pt-44">
        <div className="grid items-end gap-10 lg:grid-cols-[1.45fr_0.55fr]">
          <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            Marketplace karya daur ulang
          </h1>
          <p className="max-w-md text-base leading-7 text-gray-700 lg:pb-1">
            Temukan benda baru yang lahir dari material lama, dibuat langsung oleh kreator lokal dengan proses yang lebih bertanggung jawab.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-screen-xl px-6 sm:px-10 lg:px-16">
        <MarketplaceCatalog />
      </div>

      <Footer />
    </main>
  );
}
