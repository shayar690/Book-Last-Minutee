import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { COUNTRIES } from "@/lib/countries";

export default function CitizenshipCombobox({ label, placeholder, value, onChange }) {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const boxRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  const q = query.trim().toLowerCase();
  const filtered = COUNTRIES.filter((c) => {
    if (!q) return true;
    return c.en.toLowerCase().includes(q) || c.he.includes(query.trim()) || c.value.toLowerCase().includes(q);
  });

  const selected = COUNTRIES.find((c) => c.value === value);
  const displayLabel = selected ? (lang === "he" ? selected.he : selected.en) : "";

  const pick = (c) => {
    onChange(c.value);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={boxRef} className="relative flex flex-col gap-1 min-w-0 flex-1">
      <label className="text-[15px] font-medium text-[#5a5a5a]">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between gap-2 px-3 h-12 rounded-lg bg-white border border-[#C5C5C5] focus:border-[#2D3035] transition-colors"
      >
        <span className={`text-base truncate ${displayLabel ? "text-[#2D3035]" : "text-[#9a9a9a]"}`}>{displayLabel || placeholder}</span>
        <ChevronDown className="w-4 h-4 text-[#7D7D7D] shrink-0" strokeWidth={1.5} />
      </button>
      {open && (
        <div className="absolute top-full mt-1.5 z-40 w-full bg-white rounded-lg border border-[#C5C5C5] shadow-horizon overflow-hidden">
          <div className="flex items-center gap-2 px-3 h-11 border-b border-[#EAEAEA]">
            <Search className="w-4 h-4 text-[#7D7D7D] shrink-0" strokeWidth={1.5} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search.searchCitizenship")}
              className="bg-transparent outline-none w-full text-base text-[#2D3035] placeholder:text-[#9a9a9a]"
            />
          </div>
          <div className="max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-3 py-3 text-[15px] text-[#9a9a9a]">{t("search.noResults")}</div>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => pick(c)}
                  className={`w-full text-start px-3 py-2.5 text-base hover:bg-[#FFFAD9] ${value === c.value ? "bg-[#FFFAD9] font-medium" : ""}`}
                >
                  {lang === "he" ? c.he : c.en}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}