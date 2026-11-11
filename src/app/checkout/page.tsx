"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Swal from "sweetalert2";

import {
  calculateShippingCost,
  createCheckoutOrder,
  getCurrentUser,
  getMarketplaceProducts,
  getShippingCities,
  getShippingProvinces,
  markOrderPaid,
  type ShippingCity,
  type ShippingCostOption,
  type ShippingProvince,
} from "@/app/service/api";
import { CartItem, clearCart, getCart } from "@/utils/cart";
import { formatMarketplacePrice } from "@/utils/marketplace";

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

export default function CheckoutPage() {
  const router = useRouter();

  // 1. Data Item yang di-checkout
  const [items, setItems] = useState<CartItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  // 2. Data Alamat Pengiriman
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");

  // 3. Wilayah RajaOngkir
  const [provinces, setProvinces] = useState<ShippingProvince[]>([]);
  const [cities, setCities] = useState<ShippingCity[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedProvinceName, setSelectedProvinceName] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedCityName, setSelectedCityName] = useState("");

  // 4. Kurir & Ongkir
  const [selectedCourier, setSelectedCourier] = useState<"jnt" | "jne" | "pos">("jnt");
  const [shippingServices, setShippingServices] = useState<ShippingCostOption[]>([]);
  const [selectedService, setSelectedService] = useState<ShippingCostOption | null>(null);
  const [loadingOngkir, setLoadingOngkir] = useState(false);

  // 5. Status Submit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Injeksi Script Midtrans Snap
  useEffect(() => {
    const scriptId = "midtrans-snap-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      script.setAttribute(
        "data-client-key",
        process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""
      );
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Cek user login & ambil item checkout (dari query params productId atau dari keranjang)
  useEffect(() => {
    async function initCheckout() {
      try {
        const user = await getCurrentUser();
        if (user) {
          setRecipientName(user.name || "");
        }
      } catch {
        // guest or non-session
      }

      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get("productId");
        const qtyParam = parseInt(params.get("quantity") || "1", 10);

        if (productId) {
          // Beli Sekarang: ambil spesifik produk
          try {
            const data = await getMarketplaceProducts({ pageSize: 100 });
            const found = data.items.find((p) => String(p.id) === productId);
            if (found) {
              setItems([
                {
                  id: String(found.id),
                  slug: found.slug,
                  name: found.name,
                  price: found.price,
                  image: (found.images && found.images[0]) || found.image_url,
                  material: found.waste_material,
                  shopName: "Toko Limbara",
                  shopCity: "DKI Jakarta",
                  quantity: qtyParam > 0 ? qtyParam : 1,
                  stock: found.stock,
                },
              ]);
              setLoadingItems(false);
              return;
            }
          } catch {
            // fallback to cart
          }
        }

        // Jika tidak ada di query, ambil dari keranjang belanja
        const cartItems = getCart();
        setItems(cartItems);
        setLoadingItems(false);
      }
    }

    initCheckout();
  }, []);

  // Ambil daftar provinsi RajaOngkir
  useEffect(() => {
    getShippingProvinces()
      .then(setProvinces)
      .catch(() => setProvinces([]));
  }, []);

  // Ambil daftar kota saat provinsi dipilih
  useEffect(() => {
    if (!selectedProvinceId) {
      setCities([]);
      setSelectedCityId("");
      return;
    }

    getShippingCities(selectedProvinceId)
      .then((data) => {
        setCities(data);
        if (data.length > 0) {
          setSelectedCityId(data[0].city_id);
          setSelectedCityName(`${data[0].type} ${data[0].city_name}`);
          if (data[0].postal_code) {
            setPostalCode(data[0].postal_code);
          }
        }
      })
      .catch(() => setCities([]));
  }, [selectedProvinceId]);

  // Hitung ongkir otomatis saat kota tujuan atau kurir berubah
  useEffect(() => {
    if (!selectedCityId) {
      setShippingServices([]);
      setSelectedService(null);
      return;
    }

    setLoadingOngkir(true);
    calculateShippingCost({
      origin_city_id: "151", // Default origin pengiriman
      destination_city_id: selectedCityId,
      weight_grams: 1000,
      courier: selectedCourier,
    })
      .then((results) => {
        if (results.length > 0 && results[0].costs.length > 0) {
          const costs = results[0].costs;
          setShippingServices(costs);
          setSelectedService(costs[0]);
        } else {
          setShippingServices([]);
          setSelectedService(null);
        }
      })
      .catch(() => {
        setShippingServices([]);
        setSelectedService(null);
      })
      .finally(() => setLoadingOngkir(false));
  }, [selectedCityId, selectedCourier]);

  // Kalkulasi total
  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const shippingCost = selectedService?.cost[0]?.value || 0;
  const totalAmount = subtotal + shippingCost;

  // Eksekusi Checkout & Buka Midtrans Snap
  const handlePayment = async () => {
    setErrorMessage("");

    if (items.length === 0) {
      setErrorMessage("Tidak ada barang untuk di-checkout.");
      return;
    }
    if (!recipientName.trim()) {
      setErrorMessage("Nama penerima wajib diisi.");
      return;
    }
    if (!recipientPhone.trim()) {
      setErrorMessage("Nomor telepon/WhatsApp wajib diisi.");
      return;
    }
    if (!selectedProvinceName || !selectedCityName) {
      setErrorMessage("Silakan pilih provinsi dan kota tujuan.");
      return;
    }
    if (!shippingAddress.trim()) {
      setErrorMessage("Alamat lengkap pengiriman wajib diisi.");
      return;
    }
    if (!selectedService) {
      setErrorMessage("Silakan pilih opsi layanan pengiriman.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Buat order di backend dan dapatkan Snap Token
      const order = await createCheckoutOrder({
        items: items.map((it) => ({
          product_id: it.id,
          quantity: it.quantity,
        })),
        recipient_name: recipientName.trim(),
        recipient_phone: recipientPhone.trim(),
        shipping_address: shippingAddress.trim(),
        shipping_province: selectedProvinceName,
        shipping_city: selectedCityName,
        shipping_postal_code: postalCode.trim() || undefined,
        courier: selectedCourier.toUpperCase(),
        courier_service: selectedService.service,
        shipping_cost: shippingCost,
        notes: notes.trim() || undefined,
      });

      if (!order.snap_token) {
        throw new Error("Gagal memperoleh token pembayaran Midtrans.");
      }

      // 2. Trigger Midtrans Snap Popup
      if (window.snap && typeof window.snap.pay === "function") {
        window.snap.pay(order.snap_token, {
          onSuccess: async () => {
            try {
              await markOrderPaid(order.id);
            } catch {
              // Webhook will also process payment status
            }
            clearCart();
            Swal.fire({
              icon: "success",
              title: "Pembayaran Berhasil!",
              text: `Pesanan #${order.order_number} telah berhasil dibayar. Toko akan segera memproses barangmu. Status pesanan kini: Diproses.`,
              confirmButtonColor: "#14532d",
              confirmButtonText: "Lihat Pesanan Saya",
              customClass: { popup: "rounded-3xl" },
            }).then(() => {
              router.push("/pesanan");
            });
          },
          onPending: () => {
            clearCart();
            Swal.fire({
              icon: "info",
              title: "Menunggu Pembayaran",
              text: `Pesanan #${order.order_number} sedang menunggu penyelesaian pembayaran. Silakan selesaikan tagihanmu.`,
              confirmButtonColor: "#14532d",
              confirmButtonText: "Ke Halaman Profil",
              customClass: { popup: "rounded-3xl" },
            }).then(() => {
              router.push("/profil");
            });
          },
          onError: () => {
            Swal.fire({
              icon: "error",
              title: "Pembayaran Gagal",
              text: "Transaksi pembayaran tidak berhasil. Kamu dapat mencoba kembali.",
              confirmButtonColor: "#ef4444",
              customClass: { popup: "rounded-3xl" },
            });
          },
          onClose: () => {
            Swal.fire({
              icon: "warning",
              title: "Transaksi Belum Selesai",
              text: "Popup pembayaran ditutup. Tagihan pesananmu tetap tersimpan.",
              confirmButtonColor: "#14532d",
              confirmButtonText: "Mengerti",
              customClass: { popup: "rounded-3xl" },
            });
          },
        });
      } else {
        // Fallback jika popup snap terblokir browser, arahkan ke redirect URL
        if (order.snap_redirect_url) {
          window.location.href = order.snap_redirect_url;
        } else {
          throw new Error("Layanan Snap Midtrans belum siap dimuat.");
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat memproses checkout.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingItems) {
    return (
      <div className="min-h-screen bg-[#F7F8F4] pt-32 pb-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F8F4] text-gray-900 pb-24 pt-32 sm:pt-36 flex items-center justify-center">
        <div className="mx-auto max-w-md rounded-3xl border border-gray-200/80 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 border border-gray-100">
            <Package size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-950">Tidak Ada Barang Checkout</h2>
          <p className="mt-2 text-xs text-gray-500">
            Silakan pilih barang yang ingin dibeli terlebih dahulu dari halaman marketplace atau keranjang.
          </p>
          <div className="mt-6">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 rounded-2xl bg-green-900 px-5 py-3 text-xs font-bold text-white transition hover:bg-green-800"
            >
              <ArrowLeft size={14} />
              <span>Kembali ke Marketplace</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8F4] text-gray-900 pb-28 pt-32 sm:pt-36">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        {/* Header Navigation */}
        <div className="mb-8">
          <Link
            href="/keranjang"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-green-900 transition-colors mb-2"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Keranjang</span>
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-gray-950">Checkout Pesanan</h1>
          <p className="text-xs text-gray-500 mt-1">
            Lengkapi alamat pengiriman dan pilih ekspedisi kurir untuk menyelesaikan transaksi aman via Midtrans.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
          {/* Kolom Kiri: Form Alamat & Pilihan Pengiriman */}
          <div className="space-y-6">
            {/* Kartu 1: Alamat Pengiriman */}
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-800 border border-green-100">
                  <MapPin size={20} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-950">Alamat Pengiriman</h2>
                  <p className="text-xs text-gray-500">Tentukan tujuan pengantaran paket pesananmu</p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-gray-700">Nama Penerima</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Contoh: Budi Pratama"
                    className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs text-gray-900 outline-none transition focus:border-green-800 focus:ring-2 focus:ring-green-800/10"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Nomor Telepon / WhatsApp</label>
                  <input
                    type="tel"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs text-gray-900 outline-none transition focus:border-green-800 focus:ring-2 focus:ring-green-800/10"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Provinsi Tujuan</label>
                  <select
                    value={selectedProvinceId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedProvinceId(id);
                      const prov = provinces.find((p) => p.province_id === id);
                      setSelectedProvinceName(prov ? prov.province : "");
                    }}
                    className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs text-gray-900 outline-none transition focus:border-green-800 focus:ring-2 focus:ring-green-800/10"
                  >
                    <option value="">Pilih Provinsi</option>
                    {provinces.map((prov) => (
                      <option key={prov.province_id} value={prov.province_id}>
                        {prov.province}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Kota / Kabupaten Tujuan</label>
                  <select
                    value={selectedCityId}
                    disabled={!selectedProvinceId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedCityId(id);
                      const city = cities.find((c) => c.city_id === id);
                      if (city) {
                        setSelectedCityName(`${city.type} ${city.city_name}`);
                        if (city.postal_code) setPostalCode(city.postal_code);
                      }
                    }}
                    className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs text-gray-900 outline-none transition focus:border-green-800 focus:ring-2 focus:ring-green-800/10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Pilih Kota / Kabupaten</option>
                    {cities.map((city) => (
                      <option key={city.city_id} value={city.city_id}>
                        {city.type} {city.city_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700">Alamat Lengkap & Patokan</label>
                  <textarea
                    rows={3}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan/kecamatan, atau patokan lokasi"
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white p-3.5 text-xs text-gray-900 outline-none transition focus:border-green-800 focus:ring-2 focus:ring-green-800/10"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Kode Pos</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Contoh: 60119"
                    className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs text-gray-900 outline-none transition focus:border-green-800 focus:ring-2 focus:ring-green-800/10"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Catatan Pengiriman (Opsional)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Titipkan di satpam jika tidak ada orang"
                    className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs text-gray-900 outline-none transition focus:border-green-800 focus:ring-2 focus:ring-green-800/10"
                  />
                </div>
              </div>
            </div>

            {/* Kartu 2: Ekspedisi & Ongkos Kirim RajaOngkir */}
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-800 border border-green-100">
                  <Truck size={20} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-950">Metode Pengiriman</h2>
                  <p className="text-xs text-gray-500">Pilih kurir ekspedisi pengantaran paketmu</p>
                </div>
              </div>

              {/* Tab Pilihan Kurir */}
              <div className="mt-6 flex flex-wrap gap-2.5">
                {[
                  { id: "jnt", label: "J&T Express", desc: "Reguler & Cepat" },
                  { id: "jne", label: "JNE", desc: "Jalur Nugraha Ekakurir" },
                  { id: "pos", label: "POS Indonesia", desc: "Kantor Pos" },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCourier(c.id as "jnt" | "jne" | "pos")}
                    className={`flex-1 min-w-[140px] rounded-2xl border p-3.5 text-left transition ${
                      selectedCourier === c.id
                        ? "border-green-900 bg-green-50/50 shadow-sm"
                        : "border-gray-200/80 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-950">{c.label}</span>
                      {selectedCourier === c.id && (
                        <CheckCircle2 size={14} className="text-green-900" />
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">{c.desc}</p>
                  </button>
                ))}
              </div>

              {/* Opsi Layanan & Tarif Ongkir */}
              <div className="mt-5">
                <label className="text-xs font-bold text-gray-700">Pilihan Layanan & Tarif</label>
                {loadingOngkir ? (
                  <div className="mt-3 flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-xs text-gray-500">
                    <div className="h-4 w-4 border-2 border-green-800 border-t-transparent rounded-full animate-spin" />
                    <span>Menghitung ongkos kirim real-time...</span>
                  </div>
                ) : !selectedCityId ? (
                  <div className="mt-3 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-4 text-center text-xs text-gray-400">
                    Silakan tentukan provinsi & kota tujuan terlebih dahulu.
                  </div>
                ) : shippingServices.length === 0 ? (
                  <div className="mt-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-500">
                    Layanan kurir tidak tersedia untuk rute ini. Silakan coba kurir lain.
                  </div>
                ) : (
                  <div className="mt-3 space-y-2.5">
                    {shippingServices.map((service, idx) => {
                      const cost = service.cost[0]?.value || 0;
                      const etd = service.cost[0]?.etd || "-";
                      const isSelected = selectedService?.service === service.service;
                      return (
                        <button
                          key={`${service.service}-${idx}`}
                          type="button"
                          onClick={() => setSelectedService(service)}
                          className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition ${
                            isSelected
                              ? "border-green-900 bg-green-50/40 ring-1 ring-green-900"
                              : "border-gray-200/80 hover:border-gray-300 bg-white"
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-gray-950">
                                {service.service}
                              </span>
                              <span className="text-[10px] rounded-md bg-gray-100 px-1.5 py-0.5 font-medium text-gray-600">
                                Estimasi: {etd} hari
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              {service.description || "Layanan Pengiriman"}
                            </p>
                          </div>
                          <span className="text-sm font-bold text-gray-950 tabular-nums">
                            {formatMarketplacePrice(cost)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Ringkasan Produk & Eksekusi Bayar via Midtrans */}
          <div className="space-y-6 lg:sticky lg:top-36">
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-gray-950 border-b border-gray-100 pb-4">
                Daftar Barang ({items.length})
              </h2>

              <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
                {items.map((it) => (
                  <div key={it.id} className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                      <Image
                        src={it.image || "/img/marketplace/default.jpg"}
                        alt={it.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{it.name}</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {it.quantity} x {formatMarketplacePrice(it.price)}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-gray-950 tabular-nums">
                      {formatMarketplacePrice(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Rincian Kalkulasi Pembayaran */}
              <div className="mt-6 space-y-2.5 border-t border-gray-100 pt-4 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal Produk</span>
                  <span className="font-semibold text-gray-950 tabular-nums">
                    {formatMarketplacePrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Ongkos Kirim ({selectedCourier.toUpperCase()})</span>
                  <span className="font-semibold text-gray-950 tabular-nums">
                    {formatMarketplacePrice(shippingCost)}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-gray-950">Total Pembayaran</span>
                  <span className="text-xl font-black text-green-950 tabular-nums">
                    {formatMarketplacePrice(totalAmount)}
                  </span>
                </div>
              </div>

              {errorMessage && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
                  {errorMessage}
                </div>
              )}

              {/* Tombol Pembayaran Midtrans Snap */}
              <button
                type="button"
                disabled={isSubmitting || loadingOngkir}
                onClick={handlePayment}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-green-900 py-3.5 text-xs font-bold text-white transition hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <CreditCard size={16} />
                <span>{isSubmitting ? "Menyiapkan Pembayaran..." : "Bayar Sekarang dengan Midtrans"}</span>
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-gray-400">
                <ShieldCheck size={14} className="text-green-700" />
                <span>Transaksi dijamin aman & terenkripsi oleh Midtrans</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
