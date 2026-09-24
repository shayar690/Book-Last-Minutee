import React from "react";
import { Plane, ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function FlightCard({ flight }) {
  const { t } = useI18n();
  const stopsLabel = flight.stops === 0 ? t("results.direct") : `${flight.stops} ${t("results.stops")}`;
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl border border-[#E5E5E5] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base font-semibold text-[#2D3035]">{flight.airline}</span>
          {flight.flightNumber && <span className="text-sm text-[#7D7D7D]">{flight.flightNumber}</span>}
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="text-center shrink-0">
            <div className="text-xl font-bold text-[#2D3035]">{flight.departureTime}</div>
            <div className="text-sm text-[#7D7D7D]">{flight.departureAirport}</div>
          </div>
          <div className="flex-1 flex flex-col items-center min-w-0">
            <div className="text-xs text-[#7D7D7D] mb-1">{flight.duration}</div>
            <div className="flex items-center gap-1 w-full">
              <div className="h-px flex-1 bg-[#E5E5E5]"></div>
              <Plane className="w-4 h-4 text-[#7D7D7D] rotate-90 shrink-0" strokeWidth={1.5} />
              <div className="h-px flex-1 bg-[#E5E5E5]"></div>
            </div>
            <div className="text-xs text-[#7D7D7D] mt-1">{stopsLabel}</div>
          </div>
          <div className="text-center shrink-0">
            <div className="text-xl font-bold text-[#2D3035]">{flight.arrivalTime}</div>
            <div className="text-sm text-[#7D7D7D]">{flight.arrivalAirport}</div>
          </div>
        </div>
      </div>
      <div className="flex items-end justify-between sm:flex-col sm:items-end gap-2 sm:gap-1 sm:border-s sm:border-[#E5E5E5] sm:ps-4">
        <div className="text-end">
          <div className="text-2xl font-bold text-[#2D3035]">${flight.price}</div>
          <div className="text-xs text-[#7D7D7D]">{t("results.perPerson")}</div>
        </div>
        {flight.url && (
          <a href={flight.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 h-10 rounded-lg bg-[#F5D166] text-[#2D3035] font-bold text-sm hover:brightness-105 transition shrink-0">
            {t("results.viewDeal")}
            <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
          </a>
        )}
      </div>
    </div>
  );
}