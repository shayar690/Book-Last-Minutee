import React from "react";
import { useI18n } from "@/lib/i18n";

// Official proportions (160 x 220): white 15, blue 25, white 80, blue 25, white 15; Star of David centered.
const IsraelFlag = ({ className }) => (
  <svg viewBox="0 0 220 160" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
    <rect width="220" height="160" fill="#ffffff" />
    <rect width="220" height="25" y="15" fill="#0038b8" />
    <rect width="220" height="25" y="120" fill="#0038b8" />
    <path d="M110 50 L135.98 95 L84.02 95 Z" fill="none" stroke="#0038b8" strokeWidth="5.5" />
    <path d="M110 110 L84.02 65 L135.98 65 Z" fill="none" stroke="#0038b8" strokeWidth="5.5" />
  </svg>
);

// US flag on official 190 x 100 proportions: 13 stripes, canton with 50 stars (9 rows of 6/5).
const STRIPE = 100 / 13;
const STAR_POINTS = Array.from({ length: 10 }, (_, i) => {
  const r = i % 2 === 0 ? 3.08 : 3.08 * 0.382;
  const a = (Math.PI / 180) * (-90 + 36 * i);
  return `${(r * Math.cos(a)).toFixed(3)},${(r * Math.sin(a)).toFixed(3)}`;
}).join(" ");
const STARS = Array.from({ length: 9 }).flatMap((_, row) =>
  (row % 2 === 0 ? [1, 3, 5, 7, 9, 11] : [2, 4, 6, 8, 10]).map((col) => [col * 6.3, (row + 1) * 5.385])
);

const USAFlag = ({ className }) => (
  <svg viewBox="0 0 190 100" preserveAspectRatio="xMinYMid slice" className={className} aria-hidden="true">
    <rect width="190" height="100" fill="#ffffff" />
    {[0, 2, 4, 6, 8, 10, 12].map((i) => (
      <rect key={i} width="190" height={STRIPE} y={i * STRIPE} fill="#b22234" />
    ))}
    <rect width="76" height={STRIPE * 7} fill="#3c3b6e" />
    {STARS.map(([x, y]) => (
      <polygon key={`${x}-${y}`} points={STAR_POINTS} transform={`translate(${x} ${y})`} fill="#ffffff" />
    ))}
  </svg>
);

const base = "block shrink-0 rounded-lg overflow-hidden border-2 p-0 w-14 h-10 transition-colors";
const active = "border-primary ring-2 ring-primary/30";
const inactive = "border-border hover:border-primary/50";

export function LanguageFlagToggle() {
  const { lang, setLang } = useI18n();
  // Fixed LTR order: USA always on the left, Israel always on the right — no movement on click.
  return (
    <div dir="ltr" className="flex flex-row items-center justify-center gap-3 mb-6">
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