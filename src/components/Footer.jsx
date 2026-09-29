import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Image } from "@/components/ui/image";

const FOOTER_LOGO_URL = "https://media.base44.com/images/public/6ab46eccdb257d5931954287/44b60cd24_logonegative-01.png";

const CITIES = [
  { label: "New York", tz: "America/New_York" },
  { label: "London", tz: "Europe/London" },
  { label: "Tel Aviv", tz: "Asia/Jerusalem" },
  { label: "Tokyo", tz: "Asia/Tokyo" },
];

function WorldClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="grid grid-cols-2 gap-3">
      {CITIES.map((c) => {
        const time = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: c.tz, hour12: false }).format(now);
        return (
          <div key={c.label} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/10">
            <span className="text-white/60 text-xs">{c.label}</span>
            <span className="text-gold font-mono text-sm tabular-nums">{time}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function Footer() {
  const { t, lang, dir } = useI18n();
  const [email, setEmail] = useState("");

  const explore = ["nav.flights", "nav.hotels", "nav.cars", "nav.transfers", "nav.destinations"].map((k) => t(k));
  const company = ["nav.about", "nav.deals", "nav.contact", "footer.legal", "footer.terms"].map((k) => t(k));
  const support = ["footer.cookies", "nav.contact", "footer.legal", "footer.terms"].map((k) => t(k));

  return (
    <footer className="bg-ink text-ether pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-4 gap-10 lg:gap-12 pb-14 border-b border-white/10">
          {/* brand + newsletter */}
          <div>
            <Image src={FOOTER_LOGO_URL} alt={t("brand.name")} className="h-20 w-48 sm:h-24 sm:w-56" fittingType="fit" />
            <p className="mt-4 text-white/60 text-sm leading-relaxed max-w-xs">{t("footer.tagline")}</p>
            <div className="mt-6">
              <p className="text-white font-medium text-sm">{t("footer.newsletter")}</p>
              <p className="text-white/55 text-xs mt-1">{t("footer.newsletterDesc")}</p>
              <form onSubmit={(e) => e.preventDefault()} className="mt-3 flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("footer.emailPlaceholder")}
                  className="flex-1 h-11 px-3.5 rounded-xl bg-white/5 border border-white/15 focus:border-accent outline-none text-sm text-white placeholder:text-white/40"
                />
                <button className="h-11 px-4 rounded-xl gold-foil text-ink font-semibold text-sm inline-flex items-center gap-1.5">
                  {t("footer.subscribe")}
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>
              </form>
            </div>
          </div>

          {/* explore */}
          <div>
            <h4 className="text-white/90 font-medium text-sm tracking-luxe uppercase">{t("footer.explore")}</h4>
            <ul className="mt-5 space-y-3">
              {explore.map((l) => (
                <li key={l}><a href="#search" className="text-white/60 text-sm hover:text-gold transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* company + support */}
          <div>
            <h4 className="text-white/90 font-medium text-sm tracking-luxe uppercase">{t("footer.company")}</h4>
            <ul className="mt-5 space-y-3">
              {company.map((l) => (
                <li key={l}><a href="#contact" className="text-white/60 text-sm hover:text-gold transition-colors">{l}</a></li>
              ))}
            </ul>
            <h4 className="text-white/90 font-medium text-sm tracking-luxe uppercase mt-8">{t("footer.support")}</h4>
            <ul className="mt-5 space-y-3">
              {support.map((l) => (
                <li key={l}><a href="#contact" className="text-white/60 text-sm hover:text-gold transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* world clock */}
          <div>
            <h4 className="text-white/90 font-medium text-sm tracking-luxe uppercase">{t("footer.worldClock")}</h4>
            <p className="text-white/55 text-xs mt-2">{t("contact.hoursValue")}</p>
            <div className="mt-5"><WorldClock /></div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/45 text-xs">
          <p>© {new Date().getFullYear()} {t("brand.name")} - {t("brand.slogan")}. {t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}