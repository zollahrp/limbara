"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  /* =========================
     BOTOL ANIMATION
  ========================= */

  // Miring -> lurus
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 1],
    [18, 0, 0, 0],
  );

  // Geser ke kanan saat masuk section 2 dan 3
  const bottleX = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [0, 180, 0, 0, 0],
  );

  // Sedikit mengecil
  const scale = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [1, 0.85, 0.9, 0.85, 0.75],
  );

  const smoothX = useSpring(bottleX, {
    stiffness: 60,
    damping: 20,
    mass: 0.8,
  });

  const smoothScale = useSpring(scale, {
    stiffness: 60,
    damping: 20,
    mass: 0.8,
  });

  const smoothRotate = useSpring(rotate, {
    stiffness: 60,
    damping: 20,
    mass: 0.8,
  });

  /* =========================
     DETAIL CARD ANIMATION
  ========================= */

  const detailOpacity = useTransform(
    scrollYProgress,
    [0.25, 0.38, 0.5],
    [0, 1, 1],
  );

  const detailX = useTransform(scrollYProgress, [0.25, 0.38], [120, 0]);
  const smoothDetailX = useSpring(detailX, {
    stiffness: 60,
    damping: 20,
  });

  const smoothDetailOpacity = useSpring(detailOpacity, {
    stiffness: 60,
    damping: 20,
  });

  return (
    <main
      ref={containerRef}
      className="
        h-screen
        overflow-y-scroll
        snap-y
        snap-mandatory
        bg-white
      "
    >
      {/* ==========================================
          GLOBAL BOTTLE
      ========================================== */}
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
        }}
      >
        <div className="relative w-[420px] h-[900px]">
          <Image
            src="/img/botol_plastik.png"
            alt="Botol Plastik"
            fill
            priority
            className="
              object-contain
              select-none
              drop-shadow-[0_40px_60px_rgba(0,0,0,0.25)]
            "
          />
        </div>
      </motion.div>

      {/* ==========================================
          HERO SECTION
      ========================================== */}
      <section className="relative h-screen snap-start overflow-hidden bg-white">
        {/* Header */}
        <header className="absolute top-0 left-0 w-full flex items-center justify-between px-12 py-8 z-40">
          <div className="flex items-center gap-8">
            <button className="text-3xl">☰</button>

            <div>
              <h1 className="text-4xl font-black tracking-[0.3em] text-red-900">
                LIMBARA
              </h1>

              <p className="text-xs tracking-[0.5em] uppercase text-gray-600">
                Waste Recycling
              </p>
            </div>
          </div>

          <button className="bg-green-700 text-white px-8 py-3 font-bold uppercase">
            Login
          </button>
        </header>

        {/* Sidebar */}
        <div className="absolute left-0 top-0 h-full w-24 flex flex-col items-center py-8 z-20">
          <div className="w-px flex-1 bg-black/20" />

          <button className="text-2xl mb-10">⌕</button>

          <div className="w-px flex-1 bg-black/20" />
        </div>

        {/* Background Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h2
            className="
              text-[12vw]
              leading-[0.85]
              font-black
              uppercase
              text-green-700/20
              opacity-90
              text-center
            "
          >
            BOTOL
            <br />
            PLASTIK
          </h2>
        </div>

        {/* Bottom Left */}
        <div className="absolute bottom-16 left-32 z-20">
          <p className="italic text-2xl mb-2">Unlimited Recycle</p>

          <h3 className="text-7xl font-black uppercase leading-none">
            Botol
            <br />
            Plastik
          </h3>
        </div>
      </section>

      {/* ==========================================
    DETAIL SECTION
========================================== */}
      <section
        className="
    relative
    h-screen
    snap-start
    bg-[#faf9f6]
    px-20
    flex
    items-center
    overflow-hidden
  "
      >
        {/* BACKGROUND NUMBER */}
        <div
          className="
      absolute
      right-10
      top-10
      text-[18vw]
      font-black
      text-black/[0.03]
      leading-none
      pointer-events-none
    "
        >
          PET
        </div>

        {/* Soft Circle Behind Bottle */}
        <div
          className="
    absolute
    left-[52%]
    top-1/2
    -translate-x-1/2
    -translate-y-1/2
    w-[620px]
    h-[620px]
    rounded-full
    border
    border-black/10
  "
        />

        <div
          className="
    absolute
    left-[52%]
    top-1/2
    -translate-x-1/2
    -translate-y-1/2
    w-[480px]
    h-[480px]
    rounded-full
    border
    border-dashed
    border-black/10
  "
        />

        {/* Technical Lines */}

        <div
          className="
    absolute
    left-[40%]
    top-[35%]
    w-[180px]
    h-px
    bg-black/20
  "
        />

        <div
          className="
    absolute
    left-[40%]
    top-[35%]
    -translate-y-1/2
    text-[10px]
    uppercase
    tracking-[0.4em]
    text-gray-400
  "
        >
          Lightweight Material
        </div>

        <div
          className="
    absolute
    left-[56%]
    bottom-[35%]
    w-[160px]
    h-px
    bg-black/20
  "
        />

        <div
          className="
    absolute
    left-[56%]
    bottom-[32%]
    text-[10px]
    uppercase
    tracking-[0.4em]
    text-gray-400
  "
        >
          Ready To Recycle
        </div>

        {/* Center Mini Data */}

        <div
          className="
    absolute
    left-[52%]
    bottom-[18%]
    -translate-x-1/2
    text-center
  "
        >
          <p
            className="
text-[10px]
uppercase
tracking-[0.5em]
text-gray-400
"
          >
            Material Type
          </p>

          <h4
            className="
text-4xl
font-black
"
          >
            PET
          </h4>
        </div>

        {/* LEFT CONTENT */}
        <div
          className="
      relative
      z-10
      max-w-[560px]
    "
        >
          <p
            className="
        uppercase
        tracking-[0.5em]
        text-xs
        text-gray-500
        mb-6
      "
          >
            Material Exploration
          </p>

          <h2
            className="
        text-[100px]
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

          <div
            className="
        mt-8
        flex
        items-center
        gap-6
      "
          >
            <div
              className="
          w-16
          h-px
          bg-black
        "
            />

            <p
              className="
          text-gray-600
          leading-8
          max-w-[430px]
        "
            >
              Botol plastik PET hadir sebagai material ringan, kuat, dan
              fleksibel yang dapat kembali menjadi berbagai produk bernilai
              melalui proses daur ulang.
            </p>
          </div>

          {/* MINI STATS */}

          <div
            className="
        mt-12
        flex
        gap-12
      "
          >
            <div>
              <p
                className="
            text-xs
            uppercase
            tracking-widest
            text-gray-400
          "
              >
                Category
              </p>

              <p
                className="
            text-3xl
            font-black
          "
              >
                PET
              </p>
            </div>

            <div>
              <p
                className="
            text-xs
            uppercase
            tracking-widest
            text-gray-400
          "
              >
                Recycle
              </p>

              <p
                className="
            text-3xl
            font-black
          "
              >
                ♻ 100%
              </p>
            </div>

            <div>
              <p
                className="
            text-xs
            uppercase
            tracking-widest
            text-gray-400
          "
              >
                Weight
              </p>

              <p
                className="
            text-3xl
            font-black
          "
              >
                25g
              </p>
            </div>
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
          style={{
            opacity: smoothDetailOpacity,
            x: smoothDetailX,
          }}
          className="
      relative
      z-20
      ml-auto
      mr-20
      w-[430px]
      bg-white
      border
      border-black/20
      p-8
      shadow-[25px_25px_0px_rgba(0,0,0,0.05)]
    "
        >
          <div
            className="
        flex
        justify-between
        items-start
        mb-8
      "
          >
            <div>
              <p
                className="
            text-xs
            uppercase
            tracking-[0.4em]
            text-gray-400
          "
              >
                Plastic Intelligence
              </p>

              <h3
                className="
            text-3xl
            font-black
            uppercase
          "
              >
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
            {/* FACT */}
            <div
              className="
          border-t
          pt-5
        "
            >
              <p className="text-xs uppercase tracking-widest text-gray-400">
                Decomposition Time
              </p>

              <div className="text-5xl font-black">450+</div>

              <p className="text-gray-600 mt-2">
                Tahun untuk terurai secara alami jika tidak dikelola.
              </p>
            </div>

            <div
              className="
          border-t
          pt-5
        "
            >
              <p className="text-xs uppercase tracking-widest text-gray-400">
                New Possibility
              </p>

              <div className="text-5xl font-black">1 → ∞</div>

              <p className="text-gray-600 mt-2">
                Satu botol dapat berubah menjadi banyak produk baru.
              </p>
            </div>

            <div
              className="
          border-t
          pt-5
        "
            >
              <p className="text-xs uppercase tracking-widest text-gray-400">
                Everyday Impact
              </p>

              <div className="text-5xl font-black">1 Botol</div>

              <p className="text-gray-600 mt-2">
                Perubahan kecil yang membantu menjaga lingkungan.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ==========================================
          SECTION 3
      ========================================== */}
      <section className="relative h-screen snap-start bg-[#f8f6f2] overflow-hidden">
        {/* Background Text */}
        <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
          <h2
            className="
        text-[11vw]
        font-black
        uppercase
        text-green-700/20
        leading-none
        mt-10
      "
          >
            RECYCLE
          </h2>
        </div>

        <div className="relative z-10 h-full px-24">
          <div className="grid grid-cols-2 h-full items-center">
            {/* LEFT */}
            <div>
              <div className="w-[520px]">
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

              {/* Highlight */}
              <div className="mt-20 max-w-[350px]">
                <div
                  className="
              bg-green-700
              text-white
              p-8
              rotate-[-4deg]
            "
                >
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

            {/* RIGHT */}
            <div className="max-w-[520px] ml-auto">
              <p className="uppercase tracking-[0.3em] text-gray-500 mb-4">
                Circular Economy
              </p>

              <h3
                className="
            text-7xl
            font-black
            uppercase
            leading-none
            mb-8
          "
              >
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

      {/* ==========================================
    SECTION 4 - SECOND LIFE
========================================== */}
      <section
        className="
    relative
    h-screen
    snap-start
    bg-[#f5f2eb]
    overflow-hidden
  "
      >
        {/* BACKGROUND TEXT */}
        <div
          className="
    absolute
    inset-0
    flex
    items-center
    justify-center
    pointer-events-none
  "
        >
          <h2
            className="
      text-[15vw]
      font-black
      uppercase
      text-black/[0.035]
      tracking-widest
    "
          >
            REBORN
          </h2>
        </div>

        {/* HEADER */}
        <div
          className="
    absolute
    top-20
    left-24
    z-20
  "
        >
          <p
            className="
      uppercase
      tracking-[0.5em]
      text-xs
      text-gray-500
      mb-4
    "
          >
            Produk Daur Ulang
          </p>

          <h2
            className="
      text-7xl
      font-black
      uppercase
      leading-[0.85]
    "
          >
            Second
            <br />
            Life
          </h2>
        </div>

        {/* ORBIT CIRCLE */}
        <div
          className="
absolute
top-1/2
left-1/2
-translate-x-1/2
-translate-y-1/2
w-[650px]
h-[650px]
rounded-full
border
border-dashed
border-black/20
"
        />

        {/* INNER CIRCLE */}
        <div
          className="
absolute
top-1/2
left-1/2
-translate-x-1/2
-translate-y-1/2
w-[360px]
h-[360px]
rounded-full
border
border-black/10
"
        />

        {/* CONNECTION LINES */}

        <div
          className="
absolute
top-[42%]
left-[43%]
w-[220px]
h-px
bg-black/20
rotate-[-35deg]
origin-left
"
        />

        <div
          className="
absolute
top-[58%]
left-[43%]
w-[200px]
h-px
bg-black/20
rotate-[35deg]
origin-left
"
        />

        <div
          className="
absolute
top-[42%]
right-[43%]
w-[220px]
h-px
bg-black/20
rotate-[35deg]
origin-right
"
        />

        <div
          className="
absolute
bottom-[42%]
right-[43%]
w-[200px]
h-px
bg-black/20
rotate-[-35deg]
origin-right
"
        />

        {/* CENTER BOTTLE AREA */}
        <div
          className="
absolute
top-1/2
left-1/2
-translate-x-1/2
-translate-y-1/2
z-20
text-center
"
        >
          <div
            className="
w-4
h-4
rounded-full
bg-black
mx-auto
mb-5
"
          />

          <p
            className="
uppercase
tracking-[0.5em]
text-xs
text-gray-500
"
          >
            Satu Botol
          </p>

          <h3
            className="
text-3xl
font-black
uppercase
"
          >
            Infinite
            <br />
            Possibilities
          </h3>
        </div>

        {/* PRODUCT 1 LAMPU */}

        <motion.div
          animate={{
            y: [0, -25, 0],
            rotate: [-5, -2, -5],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
absolute
top-[200px]
left-[220px]
w-[380px]
z-10
"
        >
          <Image
            src="/img/botol_plastik_lampu_kamar.png"
            alt="Lampu Hias"
            width={450}
            height={450}
            className="
object-contain
drop-shadow-2xl
"
          />

          <div
            className="
absolute
bottom-5
left-1/2
-translate-x-1/2
bg-white/80
backdrop-blur
border
border-black/10
px-5
py-2
whitespace-nowrap
text-center
"
          >
            <p className="text-[9px] tracking-[0.4em] text-gray-500">
              RECYCLED
            </p>

            <h4 className="font-black uppercase">Lampu Hias</h4>
          </div>
        </motion.div>

        {/* PRODUCT 2 POT */}

        <motion.div
          animate={{
            y: [0, 25, 0],
            rotate: [5, 8, 5],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="
absolute
bottom-[120px]
left-[330px]
w-[330px]
z-10
"
        >
          <Image
            src="/img/botol_plastik_pot_bunga.png"
            alt="Pot"
            width={400}
            height={400}
            className="
object-contain
drop-shadow-2xl
"
          />

          <div
            className="
absolute
bottom-0
left-1/2
-translate-x-1/2
bg-white/80
backdrop-blur
border
border-black/10
px-5
py-2
whitespace-nowrap
text-center
"
          >
            <p className="text-[9px] tracking-[0.4em] text-gray-500">
              REBORN MATERIAL
            </p>

            <h4 className="font-black uppercase">Pot Bunga</h4>
          </div>
        </motion.div>

        {/* PRODUCT 3 ANJING */}

        <motion.div
          animate={{
            y: [0, -30, 0],
            rotate: [5, 2, 5],
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.8,
          }}
          className="
absolute
top-[200px]
right-[220px]
w-[360px]
z-10
"
        >
          <Image
            src="/img/botol_plastik_anjing.png"
            alt="Anjing"
            width={450}
            height={450}
            className="
object-contain
drop-shadow-2xl
"
          />

          <div
            className="
absolute
bottom-0
left-1/2
-translate-x-1/2
bg-white/80
backdrop-blur
border
border-black/10
px-5
py-2
whitespace-nowrap
text-center
"
          >
            <p className="text-[9px] tracking-[0.4em] text-gray-500">
              CREATIVE REUSE
            </p>

            <h4 className="font-black uppercase">Anjing Lucu</h4>
          </div>
        </motion.div>

        {/* PRODUCT 4 KUDA */}

        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [-5, -8, -5],
          }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="
absolute
bottom-[110px]
right-[300px]
w-[360px]
z-10
"
        >
          <Image
            src="/img/botol_plastik_kuda.png"
            alt="Kuda"
            width={450}
            height={450}
            className="
object-contain
drop-shadow-2xl
"
          />

          <div
            className="
absolute
bottom-0
left-1/2
-translate-x-1/2
bg-white/80
backdrop-blur
border
border-black/10
px-5
py-2
whitespace-nowrap
text-center
"
          >
            <p className="text-[9px] tracking-[0.4em] text-gray-500">
              UPCYCLING
            </p>

            <h4 className="font-black uppercase">Kuda Keren</h4>
          </div>
        </motion.div>

        {/* RIGHT CAPTION */}

        <div
          className="
absolute
right-24
top-1/2
-translate-y-1/2
text-right
z-20
"
        >
          <p
            className="
uppercase
tracking-[0.4em]
text-xs
text-gray-400
"
          >
            Satu Botol
          </p>

          <h4
            className="
text-3xl
font-black
uppercase
"
          >
            Four
            <br />
            Possibilities
          </h4>
        </div>
      </section>
    </main>
  );
}
