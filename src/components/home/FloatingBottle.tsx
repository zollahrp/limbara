"use client";

import { motion, useTransform, useSpring, MotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  SCROLL_THRESHOLDS,
  SPRING_CONFIG_WITH_MASS,
} from "@/constants/HomeData";

interface FloatingBottleProps {
  scrollYProgress: MotionValue<number>;
  showBottle: boolean;
}

export default function FloatingBottle({
  scrollYProgress,
  showBottle,
}: FloatingBottleProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  const bottleRotate = useTransform(
    scrollYProgress,
    [0, 0.12, 0.24, 0.36, 0.48, 0.6, SCROLL_THRESHOLDS.BOTTLE_END],
    [18, 0, 0, 0, 0, 0, 0],
    { clamp: true },
  );

  const bottleX = useTransform(
    scrollYProgress,
    [0, 0.12, 0.24, 0.36, 0.48, 0.6, SCROLL_THRESHOLDS.BOTTLE_END],
    [0, 180, 0, 0, 0, 0, 0],
    { clamp: true },
  );

  const bottleY = useTransform(
    scrollYProgress,
    [0, 0.12, 0.24, 0.36, 0.48, 0.6, SCROLL_THRESHOLDS.BOTTLE_END],
    [0, 0, 0, 0, -30, -50, -50],
    { clamp: true },
  );

  const bottleScale = useTransform(
    scrollYProgress,
    [0, 0.1, 0.2, 0.34, 0.48, 0.6, SCROLL_THRESHOLDS.BOTTLE_END],
    [1, 0.85, 0.9, 0.85, 0.75, 0.45, 0.45],
    { clamp: true },
  );

  const smoothRotate = useSpring(bottleRotate, SPRING_CONFIG_WITH_MASS);
  const smoothX = useSpring(bottleX, SPRING_CONFIG_WITH_MASS);
  const smoothY = useSpring(bottleY, SPRING_CONFIG_WITH_MASS);
  const smoothScale = useSpring(bottleScale, SPRING_CONFIG_WITH_MASS);

  const mobileOpacity = useTransform(
    scrollYProgress,
    [
      0.0, 0.11,

      0.12, 0.35,

      0.36, 0.47,

      0.48, 1,
    ],
    [
      1, 1,

      0, 0,

      1, 1,

      0, 0,
    ],
  );

  const smoothOpacity = useSpring(mobileOpacity, SPRING_CONFIG_WITH_MASS);

  if (!showBottle) return null;

  return (
    <motion.div
      className="fixed inset-0 z-30 pointer-events-none flex items-center justify-center"
      style={{
        rotate: smoothRotate,
        scale: smoothScale,
        x: smoothX,
        y: smoothY,
        opacity: isMobile ? smoothOpacity : 1,
      }}
    >
      {/* Container Botol dengan penyesuaian responsif baru */}
      <div className="relative w-[120px] h-[260px] sm:w-[170px] sm:h-[360px] md:w-[220px] md:h-[480px] lg:w-[320px] lg:h-[700px] xl:w-[420px] xl:h-[900px]">
        <Image
          src="/img/botol_plastik.png"
          alt="Botol Plastik"
          fill
          priority
          className="object-contain select-none drop-shadow-[0_25px_40px_rgba(0,0,0,0.25)] lg:drop-shadow-[0_40px_60px_rgba(0,0,0,0.25)]"
        />
      </div>
    </motion.div>
  );
}
