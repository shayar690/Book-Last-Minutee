import React, { useState } from "react";
import { Hotel as HotelIcon } from "lucide-react";

export default function ImageWithFallback({ src, alt, className }) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#F5F5F0] to-[#E8E8E0] ${className || ""}`}>
        <HotelIcon className="w-8 h-8 text-[#C5C5C5]" strokeWidth={1} />
        <span className="text-[#9a9a9a] text-xs font-medium px-2 text-center line-clamp-2">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}