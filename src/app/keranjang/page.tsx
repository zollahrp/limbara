"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { CartItem, clearCart, getCart, removeFromCart, updateQuantity } from "@/utils/cart";
import { formatMarketplacePrice } from "@/utils/marketplace";

export default function KeranjangPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setItems(getCart());

    const handleCartUpdate = () => {
      setItems(getCart());
    };

    window.addEventListener("cart_updated", handleCartUpdate);
    return () => window.removeEventListener("cart_updated", handleCartUpdate);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F7F8F4] pt-32 pb-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F7F8F4] text-gray-900 pb-24 pt-32 sm:pt-36">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Header Navigation */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-green-900 transition-colors mb-2"
            >
              <ArrowLeft size={14} />
              <span>Kembali ke Marketplace</span>
            </Link>
            <h1 className="text-3xl font-black tracking-tight text-gray-950">Keranjang Belanja</h1>
          </div>
          {items.length > 0 && (
            <button
              onClick={() => clearCart()}
              className="self-start text-xs font-bold text-gray-500 hover:text-red-700 transition-colors py-1.5 px-3 rounded-xl border border-gray-200/80 hover:border-red-200"
            >
              Kosongkan Keranjang
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="rounded-[2rem] border border-gray-200/80 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 border border-gray-100">
              <ShoppingBag size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-950">Keranjangmu Masih Kosong</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              Temukan produk-produk daur ulang kreatif ramah lingkungan dari pengrajin lokal di Marketplace Limbara.
            </p>
            <div className="mt-8">
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 rounded-2xl bg-green-900 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-green-800"
              >
                <span>Jelajahi Marketplace</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            {/* List Item Keranjang */}
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition hover:border-gray-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                      <Image
                        src={item.image || "/img/marketplace/default.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="inline-block rounded-md bg-green-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-800 border border-green-200/50">
                        {item.material}
                      </span>
                      <h3 className="font-bold text-gray-950 text-base mt-1 line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Toko: <span className="font-medium text-gray-700">{item.shopName}</span> ({item.shopCity})
                      </p>
                      <p className="mt-1 font-bold text-gray-950 text-sm">
                        {formatMarketplacePrice(item.price)}
                      </p>
                    </div>
                  </div>

                  {/* Kontrol Kuantitas & Hapus */}
                  <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <div className="flex items-center rounded-xl border border-gray-200/80 bg-gray-50/50 p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white text-gray-700 transition"
                        aria-label="Kurangi kuantitas"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-xs font-bold tabular-nums text-gray-950">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        disabled={item.quantity >= item.stock}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white text-gray-700 disabled:opacity-30 transition"
                        aria-label="Tambah kuantitas"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition"
                      aria-label="Hapus dari keranjang"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Ringkasan Belanja */}
            <div className="rounded-[2rem] border border-gray-200/80 bg-white p-6 shadow-sm sticky top-36">
              <h2 className="text-base font-bold text-gray-950 border-b border-gray-100 pb-4">
                Ringkasan Pesanan
              </h2>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Total Produk</span>
                  <span className="font-semibold text-gray-900">{totalItems} barang</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal Belanja</span>
                  <span className="font-semibold text-gray-900">{formatMarketplacePrice(subtotal)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
                  <span className="text-base font-bold text-gray-950">Total</span>
                  <span className="text-xl font-black text-gray-950 tabular-nums">
                    {formatMarketplacePrice(subtotal)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/checkout")}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-green-900 py-3.5 text-sm font-bold text-white transition hover:bg-green-800 shadow-sm"
              >
                <span>Lanjut ke Checkout</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
