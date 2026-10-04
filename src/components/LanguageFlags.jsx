import React from "react";
import { useI18n } from "@/lib/i18n";

const IsraelFlag = ({ className = "w-9 h-7" }) => (
  <svg viewBox="0 0 120 80" className={className} aria-hidden="true">
    <rect width="120" height="80" fill="#ffffff" />
    <rect width="120" height="12" fill="#0038b8" />
    <rect width="120" height="12" y="68" fill="#0038b8" />
    <path d="M60 18 L70 38 L50 38 Z" fill="none" stroke="#0038b8" strokeWidth="2.5" />
    <path d="M60 54 L50 38 L70 38 Z" fill="none" stroke="#0038b8" strokeWidth="2.5" />
  </svg>
);

const USAFlag = ({ className = "w-9 h-7" }) => (
  <svg viewBox="0 0 120 80" className={className} aria-hidden="true">
    <rect width="120" height="80" fill="#ffffff" />
    <rect width="120" height="8" fill="#b22234" />
    <rect width="120" height="8" y="16" fill="#b22234" />
    <rect width="120" height="8" y="32" fill="#b22234" />
    <rect width="120" height="8" y="48" fill="#b22234" />
    <rect width="120" height="8" y="64" fill="#b22234" />
    <rect width="50" height="40" fill="#3c3b6e" />
  </svg>
);

export function LanguageFlagToggle() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      <button
        type="button"
        onClick={() => setLang("he")}
        className={`rounded-lg overflow-hidden border-2 transition-all ${lang === "he" ? "border-primary shadow-sm scale-105" : "border-border opacity-60 hover:opacity-100"}`}
        title="עברית"
        aria-label="עברית"
      >
        <IsraelFlag />
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`rounded-lg overflow-hidden border-2 transition-all ${lang === "en" ? "border-primary shadow-sm scale-105" : "border-border opacity-60 hover:opacity-100"}`}
        title="English"
        aria-label="English"
      >
        <USAFlag />
      </button>
    </div>
  );
}