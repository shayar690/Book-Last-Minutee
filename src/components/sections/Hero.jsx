import React from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import SearchWidget from "@/components/search/SearchWidget";

// Single fixed background — Dubai skyline.
const HERO_IMAGE = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80";

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-end">
      {/* background — fixed Dubai skyline */}
      <div className="absolute inset-0 overflow-hidden">
        <img src={HERO_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover" />
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