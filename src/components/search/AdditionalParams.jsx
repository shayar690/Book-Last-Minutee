import React, { useState } from "react";
import { ChevronDown, Clock, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import CitizenshipCombobox from "@/components/search/CitizenshipCombobox";

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
      className={`px-3.5 h-10 rounded-lg text-base font-medium border transition-colors whitespace-nowrap ${
        active ? "bg-[#2D3035] text-white border-[#2D3035]" : "bg-white text-[#2D3035] border-[#C5C5C5] hover:border-[#2D3035]"
      }`}
    >
      {label}
    </button>
  );
}

function Dropdown({ label, placeholder, value, onChange, options, icon: Icon, note }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-1 min-w-0 flex-1">
      <label className="text-[15px] font-medium text-[#5a5a5a]">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between gap-2 px-3 h-12 rounded-lg bg-white border border-[#C5C5C5] focus:border-[#2D3035] transition-colors"
      >
        <span className="flex items-center gap-2 min-w-0">
          {Icon && <Icon className="w-4 h-4 text-[#7D7D7D] shrink-0" strokeWidth={1.5} />}
          <span className={`text-base truncate ${value ? "text-[#2D3035]" : "text-[#9a9a9a]"}`}>{value || placeholder}</span>
        </span>
        <ChevronDown className="w-4 h-4 text-[#7D7D7D] shrink-0" strokeWidth={1.5} />
      </button>
      {note && <p className="text-[14px] leading-relaxed text-[#5a5a5a] mt-1 font-medium whitespace-pre-line">{note}</p>}
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1.5 z-30 w-full max-h-56 overflow-y-auto bg-white rounded-lg border border-[#C5C5C5] shadow-horizon">
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

export default function AdditionalParams() {
  const { t } = useI18n();
  const [citizenship, setCitizenship] = useState("");
  const [stars, setStars] = useState("");
  const [meal, setMeal] = useState("");
  const [earlyIn, setEarlyIn] = useState("");
  const [lateOut, setLateOut] = useState("");
  const [freeCancel, setFreeCancel] = useState(false);

  const earlyOptions = EARLY_TIMES.map((tm) => ({ value: tm, label: tm }));
  const lateOptions = LATE_TIMES.map((tm) => ({ value: tm, label: tm }));

  return (
    <div className="flex flex-col gap-4 pt-3">
      {/* Free cancellation — top, full width, green check aligned with text */}
      <button
        type="button"
        onClick={() => setFreeCancel((v) => !v)}
        className="flex items-center gap-2 h-12 px-4 rounded-lg bg-white border border-[#C5C5C5] hover:border-[#2D3035] transition-colors w-full sm:w-fit"
      >
        <span
          className="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors"
          style={{ backgroundColor: freeCancel ? GREEN : "transparent", borderColor: freeCancel ? GREEN : "#C5C5C5" }}
        >
          {freeCancel && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3.5} />}
        </span>
        <span className="text-base font-medium text-[#2D3035] leading-5 translate-y-[1px]">{t("search.freeCancellation")}</span>
      </button>

      {/* Citizenship — searchable combobox */}
      <CitizenshipCombobox
        label={t("search.citizenship")}
        placeholder={t("search.citizenshipPlaceholder")}
        value={citizenship}
        onChange={setCitizenship}
      />

      {/* Star rating */}
      <div className="flex flex-col gap-2">
        <label className="text-[15px] font-medium text-[#5a5a5a]">{t("search.starRating")}</label>
        <div className="flex flex-wrap gap-2">
          {STARS.map((s) => (
            <Chip key={s} label={t(`search.stars.${s}`)} active={stars === s} onClick={() => setStars(stars === s ? "" : s)} />
          ))}
        </div>
      </div>

      {/* Meal plan / pension basis */}
      <div className="flex flex-col gap-2">
        <label className="text-[15px] font-medium text-[#5a5a5a]">{t("search.mealPlan")}</label>
        <div className="flex flex-wrap gap-2">
          {MEALS.map((m) => (
            <Chip key={m} label={t(`search.meal.${m}`)} active={meal === m} onClick={() => setMeal(meal === m ? "" : m)} />
          ))}
        </div>
      </div>

      {/* Early check-in + Late check-out */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Dropdown
          label={t("search.earlyCheckin")}
          placeholder={t("search.selectTime")}
          value={earlyIn}
          onChange={setEarlyIn}
          options={earlyOptions}
          icon={Clock}
          note={t("search.requestOnlyNote")}
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
    </div>
  );
}