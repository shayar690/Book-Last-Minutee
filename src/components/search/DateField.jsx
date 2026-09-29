import React from "react";
import { Calendar } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function DateField({ label, value, placeholder, active, onClick, flex = false }) {
  const { lang } = useI18n();
  const fmt = (d) => {
    if (!d) return placeholder;
    const date = new Date(d);
    const locale = lang === "he" ? "he-IL" : "en-US";
    const weekday = date.toLocaleDateString(locale, { weekday: "long" });
    const rest = date.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
    // Hebrew weekday comes as "יום שלישי" — strip the "יום " prefix.
    const weekdayClean = lang === "he" ? weekday.replace("יום ", "") : weekday;
    return `${weekdayClean}, ${rest}`;
  };
  return (
    <div className={`flex flex-col gap-1 min-w-0 ${flex ? "flex-[1.6]" : "flex-1"}`}>
      <label className="text-[18px] font-medium text-[#5a5a5a]">{label}</label>
      <button
        type="button"
        onClick={onClick}
        className={`flex items-center gap-2 px-3 h-12 rounded-lg bg-white border transition-colors ${active ? "border-[#2D3035]" : "border-[#C5C5C5] hover:border-[#2D3035]"}`}
      >
        <Calendar className="w-4 h-4 text-[#7D7D7D] shrink-0" strokeWidth={1.5} />
        <span className={`text-base truncate ${value ? "text-[#2D3035]" : "text-[#9a9a9a]"}`}>{fmt(value)}</span>
      </button>
    </div>
  );
}