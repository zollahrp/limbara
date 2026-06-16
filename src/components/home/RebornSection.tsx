"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { secondLifeProducts } from "@/constants/HomeData";
import { AnyCaaRecord } from "dns";

function ProductCard({ product }: { product: (typeof secondLifeProducts)[number] }) {
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
        <p className="text-[9px] tracking-[0.4em] text-black/60">{product.badge}</p>
        <h4 className="font-black uppercase text-black">{product.label}</h4>
      </div>
    </motion.div>
  );
}

export default function RebornSection() {
  return (
    <section className="relative h-screen snap-start bg-[#f5f2eb] overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h2 className="text-[15vw] font-black uppercase text-black/[0.035] tracking-widest">REBORN</h2>
      </div>

      <div className="absolute top-20 left-24 z-20">
        <p className="uppercase tracking-[0.5em] text-xs text-black/60 mb-4">Produk Daur Ulang</p>
        <h2 className="text-7xl font-black uppercase leading-[0.85] text-black">
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
        <p className="uppercase tracking-[0.5em] text-xs text-black/60">Satu Botol</p>
        <h3 className="text-3xl font-black uppercase text-black">
          Infinite
          <br />
          Possibilities
        </h3>
      </div>

      {secondLifeProducts.map((product : any) => (
        <ProductCard key={product.key} product={product} />
      ))}

      <div className="absolute right-24 top-1/2 -translate-y-1/2 text-right z-20">
        <p className="uppercase tracking-[0.4em] text-xs text-black/50">Satu Botol</p>
        <h4 className="text-3xl font-black uppercase text-black">
          Four
          <br />
          Possibilities
        </h4>
      </div>
    </section>
  );
}