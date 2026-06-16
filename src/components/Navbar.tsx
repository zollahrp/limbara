"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const container = document.querySelector("main");

    if (!container) return;

    const handleScroll = () => {
      setIsScrolled(container.scrollTop > 80);
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const menus = [
    {
      name: "Beranda",
      href: "/",
    },
    {
      name: "Scan",
      href: "/scan",
    },
    {
      name: "Bank Sampah",
      href: "/bank-sampah",
    },
  ];

  return (
    <motion.nav
      initial={{
        y: -100,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.8,
      }}
      className={`
      fixed
      top-0
      left-0
      w-full
      z-50
      transition-all
      duration-500
      ${isScrolled ? "px-6 lg:px-20 pt-5" : "px-8 lg:px-20 pt-8"}
      `}
    >
      <div
        className={`
      mx-auto
      flex
      items-center
      justify-between

      transition-all
      duration-500

      ${
        isScrolled
          ? "max-w-6xl bg-white/80 backdrop-blur-xl border border-black/10 shadow-xl px-8 py-3 rounded-full"
          : "max-w-full"
      }

      `}
      >
        {/* LOGO */}

        <Link href="/" className="relative">
          <Image
            src="/img/logo/limbara.png"
            alt="Limbara"
            width={300}
            height={100}
            priority
            className="
          object-contain
          w-auto
          h-8
          lg:h-10
          "
          />
        </Link>

        {/* MENU */}

        <div
          className="
        hidden
        md:flex
        items-center
        gap-12
        "
        >
          {menus.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="
            group
            relative
            text-[11px]
            uppercase
            tracking-[0.35em]
            font-bold
            text-gray-800
            "
            >
              {item.name}

              <span
                className="
            absolute
            left-0
            -bottom-2
            h-[2px]
            w-0
            bg-green-700
            transition-all
            duration-300
            group-hover:w-full
            "
              />
            </Link>
          ))}
        </div>

        {/* LOGIN */}

        <div className="flex items-center gap-5">
          <button
            className="
        hidden
        sm:block
        relative
        overflow-hidden
        bg-green-800
        text-white
        px-8
        py-3
        rounded-full
        text-[11px]
        font-bold
        uppercase
        tracking-[0.3em]

        hover:bg-green-700
        transition

        "
          >
            Login
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="
        md:hidden
        text-2xl
        "
          >
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE */}

      {menuOpen && (
        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
        mt-4
        bg-white
        rounded-3xl
        shadow-xl
        border
        p-8
        flex
        flex-col
        items-center
        gap-6
        md:hidden
        "
        >
          {menus.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="
            uppercase
            tracking-[0.3em]
            text-xs
            font-bold
            "
            >
              {item.name}
            </Link>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
}
