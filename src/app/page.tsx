"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";
import Navbar from "@/components/Navbar";
import { useInView } from "framer-motion";

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

const recognitionSteps = [
  {
    number: "01",
    title: "Ambil Foto",
    text: "Cukup jepret langsung foto sampahmu, atau unggah gambar dari galeri.",
    icon: "📷",
  },
  {
    number: "02",
    title: "Deteksi Sampah",
    text: "Sistem AI akan memproses dan mengenali jenis sampah berdasarkan gambar.",
    icon: "🧠",
  },
  {
    number: "03",
    title: "Langkah Nyata",
    text: "Dapatkan panduan praktis membuang sampah atau ide daur ulang menarik.",
    icon: "♻️",
  },
];

const workflowSteps = [
  {
    number: "01",
    title: "Input Sampah",
    icon: "📷",
    desc: "Pengguna mengunggah atau memotret sampah.",
    color: "#446C66",
  },
  {
    number: "02",
    title: "AI Detection",
    icon: "🤖",
    desc: "Model AI mengenali objek sampah.",
    color: "#00A99D",
  },
  {
    number: "03",
    title: "Klasifikasi",
    icon: "♻️",
    desc: "Menentukan kategori sampah.",
    color: "#7BBF6A",
  },
  {
    number: "04",
    title: "Analisis",
    icon: "📊",
    desc: "Mengolah informasi dan karakteristik.",
    color: "#F59E0B",
  },
  {
    number: "05",
    title: "Rekomendasi",
    icon: "💡",
    desc: "Memberikan solusi pengelolaan terbaik.",
    color: "#8B5CF6",
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

  const [showBottle, setShowBottle] = useState(true);

  // SECTION 6 mulai sekitar 0.83
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest >= 0.83) {
      setShowBottle(false);
    } else {
      setShowBottle(true);
    }
  });

  const bottleEnd = 0.83;

  // ROTATE BOTOL
  const bottleRotate = useTransform(
    scrollYProgress,
    [0, 0.16, 0.33, 0.5, 0.66, bottleEnd, 1],
    [18, 0, 0, 0, 0, 0, 0],
    {
      clamp: true,
    },
  );

  // POSISI X
  const bottleX = useTransform(
    scrollYProgress,
    [0, 0.16, 0.33, 0.5, 0.66, bottleEnd, 1],
    [0, 180, 0, 0, 0, 0, 0],
    {
      clamp: true,
    },
  );

  // POSISI Y
  const bottleY = useTransform(
    scrollYProgress,
    [0, 0.16, 0.33, 0.5, 0.66, bottleEnd, 1],
    [0, 0, 0, 0, -30, -50, -50],
    {
      clamp: true,
    },
  );

  // SCALE
  const bottleScale = useTransform(
    scrollYProgress,
    [0, 0.16, 0.33, 0.5, 0.66, bottleEnd, 1],
    [1, 0.85, 0.9, 0.85, 0.75, 0.45, 0.45],
    {
      clamp: true,
    },
  );

  const smoothRotate = useSpring(bottleRotate, springConfigWithMass);

  const smoothX = useSpring(bottleX, springConfigWithMass);

  const smoothY = useSpring(bottleY, springConfigWithMass);

  const smoothScale = useSpring(bottleScale, springConfigWithMass);

  // const detailOpacity = useTransform(
  //   scrollYProgress,
  //   [0.16, 0.22, 0.33, 0.36],
  //   [0, 1, 1, 0],
  //   {
  //     clamp: true,
  //   },
  // );

  // const detailX = useTransform(
  //   scrollYProgress,
  //   [0.16, 0.22, 0.33, 0.36],
  //   [120, -60, -60, 120],
  //   {
  //     clamp: true,
  //   },
  // );

  // const smoothDetailOpacity = useSpring(detailOpacity, springConfig);
  // const smoothDetailX = useSpring(detailX, springConfig);

  return (
    <main
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory bg-white"
    >
      {showBottle && (
        <motion.div
          className="
    fixed
    inset-0
    z-30
    pointer-events-none
    flex
    items-center
    justify-center
  "
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
      )}

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
        {/* BACKGROUND */}
        <div className="absolute right-10 top-10 text-[18vw] font-black text-black/[0.03] leading-none pointer-events-none">
          PET
        </div>

        <div className="absolute left-[52%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full border border-black/10" />

        <div className="absolute left-[52%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full border border-dashed border-black/10" />

        {/* LABEL BACKGROUND */}
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

        {/* MAIN CONTENT WRAPPER */}
        <div
          className="
      relative
      z-10
      w-full
      flex
      flex-col
      lg:flex-row
      items-center
      justify-between
      gap-16
    "
        >
          {/* LEFT CONTENT */}
          <div
            className="
        max-w-[560px]
        w-full
      "
          >
            <p className="uppercase tracking-[0.5em] text-xs text-gray-500 mb-6">
              Material Exploration
            </p>

            <h2
              className="
        text-[48px]
        sm:text-[70px]
        lg:text-[100px]
        font-black
        uppercase
        leading-[0.85]
        tracking-tight
      "
            >
              Bottle
              <br />
              Plastic
            </h2>

            <div className="mt-8 flex items-center gap-6">
              <div className="w-16 h-px bg-black" />

              <p
                className="
          text-gray-600
          leading-8
          w-full
          max-w-[430px]
        "
              >
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

            <button
              className="
          mt-12
          bg-black
          text-white
          px-10
          py-4
          uppercase
          tracking-widest
          text-sm
          font-bold
          hover:translate-x-2
          transition
        "
            >
              Explore
            </button>
          </div>

          {/* RIGHT CARD */}
          <motion.div
            initial={{
              opacity: 0,
              x: 80,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.4,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="
        w-full
        max-w-[430px]
        bg-white
        border
        border-black/20
        p-8
        shadow-[25px_25px_0px_rgba(0,0,0,0.05)]
      "
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

              <div
                className="
            border
            border-black
            rounded-full
            w-14
            h-14
            flex
            items-center
            justify-center
            text-xl
          "
              >
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
        </div>
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

      <section
        className="
  relative
  min-h-screen
  snap-start
  bg-[#f8f7f3]
  overflow-hidden
  py-24
  flex
  justify-center
"
      >
        {/* GRID BG */}
        <div className="absolute inset-0 opacity-[0.04]">
          <svg className="w-full h-full">
            <defs>
              <pattern
                id="dot"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="2" fill="black" />
              </pattern>
            </defs>

            <rect width="100%" height="100%" fill="url(#dot)" />
          </svg>
        </div>

        {/* WATERMARK */}
        <h2
          className="
    absolute
    top-10
    left-10
    text-[13vw]
    font-black
    uppercase
    text-black/[0.03]
    leading-none
    pointer-events-none
  "
        >
          AI FLOW
        </h2>

        <div
          className="
    relative
    z-10
    w-full
    max-w-[1500px]
    px-4
  "
        >
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <p
              className="
        uppercase
        tracking-[0.5em]
        text-xs
        text-gray-400
        mb-5
      "
            >
              Recognition Pipeline
            </p>

            <h2
              className="
        text-4xl
        lg:text-6xl
        font-black
        leading-[0.9]
      "
            >
              Waste Detection
              <br />
              Workflow
            </h2>
          </motion.div>

          {/* FLOW */}
          <div
            className="
  relative
  flex
  items-start
  justify-between
  gap-2
  w-full
"
          >
            {/* ===================================================== */}
            {/* STEP 1 */}
            {/* ===================================================== */}

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative w-[190px]"
            >
              <p className="font-black text-lg mb-5">Input</p>

              <div
                className="
          border-2
          border-dashed
          border-black/20
          rounded-[22px]
          bg-white
          p-4
        "
              >
                <div
                  className="
            bg-[#f4f4f4]
            rounded-2xl
            overflow-hidden
            border
            border-black/10
          "
                >
                  <Image
                    src="/img/botol_plastik.png"
                    alt="Waste"
                    width={250}
                    height={320}
                    className="
              object-contain
              h-[220px]
              mx-auto
            "
                  />
                </div>

                <div className="mt-4">
                  <h3 className="font-black uppercase text-base">
                    Waste Image
                  </h3>

                  <p className="text-xs text-gray-500 mt-2 leading-6">
                    Input gambar sampah dari kamera.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ARROW */}

            <div className="pt-[155px] shrink-0">
              <div
                className="
          w-10
          h-[3px]
          bg-[#446C66]
          relative
        "
              >
                <div
                  className="
            absolute
            right-0
            top-1/2
            -translate-y-1/2
            w-3
            h-3
            border-t-[3px]
            border-r-[3px]
            border-[#446C66]
            rotate-45
          "
                />
              </div>
            </div>

            {/* ===================================================== */}
            {/* STEP 2 */}
            {/* ===================================================== */}

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="relative w-[210px]"
            >
              <p className="font-black text-lg mb-5">Preprocessing</p>

              <div
                className="
          border-2
          border-dashed
          border-black/20
          rounded-[22px]
          bg-white
          p-4
          flex
          flex-col
          gap-4
        "
              >
                <div
                  className="
            border
            border-black/10
            rounded-2xl
            p-4
          "
                >
                  <div className="text-4xl mb-3">🖼️</div>

                  <h3 className="font-black uppercase text-sm">Resize</h3>

                  <p className="text-xs text-gray-500 mt-1">224 × 224</p>
                </div>

                <div
                  className="
            border
            border-black/10
            rounded-2xl
            p-4
          "
                >
                  <div className="text-4xl mb-3">📊</div>

                  <h3 className="font-black uppercase text-sm">
                    Normalization
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">Rescaling [0,1]</p>
                </div>
              </div>
            </motion.div>

            {/* ARROW */}

            <div className="pt-[155px] shrink-0">
              <div
                className="
          w-10
          h-[3px]
          bg-[#446C66]
          relative
        "
              >
                <div
                  className="
            absolute
            right-0
            top-1/2
            -translate-y-1/2
            w-3
            h-3
            border-t-[3px]
            border-r-[3px]
            border-[#446C66]
            rotate-45
          "
                />
              </div>
            </div>

            {/* ===================================================== */}
            {/* STEP 3 */}
            {/* ===================================================== */}

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative w-[240px]"
            >
              <p className="font-black text-lg mb-5 text-[#234EA0]">
                Feature Extraction
              </p>

              <div
                className="
          border-2
          border-dashed
          border-[#7db4ff]
          rounded-[22px]
          bg-white
          p-5
        "
              >
                <div className="flex justify-center gap-3 mb-6">
                  {[130, 110, 85, 60].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [0, -8, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                      style={{
                        height: `${h}px`,
                      }}
                      className="
                w-10
                rounded-t-xl
                bg-gradient-to-b
                from-[#8cc4ff]
                to-[#4e8dd6]
              "
                    />
                  ))}
                </div>

                <div className="space-y-3">
                  {[
                    "Convolutional Layers",
                    "Global Average Pooling",
                    "Feature Vector",
                  ].map((item) => (
                    <div
                      key={item}
                      className="
                border
                border-[#b8d7ff]
                rounded-xl
                py-2
                px-3
                text-center
                font-semibold
                text-sm
              "
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ARROW */}

            <div className="pt-[155px] shrink-0">
              <div
                className="
          w-10
          h-[3px]
          bg-[#446C66]
          relative
        "
              >
                <div
                  className="
            absolute
            right-0
            top-1/2
            -translate-y-1/2
            w-3
            h-3
            border-t-[3px]
            border-r-[3px]
            border-[#446C66]
            rotate-45
          "
                />
              </div>
            </div>

            {/* ===================================================== */}
            {/* STEP 4 */}
            {/* ===================================================== */}

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="relative w-[230px]"
            >
              <p className="font-black text-lg mb-5 text-[#2E7D32]">
                Classification
              </p>

              <div
                className="
          border-2
          border-dashed
          border-[#8fd88b]
          rounded-[22px]
          bg-white
          p-4
        "
              >
                <div className="space-y-2">
                  {[
                    "Cardboard",
                    "Plastic",
                    "Paper",
                    "Metal",
                    "Glass",
                    "Organic",
                    "E-Waste",
                    "Textile",
                  ].map((item, i) => (
                    <div
                      key={item}
                      className="
                flex
                items-center
                gap-3
                border
                border-[#d5f0d2]
                rounded-xl
                px-3
                py-2
              "
                    >
                      <div
                        className="
                  w-7
                  h-7
                  rounded-full
                  bg-[#7BBF6A]
                  flex
                  items-center
                  justify-center
                  text-white
                  text-xs
                  font-black
                "
                      >
                        {i + 1}
                      </div>

                      <p className="font-semibold text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ARROW */}

            <div className="pt-[155px] shrink-0">
              <div
                className="
          w-10
          h-[3px]
          bg-[#446C66]
          relative
        "
              >
                <div
                  className="
            absolute
            right-0
            top-1/2
            -translate-y-1/2
            w-3
            h-3
            border-t-[3px]
            border-r-[3px]
            border-[#446C66]
            rotate-45
          "
                />
              </div>
            </div>

            {/* ===================================================== */}
            {/* STEP 5 */}
            {/* ===================================================== */}

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative w-[200px]"
            >
              <p className="font-black text-lg mb-5 text-[#7B1FA2]">
                Predicted
              </p>

              <div
                className="
          border-2
          border-dashed
          border-[#c78cff]
          rounded-[22px]
          bg-white
          p-5
          text-center
        "
              >
                <div
                  className="
            w-28
            h-28
            rounded-full
            bg-[#4da3ff]
            mx-auto
            flex
            items-center
            justify-center
            text-5xl
            text-white
            mb-6
          "
                >
                  ♻️
                </div>

                <h3 className="text-2xl font-black uppercase">Plastic</h3>

                <p className="mt-3 text-gray-500 text-xs leading-6">
                  Predicted Waste Category
                </p>
              </div>
            </motion.div>

            {/* ARROW */}

            <div className="pt-[155px] shrink-0">
              <div
                className="
          w-10
          h-[3px]
          bg-[#446C66]
          relative
        "
              >
                <div
                  className="
            absolute
            right-0
            top-1/2
            -translate-y-1/2
            w-3
            h-3
            border-t-[3px]
            border-r-[3px]
            border-[#446C66]
            rotate-45
          "
                />
              </div>
            </div>

            {/* ===================================================== */}
            {/* STEP 6 */}
            {/* ===================================================== */}

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="relative w-[210px]"
            >
              <p className="font-black text-lg mb-5 text-[#E65100]">
                Recommendation
              </p>

              <div
                className="
          border-2
          border-dashed
          border-[#ffb16d]
          rounded-[22px]
          bg-white
          p-5
          flex
          flex-col
          items-center
          justify-center
          min-h-[400px]
        "
              >
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="
            w-24
            h-24
            rounded-full
            bg-[#ff7a00]
            flex
            items-center
            justify-center
            text-white
            text-5xl
          "
                >
                  🛢️
                </motion.div>

                <p
                  className="
            mt-6
            text-center
            text-gray-600
            text-xs
            leading-7
          "
                >
                  Mapping kategori sampah dan rekomendasi daur ulang.
                </p>
              </div>
            </motion.div>

            {/* ARROW */}

            <div className="pt-[155px] shrink-0">
              <div
                className="
          w-10
          h-[3px]
          bg-[#446C66]
          relative
        "
              >
                <div
                  className="
            absolute
            right-0
            top-1/2
            -translate-y-1/2
            w-3
            h-3
            border-t-[3px]
            border-r-[3px]
            border-[#446C66]
            rotate-45
          "
                />
              </div>
            </div>

            {/* ===================================================== */}
            {/* STEP 7 */}
            {/* ===================================================== */}

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="relative w-[250px]"
            >
              <p className="font-black text-lg mb-5 text-[#00838F]">
                Craft Recommendation
              </p>

              <div
                className="
          border-2
          border-dashed
          border-[#7bd5dd]
          rounded-[22px]
          bg-white
          p-4
        "
              >
                <div className="space-y-4">
                  {[
                    {
                      title: "Flower Pot",
                      img: "/img/botol_plastik_pot_bunga.png",
                    },
                    {
                      title: "Pencil Holder",
                      img: "/img/botol_plastik_lampu_kamar.png",
                    },
                    {
                      title: "Eco Brick",
                      img: "/img/botol_plastik_anjing.png",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="
                flex
                items-center
                gap-3
                border
                border-black/10
                rounded-2xl
                p-3
              "
                    >
                      <div
                        className="
                  w-16
                  h-16
                  rounded-xl
                  overflow-hidden
                  bg-[#f3f3f3]
                  shrink-0
                "
                      >
                        <Image
                          src={item.img}
                          alt={item.title}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      </div>

                      <div>
                        <h4 className="font-black uppercase text-sm">
                          {item.title}
                        </h4>

                        <p className="text-xs text-gray-500 mt-1">
                          Recycled plastic waste
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
