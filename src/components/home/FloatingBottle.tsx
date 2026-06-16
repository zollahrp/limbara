"use client";

import { motion, useTransform, useSpring, MotionValue } from "framer-motion";
import Image from "next/image";
import { SCROLL_THRESHOLDS, SPRING_CONFIG_WITH_MASS } from "@/constants/HomeData";

interface FloatingBottleProps {
  scrollYProgress: MotionValue<number>;
  showBottle: boolean;
}

export default function FloatingBottle({ scrollYProgress, showBottle }: FloatingBottleProps) {
  const bottleRotate = useTransform(
    scrollYProgress,
    [0, 0.12, 0.24, 0.36, 0.48, 0.6, SCROLL_THRESHOLDS.BOTTLE_END],
    [18, 0, 0, 0, 0, 0, 0],
    { clamp: true }
  );

  const bottleX = useTransform(
    scrollYProgress,
    [0, 0.12, 0.24, 0.36, 0.48, 0.6, SCROLL_THRESHOLDS.BOTTLE_END],
    [0, 180, 0, 0, 0, 0, 0],
    { clamp: true }
  );

  const bottleY = useTransform(
    scrollYProgress,
    [0, 0.12, 0.24, 0.36, 0.48, 0.6, SCROLL_THRESHOLDS.BOTTLE_END],
    [0, 0, 0, 0, -30, -50, -50],
    { clamp: true }
  );

  const bottleScale = useTransform(
    scrollYProgress,
    [0, 0.1, 0.2, 0.34, 0.48, 0.6, SCROLL_THRESHOLDS.BOTTLE_END],
    [1, 0.85, 0.9, 0.85, 0.75, 0.45, 0.45],
    { clamp: true }
  );

  const smoothRotate = useSpring(bottleRotate, SPRING_CONFIG_WITH_MASS);
  const smoothX = useSpring(bottleX, SPRING_CONFIG_WITH_MASS);
  const smoothY = useSpring(bottleY, SPRING_CONFIG_WITH_MASS);
  const smoothScale = useSpring(bottleScale, SPRING_CONFIG_WITH_MASS);

  if (!showBottle) return null;

  return (
    <motion.div
      className="fixed inset-0 z-30 pointer-events-none flex items-center justify-center"
      style={{
        rotate: smoothRotate,
        scale: smoothScale,
        x: smoothX,
        y: smoothY,
      }}
    >
      <div className="relative w-[220px] h-[480px] sm:w-[280px] sm:h-[600px] lg:w-[420px] lg:h-[900px]">
        <Image
          src="/img/botol_plastik.png"
          alt="Botol Plastik"
          fill
          priority
          sizes="(max-width: 640px) 220px, (max-width: 1024px) 280px, 420px"
          className="object-contain select-none drop-shadow-[0_40px_60px_rgba(0,0,0,0.25)]"
        />
      </div>
    </motion.div>
  );
}