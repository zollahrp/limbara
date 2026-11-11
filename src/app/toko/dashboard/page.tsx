"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Store,
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  ExternalLink,
  MapPin,
  Recycle,
  Truck,
  Eye,
  EyeOff,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  X,
  Loader2,
} from "lucide-react";
import Swal from "sweetalert2";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductFormModal from "@/components/toko/ProductFormModal";
import ShopEditModal from "@/components/toko/ShopEditModal";
import {
  deleteProduct,
  getCurrentUser,
  getMyProducts,
  getMyShop,
  getShopDashboardStats,
  getShopOrders,
  shipShopOrder,
  toggleProductActive,
  type OrderDetail,
} from "@/app/service/api";
import { DashboardStats, ProductItem, ShopData } from "@/types/marketplace";
import { formatMarketplacePrice } from "@/utils/marketplace";

export default function TokoDashboardPage() {
  const router = useRouter();

  const [shop, setShop] = useState<ShopData | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "overview">("products");

  // Orders state
  const [shopOrders, setShopOrders] = useState<OrderDetail[]>([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState<"ALL" | "DIPROSES" | "DIKIRIM" | "SELESAI">("ALL");
  const [shippingModalOpen, setShippingModalOpen] = useState(false);
  const [orderToShip, setOrderToShip] = useState<OrderDetail | null>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState("");
  const [isSubmittingShipping, setIsSubmittingShipping] = useState(false);
  const [copiedResi, setCopiedResi] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isShopEditOpen, setIsShopEditOpen] = useState(false);

  const loadDashboardData = useCallback(async () => {
    try {
      const [currentUser, currentShop] = await Promise.all([
        getCurrentUser(),
        getMyShop(),
      ]);

      if (!currentUser) {
        router.replace("/login");
        return;
      }

      if (!currentShop) {
        Swal.fire({
          icon: "info",
          title: "Belum Memiliki Toko",
          text: "Anda belum membuka toko. Silakan daftarkan toko Anda terlebih dahulu.",
          confirmButtonColor: "#1C3E2B",
          confirmButtonText: "Buka Toko",
          customClass: { popup: "rounded-3xl border border-gray-200" },
        }).then(() => {
          router.replace("/toko/buat");
        });
        return;
      }
      setShop(currentShop);

      const [dashStats, productList, orderList] = await Promise.all([
        getShopDashboardStats().catch(() => null),
        getMyProducts().catch(() => []),
        getShopOrders().catch(() => []),
      ]);

      setStats(dashStats);
      setProducts(productList);
      setShopOrders(orderList);
    } catch (err) {
      console.error("Gagal memuat dashboard toko:", err);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tabParam = new URLSearchParams(window.location.search).get("tab");
      if (tabParam === "orders") setActiveTab("orders");
      else if (tabParam === "overview") setActiveTab("overview");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadDashboardData(), 0);
    return () => window.clearTimeout(timer);
  }, [loadDashboardData]);

  const handleOpenShipModal = (order: OrderDetail) => {
    setOrderToShip(order);
    setTrackingNumberInput(order.tracking_number || "");
    setShippingModalOpen(true);
  };

  const handleConfirmShipOrder = async () => {
    if (!orderToShip) return;
    const resi = trackingNumberInput.trim();
    if (!resi) {
      Swal.fire({
        icon: "warning",
        title: "Nomor Resi Kosong",
        text: "Silakan masukkan nomor resi pengiriman terlebih dahulu.",
        customClass: { popup: "rounded-3xl" },
      });
      return;
    }

    setIsSubmittingShipping(true);
    try {
      await shipShopOrder(orderToShip.id, resi);
      setShippingModalOpen(false);
      Swal.fire({
        icon: "success",
        title: "Pesanan Dikirim!",
        text: `Pesanan #${orderToShip.order_number} berhasil diperbarui menjadi Dikirim dengan resi ${resi}.`,
        confirmButtonColor: "#14532d",
        customClass: { popup: "rounded-3xl" },
      });
      loadDashboardData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui status pengiriman.";
      Swal.fire({ icon: "error", title: "Gagal", text: msg, customClass: { popup: "rounded-3xl" } });
    } finally {
      setIsSubmittingShipping(false);
    }
  };

  const filteredShopOrders = useMemo(() => {
    if (orderStatusFilter === "ALL") return shopOrders;
    return shopOrders.filter((o) => o.status === orderStatusFilter);
  }, [shopOrders, orderStatusFilter]);

  // Toggle status aktif/nonaktif produk
  const handleToggleActive = async (product: ProductItem) => {
    const newStatus = !product.is_active;
    try {
      await toggleProductActive(product.id, newStatus);
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_active: newStatus } : p))
      );
      if (stats) {
        setStats({
          ...stats,
          active_products: stats.active_products + (newStatus ? 1 : -1),
          inactive_products: stats.inactive_products + (newStatus ? -1 : 1),
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Gagal Mengubah Status",
        text: "Terjadi kesalahan saat mengubah status produk.",
      });
    }
  };

  // Hapus produk
  const handleDeleteProduct = (product: ProductItem) => {
    Swal.fire({
      title: "Hapus Produk Ini?",
      text: `Produk "${product.name}" akan dihapus permanen dari toko Anda.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      customClass: {
        popup: "rounded-3xl border border-gray-200",
        confirmButton: "rounded-xl px-5 py-2.5",
        cancelButton: "rounded-xl px-5 py-2.5",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteProduct(product.id);
          setProducts((prev) => prev.filter((p) => p.id !== product.id));
          Swal.fire({
            icon: "success",
            title: "Produk Dihapus",
            timer: 1500,
            showConfirmButton: false,
          });
          loadDashboardData();
        } catch {
          Swal.fire({
            icon: "error",
            title: "Gagal Menghapus",
            text: "Tidak dapat menghapus produk ini.",
          });
        }
      }
    });
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: ProductItem) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.waste_material.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && p.is_active) ||
        (statusFilter === "inactive" && !p.is_active);

      return matchSearch && matchStatus;
    });
  }, [products, searchQuery, statusFilter]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F8F4] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-200 border-t-green-700 rounded-full animate-spin" />
      </div>
    );
  }

  if (!shop) return null;

  return (
    <main className="min-h-screen bg-[#F7F8F4] text-gray-950 flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="mx-auto max-w-screen-xl px-6 pb-24 pt-32 sm:px-10 lg:px-16 lg:pt-36">
          {/* Header Dashboard Toko */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-gray-200">
            <div>
              <div className="mb-1.5 flex items-center gap-2 text-xs font-bold text-green-800">
                <Store size={14} />
                <span>Dashboard Pengrajin Daur Ulang</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
                {shop.name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center gap-2">
                <MapPin size={13} className="text-gray-400" />
                {shop.city}, {shop.province} · <span className="text-gray-400">/{shop.slug}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 transition"
              >
                Lihat Marketplace
                <ExternalLink size={13} />
              </Link>

              <button
                type="button"
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-green-900 hover:bg-green-800 text-white text-xs font-bold shadow-sm transition cursor-pointer"
              >
                <Plus size={15} />
                Tambah Produk
              </button>
            </div>
          </div>

          {/* Kartu Ringkasan Metrik Toko (4 Kartu dengan Border Rapih) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                Total Produk
              </span>
              <p className="text-2xl sm:text-3xl font-black text-gray-950 mt-1">
                {stats?.total_products ?? products.length}
              </p>
              <span className="text-[10px] text-gray-400 mt-1 block">Kerajinan terdaftar</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-green-800 block">
                Produk Aktif
              </span>
              <p className="text-2xl sm:text-3xl font-black text-green-900 mt-1">
                {stats?.active_products ?? products.filter((p) => p.is_active).length}
              </p>
              <span className="text-[10px] text-gray-400 mt-1 block">Tayang di etalase</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                Total Stok
              </span>
              <p className="text-2xl sm:text-3xl font-black text-gray-950 mt-1">
                {stats?.total_stock ?? products.reduce((sum, p) => sum + p.stock, 0)}
              </p>
              <span className="text-[10px] text-gray-400 mt-1 block">Unit siap kirim</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
                Produk Nonaktif
              </span>
              <p className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
                {stats?.inactive_products ?? products.filter((p) => !p.is_active).length}
              </p>
              <span className="text-[10px] text-gray-400 mt-1 block">Disimpan sebagai draft</span>
            </div>
          </div>

          {/* Tab Navigasi: Produk & Info Toko */}
          <div className="flex items-center gap-3 border-b border-gray-200 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab("products")}
              className={`pb-3 text-xs font-bold transition border-b-2 cursor-pointer ${
                activeTab === "products"
                  ? "border-green-900 text-green-950 font-black"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              Katalog Produk ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`pb-3 text-xs font-bold transition border-b-2 cursor-pointer flex items-center gap-2 ${
                activeTab === "orders"
                  ? "border-green-900 text-green-950 font-black"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              <span>Pesanan Masuk</span>
              <span className="rounded-full bg-amber-100 text-amber-900 px-2 py-0.5 text-[10px] font-bold">
                {shopOrders.filter((o) => o.status === "DIPROSES").length} perlu kirim
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`pb-3 text-xs font-bold transition border-b-2 cursor-pointer ${
                activeTab === "overview"
                  ? "border-green-900 text-green-950 font-black"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              Informasi Toko
            </button>
          </div>

          {/* TAB 1: DAFTAR & MANAJEMEN PRODUK */}
          {activeTab === "products" && (
            <div className="space-y-6">
              {/* Filter & Search Bar */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari produk berdasarkan nama, material, kategori..."
                    className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-300 text-xs text-gray-900 outline-none focus:border-green-800"
                  />
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
                  <span className="text-xs text-gray-500 font-semibold mr-1">Status:</span>
                  {(["all", "active", "inactive"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                        statusFilter === st
                          ? "bg-green-900 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {st === "all" ? "Semua" : st === "active" ? "Aktif" : "Nonaktif (Draft)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tabel Produk */}
              {filteredProducts.length > 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50/70 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                          <th className="py-3.5 px-4">Produk Kerajinan</th>
                          <th className="py-3.5 px-4">Kategori & Material</th>
                          <th className="py-3.5 px-4">Harga</th>
                          <th className="py-3.5 px-4">Stok</th>
                          <th className="py-3.5 px-4 text-center">Status Etalase</th>
                          <th className="py-3.5 px-4 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50/50 transition">
                            {/* Foto & Nama Produk */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                                  <Image
                                    src={product.image_url}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                  />
                                </div>
                                <div className="min-w-0 max-w-xs">
                                  <p className="font-bold text-gray-950 truncate text-sm">
                                    {product.name}
                                  </p>
                                  <p className="text-[10px] text-gray-400 truncate">
                                    /{product.slug}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Kategori & Bahan */}
                            <td className="py-3.5 px-4">
                              <span className="inline-block px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-semibold mb-1">
                                {product.category}
                              </span>
                              <p className="text-gray-500 text-[11px] flex items-center gap-1">
                                <Recycle size={11} className="text-green-700" />
                                {product.waste_material}
                              </p>
                            </td>

                            {/* Harga */}
                            <td className="py-3.5 px-4 font-black text-gray-950 text-sm">
                              {formatMarketplacePrice(product.price)}
                            </td>

                            {/* Stok */}
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  product.stock > 3
                                    ? "bg-green-50 text-green-800"
                                    : product.stock > 0
                                    ? "bg-amber-50 text-amber-800"
                                    : "bg-red-50 text-red-700"
                                }`}
                              >
                                {product.stock} unit
                              </span>
                            </td>

                            {/* Status Penayangan Toggle */}
                            <td className="py-3.5 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleActive(product)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition cursor-pointer border ${
                                  product.is_active
                                    ? "bg-green-50 border-green-200 text-green-800 hover:bg-green-100"
                                    : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200"
                                }`}
                                title={product.is_active ? "Klik untuk menonaktifkan" : "Klik untuk mengaktifkan"}
                              >
                                {product.is_active ? (
                                  <>
                                    <Eye size={12} /> Aktif
                                  </>
                                ) : (
                                  <>
                                    <EyeOff size={12} /> Nonaktif
                                  </>
                                )}
                              </button>
                            </td>

                            {/* Aksi Edit & Hapus */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditModal(product)}
                                  className="w-8 h-8 rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-white flex items-center justify-center text-gray-600 hover:text-gray-900 transition cursor-pointer"
                                  title="Edit Produk"
                                >
                                  <Edit size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProduct(product)}
                                  className="w-8 h-8 rounded-lg border border-red-200 hover:border-red-400 hover:bg-red-50 flex items-center justify-center text-red-600 transition cursor-pointer"
                                  title="Hapus Produk"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* Empty State */
                <div className="bg-white rounded-3xl border border-gray-200/90 p-12 text-center max-w-lg mx-auto shadow-2xs">
                  <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-200 text-green-800 flex items-center justify-center mx-auto mb-4">
                    <Package size={26} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-950">
                    {searchQuery ? "Produk Tidak Ditemukan" : "Belum Ada Produk Kerajinan"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                    {searchQuery
                      ? "Coba gunakan kata kunci pencarian yang lain."
                      : "Mulai isi etalase toko Anda dengan mengunggah karya kerajinan daur ulang pertama Anda."}
                  </p>
                  {!searchQuery && (
                    <button
                      type="button"
                      onClick={handleOpenAddModal}
                      className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-green-900 hover:bg-green-800 text-white text-xs font-bold transition cursor-pointer"
                    >
                      <Plus size={14} />
                      Tambah Produk Pertama
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB: MANAJEMEN PESANAN MASUK */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              {/* Filter Status Pesanan */}
              <div className="flex flex-wrap gap-2 pb-2">
                {[
                  { id: "ALL", label: `Semua (${shopOrders.length})` },
                  { id: "DIPROSES", label: `Perlu Dikirim (${shopOrders.filter((o) => o.status === "DIPROSES").length})` },
                  { id: "DIKIRIM", label: `Sedang Dikirim (${shopOrders.filter((o) => o.status === "DIKIRIM").length})` },
                  { id: "SELESAI", label: `Selesai (${shopOrders.filter((o) => o.status === "SELESAI").length})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setOrderStatusFilter(tab.id as typeof orderStatusFilter)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                      orderStatusFilter === tab.id
                        ? "bg-green-900 text-white shadow-sm"
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/80"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {filteredShopOrders.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-200/90 p-12 text-center max-w-lg mx-auto shadow-2xs">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-200 text-gray-400 flex items-center justify-center mx-auto mb-4">
                    <Package size={26} />
                  </div>
                  <h3 className="text-base font-bold text-gray-950">Belum Ada Pesanan Masuk</h3>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                    Pesanan dari pembeli akan muncul di sini saat pembayaran berhasil terkonfirmasi.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredShopOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-2xs transition hover:border-gray-300"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-4">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-xs text-gray-900">#{order.order_number}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-500">
                            {new Date(order.created_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div>
                          {order.status === "DIPROSES" && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200">
                              <Clock size={13} />
                              <span>Perlu Dikirim</span>
                            </span>
                          )}
                          {order.status === "DIKIRIM" && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800 border border-blue-200">
                              <Truck size={13} />
                              <span>Sedang Dikirim</span>
                            </span>
                          )}
                          {order.status === "SELESAI" && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-900 border border-green-200">
                              <CheckCircle2 size={13} />
                              <span>Selesai</span>
                            </span>
                          )}
                          {order.status === "PENDING" && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700 border border-gray-200">
                              <span>Menunggu Pembayaran</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Item yang Dipesan */}
                      <div className="mt-4 space-y-3">
                        {order.items.map((it) => (
                          <div key={it.id} className="flex items-center gap-3.5 rounded-2xl bg-gray-50/60 p-3 border border-gray-100">
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-gray-200/80 bg-white">
                              <Image
                                src={it.product_image || "/img/marketplace/default.jpg"}
                                alt={it.product_name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-gray-950 line-clamp-1">{it.product_name}</h4>
                              <p className="text-[11px] text-gray-500 mt-0.5">
                                {it.quantity} unit x {formatMarketplacePrice(it.price)}
                              </p>
                            </div>
                            <span className="text-xs font-bold text-gray-950 tabular-nums">
                              {formatMarketplacePrice(it.subtotal)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Informasi Pembeli & Pengiriman */}
                      <div className="mt-4 grid gap-3 sm:grid-cols-2 rounded-2xl bg-[#F7F8F4] p-4 text-xs border border-gray-200/60">
                        <div>
                          <span className="text-gray-500 font-semibold block">Penerima & Alamat:</span>
                          <p className="font-bold text-gray-900 mt-0.5">
                            {order.recipient_name} ({order.recipient_phone})
                          </p>
                          <p className="text-gray-600 mt-0.5">
                            {order.shipping_address}, {order.shipping_city}, {order.shipping_province} ({order.shipping_postal_code || "-"})
                          </p>
                          {order.notes && (
                            <p className="text-amber-800 bg-amber-50/80 p-2 rounded-lg mt-2 text-[11px]">
                              Catatan: {order.notes}
                            </p>
                          )}
                        </div>

                        <div>
                          <span className="text-gray-500 font-semibold block">Jasa Ekspedisi:</span>
                          <p className="font-bold text-gray-900 mt-0.5">
                            {order.courier.toUpperCase()} - {order.courier_service}
                          </p>
                          <div className="mt-2">
                            <span className="text-gray-500 block">Nomor Resi:</span>
                            {order.tracking_number ? (
                              <div className="mt-1 flex items-center gap-2">
                                <span className="rounded-lg bg-white px-2.5 py-1 font-mono font-bold text-gray-900 border border-gray-200">
                                  {order.tracking_number}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(order.tracking_number!);
                                    setCopiedResi(order.tracking_number!);
                                    setTimeout(() => setCopiedResi(null), 2000);
                                  }}
                                  className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50"
                                >
                                  {copiedResi === order.tracking_number ? <Check size={12} className="text-green-700" /> : <Copy size={12} />}
                                  <span>{copiedResi === order.tracking_number ? "Tersalin" : "Salin"}</span>
                                </button>
                              </div>
                            ) : (
                              <span className="text-gray-400 italic mt-0.5 block">Belum ada nomor resi</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Footer: Tombol Aksi Kirim Pesanan */}
                      <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-gray-100 pt-4">
                        <div className="text-xs">
                          <span className="text-gray-500">Total Pembayaran Produk: </span>
                          <span className="font-black text-gray-950 text-sm tabular-nums">
                            {formatMarketplacePrice(order.total_amount)}
                          </span>
                        </div>

                        {order.status === "DIPROSES" && (
                          <button
                            type="button"
                            onClick={() => handleOpenShipModal(order)}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-green-800 shadow-sm transition"
                          >
                            <Truck size={14} />
                            <span>Kirim Pesanan (Input No. Resi)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: OVERVIEW INFORMASI TOKO */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200/90 p-8 shadow-2xs space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {shop.logo_url && <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-gray-100"><Image src={shop.logo_url} alt={`Foto ${shop.name}`} fill sizes="64px" className="object-cover" /></div>}
                    <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-green-800 block mb-1">
                    Profil Toko Terdaftar
                  </span>
                  <h2 className="text-2xl font-black text-gray-950">{shop.name}</h2>
                  {shop.description && (
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">&ldquo;{shop.description}&rdquo;</p>
                  )}
                    </div>
                  </div>
                  <button type="button" onClick={() => setIsShopEditOpen(true)} className="inline-flex shrink-0 items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-xs font-bold text-gray-800 hover:bg-gray-50"><Edit size={13} /> Edit toko</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-gray-100">
                  <div className="p-3.5 rounded-2xl bg-[#F7F8F4] border border-gray-200/60">
                    <span className="font-bold text-gray-900 block mb-0.5">Material Utama</span>
                    <span className="text-gray-600">{shop.waste_focus || "Aneka Bahan Daur Ulang"}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F7F8F4] border border-gray-200/60">
                    <span className="font-bold text-gray-900 block mb-0.5">Lokasi Workshop</span>
                    <span className="text-gray-600">{shop.city}, {shop.province}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F7F8F4] border border-gray-200/60">
                    <span className="font-bold text-gray-900 block mb-0.5">Kontak WhatsApp</span>
                    <span className="text-gray-600">{shop.phone_number}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F7F8F4] border border-gray-200/60">
                    <span className="font-bold text-gray-900 block mb-0.5">Email Toko</span>
                    <span className="text-gray-600">{shop.email || "-"}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7F8F4] border border-gray-200/60 text-xs">
                  <span className="font-bold text-gray-900 block mb-1">Alamat Penjemputan / Pengiriman</span>
                  <p className="text-gray-600">{shop.address}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-2xs">
                  <h3 className="text-sm font-bold text-gray-950 flex items-center gap-2 mb-3">
                    <Truck size={16} className="text-green-800" />
                    Kurir yang Didukung
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {shop.courier_options && shop.courier_options.length > 0 ? (
                      shop.courier_options.map((c) => (
                        <span key={c} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                          {c}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500">Standar pengiriman reguler</span>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-2xs text-xs text-gray-600 leading-relaxed">
                  <p className="font-bold text-gray-900 mb-1">Tips Meningkatkan Penjualan</p>
                  <p>
                    Pastikan foto produk yang diunggah menampilkan detail kreasi dari sampah dengan jelas, cantumkan estimasi dampak lingkungan botol/kardus yang diselamatkan untuk menarik minat pembeli eco-conscious.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Form Tambah / Edit Produk */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadDashboardData}
        initialProduct={editingProduct}
      />
      <ShopEditModal
        shop={shop}
        isOpen={isShopEditOpen}
        onClose={() => setIsShopEditOpen(false)}
        onSaved={setShop}
      />

      {/* Modal Input Nomor Resi Pengiriman */}
      {shippingModalOpen && orderToShip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-green-800">
                  Konfirmasi Pengiriman
                </span>
                <h3 className="text-base font-black text-gray-950">
                  Kirim Pesanan #{orderToShip.order_number}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShippingModalOpen(false)}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="rounded-2xl bg-[#F7F8F4] p-3 text-xs border border-gray-200/60">
                <p className="font-semibold text-gray-900">
                  Kurir: <span className="font-bold text-green-900">{orderToShip.courier.toUpperCase()} ({orderToShip.courier_service})</span>
                </p>
                <p className="text-gray-600 mt-1">
                  Penerima: {orderToShip.recipient_name} - {orderToShip.shipping_city}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nomor Resi Pengiriman <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={trackingNumberInput}
                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                  placeholder="Contoh: JT1234567890 atau JNE987654321"
                  className="w-full rounded-2xl border border-gray-300 px-4 py-2.5 text-sm font-mono text-gray-900 placeholder:text-gray-400 focus:border-green-800 focus:outline-hidden"
                  autoFocus
                />
                <p className="mt-1.5 text-[11px] text-gray-500">
                  Pastikan nomor resi valid dan sesuai yang tertera pada bukti pengiriman ekspedisi.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShippingModalOpen(false)}
                  disabled={isSubmittingShipping}
                  className="rounded-full border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmShipOrder}
                  disabled={isSubmittingShipping}
                  className="inline-flex items-center gap-2 rounded-full bg-green-900 px-5 py-2 text-xs font-bold text-white hover:bg-green-800 disabled:opacity-50 cursor-pointer shadow-sm transition"
                >
                  {isSubmittingShipping ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Truck size={13} />
                      <span>Simpan & Kirim Pesanan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
