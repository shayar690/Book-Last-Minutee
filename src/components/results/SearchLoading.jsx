import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Sun, Waves, Briefcase, Palmtree, Cloud } from "lucide-react";
import { Image } from "@/components/ui/image";

const PASSPORT_IMAGE = "https://media.base44.com/images/public/6ab46eccdb257d5931954287/4d8661f08_IMG_1685.webp";
import DateDisplay from "@/components/results/DateDisplay";
import { useI18n } from "@/lib/i18n";

// Each scene has its own icon, colour, and motion style — cycling creates a
// "plane flying → hotel → sun → umbrella → …" travel montage.
const SCENES = [
  { Icon: Plane, color: "#F5D166", anim: { x: [-28, 28, -28], y: [0, -14, 0], rotate: [0, 8, -8, 0] }, dur: 3 },
  { image: PASSPORT_IMAGE, anim: { scale: [1, 1.1, 1], rotate: [-4, 4, -4] }, dur: 3 },
  { Icon: Sun, color: "#F5B04A", anim: { rotate: 360, scale: [1, 1.12, 1] }, dur: 6 },
  { Icon: Waves, color: "#7BA7CC", anim: { x: [-8, 8, -8] }, dur: 3 },
  { Icon: Briefcase, color: "#E8916D", anim: { y: [0, -12, 0], rotate: [-3, 3, -3] }, dur: 2.5 },
  { Icon: Palmtree, color: "#5BA6A0", anim: { rotate: [-4, 4, -4] }, dur: 3 },
];

// Detects if the destination string is a specific hotel name rather than a
// city/region. Hotel labels from autocomplete have 3+ comma parts ("Hotel
// Name, City, Country") or contain hotel-type keywords.
function isHotelDestination(dest) {
  if (!dest) return false;
  const parts = dest.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 3) return true;
  const hotelKeywords = /\b(hotel|resort|suites|lodge|inn|motel|boutique|villa|hostel|guesthouse)\b/i;
  return hotelKeywords.test(dest) || /מלון/.test(dest);
}

export default function SearchLoading({ destination, checkIn, checkOut }) {
  const { t, lang } = useI18n();
  const [sceneIdx, setSceneIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSceneIdx((prev) => (prev + 1) % SCENES.length);
    }, 2400);
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
    return `${dd}.${mm}.${yyyy} (${weekdayClean})`;
  };

  const calcNightsAndDays = () => {
    if (!checkIn || !checkOut) return null;
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const nights = Math.round((outDate - inDate) / (1000 * 60 * 60 * 24));
    return { nights, days: nights + 1 };
  };

  const nd = calcNightsAndDays();
  const scene = SCENES[sceneIdx];
  const SceneIcon = scene.Icon;

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-10">
      {/* Large animated scene */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Soft glow ring */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#F5D166]/12 to-transparent" />

        {/* Floating clouds */}
        <motion.div
          animate={{ x: [-14, 16, -14], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-3 left-1"
        >
          <Cloud className="w-9 h-9 text-[#C5C5C5]" strokeWidth={1} />
        </motion.div>
        <motion.div
          animate={{ x: [16, -14, 16], opacity: [0.4, 0.2, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-7 right-1"
        >
          <Cloud className="w-7 h-7 text-[#C5C5C5]" strokeWidth={1} />
        </motion.div>

        {/* Main icon with scene-specific animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={sceneIdx}
            initial={{ opacity: 0, scale: 0.3, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.3, y: -12 }}
            transition={{ duration: 0.4 }}
            className="relative z-10"
          >
            <motion.div
              animate={scene.anim}
              transition={{ duration: scene.dur, repeat: Infinity, ease: "easeInOut" }}
            >
              {scene.image ? (
                <Image src={scene.image} alt="Passport" className="w-20 h-20" fittingType="fit" />
              ) : (
                <SceneIcon className="w-20 h-20" style={{ color: scene.color }} strokeWidth={1.25} />
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Text — Inter (font-body) to match the homepage search widget */}
      <div className="text-center font-body">
        <p className="text-xl font-medium text-[#2D3035]">
          {isHotelDestination(destination) ? destination : `${t("results.searchingIn")}${destination}`}
        </p>
        <div className="text-base text-[#7D7D7D] mt-3 leading-relaxed">
          <div>{t("results.checkInLabel")} <DateDisplay dateStr={checkIn} /></div>
          <div>{t("results.checkOutLabel")} <DateDisplay dateStr={checkOut} /></div>
          {nd && (
            <div className="mt-2.5 font-medium text-[#2D3035] text-lg">
              {nd.nights} {t("results.nights")}, {nd.days} {t("results.days")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}