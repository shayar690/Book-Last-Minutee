import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Bed, Plane, Bus, Car, Train, Check, X, Calendar, Pencil, Save,
  Ban, Mail, FileText, Loader2, RotateCcw, ShieldCheck, MapPin, Clock,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/use-toast";

const SERVICE_ICON = { hotels: Bed, flights: Plane, transfers: Bus, cars: Car, trains: Train };

const STATUS = {
  pending: { icon: Calendar, color: "text-amber-600", bg: "bg-amber-50", ring: "text-amber-500", label: { he: "הזמנה בהמתנה", en: "Pending booking" } },
  confirmed: { icon: Check, color: "text-emerald-600", bg: "bg-emerald-50", ring: "text-emerald-500", label: { he: "הזמנה מאושרת", en: "Successful booking" } },
  completed: { icon: Check, color: "text-emerald-600", bg: "bg-emerald-50", ring: "text-emerald-500", label: { he: "הזמנה הושלמה", en: "Completed booking" } },
  cancelled: { icon: X, color: "text-rose-600", bg: "bg-rose-50", ring: "text-rose-500", label: { he: "הזמנה בוטלה", en: "Canceled booking" } },
};

const fmt = (d, lang) =>
  d ? new Date(d).toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function AdminBookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const { toast } = useToast();
  const he = lang === "he";

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [emailBusy, setEmailBusy] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!isAdmin) { setLoading(false); return; }
    (async () => {
      try {
        const b = await base44.entities.Booking.get(id);
        setBooking(b);
      } catch (err) {
        setError(err.message || "Error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isAdmin]);

  // 2FA gate
  useEffect(() => {
    if (isAdmin && !sessionStorage.getItem("admin_2fa_ok")) {
      window.location.replace("/admin/verify");
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center text-center">
        <p className="text-muted-foreground">{he ? "גישה נדחתה" : "Access denied"}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex justify-center">
        <Loader2 className="w-7 h-7 text-gold animate-spin" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="pt-32 pb-24 min-h-screen text-center">
        <p className="text-rose-600 mb-4">{error || (he ? "הזמנה לא נמצאה" : "Booking not found")}</p>
        <button onClick={() => navigate("/admin")} className="px-6 h-11 rounded-xl bg-ink text-white text-sm font-medium">
          {he ? "חזרה לרשימה" : "Back to list"}
        </button>
      </div>
    );
  }

  const st = STATUS[booking.status] || STATUS.pending;
  const StatusIcon = st.icon;
  const Icon = SERVICE_ICON[booking.service] || Bed;
  const active = booking.status !== "cancelled";
  const sym = booking.currency === "ILS" ? "₪" : "US$";
  const money = (v) => (v != null && v !== "" ? `${sym}${Number(v).toLocaleString()}` : "—");
  const names = (booking.guest_name || "").split(/\s*,\s*|\s*;\s*/).filter(Boolean);

  const startEdit = () => {
    setForm({
      title: booking.title || "", destination: booking.destination || "", city: booking.city || "",
      check_in: booking.check_in || "", check_out: booking.check_out || "",
      guest_name: booking.guest_name || "", guest_email: booking.guest_email || "",
      adults: booking.adults ?? "", children: booking.children ?? "", rooms: booking.rooms ?? "",
      nights: booking.nights ?? "", total_price: booking.total_price ?? "", daily_rate: booking.daily_rate ?? "",
      currency: booking.currency || "USD", room_type: booking.room_type || "", meal: booking.meal || "",
      free_cancellation: booking.free_cancellation ? "1" : "", cancellation_date: booking.cancellation_date || "",
      payment_due: booking.payment_due || "", paid: booking.paid ? "1" : "", paid_on: booking.paid_on || "",
      payment_type: booking.payment_type || "", supplier_id: booking.supplier_id || "",
      invoice_id: booking.invoice_id || "", reference: booking.reference || "",
      status: booking.status || "pending", details: booking.details || "",
    });
    setEditMode(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const num = (v) => (v === "" || v == null ? undefined : Number(v));
      const payload = {
        ...form,
        adults: num(form.adults), children: num(form.children), rooms: num(form.rooms),
        nights: num(form.nights), total_price: num(form.total_price), daily_rate: num(form.daily_rate),
        free_cancellation: form.free_cancellation === "1", paid: form.paid === "1",
      };
      const updated = await base44.entities.Booking.update(booking.id, payload);
      setBooking(updated);
      setEditMode(false);
      toast({ title: he ? "ההזמנה עודכנה" : "Booking updated" });
    } catch (err) {
      toast({ title: err.message || "Error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const cancelBooking = async () => {
    setSaving(true);
    try {
      const updated = await base44.entities.Booking.update(booking.id, { status: "cancelled" });
      setBooking(updated);
      setConfirmCancel(false);
      toast({ title: he ? "ההזמנה בוטלה" : "Booking cancelled" });
    } catch (err) {
      toast({ title: err.message || "Error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const restore = async () => {
    setSaving(true);
    try {
      const updated = await base44.entities.Booking.update(booking.id, { status: "pending" });
      setBooking(updated);
      toast({ title: he ? "ההזמנה שוחזרה" : "Booking restored" });
    } catch (err) {
      toast({ title: err.message || "Error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const sendEmail = async (type) => {
    setEmailBusy(type);
    try {
      const res = await base44.functions.invoke("sendBookingEmail", { bookingId: booking.id, type });
      if (res.data?.error) throw new Error(res.data.error);
      toast({ title: type === "receipt" ? (he ? "קבלה נשלחה" : "Receipt sent") : (he ? "שובר נשלח" : "Voucher sent"), description: res.data?.to });
    } catch (err) {
      toast({ title: he ? "שליחה נכשלה" : "Send failed", description: err.message, variant: "destructive" });
    } finally {
      setEmailBusy(null);
    }
  };

  const inp = (name, type = "text") => (
    <input
      type={type}
      value={form[name] ?? ""}
      onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
      className="w-full h-10 px-3 rounded-lg border border-mist text-sm text-ink outline-none focus:border-ink bg-white"
    />
  );

  const dateType = (name) =>
    name.includes("date") || name === "check_in" || name === "check_out" || name === "payment_due" || name === "paid_on" || name === "cancellation_date" ? "date" : "text";

  return (
    <div dir={he ? "rtl" : "ltr"} className="pt-20 pb-28 min-h-screen bg-[#F7F8FA]">
      {/* Top bar */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur border-b border-mist">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => navigate("/admin")} className="w-9 h-9 -ms-1 rounded-full flex items-center justify-center hover:bg-ether text-ink">
            <ArrowLeft className="w-5 h-5 rtl:rotate-180" strokeWidth={1.5} />
          </button>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-muted-foreground">{he ? "מספר הזמנה" : "Booking ID"}</div>
            <div className="text-sm font-semibold text-ink truncate">№ {booking.reference || booking.id}</div>
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${active ? "bg-gold/15" : "bg-gray-100"}`}>
            <Icon className={`w-5 h-5 ${active ? "text-gold" : "text-gray-400"}`} strokeWidth={1.5} />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {/* Status + guest */}
        <div className="bg-white rounded-2xl border border-[#ECEEF1] p-4 shadow-sm">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${st.bg} ${st.color} mb-3`}>
            <StatusIcon className="w-3.5 h-3.5" strokeWidth={2} />
            {he ? st.label.he : st.label.en}
          </div>
          {names.length > 0 ? (
            names.map((n, i) => (
              <div key={i} className="font-semibold text-[15px] text-ink leading-tight">{n}</div>
            ))
          ) : (
            <div className="font-semibold text-[15px] text-ink">{booking.guest_email || "—"}</div>
          )}
          {booking.guest_email && names.length > 0 && (
            <div className="text-xs text-muted-foreground mt-1">{booking.guest_email}</div>
          )}
        </div>

        {/* Hotel / service */}
        <div className="bg-white rounded-2xl border border-[#ECEEF1] p-4 shadow-sm">
          {booking.destination && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
              {booking.destination}{booking.city ? `, ${booking.city}` : ""}
            </div>
          )}
          {editMode ? (
            <div className="space-y-2">
              {inp("title")}
              {inp("destination")}
              {inp("city")}
            </div>
          ) : (
            <div className="font-semibold text-ink text-base leading-snug">{booking.title || "—"}</div>
          )}
          {editMode ? (
            <div className="mt-3 space-y-2">
              <div className="text-xs text-muted-foreground">{he ? "סוג חדר" : "Room type"}</div>
              {inp("room_type")}
              <div className="text-xs text-muted-foreground">{he ? "ארוחה" : "Meal"}</div>
              {inp("meal")}
            </div>
          ) : (
            (booking.room_type || booking.meal) && (
              <div className="text-xs text-muted-foreground leading-relaxed mt-2">
                {booking.room_type}{booking.meal ? `. ${booking.meal}` : ""}
              </div>
            )
          )}
        </div>

        {/* Dates */}
        <div className="bg-white rounded-2xl border border-[#ECEEF1] p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink mb-3">
            <Calendar className="w-4 h-4 text-gold" strokeWidth={1.5} />
            {he ? "תאריכים" : "Dates"}
          </div>
          {editMode ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">{he ? "צ'ק-אין" : "Check-in"}</div>
                {inp("check_in", "date")}
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">{he ? "צ'ק-אאוט" : "Check-out"}</div>
                {inp("check_out", "date")}
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">{he ? "לילות" : "Nights"}</div>
                {inp("nights", "number")}
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">{he ? "חדרים" : "Rooms"}</div>
                {inp("rooms", "number")}
              </div>
            </div>
          ) : (
            <div className="text-sm text-ink">
              {fmt(booking.check_in, lang)} — {fmt(booking.check_out, lang)}
              {booking.nights ? `, ${booking.nights} ${he ? "לילות" : "nights"}` : ""}
            </div>
          )}
          {!editMode && booking.free_cancellation && booking.cancellation_date && (
            <div className="mt-3 pt-3 border-t border-[#F0F1F3] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" strokeWidth={1.5} />
              <div className="text-xs text-emerald-700">
                {he ? "ביטול חינם עד " : "Free cancellation before "}{fmt(booking.cancellation_date, lang)}
              </div>
            </div>
          )}
        </div>

        {/* Guests */}
        <div className="bg-white rounded-2xl border border-[#ECEEF1] p-4 shadow-sm">
          <div className="text-sm font-semibold text-ink mb-3">{he ? "אורחים" : "Guests"}</div>
          {editMode ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">{he ? "שם" : "Name"}</div>
                {inp("guest_name")}
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">{he ? "אימייל" : "Email"}</div>
                {inp("guest_email", "email")}
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">{he ? "מבוגרים" : "Adults"}</div>
                {inp("adults", "number")}
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">{he ? "ילדים" : "Children"}</div>
                {inp("children", "number")}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">{he ? "מבוגרים" : "Adults"}</div>
                <div className="text-ink">{booking.adults ?? "—"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{he ? "ילדים" : "Children"}</div>
                <div className="text-ink">{booking.children ?? "—"}</div>
              </div>
            </div>
          )}
        </div>

        {/* Payment */}
        <div className="bg-white rounded-2xl border border-[#ECEEF1] p-4 shadow-sm">
          <div className="text-sm font-semibold text-ink mb-3">{he ? "תשלום" : "Payment"}</div>
          {editMode ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">{he ? "סה״כ" : "Total"}</div>
                {inp("total_price", "number")}
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">{he ? "מטבע" : "Currency"}</div>
                {inp("currency")}
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">{he ? "תאריך פירעון" : "Payment due"}</div>
                {inp("payment_due", "date")}
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">{he ? "שולם ב" : "Paid on"}</div>
                {inp("paid_on", "date")}
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">{he ? "סוג תשלום" : "Payment type"}</div>
                {inp("payment_type")}
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">{he ? "מחיר יומי" : "Daily rate"}</div>
                {inp("daily_rate", "number")}
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">{booking.status === "cancelled" ? (he ? "סכום" : "Amount") : (he ? "סכום לתשלום" : "Amount due")}</div>
                  {booking.payment_due && booking.status !== "cancelled" && (
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" strokeWidth={1.5} />
                      {he ? "תשלום עד " : "Pay before "}{fmt(booking.payment_due, lang)}
                    </div>
                  )}
                </div>
                <div className="text-2xl font-bold text-ink">{money(booking.total_price)}</div>
              </div>
              {booking.status === "cancelled" && (
                <div className="mt-3 pt-3 border-t border-[#F0F1F3] text-xs text-emerald-600 font-medium">
                  {he ? "החזר הושלם" : "Refund complete"}
                </div>
              )}
            </>
          )}
        </div>

        {/* Notes / extra fields in edit mode */}
        {editMode && (
          <div className="bg-white rounded-2xl border border-[#ECEEF1] p-4 shadow-sm space-y-3">
            <div className="text-sm font-semibold text-ink">{he ? "פרטים נוספים" : "Additional details"}</div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">{he ? "מספר חשבונית" : "Invoice ID"}</div>
              {inp("invoice_id")}
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">{he ? "מזהה ספק" : "Supplier ID"}</div>
              {inp("supplier_id")}
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">{he ? "סטטוס" : "Status"}</div>
              {inp("status")}
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">{he ? "הערות" : "Details"}</div>
              {inp("details")}
            </div>
          </div>
        )}

        {/* Created */}
        {!editMode && (
          <div className="text-center text-xs text-muted-foreground">
            {he ? "נוצר ב" : "Created"} {fmt(booking.created_date, lang)}
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-mist">
        <div className="max-w-2xl mx-auto px-4 py-3 space-y-2">
          {editMode ? (
            <div className="flex gap-2">
              <button onClick={save} disabled={saving} className="flex-1 h-12 rounded-xl bg-[#F5D166] text-ink text-sm font-semibold flex items-center justify-center gap-1.5 hover:brightness-95 disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" strokeWidth={1.5} />}
                {he ? "שמור שינויים" : "Save changes"}
              </button>
              <button onClick={() => setEditMode(false)} className="h-12 px-5 rounded-xl border border-mist text-sm text-muted-foreground">
                {he ? "ביטול" : "Cancel"}
              </button>
            </div>
          ) : (
            <>
              <button onClick={startEdit} className="w-full h-12 rounded-xl bg-[#F5D166] text-ink text-sm font-semibold flex items-center justify-center gap-1.5 hover:brightness-95">
                <Pencil className="w-4 h-4" strokeWidth={1.5} />
                {he ? "עריכת הזמנה" : "Modify order"}
              </button>
              <div className="flex gap-2">
                <button onClick={() => sendEmail("receipt")} disabled={!!emailBusy} className="flex-1 h-11 rounded-xl border border-mist text-sm text-ink flex items-center justify-center gap-1.5 hover:bg-ether disabled:opacity-50">
                  {emailBusy === "receipt" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />}
                  {he ? "קבלה" : "Receipt"}
                </button>
                <button onClick={() => sendEmail("voucher")} disabled={!!emailBusy} className="flex-1 h-11 rounded-xl border border-mist text-sm text-ink flex items-center justify-center gap-1.5 hover:bg-ether disabled:opacity-50">
                  {emailBusy === "voucher" ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />}
                  {he ? "שובר" : "Voucher"}
                </button>
              </div>
              {booking.status !== "cancelled" ? (
                confirmCancel ? (
                  <div className="p-3 bg-rose-50 rounded-xl">
                    <p className="text-xs text-rose-700 mb-2 text-center">{he ? "לבטל את ההזמנה?" : "Cancel this booking?"}</p>
                    <div className="flex gap-2">
                      <button onClick={cancelBooking} disabled={saving} className="flex-1 h-10 rounded-lg bg-rose-600 text-white text-sm font-medium disabled:opacity-50">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (he ? "אישור ביטול" : "Confirm")}
                      </button>
                      <button onClick={() => setConfirmCancel(false)} className="flex-1 h-10 rounded-lg border border-mist text-sm">{he ? "לא" : "No"}</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setConfirmCancel(true)} className="w-full h-11 rounded-xl text-sm text-rose-600 flex items-center justify-center gap-1.5 hover:bg-rose-50 transition">
                    <Ban className="w-4 h-4" strokeWidth={1.5} />
                    {he ? "ביטול הזמנה" : "Cancel booking"}
                  </button>
                )
              ) : (
                <button onClick={restore} disabled={saving} className="w-full h-11 rounded-xl text-sm text-emerald-700 flex items-center justify-center gap-1.5 hover:bg-emerald-50 disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" strokeWidth={1.5} />}
                  {he ? "שחזור הזמנה" : "Restore booking"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}