import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useI18n } from "@/lib/i18n";
import HotelCard from "@/components/results/HotelCard";

export default function HotelResults() {
  const { t, lang } = useI18n();
  const [searchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("popularity");

  const sortedHotels = useMemo(() => {
    const arr = [...hotels];
    switch (sortBy) {
      case "price_low_high": return arr.sort((a, b) => (a.pricePerNight || 0) - (b.pricePerNight || 0));
      case "price_high_low": return arr.sort((a, b) => (b.pricePerNight || 0) - (a.pricePerNight || 0));
      case "distance_center": return arr.sort((a, b) => (a.distanceToCenter || 999) - (b.distanceToCenter || 999));
      case "rating_high_low": return arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default: return arr;
    }
  }, [hotels, sortBy]);

  const destination = searchParams.get("destination") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const adults = searchParams.get("adults") || "2";
  const rooms = searchParams.get("rooms") || "1";

  useEffect(() => {
    if (!destination) { setLoading(false); return; }
    setLoading(true);
    base44.functions.invoke("hotelSearch", { destination, checkIn, checkOut, adults: Number(adults), rooms: Number(rooms), lang })
      .then((res) => {
        setHotels(res.data?.hotels || []);
        setError(res.data?.error || null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [destination, checkIn, checkOut, adults, rooms, lang]);

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-[#7D7D7D] hover:text-[#2D3035] transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" strokeWidth={1.5} />
          {t("results.backToSearch")}
        </Link>
        <h1 className="text-2xl font-heading text-[#2D3035] mb-1">
          {t("results.hotelsIn")} {destination}
        </h1>
        <p className="text-sm text-[#7D7D7D] mb-4">
          {checkIn} → {checkOut} · {adults} {t("results.adults")} · {rooms} {t("results.rooms")}
        </p>
        {hotels.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-[#7D7D7D]">{t("results.sortBy")}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 h-10 rounded-lg bg-white border border-[#C5C5C5] text-sm text-[#2D3035] outline-none focus:border-[#2D3035]"
            >
              <option value="popularity">{t("results.sort.popularity")}</option>
              <option value="price_low_high">{t("results.sort.priceLowHigh")}</option>
              <option value="price_high_low">{t("results.sort.priceHighLow")}</option>
              <option value="distance_center">{t("results.sort.distanceCenter")}</option>
              <option value="rating_high_low">{t("results.sort.ratingHighLow")}</option>
            </select>
          </div>
        )}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-[#F5D166] animate-spin" />
            <p className="text-sm text-[#7D7D7D]">{t("results.hotelsLoading")}</p>
          </div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-20">
            {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
            <p className="text-sm text-[#7D7D7D]">{t("results.noHotels")}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sortedHotels.map((hotel, i) => (
              <HotelCard key={i} hotel={hotel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}