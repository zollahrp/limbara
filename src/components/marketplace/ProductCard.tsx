import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";

import type { MarketplaceProduct } from "@/types/marketplace";
import { formatMarketplacePrice } from "@/utils/marketplace";

interface ProductCardProps {
  product: MarketplaceProduct;
  index: number;
  featured?: boolean;
}

const tileColors = ["bg-[#DDEBDD]", "bg-[#F1E7C9]", "bg-[#DFEAF0]", "bg-[#EBE4DC]"];

export default function ProductCard({ product, index, featured = false }: ProductCardProps) {
  return (
    <article>
      <Link
        href={`/marketplace/${product.slug}`}
        className="group block rounded-[1.75rem] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-700/30"
        aria-label={`Lihat detail ${product.name}`}
      >
        <div
          className={`relative overflow-hidden rounded-[1.75rem] ${tileColors[index % tileColors.length]} ${
            featured ? "aspect-[16/10]" : "aspect-[4/5]"
          }`}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
            className="object-contain p-8 transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
          />
          <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-800">
            {product.material}
          </span>
        </div>

        <div className="px-1 pt-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-gray-950 transition-colors group-hover:text-green-800">
                {product.name}
              </h2>
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-600">{product.shortDescription}</p>
            </div>
            <p className="shrink-0 text-base font-black tabular-nums text-gray-950">
              {formatMarketplacePrice(product.price)}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
            <span className="font-semibold text-gray-800">{product.shop.name}</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {product.shop.city}
            </span>
            {product.reviewCount > 0 ? (
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                {product.rating} · {product.sold} terjual
              </span>
            ) : (
              <span className="font-semibold text-green-800">Produk baru</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
