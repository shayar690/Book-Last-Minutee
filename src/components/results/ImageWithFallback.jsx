import React, { useState, useEffect } from "react";

// Displays a hotel photo. While the real photo is still loading (or if a URL
// fails), it shows an animated warm shimmer — a clear "loading" state rather
// than a dead gray box. No generic/illustration fallback images: only real
// photos of the actual hotel (sourced by the hotelImages function).
export default function ImageWithFallback({ src, alt, className }) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setError(false); setLoaded(false); }, [src]);
  const showShimmer = !src || error || !loaded;

  return (
    <div className={`${className || ""} relative overflow-hidden bg-[#F7F4EE]`}>
      {showShimmer && <div className="absolute inset-0 atlas-shimmer" />}
      {src && !error && (
        <img
          src={src}
          alt={alt}
          className={`relative w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          onError={() => setError(true)}
          onLoad={() => setLoaded(true)}
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      )}
    </div>
  );
}