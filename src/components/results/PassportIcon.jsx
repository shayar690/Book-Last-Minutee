import React from "react";

// Custom passport icon — a booklet with emblem, "PASSPORT" text, and data lines.
export default function PassportIcon({ className, style, strokeWidth = 1.25 }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Passport booklet cover */}
      <rect x="5" y="2" width="14" height="20" rx="2" />
      {/* National emblem */}
      <circle cx="12" cy="7" r="1.8" />
      <circle cx="12" cy="7" r="0.4" fill="currentColor" stroke="none" />
      {/* "PASSPORT" text */}
      <text
        x="12"
        y="12.5"
        textAnchor="middle"
        fontSize="2.6"
        fill="currentColor"
        stroke="none"
        fontWeight="700"
        letterSpacing="0.3"
      >
        PASSPORT
      </text>
      {/* Data lines */}
      <line x1="9" y1="15.5" x2="15" y2="15.5" />
      <line x1="9.5" y1="17.5" x2="14.5" y2="17.5" />
      <line x1="10" y1="19.5" x2="14" y2="19.5" />
    </svg>
  );
}