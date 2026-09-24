import React from "react";
import { motion } from "framer-motion";
import { Star, MapPin, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const HOTELS = [
  { name: { en: "The Aegean Sanctuary", he: "מקדש הים האגאי" }, city: { en: "Oia, Santorini", he: "אויה, סנטוריני" }, rating: 4.9, price: "$340", img: "https://media.base44.com/images/public/6ab46eccdb257d5931954287/7b6dfe3f4_generated_9efa7532.jpg", tags: ["Sea view", "Spa", "Breakfast"] },
  { name: { en: "Coral Overwater Resort", he: "אתר הנופש מעל המים" }, city: { en: "North Malé Atoll", he: "אטול צפון מאלה" }, rating: 4.8, price: "$890", img: "https://media.base44.com/images/public/6ab46eccdb257d5931954287/0c19dc469_generated_c436a455.jpg", tags: ["Private pool", "Beach", "All-inclusive"] },
  { name: { en: "Lumière Maison", he: "לומייר מייזון" }, city: { en: "8th Arr., Paris", he: "רובע 8, פריז" }, rating: 4.7, price: "$410", img: "https://media.base44.com/images/public/6ab46eccdb257d5931954287/852fac79d_generated_fcf49efe.jpg", tags: ["City view", "Concierge", "Bar"] },
];

export default function PopularHotels() {
  const { t, lang } = useI18n();
  return (
    <section id="destinations" className="py-24 lg:py-32 bg-ether/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-12 max-w-2xl">
          <h2 className="font-display text-4xl lg:text-5xl font-light text-ink">{t("hotels.title")}</h2>
          <p className="mt-3 text-muted-foreground">{t("hotels.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {HOTELS.map((h, i) => (
            <motion.article
              key={h.name.en}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group bg-card rounded-2xl overflow-hidden border border-mist shadow-horizon hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={h.img} alt={h.name[lang]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-3 end-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full glass text-ink text-xs font-semibold">
                  <Star className="w-3 h-3 fill-gold text-gold" />
                  {h.rating}
                </div>
                {/* ghost badges */}
                <div className="absolute bottom-3 start-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {h.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full glass-dark text-white/90 text-[11px]">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1 text-muted-foreground text-xs">
                  <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
                  {h.city[lang]}
                </div>
                <h3 className="font-display text-2xl text-ink mt-1.5">{h.name[lang]}</h3>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <span className="text-2xl font-semibold text-ink">{h.price}</span>
                    <span className="text-muted-foreground text-sm">{t("hotels.perNight")}</span>
                  </div>
                  <button className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl bg-ink text-ether text-sm font-medium hover:bg-ink/90 transition-colors group/btn">
                    {t("hotels.bookNow")}
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform rtl:rotate-180" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}