import Image from "next/image";

export default function RecyclableSection() {
  return (
    <section className="relative h-screen snap-start bg-[#f7f4ee] overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h2 className="text-[12vw] font-black uppercase text-black/[0.04]">RECYCLABLE</h2>
      </div>

      <div className="absolute top-16 left-8 lg:left-24 z-20">
        <p className="uppercase tracking-[0.5em] text-xs text-black/60 mb-4">Beyond Plastic</p>
        <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black uppercase leading-[0.85] text-black">
          More Than
          <br />
          Bottles
        </h2>
      </div>

      <div className="absolute top-20 right-8 lg:right-24 max-w-[420px] z-20">
        <p className="text-black/80 leading-8">
          Botol plastik bukan satu-satunya limbah yang dapat didaur ulang. Berbagai material lain juga memiliki kesempatan untuk mendapatkan kehidupan kedua melalui proses pengolahan yang tepat.
        </p>
      </div>

      <div className="relative z-10 h-full flex items-center justify-center px-8 lg:px-20">
        <div className="grid grid-cols-5 items-end gap-8 lg:gap-16 w-full max-w-[1600px]">
          {["textile", "paper", "plastic", "glass", "e-waste"].map((item, index) => (
            <div key={item} className="text-center">
              {item === "plastic" ? (
                <div className="h-[280px] lg:h-[360px]" />
              ) : (
                <Image
                  src={`/img/${item}.png`}
                  alt={item}
                  width={420}
                  height={700}
                  className="object-contain mx-auto"
                />
              )}
              <p className="mt-6 text-xs tracking-[0.4em] uppercase text-black/50">Recyclable</p>
              <h3 className="text-2xl lg:text-3xl font-black uppercase mt-2 text-black">
                {item}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}