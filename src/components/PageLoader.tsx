"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="
            fixed
            inset-0
            z-[99999]
            flex
            items-center
            justify-center
            bg-[#faf9f6]
          "
        >
          <div className="w-[500px] h-[500px]">
            <DotLottieReact
              src="https://lottie.host/7e5a9688-2cba-4fb3-997c-879f56ab3d44/Oib7vg8KuP.lottie"
              loop
              autoplay
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
