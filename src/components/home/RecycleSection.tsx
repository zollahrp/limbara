export default function RecycleSection() {
  return (
    <section className="relative h-screen snap-start bg-[#f8f6f2] overflow-hidden">
      <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
        <h2 className="text-[11vw] font-black uppercase text-green-700/20 leading-none mt-10">
          RECYCLE
        </h2>
      </div>

      <div className="relative z-10 h-full px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full items-center">
          <div>
            <div className="w-full max-w-[520px]">
              <div className="overflow-hidden border-2 border-black">
                <iframe
                  width="100%"
                  height="300"
                  src="https://www.youtube.com/embed/_G2IitNrgIw"
                  title="Plastic Recycling"
                  allowFullScreen
                />
              </div>
              <p className="mt-4 text-xl italic text-black">
                Lihat bagaimana botol plastik diproses menjadi produk bernilai tinggi.
              </p>
            </div>

            <div className="mt-20 max-w-[350px]">
              <div className="bg-green-700 text-white p-8 rotate-[-4deg]">
                <h4 className="font-black text-2xl uppercase mb-3">Kehidupan Kedua</h4>
                <p className="text-sm leading-7 text-white/90">
                  Botol plastik tidak harus berakhir sebagai limbah. Melalui proses daur ulang, materialnya dapat diubah menjadi berbagai produk baru yang memiliki nilai guna.
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-[520px] ml-auto">
            <p className="uppercase tracking-[0.3em] text-black/60 mb-4">Circular Economy</p>
            <h3 className="text-7xl font-black uppercase leading-none mb-8 text-black">
              Dari Sampah
              <br />
              Menjadi
              <br />
              Manfaat
            </h3>
            <p className="text-lg leading-9 text-black/80 mb-8">
              Botol plastik PET tidak harus berakhir di tempat pembuangan akhir. Melalui proses pengumpulan, pencucian, pencacahan, hingga peleburan ulang, material ini dapat kembali menjadi bahan baku berkualitas tinggi untuk berbagai industri.
            </p>
            <p className="text-lg leading-9 text-black/80">
              Setiap botol yang didaur ulang membantu mengurangi limbah plastik, menghemat energi produksi, serta mendukung ekonomi sirkular yang lebih berkelanjutan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}