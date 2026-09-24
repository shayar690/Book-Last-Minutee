import React, { useState, useEffect } from "react";
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
        <p className="text-sm text-[#7D7D7D] mb-6">
          {checkIn} → {checkOut} · {adults} {t("results.adults")} · {rooms} {t("results.rooms")}
        </p>
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
            {hotels.map((hotel, i) => (
              <HotelCard key={i} hotel={hotel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}