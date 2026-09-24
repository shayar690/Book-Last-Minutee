import React from "react";
import { motion } from "framer-motion";
import { Gem, Sun, Ship, Plane, Mountain, Check, ArrowRight, Phone, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Link } from "react-router-dom";

const PACKAGES = [
  {
    icon: Sun,
    he: {
      title: "הצעה בשקיעה על החוף",
      desc: "פריסה אינטימית על חוף חולי - נרות, פרחים ופינה פרטית מול שקיעה זהובה.",
      price: "החל מ- $1,200",
      features: ["עיצוב פרחוני ונרות", "צלם מקצועי", "שמפניה ופירות"],
    },
    en: {
      title: "Beach Sunset Proposal",
      desc: "Intimate setup on a sandy shore — candles, florals and a private cabana as the sun melts into gold.",
      price: "from $1,200",
      features: ["Floral & candle styling", "Professional photographer", "Champagne & fruit"],
    },
  },
  {
    icon: Ship,
    he: {
      title: "הצעה על יאכטה פרטית",
      desc: "יאכטה פרטית השטה לאורך חופי דובאי עם ארוחת גורמה ושירות צוות.",
      price: "החל מ- $2,800",
      features: ["יאכטה לשעתיים", "ארוחת גורמה", "צלם + וידאו"],
    },
    en: {
      title: "Private Yacht Proposal",
      desc: "A private yacht gliding along Dubai's coast with a gourmet dinner and full crew service.",
      price: "from $2,800",
      features: ["2-hour yacht charter", "Gourmet dinner", "Photo + video crew"],
    },
  },
  {
    icon: Plane,
    he: {
      title: "הצעה במסוק מעל העיר",
      desc: "טיסת מסוק פרטית מעל קו הרקיע של דובאי, עם ההצעה ברגע השיא.",
      price: "החל מ- $3,500",
      features: ["טיסה פרטית של 30 דק'", "נופים פנורמיים", "תיעוד מלא"],
    },
    en: {
      title: "Helicopter Proposal",
      desc: "A private helicopter flight over Dubai's skyline, with the proposal at the peak moment.",
      price: "from $3,500",
      features: ["30-min private flight", "Panoramic views", "Full documentation"],
    },
  },
  {
    icon: Mountain,
    he: {
      title: "הצעה בדיונות המדבר",
      desc: "נסיעת ג'יפ אל לב הדיונות, אוהל פרטי מואר וערב ערבי קסום.",
      price: "החל מ- $1,900",
      features: ["ספארי דיונות", "אוהל פרטי", "ארוחת בדואים"],
    },
    en: {
      title: "Desert Dune Proposal",
      desc: "A dune drive to the heart of the desert, a lantern-lit private tent and an enchanted Arabian evening.",
      price: "from $1,900",
      features: ["Dune safari", "Private tent", "Bedouin dinner"],
    },
  },
];

const STEPS = [
  {
    he: { n: "01", t: "שיחת היכרות", d: "מספרים לנו עליככם ועל הסיפור - אנחנו מקשיבים." },
    en: { n: "01", t: "Discovery call", d: "You tell us about yourselves and your story — we listen." },
  },
  {
    he: { n: "02", t: "תכנון מותאם", d: "אנחנו בונים עבורכם תסריט ועיצוב ייעודיים." },
    en: { n: "02", t: "Tailored plan", d: "We craft a bespoke script and styling just for you." },
  },
  {
    he: { n: "03", t: "הרגע", d: "אתם נהנים - אנחנו דואגים לכל פרט ביום המושלם." },
    en: { n: "03", t: "The moment", d: "You enjoy — we handle every detail on the perfect day." },
  },
];

export default function MarriageProposalsDubai() {
  const { lang, dir } = useI18n();
  const he = lang === "he";

  const c = (key) => (he ? {
    badge: "שירות קונסיירז' ייעודי",
    title: "הצעת נישואין בדובאי",
    subtitle: "רגע שייך לכם לנצח - על רקע האופק המוזהב של דובאי. אנחנו מתכננים עבורכם את ההצעה המושלמת, עד הפרט האחרון.",
    cta: "בואו נתכנן את הרגע שלכם",
    packagesTitle: "חבילות הצעה",
    packagesSubtitle: "כל חבילה מותאמת אישית וניתנת לשדרוג.",
    stepsTitle: "איך זה עובד",
    back: "חזרה לחיפוש",
    contactTitle: "מוכנים להגיד כן?",
    contactSubtitle: "שיחה אחת מפרידה בינכם לבין הרגע שמוריד את הדמעות.",
    phone: "חייגו לקונסיירז'",
  }[key] : {
    badge: "Bespoke concierge service",
    title: "Marriage Proposals in Dubai",
    subtitle: "A moment that belongs to you forever — against Dubai's golden horizon. We craft the perfect proposal, down to the last detail.",
    cta: "Let's plan your moment",
    packagesTitle: "Proposal packages",
    packagesSubtitle: "Every package is personalised and upgradeable.",
    stepsTitle: "How it works",
    back: "Back to search",
    contactTitle: "Ready to say yes?",
    contactSubtitle: "One call stands between you and the moment that brings the tears.",
    phone: "Call the concierge",
  }[key]);

  return (
    <div className="min-h-screen bg-ether" dir={dir}>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1220] via-[#1a2440] to-[#3a2e1a]" />
        <div className="absolute -top-24 end-[-3rem] opacity-[0.07]">
          <Gem className="w-[26rem] h-[26rem] text-[#F5D166]" strokeWidth={1} />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 pt-28 pb-20 sm:pt-36 sm:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start gap-5"
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#F5D166]/40 text-[#F5D166] text-xs tracking-luxe uppercase">
              <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
              {c("badge")}
            </span>
            <h1 className="font-heading text-5xl sm:text-7xl leading-[1.05] max-w-2xl">{c("title")}</h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-xl leading-relaxed">{c("subtitle")}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="#packages" className="inline-flex items-center gap-2 px-7 h-12 rounded-lg gold-foil text-ink font-bold text-sm hover:brightness-105 transition">
                {c("cta")}
                <ArrowRight className="w-4 h-4 rtl:rotate-180" strokeWidth={2} />
              </a>
              <Link to="/" className="inline-flex items-center px-6 h-12 rounded-lg border border-white/20 text-white/80 text-sm hover:bg-white/10 transition">
                {c("back")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="max-w-6xl mx-auto px-6 py-20 sm:py-28">
        <div className="text-center mb-14">
          <h2 className="font-heading text-4xl sm:text-5xl text-ink">{c("packagesTitle")}</h2>
          <p className="text-muted-foreground mt-3">{c("packagesSubtitle")}</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {PACKAGES.map((p, i) => {
            const Icon = p.icon;
            const d = he ? p.he : p.en;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group bg-white rounded-2xl p-6 shadow-horizon border border-mist/60 hover:border-[#F5D166] transition-colors"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-14 h-14 rounded-xl bg-[#FFFAD9] flex items-center justify-center group-hover:gold-foil transition-colors">
                    <Icon className="w-6 h-6 text-ink" strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-bold text-[#B8860B] tracking-wide">{d.price}</span>
                </div>
                <h3 className="font-heading text-2xl text-ink mb-2">{d.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-5">{d.desc}</p>
                <ul className="space-y-2">
                  {d.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-2.5 text-sm text-foreground/80">
                      <Check className="w-4 h-4 text-[#B8860B] shrink-0" strokeWidth={2} />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Steps */}
      <section className="bg-ink text-white py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-heading text-4xl sm:text-5xl text-center mb-14">{c("stepsTitle")}</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {STEPS.map((s, i) => {
              const d = he ? s.he : s.en;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="font-heading text-5xl text-[#F5D166]/80 mb-4">{d.n}</div>
                  <h3 className="font-heading text-2xl mb-2">{d.t}</h3>
                  <p className="text-white/60 leading-relaxed">{d.d}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 sm:py-28 text-center">
        <Gem className="w-12 h-12 text-[#F5D166] mx-auto mb-6" strokeWidth={1.5} />
        <h2 className="font-heading text-4xl sm:text-5xl text-ink mb-4">{c("contactTitle")}</h2>
        <p className="text-muted-foreground text-lg mb-8">{c("contactSubtitle")}</p>
        <a href="tel:+972000000000" className="inline-flex items-center gap-2 px-8 h-14 rounded-lg bg-ink text-white font-bold text-sm hover:bg-ink/90 transition">
          <Phone className="w-4 h-4" strokeWidth={2} />
          {c("phone")}
        </a>
      </section>
    </div>
  );
}