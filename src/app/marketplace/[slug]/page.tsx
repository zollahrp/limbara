import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductDetail from "@/components/marketplace/ProductDetail";
import { getMarketplaceProduct, getMarketplaceProducts } from "@/app/service/api";
import { mapMarketplaceProduct } from "@/utils/marketplace";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const productData = await getMarketplaceProduct(slug);
  const product = productData ? mapMarketplaceProduct(productData) : null;

  if (!product) return { title: "Produk Tidak Ditemukan | Limbara" };

  return {
    title: `${product.name} | Marketplace Limbara`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const productData = await getMarketplaceProduct(slug);

  if (!productData) notFound();
  const product = mapMarketplaceProduct(productData);

  const catalog = await getMarketplaceProducts({ pageSize: 12 });
  const relatedProducts = catalog.items.map(mapMarketplaceProduct)
    .filter((item) => item.id !== product.id)
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category))
    .slice(0, 3);

  return (
    <main className="h-dvh overflow-y-auto bg-[#F7F8F4] text-gray-950">
      <Navbar />
      <ProductDetail product={product} relatedProducts={relatedProducts} />
      <Footer />
    </main>
  );
}
