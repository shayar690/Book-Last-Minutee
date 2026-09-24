import React from "react";
import { motion } from "framer-motion";
import { Plane, Bed, MapPin, Camera, Compass } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function SearchLoading({ destination, checkIn, checkOut }) {
  const { t, lang } = useI18n();

  const icons = [Plane, Bed, MapPin, Camera, Compass];

  const formatDateWithDay = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const locale = lang === "he" ? "he-IL" : "en-US";
    const weekday = date.toLocaleDateString(locale, { weekday: "long" });
    const weekdayClean = lang === "he" ? weekday.replace("יום ", "") : weekday;
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${weekdayClean}, ${dd}-${mm}-${yyyy}`;
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      <div className="flex items-center gap-2 sm:gap-3">
        {icons.map((Icon, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -12, 0], rotate: [0, i % 2 === 0 ? 5 : -5, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center shadow-sm"
          >
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${i % 2 === 0 ? "text-[#F5D166]" : "text-[#2D3035]"}`} strokeWidth={1.5} />
          </motion.div>
        ))}
      </div>
      <div className="text-center">
        <p className="text-base font-medium text-[#2D3035]">{t("results.searchingIn")}{destination}</p>
        <p dir="ltr" className="text-sm text-[#7D7D7D] mt-1.5">
          {formatDateWithDay(checkIn)} <span className="text-[#F5D166]">→</span> {formatDateWithDay(checkOut)}
        </p>
      </div>
    </div>
  );
}