export const SPRING_CONFIG = { stiffness: 60, damping: 20 };
export const SPRING_CONFIG_WITH_MASS = { ...SPRING_CONFIG, mass: 0.8 };

export const SCROLL_THRESHOLDS = {
  HIDE_BOTTLE: 0.63,
  BOTTLE_END: 0.714,
} as const;

export const heroStats = [
  { label: "Category", value: "PET" },
  { label: "Recycle", value: "♻ 100%" },
  { label: "Weight", value: "25g" },
];

export const detailFacts = [
  {
    label: "Decomposition Time",
    value: "450+",
    description: "Tahun untuk terurai secara alami jika tidak dikelola.",
  },
  {
    label: "New Possibility",
    value: "1 → ∞",
    description: "Satu botol dapat berubah menjadi banyak produk baru.",
  },
  {
    label: "Everyday Impact",
    value: "1 Botol",
    description: "Perubahan kecil yang membantu menjaga lingkungan.",
  },
];

export const secondLifeProducts = [
  {
    key: "lampu",
    src: "/img/botol_plastik_lampu_kamar.png",
    alt: "Lampu Hias",
    label: "Lampu Hias",
    badge: "RECYCLED",
    position: "absolute top-[200px] left-4 sm:left-12 lg:left-[220px] w-[140px] sm:w-[220px] lg:w-[380px] z-10",
    animate: { y: [0, -25, 0], rotate: [-5, -2, -5] },
    transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
  },
  {
    key: "pot",
    src: "/img/botol_plastik_pot_bunga.png",
    alt: "Pot",
    label: "Pot Bunga",
    badge: "REBORN MATERIAL",
    position: "absolute bottom-[120px] left-10 sm:left-24 lg:left-[330px] w-[130px] sm:w-[200px] lg:w-[330px] z-10",
    animate: { y: [0, 25, 0], rotate: [5, 8, 5] },
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 },
  },
  {
    key: "anjing",
    src: "/img/botol_plastik_anjing.png",
    alt: "Anjing",
    label: "Anjing Lucu",
    badge: "CREATIVE REUSE",
    position: "absolute top-[200px] right-4 sm:right-12 lg:right-[220px] w-[140px] sm:w-[220px] lg:w-[360px] z-10",
    animate: { y: [0, -30, 0], rotate: [5, 2, 5] },
    transition: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.8 },
  },
  {
    key: "kuda",
    src: "/img/botol_plastik_kuda.png",
    alt: "Kuda",
    label: "Kuda Keren",
    badge: "UPCYCLING",
    position: "absolute bottom-[110px] right-8 sm:right-16 lg:right-[300px] w-[140px] sm:w-[220px] lg:w-[360px] z-10",
    animate: { y: [0, 20, 0], rotate: [-5, -8, -5] },
    transition: { duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
  },
];