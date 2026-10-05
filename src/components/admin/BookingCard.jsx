import React from "react";
import { Bed, Plane, Bus, Car, Train, Check, X, Calendar, ShieldCheck } from "lucide-react";

const SERVICE_ICON = { hotels: Bed, flights: Plane, transfers: Bus, cars: Car, trains: Train };

const STATUS = {
  pending: { icon: Calendar, color: "text-amber-600", bg: "bg-amber-50", label: { he: "הזמנה בהמתנה", en: "Pending booking" } },
  confirmed: { icon: Check, color: "text-emerald-600", bg: "bg-emerald-50", label: { he: "הזמנה מאושרת", en: "Successful booking" } },
  completed: { icon: Check, color: "text-emerald-600", bg: "bg-emerald-50", label: { he: "הזמנה הושלמה", en: "Completed booking" } },
  cancelled: { icon: X, color: "text-rose-600", bg: "bg-rose-50", label: { he: "הזמנה בוטלה", en: "Canceled booking" } },
};

const fmtDate = (d, lang) =>
  d ? new Date(d).toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function BookingCard({ booking: b, lang, onClick }) {
  const he = lang === "he";
  const Icon = SERVICE_ICON[b.service] || Bed;
  const st = STATUS[b.status] || STATUS.pending;
  const StatusIcon = st.icon;
  const active = b.status !== "cancelled";
  const price = b.total_price ? `${b.currency === "ILS" ? "₪" : "US$"}${Number(b.total_price).toLocaleString()}` : "—";
  const names = (b.guest_name || "").split(/\s*,\s*|\s*;\s*/).filter(Boolean);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-[#ECEEF1] p-4 shadow-sm active:bg-gray-50 transition cursor-pointer"
    >
      {/* Header: guest names + service icon */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          {names.length > 0 ? (
            names.map((n, i) => (
              <div key={i} className="font-semibold text-[15px] text-ink leading-tight truncate">{n}</div>
            ))
          ) : (
            <div className="font-semibold text-[15px] text-ink leading-tight">{b.guest_email || "—"}</div>
          )}
        </div>
        <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${active ? "bg-gold/15" : "bg-gray-100"}`}>
          <Icon className={`w-5 h-5 ${active ? "text-gold" : "text-gray-400"}`} strokeWidth={1.5} />
        </div>
      </div>

      {/* Booking reference */}
      {b.reference && (
        <div className="text-sm text-sky-600 font-medium mb-2">№ {b.reference}</div>
      )}

      {/* Status badge */}
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${st.bg} ${st.color} mb-3`}>
        <StatusIcon className="w-3.5 h-3.5" strokeWidth={2} />
        {he ? st.label.he : st.label.en}
      </div>

      {/* Hotel / destination */}
      <div className="mb-3">
        {b.destination && (
          <div className="text-xs text-muted-foreground">{b.destination}{b.city ? `, ${b.city}` : ""}</div>
        )}
        <div className="font-semibold text-ink text-sm leading-snug">{b.title || "—"}</div>
      </div>

      {/* Room details */}
      {b.room_type && (
        <div className="text-xs text-muted-foreground leading-relaxed mb-3">
          {b.room_type}{b.meal ? `. ${b.meal}` : ""}
        </div>
      )}

      {/* Dates */}
      {(b.check_in || b.check_out) && (
        <div className="text-xs text-ink mb-2">
          {fmtDate(b.check_in, lang)} — {fmtDate(b.check_out, lang)}
          {b.nights ? `, ${b.nights} ${he ? "לילות" : "nights"}` : ""}
        </div>
      )}

      {/* Cancellation */}
      {b.free_cancellation && b.cancellation_date && (
        <div className="text-xs text-emerald-600 mb-3">
          {he ? "ביטול חינם עד " : "Free cancellation before "}{fmtDate(b.cancellation_date, lang)}
        </div>
      )}

      {/* Payment */}
      <div className="pt-3 border-t border-[#F0F1F3]">
        {b.status === "cancelled" ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">{he ? "תשלום לא-מזומן" : "Non-cash payment"}</div>
              <div className="text-xs text-emerald-600 font-medium mt-0.5">{he ? "החזר הושלם" : "Refund complete"}</div>
            </div>
            <div className="text-lg font-bold text-ink">{price}</div>
          </div>
        ) : (
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs text-muted-foreground">{he ? "סכום לתשלום" : "Amount due"}</div>
              {b.payment_due && (
                <div className="text-xs text-muted-foreground mt-0.5">
                  {he ? "תשלום עד " : "Pay before "}{fmtDate(b.payment_due, lang)}
                </div>
              )}
            </div>
            <div className="text-xl font-bold text-ink">{price}</div>
          </div>
        )}
      </div>
    </div>
  );
}