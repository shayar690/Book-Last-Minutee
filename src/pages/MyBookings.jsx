import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bed, Plane, Bus, Car, Train, Calendar, Users, Search, ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useI18n } from "@/lib/i18n";

const SERVICE_ICON = { hotels: Bed, flights: Plane, transfers: Bus, cars: Car, trains: Train };

const STATUS_STYLE = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-rose-100 text-rose-800",
};

export default function MyBookings() {
  const { t, lang, localePath } = useI18n();
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    base44.entities.Booking.list("-created_date", 50)
      .then((data) => alive && setBookings(data))
      .catch((err) => alive && setError(err.message || "Error"));
    return () => { alive = false; };
  }, []);

  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { day: "numeric", month: "short", year: "numeric" }) : "—");

  return (
    <div className="pt-32 pb-24 min-h-screen bg-ether">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <h1 className="font-display text-4xl lg:text-5xl font-light text-ink">{t("bookings.title")}</h1>
        <p className="mt-3 text-muted-foreground">{t("bookings.subtitle")}</p>

        {error && <div className="mt-8 p-4 rounded-xl bg-destructive/10 text-destructive text-sm">{error}</div>}

        {bookings === null ? (
          <div className="mt-16 flex justify-center">
            <div className="w-8 h-8 border-4 border-mist border-t-ink rounded-full animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="mt-16 text-center max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-white border border-mist flex items-center justify-center mx-auto mb-5">
              <Search className="w-6 h-6 text-gold" strokeWidth={1.25} />
            </div>
            <p className="text-muted-foreground">{t("bookings.empty")}</p>
            <Link to={localePath("/")} className="mt-6 inline-flex items-center gap-2 px-6 h-11 rounded-xl gold-foil text-ink font-semibold text-sm">
              {t("bookings.emptyCta")}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          </div>
        ) : (
          <div className="mt-10 space-y-4">
            {bookings.map((b) => {
              const Icon = SERVICE_ICON[b.service] || Bed;
              return (
                <div key={b.id} className="bg-card rounded-2xl border border-mist shadow-horizon p-5 flex flex-col sm:flex-row sm:items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-ether flex items-center justify-center shrink-0 border border-mist">
                    <Icon className="w-5 h-5 text-gold" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display text-xl text-ink">{b.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[b.status] || ""}`}>{t(`bookings.status.${b.status}`)}</span>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">{b.destination}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground flex-wrap">
                      <span className="inline-flex items-center gap-1.5"><Calendar className="w-4 h-4" strokeWidth={1.5} />{fmtDate(b.check_in)} – {fmtDate(b.check_out)}</span>
                      {b.guests ? <span className="inline-flex items-center gap-1.5"><Users className="w-4 h-4" strokeWidth={1.5} />{b.guests} {t("bookings.guests")}</span> : null}
                      {b.reference ? <span className="text-[11px] uppercase tracking-luxe">{t("bookings.reference")}: {b.reference}</span> : null}
                    </div>
                  </div>
                  <div className="text-end shrink-0">
                    {b.total_price ? (
                      <p className="text-2xl font-semibold text-ink">{b.currency === "USD" ? "$" : ""}{b.total_price.toLocaleString()} <span className="text-sm text-muted-foreground font-normal">{b.currency !== "USD" ? b.currency : ""}</span></p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}