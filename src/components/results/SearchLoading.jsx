import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Bed, Sun, Camera, Compass, Globe, Umbrella } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const CYCLE_ICONS = [Plane, Bed, Sun, Camera, Compass, Globe, Umbrella];

export default function SearchLoading({ destination, checkIn, checkOut }) {
  const { t, lang } = useI18n();
  const [iconIdx, setIconIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIconIdx((prev) => (prev + 1) % CYCLE_ICONS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const formatDateWithDay = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const locale = lang === "he" ? "he-IL" : "en-US";
    const weekday = date.toLocaleDateString(locale, { weekday: "long" });
    const weekdayClean = lang === "he" ? weekday.replace("יום ", "") : weekday;
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${weekdayClean} • ${dd}-${mm}-${yyyy}`;
  };

  const calcNightsAndDays = () => {
    if (!checkIn || !checkOut) return null;
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const nights = Math.round((outDate - inDate) / (1000 * 60 * 60 * 24));
    return { nights, days: nights + 1 };
  };

  const nd = calcNightsAndDays();
  const CurrentIcon = CYCLE_ICONS[iconIdx];

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center shadow-horizon"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={iconIdx}
            initial={{ opacity: 0, scale: 0.4, rotate: -25 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.4, rotate: 25 }}
            transition={{ duration: 0.35 }}
            className="flex items-center justify-center"
          >
            <CurrentIcon className="w-9 h-9 sm:w-11 sm:h-11 text-[#F5D166]" strokeWidth={1.5} />
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <div className="text-center" style={{ fontFamily: '"Frank Ruhl Libre", "Cormorant Garamond", ui-serif, Georgia, serif' }}>
        <p className="text-base font-medium text-[#2D3035]">{t("results.searchingIn")}{destination}</p>
        <div className="text-sm text-[#7D7D7D] mt-1.5">
          <div>{t("results.checkInLabel")} <span dir="ltr">{formatDateWithDay(checkIn)}</span></div>
          <div>{t("results.checkOutLabel")} <span dir="ltr">{formatDateWithDay(checkOut)}</span></div>
          {nd && (
            <div className="mt-1.5 font-medium text-[#2D3035]">
              {nd.nights} {t("results.nights")}, {nd.days} {t("results.days")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}