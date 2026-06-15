"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Navbar from "@/components/Navbar";

const springConfig = { stiffness: 60, damping: 20 };
const springConfigWithMass = { ...springConfig, mass: 0.8 };

const heroStats = [
  { label: "Category", value: "PET" },
  { label: "Recycle", value: "♻ 100%" },
  { label: "Weight", value: "25g" },
];

const detailFacts = [
  {
    label: "Decomposition Time",
    value: "450+",
    description: "Tahun untuk terurai secara alami jika tidak dikelola.",
  },
  {
    label: "New Possibility",
    value: "1 → ∞",
    description: "Satu botol dapat berubah menjadi banyak produk baru.",
  },
  {
    label: "Everyday Impact",
    value: "1 Botol",
    description: "Perubahan kecil yang membantu menjaga lingkungan.",
  },
];

const secondLifeProducts = [
  {
    key: "lampu",
    src: "/img/botol_plastik_lampu_kamar.png",
    alt: "Lampu Hias",
    label: "Lampu Hias",
    badge: "RECYCLED",
    position:
      "absolute top-[200px] left-4 sm:left-12 lg:left-[220px] w-[140px] sm:w-[220px] lg:w-[380px] z-10",
    animate: { y: [0, -25, 0], rotate: [-5, -2, -5] },
    transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
  },
  {
    key: "pot",
    src: "/img/botol_plastik_pot_bunga.png",
    alt: "Pot",
    label: "Pot Bunga",
    badge: "REBORN MATERIAL",
    position:
      "absolute bottom-[120px] left-10 sm:left-24 lg:left-[330px] w-[130px] sm:w-[200px] lg:w-[330px] z-10",
    animate: { y: [0, 25, 0], rotate: [5, 8, 5] },
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 },
  },
  {
    key: "anjing",
    src: "/img/botol_plastik_anjing.png",
    alt: "Anjing",
    label: "Anjing Lucu",
    badge: "CREATIVE REUSE",
    position:
      "absolute top-[200px] right-4 sm:right-12 lg:right-[220px] w-[140px] sm:w-[220px] lg:w-[360px] z-10",
    animate: { y: [0, -30, 0], rotate: [5, 2, 5] },
    transition: {
      duration: 5.5,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 1.8,
    },
  },
  {
    key: "kuda",
    src: "/img/botol_plastik_kuda.png",
    alt: "Kuda",
    label: "Kuda Keren",
    badge: "UPCYCLING",
    position:
      "absolute bottom-[110px] right-8 sm:right-16 lg:right-[300px] w-[140px] sm:w-[220px] lg:w-[360px] z-10",
    animate: { y: [0, 20, 0], rotate: [-5, -8, -5] },
    transition: {
      duration: 6.5,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 0.5,
    },
  },
];

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-gray-400">{label}</p>
      <p className="text-3xl font-black">{value}</p>
    </div>
  );
}

function DetailFact({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="border-t pt-5">
      <p className="text-xs uppercase tracking-widest text-gray-400">{label}</p>
      <div className="text-5xl font-black">{value}</div>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
}

function ProductCard({
  product,
}: {
  product: (typeof secondLifeProducts)[number];
}) {
  return (
    <motion.div
      animate={product.animate}
      transition={product.transition as any}
      className={product.position}
    >
      <Image
        src={product.src}
        alt={product.alt}
        width={450}
        height={450}
        className="object-contain drop-shadow-2xl"
      />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur border border-black/10 px-5 py-2 whitespace-nowrap text-center">
        <p className="text-[9px] tracking-[0.4em] text-gray-500">
          {product.badge}
        </p>
        <h4 className="font-black uppercase">{product.label}</h4>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });

  const bottleRotate = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [18, 0, 0, 0, 0, 0],
  );

  const bottleX = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [0, 180, 0, 0, 0, 0],
  );

  const bottleY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [0, 0, 0, 0, -30, -50],
  );

  const bottleScale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [1, 0.85, 0.9, 0.85, 0.75, 0.45],
  );

  const smoothRotate = useSpring(bottleRotate, springConfigWithMass);

  const smoothX = useSpring(bottleX, springConfigWithMass);

  const smoothY = useSpring(bottleY, springConfigWithMass);

  const smoothScale = useSpring(bottleScale, springConfigWithMass);

  const detailOpacity = useTransform(
    scrollYProgress,
    [0.18, 0.28, 0.4],
    [0, 1, 1],
  );

  const detailX = useTransform(scrollYProgress, [0.18, 0.28], [120, 0]);

  const smoothDetailOpacity = useSpring(detailOpacity, springConfig);
  const smoothDetailX = useSpring(detailX, springConfig);

  return (
    <main
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory bg-white"
    >
      <motion.div
        className="fixed inset-0 z-30 pointer-events-none flex items-center justify-center"
        style={{
          rotate: smoothRotate,
          scale: smoothScale,
          x: smoothX,
          y: smoothY,
        }}
      >
        <div className="relative w-[220px] h-[480px] sm:w-[280px] sm:h-[600px] lg:w-[420px] lg:h-[900px]">
          <Image
            src="/img/botol_plastik.png"
            alt="Botol Plastik"
            fill
            priority
            sizes="(max-width: 640px) 220px, (max-width: 1024px) 280px, 420px"
            className="object-contain select-none drop-shadow-[0_40px_60px_rgba(0,0,0,0.25)]"
          />
        </div>
      </motion.div>

      <section className="relative h-screen snap-start overflow-hidden bg-white">
        <Navbar />

        <div className="absolute left-0 top-0 h-full w-24 flex flex-col items-center py-8 z-20">
          <div className="w-px flex-1 bg-black/20" />
          <button className="text-2xl mb-10">⌕</button>
          <div className="w-px flex-1 bg-black/20" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h2 className="text-[12vw] leading-[0.85] font-black uppercase text-green-700/20 opacity-90 text-center">
            BOTOL
            <br />
            PLASTIK
          </h2>
        </div>

        <div className="absolute bottom-16 left-32 z-20">
          <p className="italic text-2xl mb-2">Unlimited Recycle</p>
          <h3 className="text-4xl sm:text-5xl lg:text-7xl font-black uppercase leading-none">
            Botol
            <br />
            Plastik
          </h3>
        </div>
      </section>

      <section className="relative h-screen snap-start bg-[#faf9f6] px-5 sm:px-10 lg:px-20 flex items-center overflow-hidden">
        <div className="absolute right-10 top-10 text-[18vw] font-black text-black/[0.03] leading-none pointer-events-none">
          PET
        </div>
        <div className="absolute left-[52%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full border border-black/10" />
        <div className="absolute left-[52%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full border border-dashed border-black/10" />

        <div className="absolute left-[40%] top-[35%] w-[180px] h-px bg-black/20" />
        <div className="absolute left-[40%] top-[35%] -translate-y-1/2 text-[10px] uppercase tracking-[0.4em] text-gray-400">
          Lightweight Material
        </div>
        <div className="absolute left-[56%] bottom-[35%] w-[160px] h-px bg-black/20" />
        <div className="absolute left-[56%] bottom-[32%] text-[10px] uppercase tracking-[0.4em] text-gray-400">
          Ready To Recycle
        </div>

        <div className="absolute left-[52%] bottom-[18%] -translate-x-1/2 text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400">
            Material Type
          </p>
          <h4 className="text-4xl font-black">PET</h4>
        </div>

        <div className="relative z-10 max-w-[560px]">
          <p className="uppercase tracking-[0.5em] text-xs text-gray-500 mb-6">
            Material Exploration
          </p>
          <h2 className="text-[48px] sm:text-[70px] lg:text-[100px] font-black uppercase leading-[0.85] tracking-tight">
            Bottle
            <br />
            Plastic
          </h2>

          <div className="mt-8 flex items-center gap-6">
            <div className="w-16 h-px bg-black" />
            <p className="text-gray-600 leading-8 w-full max-w-[430px]">
              Botol plastik PET hadir sebagai material ringan, kuat, dan
              fleksibel yang dapat kembali menjadi berbagai produk bernilai
              melalui proses daur ulang.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap gap-6 lg:gap-12">
            {heroStats.map((stat) => (
              <StatItem
                key={stat.label}
                label={stat.label}
                value={stat.value}
              />
            ))}
          </div>

          <button className="mt-12 bg-black text-white px-10 py-4 uppercase tracking-widest text-sm font-bold hover:translate-x-2 transition">
            Explore
          </button>
        </div>

        <motion.div
          style={{ opacity: smoothDetailOpacity, x: smoothDetailX }}
          className="relative z-20 ml-auto mr-0 lg:mr-20 w-[430px] bg-white border border-black/20 p-8 shadow-[25px_25px_0px_rgba(0,0,0,0.05)]"
        >
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-gray-400">
                Plastic Intelligence
              </p>
              <h3 className="text-3xl font-black uppercase">
                PET
                <br />
                Material
              </h3>
            </div>
            <div className="border border-black rounded-full w-14 h-14 flex items-center justify-center text-xl">
              ♻
            </div>
          </div>

          <div className="space-y-7">
            {detailFacts.map((fact) => (
              <DetailFact
                key={fact.label}
                label={fact.label}
                value={fact.value}
                description={fact.description}
              />
            ))}
          </div>
        </motion.div>
      </section>

      <section className="relative h-screen snap-start bg-[#f8f6f2] overflow-hidden">
        <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
          <h2 className="text-[11vw] font-black uppercase text-green-700/20 leading-none mt-10">
            RECYCLE
          </h2>
        </div>

        <div className="relative z-10 h-full px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full items-center">
            <div>
              <div className="w-full max-w-[520px]">
                <div className="overflow-hidden border-2 border-black">
                  <iframe
                    width="100%"
                    height="300"
                    src="https://www.youtube.com/embed/_G2IitNrgIw"
                    title="Plastic Recycling"
                    allowFullScreen
                  />
                </div>
                <p className="mt-4 text-xl italic">
                  Lihat bagaimana botol plastik diproses menjadi produk bernilai
                  tinggi.
                </p>
              </div>

              <div className="mt-20 max-w-[350px]">
                <div className="bg-green-700 text-white p-8 rotate-[-4deg]">
                  <h4 className="font-black text-2xl uppercase mb-3">
                    Kehidupan Kedua
                  </h4>
                  <p className="text-sm leading-7">
                    Botol plastik tidak harus berakhir sebagai limbah. Melalui
                    proses daur ulang, materialnya dapat diubah menjadi berbagai
                    produk baru yang memiliki nilai guna.
                  </p>
                </div>
              </div>
            </div>

            <div className="max-w-[520px] ml-auto">
              <p className="uppercase tracking-[0.3em] text-gray-500 mb-4">
                Circular Economy
              </p>
              <h3 className="text-7xl font-black uppercase leading-none mb-8">
                Dari Sampah
                <br />
                Menjadi
                <br />
                Manfaat
              </h3>
              <p className="text-lg leading-9 text-gray-700 mb-8">
                Botol plastik PET tidak harus berakhir di tempat pembuangan
                akhir. Melalui proses pengumpulan, pencucian, pencacahan, hingga
                peleburan ulang, material ini dapat kembali menjadi bahan baku
                berkualitas tinggi untuk berbagai industri.
              </p>
              <p className="text-lg leading-9 text-gray-700">
                Setiap botol yang didaur ulang membantu mengurangi limbah
                plastik, menghemat energi produksi, serta mendukung ekonomi
                sirkular yang lebih berkelanjutan.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative h-screen snap-start bg-[#f5f2eb] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h2 className="text-[15vw] font-black uppercase text-black/[0.035] tracking-widest">
            REBORN
          </h2>
        </div>

        <div className="absolute top-20 left-24 z-20">
          <p className="uppercase tracking-[0.5em] text-xs text-gray-500 mb-4">
            Produk Daur Ulang
          </p>
          <h2 className="text-7xl font-black uppercase leading-[0.85]">
            Second
            <br />
            Life
          </h2>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[450px] sm:h-[450px] lg:w-[650px] lg:h-[650px] rounded-full border border-dashed border-black/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] sm:w-[250px] sm:h-[250px] lg:w-[360px] lg:h-[360px] rounded-full border border-black/10" />

        <div className="absolute top-[42%] left-[43%] w-[220px] h-px bg-black/20 rotate-[-35deg] origin-left" />
        <div className="absolute top-[58%] left-[43%] w-[200px] h-px bg-black/20 rotate-[35deg] origin-left" />
        <div className="absolute top-[42%] right-[43%] w-[220px] h-px bg-black/20 rotate-[35deg] origin-right" />
        <div className="absolute bottom-[42%] right-[43%] w-[200px] h-px bg-black/20 rotate-[-35deg] origin-right" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center">
          <div className="w-4 h-4 rounded-full bg-black mx-auto mb-5" />
          <p className="uppercase tracking-[0.5em] text-xs text-gray-500">
            Satu Botol
          </p>
          <h3 className="text-3xl font-black uppercase">
            Infinite
            <br />
            Possibilities
          </h3>
        </div>

        {secondLifeProducts.map((product) => (
          <ProductCard key={product.key} product={product} />
        ))}

        <div className="absolute right-24 top-1/2 -translate-y-1/2 text-right z-20">
          <p className="uppercase tracking-[0.4em] text-xs text-gray-400">
            Satu Botol
          </p>
          <h4 className="text-3xl font-black uppercase">
            Four
            <br />
            Possibilities
          </h4>
        </div>
      </section>

      <section
        className="
    relative
    h-screen
    snap-start
    bg-[#f7f4ee]
    overflow-hidden
  "
      >
        {/* BACKGROUND */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h2 className="text-[12vw] font-black uppercase text-black/[0.04]">
            RECYCLABLE
          </h2>
        </div>

        {/* HEADER */}
        <div className="absolute top-16 left-8 lg:left-24 z-20">
          <p className="uppercase tracking-[0.5em] text-xs text-gray-500 mb-4">
            Beyond Plastic
          </p>

          <h2
            className="
        text-4xl
        sm:text-5xl
        lg:text-7xl
        font-black
        uppercase
        leading-[0.85]
      "
          >
            More Than
            <br />
            Bottles
          </h2>
        </div>

        {/* DESCRIPTION */}
        <div
          className="
      absolute
      top-20
      right-8
      lg:right-24
      max-w-[420px]
      z-20
    "
        >
          <p className="text-gray-600 leading-8">
            Botol plastik bukan satu-satunya limbah yang dapat didaur ulang.
            Berbagai material lain juga memiliki kesempatan untuk mendapatkan
            kehidupan kedua melalui proses pengolahan yang tepat.
          </p>
        </div>

        {/* MAIN ROW */}
        <div className="relative z-10 h-full flex items-center justify-center px-8 lg:px-20">
          <div className="grid grid-cols-5 items-end gap-8 lg:gap-16 w-full max-w-[1600px]">
            {/* TEXTILE */}
            <div className="text-center">
              <Image
                src="/img/textile.png"
                alt="Textile"
                width={420}
                height={700}
                className="object-contain mx-auto"
              />

              <p className="mt-6 text-xs tracking-[0.4em] uppercase text-gray-400">
                Recyclable
              </p>

              <h3 className="text-2xl lg:text-3xl font-black uppercase mt-2">
                Textile
              </h3>
            </div>

            {/* PAPER */}
            <div className="text-center">
              <Image
                src="/img/paper.png"
                alt="Paper"
                width={420}
                height={700}
                className="object-contain mx-auto"
              />

              <p className="mt-6 text-xs tracking-[0.4em] uppercase text-gray-400">
                Recyclable
              </p>

              <h3 className="text-2xl lg:text-3xl font-black uppercase mt-2">
                Paper
              </h3>
            </div>

            {/* SLOT BOTOL */}
            <div className="text-center">
              <div className="h-[280px] lg:h-[360px]" />

              <p className="mt-6 text-xs tracking-[0.4em] uppercase text-gray-400">
                Recyclable
              </p>

              <h3 className="text-2xl lg:text-3xl font-black uppercase mt-2">
                Plastic
              </h3>
            </div>

            {/* GLASS */}
            <div className="text-center">
              <Image
                src="/img/glass.png"
                alt="Glass"
                width={420}
                height={700}
                className="object-contain mx-auto"
              />

              <p className="mt-6 text-xs tracking-[0.4em] uppercase text-gray-400">
                Recyclable
              </p>

              <h3 className="text-2xl lg:text-3xl font-black uppercase mt-2">
                Glass
              </h3>
            </div>

            {/* E-WASTE */}
            <div className="text-center">
              <Image
                src="/img/e-waste.png"
                alt="E-Waste"
                width={420}
                height={700}
                className="object-contain mx-auto"
              />

              <p className="mt-6 text-xs tracking-[0.4em] uppercase text-gray-400">
                Recyclable
              </p>

              <h3 className="text-2xl lg:text-3xl font-black uppercase mt-2">
                E-Waste
              </h3>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
