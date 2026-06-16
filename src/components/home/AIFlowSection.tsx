"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AIFlowSection() {
  return (
    <section className="relative min-h-screen snap-start bg-[#f8f7f3] overflow-hidden py-24 flex items-center justify-center">
      <div className="absolute inset-0 opacity-[0.04]">
        <svg className="w-full h-full">
          <defs>
            <pattern id="dot" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="2" fill="black" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot)" />
        </svg>
      </div>

      <h2 className="absolute top-10 left-10 text-[13vw] font-black uppercase text-black/[0.03] leading-none pointer-events-none">
        AI FLOW
      </h2>

      <div className="relative z-10 w-full max-w-[1500px] px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <p className="uppercase tracking-[0.5em] text-xs text-black/50 mb-5">Alur Pengenalan</p>
          <h2 className="text-4xl lg:text-6xl font-black leading-[0.9] text-black">
            Alur Kerja Deteksi
            <br />
            Sampah
          </h2>
        </motion.div>

        <div className="relative flex items-center justify-between gap-2 w-full">
          {/* STEP 1: Input */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative w-[190px]"
          >
            <p className="font-black text-lg mb-5 text-black">Input</p>
            <div className="border-2 border-dashed border-black/20 rounded-[22px] bg-white p-4">
              <div className="bg-[#f4f4f4] rounded-2xl overflow-hidden border border-black/10">
                <Image src="/img/botol_plastik.png" alt="Sampah" width={250} height={320} className="object-contain h-[220px] mx-auto" />
              </div>
              <div className="mt-4">
                <h3 className="font-black uppercase text-base text-black">Gambar Sampah</h3>
                <p className="text-xs text-black/60 mt-2 leading-6">Input gambar sampah dari kamera.</p>
              </div>
            </div>
          </motion.div>

          <Arrow />

          {/* STEP 2: Preprocessing */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="relative w-[210px]"
          >
            <p className="font-black text-lg mb-5 text-black">Preprocessing</p>
            <div className="border-2 border-dashed border-black/20 rounded-[22px] bg-white p-4 flex flex-col gap-4">
              <div className="border border-black/10 rounded-2xl p-4">
                <div className="text-4xl mb-3">🖼️</div>
                <h3 className="font-black uppercase text-sm text-black">Ubah Ukuran</h3>
                <p className="text-xs text-black/60 mt-1">224 × 224</p>
              </div>
              <div className="border border-black/10 rounded-2xl p-4">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-black uppercase text-sm text-black">Normalisasi</h3>
                <p className="text-xs text-black/60 mt-1">Pengubahan Skala [0,1]</p>
              </div>
            </div>
          </motion.div>

          <Arrow />

          {/* STEP 3: Ekstraksi */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative w-[240px]"
          >
            <p className="font-black text-lg mb-5 text-[#234EA0]">Ekstraksi Fitur</p>
            <div className="border-2 border-dashed border-[#7db4ff] rounded-[22px] bg-white p-5">
              <div className="flex justify-center gap-3 mb-6">
                {[130, 110, 85, 60].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    style={{ height: `${h}px` }}
                    className="w-10 rounded-t-xl bg-gradient-to-b from-[#8cc4ff] to-[#4e8dd6]"
                  />
                ))}
              </div>
              <div className="space-y-3">
                {["Lapisan Konvolusi", "Pooling Rata-rata Global", "Vektor Fitur"].map((item) => (
                  <div key={item} className="border border-[#b8d7ff] rounded-xl py-2 px-3 text-center font-semibold text-sm text-black">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <Arrow />

          {/* STEP 4: Klasifikasi */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="relative w-[230px]"
          >
            <p className="font-black text-lg mb-5 text-[#2E7D32]">Klasifikasi</p>
            <div className="border-2 border-dashed border-[#8fd88b] rounded-[22px] bg-white p-4">
              <div className="space-y-2">
                {["Kardus", "Plastik", "Kertas", "Logam", "Kaca", "Organik", "E-Waste", "Tekstil"].map((item, i) => (
                  <div key={item} className="flex items-center gap-3 border border-[#d5f0d2] rounded-xl px-3 py-2 text-black">
                    <div className="w-7 h-7 rounded-full bg-[#7BBF6A] flex items-center justify-center text-white text-xs font-black">
                      {i + 1}
                    </div>
                    <p className="font-semibold text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <Arrow />

          {/* STEP 5: Prediksi */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="relative w-[200px]"
          >
            <p className="font-black text-lg mb-5 text-[#7B1FA2]">Prediksi</p>
            <div className="border-2 border-dashed border-[#c78cff] rounded-[22px] bg-white p-5 text-center">
              <div className="w-28 h-28 rounded-full bg-[#4da3ff] mx-auto flex items-center justify-center text-5xl text-white mb-6">
                ♻️
              </div>
              <h3 className="text-2xl font-black uppercase text-black">Plastik</h3>
              <p className="mt-3 text-black/60 text-xs leading-6">Kategori Sampah Prediksi</p>
            </div>
          </motion.div>

          <Arrow />

          {/* STEP 6: Rekomendasi */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="relative w-[250px]"
          >
            <p className="font-black text-lg mb-5 text-[#00838F]">Rekomendasi Kerajinan</p>
            <div className="border-2 border-dashed border-[#7bd5dd] rounded-[22px] bg-white p-4">
              <div className="space-y-4">
                {[
                  { title: "Pot Bunga", img: "/img/botol_plastik_pot_bunga.png" },
                  { title: "Tempat Pensil", img: "/img/botol_plastik_lampu_kamar.png" },
                  { title: "Batu Ramah Lingkungan", img: "/img/botol_plastik_anjing.png" },
                ].map((item) => (
                  <div key={item.title} className="flex items-center gap-3 border border-black/10 rounded-2xl p-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#f3f3f3] shrink-0">
                      <Image src={item.img} alt={item.title} width={80} height={80} className="object-cover w-full h-full" />
                    </div>
                    <div>
                      <h4 className="font-black uppercase text-sm text-black">{item.title}</h4>
                      <p className="text-xs text-black/60 mt-1">Limbah plastik daur ulang</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// Komponen pembantu untuk garis panah
function Arrow() {
  return (
    <div className="pt-[155px] shrink-0">
      <div className="w-10 h-[3px] bg-[#446C66] relative">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 border-t-[3px] border-r-[3px] border-[#446C66] rotate-45" />
      </div>
    </div>
  );
}