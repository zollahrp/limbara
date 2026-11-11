"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { X, Loader2, ImagePlus } from "lucide-react";
import Swal from "sweetalert2";

import { createProduct, updateProduct, uploadProductImage } from "@/app/service/api";
import { CreateProductPayload, ProductItem } from "@/types/marketplace";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialProduct?: ProductItem | null;
}

const CATEGORIES = [
  "Dekorasi",
  "Rumah & Taman",
  "Mainan",
  "Koleksi",
  "Fashion & Aksesoris",
  "Furnitur & Dapur",
];

const WASTE_SUGGESTIONS = [
  "Botol Plastik PET",
  "Plastik HDPE / Tutup",
  "Kardus & Kertas",
  "Kaca & Botol Beling",
  "Logam & Kaleng Minuman",
  "Tekstil & Kain Perca",
  "Limbah Kayu Palet",
];

function getInitialFormData(initialProduct?: ProductItem | null): CreateProductPayload {
  if (initialProduct) {
    return {
      name: initialProduct.name,
      category: initialProduct.category,
      waste_material: initialProduct.waste_material,
      price: initialProduct.price,
      previous_price: initialProduct.previous_price || undefined,
      stock: initialProduct.stock,
      image_url: initialProduct.image_url,
      images: initialProduct.images?.length ? initialProduct.images : [initialProduct.image_url],
      short_description: initialProduct.short_description || "",
      description: initialProduct.description || "",
      weight_grams: initialProduct.weight_grams,
      dimensions: initialProduct.dimensions || "",
      production_time: initialProduct.production_time || "",
      impact: initialProduct.impact || "",
      is_active: initialProduct.is_active,
    };
  }

  return {
    name: "",
    category: "Dekorasi",
    waste_material: "Botol Plastik PET",
    price: 50000,
    stock: 5,
    image_url: "",
    images: [],
    short_description: "",
    description: "",
    weight_grams: 250,
    dimensions: "",
    production_time: "2-3 hari",
    impact: "Mengalihkan sekitar 10-20 kemasan sampah dari TPA.",
    is_active: true,
  };
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSuccess,
  initialProduct,
}: ProductFormModalProps) {
  if (!isOpen) return null;

  return (
    <ProductFormContent
      key={initialProduct?.id ?? "new-product"}
      onClose={onClose}
      onSuccess={onSuccess}
      initialProduct={initialProduct}
    />
  );
}

function ProductFormContent({
  onClose,
  onSuccess,
  initialProduct,
}: Omit<ProductFormModalProps, "isOpen">) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CreateProductPayload>(() => getInitialFormData(initialProduct));

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const currentImages = formData.images || [];
    if (currentImages.length + files.length > 5) {
      Swal.fire({
        icon: "warning",
        title: "Maksimal 5 Foto",
        text: `Kamu masih dapat menambahkan ${5 - currentImages.length} foto.`,
        confirmButtonColor: "#1C3E2B",
      });
      event.target.value = "";
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (files.some((file) => !allowedTypes.includes(file.type))) {
      Swal.fire({
        icon: "error",
        title: "Format Berkas Tidak Sesuai",
        text: "Silakan pilih berkas gambar (JPG, PNG, WEBP).",
        confirmButtonColor: "#1C3E2B",
      });
      return;
    }

    if (files.some((file) => file.size > 5 * 1024 * 1024)) {
      Swal.fire({
        icon: "error",
        title: "Ukuran Gambar Terlalu Besar",
        text: "Batas maksimal gambar adalah 5 MB.",
        confirmButtonColor: "#1C3E2B",
      });
      return;
    }

    setIsUploadingImage(true);
    try {
      const secureUrls = await Promise.all(files.map(uploadProductImage));
      setFormData((prev) => ({
        ...prev,
        image_url: prev.images?.[0] || secureUrls[0],
        images: [...(prev.images || []), ...secureUrls],
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengunggah foto ke Cloudinary.";
      Swal.fire({
        icon: "error",
        title: "Gagal Mengunggah",
        text: msg,
        confirmButtonColor: "#1C3E2B",
      });
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  };

  const removeImage = (image: string) => {
    setFormData((prev) => {
      const images = (prev.images || []).filter((item) => item !== image);
      return { ...prev, images, image_url: images[0] || "" };
    });
  };

  const setPrimaryImage = (image: string) => {
    setFormData((prev) => {
      const images = [image, ...(prev.images || []).filter((item) => item !== image)];
      return { ...prev, images, image_url: image };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      Swal.fire({
        icon: "warning",
        title: "Nama Produk Belum Lengkap",
        text: "Silakan masukkan nama produk minimal 3 karakter.",
        confirmButtonColor: "#1C3E2B",
      });
      return;
    }

    if (!formData.image_url) {
      Swal.fire({
        icon: "warning",
        title: "Foto Produk Wajib Ada",
        text: "Silakan unggah foto produk kerajinan terlebih dahulu.",
        confirmButtonColor: "#1C3E2B",
      });
      return;
    }

    if (formData.price < 500) {
      Swal.fire({
        icon: "warning",
        title: "Harga Tidak Valid",
        text: "Harga produk minimal Rp 500.",
        confirmButtonColor: "#1C3E2B",
      });
      return;
    }

    setIsSaving(true);
    try {
      if (initialProduct) {
        await updateProduct(initialProduct.id, formData);
        Swal.fire({
          icon: "success",
          title: "Produk Berhasil Diperbarui",
          text: `Data produk "${formData.name}" berhasil disimpan.`,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await createProduct(formData);
        Swal.fire({
          icon: "success",
          title: "Produk Berhasil Dibuat",
          text: `Produk "${formData.name}" siap dipasarkan.`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan data produk.";
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan",
        text: msg,
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/45 p-3 sm:p-6">
      <div className="relative my-4 flex max-h-[calc(100dvh-2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4 sm:px-7">
          <div>
            <h2 className="text-xl font-black tracking-tight text-gray-950">
              {initialProduct ? "Edit Produk Kerajinan" : "Tambah Produk Kerajinan Baru"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {initialProduct
                ? "Perbarui detail spesifikasi, harga, dan stok barang."
                : "Masukkan data karya upcycling untuk dijual di etalase tokomu."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup form produk"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="grid min-h-0 flex-1 grid-cols-1 gap-x-8 gap-y-5 overflow-y-auto p-5 sm:p-7 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          {/* 1. Upload Foto Produk ke Cloudinary */}
          <div className="rounded-2xl bg-[#F7F8F4] p-4 lg:col-start-1 lg:row-span-5 lg:row-start-1">
            <label className="mb-3 block text-sm font-bold text-gray-800">
              Foto Produk <span className="text-red-500">*</span>
            </label>

            <div className="space-y-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-white p-3 text-center transition hover:border-green-700 hover:bg-green-50/30 cursor-pointer"
              >
                {formData.image_url ? (
                  <>
                    <Image
                      src={formData.image_url}
                      alt="Preview"
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 360px, 90vw"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-sm font-bold text-white opacity-0 transition hover:opacity-100">
                      Tambah Foto
                    </div>
                  </>
                ) : isUploadingImage ? (
                  <div className="flex flex-col items-center gap-1.5 text-green-800">
                    <Loader2 size={28} className="animate-spin" />
                    <span className="text-xs font-bold">Mengunggah...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-gray-500">
                    <ImagePlus size={30} className="text-gray-400" />
                    <span className="text-sm font-bold">Pilih foto produk</span>
                    <span className="text-xs text-gray-400">JPG, PNG, atau WEBP · maks. 5 MB</span>
                  </div>
                )}
              </button>

              {(formData.images || []).length > 0 && (
                <div className="grid grid-cols-3 gap-2" aria-label="Foto produk yang sudah diunggah">
                  {(formData.images || []).map((image, index) => (
                    <div key={image} className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-white ${index === 0 ? "border-green-700" : "border-transparent"}`}>
                      <button type="button" onClick={() => setPrimaryImage(image)} className="relative h-full w-full cursor-pointer" aria-label={`Jadikan foto ${index + 1} sebagai foto utama`}>
                        <Image src={image} alt="" fill sizes="120px" className="object-cover" />
                        {index === 0 && <span className="absolute bottom-1 left-1 rounded-full bg-green-900 px-2 py-0.5 text-[9px] font-bold text-white">Utama</span>}
                      </button>
                      <button type="button" onClick={() => removeImage(image)} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/70 text-white" aria-label={`Hapus foto ${index + 1}`}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-1 text-xs text-gray-600">
                <p className="font-semibold text-gray-800">Tampilkan produk dengan jelas</p>
                <p className="leading-5 text-gray-500">
                  Tambahkan hingga 5 foto. Klik thumbnail untuk menjadikannya cover utama.
                </p>
                {formData.image_url && (
                  <p className="font-semibold text-green-700">
                    {(formData.images || []).length}/5 foto berhasil diunggah
                  </p>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* 2. Nama Produk */}
          <div className="lg:col-start-2 lg:row-start-1">
            <label htmlFor="product-name" className="mb-2 block text-sm font-bold text-gray-800">
              Nama Produk Kerajinan <span className="text-red-500">*</span>
            </label>
            <input
              id="product-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Lampu Nanas Senja, Pot Kelopak Kamomil"
              className="h-11 w-full rounded-xl border border-gray-300 px-3.5 text-sm outline-none transition focus:border-green-700 focus:ring-4 focus:ring-green-700/10"
              required
            />
          </div>

          {/* 3. Kategori & Material Sampah */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-start-2 lg:row-start-2">
            <div>
              <label htmlFor="product-category" className="mb-2 block text-sm font-bold text-gray-800">
                Kategori Produk <span className="text-red-500">*</span>
              </label>
              <select
                id="product-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm focus:border-green-700 focus:ring-4 focus:ring-green-700/10 outline-none transition bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="waste-material" className="mb-2 block text-sm font-bold text-gray-800">
                Material Sampah Asal <span className="text-red-500">*</span>
              </label>
              <input
                id="waste-material"
                type="text"
                value={formData.waste_material}
                onChange={(e) => setFormData({ ...formData, waste_material: e.target.value })}
                placeholder="Contoh: Botol Plastik PET"
                className="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm focus:border-green-700 focus:ring-4 focus:ring-green-700/10 outline-none transition"
                required
              />
            </div>
          </div>

          {/* Saran Cepat Material */}
          <div className="flex flex-wrap gap-1.5 lg:col-start-2 lg:row-start-3">
            <span className="text-[11px] text-gray-500 mr-1 self-center">Pilihan cepat:</span>
            {WASTE_SUGGESTIONS.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setFormData({ ...formData, waste_material: w })}
                className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
              >
                {w}
              </button>
            ))}
          </div>

          {/* 4. Harga & Stok */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-start-2 lg:row-start-4">
            <div>
              <label htmlFor="product-price" className="mb-2 block text-sm font-bold text-gray-800">
                Harga Jual (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                id="product-price"
                type="number"
                min={500}
                step={1000}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm focus:border-green-700 focus:ring-4 focus:ring-green-700/10 outline-none transition"
                required
              />
            </div>

            <div>
              <label htmlFor="product-stock" className="mb-2 block text-sm font-bold text-gray-800">
                Stok Tersedia (Unit) <span className="text-red-500">*</span>
              </label>
              <input
                id="product-stock"
                type="number"
                min={0}
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm focus:border-green-700 focus:ring-4 focus:ring-green-700/10 outline-none transition"
                required
              />
            </div>
          </div>

          <div className="lg:col-start-2 lg:row-start-5">
            <label htmlFor="product-summary" className="mb-2 block text-sm font-bold text-gray-800">
              Ringkasan Produk
            </label>
            <textarea
              id="product-summary"
              rows={2}
              maxLength={180}
              value={formData.short_description || ""}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              placeholder="Jelaskan fungsi dan keunikan produk dalam satu atau dua kalimat."
              className="w-full resize-none rounded-xl border border-gray-300 p-3.5 text-sm outline-none transition focus:border-green-700 focus:ring-4 focus:ring-green-700/10"
            />
            <p className="mt-1 text-right text-xs text-gray-400">
              {(formData.short_description || "").length}/180
            </p>
          </div>

          {/* 5. Spesifikasi Teknis (Berat, Dimensi, Waktu Produksi) */}
          <details className="group rounded-2xl border border-gray-200 bg-gray-50/70 lg:col-span-2">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-700/10">
              <span>
                <span className="block text-sm font-bold text-gray-900">Detail tambahan</span>
                <span className="mt-0.5 block text-xs text-gray-500">Berat, ukuran, waktu produksi, dampak, dan cerita produk.</span>
              </span>
              <span className="text-xl text-gray-400 transition group-open:rotate-45" aria-hidden="true">+</span>
            </summary>

            <div className="space-y-5 border-t border-gray-200 px-5 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Berat (Gram)
              </label>
              <input
                type="number"
                min={1}
                value={formData.weight_grams}
                onChange={(e) => setFormData({ ...formData, weight_grams: Number(e.target.value) })}
                placeholder="250"
                className="w-full h-10 px-3 rounded-xl border border-gray-300 text-xs focus:border-green-700 outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Dimensi Produk
              </label>
              <input
                type="text"
                value={formData.dimensions || ""}
                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                placeholder="15 × 15 × 20 cm"
                className="w-full h-10 px-3 rounded-xl border border-gray-300 text-xs focus:border-green-700 outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Waktu Produksi
              </label>
              <input
                type="text"
                value={formData.production_time || ""}
                onChange={(e) => setFormData({ ...formData, production_time: e.target.value })}
                placeholder="2-3 hari"
                className="w-full h-10 px-3 rounded-xl border border-gray-300 text-xs focus:border-green-700 outline-none"
              />
            </div>
          </div>

          {/* 6. Dampak Lingkungan */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-gray-800">
              Estimasi Dampak Lingkungan
            </label>
            <input
              type="text"
              value={formData.impact || ""}
              onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
              placeholder="Contoh: Mengalihkan sekitar 18 botol plastik dari aliran sampah."
              className="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm focus:border-green-700 focus:ring-4 focus:ring-green-700/10 outline-none transition"
            />
          </div>

          {/* 7. Deskripsi Lengkap */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-gray-800">
              Deskripsi Lengkap Produk
            </label>
            <textarea
              rows={3}
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Jelaskan teknik pembuatan, keunikan bentuk, instruksi perawatan, atau kegunaan produk..."
              className="w-full p-3.5 rounded-xl border border-gray-300 text-sm focus:border-green-700 focus:ring-4 focus:ring-green-700/10 outline-none transition resize-none"
            />
          </div>
            </div>
          </details>

          {/* 8. Toggle Status Aktif / Nonaktif */}
          <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 lg:col-span-2">
            <div>
              <span className="text-xs font-bold text-gray-900 block">Status Penayangan Produk</span>
              <span className="text-[11px] text-gray-500">
                {formData.is_active
                  ? "Produk AKTIF dan langsung tampil di etalase Marketplace."
                  : "Produk NONAKTIF (disimpan sebagai draft di toko)."}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
              role="switch"
              aria-checked={formData.is_active}
              aria-label="Tampilkan produk di marketplace"
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                formData.is_active ? "bg-green-800" : "bg-gray-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  formData.is_active ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Footer Modal Actions */}
          <div className="sticky bottom-0 -mx-5 -mb-5 flex items-center justify-end gap-3 border-t border-gray-200 bg-white px-5 py-4 sm:-mx-7 sm:-mb-7 sm:px-7 lg:col-span-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploadingImage}
              className="flex items-center gap-2 rounded-full bg-green-900 px-7 py-2.5 text-sm font-bold text-white transition hover:bg-green-800 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Produk"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
