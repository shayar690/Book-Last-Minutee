import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bed, Plane, Bus, Car, Train, Search, Calendar, Users, ChevronDown, Clock, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import AutocompleteField from "@/components/search/AutocompleteField";

const TABS = [
  { id: "hotels", icon: Bed },
  { id: "flights", icon: Plane },
  { id: "transfers", icon: Bus },
  { id: "cars", icon: Car },
  { id: "trains", icon: Train },
];

function Field({ icon: Icon, label, placeholder, type = "text", flex = false }) {
  return (
    <div className={`flex flex-col gap-1 min-w-0 ${flex ? "flex-[1.6]" : "flex-1"}`}>
      <label className="text-[11px] font-medium text-[#7D7D7D]">{label}</label>
      <div className="flex items-center gap-2 px-3 h-12 rounded-lg bg-white border border-[#C5C5C5] focus-within:border-[#2D3035] transition-colors">
        <Icon className="w-4 h-4 text-[#7D7D7D] shrink-0" strokeWidth={1.5} />
        <input
          type={type}
          placeholder={placeholder}
          className="bg-transparent outline-none w-full text-sm text-[#2D3035] placeholder:text-[#9a9a9a]"
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
    <div className="relative flex flex-col gap-1 min-w-0 flex-1">
      <label className="text-[11px] font-medium text-[#7D7D7D]">{t("search.guests")}</label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between gap-2 px-3 h-12 rounded-lg bg-white border border-[#C5C5C5] focus:border-[#2D3035] transition-colors"
      >
        <span className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#7D7D7D]" strokeWidth={1.5} />
          <span className="text-sm text-[#2D3035]">{rooms} {t("search.rooms")} · {adults} {t("search.adults")}</span>
        </span>
        <ChevronDown className="w-4 h-4 text-[#7D7D7D]" strokeWidth={1.5} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full mt-2 z-30 w-64 p-4 rounded-xl bg-white border border-[#C5C5C5] shadow-horizon"
          >
            <Stepper label={t("search.adults")} value={adults} setValue={setAdults} min={1} max={9} />
            <div className="h-px bg-[#EAEAEA] my-3" />
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
      <span className="text-sm text-[#2D3035]">{label}</span>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => setValue(Math.max(min, value - 1))} className="w-7 h-7 rounded-full border border-[#C5C5C5] text-[#2D3035] hover:border-[#2D3035]">−</button>
        <span className="w-5 text-center text-sm">{value}</span>
        <button type="button" onClick={() => setValue(Math.min(max, value + 1))} className="w-7 h-7 rounded-full border border-[#C5C5C5] text-[#2D3035] hover:border-[#2D3035]">+</button>
      </div>
    </div>
  );
}

export default function SearchWidget() {
  const { t, dir } = useI18n();
  const [active, setActive] = useState("hotels");
  const [searching, setSearching] = useState(false);
  const [showParams, setShowParams] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearching(true);
    setTimeout(() => setSearching(false), 1800);
  };

  return (
    <div className="w-full">
      {/* Tab bar */}
      <div className="flex flex-wrap gap-1.5 p-1.5 bg-white/95 rounded-t-2xl shadow-horizon w-fit max-w-full overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                isActive ? "bg-[#2D3035] text-white" : "bg-[#FFFAD9] text-[#2D3035] hover:bg-[#FFF3B0]"
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={1.5} />
              {t(`tab.${tab.id}`)}
            </button>
          );
        })}
      </div>

      {/* Search card */}
      <form onSubmit={handleSearch} className="bg-white rounded-2xl rounded-tl-none p-4 sm:p-5 shadow-horizon relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: dir === "rtl" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="flex flex-col lg:flex-row gap-3 lg:gap-2"
          >
            {active === "hotels" && (
              <>
                <AutocompleteField label={t("search.destination")} placeholder={t("search.destinationPlaceholder")} flex />
                <Field icon={Calendar} label={t("search.checkIn")} type="date" />
                <Field icon={Calendar} label={t("search.checkOut")} type="date" />
                <GuestsField t={t} />
              </>
            )}
            {active === "flights" && (
              <>
                <AutocompleteField label={t("search.from")} placeholder="London (LHR)" />
                <AutocompleteField label={t("search.to")} placeholder="Santorini (JTR)" />
                <Field icon={Calendar} label={t("search.departure")} type="date" />
                <Field icon={Calendar} label={t("search.return")} type="date" />
                <GuestsField t={t} />
              </>
            )}
            {active === "transfers" && (
              <>
                <AutocompleteField label={t("search.pickup")} placeholder="Airport terminal" flex />
                <AutocompleteField label={t("search.dropoff")} placeholder="Hotel or address" flex />
                <Field icon={Calendar} label={t("search.date")} type="date" />
                <Field icon={Clock} label={t("search.time")} type="time" />
              </>
            )}
            {active === "cars" && (
              <>
                <AutocompleteField label={t("search.pickup")} placeholder="Airport or city" flex />
                <Field icon={Calendar} label={t("search.date")} type="date" />
                <Field icon={Clock} label={t("search.time")} type="time" />
                <GuestsField t={t} />
              </>
            )}
            {active === "trains" && (
              <>
                <AutocompleteField label={t("search.from")} placeholder="Paris (GDN)" flex />
                <AutocompleteField label={t("search.to")} placeholder="Amsterdam (AMS)" flex />
                <Field icon={Calendar} label={t("search.date")} type="date" />
                <Field icon={Clock} label={t("search.time")} type="time" />
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Additional parameters */}
        <button
          type="button"
          onClick={() => setShowParams((v) => !v)}
          className="flex items-center gap-1.5 mt-3 text-sm text-[#7D7D7D] hover:text-[#2D3035] transition-colors"
        >
          {t("search.additionalParams")}
          <ChevronDown className={`w-4 h-4 transition-transform ${showParams ? "rotate-180" : ""}`} strokeWidth={1.5} />
        </button>
        <AnimatePresence>
          {showParams && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <Field icon={Users} label={t("search.children")} placeholder="0" type="number" />
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-[11px] font-medium text-[#7D7D7D]">{t("search.rooms")}</label>
                  <select className="h-12 px-3 rounded-lg bg-white border border-[#C5C5C5] text-sm text-[#2D3035] outline-none focus:border-[#2D3035]">
                    <option>1</option><option>2</option><option>3</option><option>4</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search button */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={searching}
            className="group inline-flex items-center justify-center gap-2 px-8 h-12 rounded-lg bg-[#F5D166] text-[#2D3035] font-bold text-sm hover:brightness-105 transition disabled:opacity-80 w-full sm:w-auto"
          >
            {searching ? (
              <span className="w-4 h-4 border-2 border-[#2D3035]/30 border-t-[#2D3035] rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" strokeWidth={2} />
                {t("search.search")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform rtl:rotate-180" strokeWidth={2} />
              </>
            )}
          </button>
        </div>

        <AnimatePresence>
          {searching && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
              className="absolute bottom-0 inset-x-0 h-0.5 origin-left bg-gradient-to-r from-transparent via-[#F5D166] to-transparent"
            />
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}