import React, { useState } from "react";
import { Hotel as HotelIcon } from "lucide-react";

// A reliable fallback image — always works in the browser
const FALLBACK = "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80";

export default function ImageWithFallback({ src, alt, className }) {
  const [error, setError] = useState(false);
  const [triedFallback, setTriedFallback] = useState(false);

  // Final fallback: show a styled placeholder with hotel icon
  if (error && triedFallback) {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#F5F5F0] to-[#E8E8E0] ${className || ""}`}>
        <HotelIcon className="w-8 h-8 text-[#C5C5C5]" strokeWidth={1} />
        <span className="text-[#9a9a9a] text-xs font-medium px-2 text-center line-clamp-2">{alt}</span>
      </div>
    );
  }

  // If the main src failed, try the fallback image
  const currentSrc = error ? FALLBACK : src;

  return (
    <img
      src={currentSrc || FALLBACK}
      alt={alt}
      className={className}
      onError={() => {
        if (!error) {
          setError(true);
        } else if (!triedFallback) {
          setTriedFallback(true);
        }
      }}
      loading="lazy"
    />
  );
}