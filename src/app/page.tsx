"use client";

import { useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";

import Footer from "@/components/Footer";
import FloatingBottle from "@/components/home/FloatingBottle";
import HeroSection from "@/components/home/HeroSection";
import MaterialSection from "@/components/home/MaterialSection";
import RecycleSection from "@/components/home/RecycleSection";
import RebornSection from "@/components/home/RebornSection";
import RecyclableSection from "@/components/home/RecyclableSection";
import AIFlowSection from "@/components/home/AIFlowSection";
import CTASection from "@/components/home/CTASection";

import { SCROLL_THRESHOLDS } from "@/constants/HomeData";
import ChatbotWidget from "@/components/ Chatbotwidget";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const [showBottle, setShowBottle] = useState(true);

  // Menyembunyikan botol animasi saat masuk ke bagian CTA
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setShowBottle(latest < SCROLL_THRESHOLDS.HIDE_BOTTLE);
  });

  return (
    <main
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory bg-white"
    >
      <FloatingBottle scrollYProgress={scrollYProgress} showBottle={showBottle} />
      
      <HeroSection />
      <MaterialSection />
      <RecycleSection />
      <RebornSection />
      <RecyclableSection />
      <AIFlowSection />
      <CTASection />
      <ChatbotWidget />
      
      <div className="snap-start">
        <Footer />
      </div>
    </main>
  );
}