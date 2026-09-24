import React, { useState } from "react";
import { ChevronDown, Clock, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const STARS = ["none", "2", "3", "4", "5"];
const MEALS = ["ro", "bb", "hb", "fb", "ai"];

const CITIZENSHIPS = [
  { value: "IL", en: "Israel", he: "ישראל" },
  { value: "US", en: "United States", he: "ארצות הברית" },
  { value: "GB", en: "United Kingdom", he: "הממלכה המאוחדת" },
  { value: "FR", en: "France", he: "צרפת" },
  { value: "DE", en: "Germany", he: "גרמניה" },
  { value: "IT", en: "Italy", he: "איטליה" },
  { value: "ES", en: "Spain", he: "ספרד" },
  { value: "RU", en: "Russia", he: "רוסיה" },
  { value: "UA", en: "Ukraine", he: "אוקראינה" },
  { value: "AE", en: "United Arab Emirates", he: "איחוד האמירויות" },
  { value: "CA", en: "Canada", he: "קנדה" },
  { value: "AU", en: "Australia", he: "אוסטרליה" },
  { value: "NL", en: "Netherlands", he: "הולנד" },
  { value: "PL", en: "Poland", he: "פולין" },
  { value: "TR", en: "Turkey", he: "טורקיה" },
  { value: "GR", en: "Greece", he: "יוון" },
  { value: "PT", en: "Portugal", he: "פורטוגל" },
  { value: "CH", en: "Switzerland", he: "שוויץ" },
  { value: "AT", en: "Austria", he: "אוסטריה" },
  { value: "BE", en: "Belgium", he: "בלגיה" },
];

const TIMES = ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

function Chip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 h-9 rounded-lg text-sm font-medium border transition-colors whitespace-nowrap ${
        active ? "bg-[#2D3035] text-white border-[#2D3035]" : "bg-white text-[#2D3035] border-[#C5C5C5] hover:border-[#2D3035]"
      }`}
    >
      {label}
    </button>
  );
}

function Dropdown({ label, placeholder, value, onChange, options, icon: Icon }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex flex-col gap-1 min-w-0 flex-1">
      <label className="text-[11px] font-medium text-[#7D7D7D]">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between gap-2 px-3 h-12 rounded-lg bg-white border border-[#C5C5C5] focus:border-[#2D3035] transition-colors"
      >
        <span className="flex items-center gap-2 min-w-0">
          {Icon && <Icon className="w-4 h-4 text-[#7D7D7D] shrink-0" strokeWidth={1.5} />}
          <span className={`text-sm truncate ${value ? "text-[#2D3035]" : "text-[#9a9a9a]"}`}>{value || placeholder}</span>
        </span>
        <ChevronDown className="w-4 h-4 text-[#7D7D7D] shrink-0" strokeWidth={1.5} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1.5 z-30 w-full max-h-56 overflow-y-auto bg-white rounded-lg border border-[#C5C5C5] shadow-horizon">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-start px-3 py-2.5 text-sm hover:bg-[#FFFAD9] ${value === opt.value ? "bg-[#FFFAD9] font-medium" : ""}`}
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
  const { t, lang } = useI18n();
  const [citizenship, setCitizenship] = useState("");
  const [stars, setStars] = useState("");
  const [meal, setMeal] = useState("");
  const [earlyIn, setEarlyIn] = useState("");
  const [lateOut, setLateOut] = useState("");
  const [freeCancel, setFreeCancel] = useState(false);

  const citizenshipOptions = CITIZENSHIPS.map((c) => ({ value: c.value, label: lang === "he" ? c.he : c.en }));
  const timeOptions = TIMES.map((tm) => ({ value: tm, label: tm }));

  const citizenshipLabel = citizenship ? (CITIZENSHIPS.find((c) => c.value === citizenship) || {})[lang === "he" ? "he" : "en"] : "";

  return (
    <div className="flex flex-col gap-4 pt-3">
      {/* Row 1: citizenship + stars + meals */}
      <div className="flex flex-col gap-3">
        <Dropdown
          label={t("search.citizenship")}
          placeholder={t("search.citizenshipPlaceholder")}
          value={citizenshipLabel}
          onChange={setCitizenship}
          options={citizenshipOptions}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium text-[#7D7D7D]">{t("search.starRating")}</label>
          <div className="flex flex-wrap gap-2">
            {STARS.map((s) => (
              <Chip key={s} label={t(`search.stars.${s}`)} active={stars === s} onClick={() => setStars(stars === s ? "" : s)} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium text-[#7D7D7D]">{t("search.mealPlan")}</label>
          <div className="flex flex-wrap gap-2">
            {MEALS.map((m) => (
              <Chip key={m} label={t(`search.meal.${m}`)} active={meal === m} onClick={() => setMeal(meal === m ? "" : m)} />
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: early check-in + late check-out + free cancellation */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Dropdown
          label={t("search.earlyCheckin")}
          placeholder={t("search.selectTime")}
          value={earlyIn}
          onChange={setEarlyIn}
          options={timeOptions}
          icon={Clock}
        />
        <Dropdown
          label={t("search.lateCheckout")}
          placeholder={t("search.selectTime")}
          value={lateOut}
          onChange={setLateOut}
          options={timeOptions}
          icon={Clock}
        />
        <div className="flex flex-col gap-1 sm:self-end">
          <label className="text-[11px] font-medium text-[#7D7D7D] sm:sr-only">{t("search.freeCancellation")}</label>
          <button
            type="button"
            onClick={() => setFreeCancel((v) => !v)}
            className="flex items-center gap-2.5 h-12 px-3 rounded-lg bg-white border border-[#C5C5C5] hover:border-[#2D3035] transition-colors"
          >
            <span className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${freeCancel ? "bg-[#2D3035] border-[#2D3035]" : "border-[#C5C5C5]"}`}>
              {freeCancel && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
            </span>
            <span className="text-sm text-[#2D3035]">{t("search.freeCancellation")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}