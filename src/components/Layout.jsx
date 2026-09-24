import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { Globe2, Menu, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/AuthContext";
import Footer from "@/components/Footer";

function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <div className="inline-flex items-center rounded-full border border-white/25 overflow-hidden">
      <button
        onClick={() => setLang("en")}
        className={`px-3 py-1.5 text-xs font-medium transition-colors ${lang === "en" ? "bg-white text-ink" : "text-white/80 hover:text-white"}`}
      >
        English
      </button>
      <button
        onClick={() => setLang("he")}
        className={`px-3 py-1.5 text-xs font-medium transition-colors ${lang === "he" ? "bg-white text-ink" : "text-white/80 hover:text-white"}`}
      >
        עברית
      </button>
    </div>
  );
}

function AuthLinks({ scrolled }) {
  const { t } = useI18n();
  const { isAuthenticated, logout } = useAuth();
  const linkClass = `text-sm font-medium transition-colors ${scrolled ? "text-ink/75 hover:text-gold" : "text-white/85 hover:text-white"}`;
  if (isAuthenticated) {
    return (
      <div className="hidden sm:flex items-center gap-4">
        <Link to="/bookings" className={linkClass}>{t("nav.myBookings")}</Link>
        <button onClick={() => logout()} className={linkClass}>{t("nav.logout")}</button>
      </div>
    );
  }
  return (
    <div className="hidden sm:flex items-center gap-4">
      <Link to="/login" className={linkClass}>{t("nav.login")}</Link>
      <Link to="/register" className="hidden md:inline-flex items-center h-9 px-4 rounded-full border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition">{t("nav.signup")}</Link>
    </div>
  );
}

function Header() {
  const { t } = useI18n();
  const { isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: t("nav.flights"), href: "#search" },
    { label: t("nav.hotels"), href: "#search" },
    { label: t("nav.destinations"), href: "#destinations" },
    { label: t("nav.deals"), href: "#search" },
    { label: t("nav.about"), href: "#why" },
    { label: t("nav.contact"), href: "#contact" },
  ];

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "glass shadow-horizon py-3" : "py-5 bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <Globe2 className={`w-6 h-6 ${scrolled ? "text-gold" : "text-white"}`} strokeWidth={1.25} />
          <span className={`font-display text-lg sm:text-2xl tracking-wide ${scrolled ? "text-ink" : "text-white"}`}>{t("brand.name")}</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.label} href={l.href} className={`text-sm font-medium transition-colors ${scrolled ? "text-ink/75 hover:text-gold" : "text-white/85 hover:text-white"}`}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className={scrolled ? "" : ""}>
            <LanguageSwitcher />
          </div>
          <AuthLinks scrolled={scrolled} />
          <a href="#search" className="hidden sm:inline-flex items-center h-10 px-5 rounded-full gold-foil text-ink text-sm font-semibold hover:brightness-105 transition">
            {t("nav.book")}
          </a>
          <button onClick={() => setOpen((v) => !v)} className={`lg:hidden ${scrolled ? "text-ink" : "text-white"}`}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden glass mt-3 mx-4 rounded-2xl p-5 border border-mist">
          <nav className="flex flex-col gap-4">
            {links.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="text-ink/80 font-medium">{l.label}</a>
            ))}
            <div className="h-px bg-mist my-1" />
            {isAuthenticated ? (
              <>
                <Link to="/bookings" onClick={() => setOpen(false)} className="text-ink/80 font-medium">{t("nav.myBookings")}</Link>
                <button onClick={() => { logout(); setOpen(false); }} className="text-start text-ink/80 font-medium">{t("nav.logout")}</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="text-ink/80 font-medium">{t("nav.login")}</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="text-ink/80 font-medium">{t("nav.signup")}</Link>
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