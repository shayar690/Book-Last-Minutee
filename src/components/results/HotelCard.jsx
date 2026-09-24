import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function HotelCard({ hotel }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [activeImg, setActiveImg] = useState(0);
  const images = hotel.images || (hotel.image ? [hotel.image] : []);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const w = scrollRef.current.clientWidth;
    scrollRef.current.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  const onScroll = () => {
    if (!scrollRef.current) return;
    const idx = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
    setActiveImg(idx);
  };

  return (
    <div
      onClick={() => navigate("/hotel", { state: { hotel } })}
      className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl border border-[#E5E5E5] shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      {images.length > 0 && (
        <div className="w-full sm:w-48 h-40 sm:h-32 rounded-lg overflow-hidden shrink-0 bg-[#F5F5F5] relative">
          <div ref={scrollRef} onScroll={onScroll} className="flex overflow-x-auto snap-x snap-mandatory h-full scrollbar-hide">
            {images.map((img, i) => (
              <div key={i} className="w-full h-full shrink-0 snap-center">
                <img src={img} alt={`${hotel.name} ${i + 1}`} className="w-full h-full object-cover" onError={(e) => { e.target.parentElement.style.display = "none"; }} />
              </div>
            ))}
          </div>
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); scroll(-1); }} className="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
                <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); scroll(1); }} className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
                <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, i) => (
                  <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === activeImg ? "bg-white" : "bg-white/50"}`} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
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
            <div className="text-2xl font-bold text-[#2D3035]">${hotel.pricePerNight}</div>
            <div className="text-xs text-[#7D7D7D]">{t("results.perNight")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}