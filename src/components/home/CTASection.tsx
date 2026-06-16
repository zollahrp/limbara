"use client";

import Link from "next/link";

export default function CTASection() {
  return (
    <section className="relative min-h-screen snap-start bg-[#faf9f6] overflow-hidden flex items-center justify-center px-5 md:px-8 py-20">
      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <h2 className="text-[18vw] md:text-[14vw] lg:text-[13vw] font-black uppercase text-black/[0.03] whitespace-nowrap">
          BEGIN
        </h2>
      </div>

      <div className="relative z-10 max-w-5xl w-full">
        {/* Top Label */}
        <div className="flex items-center gap-4 justify-center mb-8">
          <div className="w-10 h-px bg-black/20" />

          <p className="uppercase tracking-[0.4em] text-[11px] text-black/50 text-center">
            AI Waste Recognition
          </p>

          <div className="w-10 h-px bg-black/20" />
        </div>

        {/* Main Heading */}
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.9] tracking-[-0.04em] text-black">
            Sampahmu
            <br />
            Belum Berakhir.
          </h2>

          <p className="mt-8 max-w-2xl mx-auto text-black/70 text-base md:text-lg leading-8 md:leading-9">
            Ambil gambar dan biarkan Limbara membantu mengenali kategori
            sampah serta memberikan rekomendasi pengelolaan yang lebih
            bijak dan bernilai melalui ekonomi sirkular.
          </p>
        </div>

        {/* CTA Cards */}
        <div className="mt-14 md:mt-20 grid md:grid-cols-2 gap-5 md:gap-6">
          <Link
            href="/scan"
            className="group bg-white border border-black/10 rounded-3xl px-8 py-7 transition-all duration-500 hover:border-black/30 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-black/50 mb-3">
                  AI Detection
                </p>

                <h3 className="text-xl md:text-2xl font-black uppercase text-black">
                  Mulai Pindai
                </h3>
              </div>

              <div className="text-2xl group-hover:translate-x-2 transition-all duration-300 text-black">
                →
              </div>
            </div>
          </Link>

          <Link
            href="/bank-sampah"
            className="group bg-white border border-black/10 rounded-3xl px-8 py-7 transition-all duration-500 hover:border-black/30 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-black/50 mb-3">
                  Circular Economy
                </p>

                <h3 className="text-xl md:text-2xl font-black uppercase text-black">
                  Bank Sampah
                </h3>
              </div>

              <div className="text-2xl group-hover:translate-x-2 transition-all duration-300 text-black">
                ↗
              </div>
            </div>
          </Link>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-black/15 to-transparent mt-20 mb-12" />

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 md:gap-8">
          <div className="text-center bg-white/60 border border-black/5 rounded-3xl px-4 py-6 backdrop-blur-sm">
            <h3 className="text-3xl md:text-4xl font-black text-black">
              8
            </h3>

            <p className="text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-black/50 mt-2">
              Kategori
            </p>
          </div>

          <div className="text-center bg-white/60 border border-black/5 rounded-3xl px-4 py-6 backdrop-blur-sm">
            <h3 className="text-3xl md:text-4xl font-black text-black">
              98%
            </h3>

            <p className="text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-black/50 mt-2">
              Akurasi
            </p>
          </div>

          <div className="text-center bg-white/60 border border-black/5 rounded-3xl px-4 py-6 backdrop-blur-sm">
            <h3 className="text-3xl md:text-4xl font-black text-black">
              ∞
            </h3>

            <p className="text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-black/50 mt-2">
              Potensi
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}