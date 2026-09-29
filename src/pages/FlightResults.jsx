import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useI18n } from "@/lib/i18n";
import FlightCard from "@/components/results/FlightCard";

export default function FlightResults() {
  const { t, lang, localePath } = useI18n();
  const [searchParams] = useSearchParams();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const origin = searchParams.get("origin") || "";
  const destination = searchParams.get("destination") || "";
  const originCode = searchParams.get("originCode") || "";
  const destinationCode = searchParams.get("destinationCode") || "";
  const departureDate = searchParams.get("departureDate") || "";
  const returnDate = searchParams.get("returnDate") || "";
  const adults = searchParams.get("adults") || "1";

  useEffect(() => {
    if (!origin || !destination) { setLoading(false); return; }
    setLoading(true);
    base44.functions.invoke("flightSearch", { origin, originCode, destination, destinationCode, departureDate, returnDate, adults: Number(adults), lang })
      .then((res) => {
        setFlights(res.data?.flights || []);
        setError(res.data?.error || null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [origin, destination, departureDate, returnDate, adults, lang]);

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Link to={localePath("/")} className="inline-flex items-center gap-1.5 text-sm text-[#7D7D7D] hover:text-[#2D3035] transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" strokeWidth={1.5} />
          {t("results.backToSearch")}
        </Link>
        <h1 className="text-2xl font-heading text-[#2D3035] mb-1">
          {origin} → {destination}
        </h1>
        <p className="text-sm text-[#7D7D7D] mb-6">
          {departureDate}{returnDate ? ` → ${returnDate}` : ""} · {adults} {t("results.passengers")}
        </p>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-[#F5D166] animate-spin" />
            <p className="text-sm text-[#7D7D7D]">{t("results.flightsLoading")}</p>
          </div>
        ) : flights.length === 0 ? (
          <div className="text-center py-20">
            {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
            <p className="text-sm text-[#7D7D7D]">{t("results.noFlights")}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {flights.map((flight, i) => (
              <FlightCard key={i} flight={flight} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}