import React from "react";

// Passport icon — a booklet with a national emblem and MRZ data lines.
// No SVG text (which rendered poorly); the shape alone reads as a passport.
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
      {/* National emblem — outer ring */}
      <circle cx="12" cy="7.5" r="2.5" />
      {/* National emblem — inner seal */}
      <circle cx="12" cy="7.5" r="0.9" fill="currentColor" stroke="none" />
      {/* Emblem rays */}
      <line x1="12" y1="4.3" x2="12" y2="4.9" strokeWidth="0.9" />
      <line x1="12" y1="10.1" x2="12" y2="10.7" strokeWidth="0.9" />
      <line x1="9.3" y1="7.5" x2="9.9" y2="7.5" strokeWidth="0.9" />
      <line x1="14.1" y1="7.5" x2="14.7" y2="7.5" strokeWidth="0.9" />
      {/* MRZ — machine readable zone lines */}
      <line x1="8" y1="12.5" x2="16" y2="12.5" strokeWidth="0.7" />
      <line x1="8" y1="14.5" x2="16" y2="14.5" strokeWidth="0.7" />
      <line x1="8" y1="16.5" x2="16" y2="16.5" strokeWidth="0.7" />
      <line x1="8" y1="18.5" x2="16" y2="18.5" strokeWidth="0.7" />
    </svg>
  );
}