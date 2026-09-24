import React from "react";
import { motion } from "framer-motion";
import { Clock, Flame } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const DEALS = [
  { title: { en: "Santorini — 4 nights", he: "סנטוריני — 4 לילות" }, desc: { en: "Flights + sea-view suite", he: "טיסות + סוויטת נוף לים" }, price: "$690", old: "$940", img: "https://media.base44.com/images/public/6ab46eccdb257d5931954287/d37139e76_generated_aef8527c.jpg", days: 3 },
  { title: { en: "Maldives overwater — 5 nights", he: "מלדיביים מעל המים — 5 לילות" }, desc: { en: "Private villa + transfers", he: "וילה פרטית + הסעות" }, price: "$1,490", old: "$2,100", img: "https://media.base44.com/images/public/6ab46eccdb257d5931954287/187e21edb_generated_2f11b66c.jpg", days: 5 },
  { title: { en: "Dubai city break — 3 nights", he: "מולדת דובאי — 3 לילות" }, desc: { en: "5-star + airport transfer", he: "5 כוכבים + הסעה משדה" }, price: "$540", old: "$780", img: "https://media.base44.com/images/public/6ab46eccdb257d5931954287/6e3d604ab_generated_97d880cc.jpg", days: 2 },
];

export default function LastMinuteDeals() {
  const { t, lang } = useI18n();
  return (
    <section className="py-24 lg:py-32 max-w-7xl mx-auto px-6 lg:px-10">
      <div className="flex items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 text-gold text-xs tracking-luxe uppercase mb-3">
            <Flame className="w-4 h-4" strokeWidth={1.5} />
            {t("deals.title")}
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-light text-ink">{t("deals.subtitle")}</h2>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {DEALS.map((d, i) => {
          const pct = Math.round((1 - parseFloat(d.price.replace(/[^0-9.]/g, "")) / parseFloat(d.old.replace(/[^0-9.]/g, ""))) * 100);
          return (
            <motion.article
              key={d.title.en}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative rounded-2xl overflow-hidden shadow-horizon aspect-[4/5]"
            >
              <img src={d.img} alt={d.title[lang]} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
              <div className="absolute top-4 start-4 flex flex-col gap-2">
                <span className="self-start px-2.5 py-1 rounded-full gold-foil text-ink text-xs font-bold">−{pct}% {t("deals.save")}</span>
                <span className="self-start inline-flex items-center gap-1 px-2.5 py-1 rounded-full glass-dark text-white/90 text-xs">
                  <Clock className="w-3 h-3" strokeWidth={1.5} />
                  {d.days}d
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="text-white font-display text-2xl">{d.title[lang]}</h3>
                <p className="text-white/75 text-sm mt-1">{d.desc[lang]}</p>
                <div className="flex items-end gap-2 mt-3">
                  <span className="text-white text-2xl font-semibold">{d.price}</span>
                  <span className="text-white/50 text-sm line-through mb-0.5">{d.old}</span>
                  <span className="text-white/60 text-xs mb-1">{t("deals.perPerson")}</span>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}