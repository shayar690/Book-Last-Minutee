import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const translations = {
  en: {
    "nav.flights": "Flights",
    "nav.hotels": "Hotels",
    "nav.cars": "Cars",
    "nav.transfers": "Transfers",
    "nav.destinations": "Destinations",
    "nav.deals": "Deals",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.book": "Book Now",
    "nav.myBookings": "My Bookings",
    "nav.login": "Log in",
    "nav.signup": "Sign up",
    "nav.logout": "Log out",

    "tab.flights": "Flights",
    "tab.hotels": "Hotels",
    "tab.cars": "Car rental",
    "tab.transfers": "Transfers",
    "tab.trains": "Trains",
    "tab.attractions": "Attractions & Activities",

    "search.attractionDestination": "Attraction or city",
    "search.attractionPlaceholder": "Eiffel Tower, Louvre, London…",
    "search.tickets": "Tickets",

    "search.destination": "Destination",
    "search.destinationPlaceholder": "City, hotel or airport",
    "search.from": "From",
    "search.to": "To",
    "search.flightFrom": "Origin city",
    "search.flightTo": "Where to fly?",
    "search.flightPlaceholder": "City or airport (e.g. ATH)",
    "search.transferPickupPlaceholder": "Airport terminal",
    "search.transferDropoffPlaceholder": "Hotel or address",
    "search.carPickupPlaceholder": "Airport or city",
    "search.trainFromPlaceholder": "Paris (GDN)",
    "search.trainToPlaceholder": "Amsterdam (AMS)",
    "search.departure": "Departure",
    "search.return": "Return",
    "search.checkIn": "Check-in",
    "search.checkOut": "Check-out",
    "search.guests": "Guests",
    "search.passengers": "Passengers",
    "search.adults": "Adults",
    "search.children": "Children",
    "search.adultsHint": "12 years and up",
    "search.childrenHint": "2–11 years",
    "search.infants": "Infants",
    "search.infantsHint": "Under 2 years",
    "search.infantWarningLine1": "Infants under 2 travel on an adult's lap",
    "search.infantWarningLine2": "- no separate seat",
    "search.groupLimitLine1": "For flight bookings of more than 9 passengers,",
    "search.groupLimitLine2": "please contact our customer service.",
    "search.rooms": "Rooms",
    "search.pickup": "Pick-up location",
    "search.dropoff": "Drop-off location",
    "search.date": "Date",
    "search.time": "Time",
    "search.search": "Search",
    "search.oneWay": "One way",
    "search.roundTrip": "Round trip",
    "search.additionalParams": "Additional parameters",
    "search.addDate": "Add date",
    "search.done": "Done",

    "hero.badge": "Powered by live RateHawk inventory",
    "hero.title": "Your journey begins in serenity",
    "hero.subtitle": "Search, compare and book flights, hotels, car rentals and transfers — all on one calm, considered platform.",

    "destinations.title": "Featured Destinations",
    "destinations.subtitle": "Hand-picked corners of the world, framed for the traveler who lingers.",
    "destinations.viewAll": "View all destinations",
    "destinations.from": "from",

    "hotels.title": "Popular Hotels & Resorts",
    "hotels.subtitle": "Sanctuaries vetted for light, space and stillness.",
    "hotels.perNight": "/ night",
    "hotels.bookNow": "View deal",

    "deals.title": "Last-Minute Escapes",
    "deals.subtitle": "Departures within reach — at prices worth the spontaneity.",
    "deals.save": "Save",
    "deals.perPerson": "/ person",

    "why.title": "Why book with ATLAS",
    "why.subtitle": "A booking experience designed to feel like the vacation itself.",
    "why.1.title": "Live, guaranteed pricing",
    "why.1.desc": "Every rate syncs in real time with RateHawk's inventory. The price you see is the price you pay.",
    "why.2.title": "All your travel, one place",
    "why.2.desc": "Flights, hotels, cars and transfers — compared and booked together without ever leaving the site.",
    "why.3.title": "No hidden fees",
    "why.3.desc": "Transparent, all-inclusive pricing. What's quoted is what's charged — down to the last cent.",
    "why.4.title": "Around-the-world support",
    "why.4.desc": "A multilingual concierge team across every time zone, ready before and during your trip.",

    "testimonials.title": "Travelers in their own words",
    "testimonials.subtitle": "Quiet confidence, shared by those who've already arrived.",

    "contact.title": "Speak with a travel concierge",
    "contact.subtitle": "Questions, bespoke itineraries, or group bookings — we're here, around the clock.",
    "contact.name": "Your name",
    "contact.email": "Email address",
    "contact.message": "How can we help?",
    "contact.send": "Send message",
    "contact.phone": "Phone",
    "contact.emailLabel": "Email",
    "contact.hours": "Concierge hours",
    "contact.hoursValue": "24 / 7, every day",
    "contact.sent": "Thank you — a concierge will reach out shortly.",

    "bookings.title": "My Bookings",
    "bookings.subtitle": "Every trip you've booked with ATLAS, in one place.",
    "bookings.empty": "You have no bookings yet. Start planning your next escape.",
    "bookings.emptyCta": "Search travel",
    "bookings.reference": "Booking ref",
    "bookings.guests": "guests",
    "bookings.status.pending": "Pending",
    "bookings.status.confirmed": "Confirmed",
    "bookings.status.cancelled": "Cancelled",

    "footer.tagline": "A pre-travel sanctuary. The world's inventory, booked with serenity.",
    "footer.explore": "Explore",
    "footer.company": "Company",
    "footer.support": "Support",
    "footer.newsletter": "The Atlas Letter",
    "footer.newsletterDesc": "Quiet offers and horizon notes, a few times a year.",
    "footer.subscribe": "Subscribe",
    "footer.rights": "All rights reserved.",
    "footer.worldClock": "Global Support Hub",
    "footer.legal": "Privacy",
    "footer.terms": "Terms",
    "footer.cookies": "Cookies",
    "footer.emailPlaceholder": "Email address",
  },
  he: {
    "nav.flights": "טיסות",
    "nav.hotels": "מלונות",
    "nav.cars": "השכרת רכב",
    "nav.transfers": "הסעות",
    "nav.destinations": "יעדים",
    "nav.deals": "מבצעים",
    "nav.about": "אודות",
    "nav.contact": "צור קשר",
    "nav.book": "הזמן עכשיו",
    "nav.myBookings": "ההזמנות שלי",
    "nav.login": "התחברות",
    "nav.signup": "הרשמה",
    "nav.logout": "התנתקות",

    "tab.flights": "טיסות",
    "tab.hotels": "מלונות",
    "tab.cars": "השכרת רכב",
    "tab.transfers": "הסעות",
    "tab.trains": "רכבות",
    "tab.attractions": "אטרקציות ופעילויות",

    "search.attractionDestination": "אטרקציה או עיר",
    "search.attractionPlaceholder": "מגדל אייפל, הלובר, לונדון…",
    "search.tickets": "כרטיסים",

    "search.destination": "יעד",
    "search.destinationPlaceholder": "עיר, מלון או שדה תעופה",
    "search.from": "מאין",
    "search.to": "לאן",
    "search.flightFrom": "עיר מוצא",
    "search.flightTo": "לאן טסים?",
    "search.flightPlaceholder": "עיר או שדה תעופה (למשל ATH)",
    "search.transferPickupPlaceholder": "טרמינל שדה התעופה",
    "search.transferDropoffPlaceholder": "מלון או כתובת",
    "search.carPickupPlaceholder": "שדה תעופה או עיר",
    "search.trainFromPlaceholder": "פריז (GDN)",
    "search.trainToPlaceholder": "אמסטרדם (AMS)",
    "search.departure": "יציאה",
    "search.return": "חזרה",
    "search.checkIn": "צ'ק-אין",
    "search.checkOut": "צ'ק-אאוט",
    "search.guests": "אורחים",
    "search.passengers": "נוסעים",
    "search.adults": "מבוגרים",
    "search.children": "ילדים",
    "search.adultsHint": "12 ומעלה",
    "search.childrenHint": "2-11",
    "search.infants": "תינוקות",
    "search.infantsHint": "עד שנתיים",
    "search.infantWarningLine1": "תינוקות עד גיל שנתיים ישבו",
    "search.infantWarningLine2": "על ברכי ההורים - ללא מושב נפרד",
    "search.groupLimitLine1": "להזמנת טיסה להרכב של יותר מ-9 נוסעים,",
    "search.groupLimitLine2": "יש לפנות לשירות הלקוחות שלנו",
    "search.rooms": "חדרים",
    "search.pickup": "מיקום איסוף",
    "search.dropoff": "מיקום הורדה",
    "search.date": "תאריך",
    "search.time": "שעה",
    "search.search": "חיפוש",
    "search.oneWay": "כיוון אחד",
    "search.roundTrip": "הלוך ושוב",
    "search.additionalParams": "פרמטרים נוספים",
    "search.addDate": "הוסף תאריך",
    "search.done": "סיום",

    "hero.badge": "מופעל על ידי מלאי חי של RateHawk",
    "hero.title": "המסע שלך מתחיל בשלווה",
    "hero.subtitle": "חפשו, השוו והזמינו טיסות, מלונות, השכרת רכב והסעות — הכל בפלטפורמה אחת שלווה ומתחשבת.",

    "destinations.title": "יעדים מומלצים",
    "destinations.subtitle": "פינות נבחרות בעולם, מותאמות למטייל שיודע להתעכב.",
    "destinations.viewAll": "כל היעדים",
    "destinations.from": "החל מ-",

    "hotels.title": "מלונות ואתרי נופש פופולריים",
    "hotels.subtitle": "מקלטים שנבחרו בקפידה על אור, מרחב ושקט.",
    "hotels.perNight": "/ לילה",
    "hotels.bookNow": "צפייה בעסקה",

    "deals.title": "בריחות של הרגע האחרון",
    "deals.subtitle": "יציאות בהישג יד — במחירים שכדאי לקפוץ עליהם.",
    "deals.save": "חיסכון",
    "deals.perPerson": "/ לאדם",

    "why.title": "למה להזמין עם ATLAS",
    "why.subtitle": "חוויית הזמנה שמרגישה כמו החופשה עצמה.",
    "why.1.title": "מחיר חי ומובטח",
    "why.1.desc": "כל מחיר מסתנכרן בזמן אמת עם מלאי RateHawk. המחיר שרואים הוא המחיר שמשלמים.",
    "why.2.title": "כל הנסיעות במקום אחד",
    "why.2.desc": "טיסות, מלונות, רכב והסעות — השוואה והזמנה ביחד, בלי לעזוב את האתר.",
    "why.3.title": "ללא עמלות נסתרות",
    "why.3.desc": "תמחור שקוף וכולל הכל. מה שמצוטט — מה שמשולם, עד האגורה.",
    "why.4.title": "תמיכה בכל העולם",
    "why.4.desc": "צוות קונסיירז' רב-לשוני בכל אזורי הזמן, לפני ובמהלך הנסיעה.",

    "testimonials.title": "מטיילים במילים שלהם",
    "testimonials.subtitle": "ביטחון שקט, משותף על ידי מי שכבר הגיעו.",

    "contact.title": "דברו עם קונסיירז' נסיעות",
    "contact.subtitle": "שאלות, מסלולים מותאמים או הזמנות קבוצתיות — אנחנו כאן, סביב השעון.",
    "contact.name": "שמך",
    "contact.email": "כתובת אימייל",
    "contact.message": "איך נוכל לעזור?",
    "contact.send": "שליחת הודעה",
    "contact.phone": "טלפון",
    "contact.emailLabel": "אימייל",
    "contact.hours": "שעות קונסיירז'",
    "contact.hoursValue": "24 / 7, כל יום",
    "contact.sent": "תודה — קונסיירז' ייצור איתך קשר בקרוב.",

    "bookings.title": "ההזמנות שלי",
    "bookings.subtitle": "כל נסיעה שהזמנת דרך ATLAS, במקום אחד.",
    "bookings.empty": "עדיין אין הזמנות. התחילו לתכנן את הבריחה הבאה.",
    "bookings.emptyCta": "חיפוש נסיעה",
    "bookings.reference": "מס' הזמנה",
    "bookings.guests": "אורחים",
    "bookings.status.pending": "בהמתנה",
    "bookings.status.confirmed": "מאושרת",
    "bookings.status.cancelled": "בוטלה",

    "footer.tagline": "מקדש שלפני הנסיעה. מלאי העולם, מוזמן בשלווה.",
    "footer.explore": "גלו",
    "footer.company": "חברה",
    "footer.support": "תמיכה",
    "footer.newsletter": "מכתב אטלס",
    "footer.newsletterDesc": "הצעות שקטות ופתקי אופק, פעמים אחדות בשנה.",
    "footer.subscribe": "הרשמה",
    "footer.rights": "כל הזכויות שמורות.",
    "footer.worldClock": "מוקד תמיכה עולמי",
    "footer.legal": "פרטיות",
    "footer.terms": "תנאים",
    "footer.cookies": "קובצי cookie",
    "footer.emailPlaceholder": "כתובת אימייל",
  },
};

const I18nContext = createContext({
  lang: "en",
  setLang: () => {},
  dir: "ltr",
  t: (key) => (translations.en[key] || key),
});

const LANG_STORAGE_KEY = "atlas_lang";

function getSavedLang() {
  if (typeof window === "undefined") return null;
  const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
  return saved === "he" || saved === "en" ? saved : null;
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => getSavedLang() || "en");
  const [hasPreference, setHasPreference] = useState(() => getSavedLang() !== null);
  const dir = lang === "he" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  // On first visit (no saved preference), detect language by IP geolocation:
  // visitors from Israel get Hebrew, everyone else gets English.
  useEffect(() => {
    if (hasPreference) return;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    (async () => {
      try {
        const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
        if (!res.ok) return;
        const data = await res.json();
        const country = (data?.country_code || "").toUpperCase();
        const detected = country === "IL" ? "he" : "en";
        setLang(detected);
        window.localStorage.setItem(LANG_STORAGE_KEY, detected);
      } catch {
        // keep default (en) on failure
      } finally {
        setHasPreference(true);
      }
    })();
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [hasPreference]);

  // Manual language change — persist so it overrides future auto-detection.
  const changeLang = useCallback((newLang) => {
    setLang(newLang);
    if (typeof window !== "undefined") window.localStorage.setItem(LANG_STORAGE_KEY, newLang);
  }, []);

  const t = useCallback((key) => translations[lang][key] || key, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang: changeLang, dir, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);