import React from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Layers, Eye, Globe2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const ITEMS = [
  { icon: BadgeCheck, key: "1" },
  { icon: Layers, key: "2" },
  { icon: Eye, key: "3" },
  { icon: Globe2, key: "4" },
];

export default function WhyBookWithUs() {
  const { t } = useI18n();
  return (
    <section className="py-24 lg:py-32 bg-ink text-ether relative overflow-hidden">
      <div className="absolute -top-32 -end-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-16">
          <h2 className="font-display text-4xl lg:text-5xl font-light text-white">{t("why.title")}</h2>
          <p className="mt-3 text-white/70">{t("why.subtitle")}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="border-t border-white/15 pt-6"
              >
                <Icon className="w-7 h-7 text-gold mb-5" strokeWidth={1.25} />
                <h3 className="font-display text-2xl text-white">{t(`why.${item.key}.title`)}</h3>
                <p className="mt-2.5 text-white/65 text-[15px] leading-relaxed">{t(`why.${item.key}.desc`)}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}