"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import Swal from "sweetalert2";

import { updateShop, uploadShopImage } from "@/app/service/api";
import type { ShopData, UpdateShopPayload } from "@/types/marketplace";

interface ShopEditModalProps {
  shop: ShopData;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (shop: ShopData) => void;
}

export default function ShopEditModal({ shop, isOpen, onClose, onSaved }: ShopEditModalProps) {
  if (!isOpen) return null;
  return <ShopEditForm key={shop.updated_at} shop={shop} onClose={onClose} onSaved={onSaved} />;
}

function ShopEditForm({ shop, onClose, onSaved }: Omit<ShopEditModalProps, "isOpen">) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<UpdateShopPayload>({
    name: shop.name,
    description: shop.description || "",
    waste_focus: shop.waste_focus || "",
    province: shop.province,
    city: shop.city,
    district: shop.district || "",
    address: shop.address,
    postal_code: shop.postal_code || "",
    phone_number: shop.phone_number,
    email: shop.email || "",
    courier_options: shop.courier_options || [],
    logo_url: shop.logo_url || undefined,
  });

  const uploadLogo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const logoUrl = await uploadShopImage(file);
      setForm((current) => ({ ...current, logo_url: logoUrl }));
    } catch (error: unknown) {
      Swal.fire("Gagal mengunggah", error instanceof Error ? error.message : "Silakan coba lagi.", "error");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const updated = await updateShop(form);
      onSaved(updated);
      onClose();
      Swal.fire({ icon: "success", title: "Informasi toko diperbarui", timer: 1600, showConfirmButton: false });
    } catch (error: unknown) {
      Swal.fire("Gagal menyimpan", error instanceof Error ? error.message : "Silakan coba lagi.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const field = (key: keyof UpdateShopPayload, label: string, required = false) => (
    <label className="block text-sm font-bold text-gray-800">
      {label}{required && <span className="text-red-500"> *</span>}
      <input
        required={required}
        value={String(form[key] || "")}
        onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
        className="mt-2 h-11 w-full rounded-xl border border-gray-300 px-3.5 text-sm font-normal outline-none focus:border-green-700 focus:ring-4 focus:ring-green-700/10"
      />
    </label>
  );

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/45 p-4">
      <form onSubmit={submit} className="my-4 w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div><h2 className="text-xl font-black">Edit Informasi Toko</h2><p className="mt-1 text-sm text-gray-500">Perubahan nama tidak mengubah alamat URL toko.</p></div>
          <button type="button" onClick={onClose} aria-label="Tutup" className="grid h-10 w-10 place-items-center rounded-full border border-gray-200"><X size={16} /></button>
        </header>
        <div className="grid max-h-[70vh] gap-5 overflow-y-auto p-6 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-2xl bg-[#F7F8F4] p-4 sm:col-span-2">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-gray-200 bg-white">
              {form.logo_url ? <Image src={form.logo_url} alt="Logo toko" fill sizes="80px" className="object-cover" /> : isUploading ? <Loader2 className="animate-spin" /> : <ImagePlus />}
            </button>
            <div><p className="text-sm font-bold">Foto profil toko</p><button type="button" onClick={() => fileInputRef.current?.click()} className="mt-1 text-xs font-bold text-green-800">Ganti foto</button></div>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadLogo} className="hidden" />
          </div>
          {field("name", "Nama toko", true)}
          {field("waste_focus", "Fokus material")}
          <label className="block text-sm font-bold text-gray-800 sm:col-span-2">Deskripsi<textarea value={form.description || ""} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} rows={3} className="mt-2 w-full rounded-xl border border-gray-300 p-3.5 text-sm font-normal outline-none focus:border-green-700" /></label>
          {field("province", "Provinsi", true)}
          {field("city", "Kota / Kabupaten", true)}
          {field("district", "Kecamatan")}
          {field("postal_code", "Kode pos")}
          <label className="block text-sm font-bold text-gray-800 sm:col-span-2">Alamat lengkap *<textarea required value={form.address || ""} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} rows={2} className="mt-2 w-full rounded-xl border border-gray-300 p-3.5 text-sm font-normal outline-none focus:border-green-700" /></label>
          {field("phone_number", "Nomor WhatsApp", true)}
          {field("email", "Email toko")}
          <label className="block text-sm font-bold text-gray-800 sm:col-span-2">Pilihan kurir
            <input value={(form.courier_options || []).join(", ")} onChange={(event) => setForm((current) => ({ ...current, courier_options: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) }))} placeholder="JNE, J&T Express, SiCepat" className="mt-2 h-11 w-full rounded-xl border border-gray-300 px-3.5 text-sm font-normal outline-none focus:border-green-700" />
          </label>
        </div>
        <footer className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4"><button type="button" onClick={onClose} className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-bold">Batal</button><button type="submit" disabled={isSaving || isUploading} className="rounded-full bg-green-900 px-6 py-2.5 text-sm font-bold text-white disabled:opacity-50">{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</button></footer>
      </form>
    </div>
  );
}
