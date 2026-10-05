import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Shield, Search, Bed, Plane, Bus, Car, Train, Loader2, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useI18n } from "@/lib/i18n";
import BookingDetailModal from "@/components/admin/BookingDetailModal";
import BookingCard from "@/components/admin/BookingCard";

const SERVICE_ICON = { hotels: Bed, flights: Plane, transfers: Bus, cars: Car, trains: Train };

const STATUS_STYLE = {
  pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", label: "Pending" },
  confirmed: { bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-500", label: "Confirmed" },
  completed: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "Completed" },
  cancelled: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500", label: "Cancelled" },
};

export default function AdminBookings() {
  const { t, lang, localePath } = useI18n();
  const { user } = useAuth();
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const isAdmin = user?.role === "admin";

  const load = useCallback(async (reset = false) => {
    if (reset) { setLoading(true); setError(""); setCursor(null); setHasMore(true); }
    try {
      const opts = { sort: "-created_date", limit: 30 };
      if (!reset && cursor) opts.cursor = cursor;
      const page = await base44.entities.Booking.filter({}, opts);
      const items = page.items || [];
      setBookings((prev) => (reset ? items : [...(prev || []), ...items]));
      setCursor(page.next_cursor);
      setHasMore(!!page.has_more);
    } catch (err) {
      setError(err.message || "Error loading bookings");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [cursor]);

  useEffect(() => {
    if (isAdmin) load(true);
    else setLoading(false);
  }, [isAdmin]);

  // 2FA gate — admins must complete email verification each session.
  useEffect(() => {
    if (isAdmin && !sessionStorage.getItem("admin_2fa_ok")) {
      window.location.replace("/admin/verify");
    }
  }, [isAdmin]);

  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { day: "numeric", month: "short", year: "numeric" }) : "—");

  const filtered = useMemo(() => {
    let arr = bookings || [];
    if (statusFilter !== "all") arr = arr.filter((b) => b.status === statusFilter);
    if (serviceFilter !== "all") arr = arr.filter((b) => b.service === serviceFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      arr = arr.filter((b) =>
        (b.title || "").toLowerCase().includes(q) ||
        (b.guest_name || "").toLowerCase().includes(q) ||
        (b.guest_email || "").toLowerCase().includes(q) ||
        (b.reference || "").toLowerCase().includes(q) ||
        (b.destination || "").toLowerCase().includes(q)
      );
    }
    return arr;
  }, [bookings, statusFilter, serviceFilter, query]);

  const onUpdated = useCallback((updated) => {
    setBookings((prev) => (prev || []).map((b) => (b.id === updated.id ? { ...b, ...updated } : b)));
  }, []);

  const onDeleted = useCallback((id) => {
    setBookings((prev) => (prev || []).filter((b) => b.id !== id));
  }, []);

  if (!isAdmin) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" strokeWidth={1.25} />
          <h1 className="font-display text-2xl text-ink">{lang === "he" ? "גישה נדחתה" : "Access denied"}</h1>
          <p className="mt-2 text-muted-foreground">{lang === "he" ? "פאנל זה מיועד למנהלים בלבד." : "This panel is for administrators only."}</p>
          <Link to={localePath("/")} className="mt-6 inline-flex items-center gap-2 px-6 h-11 rounded-xl bg-ink text-white text-sm font-semibold">
            {lang === "he" ? "חזרה לדף הבית" : "Back to home"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#F7F8FA]">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="flex items-center gap-3 mb-1">
          <Shield className="w-7 h-7 text-gold" strokeWidth={1.5} />
          <h1 className="font-display text-3xl font-light text-ink">{lang === "he" ? "ניהול הזמנות" : "Bookings management"}</h1>
        </div>
        <p className="text-muted-foreground text-sm mb-6">{lang === "he" ? "צפייה, עריכה וניהול מלא של כל הזמנות הלקוחות." : "View, edit and manage all customer bookings."}</p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={lang === "he" ? "חיפוש לפי שם מלון, אורח, אימייל, מספר הזמנה..." : "Search by hotel, guest, email, reference..."}
              className="w-full h-11 ps-10 pe-4 rounded-xl bg-white border border-mist text-sm outline-none focus:border-ink transition"
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-11 px-3 rounded-xl bg-white border border-mist text-sm outline-none focus:border-ink">
            <option value="all">{lang === "he" ? "כל הסטטוסים" : "All statuses"}</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className="h-11 px-3 rounded-xl bg-white border border-mist text-sm outline-none focus:border-ink">
            <option value="all">{lang === "he" ? "כל השירותים" : "All services"}</option>
            <option value="hotels">Hotels</option>
            <option value="flights">Flights</option>
            <option value="transfers">Transfers</option>
            <option value="cars">Cars</option>
            <option value="trains">Trains</option>
          </select>
        </div>

        {error && <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-sm">{error}</div>}

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-7 h-7 text-gold animate-spin" /></div>
        ) : (filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-sm">{lang === "he" ? "אין הזמנות להצגה." : "No bookings found."}</div>
        ) : (
          <>
            {/* Mobile card list */}
            <div className="md:hidden space-y-3">
              {filtered.map((b) => (
                <BookingCard key={b.id} booking={b} lang={lang} onClick={() => setSelected(b)} />
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block bg-white rounded-2xl border border-mist overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#F7F8FA] text-muted-foreground">
                  <tr className="text-start">
                    <th className="text-start font-medium px-4 py-3">{lang === "he" ? "שירות" : "Service"}</th>
                    <th className="text-start font-medium px-4 py-3">{lang === "he" ? "פרטים" : "Details"}</th>
                    <th className="text-start font-medium px-4 py-3 hidden md:table-cell">{lang === "he" ? "אורח" : "Guest"}</th>
                    <th className="text-start font-medium px-4 py-3 hidden lg:table-cell">Dates</th>
                    <th className="text-start font-medium px-4 py-3">{lang === "he" ? "סטטוס" : "Status"}</th>
                    <th className="text-end font-medium px-4 py-3">{lang === "he" ? "מחיר" : "Total"}</th>
                    <th className="px-2 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => {
                    const Icon = SERVICE_ICON[b.service] || Bed;
                    const st = STATUS_STYLE[b.status] || STATUS_STYLE.pending;
                    return (
                      <tr key={b.id} onClick={() => setSelected(b)} className="border-t border-mist hover:bg-[#FAFBFC] cursor-pointer transition">
                        <td className="px-4 py-3">
                          <div className="w-9 h-9 rounded-lg bg-ether border border-mist flex items-center justify-center">
                            <Icon className="w-4 h-4 text-gold" strokeWidth={1.5} />
                          </div>
                        </td>
                        <td className="px-4 py-3 min-w-0">
                          <div className="font-medium text-ink truncate max-w-[220px]">{b.title || "—"}</div>
                          <div className="text-xs text-muted-foreground truncate">{b.destination}{b.city ? `, ${b.city}` : ""}</div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <div className="text-ink truncate max-w-[160px]">{b.guest_name || "—"}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[160px]">{b.guest_email || ""}</div>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground whitespace-nowrap">{fmtDate(b.check_in)} – {fmtDate(b.check_out)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${st.bg} ${st.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                            {st.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-end font-semibold text-ink whitespace-nowrap">
                          {b.total_price ? `${b.currency === "ILS" ? "₪" : "$"}${Number(b.total_price).toLocaleString()}` : "—"}
                        </td>
                        <td className="px-2 py-3 text-end text-muted-foreground"><ChevronRight className="w-4 h-4 rtl:rotate-180 inline" strokeWidth={1.5} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {hasMore && (
              <div className="flex justify-center mt-6">
                <button onClick={() => { setLoadingMore(true); load(false); }} disabled={loadingMore} className="px-6 h-11 rounded-xl bg-ink text-white text-sm font-medium hover:bg-ink/90 transition disabled:opacity-50">
                  {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : (lang === "he" ? "טען עוד" : "Load more")}
                </button>
              </div>
            )}
          </>
        ))}
      </div>

      {selected && (
        <BookingDetailModal
          booking={selected}
          lang={lang}
          onClose={() => setSelected(null)}
          onUpdated={onUpdated}
          onDeleted={onDeleted}
        />
      )}
    </div>
  );
}