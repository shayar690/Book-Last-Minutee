import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import ImageWithFallback from "@/components/results/ImageWithFallback";

export default function HotelCard({ hotel, searchContext }) {
  const { t, localePath } = useI18n();
  const navigate = useNavigate();
  const images = (hotel.images || (hotel.image ? [hotel.image] : [])).filter(Boolean);
  const sym = hotel.currency === "ILS" ? "₪" : "$";
  const n = images.length;
  const [activeImg, setActiveImg] = useState(0);
  const [noAnim, setNoAnim] = useState(false);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const moved = useRef(false);

  // Reset to the first image whenever the hotel changes.
  const hotelId = hotel.url || hotel.name;
  useEffect(() => { setActiveImg(0); }, [hotelId]);

  // Looping navigation: swiping/pressing past the last image wraps to the first,
  // and vice versa. Wraps jump instantly (no slide-through animation).
  const goTo = (raw) => {
    if (n <= 1) return;
    const target = ((raw % n) + n) % n;
    const wrap = (raw < 0 && activeImg === 0) || (raw >= n && activeImg === n - 1);
    if (wrap) {
      setNoAnim(true);
      setActiveImg(target);
      requestAnimationFrame(() => requestAnimationFrame(() => setNoAnim(false)));
    } else {
      setActiveImg(target);
    }
  };

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    moved.current = false;
  };
  const onTouchMove = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) moved.current = true;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      // Carousel is LTR: swipe left (dx<0) → next, swipe right (dx>0) → prev.
      goTo(activeImg + (dx < 0 ? 1 : -1));
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Don't navigate to the hotel page when the touch was a swipe, not a tap.
  const onClickCard = () => {
    if (moved.current) { moved.current = false; return; }
    navigate(localePath("/hotel"), { state: { hotel, searchContext } });
  };

  return (
    <div
      onClick={onClickCard}
      className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl border border-[#E5E5E5] shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="w-full sm:w-48 h-40 sm:h-32 rounded-lg overflow-hidden shrink-0 bg-[#F5F5F5] relative">
        {n > 0 ? (
          <>
            <div
              dir="ltr"
              className={`flex h-full ${noAnim ? "" : "transition-transform duration-300 ease-out"}`}
              style={{ transform: `translateX(-${activeImg * 100}%)` }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {images.map((img, i) => (
                <div key={i} className="w-full h-full shrink-0">
                  <ImageWithFallback src={img} alt={`${hotel.name} ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            {n > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); goTo(activeImg - 1); }} className="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
                  <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); goTo(activeImg + 1); }} className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
                  <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 items-center">
                  {images.map((_, i) => (
                    <span key={i} className={`rounded-full transition-all duration-200 ${i === activeImg ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"}`} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <ImageWithFallback src="" alt={hotel.name} className="w-full h-full" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-[#2D3035] truncate">{hotel.name}</h3>
            {hotel.location && (
              <div className="flex items-center gap-1 text-sm text-[#7D7D7D] mt-0.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
                <span className="truncate">{hotel.location}</span>
                {hotel.distanceToCenter != null && <span className="shrink-0">· {hotel.distanceToCenter} km</span>}
              </div>
            )}
          </div>
          {hotel.stars > 0 && (
            <div className="flex items-center gap-0.5 shrink-0">
              {Array.from({ length: Math.min(hotel.stars, 5) }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-[#F5D166] fill-[#F5D166]" />
              ))}
            </div>
          )}
        </div>
        {hotel.description && (
          <p className="text-sm text-[#5a5a5a] mt-2 line-clamp-2">{hotel.description}</p>
        )}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {hotel.amenities.slice(0, 5).map((a, i) => (
              <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-[#F5F5F0] text-[#5a5a5a]">{a}</span>
            ))}
          </div>
        )}
        <div className="flex items-end justify-between mt-3">
          <div className="flex items-center gap-2">
            {hotel.rating > 0 && (
              <div className="flex items-center gap-1">
                <span className="px-1.5 py-0.5 rounded bg-[#2D3035] text-white text-sm font-bold">{Number(hotel.rating).toFixed(1)}</span>
                {hotel.reviews > 0 && <span className="text-xs text-[#7D7D7D]">{hotel.reviews} {t("results.reviews")}</span>}
              </div>
            )}
          </div>
          <div className="text-end">
            <div className="text-2xl font-bold text-[#2D3035]">{sym}{hotel.pricePerNight}</div>
            <div className="text-xs text-[#7D7D7D]">{t("results.perNight")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}