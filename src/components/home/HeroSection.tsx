import Navbar from "@/components/Navbar";

export default function HeroSection() {
  return (
    <section className="relative h-screen snap-start overflow-hidden bg-white">
      <Navbar />

      {/* LEFT BAR */}
      <div className="hidden lg:flex absolute left-0 top-0 h-full w-24 flex-col items-center py-8 z-20">
        <div className="w-px flex-1 bg-black/10" />
        <div className="rotate-[-90deg] whitespace-nowrap text-[11px] tracking-[0.4em] uppercase text-black/40">
          Circular Material
        </div>
        <div className="w-px flex-1 bg-black/10" />
      </div>

      {/* WATERMARK */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h2 className="text-[22vw] md:text-[16vw] lg:text-[13vw] leading-[0.85] font-black uppercase text-green-700/15 text-center">
          BOTOL
          <br />
          PLASTIK
        </h2>
      </div>

      {/* CIRCLE */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[750px] lg:h-[750px] rounded-full border border-black/5" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[220px] h-[220px] md:w-[380px] md:h-[380px] lg:w-[550px] lg:h-[550px] rounded-full border border-dashed border-black/10" />
      </div>

      {/* SECTION NUMBER */}
      <div className="hidden xl:block absolute top-32 right-20">
        <p className="text-[120px] font-black text-black/[0.04]">01</p>
      </div>

      {/* STATS */}
      <div className="absolute top-[120px] left-1/2 -translate-x-1/2 flex gap-10 z-20 lg:left-32 lg:translate-x-0 lg:top-32 lg:gap-16">
        <div className="text-center lg:text-left">
          <p className="text-[10px] uppercase tracking-[0.4em] text-black/40">
            Weight
          </p>
          <h3 className="text-xl lg:text-3xl font-black text-black">25g</h3>
        </div>

        <div className="text-center lg:text-left">
          <p className="text-[10px] uppercase tracking-[0.4em] text-black/40">
            Category
          </p>
          <h3 className="text-xl lg:text-3xl font-black text-black">PET</h3>
        </div>
      </div>

      {/* TOP RIGHT INFO */}
      <div className="absolute top-[190px] left-1/2 -translate-x-1/2 text-center max-w-[220px] z-20 lg:right-24 lg:left-auto lg:max-w-[260px] lg:translate-x-0 lg:top-36 lg:text-left">
        <p className="uppercase tracking-[0.3em] text-[10px] text-black/40 mb-3 whitespace-nowrap">
          Material Exploration
        </p>
        <p className="leading-5 text-xs sm:text-sm text-black/60">
          Material PET ringan untuk berbagai produk daur ulang.
        </p>
      </div>

      {/* CTA */}
      <a
        href="/scan"
        className="group absolute left-1/2 -translate-x-1/2 bottom-[210px] lg:left-auto lg:right-24 lg:translate-x-0 lg:bottom-28 flex items-center gap-3 bg-[#446C66] text-white px-6 py-3 rounded-full shadow-[18px_18px_0px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2 z-20"
      >
        <span className="text-base lg:text-xl font-black uppercase whitespace-nowrap">
          Coba Pindai
        </span>
        <span className="text-xl group-hover:translate-x-2 transition">
          →
        </span>
      </a>

      {/* BOTTOM TITLE */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-center lg:left-32 lg:translate-x-0 lg:bottom-20 lg:text-left">
        <div className="space-y-1">
          <p className="italic text-black/50 text-sm">Unlimited Recycle</p>
          {/* HP */}
          <h3 className="text-3xl font-black text-black uppercase leading-[0.85] lg:hidden">
            Botol Plastik
          </h3>
          {/* Desktop */}
          <h3 className="hidden lg:block text-black text-8xl font-black uppercase leading-[0.85]">
            Botol
            <br />
            Plastik
          </h3>
        </div>

        <div className="flex flex-col items-center gap-3 mt-4 lg:flex-row lg:items-start lg:gap-4 lg:mt-8">
          <div className="w-12 lg:w-16 h-px bg-black" />
          <p className="max-w-[240px] text-xs sm:text-sm leading-5 text-black/50">
            Material PET untuk ekonomi sirkular dan penggunaan kembali.
          </p>
        </div>
      </div>
    </section>
  );
}