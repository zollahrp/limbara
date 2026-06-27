import Image from "next/image";
import { motion } from "framer-motion";

export default function RecyclableSection() {
  const getAnimation = (item: string) => {
    if (item === "textile" || item === "paper") {
      return {
        initial: { opacity: 0, x: -150 },
        whileInView: { opacity: 1, x: 0 },
      };
    }

    if (item === "glass" || item === "e-waste") {
      return {
        initial: { opacity: 0, x: 150 },
        whileInView: { opacity: 1, x: 0 },
      };
    }

    return {
      initial: { opacity: 1, x: 0 },
      whileInView: { opacity: 1, x: 0 },
    };
  };

  return (
    <section
      className="
        relative
        min-h-screen
        snap-start
        bg-[#f7f4ee]
        overflow-hidden
        pt-32
        pb-20
        px-6
        lg:px-20
      "
    >
      {/* WATERMARK */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h2 className="text-[20vw] lg:text-[12vw] font-black uppercase text-black/[0.04]">
          DAUR ULANG
        </h2>
      </div>

      {/* HEADER */}
      <div
        className="
          relative
          z-20
          flex
          flex-col
          lg:flex-row
          justify-between
          gap-10
          mb-20
        "
      >
        <div>
          <p className="uppercase tracking-[0.5em] text-xs text-black/60 mb-4">
            Selain Plastik
          </p>

          <h2 className="text-5xl lg:text-7xl font-black uppercase leading-[0.85] text-black">
            Lebih Dari
            <br />
            Botol
          </h2>
        </div>

        <div className="max-w-[420px]">
          <p className="text-black/80 leading-8">
            Botol plastik bukan satu-satunya material yang dapat didaur ulang.
            Berbagai jenis limbah lain juga memiliki kesempatan untuk
            mendapatkan kehidupan kedua melalui proses pengolahan yang tepat.
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex justify-center">
        <div
          className="
            grid
            grid-cols-2
            lg:grid-cols-5
            items-end
            gap-10
            lg:gap-16
            w-full
            max-w-[1600px]
          "
        >
          {["textile", "paper", "plastic", "glass", "e-waste"].map(
            (item, index) => {
              const animation = getAnimation(item);

              return (
                <motion.div
                  key={item}
                  className="text-center"
                  initial={animation.initial}
                  whileInView={animation.whileInView}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                >
                  {item === "plastic" ? (
                    <>
                      {/* Mobile */}
                      <div className="lg:hidden">
                        <Image
                          src="/img/botol_plastik.png"
                          alt="Botol Plastik"
                          width={220}
                          height={220}
                          className="
                            object-contain
                            mx-auto
                            w-[55px]
                            sm:w-[70px]
                            md:w-[85px]
                            drop-shadow-lg
                          "
                        />
                      </div>

                      {/* Desktop */}
                      <div className="hidden lg:block h-[360px]" />

                      <p className="mt-3 lg:mt-6 text-[10px] lg:text-xs tracking-[0.4em] uppercase text-black/50">
                        Material Utama
                      </p>

                      <h3 className="text-xl lg:text-3xl font-black uppercase mt-2 text-black">
                        Plastik
                      </h3>
                    </>
                  ) : (
                    <>
                      <Image
                        src={`/img/${item}.png`}
                        alt={item}
                        width={420}
                        height={700}
                        className="
                          object-contain
                          mx-auto
                          w-[120px]
                          sm:w-[160px]
                          lg:w-full
                        "
                      />

                      <p className="mt-4 lg:mt-6 text-[10px] lg:text-xs tracking-[0.4em] uppercase text-black/50">
                        Dapat Didaur Ulang
                      </p>

                      <h3 className="text-xl lg:text-3xl font-black uppercase mt-2 text-black">
                        {item === "textile"
                          ? "Tekstil"
                          : item === "paper"
                          ? "Kertas"
                          : item === "glass"
                          ? "Kaca"
                          : "E-Waste"}
                      </h3>
                    </>
                  )}
                </motion.div>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}