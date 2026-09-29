import React, { useEffect } from "react";
import { Outlet, useParams, Navigate, useLocation } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

const VALID = ["he", "en"];

// Validates the `:locale` URL segment, syncs the i18n language to it, and
// renders the nested routes. Invalid locales redirect to the detected lang.
export default function LocaleLayout() {
  const { locale } = useParams();
  const { lang, setLang } = useI18n();
  const location = useLocation();

  useEffect(() => {
    if (VALID.includes(locale) && locale !== lang) {
      setLang(locale);
    }
  }, [locale, lang, setLang]);

  if (!VALID.includes(locale)) {
    const rest = location.pathname.split("/").slice(2).join("/");
    const target = `/${lang}${rest ? "/" + rest : ""}${location.search}`;
    return <Navigate to={target} replace />;
  }

  return <Outlet />;
}

// Redirects the bare root "/" to the active-locale home.
export function LocaleRedirect() {
  const { lang } = useI18n();
  return <Navigate to={`/${lang}`} replace />;
}