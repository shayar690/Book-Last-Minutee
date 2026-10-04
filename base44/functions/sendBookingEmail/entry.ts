// Send a booking receipt (HTML email) or voucher (PDF attachment) to the
// customer. Admin-only: the caller must be an admin. The booking is read with
// the service role so the admin can send for any customer's booking.
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { jsPDF } from 'npm:jspdf@4.2.1';

const BRAND = "Last-Minute Vacations";
const SITE_URL = "https://travelytime.co.il";

function fmt(d) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  } catch { return String(d); }
}

function money(amount, currency) {
  const sym = currency === "ILS" ? "₪" : "$";
  const n = Number(amount || 0).toLocaleString("en-US", { maximumFractionDigits: 2 });
  return `${sym}${n}${currency && currency !== "USD" && currency !== "ILS" ? " " + currency : ""}`;
}

// A simple, inbox-safe HTML email body for the receipt.
function receiptHtml(b) {
  const rows = [
    ["Booking reference", b.reference || "—"],
    ["Service", b.service || "—"],
    ["Hotel / Service", b.title || "—"],
    ["Destination", [b.destination, b.city].filter(Boolean).join(", ") || "—"],
    ["Check-in", fmt(b.check_in)],
    ["Check-out", fmt(b.check_out)],
    ["Nights", b.nights != null ? String(b.nights) : "—"],
    ["Rooms", b.rooms != null ? String(b.rooms) : "—"],
    ["Guests", [b.adults ? `${b.adults} adults` : null, b.children ? `${b.children} children` : null].filter(Boolean).join(", ") || "—"],
    ["Room type", b.room_type || "—"],
    ["Meal", b.meal || "—"],
    ["Total", money(b.total_price, b.currency)],
  ];
  const trs = rows.map(([k, v]) =>
    `<tr><td style="padding:8px 12px;color:#75758b;font-size:13px;border-bottom:1px solid #eef1f6">${k}</td><td style="padding:8px 12px;color:#0f1729;font-size:14px;border-bottom:1px solid #eef1f6;text-align:end">${v}</td></tr>`
  ).join("");
  return `<!doctype html><html><body style="margin:0;background:#f8fafc;font-family:Rubik,Arial,sans-serif">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e1e7ef">
    <div style="background:#f5d166;padding:20px 28px"><div style="font-size:18px;font-weight:700;color:#000">${BRAND}</div></div>
    <div style="padding:28px">
      <h1 style="margin:0 0 4px;font-size:22px;color:#0f1729">Booking receipt</h1>
      <p style="margin:0 0 20px;color:#65758b;font-size:14px">Thank you for booking with ${BRAND}. Here is your receipt.</p>
      <table style="width:100%;border-collapse:collapse">${trs}</table>
      <p style="margin:24px 0 0;color:#65758b;font-size:12px">View or manage your booking at <a href="${SITE_URL}" style="color:#0f1729">${SITE_URL}</a></p>
    </div>
  </div></body></html>`;
}

// A clean English voucher PDF (standard for international travel vouchers).
function voucherPdf(b) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 48;
  // Header band
  doc.setFillColor(245, 209, 102);
  doc.rect(0, 0, W, 70, "F");
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(BRAND, M, 44);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Booking Voucher", W - M, 44, { align: "right" });

  let y = 110;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text(String(b.title || "Booking"), M, y);
  y += 26;

  const line = (label, value) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(117, 117, 117);
    doc.text(String(label), M, y);
    doc.setTextColor(21, 21, 21);
    doc.setFont("helvetica", "bold");
    doc.text(String(value || "—"), W - M, y, { align: "right" });
    y += 22;
  };

  line("Booking reference", b.reference || b.id || "—");
  line("Guest", b.guest_name || "—");
  line("Destination", [b.destination, b.city].filter(Boolean).join(", ") || "—");
  line("Check-in", fmt(b.check_in));
  line("Check-out", fmt(b.check_out));
  line("Nights", b.nights != null ? String(b.nights) : "—");
  line("Rooms", b.rooms != null ? String(b.rooms) : "—");
  line("Adults", b.adults != null ? String(b.adults) : "—");
  line("Children", b.children != null ? String(b.children) : "—");
  line("Room type", b.room_type || "—");
  line("Meal", b.meal || "—");
  line("Total paid", money(b.total_price, b.currency));
  line("Status", b.status || "—");

  if (b.details) {
    y += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(117, 117, 117);
    const split = doc.splitTextToSize(String(b.details), W - M * 2);
    doc.text(split, M, y);
  }

  // Footer
  doc.setDrawColor(225, 231, 239);
  doc.line(M, 760, W - M, 760);
  doc.setFontSize(9);
  doc.setTextColor(117, 117, 117);
  doc.text(`${BRAND} - ${SITE_URL}`, M, 778);

  return doc.output("arraybuffer");
}

function toBase64(buf) {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return Response.json({ error: "Forbidden — admin only" }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const { bookingId, type = "receipt", to } = body;
    if (!bookingId) return Response.json({ error: "bookingId required" }, { status: 400 });
    if (type !== "receipt" && type !== "voucher") return Response.json({ error: "type must be receipt or voucher" }, { status: 400 });

    const b = await base44.asServiceRole.entities.Booking.get(bookingId);
    if (!b) return Response.json({ error: "Booking not found" }, { status: 404 });

    const recipient = to || b.guest_email;
    if (!recipient) return Response.json({ error: "No guest email on this booking. Add a guest email first." }, { status: 400 });

    if (type === "receipt") {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: recipient,
        subject: `Receipt — ${b.title || "booking"} (${b.reference || b.id})`,
        html: receiptHtml(b),
      });
      return Response.json({ ok: true, sent: "receipt", to: recipient });
    }

    // voucher
    const pdf = voucherPdf(b);
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: recipient,
      subject: `Voucher — ${b.title || "booking"} (${b.reference || b.id})`,
      html: `<div style="font-family:Rubik,Arial,sans-serif;font-size:15px;color:#0f1729"><p>Hi ${b.guest_name || ""},</p><p>Your booking voucher is attached. Present it at check-in.</p><p style="color:#65758b;font-size:13px">${BRAND}</p></div>`,
      attachments: [{ filename: `voucher-${b.reference || b.id}.pdf`, content: toBase64(pdf) }],
    });
    return Response.json({ ok: true, sent: "voucher", to: recipient });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}