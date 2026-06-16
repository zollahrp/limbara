export default function RecycleSection() {
  return (
    <section className="relative min-h-screen snap-start bg-[#f8f6f2] overflow-hidden py-24">
      {/* WATERMARK */}
      <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
        <h2 className="text-[18vw] sm:text-[14vw] lg:text-[11vw] font-black uppercase text-green-700/20 leading-none mt-10">
          RECYCLE
        </h2>
      </div>

      <div className="relative z-10 px-6 sm:px-10 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* KIRI */}
          <div className="flex flex-col items-center lg:items-start">
            {/* VIDEO */}
            <div className="w-full max-w-[520px]">
              <div className="overflow-hidden border-2 border-black aspect-video">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/_G2IitNrgIw"
                  title="Daur Ulang Plastik"
                  allowFullScreen
                />
              </div>

              <p className="mt-4 text-base sm:text-lg lg:text-xl italic text-black text-center lg:text-left">
                Lihat bagaimana botol plastik diolah menjadi produk bernilai.
              </p>
            </div>

            {/* BOX HIJAU */}
            <div className="mt-10 lg:mt-20 max-w-[350px]">
              <div className="bg-green-700 text-white p-6 lg:p-8 rotate-[-3deg]">
                <h4 className="font-black text-xl lg:text-2xl uppercase mb-3">
                  Kehidupan Kedua
                </h4>

                <p className="text-sm leading-7 text-white/90">
                  Botol plastik dapat diolah kembali menjadi berbagai produk
                  baru yang memiliki nilai guna dan manfaat.
                </p>
              </div>
            </div>
          </div>

          {/* KANAN */}
          <div className="max-w-[620px] mx-auto lg:ml-auto">
            <p className="uppercase tracking-[0.3em] text-black/60 mb-4 text-center lg:text-left">
              Ekonomi Sirkular
            </p>

            <h3
              className="
                text-4xl
                sm:text-6xl
                lg:text-7xl
                font-black
                uppercase
                leading-[0.9]
                mb-8
                text-black
                text-center
                lg:text-left
              "
            >
              Dari Sampah
              <br />
              Menjadi
              <br />
              Manfaat
            </h3>

            <p className="text-base lg:text-lg leading-8 lg:leading-9 text-black/80 mb-8 text-center lg:text-left">
              Botol plastik PET dapat kembali menjadi bahan baku berkualitas
              melalui proses pengumpulan, pencucian, pencacahan, dan peleburan
              ulang.
            </p>

            <p className="text-base lg:text-lg leading-8 lg:leading-9 text-black/80 text-center lg:text-left">
              Setiap botol yang didaur ulang membantu mengurangi limbah plastik,
              menghemat energi, serta mendukung ekonomi sirkular yang lebih
              berkelanjutan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}