import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Clock, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const STARS = ["none", "2", "3", "4", "5"];
const MEALS = ["ro", "bb", "hb", "fb", "ai"];

// Early check-in: 01:00 – 13:00 in 30-minute steps
const EARLY_TIMES = [];
for (let h = 1; h <= 13; h++) {
  EARLY_TIMES.push(`${String(h).padStart(2, "0")}:00`);
  if (h < 13) EARLY_TIMES.push(`${String(h).padStart(2, "0")}:30`);
}
// Late check-out: 12:00 – 23:30 in 30-minute steps
const LATE_TIMES = [];
for (let h = 12; h <= 23; h++) {
  LATE_TIMES.push(`${String(h).padStart(2, "0")}:00`);
  LATE_TIMES.push(`${String(h).padStart(2, "0")}:30`);
}

const GREEN = "#16a34a";

function Chip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 text-center px-1 sm:px-2.5 h-10 rounded-lg text-[13px] sm:text-[15px] font-medium border transition-colors whitespace-nowrap ${
        active ? "bg-[#2D3035] text-white border-[#2D3035]" : "bg-white text-[#2D3035] border-[#C5C5C5] hover:border-[#2D3035]"
      }`}
    >
      {label}
    </button>
  );
}

function Dropdown({ label, placeholder, value, onChange, options, icon: Icon, note }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });

  const toggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 6, left: rect.left, width: rect.width });
    }
    setOpen((v) => !v);
  };

  return (
    <div className="flex flex-col gap-1 min-w-0 flex-1">
      <label className="text-[18px] font-medium text-[#5a5a5a]">{label}</label>
      <div className="relative">
        <button
          ref={btnRef}
          type="button"
          onClick={toggle}
          className="flex items-center justify-between gap-2 w-full px-3 h-12 rounded-lg bg-white border border-[#C5C5C5] focus:border-[#2D3035] transition-colors"
        >
          <span className="flex items-center gap-2 min-w-0">
            {Icon && <Icon className="w-4 h-4 text-[#7D7D7D] shrink-0" strokeWidth={1.5} />}
            <span className={`text-base truncate ${value ? "text-[#2D3035]" : "text-[#9a9a9a]"}`}>{value || placeholder}</span>
          </span>
          <ChevronDown className="w-4 h-4 text-[#7D7D7D] shrink-0" strokeWidth={1.5} />
        </button>
      </div>
      {note && <p className="text-[14px] leading-relaxed text-[#5a5a5a] mt-1 font-medium whitespace-pre-line">{note}</p>}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            style={{ position: "fixed", top: menuPos.top, left: menuPos.left, width: menuPos.width }}
            className="z-50 h-56 overflow-y-auto bg-white rounded-lg border border-[#C5C5C5] shadow-horizon"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-start px-3 py-2.5 text-base hover:bg-[#FFFAD9] ${value === opt.value ? "bg-[#FFFAD9] font-medium" : ""}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function AdditionalParams({ onChange }) {
  const { t } = useI18n();
  const [stars, setStars] = useState([]);
  const [meal, setMeal] = useState([]);
  const [earlyIn, setEarlyIn] = useState("");
  const [lateOut, setLateOut] = useState("");
  const [freeCancel, setFreeCancel] = useState(false);

  useEffect(() => {
    if (onChange) onChange({ stars, meal, earlyIn, lateOut, freeCancel });
  }, [stars, meal, earlyIn, lateOut, freeCancel, onChange]);

  const earlyOptions = EARLY_TIMES.map((tm) => ({ value: tm, label: tm }));
  const lateOptions = LATE_TIMES.map((tm) => ({ value: tm, label: tm }));

  return (
    <div className="flex flex-col gap-3 pt-3">
      {/* Free cancellation + Meal plan + Star rating — one row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-start">
        {/* Free cancellation */}
        <div className="flex flex-col gap-1.5 min-w-0 sm:mt-8 flex-[0.7]">
          <button
            type="button"
            onClick={() => setFreeCancel((v) => !v)}
            className="flex items-center gap-2 h-12 px-4 rounded-lg bg-white border border-[#C5C5C5] hover:border-[#2D3035] transition-colors w-auto sm:w-full"
          >
            <span
              className="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors"
              style={{ backgroundColor: freeCancel ? GREEN : "transparent", borderColor: freeCancel ? GREEN : "#C5C5C5" }}
            >
              {freeCancel && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3.5} />}
            </span>
            <span className="text-base font-medium text-[#2D3035] leading-5 translate-y-[1px]">{t("search.freeCancellation")}</span>
          </button>
        </div>
        {/* Meal plan */}
        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          <label className="text-[18px] font-medium text-[#5a5a5a]">{t("search.mealPlan")}</label>
          <div className="flex flex-nowrap justify-start gap-0.5 sm:gap-1.5">
            {MEALS.map((m) => (
              <Chip key={m} label={t(`search.meal.${m}`)} active={meal.includes(m)} onClick={() => setMeal(meal.includes(m) ? meal.filter((x) => x !== m) : [...meal, m])} />
            ))}
          </div>
        </div>
        {/* Star rating */}
        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          <label className="text-[18px] font-medium text-[#5a5a5a]">{t("search.starRating")}</label>
          <div className="flex flex-nowrap justify-start gap-0.5 sm:gap-1.5">
            {STARS.map((s) => (
              <Chip key={s} label={t(`search.stars.${s}`)} active={stars.includes(s)} onClick={() => setStars(stars.includes(s) ? stars.filter((x) => x !== s) : [...stars, s])} />
            ))}
          </div>
        </div>
      </div>

      {/* Early check-in + Late check-out — one row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Dropdown
          label={t("search.earlyCheckin")}
          placeholder={t("search.selectTime")}
          value={earlyIn}
          onChange={setEarlyIn}
          options={earlyOptions}
          icon={Clock}
        />
        <Dropdown
          label={t("search.lateCheckout")}
          placeholder={t("search.selectTime")}
          value={lateOut}
          onChange={setLateOut}
          options={lateOptions}
          icon={Clock}
        />
      </div>

      <p className="text-[16px] leading-relaxed text-[#5a5a5a] font-medium whitespace-pre-line -mt-1.5">{t("search.requestOnlyNote")}</p>
    </div>
  );
}