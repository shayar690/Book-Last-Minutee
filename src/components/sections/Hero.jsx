import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import SearchWidget from "@/components/search/SearchWidget";

// Beautiful travel imagery from around the world — crossfades every few seconds.
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&q=80", // Eiffel Tower, Paris
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80", // Dubai skyline
  "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1600&q=80", // London, Tower Bridge
  "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1600&q=80", // Maldives overwater villas
  "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1600&q=80", // Santorini, Greece
  "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=80", // Tropical beach
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1600&q=80", // Resort pool
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600&q=80", // Luxury hotel
];

export default function Hero() {
  const { t } = useI18n();
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setImgIdx((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-end">
      {/* background — crossfading travel images */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.img
            key={imgIdx}
            src={HERO_IMAGES[imgIdx]}
            alt=""
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.6, ease: "easeInOut" }, scale: { duration: 8, ease: "linear" } }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/10 to-ink/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-ether/40 to-transparent" />
      </div>

      {/* headline */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-10 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-dark text-white/90 text-xs tracking-luxe uppercase">
            {t("brand.slogan")}
          </div>
          <h1 className="mt-5 text-white font-display text-5xl sm:text-6xl lg:text-7xl font-light leading-[1.05]">
            {t("hero.title")}
          </h1>
          <p className="mt-5 text-white/85 text-lg max-w-xl font-light">{t("hero.subtitle")}</p>
        </motion.div>
      </div>

      {/* floating command center */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-10 pb-12 pt-8">
        <SearchWidget />
      </div>
    </section>
  );
}