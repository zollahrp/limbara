"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import ProductCard from "@/components/marketplace/ProductCard";
import { getMarketplaceProducts } from "@/app/service/api";
import type { MarketplaceProduct } from "@/types/marketplace";
import { filterMarketplaceProducts, mapMarketplaceProduct } from "@/utils/marketplace";

const marketplaceCategories = ["Semua", "Dekorasi", "Rumah & Taman", "Mainan", "Koleksi", "Fashion & Aksesoris", "Furnitur & Dapur"];

export default function MarketplaceCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getMarketplaceProducts({ pageSize: 48 })
      .then((result) => {
        if (active) setProducts(result.items.map(mapMarketplaceProduct));
      })
      .catch(() => {
        if (active) setError("Katalog belum dapat dimuat. Silakan coba lagi.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, []);

  const filteredProducts = useMemo(
    () => filterMarketplaceProducts(products, query, category),
    [category, products, query],
  );

  return (
    <section aria-labelledby="marketplace-catalog-title" className="pb-24">
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 id="marketplace-catalog-title" className="text-2xl font-black tracking-tight text-gray-950">
            Temukan karya pilihan
          </h2>
          <p aria-live="polite" className="mt-2 text-sm text-gray-600">
            {filteredProducts.length} produk upcycling tersedia
          </p>
        </div>

        <label className="relative block w-full lg:max-w-md">
          <span className="sr-only">Cari produk, material, atau toko</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari produk, material, atau toko"
            className="h-12 w-full rounded-full border border-gray-300 bg-white pl-12 pr-5 text-sm text-gray-950 outline-none transition focus:border-green-700 focus:ring-4 focus:ring-green-700/10"
          />
        </label>
      </div>

      <div className="mb-10 flex items-center gap-3 overflow-x-auto pb-2" aria-label="Filter kategori produk">
        <SlidersHorizontal className="h-5 w-5 shrink-0 text-gray-500" aria-hidden="true" />
        {marketplaceCategories.map((item) => {
          const isActive = category === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-700/30 ${
                isActive ? "bg-green-900 text-white" : "bg-white text-gray-700 hover:bg-green-50"
              }`}
              aria-pressed={isActive}
            >
              {item}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-label="Memuat produk">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="aspect-[4/5] animate-pulse rounded-[1.75rem] bg-white" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-[1.75rem] bg-white px-6 py-16 text-center" role="alert">
          <h3 className="text-xl font-bold text-gray-950">Katalog tidak dapat dimuat</h3>
          <p className="mt-3 text-sm text-gray-600">{error}</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4" role="list">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              role="listitem"
              className={index === 0 || index === filteredProducts.length - 1 ? "sm:col-span-2" : ""}
            >
              <ProductCard product={product} index={index} featured={index === 0 || index === filteredProducts.length - 1} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[1.75rem] bg-white px-6 py-16 text-center" role="status">
          <h3 className="text-xl font-bold text-gray-950">Produk belum ditemukan</h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-600">
            Coba gunakan kata kunci lain atau pilih kategori Semua untuk melihat seluruh karya.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("Semua");
            }}
            className="mt-6 rounded-full bg-green-900 px-6 py-3 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-700/30"
          >
            Tampilkan semua produk
          </button>
        </div>
      )}
    </section>
  );
}
