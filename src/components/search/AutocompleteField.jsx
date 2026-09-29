import React, { useState, useEffect, useRef } from "react";
import { MapPin, Loader2, Building2, Plane } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useI18n } from "@/lib/i18n";

export default function AutocompleteField({ label, placeholder, flex = false, filter, onSelect }) {
  const { lang } = useI18n();
  const [value, setValue] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef(null);
  const timer = useRef(null);
  const justSelected = useRef(false);

  useEffect(() => {
    if (justSelected.current) {
      justSelected.current = false;
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    if (value.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    timer.current = setTimeout(async () => {
      try {
        const res = await base44.functions.invoke("destinationSearch", { query: value, lang, filter });
        setResults(res.data?.results || []);
        setOpen(true);
        setActive(-1);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => timer.current && clearTimeout(timer.current);
  }, [value, lang]);

  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const pick = (r) => {
    justSelected.current = true;
    setValue(r.label.split(",").slice(0, 2).map((s) => s.trim()).join(", "));
    setOpen(false);
    setResults([]);
    if (onSelect) onSelect(r);
  };

  const onKey = (e) => {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter" && active >= 0) { e.preventDefault(); pick(results[active]); }
    else if (e.key === "Escape") setOpen(false);
  };

  return (
    <div ref={boxRef} className={`relative flex flex-col gap-1 min-w-0 ${flex ? "flex-[1.6]" : "flex-1"}`}>
      <label className="text-[18px] font-medium text-[#5a5a5a]">{label}</label>
      <div className="flex items-center gap-2 px-3 h-12 rounded-lg bg-white border border-[#C5C5C5] focus-within:border-[#2D3035] transition-colors">
        <MapPin className="w-4 h-4 text-[#7D7D7D] shrink-0" strokeWidth={1.5} />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          onKeyDown={onKey}
          placeholder={placeholder}
          className="bg-transparent outline-none w-full text-base text-[#2D3035] placeholder:text-[#9a9a9a]"
        />
        {loading && <Loader2 className="w-4 h-4 text-[#7D7D7D] animate-spin shrink-0" />}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-1.5 z-40 w-full max-w-full bg-white rounded-lg border border-[#C5C5C5] shadow-horizon overflow-hidden">
          {results.map((r, i) => {
            const parts = r.label.split(",");
            const primary = parts[0];
            const secondary = parts.slice(1).join(",").trim();
            const Icon = r.result_type === "hotel" ? Building2 : r.result_type === "airport" ? Plane : MapPin;
            return (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(r)}
                className={`w-full text-start px-3 py-2.5 flex items-start gap-2 transition-colors ${active === i ? "bg-[#FFFAD9]" : "hover:bg-[#FFFAD9]"}`}
              >
                <Icon className="w-4 h-4 text-[#7D7D7D] shrink-0 mt-0.5" strokeWidth={1.5} />
                <span className="min-w-0">
                  <span className="block text-base text-[#2D3035] truncate">{primary}</span>
                  {secondary && <span className="block text-[13px] text-[#7D7D7D] truncate">{secondary}</span>}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}