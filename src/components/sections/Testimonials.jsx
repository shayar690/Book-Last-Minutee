import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const REVIEWS = {
  en: [
    { name: "Elena Marchetti", trip: "Santorini · honeymoon", text: "The calmest booking I've ever made. Everything synced, nothing hidden, and the suite was exactly as pictured." },
    { name: "David Okafor", trip: "Maldives · family", text: "Flights, transfers and the overwater villa in one flow. Last-Minute Vacations felt like a concierge, not a checkout." },
    { name: "Yael Ben-David", trip: "Paris · weekend", text: "Hebrew support, RTL interface, and a price that held all the way to payment. This is how travel should feel." },
  ],
  he: [
    { name: "אלנה מרקטי", trip: "סנטוריני · ירח דבש", text: "ההזמנה השלווה ביותר שעשיתי. הכל מסונכרן, שום דבר נסתר, והסוויטה הייתה בדיוק כמו בתמונה." },
    { name: "דוד אוקפור", trip: "המלדיביים · משפחה", text: "טיסות, הסעות ווילה מעל המים בתהליך אחד. חופשות ברגע האחרון הרגישו כמו קונסיירז', לא כמו קופה." },
    { name: "יעל בן-דוד", trip: "פריז · סוף שבוע", text: "תמיכה בעברית, ממשק RTL, ומחיר שהחזיק עד התשלום. כך נסיעות צריכות להרגיש." },
  ],
};

export default function Testimonials() {
  const { t, lang } = useI18n();
  const reviews = REVIEWS[lang];
  return (
    <section className="py-24 lg:py-32 max-w-7xl mx-auto px-6 lg:px-10">
      <div className="mb-12 max-w-2xl">
        <h2 className="font-display text-4xl lg:text-5xl font-light text-ink">{t("testimonials.title")}</h2>
        <p className="mt-3 text-muted-foreground">{t("testimonials.subtitle")}</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {reviews.map((r, i) => (
          <motion.figure
            key={r.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="bg-card rounded-2xl p-7 border border-mist shadow-horizon"
          >
            <Quote className="w-7 h-7 text-gold mb-5" strokeWidth={1.25} />
            <blockquote className="text-ink/85 font-light text-lg leading-relaxed">"{r.text}"</blockquote>
            <figcaption className="mt-6 pt-5 border-t border-mist">
              <p className="font-semibold text-ink">{r.name}</p>
              <p className="text-muted-foreground text-sm mt-0.5">{r.trip}</p>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}