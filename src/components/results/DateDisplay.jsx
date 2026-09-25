import React from "react";
import { useI18n } from "@/lib/i18n";

// Renders a date as "DD.MM.YYYY (Weekday)" with forced LTR layout.
// Uses bidi-override to guarantee the date appears before the weekday
// even inside an RTL parent — the weekday is wrapped in its own RTL
// override so Hebrew characters still render correctly.
export default function DateDisplay({ dateStr }) {
  const { lang } = useI18n();
  if (!dateStr) return null;

  const date = new Date(dateStr);
  const locale = lang === "he" ? "he-IL" : "en-US";
  const weekday = date.toLocaleDateString(locale, { weekday: "long" });
  const weekdayClean = lang === "he" ? weekday.replace("יום ", "") : weekday;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const datePart = `${dd}.${mm}.${yyyy}`;

  return (
    <span
      dir="ltr"
      style={{ unicodeBidi: "bidi-override", whiteSpace: "nowrap" }}
    >
      {datePart} (
      <span dir="rtl" style={{ unicodeBidi: "bidi-override" }}>
        {weekdayClean}
      </span>
      )
    </span>
  );
}