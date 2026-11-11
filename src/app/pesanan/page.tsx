"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  MapPin,
  MessageSquare,
  Package,
  Star,
  Truck,
  X,
} from "lucide-react";
import Swal from "sweetalert2";

import {
  completeOrder,
  getCurrentUser,
  getMyOrders,
  markOrderPaid,
  submitProductReview,
  type OrderDetail,
} from "@/app/service/api";
import { formatMarketplacePrice } from "@/utils/marketplace";

export default function PesananSayaPage() {
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ALL" | "DIPROSES" | "DIKIRIM" | "SELESAI" | "PENDING">("ALL");
  const [copiedResi, setCopiedResi] = useState<string | null>(null);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedReviewItem, setSelectedReviewItem] = useState<{
    orderId: string;
    productId: string;
    productName: string;
    productImage?: string;
  } | null>(null);
  const [ratingInput, setRatingInput] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentInput, setCommentInput] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewedProductIds, setReviewedProductIds] = useState<Record<string, boolean>>({});

  const fetchOrders = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        setLoading(false);
        return;
      }
      const data = await getMyOrders();
      setOrders(data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCopyResi = (resi: string) => {
    navigator.clipboard.writeText(resi);
    setCopiedResi(resi);
    setTimeout(() => setCopiedResi(null), 2000);
  };

  const handleCompleteOrder = async (orderId: string, orderNumber: string) => {
    const result = await Swal.fire({
      title: "Konfirmasi Penerimaan Barang",
      text: `Apakah Anda sudah menerima pesanan #${orderNumber} dengan baik? Pesanan akan ditandai selesai.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#14532d",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Pesanan Selesai",
      cancelButtonText: "Belum",
      customClass: { popup: "rounded-3xl" },
    });

    if (result.isConfirmed) {
      try {
        await completeOrder(orderId);
        Swal.fire({
          icon: "success",
          title: "Pesanan Selesai!",
          text: "Terima kasih telah mengonfirmasi. Sekarang Anda dapat memberikan ulasan untuk produk ini.",
          confirmButtonColor: "#14532d",
          customClass: { popup: "rounded-3xl" },
        });
        fetchOrders();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Gagal menyelesaikan pesanan.";
        Swal.fire({ icon: "error", title: "Gagal", text: msg, customClass: { popup: "rounded-3xl" } });
      }
    }
  };

  const handlePayPendingOrder = (order: OrderDetail) => {
    if (!order.snap_token) {
      Swal.fire({
        icon: "error",
        title: "Token Tidak Ditemukan",
        text: "Token pembayaran tidak tersedia. Silakan hubungi admin.",
        customClass: { popup: "rounded-3xl" },
      });
      return;
    }

    if (window.snap && typeof window.snap.pay === "function") {
      window.snap.pay(order.snap_token, {
        onSuccess: async () => {
          await markOrderPaid(order.id);
          Swal.fire({
            icon: "success",
            title: "Pembayaran Berhasil!",
            text: "Status pesanan Anda kini sedang diproses oleh toko.",
            confirmButtonColor: "#14532d",
            customClass: { popup: "rounded-3xl" },
          });
          fetchOrders();
        },
        onPending: () => {
          Swal.fire({
            icon: "info",
            title: "Menunggu Pembayaran",
            text: "Silakan selesaikan pembayaran sesuai instruksi tagihan.",
            confirmButtonColor: "#14532d",
            customClass: { popup: "rounded-3xl" },
          });
          fetchOrders();
        },
      });
    } else if (order.snap_redirect_url) {
      window.location.href = order.snap_redirect_url;
    }
  };

  const openReviewModal = (orderId: string, item: OrderDetail["items"][0]) => {
    setSelectedReviewItem({
      orderId,
      productId: item.product_id,
      productName: item.product_name,
      productImage: item.product_image,
    });
    setRatingInput(5);
    setCommentInput("");
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedReviewItem) return;
    if (!commentInput.trim() || commentInput.trim().length < 3) {
      Swal.fire({
        icon: "warning",
        title: "Ulasan Kurang Lengkap",
        text: "Silakan masukkan ulasan minimal 3 karakter.",
        customClass: { popup: "rounded-3xl" },
      });
      return;
    }

    setSubmittingReview(true);
    try {
      await submitProductReview(selectedReviewItem.productId, {
        order_id: selectedReviewItem.orderId,
        rating: ratingInput,
        comment: commentInput.trim(),
      });

      setReviewedProductIds((prev) => ({
        ...prev,
        [`${selectedReviewItem.orderId}-${selectedReviewItem.productId}`]: true,
      }));

      setReviewModalOpen(false);
      Swal.fire({
        icon: "success",
        title: "Ulasan Terkirim!",
        text: "Terima kasih telah berbagi ulasan tentang karya daur ulang ini.",
        confirmButtonColor: "#14532d",
        customClass: { popup: "rounded-3xl" },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengirimkan ulasan.";
      Swal.fire({ icon: "error", title: "Gagal Mengirim", text: msg, customClass: { popup: "rounded-3xl" } });
    } finally {
      setSubmittingReview(false);
    }
  };

  const filteredOrders = useMemo(() => {
    if (activeTab === "ALL") return orders;
    return orders.filter((o) => o.status === activeTab);
  }, [orders, activeTab]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DIPROSES":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200">
            <Clock size={13} />
            <span>Diproses Penjual</span>
          </span>
        );
      case "DIKIRIM":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800 border border-blue-200">
            <Truck size={13} />
            <span>Sedang Dikirim</span>
          </span>
        );
      case "SELESAI":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-900 border border-green-200">
            <CheckCircle2 size={13} />
            <span>Pesanan Selesai</span>
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700 border border-gray-200">
            <CreditCard size={13} />
            <span>Menunggu Pembayaran</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700 border border-red-200">
            <span>{status}</span>
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8F4] pt-32 pb-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8F4] text-gray-900 pb-28 pt-32 sm:pt-36">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Header Navigation */}
        <div className="mb-8">
          <Link
            href="/profil"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-green-900 transition-colors mb-2"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Profil</span>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-gray-950">Pesanan Saya</h1>
              <p className="text-xs text-gray-500 mt-1">
                Lacak status pengiriman barang pesananmu dan berikan ulasan setelah paket tiba.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Filter Status */}
        <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200/80 pb-4">
          {[
            { id: "ALL", label: "Semua Pesanan" },
            { id: "DIPROSES", label: "Diproses" },
            { id: "DIKIRIM", label: "Dikirim" },
            { id: "SELESAI", label: "Selesai" },
            { id: "PENDING", label: "Menunggu Bayar" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === tab.id
                  ? "bg-green-900 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Daftar Pesanan */}
        {filteredOrders.length === 0 ? (
          <div className="rounded-[2rem] border border-gray-200/80 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 border border-gray-100">
              <Package size={24} />
            </div>
            <h3 className="text-base font-bold text-gray-950">Belum Ada Pesanan</h3>
            <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
              Tidak ada pesanan pada kategori status ini. Temukan produk daur ulang menarik di Marketplace Limbara.
            </p>
            <div className="mt-6">
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 rounded-2xl bg-green-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-green-800"
              >
                <span>Jelajahi Marketplace</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-7 shadow-sm transition hover:border-gray-300"
              >
                {/* Header Kartu Pesanan */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-gray-900">
                      #{order.order_number}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div>{getStatusBadge(order.status)}</div>
                </div>

                {/* List Barang dalam Pesanan */}
                <div className="mt-5 space-y-4">
                  {order.items.map((it) => {
                    const reviewKey = `${order.id}-${it.product_id}`;
                    const isReviewed = reviewedProductIds[reviewKey];

                    return (
                      <div
                        key={it.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50/50 p-4"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-200/80 bg-white">
                            <Image
                              src={it.product_image || "/img/marketplace/default.jpg"}
                              alt={it.product_name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-gray-950 sm:text-sm line-clamp-1">
                              {it.product_name}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {it.quantity} barang x {formatMarketplacePrice(it.price)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-gray-200/60 pt-2 sm:pt-0">
                          <span className="text-xs font-bold text-gray-950 tabular-nums">
                            {formatMarketplacePrice(it.subtotal)}
                          </span>

                          {/* Tombol Beri Ulasan (HANYA TERSEDIA JIKA STATUS SELESAI) */}
                          {order.status === "SELESAI" && (
                            <button
                              type="button"
                              disabled={isReviewed}
                              onClick={() => openReviewModal(order.id, it)}
                              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                                isReviewed
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-green-900 text-white hover:bg-green-800 shadow-sm"
                              }`}
                            >
                              <MessageSquare size={13} />
                              <span>{isReviewed ? "Sudah Diulas" : "Beri Ulasan"}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Info Pengiriman & Resi */}
                <div className="mt-5 grid gap-4 rounded-2xl border border-gray-100 bg-white p-4 sm:grid-cols-2 text-xs">
                  <div>
                    <span className="font-semibold text-gray-500">Tujuan Pengiriman:</span>
                    <p className="mt-1 font-medium text-gray-900 flex items-start gap-1.5">
                      <MapPin size={14} className="mt-0.5 shrink-0 text-gray-400" />
                      <span>
                        {order.recipient_name} ({order.recipient_phone}) <br />
                        {order.shipping_address}, {order.shipping_city}, {order.shipping_province}
                      </span>
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-gray-500">Kurir & Resi:</span>
                    <p className="mt-1 font-medium text-gray-900 flex items-center gap-1.5">
                      <Truck size={14} className="shrink-0 text-gray-400" />
                      <span>{order.courier.toUpperCase()} - {order.courier_service}</span>
                    </p>
                    {order.tracking_number ? (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="rounded-lg bg-gray-100 px-2 py-1 font-mono font-bold text-gray-800">
                          {order.tracking_number}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyResi(order.tracking_number!)}
                          className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-[11px] font-semibold text-gray-600 hover:bg-gray-50 transition"
                        >
                          {copiedResi === order.tracking_number ? (
                            <>
                              <Check size={12} className="text-green-700" />
                              <span className="text-green-700">Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <p className="mt-1 text-gray-400 italic">No. resi belum diinput penjual</p>
                    )}
                  </div>
                </div>

                {/* Footer Kartu: Total & Action Buttons */}
                <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-gray-100 pt-4">
                  <div className="text-xs">
                    <span className="text-gray-500">Total Belanja (termasuk ongkir): </span>
                    <span className="text-base font-black text-gray-950 tabular-nums">
                      {formatMarketplacePrice(order.total_amount)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Tombol Bayar Sekarang jika masih PENDING */}
                    {order.status === "PENDING" && (
                      <button
                        type="button"
                        onClick={() => handlePayPendingOrder(order)}
                        className="rounded-2xl bg-green-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-green-800 shadow-sm"
                      >
                        Bayar Sekarang
                      </button>
                    )}

                    {/* Tombol Pesanan Selesai jika DIKIRIM */}
                    {order.status === "DIKIRIM" && (
                      <button
                        type="button"
                        onClick={() => handleCompleteOrder(order.id, order.order_number)}
                        className="flex items-center gap-2 rounded-2xl bg-green-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-green-800 shadow-sm"
                      >
                        <CheckCircle2 size={14} />
                        <span>Pesanan Selesai</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Beri Ulasan */}
      {reviewModalOpen && selectedReviewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-gray-200/80 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-gray-950">Beri Ulasan Produk</h3>
                <p className="text-xs text-gray-500">Bagikan kepuasanmu terhadap karya daur ulang ini</p>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="rounded-xl p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
                <Image
                  src={selectedReviewItem.productImage || "/img/marketplace/default.jpg"}
                  alt={selectedReviewItem.productName}
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-xs font-bold text-gray-950 line-clamp-2">
                {selectedReviewItem.productName}
              </h4>
            </div>

            {/* Bintang Rating */}
            <div className="mt-5 text-center">
              <label className="text-xs font-bold text-gray-700 block mb-2">Penilaian Anda</label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRatingInput(star)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      size={26}
                      className={
                        (hoverRating || ratingInput) >= star
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Input Komentar */}
            <div className="mt-5">
              <label className="text-xs font-bold text-gray-700 block mb-1.5">
                Komentar & Pengalaman
              </label>
              <textarea
                rows={4}
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Ceritakan kualitas bahan, kerapian daur ulang, atau kegunaannya..."
                className="w-full rounded-2xl border border-gray-200 bg-white p-3.5 text-xs text-gray-900 outline-none transition focus:border-green-800 focus:ring-2 focus:ring-green-800/10"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 transition"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={submittingReview}
                onClick={handleSubmitReview}
                className="rounded-2xl bg-green-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-green-800 disabled:opacity-50 transition shadow-sm"
              >
                {submittingReview ? "Mengirim..." : "Kirim Ulasan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
