import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Bed, Plane, Bus, Car, Train, Check, X, Pencil, Save,
  Loader2, RotateCcw, MapPin, Clock,
  Plus, Star, MoreHorizontal, Download, Share2, CalendarPlus, Search,
  Briefcase, HelpCircle, Grid, CreditCard, Link2, Coffee, CigaretteOff, Users, X as XIcon,
  Phone, Sparkles, Wallet, Home,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/use-toast";

const SERVICE_ICON = { hotels: Bed, flights: Plane, transfers: Bus, cars: Car, trains: Train };

const STATUS = {
  pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50", ring: "text-amber-500", label: { he: "הזמנה בהמתנה", en: "Pending booking" } },
  confirmed: { icon: Check, color: "text-emerald-600", bg: "bg-emerald-50", ring: "text-emerald-500", label: { he: "הזמנה מאושרת", en: "Successful booking" } },
  completed: { icon: Check, color: "text-emerald-600", bg: "bg-emerald-50", ring: "text-emerald-500", label: { he: "הזמנה הושלמה", en: "Completed booking" } },
  cancelled: { icon: X, color: "text-rose-600", bg: "bg-rose-50", ring: "text-rose-500", label: { he: "הזמנה בוטלה", en: "Canceled booking" } },
};

const fmt = (d, lang) =>
  d ? new Date(d).toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { day: "numeric", month: "short", year: "numeric" }) : "—";

const fmtLong = (d, lang) =>
  d ? new Date(d).toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { day: "numeric", month: "long", year: "numeric" }) : "—";

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
  const [tab, setTab] = useState("confirmation");
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
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <p className="text-muted-foreground">{he ? "גישה נדחתה" : "Access denied"}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="w-7 h-7 text-gold animate-spin" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 gap-4">
        <p className="text-rose-600">{error || (he ? "ההזמנה לא נמצאה" : "Booking not found")}</p>
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
  const sym = booking.currency === "ILS" ? "₪" : booking.currency === "USD" ? "US$" : (booking.currency || "$");
  const money = (v) => (v != null && v !== "" ? `${sym}${Number(v).toLocaleString()}` : "—");
  const approxIls = (v) => {
    if (v == null || v === "") return null;
    if (booking.currency === "ILS") return null;
    return `≈₪${Math.round(Number(v) * 3.6).toLocaleString()}`;
  };
  const points = Math.max(1, Math.floor(Number(booking.total_price || 0) / 100));
  const names = (booking.guest_name || "").split(/\s*,\s*|\s*;\s*/).filter(Boolean);
  const ref = booking.reference || booking.id;
  const created = fmtLong(booking.created_date, lang);

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

  const shareBooking = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: booking.title || "Booking", url }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(url); toast({ title: he ? "הקישור הועתק" : "Link copied" }); } catch {}
    }
  };

  const addCalendar = () => {
    const toICS = (d) => (d ? new Date(d).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z" : "");
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Atlas//Booking//HE",
      "BEGIN:VEVENT",
      `UID:${booking.id}@atlas`,
      `DTSTAMP:${toICS(new Date())}`,
      `DTSTART:${toICS(booking.check_in) || toICS(new Date())}`,
      `DTEND:${toICS(booking.check_out) || toICS(new Date())}`,
      `SUMMARY:${booking.title || "Booking"}`,
      `LOCATION:${[booking.destination, booking.city].filter(Boolean).join(", ")}`,
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "booking.ics";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const inp = (name, type = "text") => (
    <input
      type={type}
      value={form[name] ?? ""}
      onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
      className="w-full h-10 px-3 rounded-lg border border-mist text-sm text-ink outline-none focus:border-ink bg-white"
    />
  );


  const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-2xl border border-[#ECEEF1] shadow-sm ${className}`}>{children}</div>
  );

  const Stars = () => (
    <div className="flex items-center gap-0.5 mb-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 text-[#F5A623] fill-[#F5A623]" />
      ))}
    </div>
  );

  return (
    <div dir={he ? "rtl" : "ltr"} className="min-h-screen bg-[#F6F6F6] pb-28">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#ECEEF1]">
        <div className="px-4 h-14 flex items-center gap-3">
          <button onClick={() => navigate("/admin")} className="w-9 h-9 -ms-1 rounded-full flex items-center justify-center hover:bg-[#F2F3F5] text-ink">
            <ArrowLeft className="w-5 h-5 rtl:rotate-180" strokeWidth={1.5} />
          </button>
          <div className="flex-1 flex justify-center">
            <div className="inline-flex bg-[#F2F3F5] rounded-full p-1 text-sm font-medium">
              <button
                onClick={() => setTab("confirmation")}
                className={`px-5 h-8 rounded-full transition ${tab === "confirmation" ? "bg-white text-ink shadow-sm" : "text-muted-foreground"}`}
              >
                {he ? "אישור" : "Confirmation"}
              </button>
              <button
                onClick={() => setTab("documents")}
                className={`px-5 h-8 rounded-full transition ${tab === "documents" ? "bg-white text-ink shadow-sm" : "text-muted-foreground"}`}
              >
                {he ? "מסמכים" : "Documents"}
              </button>
            </div>
          </div>
          <button onClick={startEdit} className="w-9 h-9 -me-1 rounded-full flex items-center justify-center hover:bg-[#F2F3F5] text-ink">
            <Pencil className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4 space-y-3">
        {tab === "confirmation" ? (
          <>
            {/* Status card */}
            <Card className="p-5 flex items-center gap-3">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center ${st.bg}`}>
                <StatusIcon className={`w-6 h-6 ${st.color}`} strokeWidth={2} />
              </div>
              <div className="font-semibold text-[16px] text-ink">{he ? st.label.he : st.label.en}</div>
            </Card>

            {/* Support section */}
            <Card className="p-5">
              <div className="font-semibold text-[15px] text-ink mb-1">{he ? "פניות לשירות לקוחות" : "Requests to Customer Support"}</div>
              <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">
                {he
                  ? "דרך נוחה לשנות את נתוני ההזמנה, להוסיף שירות או פשוט לשאול שאלה על אופן פעולת השירות."
                  : "A convenient way to change your booking data, add a service, or just ask a question on how the service works."}
              </p>
              <div className="rounded-xl bg-[#F2F3F5] py-3 flex items-center justify-center gap-2 text-[14px] font-medium text-ink">
                <Plus className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                {he ? "צור פנייה חדשה" : "Create a new request"}
              </div>
            </Card>

            {/* Booking details header */}
            <Card className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground mb-1">{he ? "מספר הזמנה" : "Booking number"}</div>
                  <div className="text-[13px] text-ink mb-2">№ {ref} {he ? "מ-" : "from "}{created}</div>
                  <Stars />
                  <div className="font-bold text-[20px] text-[#2563EB] leading-tight">{booking.title || "—"}</div>
                  {(booking.destination || booking.city) && (
                    <div className="flex items-center gap-1 text-[13px] text-muted-foreground mt-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
                      {[booking.destination, booking.city].filter(Boolean).join(", ")}
                    </div>
                  )}
                </div>
                <div className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#F2F3F5] text-muted-foreground shrink-0">
                  <MoreHorizontal className="w-5 h-5" strokeWidth={1.5} />
                </div>
              </div>

              {/* Date boxes */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="rounded-xl bg-[#F2F3F5] p-3">
                  <div className="text-[11px] text-muted-foreground mb-0.5">{he ? "צ'ק-אין" : "Check-in"}</div>
                  <div className="text-[14px] font-semibold text-ink">{fmt(booking.check_in, lang)}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{he ? "אחרי 14:00" : "after 14:00"}</div>
                </div>
                <div className="rounded-xl bg-[#F2F3F5] p-3">
                  <div className="text-[11px] text-muted-foreground mb-0.5">{he ? "צ'ק-אאוט" : "Check-out"}</div>
                  <div className="text-[14px] font-semibold text-ink">{fmt(booking.check_out, lang)}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{he ? "עד 12:00" : "until 12:00"}</div>
                </div>
              </div>
              {booking.nights && (
                <div className="text-[12px] text-muted-foreground mt-2 text-center">
                  {booking.nights} {he ? "לילות" : "nights"}
                </div>
              )}
            </Card>

            {/* Call the property */}
            <Card className="p-2">
              <button onClick={() => toast({ title: he ? "מספר הטלפון אינו זמין" : "Phone number not available" })} className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-[#F2F3F5] transition text-[14px] text-ink">
                <Phone className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                <span className="flex-1 text-start">{he ? "התקשר למלון" : "Call the property"}</span>
                <ArrowLeft className="w-4 h-4 rtl:rotate-180 text-muted-foreground" strokeWidth={1.5} />
              </button>
            </Card>

            {/* Room details */}
            <Card className="p-5">
              <div className="font-bold text-[16px] text-ink leading-tight">
                {booking.room_type || (he ? "פרטי חדר" : "Room details")}
              </div>
              <div className="space-y-3 mt-3">
                <div className="flex items-center gap-3 text-[14px] text-ink">
                  <Bed className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                  {he ? "מיטה זוגית" : "Double bed"}
                </div>
                <div className="flex items-center gap-3 text-[14px] text-ink">
                  <CigaretteOff className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                  {he ? "ללא עישון" : "Non-smoking"}
                </div>
                {names.length > 0 && (
                  <div className="flex items-center gap-3 text-[14px] text-ink">
                    <Users className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                    <span className="min-w-0">
                      {booking.adults ? `${booking.adults} ${he ? "מבוגרים" : "adults"}: ` : ""}{names.join(", ")}
                    </span>
                  </div>
                )}
                {booking.meal && (
                  <div className="flex items-center gap-3 text-[14px] text-emerald-600">
                    <Coffee className="w-4 h-4" strokeWidth={1.5} />
                    {booking.meal}
                  </div>
                )}
                {booking.free_cancellation && (
                  <div className="flex items-center gap-3 text-[14px] text-emerald-600">
                    <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
                    {he ? "ביטול חינם עד " : "Free cancellation until "}{booking.cancellation_date ? fmt(booking.cancellation_date, lang) : ""}
                  </div>
                )}
              </div>

              {/* Amenity panel */}
              <div className="mt-4 rounded-xl bg-[#F0F4FF] p-3">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-[12px] text-ink">
                  {[
                    "32 m²",
                    he ? "חדר אמבטיה פרטי" : "Private bathroom",
                    he ? "כספת" : "Safe",
                    he ? "Wi-Fi חינם" : "Free Wi-Fi",
                    he ? "קפה" : "Coffee",
                    he ? "מיזוג אוויר" : "Air conditioning",
                  ].map((a) => (
                    <span key={a} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                      {a}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-[13px] font-semibold text-[#2563EB]">{he ? "פרטים נוספים על החדר" : "More details about the room"}</div>
              </div>

              {/* Special requests */}
              <div className="mt-4 pt-4 border-t border-[#F0F1F3]">
                <div className="font-semibold text-[14px] text-ink mb-1">{he ? "בקשות מיוחדות שלך" : "Your special requests"}</div>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{booking.details || (he ? "אין בקשות מיוחדות" : "No special requests")}</p>
              </div>
            </Card>

            {/* Amount due */}
            <Card className="p-5">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <div className="font-semibold text-[15px] text-ink">
                    {booking.status === "cancelled" ? (he ? "סכום" : "Amount") : (he ? "סכום לתשלום" : "Amount due")}
                  </div>
                  {booking.payment_due && booking.status !== "cancelled" && (
                    <div className="text-[12px] text-muted-foreground mt-0.5">
                      {he ? "תשלום עד " : "Pay before "}{fmt(booking.payment_due, lang)}
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <div className="text-[24px] font-bold text-ink leading-none">{money(booking.total_price)}</div>
                  {approxIls(booking.total_price) && (
                    <div className="text-[12px] text-muted-foreground mt-1">{approxIls(booking.total_price)}</div>
                  )}
                  <div className="text-[11px] text-muted-foreground mt-0.5">{he ? "מע״מ לא כלול" : "VAT not included"}</div>
                </div>
              </div>
              {booking.status === "cancelled" && (
                <div className="mt-3 pt-3 border-t border-[#F0F1F3] text-[12px] text-emerald-600 font-medium">
                  {he ? "החזר הושלם" : "Refund complete"}
                </div>
              )}
            </Card>
          </>
        ) : (
          <>
            {/* Amount due (documents tab) */}
            <Card className="p-5">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <div className="font-semibold text-[15px] text-ink">{he ? "סכום לתשלום" : "Amount due"}</div>
                  {booking.payment_due && booking.status !== "cancelled" && (
                    <div className="text-[12px] text-muted-foreground mt-0.5">
                      {he ? "תשלום עד " : "Pay before "}{fmt(booking.payment_due, lang)}
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <div className="text-[24px] font-bold text-ink leading-none">{money(booking.total_price)}</div>
                  {approxIls(booking.total_price) && (
                    <div className="text-[12px] text-muted-foreground mt-1">{approxIls(booking.total_price)}</div>
                  )}
                  <div className="text-[11px] text-muted-foreground mt-0.5">{he ? "מע״מ לא כלול" : "VAT not included"}</div>
                </div>
              </div>
            </Card>

            {/* Points */}
            <Card className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E8F0FE] flex items-center justify-center shrink-0">
                <Home className="w-5 h-5 text-[#2563EB]" strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-[14px] text-[#2563EB]">{he ? `תקבל ${points} נקודות` : `You will get ${points} points`}</div>
                <div className="text-[12px] text-muted-foreground">{he ? "הנקודות יזוכו לאחר השהייה על פי תנאי התכנית" : "points will be credited after your stay according to the program terms"}</div>
              </div>
            </Card>

            {/* Payment actions */}
            <Card className="p-2">
              <button onClick={() => sendEmail("receipt")} disabled={!!emailBusy} className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-[#F2F3F5] transition text-[14px] text-ink disabled:opacity-50">
                <Link2 className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                <span className="flex-1 text-start">{he ? "צור קישור תשלום" : "Create a payment link"}</span>
                {emailBusy === "receipt" ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowLeft className="w-4 h-4 rtl:rotate-180 text-muted-foreground" strokeWidth={1.5} />}
              </button>
              <div className="h-px bg-[#F0F1F3] mx-3" />
              <button onClick={() => sendEmail("voucher")} disabled={!!emailBusy} className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-[#F2F3F5] transition text-[14px] text-ink disabled:opacity-50">
                <CreditCard className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                <span className="flex-1 text-start">{he ? "שלח שובר במייל" : "Pay by card"}</span>
                {emailBusy === "voucher" ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowLeft className="w-4 h-4 rtl:rotate-180 text-muted-foreground" strokeWidth={1.5} />}
              </button>
            </Card>

            {/* Documents */}
            <div>
              <div className="font-bold text-[17px] text-ink px-1 mb-1">{he ? "מסמכים" : "Documents"}</div>
              <div className="text-[13px] text-muted-foreground px-1 mb-2">{he ? "הורדת מסמכים" : "Download documents"}</div>
              <Card className="p-2">
                <DocItem label={he ? `חשבונית ${booking.invoice_id ? "№" + booking.invoice_id : ""}` : `Invoice ${booking.invoice_id ? "#" + booking.invoice_id : ""}`} onClick={() => sendEmail("receipt")} busy={emailBusy === "receipt"} />
                <div className="h-px bg-[#F0F1F3] mx-3" />
                <DocItem label={he ? "חשבונית מידע" : "Informational invoice"} onClick={() => sendEmail("receipt")} busy={emailBusy === "receipt"} />
                <div className="h-px bg-[#F0F1F3] mx-3" />
                <DocItem label={he ? "שובר" : "Voucher"} onClick={() => sendEmail("voucher")} busy={emailBusy === "voucher"} />
                <div className="h-px bg-[#F0F1F3] mx-3" />
                <DocItem label={he ? "שובר באנגלית" : "Voucher in English"} onClick={() => sendEmail("voucher")} busy={emailBusy === "voucher"} />
              </Card>
            </div>

            {/* Share and save */}
            <div>
              <div className="font-bold text-[17px] text-ink px-1 mb-2">{he ? "שיתוף ושמירה" : "Share and save"}</div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button onClick={() => toast({ title: he ? "לא זמין במכשיר זה" : "Not available on this device" })} className="h-11 rounded-xl bg-[#262626] text-white text-[13px] font-medium flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" strokeWidth={1.5} />
                  {he ? "הוסף ל-Siri" : "Add to Siri"}
                </button>
                <button onClick={() => toast({ title: he ? "לא זמין במכשיר זה" : "Not available on this device" })} className="h-11 rounded-xl bg-[#262626] text-white text-[13px] font-medium flex items-center justify-center gap-2">
                  <Wallet className="w-4 h-4" strokeWidth={1.5} />
                  {he ? "הוסף ל-Wallet" : "Add to Wallet"}
                </button>
              </div>
              <Card className="p-2">
                <button onClick={shareBooking} className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-[#F2F3F5] transition text-[14px] text-ink">
                  <Share2 className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                  <span className="flex-1 text-start">{he ? "שתף מלון זה" : "Share this hotel"}</span>
                  <ArrowLeft className="w-4 h-4 rtl:rotate-180 text-muted-foreground" strokeWidth={1.5} />
                </button>
                <div className="h-px bg-[#F0F1F3] mx-3" />
                <button onClick={addCalendar} className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-[#F2F3F5] transition text-[14px] text-ink">
                  <CalendarPlus className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                  <span className="flex-1 text-start">{he ? "הוסף ליומן" : "Add to calendar"}</span>
                  <ArrowLeft className="w-4 h-4 rtl:rotate-180 text-muted-foreground" strokeWidth={1.5} />
                </button>
              </Card>
            </div>

            {/* Manage booking */}
            <div>
              <div className="font-bold text-[17px] text-ink px-1 mb-2">{he ? "ניהול ההזמנה" : "Manage your booking"}</div>
              {booking.status !== "cancelled" ? (
                confirmCancel ? (
                  <Card className="p-4 bg-rose-50 border-rose-100">
                    <p className="text-[13px] text-rose-700 mb-3 text-center">{he ? "לבטל את ההזמנה?" : "Cancel this booking?"}</p>
                    <div className="flex gap-2">
                      <button onClick={cancelBooking} disabled={saving} className="flex-1 h-10 rounded-lg bg-rose-600 text-white text-[13px] font-medium disabled:opacity-50">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (he ? "אישור ביטול" : "Confirm")}
                      </button>
                      <button onClick={() => setConfirmCancel(false)} className="flex-1 h-10 rounded-lg border border-mist text-[13px]">{he ? "לא" : "No"}</button>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-2">
                    <button onClick={() => setConfirmCancel(true)} className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-rose-50 transition text-[14px] text-rose-600">
                      <XIcon className="w-5 h-5 text-rose-500" strokeWidth={1.5} />
                      <span className="flex-1 text-start">{he ? "ביטול הזמנה" : "Cancel booking"}</span>
                    </button>
                  </Card>
                )
              ) : (
                <Card className="p-2">
                  <button onClick={restore} disabled={saving} className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-emerald-50 transition text-[14px] text-emerald-700 disabled:opacity-50">
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <RotateCcw className="w-5 h-5" strokeWidth={1.5} />}
                    <span className="flex-1 text-start">{he ? "שחזור הזמנה" : "Restore booking"}</span>
                  </button>
                </Card>
              )}
            </div>
          </>
        )}

        <div className="text-center text-[11px] text-muted-foreground pt-2">
          {he ? "נוצר ב" : "Created"} {created}
        </div>
      </div>

      {/* Bottom navigation (floating pill) */}
      <div className="fixed bottom-0 inset-x-0 z-30 px-4 pb-4 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <div className="bg-white/90 backdrop-blur rounded-2xl border border-[#ECEEF1] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.18)] flex items-stretch justify-around px-2 py-1.5">
            <NavItem icon={Search} label={he ? "חיפוש" : "Search"} onClick={() => navigate("/")} />
            <NavItem icon={Briefcase} label={he ? "הזמנות" : "Orders"} active onClick={() => navigate("/admin")} />
            <NavItem icon={HelpCircle} label={he ? "תמיכה" : "Support"} onClick={() => window.location.href = "mailto:support@travelytime.co.il"} />
            <NavItem icon={Grid} label={he ? "תפריט" : "Menu"} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
          </div>
        </div>
      </div>

      {/* Edit overlay */}
      {editMode && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={() => setEditMode(false)}>
          <div className="w-full bg-[#F6F6F6] rounded-t-3xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-[#ECEEF1] px-4 h-14 flex items-center justify-between">
              <button onClick={() => setEditMode(false)} className="text-sm text-muted-foreground">{he ? "סגור" : "Close"}</button>
              <div className="font-semibold text-ink">{he ? "עריכת הזמנה" : "Edit booking"}</div>
              <button onClick={save} disabled={saving} className="text-sm font-semibold text-ink disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (he ? "שמור" : "Save")}
              </button>
            </div>
            <div className="p-4 space-y-4 pb-32">
              <EditGroup title={he ? "שירות" : "Service"}>
                <EditField label={he ? "כותרת" : "Title"}>{inp("title")}</EditField>
                <EditField label={he ? "יעד" : "Destination"}>{inp("destination")}</EditField>
                <EditField label={he ? "עיר" : "City"}>{inp("city")}</EditField>
              </EditGroup>
              <EditGroup title={he ? "תאריכים" : "Dates"}>
                <div className="grid grid-cols-2 gap-3">
                  <EditField label={he ? "צ'ק-אין" : "Check-in"}>{inp("check_in", "date")}</EditField>
                  <EditField label={he ? "צ'ק-אאוט" : "Check-out"}>{inp("check_out", "date")}</EditField>
                  <EditField label={he ? "לילות" : "Nights"}>{inp("nights", "number")}</EditField>
                  <EditField label={he ? "חדרים" : "Rooms"}>{inp("rooms", "number")}</EditField>
                </div>
              </EditGroup>
              <EditGroup title={he ? "אורח" : "Guest"}>
                <div className="grid grid-cols-2 gap-3">
                  <EditField label={he ? "שם" : "Name"}>{inp("guest_name")}</EditField>
                  <EditField label={he ? "אימייל" : "Email"}>{inp("guest_email", "email")}</EditField>
                  <EditField label={he ? "מבוגרים" : "Adults"}>{inp("adults", "number")}</EditField>
                  <EditField label={he ? "ילדים" : "Children"}>{inp("children", "number")}</EditField>
                </div>
              </EditGroup>
              <EditGroup title={he ? "חדר וארוחה" : "Room & meal"}>
                <EditField label={he ? "סוג חדר" : "Room type"}>{inp("room_type")}</EditField>
                <EditField label={he ? "ארוחה" : "Meal"}>{inp("meal")}</EditField>
                <EditField label={he ? "פרטים" : "Details"}>{inp("details")}</EditField>
                <div className="flex items-center gap-2 pt-1">
                  <input type="checkbox" id="fc" checked={form.free_cancellation === "1"} onChange={(e) => setForm((f) => ({ ...f, free_cancellation: e.target.checked ? "1" : "" }))} />
                  <label htmlFor="fc" className="text-sm text-ink">{he ? "ביטול חינם" : "Free cancellation"}</label>
                </div>
                <EditField label={he ? "תאריך ביטול" : "Cancellation date"}>{inp("cancellation_date", "date")}</EditField>
              </EditGroup>
              <EditGroup title={he ? "תשלום" : "Payment"}>
                <div className="grid grid-cols-2 gap-3">
                  <EditField label={he ? "סה״כ" : "Total"}>{inp("total_price", "number")}</EditField>
                  <EditField label={he ? "מטבע" : "Currency"}>{inp("currency")}</EditField>
                  <EditField label={he ? "מחיר יומי" : "Daily rate"}>{inp("daily_rate", "number")}</EditField>
                  <EditField label={he ? "תאריך פירעון" : "Payment due"}>{inp("payment_due", "date")}</EditField>
                  <EditField label={he ? "סוג תשלום" : "Payment type"}>{inp("payment_type")}</EditField>
                  <EditField label={he ? "שולם ב" : "Paid on"}>{inp("paid_on", "date")}</EditField>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input type="checkbox" id="pd" checked={form.paid === "1"} onChange={(e) => setForm((f) => ({ ...f, paid: e.target.checked ? "1" : "" }))} />
                  <label htmlFor="pd" className="text-sm text-ink">{he ? "שולם" : "Paid"}</label>
                </div>
              </EditGroup>
              <EditGroup title={he ? "ניהול" : "Admin"}>
                <div className="grid grid-cols-2 gap-3">
                  <EditField label={he ? "מספר הזמנה" : "Reference"}>{inp("reference")}</EditField>
                  <EditField label={he ? "מספר חשבונית" : "Invoice ID"}>{inp("invoice_id")}</EditField>
                  <EditField label={he ? "מזהה ספק" : "Supplier ID"}>{inp("supplier_id")}</EditField>
                  <EditField label={he ? "סטטוס" : "Status"}>{inp("status")}</EditField>
                </div>
              </EditGroup>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-[#ECEEF1] p-3">
              <button onClick={save} disabled={saving} className="w-full h-12 rounded-xl bg-[#F5D166] text-ink text-sm font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" strokeWidth={1.5} />}
                {he ? "שמור שינויים" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DocItem({ label, onClick, busy }) {
  return (
    <button onClick={onClick} disabled={busy} className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-[#F2F3F5] transition text-[14px] text-ink disabled:opacity-50">
      {busy ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : <Download className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />}
      <span className="flex-1 text-start">{label}</span>
    </button>
  );
}

function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className="flex-1 flex flex-col items-center gap-0.5 py-1.5">
      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${active ? "bg-[#EAEAEC] text-ink" : "text-muted-foreground"}`}>
        <Icon className="w-5 h-5" strokeWidth={1.5} />
      </div>
      <span className={`text-[11px] ${active ? "text-ink font-medium" : "text-muted-foreground"}`}>{label}</span>
    </button>
  );
}

function EditGroup({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-[#ECEEF1] p-4">
      <div className="text-sm font-semibold text-ink mb-3">{title}</div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function EditField({ label, children }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      {children}
    </div>
  );
}