"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { secondLifeProducts } from "@/constants/HomeData";

function ProductCard({
  product,
}: {
  product: (typeof secondLifeProducts)[number];
}) {
  return (
    <motion.div
      animate={product.animate}
      transition={product.transition as any}
      className={`
        ${product.position}
        scale-[0.65]
        sm:scale-75
        lg:scale-100
      `}
    >
      <Image
        src={product.src}
        alt={product.alt}
        width={450}
        height={450}
        className="object-contain drop-shadow-2xl"
      />

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur border border-black/10 px-4 py-2 whitespace-nowrap text-center">
        <p className="text-[8px] tracking-[0.3em] text-black/60">
          {product.badge}
        </p>

        <h4 className="font-black uppercase text-sm lg:text-base text-black">
          {product.label}
        </h4>
      </div>
    </motion.div>
  );
}

export default function RebornSection() {
  return (
    <section
      className="
      relative
      min-h-screen
      snap-start
      bg-[#f5f2eb]
      overflow-hidden
      pt-32
      lg:pt-0
    "
    >
      {/* WATERMARK */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h2 className="text-[20vw] lg:text-[15vw] font-black uppercase text-black/[0.035] tracking-widest">
          REBORN
        </h2>
      </div>

      {/* TITLE */}
      <div
        className="
        absolute
        top-24
        left-1/2
        -translate-x-1/2
        text-center
        z-20

        lg:left-24
        lg:translate-x-0
        lg:text-left
      "
      >
        <p className="uppercase tracking-[0.5em] text-xs text-black/60 mb-4">
          Produk Daur Ulang
        </p>

        <h2
          className="
          text-5xl
          sm:text-6xl
          lg:text-7xl
          font-black
          uppercase
          leading-[0.85]
          text-black
        "
        >
          Kehidupan
          <br />
          Kedua
        </h2>
      </div>

      {/* CIRCLE */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] sm:w-[420px] sm:h-[420px] lg:w-[650px] lg:h-[650px] rounded-full border border-dashed border-black/20" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[170px] h-[170px] sm:w-[250px] sm:h-[250px] lg:w-[360px] lg:h-[360px] rounded-full border border-black/10" />

      {/* GARIS DEKORASI DESKTOP */}
      <div className="hidden lg:block absolute top-[42%] left-[43%] w-[220px] h-px bg-black/20 rotate-[-35deg] origin-left" />

      <div className="hidden lg:block absolute top-[58%] left-[43%] w-[200px] h-px bg-black/20 rotate-[35deg] origin-left" />

      <div className="hidden lg:block absolute top-[42%] right-[43%] w-[220px] h-px bg-black/20 rotate-[35deg] origin-right" />

      <div className="hidden lg:block absolute bottom-[42%] right-[43%] w-[200px] h-px bg-black/20 rotate-[-35deg] origin-right" />

      {/* CENTER TEXT */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center">
        <div className="w-4 h-4 rounded-full bg-black mx-auto mb-5" />

        <p className="uppercase tracking-[0.5em] text-[10px] text-black/60">
          Satu Botol
        </p>

        <h3
          className="
          text-xl
          sm:text-2xl
          lg:text-3xl
          font-black
          uppercase
          text-black
        "
        >
          Tak Terbatas
          <br />
          Kemungkinan
        </h3>
      </div>

      {/* PRODUCT */}
      {secondLifeProducts.map((product: any) => (
        <ProductCard key={product.key} product={product} />
      ))}

      {/* RIGHT TEXT */}
      <div
        className="
        absolute
        bottom-10
        left-1/2
        -translate-x-1/2
        text-center
        z-20

        lg:right-24
        lg:left-auto
        lg:translate-x-0
        lg:top-1/2
        lg:-translate-y-1/2
        lg:text-right
      "
      >
        <p className="uppercase tracking-[0.4em] text-xs text-black/50">
          Satu Botol
        </p>

        <h4
          className="
          text-2xl
          lg:text-3xl
          font-black
          uppercase
          text-black
        "
        >
          Empat
          <br />
          Kemungkinan
        </h4>
      </div>
    </section>
  );
}
