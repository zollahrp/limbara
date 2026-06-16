"use client";

import { motion } from "framer-motion";
import { heroStats, detailFacts } from "@/constants/HomeData";

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-black/50">{label}</p>
      <p className="text-3xl font-black text-black">{value}</p>
    </div>
  );
}

function DetailFact({ label, value, description }: { label: string; value: string; description: string }) {
  return (
    <div className="border-t border-black/10 pt-5">
      <p className="text-xs uppercase tracking-widest text-black/50">{label}</p>
      <div className="text-5xl font-black text-black">{value}</div>
      <p className="text-black/70 mt-2">{description}</p>
    </div>
  );
}

export default function MaterialSection() {
  return (
    <section className="relative h-screen snap-start bg-[#faf9f6] px-5 sm:px-10 lg:px-20 flex items-center overflow-hidden">
      <div className="absolute right-10 top-10 text-[18vw] font-black text-black/[0.03] leading-none pointer-events-none">
        PET
      </div>

      <div className="absolute left-[52%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full border border-black/10" />
      <div className="absolute left-[52%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full border border-dashed border-black/10" />

      <div className="absolute left-[40%] top-[35%] w-[180px] h-px bg-black/20" />
      <div className="absolute left-[40%] top-[35%] -translate-y-1/2 text-[10px] uppercase tracking-[0.4em] text-black/50">
        Lightweight Material
      </div>

      <div className="absolute left-[56%] bottom-[35%] w-[160px] h-px bg-black/20" />
      <div className="absolute left-[56%] bottom-[32%] text-[10px] uppercase tracking-[0.4em] text-black/50">
        Ready To Recycle
      </div>

      <div className="absolute left-[52%] bottom-[18%] -translate-x-1/2 text-center">
        <p className="text-[10px] uppercase tracking-[0.5em] text-black/50">Material Type</p>
        <h4 className="text-4xl font-black text-black">PET</h4>
      </div>

      <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-16">
        <div className="max-w-[560px] w-full">
          <p className="uppercase tracking-[0.5em] text-xs text-black/60 mb-6">Material Exploration</p>
          <h2 className="text-[48px] sm:text-[70px] lg:text-[100px] font-black uppercase leading-[0.85] tracking-tight text-black">
            Bottle
            <br />
            Plastic
          </h2>

          <div className="mt-8 flex items-center gap-6">
            <div className="w-16 h-px bg-black" />
            <p className="text-black/80 leading-8 w-full max-w-[430px]">
              Botol plastik PET hadir sebagai material ringan, kuat, dan fleksibel yang dapat kembali menjadi berbagai produk bernilai melalui proses daur ulang.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap gap-6 lg:gap-12">
            {heroStats.map((stat: { label: string; value: string }) => (
              <StatItem key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>

          <button className="mt-12 bg-black text-white px-10 py-4 uppercase tracking-widest text-sm font-bold hover:translate-x-2 transition">
            Explore
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-[430px] bg-white border border-black/20 p-8 shadow-[25px_25px_0px_rgba(0,0,0,0.05)]"
        >
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-black/50">Plastic Intelligence</p>
              <h3 className="text-3xl font-black uppercase text-black">
                PET
                <br />
                Material
              </h3>
            </div>
            <div className="border border-black rounded-full w-14 h-14 flex items-center justify-center text-xl text-black">♻</div>
          </div>

          <div className="space-y-7">
            {detailFacts.map((fact: { label: string; value: string; description: string }) => (
              <DetailFact key={fact.label} label={fact.label} value={fact.value} description={fact.description} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}