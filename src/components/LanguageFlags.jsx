import React from "react";
import { useI18n } from "@/lib/i18n";

// Official proportions (160 x 220): white 15, blue 25, white 80, blue 25, white 15; Star of David centered.
const IsraelFlag = ({ className = "w-10 h-8" }) => (
  <svg viewBox="0 0 220 160" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
    <rect width="220" height="160" fill="#ffffff" />
    <rect width="220" height="25" y="15" fill="#0038b8" />
    <rect width="220" height="25" y="120" fill="#0038b8" />
    <path d="M110 50 L135.98 95 L84.02 95 Z" fill="none" stroke="#0038b8" strokeWidth="5.5" strokeLinejoin="miter" />
    <path d="M110 110 L84.02 65 L135.98 65 Z" fill="none" stroke="#0038b8" strokeWidth="5.5" strokeLinejoin="miter" />
  </svg>
);

const USAFlag = ({ className = "w-10 h-8" }) => (
  <svg viewBox="0 0 120 80" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
    <rect width="120" height="80" fill="#ffffff" />
    <rect width="120" height="8" fill="#b22234" />
    <rect width="120" height="8" y="16" fill="#b22234" />
    <rect width="120" height="8" y="32" fill="#b22234" />
    <rect width="120" height="8" y="48" fill="#b22234" />
    <rect width="120" height="8" y="64" fill="#b22234" />
    <rect width="50" height="40" fill="#3c3b6e" />
  </svg>
);

const base = "block rounded-lg overflow-hidden border-2 p-0 w-14 h-10 transition-all";
const active = "border-primary ring-2 ring-primary/30 scale-105";
const inactive = "border-border hover:border-primary/50";

export function LanguageFlagToggle() {
  const { lang, setLang } = useI18n();
  // dir="ltr" keeps USA fixed on the left and Israel fixed on the right in both languages.
  return (
    <div dir="ltr" className="flex items-center justify-center gap-3 mb-6">
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`${base} ${lang === "en" ? active : inactive}`}
        title="English"
        aria-label="English"
      >
        <USAFlag className="block w-full h-full" />
      </button>
      <button
        type="button"
        onClick={() => setLang("he")}
        className={`${base} ${lang === "he" ? active : inactive}`}
        title="עברית"
        aria-label="עברית"
      >
        <IsraelFlag className="block w-full h-full" />
      </button>
    </div>
  );
}