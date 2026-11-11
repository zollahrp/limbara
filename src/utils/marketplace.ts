type SearchableMarketplaceProduct = {
  slug: string;
  name: string;
  category: string;
  material: string;
  shop: {
    name: string;
    city: string;
  };
};

export function filterMarketplaceProducts<T extends SearchableMarketplaceProduct>(
  products: T[],
  query: string,
  category: string,
): T[] {
  const normalizedQuery = query.trim().toLocaleLowerCase("id-ID");

  return products.filter((product) => {
    const matchesCategory = category === "Semua" || product.category === category;
    const searchableText = [
      product.name,
      product.material,
      product.shop.name,
      product.shop.city,
    ]
      .join(" ")
      .toLocaleLowerCase("id-ID");

    return matchesCategory && searchableText.includes(normalizedQuery);
  });
}

export function getMarketplaceProductBySlug<T extends { slug: string }>(
  products: T[],
  slug: string,
): T | undefined {
  return products.find((product) => product.slug === slug);
}

export function formatMarketplacePrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  })
    .format(price)
    .replace(/\s/g, "");
}
import type { MarketplaceProduct, MarketplaceProductApi } from "@/types/marketplace";


export function mapMarketplaceProduct(product: MarketplaceProductApi): MarketplaceProduct {
  const images = product.images?.length ? product.images : [product.image_url];
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    material: product.waste_material,
    price: product.price,
    previousPrice: product.previous_price ?? undefined,
    image: images[0],
    images,
    shortDescription: product.short_description || "Karya upcycling buatan pengrajin lokal.",
    description: product.description || product.short_description || "Detail karya akan segera dilengkapi oleh penjual.",
    stock: product.stock,
    sold: product.sold_count,
    rating: 0,
    reviewCount: 0,
    weightGrams: product.weight_grams,
    dimensions: product.dimensions || "Belum dicantumkan",
    productionTime: product.production_time || "Tanyakan penjual",
    impact: product.impact || `Memanfaatkan kembali material ${product.waste_material}.`,
    features: [
      `Dibuat dari ${product.waste_material}`,
      "Karya pengrajin lokal",
      "Setiap produk dapat memiliki detail unik",
    ],
    shop: {
      id: product.shop.id,
      slug: product.shop.slug,
      name: product.shop.name,
      city: product.shop.city,
      province: product.shop.province,
      logoUrl: product.shop.logo_url ?? undefined,
      isVerified: product.shop.is_verified,
      rating: 0,
      totalProducts: product.shop.total_products,
      joinedYear: new Date(product.shop.created_at).getFullYear(),
    },
  };
}
