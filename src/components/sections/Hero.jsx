import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import SearchWidget from "@/components/search/SearchWidget";

const HERO_IMG = "https://media.base44.com/images/public/6ab46eccdb257d5931954287/44bc4738b_generated_76a1222f.jpg";

export default function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-end">
      {/* background */}
      <motion.div
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 overflow-hidden"
      >
        <img src={HERO_IMG} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/10 to-ink/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-ether/40 to-transparent" />
      </motion.div>

      {/* headline */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-10 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-dark text-white/90 text-xs tracking-luxe uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-gold" strokeWidth={1.5} />
            {t("hero.badge")}
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