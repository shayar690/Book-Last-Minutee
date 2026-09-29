import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, ChevronDown, Plus, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

function Stepper({ label, hint, value, setValue, min, max }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex flex-col">
        <span className="text-sm text-[#2D3035]">{label}</span>
        {hint && <span className="text-[11px] text-[#9a9a9a]">{hint}</span>}
      </span>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => setValue(Math.max(min, value - 1))} className="w-7 h-7 rounded-full border border-[#C5C5C5] text-[#2D3035] hover:border-[#2D3035]">−</button>
        <span className="w-5 text-center text-sm">{value}</span>
        <button type="button" onClick={() => setValue(Math.min(max, value + 1))} className="w-7 h-7 rounded-full border border-[#C5C5C5] text-[#2D3035] hover:border-[#2D3035]">+</button>
      </div>
    </div>
  );
}

export default function HotelRoomsField({ onChange }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [rooms, setRooms] = useState([{ adults: 2, children: 0, infants: 0 }]);
  const containerRef = useRef(null);

  // Close the dropdown when clicking outside of it.
  useEffect(() => {
    if (!open) return;
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  const totalAdults = rooms.reduce((sum, r) => sum + r.adults, 0);
  const totalChildren = rooms.reduce((sum, r) => sum + r.children, 0);
  const totalInfants = rooms.reduce((sum, r) => sum + r.infants, 0);

  useEffect(() => {
    if (onChange) onChange({ adults: totalAdults, rooms: rooms.length, children: totalChildren, infants: totalInfants });
  }, [rooms]);

  const summaryParts = [`${rooms.length} ${t("search.rooms")}`, `${totalAdults} ${t("search.adults")}`];
  if (totalChildren > 0) summaryParts.push(`${totalChildren} ${t("search.children")}`);
  if (totalInfants > 0) summaryParts.push(`${totalInfants} ${t("search.infants")}`);
  const summary = summaryParts.join(" · ");

  const addRoom = () => {
    if (rooms.length >= 6) return;
    setRooms((prev) => [...prev, { adults: 2, children: 0, infants: 0 }]);
  };

  const removeRoom = (idx) => {
    setRooms((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateRoom = (idx, field, value) => {
    setRooms((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));
  };

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1 min-w-0 flex-1">
      <label className="text-[18px] font-medium text-[#5a5a5a]">{t("search.guests")}</label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between gap-2 px-3 h-12 rounded-lg bg-white border border-[#C5C5C5] focus:border-[#2D3035] transition-colors"
      >
        <span className="flex items-center gap-2 min-w-0">
          <Users className="w-4 h-4 text-[#7D7D7D] shrink-0" strokeWidth={1.5} />
          <span className="text-base text-[#2D3035] truncate">{summary}</span>
        </span>
        <ChevronDown className="w-4 h-4 text-[#7D7D7D] shrink-0" strokeWidth={1.5} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full mt-2 z-30 w-72 max-w-[calc(100vw-2rem)] p-4 rounded-xl bg-white border border-[#C5C5C5] shadow-horizon max-h-[70vh] overflow-y-auto"
          >
            {rooms.map((room, idx) => (
              <div key={idx} className={idx > 0 ? "mt-3 pt-3 border-t border-[#EAEAEA]" : ""}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-[#2D3035]">
                    {t("search.room")} {idx + 1}:
                  </span>
                  {rooms.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRoom(idx)}
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                      {t("search.removeRoom")}
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-2.5">
                  <Stepper
                    label={t("search.adults")}
                    hint={t("search.adultsHint")}
                    value={room.adults}
                    setValue={(v) => updateRoom(idx, "adults", v)}
                    min={1}
                    max={6}
                  />
                  <Stepper
                    label={t("search.children")}
                    hint={t("search.childrenHint")}
                    value={room.children}
                    setValue={(v) => updateRoom(idx, "children", v)}
                    min={0}
                    max={6}
                  />
                  <Stepper
                    label={t("search.infants")}
                    hint={t("search.infantsHint")}
                    value={room.infants}
                    setValue={(v) => updateRoom(idx, "infants", v)}
                    min={0}
                    max={4}
                  />
                </div>
              </div>
            ))}
            {rooms.length < 6 && (
              <button
                type="button"
                onClick={addRoom}
                className="flex items-center justify-center gap-1.5 w-full mt-3 py-2 rounded-lg border border-[#C5C5C5] text-sm text-[#2D3035] hover:border-[#2D3035] hover:bg-[#FAFAF8] transition-colors"
              >
                <Plus className="w-4 h-4" strokeWidth={1.5} />
                {t("search.addRoom")}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}