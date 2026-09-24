import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const DAY_LABELS = {
  en: ["SU", "MO", "TU", "WE", "TH", "FR", "SA"],
  he: ["א", "ב", "ג", "ד", "ה", "ו", "ש"],
};

const sameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const between = (d, s, e) => s && e && d > s && d < e;

export default function DatePickerModal({ open, mode, checkIn, checkOut, active, onSelect, onClose }) {
  const { lang, dir, t } = useI18n();
  const [pickIn, setPickIn] = useState(checkIn);
  const [pickOut, setPickOut] = useState(checkOut);
  const scrollRef = useRef(null);

  useEffect(() => { setPickIn(checkIn); setPickOut(checkOut); }, [open, checkIn, checkOut]);

  const months = useMemo(() => {
    const base = new Date();
    base.setDate(1);
    return Array.from({ length: 12 }, (_, i) => new Date(base.getFullYear(), base.getMonth() + i, 1));
  }, []);

  const fmt = (d) =>
    d
      ? new Date(d).toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { day: "numeric", month: "short", year: "numeric" })
      : t("search.addDate");

  const handleDay = (d) => {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    if (mode === "single") {
      onSelect(date, null);
      return;
    }
    if (!pickIn || (pickIn && pickOut)) { setPickIn(date); setPickOut(null); }
    else if (date <= pickIn) { setPickIn(date); setPickOut(null); }
    else setPickOut(date);
  };

  const apply = () => onSelect(pickIn, pickOut);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full sm:max-w-2xl max-h-[85vh] flex flex-col rounded-t-2xl sm:rounded-2xl"
          >
            {/* header */}
            <div className="flex items-center gap-3 p-4 border-b border-[#EAEAEA]">
              <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-[#F5F5F5] flex items-center justify-center shrink-0">
                <ArrowLeft className="w-5 h-5 text-[#2D3035] rtl:rotate-180" strokeWidth={1.75} />
              </button>
              <div className="flex gap-2 flex-1">
                <div className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${active === "in" || mode === "single" ? "border-[#2D3035] shadow-sm" : "border-[#E0E0E0]"}`}>
                  <div className="text-[10px] text-[#7D7D7D] leading-tight">{mode === "single" ? t("search.date") : t("search.checkIn")}</div>
                  <div className="text-sm text-[#2D3035] font-medium truncate">{fmt(pickIn)}</div>
                </div>
                {mode === "range" && (
                  <div className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${active === "out" ? "border-[#2D3035] shadow-sm" : "border-[#E0E0E0]"}`}>
                    <div className="text-[10px] text-[#7D7D7D] leading-tight">{t("search.checkOut")}</div>
                    <div className="text-sm text-[#2D3035] font-medium truncate">{fmt(pickOut)}</div>
                  </div>
                )}
              </div>
            </div>

            {/* months — 2 side-by-side, vertical scroll for more */}
            <div ref={scrollRef} className="overflow-y-auto px-4 pb-6 pt-4 h-[340px] sm:h-[320px]">
              <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
                {months.map((m, mi) => {
                  const name = m.toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { month: "long", year: "numeric" });
                  const firstDay = new Date(m.getFullYear(), m.getMonth(), 1).getDay();
                  const daysInMonth = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
                  const cells = [];
                  for (let i = 0; i < firstDay; i++) cells.push(null);
                  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(m.getFullYear(), m.getMonth(), d));
                  return (
                    <div key={mi} className="pt-2 min-w-0">
                      <div className="font-semibold text-[#2D3035] text-base mb-2 capitalize text-center">{name}</div>
                      <div className="grid grid-cols-7 mb-1">
                        {DAY_LABELS[lang].map((d, i) => (
                          <div key={i} className="text-center text-[11px] font-medium text-[#9a9a9a]">{d}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-y-1">
                        {cells.map((c, ci) => {
                          if (!c) return <div key={ci} />;
                          const isPast = c < today;
                          const isStart = sameDay(c, pickIn);
                          const isEnd = sameDay(c, pickOut);
                          const inRange = between(c, pickIn, pickOut);
                          const selected = isStart || isEnd;
                          return (
                            <div key={ci} className="relative flex justify-center">
                              {inRange && <div className="absolute inset-y-1 inset-x-0 bg-[#F5D166]/30 rounded-full" />}
                              <button
                                type="button"
                                disabled={isPast}
                                onClick={() => handleDay(c)}
                                className={`relative w-full aspect-square rounded-full text-xs sm:text-sm flex items-center justify-center transition-colors
                                  ${selected ? "bg-[#F5D166] text-[#2D3035] font-semibold" : isPast ? "text-[#C5C5C5] cursor-not-allowed" : "text-[#2D3035] hover:bg-[#F5F5F5]"}`}
                              >
                                {c.getDate()}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* footer */}
            {mode === "range" && (
              <div className="p-4 border-t border-[#EAEAEA]">
                <button onClick={apply} className="w-full h-12 rounded-lg bg-[#F5D166] text-[#2D3035] font-bold text-sm hover:brightness-105 transition">
                  {t("search.done")}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}