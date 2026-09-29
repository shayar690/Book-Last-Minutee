import React from "react";
import { useI18n } from "@/lib/i18n";

// Renders a date as "Weekday | DD.MM.YYYY" with language-appropriate direction.
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
    <span dir={lang === "he" ? "rtl" : "ltr"} style={{ whiteSpace: "nowrap" }}>
      {weekdayClean}, {datePart}
    </span>
  );
}