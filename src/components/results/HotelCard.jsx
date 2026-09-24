import React from "react";
import { Star, MapPin, ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function HotelCard({ hotel }) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl border border-[#E5E5E5] shadow-sm hover:shadow-md transition-shadow">
      {hotel.image && (
        <div className="w-full sm:w-48 h-40 sm:h-32 rounded-lg overflow-hidden shrink-0 bg-[#F5F5F5]">
          <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" onError={(e) => { e.target.parentElement.style.display = "none"; }} />
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
          <div className="flex items-end gap-3">
            <div className="text-end">
              <div className="text-2xl font-bold text-[#2D3035]">${hotel.pricePerNight}</div>
              <div className="text-xs text-[#7D7D7D]">{t("results.perNight")}</div>
            </div>
            {hotel.url && (
              <a href={hotel.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 h-10 rounded-lg bg-[#F5D166] text-[#2D3035] font-bold text-sm hover:brightness-105 transition shrink-0">
                {t("results.viewDeal")}
                <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}