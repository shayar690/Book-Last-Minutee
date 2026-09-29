import React, { useState } from "react";
import { Bed } from "lucide-react";

// Displays a hotel image, or a clean branded placeholder (Bed icon on a neutral
// background) when the URL is missing or fails to load. No generic/illustration
// fallback images — the user wants only real photos of the actual hotel.
export default function ImageWithFallback({ src, alt, className }) {
  const [error, setError] = useState(false);
  const showPlaceholder = !src || error;

  if (showPlaceholder) {
    return (
      <div className={`${className || ""} bg-[#F5F5F5] flex items-center justify-center`}>
        <Bed className="w-8 h-8 text-[#C5C5C5]" strokeWidth={1.5} />
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