import React, { useState, useEffect } from "react";

// Displays a hotel photo. While the real photo is still loading (or if a URL
// fails), it shows an animated warm shimmer — a clear "loading" state rather
// than a dead gray box. No generic/illustration fallback images: only real
// photos of the actual hotel (sourced by the hotelImages function).
export default function ImageWithFallback({ src, alt, className, settled }) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setError(false); setLoaded(false); }, [src]);
  // No image at all: a static placeholder once we've given up (settled), or an
  // animated shimmer while still searching.
  const noImage = !src && settled;

  return (
    <div className={`${className || ""} relative overflow-hidden bg-[#F7F4EE] flex items-center justify-center`}>
      {noImage ? (
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#D8CFBE]" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M3 18v-7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7M3 18h14M3 18l-1 2M17 18l1 2M7 9V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <>
          {(!src || error || !loaded) && <div className="absolute inset-0 atlas-shimmer" />}
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
        </>
      )}
    </div>
  );
}