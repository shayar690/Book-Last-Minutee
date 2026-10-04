import React, { useState } from "react";
import {
  X, Pencil, Check, Ban, Mail, FileText, Shield, ChevronRight, Loader2, Save, RotateCcw,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

const STATUS_META = {
  pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", label: "Pending" },
  confirmed: { bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-500", label: "Confirmed" },
  completed: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "Completed" },
  cancelled: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500", label: "Cancelled" },
};

const fmt = (d, lang) => (d ? new Date(d).toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { day: "numeric", month: "short", year: "numeric" }) : "—");

function Field({ label, value, name, editable, editMode, form, setForm }) {
  return (
    <div className="py-2">
      <div className="text-xs text-[#75758b] mb-0.5">{label}</div>
      {editable && editMode ? (
        <input
          type={name === "guest_email" ? "email" : name === "nights" || name === "adults" || name === "children" || name === "rooms" ? "number" : name.includes("date") || name === "check_in" || name === "check_out" || name === "payment_due" || name === "cancellation_date" || name === "paid_on" ? "date" : "text"}
          value={form[name] ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
          className="w-full h-9 px-2 rounded-lg border border-mist text-sm text-ink outline-none focus:border-ink bg-white"
        />
      ) : (
        <div className="text-sm text-[#0f1729] flex items-center gap-1.5">
          <span className="break-words">{value || "—"}</span>
          {editable && <Pencil className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100" strokeWidth={1.5} />}
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-[#0f1729] mb-1 pb-2 border-b border-mist">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">{children}</div>
    </div>
  );
}

export default function BookingDetailModal({ booking, lang, onClose, onUpdated, onDeleted }) {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [emailBusy, setEmailBusy] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const st = STATUS_META[booking.status] || STATUS_META.pending;
  const he = lang === "he";
  const sym = booking.currency === "ILS" ? "₪" : "$";

  const startEdit = () => {
    setForm({
      title: booking.title || "",
      destination: booking.destination || "",
      city: booking.city || "",
      check_in: booking.check_in || "",
      check_out: booking.check_out || "",
      guest_name: booking.guest_name || "",
      guest_email: booking.guest_email || "",
      adults: booking.adults ?? "",
      children: booking.children ?? "",
      rooms: booking.rooms ?? "",
      nights: booking.nights ?? "",
      total_price: booking.total_price ?? "",
      daily_rate: booking.daily_rate ?? "",
      currency: booking.currency || "USD",
      room_type: booking.room_type || "",
      meal: booking.meal || "",
      free_cancellation: booking.free_cancellation ? "1" : "",
      cancellation_date: booking.cancellation_date || "",
      payment_due: booking.payment_due || "",
      paid: booking.paid ? "1" : "",
      paid_on: booking.paid_on || "",
      payment_type: booking.payment_type || "",
      supplier_id: booking.supplier_id || "",
      invoice_id: booking.invoice_id || "",
      reference: booking.reference || "",
      status: booking.status || "pending",
      details: booking.details || "",
    });
    setEditMode(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const num = (v) => (v === "" || v == null ? undefined : Number(v));
      const payload = {
        ...form,
        adults: num(form.adults),
        children: num(form.children),
        rooms: num(form.rooms),
        nights: num(form.nights),
        total_price: num(form.total_price),
        daily_rate: num(form.daily_rate),
        free_cancellation: form.free_cancellation === "1",
        paid: form.paid === "1",
      };
      const updated = await base44.entities.Booking.update(booking.id, payload);
      onUpdated(updated);
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
      onUpdated(updated);
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
      onUpdated(updated);
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

  const money = (v) => (v != null && v !== "" ? `${sym}${Number(v).toLocaleString()}` : "—");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        dir={he ? "rtl" : "ltr"}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-mist">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gold" strokeWidth={1.5} />
            <span className="font-semibold text-ink">{he ? "פרטי הזמנה" : "Booking details"}</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-ether flex items-center justify-center text-muted-foreground">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar */}
          <div className="w-52 shrink-0 bg-[#F9FAFB] border-e border-mist p-4 flex flex-col gap-4 overflow-y-auto">
            <div>
              <div className="text-xs text-[#75758b] mb-1">{he ? "סטטוס" : "Status"}</div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${st.bg} ${st.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                {st.label}
              </span>
            </div>
            <div>
              <div className="text-xs text-[#75758b] mb-0.5">{he ? "מספר הזמנה" : "Booking ID"}</div>
              <div className="text-sm font-semibold text-ink break-all">{booking.reference || booking.id}</div>
            </div>

            <div className="flex flex-col gap-2">
              {editMode ? (
                <>
                  <button onClick={save} disabled={saving} className="w-full h-10 rounded-lg bg-[#F5D166] text-ink text-sm font-semibold flex items-center justify-center gap-1.5 hover:brightness-95 disabled:opacity-50">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" strokeWidth={1.5} />}
                    {he ? "שמור" : "Save"}
                  </button>
                  <button onClick={() => setEditMode(false)} className="w-full h-9 rounded-lg border border-mist text-sm text-muted-foreground hover:bg-white">
                    {he ? "ביטול" : "Cancel"}
                  </button>
                </>
              ) : (
                <button onClick={startEdit} className="w-full h-10 rounded-lg bg-[#F5D166] text-ink text-sm font-semibold flex items-center justify-center gap-1.5 hover:brightness-95">
                  <Pencil className="w-4 h-4" strokeWidth={1.5} />
                  {he ? "עריכת הזמנה" : "Modify order"}
                </button>
              )}
            </div>

            {!editMode && (
              <div className="flex flex-col gap-1">
                <button onClick={() => sendEmail("receipt")} disabled={!!emailBusy} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-ink hover:bg-white transition disabled:opacity-50">
                  {emailBusy === "receipt" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />}
                  {he ? "שלח קבלה" : "Send receipt"}
                </button>
                <button onClick={() => sendEmail("voucher")} disabled={!!emailBusy} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-ink hover:bg-white transition disabled:opacity-50">
                  {emailBusy === "voucher" ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />}
                  {he ? "שלח שובר PDF" : "Send voucher PDF"}
                </button>
                <div className="h-px bg-mist my-1" />
                {booking.status !== "cancelled" ? (
                  confirmCancel ? (
                    <div className="px-2 py-2 bg-rose-50 rounded-lg">
                      <p className="text-xs text-rose-700 mb-2">{he ? "לבטל את ההזמנה?" : "Cancel this booking?"}</p>
                      <div className="flex gap-2">
                        <button onClick={cancelBooking} disabled={saving} className="flex-1 h-8 rounded-md bg-rose-600 text-white text-xs font-medium disabled:opacity-50">{saving ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : (he ? "אישור" : "Confirm")}</button>
                        <button onClick={() => setConfirmCancel(false)} className="flex-1 h-8 rounded-md border border-mist text-xs">{he ? "ביטול" : "No"}</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmCancel(true)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-rose-600 hover:bg-rose-50 transition">
                      <Ban className="w-4 h-4" strokeWidth={1.5} />
                      {he ? "ביטול הזמנה" : "Cancel booking"}
                    </button>
                  )
                ) : (
                  <button onClick={restore} disabled={saving} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-emerald-700 hover:bg-emerald-50 transition disabled:opacity-50">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" strokeWidth={1.5} />}
                    {he ? "שחזור הזמנה" : "Restore booking"}
                  </button>
                )}
              </div>
            )}

            <div className="mt-auto pt-4 border-t border-mist">
              <div className="text-xs text-[#75758b]">{he ? "נוצר ב" : "Created"}</div>
              <div className="text-xs text-ink">{fmt(booking.created_date, lang)}</div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-y-auto p-6 group">
            <Section title={he ? "סקירה כללית" : "Overview"}>
              <Field label={he ? "מלון / שירות" : "Hotel / Service"} value={booking.title} name="title" editable editMode={editMode} form={form} setForm={setForm} />
              <Field label={he ? "מדינה" : "Country"} value={booking.destination} name="destination" editable editMode={editMode} form={form} setForm={setForm} />
              <Field label={he ? "עיר" : "City"} value={booking.city} name="city" editable editMode={editMode} form={form} setForm={setForm} />
              <Field label={he ? "צ'ק-אין" : "Check-in"} value={fmt(booking.check_in, lang)} name="check_in" editable editMode={editMode} form={form} setForm={setForm} />
              <Field label={he ? "צ'ק-אאוט" : "Check-out"} value={fmt(booking.check_out, lang)} name="check_out" editable editMode={editMode} form={form} setForm={setForm} />
              <Field label={he ? "לילות" : "Nights"} value={booking.nights} name="nights" editable editMode={editMode} form={form} setForm={setForm} />
              <Field label={he ? "חדרים" : "Rooms"} value={booking.rooms} name="rooms" editable editMode={editMode} form={form} setForm={setForm} />
              <Field label={he ? "סוג חדר" : "Room type"} value={booking.room_type} name="room_type" editable editMode={editMode} form={form} setForm={setForm} />
              <Field label={he ? "ארוחה" : "Meal"} value={booking.meal} name="meal" editable editMode={editMode} form={form} setForm={setForm} />
              <Field label={he ? "ביטול ללא עלות עד" : "Free cancellation until"} value={fmt(booking.cancellation_date, lang)} name="cancellation_date" editable editMode={editMode} form={form} setForm={setForm} />
              <Field label={he ? "מחיר יומי ממוצע" : "Avg. daily rate"} value={money(booking.daily_rate)} name="daily_rate" editable editMode={editMode} form={form} setForm={setForm} />
              <Field label={he ? "סטטוס" : "Status"} value={st.label} name="status" editable editMode={editMode} form={form} setForm={setForm} />
            </Section>

            <Section title={he ? "אורח" : "Guest"}>
              <Field label={he ? "שם אורח" : "Guest name"} value={booking.guest_name} name="guest_name" editable editMode={editMode} form={form} setForm={setForm} />
              <Field label={he ? "אימייל" : "Email"} value={booking.guest_email} name="guest_email" editable editMode={editMode} form={form} setForm={setForm} />
              <Field label={he ? "מבוגרים" : "Adults"} value={booking.adults} name="adults" editable editMode={editMode} form={form} setForm={setForm} />
              <Field label={he ? "ילדים" : "Children"} value={booking.children} name="children" editable editMode={editMode} form={form} setForm={setForm} />
            </Section>

            <Section title={he ? "תשלום" : "Payment"}>
              <Field label={he ? "סה״כ" : "Total"} value={money(booking.total_price)} name="total_price" editable editMode={editMode} form={form} setForm={setForm} />
              <Field label={he ? "מטבע" : "Currency"} value={booking.currency} name="currency" editable editMode={editMode} form={form} setForm={setForm} />
              <Field label={he ? "תאריך פירעון" : "Payment due"} value={fmt(booking.payment_due, lang)} name="payment_due" editable editMode={editMode} form={form} setForm={setForm} />
              <Field label={he ? "שולם" : "Paid"} value={booking.paid ? (he ? "כן" : "Yes") : (he ? "לא" : "No")} name="paid" editable editMode={editMode} form={form} setForm={setForm} />
              <Field label={he ? "שולם בתאריך" : "Paid on"} value={fmt(booking.paid_on, lang)} name="paid_on" editable editMode={editMode} form={form} setForm={setForm} />
              <Field label={he ? "סוג תשלום" : "Payment type"} value={booking.payment_type} name="payment_type" editable editMode={editMode} form={form} setForm={setForm} />
              <Field label={he ? "מספר חשבונית" : "Invoice ID"} value={booking.invoice_id} name="invoice_id" editable editMode={editMode} form={form} setForm={setForm} />
              <Field label={he ? "מזהה ספק" : "Supplier ID"} value={booking.supplier_id} name="supplier_id" editable editMode={editMode} form={form} setForm={setForm} />
            </Section>

            <Section title={he ? "הערות" : "Notes"}>
              <Field label={he ? "פרטים נוספים" : "Details"} value={booking.details} name="details" editable editMode={editMode} form={form} setForm={setForm} />
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}