import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/AuthContext";
import Footer from "@/components/Footer";
import { Image } from "@/components/ui/image";

const LOGO_URL = "https://media.base44.com/images/public/6ab46eccdb257d5931954287/f840aa1b3_.png";

// Swap the leading /<locale> segment for a new locale, preserving the rest of
// the path and query string. Falls back to /<newLocale> for bare-root paths.
function swapLocale(pathname, search, newLocale) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length && (parts[0] === "he" || parts[0] === "en")) {
    parts[0] = newLocale;
  } else {
    parts.unshift(newLocale);
  }
  return "/" + parts.join("/") + search;
}

function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  const switchTo = (newLang) => {
    setLang(newLang);
    navigate(swapLocale(location.pathname, location.search, newLang), { replace: true });
  };

  return (
    <div dir="ltr" className="inline-flex items-center rounded-full border-2 border-ink/15 overflow-hidden">
      <button
        onClick={() => switchTo("en")}
        className={`px-5 py-2.5 text-base font-semibold transition-colors ${lang === "en" ? "bg-ink text-white" : "text-ink/70 hover:text-ink"}`}
      >
        English
      </button>
      <button
        onClick={() => switchTo("he")}
        className={`px-5 py-2.5 text-base font-semibold transition-colors ${lang === "he" ? "bg-ink text-white" : "text-ink/70 hover:text-ink"}`}
      >
        עברית
      </button>
    </div>
  );
}

function AuthLinks() {
  const { t, localePath } = useI18n();
  const { isAuthenticated, logout } = useAuth();
  const linkClass = "text-lg font-semibold text-ink/75 hover:text-gold transition-colors";
  if (isAuthenticated) {
    return (
      <div className="hidden sm:flex items-center gap-6">
        <Link to={localePath("/bookings")} className={linkClass}>{t("nav.myBookings")}</Link>
        <button onClick={() => logout()} className={linkClass}>{t("nav.logout")}</button>
      </div>
    );
  }
  return (
    <div className="hidden sm:flex items-center gap-6">
      <Link to="/login" className={linkClass}>{t("nav.login")}</Link>
      <Link to="/register" className="hidden md:inline-flex items-center h-11 px-6 rounded-full border-2 border-ink/20 text-ink text-base font-semibold hover:bg-ink hover:text-white transition">{t("nav.signup")}</Link>
    </div>
  );
}

function Header() {
  const { t, localePath } = useI18n();
  const { isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);

  // Auto-logout after 10 minutes of inactivity (security & privacy).
  useEffect(() => {
    if (!isAuthenticated) return;
    let timer;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => logout(), 10 * 60 * 1000);
    };
    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, reset));
    reset();
    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [isAuthenticated, logout]);

  const links = [
    { label: t("nav.flights"), href: "#search" },
    { label: t("nav.hotels"), href: "#search" },
    { label: t("nav.destinations"), href: "#destinations" },
    { label: t("nav.deals"), href: "#search" },
    { label: t("nav.about"), href: "#why" },
    { label: t("nav.contact"), href: "#contact" },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white shadow-horizon py-4">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between gap-6">
        {/* Logo at the start — left in English (LTR), right in Hebrew (RTL) */}
        <div className="flex items-center gap-5">
          <Link to={localePath("/")} className="flex items-center shrink-0">
            <Image src={LOGO_URL} alt={t("brand.name")} className="h-16 sm:h-20 w-16 sm:w-20 rounded-2xl shadow-sm" fittingType="fill" />
          </Link>
          <LanguageSwitcher />
        </div>

        <nav className="hidden lg:flex items-center gap-3">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="px-5 py-2.5 rounded-full bg-white border-2 border-gold/40 text-gold text-lg font-semibold hover:bg-gold hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <AuthLinks />
          <button onClick={() => setOpen((v) => !v)} className="lg:hidden text-ink">
            {open ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-white mt-3 mx-4 rounded-2xl p-6 border-2 border-mist shadow-horizon">
          <nav className="flex flex-col gap-5">
            {links.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="text-ink/80 text-lg font-semibold">{l.label}</a>
            ))}
            <div className="h-px bg-mist my-1" />
            {isAuthenticated ? (
              <>
                <Link to={localePath("/bookings")} onClick={() => setOpen(false)} className="text-ink/80 text-lg font-semibold">{t("nav.myBookings")}</Link>
                <button onClick={() => { logout(); setOpen(false); }} className="text-start text-ink/80 text-lg font-semibold">{t("nav.logout")}</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="text-ink/80 text-lg font-semibold">{t("nav.login")}</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="text-ink/80 text-lg font-semibold">{t("nav.signup")}</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default function Layout() {
  return (
    <div className="min-h-screen bg-ether">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}