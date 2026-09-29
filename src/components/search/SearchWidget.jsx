import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bed, Plane, Bus, Car, Ticket, Search, Calendar, Users, ChevronDown, Clock, ArrowRight, Package, Gem } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useI18n } from "@/lib/i18n";
import AutocompleteField from "@/components/search/AutocompleteField";
import FlightAutocompleteField from "@/components/search/FlightAutocompleteField";
import HotelRoomsField from "@/components/search/HotelRoomsField";
import DateField from "@/components/search/DateField";
import DatePickerModal from "@/components/search/DatePickerModal";
import AdditionalParams from "@/components/search/AdditionalParams";
import FlightsAdditionalParams from "@/components/search/FlightsAdditionalParams";

const TABS = [
  { id: "hotels", icon: Bed },
  { id: "flights", icon: Plane },
  { id: "vacationPackages", icon: Package, comingSoon: true },
  { id: "attractions", icon: Ticket, comingSoon: true },
  { id: "transfers", icon: Bus, comingSoon: true },
  { id: "cars", icon: Car, comingSoon: true },
  { id: "marriageProposals", icon: Gem },
];

function Field({ icon: Icon, label, placeholder, type = "text", flex = false }) {
  return (
    <div className={`flex flex-col gap-1 min-w-0 ${flex ? "flex-[1.6]" : "flex-1"}`}>
      <label className="text-[14px] font-medium text-[#5a5a5a]">{label}</label>
      <div className="flex items-center gap-2 px-3 h-12 rounded-lg bg-white border border-[#C5C5C5] focus-within:border-[#2D3035] transition-colors">
        <Icon className="w-4 h-4 text-[#7D7D7D] shrink-0" strokeWidth={1.5} />
        <input
          type={type}
          placeholder={placeholder}
          className="bg-transparent outline-none w-full text-base text-[#2D3035] placeholder:text-[#9a9a9a]"
        />
      </div>
    </div>
  );
}

function GuestsField({ t, mode = "rooms", onChange }) {
  const [open, setOpen] = useState(false);
  const isPassengers = mode === "passengers";
  const [adults, setAdults] = useState(isPassengers ? 1 : 2);
  const [rooms, setRooms] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [groupLimit, setGroupLimit] = useState(false);

  const totalPax = adults + children + infants;
  const guardIncrement = () => totalPax < 9;
  const onLimit = () => setGroupLimit(true);

  useEffect(() => {
    if (adults + children + infants < 9) setGroupLimit(false);
  }, [adults, children, infants]);
  useEffect(() => {
    if (onChange) onChange({ adults, rooms, children, infants });
  }, [adults, rooms, children, infants]);
  const label = isPassengers ? t("search.passengers") : t("search.guests");
  const summary = isPassengers
    ? [`${adults} ${t("search.adults")}`, `${children} ${t("search.children")}`, infants > 0 ? `${infants} ${t("search.infants")}` : null].filter(Boolean).join(" · ")
    : `${rooms} ${t("search.rooms")} · ${adults} ${t("search.adults")}`;
  return (
    <div className="relative flex flex-col gap-1 min-w-0 flex-1">
      <label className="text-[14px] font-medium text-[#5a5a5a]">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between gap-2 px-3 h-12 rounded-lg bg-white border border-[#C5C5C5] focus:border-[#2D3035] transition-colors"
      >
        <span className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#7D7D7D]" strokeWidth={1.5} />
          <span className="text-base text-[#2D3035]">{summary}</span>
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
            <Stepper label={t("search.adults")} hint={isPassengers ? t("search.adultsHint") : null} value={adults} setValue={setAdults} min={1} max={9} canIncrement={isPassengers ? guardIncrement : undefined} onMaxAttempt={isPassengers ? onLimit : undefined} />
            <div className="h-px bg-[#EAEAEA] my-3" />
            {isPassengers ? (
              <>
                <Stepper label={t("search.children")} hint={t("search.childrenHint")} value={children} setValue={setChildren} min={0} max={9} canIncrement={guardIncrement} onMaxAttempt={onLimit} />
                <div className="h-px bg-[#EAEAEA] my-3" />
                <Stepper label={t("search.infants")} hint={t("search.infantsHint")} value={infants} setValue={setInfants} min={0} max={9} canIncrement={guardIncrement} onMaxAttempt={onLimit} />
                <AnimatePresence>
                  {infants > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 text-center"
                    >
                      <p className="text-[13px] font-medium leading-snug text-red-600">{t("search.infantWarningLine1")}</p>
                      <p className="text-[13px] font-medium leading-snug text-red-600">{t("search.infantWarningLine2")}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {isPassengers && groupLimit && (adults + children + infants) >= 9 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 text-center"
                    >
                      <p className="text-[13px] font-medium leading-snug text-red-600">{t("search.groupLimitLine1")}</p>
                      <p className="text-[13px] font-medium leading-snug text-red-600">{t("search.groupLimitLine2")}</p>
                      <p className="text-[13px] font-medium leading-snug text-red-600">{t("search.groupLimitLine3")}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Stepper label={t("search.rooms")} value={rooms} setValue={setRooms} min={1} max={6} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stepper({ label, hint, value, setValue, min, max, onMaxAttempt, canIncrement }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex flex-col">
        <span className="text-sm text-[#2D3035]">{label}</span>
        {hint && <span className="text-[11px] text-[#9a9a9a]">{hint}</span>}
      </span>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => setValue(Math.max(min, value - 1))} className="w-7 h-7 rounded-full border border-[#C5C5C5] text-[#2D3035] hover:border-[#2D3035]">−</button>
        <span className="w-5 text-center text-sm">{value}</span>
        <button type="button" onClick={() => { if (value >= max || (canIncrement && !canIncrement())) { onMaxAttempt?.(); return; } setValue(Math.min(max, value + 1)); }} className="w-7 h-7 rounded-full border border-[#C5C5C5] text-[#2D3035] hover:border-[#2D3035]">+</button>
      </div>
    </div>
  );
}

// In the Base44 builder (Edit Preview) the app runs inside an iframe — there the
// "coming soon" tabs behave normally so the builder can design them. On the
// published site (top-level window) they show the red "coming soon" state.
const isEditor = typeof window !== "undefined" && window.self !== window.top;

export default function SearchWidget() {
  const { t, dir, lang } = useI18n();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [active, setActive] = useState("hotels");
  const [searching, setSearching] = useState(false);
  const [showParams, setShowParams] = useState(false);
  const [comingSoonClicked, setComingSoonClicked] = useState(new Set());

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [dateModal, setDateModal] = useState({ open: false, mode: "range", active: "in" });
  const [hotelDest, setHotelDest] = useState("");
  const [flightOrigin, setFlightOrigin] = useState({ name: "", code: "" });
  const [flightDest, setFlightDest] = useState({ name: "", code: "" });
  const [guestInfo, setGuestInfo] = useState({ adults: 2, rooms: 1 });
  const [paxInfo, setPaxInfo] = useState({ adults: 1, children: 0, infants: 0 });
  const [hotelParams, setHotelParams] = useState({});

  // Created inside the component so each render gets fresh element references.
  // If hoisted to module scope, React bails out of re-rendering these children
  // when the language changes, leaving their text stuck in the old locale.
  const paramsByTab = {
    hotels: <AdditionalParams onChange={setHotelParams} />,
    flights: <FlightsAdditionalParams />,
    vacationPackages: <AdditionalParams onChange={setHotelParams} />,
  };

  // Clear all search inputs when the site language changes.
  useEffect(() => {
    setCheckIn(null);
    setCheckOut(null);
    setShowParams(false);
    setDateModal({ open: false, mode: "range", active: "in" });
    setFlightOrigin(lang === "he" ? { name: "תל אביב (TLV)", code: "TLV" } : { name: "", code: "" });
    setFlightDest({ name: "", code: "" });
  }, [lang]);

  // Collapse additional params when switching tabs.
  useEffect(() => { setShowParams(false); }, [active]);

  // Required-field validation for the hotels tab.
  const hotelsMissing = active === "hotels" && (!hotelDest || !checkIn || !checkOut);

  const openRange = (field) => setDateModal({ open: true, mode: "range", active: field });
  const openSingle = () => setDateModal({ open: true, mode: "single", active: "in" });

  const handleDateSelect = (inDate, outDate) => {
    setCheckIn(inDate);
    if (dateModal.mode === "range") setCheckOut(outDate);
    setDateModal((m) => ({ ...m, open: false }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const fmtDate = (d) => d ? d.toISOString().split("T")[0] : "";
    if (active === "hotels" && hotelsMissing) {
      toast({ title: t("search.requiredFields"), variant: "destructive" });
      return;
    }
    if (active === "hotels" && hotelDest) {
      const params = new URLSearchParams({
        destination: hotelDest,
        checkIn: fmtDate(checkIn),
        checkOut: fmtDate(checkOut),
        adults: guestInfo.adults,
        rooms: guestInfo.rooms,
        stars: hotelParams.stars || "",
        meal: hotelParams.meal || "",
        earlyIn: hotelParams.earlyIn || "",
        lateOut: hotelParams.lateOut || "",
        freeCancel: hotelParams.freeCancel ? "1" : "",
      });
      navigate(`/hotels?${params.toString()}`);
    } else if (active === "flights" && flightOrigin.name && flightDest.name) {
      const params = new URLSearchParams({
        origin: flightOrigin.name || "",
        originCode: flightOrigin.code || "",
        destination: flightDest.name || "",
        destinationCode: flightDest.code || "",
        departureDate: fmtDate(checkIn),
        returnDate: fmtDate(checkOut),
        adults: paxInfo.adults,
      });
      navigate(`/flights?${params.toString()}`);
    }
  };

  return (
    <div className="w-full">
      {/* Tab bar */}
      <div className="grid grid-cols-2 gap-2 px-1.5 pb-1.5 pt-4 bg-white/95 rounded-t-2xl shadow-horizon w-full max-w-full sm:flex sm:flex-wrap sm:justify-center">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          const isComingSoon = tab.comingSoon;
          const wasClicked = comingSoonClicked.has(tab.id);
          const showComingSoon = isComingSoon && !isEditor && wasClicked;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === "marriageProposals") {
                  navigate("/marriage-proposals-dubai");
                } else if (isComingSoon && !isEditor) {
                  setComingSoonClicked((prev) => new Set(prev).add(tab.id));
                  setTimeout(() => {
                    setComingSoonClicked((prev) => {
                      const n = new Set(prev);
                      n.delete(tab.id);
                      return n;
                    });
                  }, 2500);
                } else {
                  setActive(tab.id);
                }
              }}
              className={`flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-500 whitespace-nowrap w-full sm:w-auto sm:justify-start ${
                tab.id === "vacationPackages" ? "col-span-2 sm:col-span-1" : ""
              } ${
                showComingSoon
                  ? "bg-red-600 text-white"
                  : isActive
                  ? "bg-[#2D3035] text-white"
                  : "bg-[#F5D166] text-[#2D3035] hover:bg-[#ECC45A]"
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={1.5} />
              {showComingSoon ? t("tab.comingSoon") : t(`tab.${tab.id}`)}
            </button>
          );
        })}
      </div>

      {/* Search card */}
      <form onSubmit={handleSearch} className="bg-white rounded-b-2xl p-4 sm:p-5 shadow-horizon relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${active}-${lang}`}
            initial={{ opacity: 0, x: dir === "rtl" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className={`flex flex-col gap-3 ${active === "flights" ? "" : "lg:flex-row lg:gap-2"}`}
          >
            {active === "hotels" && (
              <>
                <AutocompleteField label={t("search.destination")} placeholder={t("search.destinationPlaceholder")} flex filter="hotels" onSelect={(r) => setHotelDest(r.label)} />
                <DateField label={t("search.checkIn")} value={checkIn} placeholder={t("search.addDate")} active={dateModal.open && dateModal.active === "in"} onClick={() => openRange("in")} />
                <DateField label={t("search.checkOut")} value={checkOut} placeholder={t("search.addDate")} active={dateModal.open && dateModal.active === "out"} onClick={() => openRange("out")} />
                <HotelRoomsField onChange={setGuestInfo} />
              </>
            )}
            {active === "flights" && (
              <div className="flex flex-col gap-3 w-full">
                <div className="flex flex-col sm:flex-row gap-3">
                  <FlightAutocompleteField label={t("search.flightFrom")} placeholder={t("search.flightPlaceholder")} defaultValue={lang === "he" ? "תל אביב (TLV)" : ""} onSelect={(r) => setFlightOrigin({ name: `${r.city} (${r.iata})`, code: r.iata })} />
                  <FlightAutocompleteField label={t("search.flightTo")} placeholder={t("search.flightPlaceholder")} onSelect={(r) => setFlightDest({ name: `${r.city} (${r.iata})`, code: r.iata })} />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <DateField label={t("search.departure")} value={checkIn} placeholder={t("search.departureDate")} active={dateModal.open && dateModal.active === "in"} onClick={() => openRange("in")} />
                  <DateField label={t("search.return")} value={checkOut} placeholder={t("search.returnDate")} active={dateModal.open && dateModal.active === "out"} onClick={() => openRange("out")} />
                  <GuestsField t={t} mode="passengers" onChange={setPaxInfo} />
                </div>
              </div>
            )}
            {active === "vacationPackages" && (
              <>
                <FlightAutocompleteField label={t("search.flightFrom")} placeholder={t("search.flightPlaceholder")} defaultValue={lang === "he" ? "תל אביב (TLV)" : ""} />
                <AutocompleteField label={t("search.destination")} placeholder={t("search.destinationPlaceholder")} flex />
                <DateField label={t("search.checkIn")} value={checkIn} placeholder={t("search.addDate")} active={dateModal.open && dateModal.active === "in"} onClick={() => openRange("in")} />
                <DateField label={t("search.checkOut")} value={checkOut} placeholder={t("search.addDate")} active={dateModal.open && dateModal.active === "out"} onClick={() => openRange("out")} />
                <GuestsField t={t} />
              </>
            )}
            {active === "transfers" && (
              <>
                <AutocompleteField label={t("search.pickup")} placeholder={t("search.transferPickupPlaceholder")} flex />
                <AutocompleteField label={t("search.dropoff")} placeholder={t("search.transferDropoffPlaceholder")} flex />
                <DateField label={t("search.date")} value={checkIn} placeholder={t("search.addDate")} active={dateModal.open} onClick={openSingle} />
                <Field icon={Clock} label={t("search.time")} type="time" />
              </>
            )}
            {active === "cars" && (
              <>
                <AutocompleteField label={t("search.pickup")} placeholder={t("search.carPickupPlaceholder")} flex />
                <DateField label={t("search.date")} value={checkIn} placeholder={t("search.addDate")} active={dateModal.open} onClick={openSingle} />
                <Field icon={Clock} label={t("search.time")} type="time" />
                <GuestsField t={t} />
              </>
            )}
            {active === "attractions" && (
              <>
                <AutocompleteField label={t("search.attractionDestination")} placeholder={t("search.attractionPlaceholder")} flex />
                <DateField label={t("search.date")} value={checkIn} placeholder={t("search.addDate")} active={dateModal.open} onClick={openSingle} />
                <GuestsField t={t} />
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Additional parameters — tab-specific */}
        {paramsByTab[active] && (
          <>
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
                  {paramsByTab[active]}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

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

      <DatePickerModal
        open={dateModal.open}
        mode={dateModal.mode}
        active={dateModal.active}
        checkIn={checkIn}
        checkOut={checkOut}
        onSelect={handleDateSelect}
        onClose={() => setDateModal((m) => ({ ...m, open: false }))}
      />
    </div>
  );
}