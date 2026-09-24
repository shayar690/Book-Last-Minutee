import React, { useState } from "react";
import { ChevronDown, Check, Plane } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const CABINS = ["economy", "business", "first"];
const BAGGAGE = ["cabinBag", "checkedBag"];
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

function CabinDropdown({ t, value, onChange }) {
  const [open, setOpen] = useState(false);
  const options = CABINS.map((c) => ({ value: c, label: t(`search.${c}`) }));
  return (
    <div className="relative flex flex-col gap-1 min-w-0 flex-1">
      <label className="text-[15px] font-medium text-[#5a5a5a]">{t("search.cabinClass")}</label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between gap-2 px-3 h-12 rounded-lg bg-white border border-[#C5C5C5] focus:border-[#2D3035] transition-colors"
      >
        <span className="flex items-center gap-2 min-w-0">
          <Plane className="w-4 h-4 text-[#7D7D7D] shrink-0" strokeWidth={1.5} />
          <span className={`text-base truncate ${value ? "text-[#2D3035]" : "text-[#9a9a9a]"}`}>{value ? t(`search.${value}`) : t("search.cabinClass")}</span>
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

export default function FlightsAdditionalParams() {
  const { t } = useI18n();
  const [cabin, setCabin] = useState("economy");
  const [directOnly, setDirectOnly] = useState(false);
  const [baggage, setBaggage] = useState([]);

  const toggleBag = (b) =>
    setBaggage((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]));

  return (
    <div className="flex flex-col gap-4 pt-3">
      {/* Direct flights only — toggle */}
      <button
        type="button"
        onClick={() => setDirectOnly((v) => !v)}
        className="flex items-center gap-3 h-12 px-4 rounded-lg bg-white border border-[#C5C5C5] hover:border-[#2D3035] transition-colors w-full sm:w-fit"
      >
        <span
          className="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors"
          style={{ backgroundColor: directOnly ? GREEN : "transparent", borderColor: directOnly ? GREEN : "#C5C5C5" }}
        >
          {directOnly && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3.5} />}
        </span>
        <span className="text-base font-medium text-[#2D3035] leading-5 translate-y-[1px]">{t("search.directOnly")}</span>
      </button>

      {/* Cabin class */}
      <CabinDropdown t={t} value={cabin} onChange={setCabin} />

      {/* Baggage — multi-select chips */}
      <div className="flex flex-col gap-2">
        <label className="text-[15px] font-medium text-[#5a5a5a]">{t("search.baggage")}</label>
        <div className="flex flex-wrap gap-2">
          {BAGGAGE.map((b) => (
            <Chip key={b} label={t(`search.${b}`)} active={baggage.includes(b)} onClick={() => toggleBag(b)} />
          ))}
        </div>
      </div>
    </div>
  );
}