"use client";

import { motion } from "framer-motion";
import { heroStats, detailFacts } from "@/constants/HomeData";

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center sm:text-left">
      <p className="text-xs uppercase tracking-widest text-black/50">{label}</p>

      <p className="text-2xl lg:text-3xl font-black text-black">{value}</p>
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
    <div className="border-t border-black/10 pt-5">
      <p className="text-xs uppercase tracking-widest text-black/50">{label}</p>

      <div className="text-4xl lg:text-5xl font-black text-black">{value}</div>

      <p className="text-black/70 mt-2 text-sm lg:text-base leading-7">
        {description}
      </p>
    </div>
  );
}

export default function MaterialSection() {
  return (
    <section
      className="
      relative
      min-h-screen
      snap-start
      bg-[#faf9f6]
      px-6
      sm:px-10
      lg:px-20
      py-20
      overflow-hidden
    "
    >
      {/* WATERMARK */}
      <div className="absolute right-5 top-5 text-[22vw] lg:text-[18vw] font-black text-black/[0.03] pointer-events-none">
        PET
      </div>

      {/* CIRCLE */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] lg:w-[620px] lg:h-[620px] rounded-full border border-black/10" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[220px] h-[220px] sm:w-[320px] sm:h-[320px] lg:w-[480px] lg:h-[480px] rounded-full border border-dashed border-black/10" />
      </div>

      {/* DESKTOP ONLY DECORATION */}
      <div className="hidden lg:block absolute left-[40%] top-[35%]">
        <div className="w-[180px] h-px bg-black/20" />
        <div className="-translate-y-1/2 text-[10px] uppercase tracking-[0.4em] text-black/50">
          Lightweight Material
        </div>
      </div>

      <div className="hidden lg:block absolute left-[56%] bottom-[35%]">
        <div className="w-[160px] h-px bg-black/20" />
        <div className="mt-4 text-[10px] uppercase tracking-[0.4em] text-black/50">
          Ready To Recycle
        </div>
      </div>

      <div className="hidden lg:block absolute left-1/2 bottom-[18%] -translate-x-1/2 text-center">
        <p className="text-[10px] uppercase tracking-[0.5em] text-black/50">
          Material Type
        </p>

        <h4 className="text-4xl font-black text-black">PET</h4>
      </div>

      {/* CONTENT */}
      <div
        className="
  relative
  z-10
  min-h-screen

  flex
  items-center

  pt-36
  pb-20

  lg:pt-0
"
      >
        <div
          className="
    w-full

    flex
    flex-col
    lg:flex-row

    items-center
    justify-between

    gap-16
    lg:gap-20
  "
        >
          {/* LEFT */}
          <div className="w-full max-w-[560px]">
            <p className="uppercase tracking-[0.5em] text-xs text-black/60 mb-5 text-center lg:text-left">
              Material Exploration
            </p>

            <h2
              className="
            text-5xl
            sm:text-7xl
            lg:text-[100px]
            font-black
            uppercase
            leading-[0.9]
            text-black
            text-center
            lg:text-left
          "
            >
              <span className="lg:block">Bottle</span>
              <span className="lg:block">Plastic</span>

              {/* HP */}
              <span className="lg:hidden">Bottle Plastic</span>
            </h2>

            <div
              className="
            mt-8
            flex
            flex-col
            lg:flex-row
            items-center
            lg:items-start
            gap-5
          "
            >
              <div className="w-16 h-px bg-black" />

              <p
                className="
              text-black/80
              leading-7
              max-w-[430px]
              text-center
              lg:text-left
            "
              >
                Botol plastik PET hadir sebagai material ringan, kuat, dan
                fleksibel yang dapat kembali menjadi berbagai produk bernilai
                melalui proses daur ulang.
              </p>
            </div>

            {/* STATS */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              {heroStats.map((stat: { label: string; value: string }) => (
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
            px-8
            py-4
            uppercase
            tracking-widest
            text-sm
            font-bold
            hover:translate-x-2
            transition
            mx-auto
            lg:mx-0
            block
          "
            >
              Explore
            </button>
          </div>

          {/* RIGHT CARD */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8 }}
            className="
          w-full
          max-w-[430px]
          bg-white
          border
          border-black/20
          p-6
          lg:p-8
          shadow-[25px_25px_0px_rgba(0,0,0,0.05)]
        "
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-black/50">
                  Plastic Intelligence
                </p>

                <h3 className="text-3xl font-black uppercase text-black">
                  PET
                  <br />
                  Material
                </h3>
              </div>

              <div className="border border-black rounded-full w-14 h-14 flex items-center justify-center text-xl text-black">
                ♻
              </div>
            </div>

            <div className="space-y-7">
              {detailFacts.map(
                (fact: {
                  label: string;
                  value: string;
                  description: string;
                }) => (
                  <DetailFact
                    key={fact.label}
                    label={fact.label}
                    value={fact.value}
                    description={fact.description}
                  />
                ),
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
