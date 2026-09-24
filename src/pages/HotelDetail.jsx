import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Star, MapPin, ChevronLeft, ChevronRight, ExternalLink, Check, Clock, Quote, BedDouble, Users } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import ImageWithFallback from "@/components/results/ImageWithFallback";

export default function HotelDetail() {
  const { t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const hotel = location.state?.hotel;
  const scrollRef = useRef(null);
  const [activeImg, setActiveImg] = useState(0);
  const images = hotel?.images || (hotel?.image ? [hotel.image] : []);

  if (!hotel) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-[#7D7D7D] mb-4">{t("hotel.notFound")}</p>
          <button onClick={() => navigate("/")} className="inline-flex items-center gap-1.5 px-4 h-10 rounded-lg bg-[#F5D166] text-[#2D3035] font-bold text-sm">
            {t("hotel.searchAgain")}
          </button>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-[#7D7D7D] hover:text-[#2D3035] transition-colors mb-4">
          <ChevronLeft className="w-4 h-4 rtl:rotate-180" strokeWidth={1.5} />
          {t("hotel.backToResults")}
        </button>

        {/* Gallery */}
        {images.length > 0 && (
          <div className="relative rounded-xl overflow-hidden bg-[#F5F5F5] mb-4" style={{ height: "300px" }}>
            <div ref={scrollRef} onScroll={onScroll} className="flex overflow-x-auto snap-x snap-mandatory h-full scrollbar-hide">
              {images.map((img, i) => (
                <div key={i} className="w-full h-full shrink-0 snap-center">
                  <ImageWithFallback src={img} alt={`${hotel.name} ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            {images.length > 1 && (
              <>
                <button onClick={() => scroll(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 flex items-center justify-center shadow-md">
                  <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
                </button>
                <button onClick={() => scroll(1)} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 flex items-center justify-center shadow-md">
                  <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <span key={i} className={`w-2 h-2 rounded-full ${i === activeImg ? "bg-white" : "bg-white/50"}`} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-heading text-[#2D3035] mb-1">{hotel.name}</h1>
            {hotel.location && (
              <div className="flex items-center gap-1 text-sm text-[#7D7D7D]">
                <MapPin className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                <span>{hotel.location}</span>
                {hotel.distanceToCenter != null && <span>· {hotel.distanceToCenter} km {t("hotel.distanceFromCenter")}</span>}
              </div>
            )}
          </div>
          {hotel.stars > 0 && (
            <div className="flex items-center gap-0.5 shrink-0">
              {Array.from({ length: Math.min(hotel.stars, 5) }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-[#F5D166] fill-[#F5D166]" />
              ))}
            </div>
          )}
        </div>

        {/* Rating + Price */}
        <div className="flex items-center justify-between gap-4 p-4 bg-white rounded-xl border border-[#E5E5E5] mb-4">
          <div className="flex items-center gap-2">
            {hotel.rating > 0 && (
              <div className="flex items-center gap-1">
                <span className="px-2 py-1 rounded bg-[#2D3035] text-white text-sm font-bold">{Number(hotel.rating).toFixed(1)}</span>
                {hotel.reviews > 0 && <span className="text-xs text-[#7D7D7D]">{hotel.reviews} {t("results.reviews")}</span>}
              </div>
            )}
          </div>
          <div className="text-end">
            <div className="text-3xl font-bold text-[#2D3035]">${hotel.pricePerNight}</div>
            <div className="text-xs text-[#7D7D7D]">{t("results.perNight")}</div>
          </div>
        </div>

        {/* Description */}
        {(hotel.fullDescription || hotel.description) && (
          <div className="p-4 bg-white rounded-xl border border-[#E5E5E5] mb-4">
            <h2 className="text-lg font-semibold text-[#2D3035] mb-2">{t("hotel.about")}</h2>
            <p className="text-sm text-[#5a5a5a] leading-relaxed">{hotel.fullDescription || hotel.description}</p>
          </div>
        )}

        {/* Amenities */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="p-4 bg-white rounded-xl border border-[#E5E5E5] mb-4">
            <h2 className="text-lg font-semibold text-[#2D3035] mb-3">{t("hotel.amenities")}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {hotel.amenities.map((a, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-[#5a5a5a]">
                  <Check className="w-4 h-4 text-[#F5D166] shrink-0" strokeWidth={2} />
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Room Types */}
        {hotel.roomTypes && hotel.roomTypes.length > 0 && (
          <div className="p-4 bg-white rounded-xl border border-[#E5E5E5] mb-4">
            <h2 className="text-lg font-semibold text-[#2D3035] mb-3">{t("hotel.roomTypes")}</h2>
            <div className="flex flex-col gap-3">
              {hotel.roomTypes.map((room, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-3 p-3 rounded-lg border border-[#EAEAEA]">
                  {room.image && (
                    <div className="w-full sm:w-32 h-28 sm:h-24 rounded-lg overflow-hidden shrink-0 bg-[#F5F5F5]">
                      <ImageWithFallback src={room.image} alt={room.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[#2D3035]">{room.name}</h3>
                    {room.description && <p className="text-xs text-[#7D7D7D] mt-0.5 line-clamp-2">{room.description}</p>}
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      {room.beds && (
                        <span className="flex items-center gap-1 text-xs text-[#5a5a5a]">
                          <BedDouble className="w-3.5 h-3.5" strokeWidth={1.5} />
                          {room.beds}
                        </span>
                      )}
                      {room.maxGuests && (
                        <span className="flex items-center gap-1 text-xs text-[#5a5a5a]">
                          <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
                          {room.maxGuests} {t("hotel.maxGuests")}
                        </span>
                      )}
                      {room.pricePerNight && (
                        <span className="text-sm font-bold text-[#2D3035] ms-auto">${room.pricePerNight} <span className="text-xs font-normal text-[#7D7D7D]">{t("results.perNight")}</span></span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Guest Reviews */}
        {hotel.reviews && hotel.reviews.length > 0 && (
          <div className="p-4 bg-white rounded-xl border border-[#E5E5E5] mb-4">
            <h2 className="text-lg font-semibold text-[#2D3035] mb-3">{t("hotel.reviews")}</h2>
            <div className="flex flex-col gap-3">
              {hotel.reviews.map((review, i) => (
                <div key={i} className="p-3 rounded-lg bg-[#FAFAF8] border border-[#EAEAEA]">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#F5D166] flex items-center justify-center text-xs font-bold text-[#2D3035]">
                        {(review.author || "?").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#2D3035]">{review.author}</div>
                        {review.country && <div className="text-xs text-[#7D7D7D]">{review.country}</div>}
                      </div>
                    </div>
                    {review.rating > 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-[#2D3035] text-white text-xs font-bold">{Number(review.rating).toFixed(1)}</span>
                    )}
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Quote className="w-3.5 h-3.5 text-[#C5C5C5] shrink-0 mt-0.5" strokeWidth={1.5} />
                    <p className="text-sm text-[#5a5a5a] leading-relaxed">{review.text}</p>
                  </div>
                  {review.date && <div className="text-xs text-[#9a9a9a] mt-1.5">{review.date}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Check-in/out + Policies */}
        <div className="p-4 bg-white rounded-xl border border-[#E5E5E5] mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {hotel.checkInTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#7D7D7D]" strokeWidth={1.5} />
                <div>
                  <div className="text-xs text-[#7D7D7D]">{t("hotel.checkInTime")}</div>
                  <div className="text-sm text-[#2D3035]">{hotel.checkInTime}</div>
                </div>
              </div>
            )}
            {hotel.checkOutTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#7D7D7D]" strokeWidth={1.5} />
                <div>
                  <div className="text-xs text-[#7D7D7D]">{t("hotel.checkOutTime")}</div>
                  <div className="text-sm text-[#2D3035]">{hotel.checkOutTime}</div>
                </div>
              </div>
            )}
          </div>
          {hotel.policies && (
            <div className="mt-4 pt-4 border-t border-[#EAEAEA]">
              <h3 className="text-sm font-semibold text-[#2D3035] mb-1">{t("hotel.policies")}</h3>
              <p className="text-sm text-[#5a5a5a]">{hotel.policies}</p>
            </div>
          )}
        </div>

        {/* Book button */}
        {hotel.url && (
          <a href={hotel.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full h-12 rounded-lg bg-[#F5D166] text-[#2D3035] font-bold text-sm hover:brightness-105 transition">
            {t("hotel.bookNow")}
            <ExternalLink className="w-4 h-4" strokeWidth={2} />
          </a>
        )}
      </div>
    </div>
  );
}