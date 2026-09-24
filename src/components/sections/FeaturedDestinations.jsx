import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const DESTINATIONS = [
  { name: { en: "Santorini", he: "סנטוריני" }, country: { en: "Greece", he: "יוון" }, price: "$420", img: "https://media.base44.com/images/public/6ab46eccdb257d5931954287/d37139e76_generated_aef8527c.jpg" },
  { name: { en: "Maldives", he: "המלדיביים" }, country: { en: "Indian Ocean", he: "האוקיינוס ההודי" }, price: "$1,180", img: "https://media.base44.com/images/public/6ab46eccdb257d5931954287/187e21edb_generated_2f11b66c.jpg" },
  { name: { en: "Paris", he: "פריז" }, country: { en: "France", he: "צרפת" }, price: "$310", img: "https://media.base44.com/images/public/6ab46eccdb257d5931954287/22f639796_generated_fe19c692.jpg" },
  { name: { en: "Dubai", he: "דובאי" }, country: { en: "UAE", he: "איחוד האמירויות" }, price: "$540", img: "https://media.base44.com/images/public/6ab46eccdb257d5931954287/6e3d604ab_generated_97d880cc.jpg" },
];

export default function FeaturedDestinations() {
  const { t, lang } = useI18n();
  return (
    <section className="py-24 lg:py-32 max-w-7xl mx-auto px-6 lg:px-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="font-display text-4xl lg:text-5xl font-light text-ink">{t("destinations.title")}</h2>
          <p className="mt-3 text-muted-foreground max-w-xl">{t("destinations.subtitle")}</p>
        </div>
        <a href="#destinations" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-gold transition-colors group">
          {t("destinations.viewAll")}
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform rtl:rotate-90" />
        </a>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {DESTINATIONS.map((d, i) => (
          <motion.a
            href="#search"
            key={d.name.en}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group relative block aspect-[3/4] rounded-2xl overflow-hidden shadow-horizon"
          >
            <img src={d.img} alt={d.name[lang]} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="text-white/70 text-xs tracking-luxe uppercase">{d.country[lang]}</p>
              <h3 className="text-white font-display text-2xl mt-1">{d.name[lang]}</h3>
              <p className="text-white/90 text-sm mt-2">{t("destinations.from")} <span className="text-gold font-semibold">{d.price}</span></p>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}