import Link from "next/link";

export default function CTASection() {
  return (
    <section className="relative min-h-screen snap-start bg-[#faf9f6] overflow-hidden flex items-center justify-center px-8">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h2 className="text-[13vw] font-black uppercase text-black/[0.03]">BEGIN</h2>
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        <div className="flex items-center gap-4 justify-center mb-8">
          <div className="w-10 h-px bg-black/20" />
          <p className="uppercase tracking-[0.4em] text-[11px] text-black/50">AI Waste Recognition</p>
          <div className="w-10 h-px bg-black/20" />
        </div>

        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase leading-[0.95] text-black">
            Sampahmu
            <br />
            Belum Berakhir.
          </h2>
          <p className="mt-8 max-w-2xl mx-auto text-black/70 leading-8">
            Ambil gambar dan biarkan AI membantu mengenali kategori sampah serta memberikan rekomendasi pengelolaan yang lebih bijak dan bernilai melalui ekonomi sirkular.
          </p>
        </div>

        <div className="mt-20 grid md:grid-cols-2 gap-6">
          <Link href="/scan" className="group bg-white border border-black/10 px-8 py-6 transition-all duration-300 hover:border-black hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-black/50 mb-3">AI Detection</p>
                <h3 className="text-xl font-black uppercase text-black">Mulai Pindai</h3>
              </div>
              <div className="text-2xl group-hover:translate-x-2 transition text-black">→</div>
            </div>
          </Link>

          <Link href="/bank-sampah" className="group bg-white border border-black/10 px-8 py-6 transition-all duration-300 hover:border-black hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-black/50 mb-3">Circular Economy</p>
                <h3 className="text-xl font-black uppercase text-black">Bank Sampah</h3>
              </div>
              <div className="text-2xl group-hover:translate-x-2 transition text-black">↗</div>
            </div>
          </Link>
        </div>

        <div className="w-full h-px bg-black/10 mt-20 mb-12" />

        <div className="flex justify-center gap-16">
          <div className="text-center">
            <h3 className="text-3xl font-black text-black">8</h3>
            <p className="text-[11px] uppercase tracking-[0.35em] text-black/50 mt-2">Kategori</p>
          </div>
          <div className="text-center">
            <h3 className="text-3xl font-black text-black">98%</h3>
            <p className="text-[11px] uppercase tracking-[0.35em] text-black/50 mt-2">Akurasi</p>
          </div>
          <div className="text-center">
            <h3 className="text-3xl font-black text-black">∞</h3>
            <p className="text-[11px] uppercase tracking-[0.35em] text-black/50 mt-2">Potensi</p>
          </div>
        </div>
      </div>
    </section>
  );
}