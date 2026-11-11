import { ProductReview } from "@/types/review";

export const sampleProductReviews: ProductReview[] = [
  {
    id: "rev-001",
    productId: "prd-lamp-001",
    authorName: "Anindya Putri",
    rating: 5,
    date: "28 Oktober 2026",
    title: "Karya daur ulang yang luar biasa estetik!",
    comment:
      "Awalnya tidak menyangka kalau lampu ini benar-benar terbuat dari botol plastik PET bekas. Potongannya sangat rapi, tepi plastiknya halus dan tidak tajam sama sekali. Cahaya kuning hangatnya membuat suasana kamar jadi sangat nyaman.",
    isVerifiedBuyer: true,
    helpfulCount: 14,
    wasteMaterialTag: "Botol Plastik PET",
  },
  {
    id: "rev-002",
    productId: "prd-lamp-001",
    authorName: "Dimas Prasetyo",
    rating: 5,
    date: "19 Oktober 2026",
    title: "Bangga punya barang ramah lingkungan berkualitas",
    comment:
      "Pengemasan aman menggunakan kardus daur ulang tanpa bubble wrap plastik berlebihan. Lampunya kokoh, kabelnya panjang, dan ada kepuasan tersendiri tahu produk ini menyelamatkan puluhan botol plastik dari TPA.",
    isVerifiedBuyer: true,
    helpfulCount: 9,
    wasteMaterialTag: "Botol Plastik PET",
  },
  {
    id: "rev-003",
    productId: "prd-lamp-001",
    authorName: "Siti Rahmawati",
    rating: 4,
    date: "05 Oktober 2026",
    title: "Bagus dan unik, respon pengrajin sangat ramah",
    comment:
      "Barang sampai dalam kondisi prima. Bentuk nanasnya presisi dan artistik saat ditaruh di meja samping tempat tidur. Waktu pengiriman sekitar 3 hari, sangat wajar untuk produk rakitan tangan (handmade).",
    isVerifiedBuyer: true,
    helpfulCount: 5,
    wasteMaterialTag: "Botol Plastik PET",
  },
  {
    id: "rev-004",
    productId: "prd-pot-001",
    authorName: "Fajar Nugraha",
    rating: 5,
    date: "22 Oktober 2026",
    title: "Pot tanaman unik, drainase berfungsi sempurna",
    comment:
      "Pot kelopaknya cantik sekali untuk tanaman sekulen di meja kerja. Lubang drainasenya rapi dan catnya berbasis air yang tidak berbau. Senang bisa mendukung UMKM pengolah sampah rumah tangga.",
    isVerifiedBuyer: true,
    helpfulCount: 11,
    wasteMaterialTag: "Plastik HDPE",
  },
  {
    id: "rev-005",
    productId: "prd-pot-001",
    authorName: "Maya Indriani",
    rating: 5,
    date: "14 Oktober 2026",
    title: "Kuat, ringan, dan warna kelopaknya cerah",
    comment:
      "Sangat suka dengan konsepnya. Botol HDPE tebal diubah jadi pot bertekstur kelopak bunga. Sudah disiram berkali-kali catnya tetap tahan air.",
    isVerifiedBuyer: true,
    helpfulCount: 6,
    wasteMaterialTag: "Plastik HDPE",
  },
  {
    id: "rev-006",
    productId: "prd-toy-001",
    authorName: "Bambang Setiawan",
    rating: 5,
    date: "24 Oktober 2026",
    title: "Anak-anak suka sekali!",
    comment:
      "Figur anjing dari botol dan tutup plastik ini lucu sekali jadi pajangan edukasi di ruang belajar anak. Bagian tepi dihaluskan sehingga aman dipegang.",
    isVerifiedBuyer: true,
    helpfulCount: 8,
    wasteMaterialTag: "Botol & Tutup PET",
  },
  {
    id: "rev-007",
    productId: "prd-col-001",
    authorName: "Rendra Wicaksana",
    rating: 5,
    date: "20 Oktober 2026",
    title: "Detail lekukan kuda luar biasa presisi",
    comment:
      "Sebagai kolektor barang seni sirkular, karya ini patut diacungi jempol. Transparansi plastik botol PET memberikan efek kristal yang dramatis saat terkena sinar lampu sorot.",
    isVerifiedBuyer: true,
    helpfulCount: 17,
    wasteMaterialTag: "Plastik PET",
  },
];

export function getReviewsByProductId(productId: string): ProductReview[] {
  const matching = sampleProductReviews.filter((r) => r.productId === productId);
  if (matching.length > 0) return matching;

  // Fallback reviews tailored to any product
  return [
    {
      id: `rev-fallback-1-${productId}`,
      productId,
      authorName: "Citra Lestari",
      rating: 5,
      date: "25 Oktober 2026",
      title: "Finishing sangat rapi dan ramah lingkungan",
      comment:
        "Sangat terkesan dengan kerapian hasil olahan sampahnya. Detail sambungan kuat dan kokoh. Pengemasan dari toko juga rapi dan aman.",
      isVerifiedBuyer: true,
      helpfulCount: 7,
      wasteMaterialTag: "Bahan Daur Ulang",
    },
    {
      id: `rev-fallback-2-${productId}`,
      productId,
      authorName: "Reza Maulana",
      rating: 5,
      date: "18 Oktober 2026",
      title: "Karya kerajinan yang fungsional dan estetik",
      comment:
        "Pengiriman tepat waktu dan barang sesuai dengan foto deskripsi. Bagus untuk dekorasi rumah sekaligus mengedukasi keluarga tentang pemanfaatan limbah.",
      isVerifiedBuyer: true,
      helpfulCount: 4,
      wasteMaterialTag: "Upcycled Material",
    },
  ];
}
