"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, MapPin, Minus, Plus, Recycle, ShieldCheck, Star, Store } from "lucide-react";

import ProductCard from "@/components/marketplace/ProductCard";
import ProductReviews from "@/components/marketplace/ProductReviews";
import type { MarketplaceProduct } from "@/types/marketplace";
import { formatMarketplacePrice } from "@/utils/marketplace";
import { addToCart } from "@/utils/cart";

interface ProductDetailProps {
  product: MarketplaceProduct;
  relatedProducts: MarketplaceProduct[];
}

export default function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const subtotal = product.price * quantity;

  const handleAddToCart = () => {
    addToCart({
      id: String(product.id),
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0] || product.image,
      material: product.material,
      shopName: product.shop.name,
      shopCity: product.shop.city,
      quantity,
      stock: product.stock,
    });
    setMessage(`${quantity} item berhasil ditambahkan ke keranjang.`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push(`/checkout?productId=${product.id}&quantity=${quantity}`);
  };

  return (
    <>
      <div className="mx-auto max-w-screen-xl px-6 pb-24 pt-32 sm:px-10 lg:px-16 lg:pt-36">
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <Link href="/marketplace" className="hover:text-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700">
            Marketplace
          </Link>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span>{product.category}</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span className="font-semibold text-gray-950" aria-current="page">{product.name}</span>
        </nav>

        <section aria-labelledby="product-title" className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.9fr)_320px] lg:items-start">
          <div className="grid gap-4 sm:grid-cols-[76px_minmax(0,1fr)]">
            <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:flex-col" aria-label="Pilih gambar produk">
              {product.images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  aria-label={`Tampilkan gambar ${index + 1} dari ${product.name}`}
                  aria-pressed={selectedImage === image}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-700/30 ${
                    selectedImage === image ? "ring-2 ring-green-800" : "ring-1 ring-gray-200"
                  }`}
                >
                  <Image src={image} alt="" fill sizes="64px" className="object-contain p-2" />
                </button>
              ))}
            </div>

            <div className="relative order-1 aspect-square overflow-hidden rounded-[2rem] bg-[#DDEBDD] sm:order-2">
              <Image
                src={selectedImage}
                alt={`${product.name}, produk dari ${product.material}`}
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-contain p-8 sm:p-12"
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-green-800">{product.category}</p>
            <h1 id="product-title" className="mt-3 text-3xl font-black leading-tight tracking-[-0.035em] text-gray-950 sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-gray-600">
              {product.reviewCount > 0 ? (
                <>
                  <span className="flex items-center gap-1.5 font-bold text-gray-900">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                    {product.rating}
                  </span>
                  <span>{product.reviewCount} ulasan</span>
                  <span>{product.sold} terjual</span>
                </>
              ) : (
                <span className="font-bold text-green-800">Produk baru · belum ada ulasan</span>
              )}
            </div>

            <div className="mt-7 flex flex-wrap items-end gap-3">
              <p className="text-3xl font-black tabular-nums text-gray-950">{formatMarketplacePrice(product.price)}</p>
              {product.previousPrice && (
                <p className="pb-1 text-sm tabular-nums text-gray-500 line-through">
                  {formatMarketplacePrice(product.previousPrice)}
                </p>
              )}
            </div>

            <p className="mt-7 text-base leading-7 text-gray-700">{product.shortDescription}</p>

            <dl className="mt-8 grid grid-cols-[130px_1fr] gap-x-4 gap-y-4 text-sm">
              <dt className="text-gray-600">Material utama</dt>
              <dd className="font-semibold text-gray-950">{product.material}</dd>
              <dt className="text-gray-600">Ukuran</dt>
              <dd className="font-semibold text-gray-950">{product.dimensions}</dd>
              <dt className="text-gray-600">Berat</dt>
              <dd className="font-semibold text-gray-950">{product.weightGrams} gram</dd>
              <dt className="text-gray-600">Waktu produksi</dt>
              <dd className="font-semibold text-gray-950">{product.productionTime}</dd>
            </dl>

            <div className="mt-9 rounded-2xl bg-green-950 p-6 text-white">
              <div className="flex items-start gap-4">
                <Recycle className="mt-1 h-6 w-6 shrink-0 text-green-300" aria-hidden="true" />
                <div>
                  <h2 className="text-lg font-bold">Dampak produk</h2>
                  <p className="mt-2 text-sm leading-6 text-green-100/80">{product.impact}</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-[1.75rem] bg-white p-6 lg:sticky lg:top-28" aria-labelledby="purchase-panel-title">
            <h2 id="purchase-panel-title" className="text-lg font-black text-gray-950">Atur pembelian</h2>
            <p className="mt-2 text-sm text-gray-600">Stok tersedia: {product.stock}</p>

            <div className="mt-6 flex items-center justify-between gap-4">
              <span className="text-sm font-semibold text-gray-800">Jumlah</span>
              <div className="flex h-10 items-center rounded-full border border-gray-300 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  disabled={quantity === 1}
                  aria-label="Kurangi jumlah"
                  className="grid h-10 w-10 place-items-center rounded-full text-gray-700 disabled:cursor-not-allowed disabled:text-gray-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-700/30"
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <output className="w-8 text-center text-sm font-bold tabular-nums" aria-label={`${quantity} produk`}>{quantity}</output>
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.min(product.stock, current + 1))}
                  disabled={quantity === product.stock}
                  aria-label="Tambah jumlah"
                  className="grid h-10 w-10 place-items-center rounded-full text-gray-700 disabled:cursor-not-allowed disabled:text-gray-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-700/30"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between gap-4">
              <span className="text-sm text-gray-600">Subtotal</span>
              <strong className="text-xl tabular-nums text-gray-950">{formatMarketplacePrice(subtotal)}</strong>
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="h-12 w-full rounded-full bg-green-900 px-5 text-sm font-bold text-white transition hover:bg-green-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-700/30"
              >
                Tambah ke Keranjang
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="h-12 w-full rounded-full border border-green-900 bg-white px-5 text-sm font-bold text-green-900 transition hover:bg-green-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-700/30"
              >
                Beli Sekarang
              </button>
            </div>

            {message ? (
              <div className="mt-4 flex items-center justify-between rounded-xl bg-green-50 p-3 text-xs font-semibold text-green-800">
                <span>{message}</span>
                <Link href="/keranjang" className="underline hover:text-green-950">
                  Lihat Keranjang
                </Link>
              </div>
            ) : null}

            <div className="mt-5 space-y-4 border-t border-gray-100 pt-5 text-sm text-gray-600">
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                Dikirim dari {product.shop.city}
              </p>
              <p className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                Checkout dan pembayaran masih dalam tahap prototype
              </p>
            </div>
          </aside>
        </section>

        <section className="mt-20 grid gap-8 lg:grid-cols-[0.65fr_1.35fr]" aria-labelledby="shop-title">
          <div className="rounded-[1.75rem] bg-white p-7">
            <Store className="h-7 w-7 text-green-800" aria-hidden="true" />
            <h2 id="shop-title" className="mt-5 text-2xl font-black text-gray-950">{product.shop.name}</h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {product.shop.city}
            </p>
            <dl className="mt-7 grid grid-cols-3 gap-4 text-sm">
              <div>
                <dt className="text-gray-600">Status</dt>
                <dd className="mt-1 font-black text-gray-950">Toko baru</dd>
              </div>
              <div>
                <dt className="text-gray-600">Produk</dt>
                <dd className="mt-1 font-black tabular-nums text-gray-950">{product.shop.totalProducts}</dd>
              </div>
              <div>
                <dt className="text-gray-600">Bergabung</dt>
                <dd className="mt-1 font-black tabular-nums text-gray-950">{product.shop.joinedYear}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[1.75rem] bg-white p-7 sm:p-10">
            <h2 className="text-2xl font-black text-gray-950">Cerita di balik karya</h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-gray-700">{product.description}</p>
            <h3 className="mt-9 text-lg font-bold text-gray-950">Yang kamu dapatkan</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-gray-700">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-green-700" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Modul Ulasan & Komentar Pembeli (Frontend Prototype) */}
        <ProductReviews product={product} />

        <section className="mt-24" aria-labelledby="related-products-title">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <h2 id="related-products-title" className="text-3xl font-black tracking-tight text-gray-950">Karya serupa</h2>
              <p className="mt-2 text-sm text-gray-600">Produk lain yang dibuat dari material terpilah.</p>
            </div>
            <Link href="/marketplace" className="shrink-0 text-sm font-bold text-green-800 hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700">
              Lihat semua
            </Link>
          </div>
          <div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((relatedProduct, index) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} index={index + 1} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
