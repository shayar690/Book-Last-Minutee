import React, { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function Contact() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="py-24 lg:py-32 bg-ether/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <div>
          <h2 className="font-display text-4xl lg:text-5xl font-light text-ink">{t("contact.title")}</h2>
          <p className="mt-3 text-muted-foreground max-w-md">{t("contact.subtitle")}</p>

          <div className="mt-10 space-y-5">
            <a href="tel:+18005550199" className="flex items-center gap-4 group">
              <span className="w-11 h-11 rounded-xl glass flex items-center justify-center border border-mist">
                <Phone className="w-4.5 h-4.5 text-gold" strokeWidth={1.5} />
              </span>
              <span>
                <span className="block text-xs uppercase tracking-luxe text-muted-foreground">{t("contact.phone")}</span>
                <span className="text-ink font-medium group-hover:text-gold transition-colors">+1 800 555 0199</span>
              </span>
            </a>
            <a href="mailto:concierge@lastminutevacations.com" className="flex items-center gap-4 group">
              <span className="w-11 h-11 rounded-xl glass flex items-center justify-center border border-mist">
                <Mail className="w-4.5 h-4.5 text-gold" strokeWidth={1.5} />
              </span>
              <span>
                <span className="block text-xs uppercase tracking-luxe text-muted-foreground">{t("contact.emailLabel")}</span>
                <span className="text-ink font-medium group-hover:text-gold transition-colors">concierge@lastminutevacations.com</span>
              </span>
            </a>
            <div className="flex items-center gap-4">
              <span className="w-11 h-11 rounded-xl glass flex items-center justify-center border border-mist">
                <Clock className="w-4.5 h-4.5 text-gold" strokeWidth={1.5} />
              </span>
              <span>
                <span className="block text-xs uppercase tracking-luxe text-muted-foreground">{t("contact.hours")}</span>
                <span className="text-ink font-medium">{t("contact.hoursValue")}</span>
              </span>
            </div>
          </div>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-card rounded-2xl p-6 lg:p-8 border border-mist shadow-horizon space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <input required placeholder={t("contact.name")} className="h-12 px-4 rounded-xl bg-ether/50 border border-mist focus:border-accent outline-none text-sm text-ink" />
            <input required type="email" placeholder={t("contact.email")} className="h-12 px-4 rounded-xl bg-ether/50 border border-mist focus:border-accent outline-none text-sm text-ink" />
          </div>
          <textarea required rows={5} placeholder={t("contact.message")} className="w-full p-4 rounded-xl bg-ether/50 border border-mist focus:border-accent outline-none text-sm text-ink resize-none" />
          <button type="submit" className="w-full h-12 rounded-xl gold-foil text-ink font-semibold text-sm inline-flex items-center justify-center gap-2 hover:brightness-105 transition">
            {sent ? <><CheckCircle2 className="w-4 h-4" /> {t("contact.sent")}</> : <><Send className="w-4 h-4" /> {t("contact.send")}</>}
          </button>
        </motion.form>
      </div>
    </section>
  );
}