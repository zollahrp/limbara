import Navbar from "@/components/Navbar";

export default function HeroSection() {
  return (
    <section className="relative h-screen snap-start overflow-hidden bg-white">
      <Navbar />

      <div className="absolute left-0 top-0 h-full w-24 flex flex-col items-center py-8 z-20">
        <div className="w-px flex-1 bg-black/20" />
        <button className="text-2xl mb-10 text-black">⌕</button>
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
        <p className="italic text-2xl mb-2 text-black">Unlimited Recycle</p>
        <h3 className="text-4xl sm:text-5xl lg:text-7xl font-black uppercase leading-none text-black">
          Botol
          <br />
          Plastik
        </h3>
      </div>
    </section>
  );
}