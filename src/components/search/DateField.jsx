import React from "react";
import { Calendar } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function DateField({ label, value, placeholder, active, onClick, flex = false }) {
  const { lang } = useI18n();
  const fmt = (d) =>
    d
      ? new Date(d).toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { day: "numeric", month: "short", year: "numeric" })
      : placeholder;
  return (
    <div className={`flex flex-col gap-1 min-w-0 ${flex ? "flex-[1.6]" : "flex-1"}`}>
      <label className="text-[11px] font-medium text-[#7D7D7D]">{label}</label>
      <button
        type="button"
        onClick={onClick}
        className={`flex items-center gap-2 px-3 h-12 rounded-lg bg-white border transition-colors ${active ? "border-[#2D3035]" : "border-[#C5C5C5] hover:border-[#2D3035]"}`}
      >
        <Calendar className="w-4 h-4 text-[#7D7D7D] shrink-0" strokeWidth={1.5} />
        <span className={`text-sm truncate ${value ? "text-[#2D3035]" : "text-[#9a9a9a]"}`}>{fmt(value)}</span>
      </button>
    </div>
  );
}