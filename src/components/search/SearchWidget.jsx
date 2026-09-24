import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Building2, Car, Bus, Search, MapPin, Calendar, Users, ArrowRight, Clock } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const TABS = [
  { id: "flights", icon: Plane },
  { id: "hotels", icon: Building2 },
  { id: "cars", icon: Car },
  { id: "transfers", icon: Bus },
];

function Field({ icon: Icon, label, placeholder, type = "text" }) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0 flex-1">
      <label className="text-[11px] font-medium uppercase tracking-luxe text-muted-foreground">{label}</label>
      <div className="flex items-center gap-2 px-3.5 h-12 rounded-xl bg-white/70 border border-mist focus-within:border-accent transition-colors">
        <Icon className="w-4 h-4 text-gold shrink-0" strokeWidth={1.5} />
        <input
          type={type}
          placeholder={placeholder}
          className="bg-transparent outline-none w-full text-sm text-ink placeholder:text-muted-foreground/70"
        />
      </div>
    </div>
  );
}

function GuestsField({ t }) {
  const [open, setOpen] = useState(false);
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);
  return (
    <div className="relative flex flex-col gap-1.5 min-w-0 flex-1">
      <label className="text-[11px] font-medium uppercase tracking-luxe text-muted-foreground">{t("search.guests")}</label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3.5 h-12 rounded-xl bg-white/70 border border-mist focus:border-accent transition-colors text-start"
      >
        <Users className="w-4 h-4 text-gold shrink-0" strokeWidth={1.5} />
        <span className="text-sm text-ink">{adults} {t("search.adults")} · {rooms} {t("search.rooms")}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full mt-2 z-30 w-64 p-4 rounded-2xl glass shadow-horizon border border-mist"
          >
            <Stepper label={t("search.adults")} value={adults} setValue={setAdults} min={1} max={9} />
            <div className="h-px bg-mist my-3" />
            <Stepper label={t("search.rooms")} value={rooms} setValue={setRooms} min={1} max={6} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stepper({ label, value, setValue, min, max }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-ink">{label}</span>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => setValue(Math.max(min, value - 1))} className="w-7 h-7 rounded-full border border-mist text-ink hover:border-accent">−</button>
        <span className="w-5 text-center text-sm">{value}</span>
        <button type="button" onClick={() => setValue(Math.min(max, value + 1))} className="w-7 h-7 rounded-full border border-mist text-ink hover:border-accent">+</button>
      </div>
    </div>
  );
}

export default function SearchWidget() {
  const { t, dir } = useI18n();
  const [active, setActive] = useState("hotels");
  const [searching, setSearching] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearching(true);
    setTimeout(() => setSearching(false), 1800);
  };

  return (
    <div className="w-full">
      {/* Tab switcher */}
      <div className="flex gap-1 p-1 rounded-t-2xl glass-dark w-fit">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`relative flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive ? "text-ink" : "text-white/70 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={1.5} />
              <span className="hidden sm:inline">{t(`tab.${tab.id}`)}</span>
              {isActive && (
                <motion.div
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-xl bg-ether -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Search body */}
      <form onSubmit={handleSearch} className="glass shadow-horizon rounded-2xl rounded-tl-none p-4 sm:p-5 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: dir === "rtl" ? -24 : 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir === "rtl" ? 24 : -24 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex flex-col lg:flex-row gap-3"
          >
            {active === "flights" && (
              <>
                <Field icon={MapPin} label={t("search.from")} placeholder="London (LHR)" />
                <Field icon={MapPin} label={t("search.to")} placeholder="Santorini (JTR)" />
                <Field icon={Calendar} label={t("search.departure")} type="date" />
                <Field icon={Calendar} label={t("search.return")} type="date" />
                <GuestsField t={t} />
              </>
            )}
            {active === "hotels" && (
              <>
                <Field icon={MapPin} label={t("search.destination")} placeholder={t("search.destinationPlaceholder")} />
                <Field icon={Calendar} label={t("search.checkIn")} type="date" />
                <Field icon={Calendar} label={t("search.checkOut")} type="date" />
                <GuestsField t={t} />
              </>
            )}
            {active === "cars" && (
              <>
                <Field icon={MapPin} label={t("search.pickup")} placeholder="Airport or city" />
                <Field icon={Calendar} label={t("search.date")} type="date" />
                <Field icon={Clock} label={t("search.time")} type="time" />
                <GuestsField t={t} />
              </>
            )}
            {active === "transfers" && (
              <>
                <Field icon={MapPin} label={t("search.pickup")} placeholder="Airport terminal" />
                <Field icon={MapPin} label={t("search.dropoff")} placeholder="Hotel or address" />
                <Field icon={Calendar} label={t("search.date")} type="date" />
                <Field icon={Clock} label={t("search.time")} type="time" />
                <GuestsField t={t} />
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={searching}
            className="group inline-flex items-center gap-2 px-7 h-12 rounded-xl gold-foil text-ink font-semibold text-sm shadow-horizon hover:brightness-105 transition disabled:opacity-70"
          >
            {searching ? (
              <span className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" strokeWidth={2} />
                {t("search.search")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform rtl:rotate-180" strokeWidth={2} />
              </>
            )}
          </button>
        </div>

        {/* horizon progress bar */}
        <AnimatePresence>
          {searching && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
              className="absolute bottom-0 inset-x-0 h-0.5 origin-left bg-gradient-to-r from-transparent via-accent to-transparent"
            />
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}