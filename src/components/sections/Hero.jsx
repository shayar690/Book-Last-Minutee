import React from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import SearchWidget from "@/components/search/SearchWidget";

// Single fixed background — Dubai skyline.
// Responsive srcset: lighter, lower-resolution image on mobile; full
// resolution on desktop. The browser picks the best size for the viewport
// and device pixel ratio, so mobile loads fast and still looks crisp.
const HERO_BASE = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c";
const HERO_SRCSET = `${HERO_BASE}?w=640&q=70 640w, ${HERO_BASE}?w=960&q=72 960w, ${HERO_BASE}?w=1280&q=75 1280w, ${HERO_BASE}?w=1920&q=80 1920w`;
const HERO_IMAGE = `${HERO_BASE}?w=1600&q=80`;

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-end">
      {/* background — fixed Dubai skyline */}
      <div className="absolute inset-0 overflow-hidden">
        <img src={HERO_IMAGE} srcSet={HERO_SRCSET} sizes="100vw" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/10 to-ink/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-ether/40 to-transparent" />
      </div>

      {/* headline */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-10 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="flex flex-col items-start gap-2 max-w-4xl"
        >
          <h1 className="text-[#2D3035] font-display font-bold leading-[1.1] whitespace-nowrap text-xl sm:text-5xl lg:text-6xl">
            {t("hero.title1")} {t("hero.title2")}
          </h1>
          <div className="flex flex-col items-start">
            <p className="text-[#2D3035] text-base sm:text-lg font-bold">{t("hero.line1")}</p>
            <p className="text-[#2D3035] text-base sm:text-lg font-bold">{t("hero.line2")}</p>
          </div>
          <div className="bg-[#F5D166] rounded-lg px-4 py-2 text-[#2D3035] text-2xl sm:text-3xl font-extrabold flex flex-col items-start">
            <span>{t("hero.line3a")}</span>
            <span>{t("hero.line3b")}</span>
          </div>
        </motion.div>
      </div>

      {/* floating command center */}
      <div className="relative z-10 max-w-[100rem] mx-auto w-full px-4 lg:px-6 pb-12 pt-8">
        <SearchWidget />
      </div>
    </section>
  );
}