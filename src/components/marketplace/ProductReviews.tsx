"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import {
  Star,
  ThumbsUp,
  CheckCircle,
  MessageSquare,
  PenSquare,
  X,
  Send,
  SlidersHorizontal,
  Recycle,
  Lock,
  Loader2,
} from "lucide-react";
import Swal from "sweetalert2";

import {
  getCurrentUser,
  getProductReviews,
  checkReviewEligibility,
  submitProductReview,
  type BackendReview,
  type ReviewEligibility,
} from "@/app/service/api";
import { getReviewsByProductId } from "@/constants/ReviewsData";
import { ProductReview, ReviewRatingDistribution } from "@/types/review";
import { MarketplaceProduct } from "@/types/marketplace";

interface ProductReviewsProps {
  product: MarketplaceProduct;
}

const RATING_LABELS: Record<number, string> = {
  5: "Sangat Puas",
  4: "Puas",
  3: "Cukup",
  2: "Kurang Puas",
  1: "Kecewa",
};

function mapBackendReviewToProductReview(br: BackendReview, defaultMaterial?: string): ProductReview {
  return {
    id: br.id,
    productId: br.product_id,
    authorName: br.user_name || "Pembeli Terverifikasi",
    avatarUrl: br.user_avatar || undefined,
    rating: br.rating,
    date: new Date(br.created_at).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    title: "Ulasan Pembeli Terverifikasi",
    comment: br.comment,
    isVerifiedBuyer: true,
    helpfulCount: 0,
    wasteMaterialTag: defaultMaterial,
  };
}

export default function ProductReviews({ product }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<ProductReview[]>(() => getReviewsByProductId(product.id));
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | "all">("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [eligibility, setEligibility] = useState<ReviewEligibility | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [ratingInput, setRatingInput] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [authorNameInput, setAuthorNameInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [commentInput, setCommentInput] = useState("");

  // Helpful state tracker (stores IDs of reviews voted by user)
  const [votedHelpful, setVotedHelpful] = useState<Record<string, boolean>>({});

  const loadData = useCallback(async () => {
    try {
      const [user, backendReviews, elig] = await Promise.all([
        getCurrentUser().catch(() => null),
        getProductReviews(product.id).catch(() => []),
        checkReviewEligibility(product.id).catch(() => null),
      ]);

      if (user?.name) {
        setAuthorNameInput(user.name);
      }

      if (backendReviews && backendReviews.length > 0) {
        const mappedBackend = backendReviews.map((br) => mapBackendReviewToProductReview(br, product.material));
        const mocks = getReviewsByProductId(product.id);
        setReviews([...mappedBackend, ...mocks]);
      }

      if (elig) {
        setEligibility(elig);
      }
    } catch (err) {
      console.error("Gagal memuat ulasan produk:", err);
    }
  }, [product.id, product.material]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Kalkulasi statistik rating & breakdown
  const summary = useMemo(() => {
    if (reviews.length === 0) {
      return {
        averageRating: 5.0,
        totalReviews: 0,
        distribution: [5, 4, 3, 2, 1].map((stars) => ({ stars, count: 0, percentage: 0 })),
      };
    }

    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = (sum / total).toFixed(1);

    const distribution: ReviewRatingDistribution[] = [5, 4, 3, 2, 1].map((stars) => {
      const count = reviews.filter((r) => r.rating === stars).length;
      const percentage = Math.round((count / total) * 100);
      return { stars, count, percentage };
    });

    return {
      averageRating: parseFloat(average),
      totalReviews: total,
      distribution,
    };
  }, [reviews]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    if (selectedRatingFilter === "all") return reviews;
    return reviews.filter((r) => r.rating === selectedRatingFilter);
  }, [reviews, selectedRatingFilter]);

  // Vote helpful
  const handleHelpfulClick = (reviewId: string) => {
    if (votedHelpful[reviewId]) return;

    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
    setVotedHelpful((prev) => ({ ...prev, [reviewId]: true }));
  };

  const handleToggleForm = () => {
    if (isFormOpen) {
      setIsFormOpen(false);
      return;
    }
    if (!eligibility?.can_review) {
      Swal.fire({
        icon: "info",
        title: "Ulasan Dibatasi",
        text:
          eligibility?.message ||
          "Fitur ulasan hanya terbuka untuk pembeli yang telah menerima barang dan menandai pesanan selesai.",
        confirmButtonColor: "#1C3E2B",
        confirmButtonText: "Mengerti",
        customClass: { popup: "rounded-3xl border border-gray-200" },
      });
      return;
    }
    setIsFormOpen(true);
  };

  // Submit review form
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!eligibility?.can_review || !eligibility.order_id) {
      Swal.fire({
        icon: "warning",
        title: "Akses Ulasan Dibatasi",
        text:
          eligibility?.message ||
          "Anda hanya dapat memberikan ulasan setelah menyelesaikan pesanan produk ini.",
        confirmButtonColor: "#1C3E2B",
        customClass: { popup: "rounded-3xl border border-gray-200" },
      });
      return;
    }

    if (!commentInput.trim() || commentInput.trim().length < 5) {
      Swal.fire({
        icon: "warning",
        title: "Komentar Belum Lengkap",
        text: "Tuliskan pengalaman atau kesan Anda tentang produk daur ulang ini minimal 5 karakter.",
        confirmButtonColor: "#1C3E2B",
        customClass: { popup: "rounded-3xl border border-gray-200" },
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const createdReview = await submitProductReview(product.id, {
        order_id: eligibility.order_id,
        rating: ratingInput,
        comment: commentInput.trim(),
      });

      const mapped = mapBackendReviewToProductReview(createdReview, product.material);
      setReviews((prev) => [mapped, ...prev]);
      setTitleInput("");
      setCommentInput("");
      setIsFormOpen(false);

      // Refresh eligibility so button locks
      const refreshedElig = await checkReviewEligibility(product.id).catch(() => null);
      if (refreshedElig) setEligibility(refreshedElig);

      Swal.fire({
        icon: "success",
        title: "Ulasan Berhasil Dikirim!",
        text: "Terima kasih telah memberikan ulasan. Ulasan Anda telah tampil pada halaman produk ini.",
        timer: 2500,
        showConfirmButton: false,
        customClass: { popup: "rounded-3xl border border-gray-200" },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengirimkan ulasan.";
      Swal.fire({
        icon: "error",
        title: "Gagal Mengirim",
        text: msg,
        customClass: { popup: "rounded-3xl border border-gray-200" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-20 border-t border-gray-200/80 pt-16" aria-labelledby="reviews-title">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-green-800 mb-1">
            <MessageSquare size={14} />
            <span>Transparansi Pembeli</span>
          </div>
          <h2 id="reviews-title" className="text-3xl font-black text-gray-950 tracking-tight">
            Ulasan Pembeli & Komentar
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Pengalaman nyata para pemilik karya upcycling dari material sampah terpilah.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {eligibility && !eligibility.can_review && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-[11px] font-semibold text-gray-600 border border-gray-200">
              <Lock size={12} className="text-gray-400" />
              <span>Hanya pembeli terkonfirmasi</span>
            </span>
          )}
          <button
            type="button"
            onClick={handleToggleForm}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer self-start sm:self-auto ${
              eligibility?.can_review
                ? "bg-green-900 hover:bg-green-800 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
            }`}
          >
            {eligibility?.can_review ? (
              <>
                <PenSquare size={14} />
                <span>{isFormOpen ? "Tutup Form Ulasan" : "Tulis Ulasan & Komentar"}</span>
              </>
            ) : (
              <>
                <Lock size={14} />
                <span>Tulis Ulasan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Form Tulis Ulasan (Toggled) */}
      {isFormOpen && (
        <div className="mb-10 bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-950">Bagikan Pengalaman Anda</h3>
              <p className="text-xs text-gray-500">
                Nilai kerapian pengerjaan, estetika, dan keunikan material olahan pada karya ini.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 transition cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          <form onSubmit={handleReviewSubmit} className="space-y-5">
            {/* Rating Stars Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Beri Penilaian Bintang <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= (hoverRating || ratingInput);
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingInput(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 cursor-pointer transition transform hover:scale-110"
                        aria-label={`Beri ${star} bintang`}
                      >
                        <Star
                          size={24}
                          className={
                            isFilled
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }
                        />
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-bold text-gray-800 px-3 py-1 rounded-full bg-gray-100">
                  {RATING_LABELS[hoverRating || ratingInput]}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nama Pengulas */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Nama Anda <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={authorNameInput}
                  onChange={(e) => setAuthorNameInput(e.target.value)}
                  placeholder="Nama lengkap atau panggilan"
                  className="w-full h-11 px-4 rounded-xl border border-gray-300 text-xs text-gray-900 outline-none focus:border-green-800 transition"
                  required
                />
              </div>

              {/* Judul Ulasan */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Judul Ulasan
                </label>
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="Contoh: Lampu sangat estetik dan sambungannya halus"
                  className="w-full h-11 px-4 rounded-xl border border-gray-300 text-xs text-gray-900 outline-none focus:border-green-800 transition"
                />
              </div>
            </div>

            {/* Komentar Ulasan */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Komentar & Ulasan Produk <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Ceritakan detail barang saat sampai, kerapian potongan material limbah, pengemasan, atau respon toko..."
                className="w-full p-3.5 rounded-xl border border-gray-300 text-xs text-gray-900 outline-none focus:border-green-800 transition resize-none"
                required
              />
            </div>

            {/* Tombol Aksi Form */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-5 py-2.5 rounded-full border border-gray-300 text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-green-900 hover:bg-green-800 text-white text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Send size={13} />
                    <span>Kirim Ulasan</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid: Ringkasan Rating & Daftar Ulasan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Kiri: Rating Breakdown Card (Col 1-4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-7 shadow-2xs space-y-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
              Rata-Rata Penilaian
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-black text-gray-950 tracking-tight">
                {summary.averageRating}
              </span>
              <span className="text-sm font-semibold text-gray-400">/ 5.0</span>
            </div>

            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  className={
                    star <= Math.round(summary.averageRating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-200"
                  }
                />
              ))}
              <span className="text-xs font-bold text-gray-600 ml-2">
                {summary.totalReviews} ulasan pembeli
              </span>
            </div>
          </div>

          {/* Progress Bars per Bintang */}
          <div className="space-y-2.5 pt-4 border-t border-gray-100">
            {summary.distribution.map((dist) => (
              <div key={dist.stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-semibold text-gray-700 flex items-center gap-1">
                  <span>{dist.stars}</span>
                  <Star size={11} className="fill-amber-400 text-amber-400 inline" />
                </span>

                <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-green-800 transition-all duration-500"
                    style={{ width: `${dist.percentage}%` }}
                  />
                </div>

                <span className="w-8 text-right font-mono text-[11px] text-gray-400">
                  {dist.count}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F8F4] border border-gray-200/60 text-xs text-gray-600 leading-relaxed">
            <p className="font-bold text-gray-900 mb-0.5">Ulasan Terpercaya</p>
            <p className="text-[11px]">
              Setiap ulasan memberikan masukan berharga bagi pengrajin lokal untuk terus menyempurnakan kualitas olahan sampah sirkular.
            </p>
          </div>
        </div>

        {/* Kolom Kanan: Filter & Daftar Ulasan (Col 5-12) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Filter Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-gray-200/90 shadow-2xs flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500 font-semibold mr-1 flex items-center gap-1.5 pl-1">
              <SlidersHorizontal size={13} />
              Filter:
            </span>

            <button
              type="button"
              onClick={() => setSelectedRatingFilter("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                selectedRatingFilter === "all"
                  ? "bg-green-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Semua ({reviews.length})
            </button>

            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              if (count === 0 && selectedRatingFilter !== star) return null;

              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedRatingFilter(star)}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                    selectedRatingFilter === star
                      ? "bg-green-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span>{star} Bintang</span>
                  <span className="text-[10px] opacity-75 font-mono">({count})</span>
                </button>
              );
            })}
          </div>

          {/* List Kartu Ulasan */}
          {filteredReviews.length > 0 ? (
            <div className="space-y-4">
              {filteredReviews.map((rev) => (
                <article
                  key={rev.id}
                  className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-7 shadow-2xs transition hover:border-gray-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 border border-green-200 text-green-900 font-bold flex items-center justify-center text-sm shrink-0">
                        {rev.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-gray-950">{rev.authorName}</h4>
                          {rev.isVerifiedBuyer && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-800 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                              <CheckCircle size={10} /> Pembeli Terverifikasi
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-400">{rev.date}</span>
                      </div>
                    </div>

                    {/* Star Rating Badge */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          className={
                            star <= rev.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-200"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {/* Konten Komentar */}
                  <div className="pt-4">
                    {rev.title && (
                      <h5 className="font-bold text-sm text-gray-950 mb-1.5">{rev.title}</h5>
                    )}
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      {rev.comment}
                    </p>

                    {rev.wasteMaterialTag && (
                      <div className="mt-3.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F7F8F4] border border-gray-200 text-[10px] font-semibold text-gray-600">
                        <Recycle size={11} className="text-green-700" />
                        <span>Bahan: {rev.wasteMaterialTag}</span>
                      </div>
                    )}
                  </div>

                  {/* Helpful Button */}
                  <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span className="text-[11px]">Apakah ulasan ini membantu Anda?</span>
                    <button
                      type="button"
                      onClick={() => handleHelpfulClick(rev.id)}
                      disabled={votedHelpful[rev.id]}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition cursor-pointer text-xs font-semibold ${
                        votedHelpful[rev.id]
                          ? "bg-green-50 border-green-200 text-green-800 cursor-default"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <ThumbsUp size={12} className={votedHelpful[rev.id] ? "fill-green-800" : ""} />
                      <span>Membantu ({rev.helpfulCount})</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-200/90 p-10 text-center shadow-2xs">
              <p className="font-bold text-gray-950 text-sm">Tidak ada ulasan pada filter ini</p>
              <p className="text-xs text-gray-500 mt-1">
                Silakan pilih filter bintang yang lain untuk melihat ulasan pembeli.
              </p>
              <button
                type="button"
                onClick={() => setSelectedRatingFilter("all")}
                className="mt-4 px-5 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition cursor-pointer"
              >
                Tampilkan Semua Ulasan
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
