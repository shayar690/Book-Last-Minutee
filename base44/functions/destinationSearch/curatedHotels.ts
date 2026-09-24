// Curated database of iconic / popular hotels with English names.
// Supplements Photon (OSM) for partial-name matching: many luxury hotels in OSM
// are stored under a local-language name only (e.g. Arabic in Dubai), so short
// English prefixes like "Five Pa" can't match the "Palm" token via Photon.
// These entries are prefix/word-boundary matched and surfaced above Photon results.
export interface CuratedHotel {
  name: string;
  name_he?: string;
  city: string;
  city_he?: string;
  country: string;
  country_he?: string;
  lat: number;
  lon: number;
}

export const CURATED_HOTELS: CuratedHotel[] = [
  // --- Dubai (UAE) ---
  { name: "FIVE Palm Jumeirah Hotel", name_he: "פייב פאלם ג'ומיירה דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.1170, lon: 55.1340 },
  { name: "FIVE Jumeirah Village Hotel", name_he: "פייב ג'ומיירה וילג' דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.0630, lon: 55.1730 },
  { name: "FIVE Luxe Jumeirah Village", name_he: "פייב לוקס ג'ומיירה וילג' דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.0640, lon: 55.1720 },
  { name: "Paramount Hotel Midtown", name_he: "פראמאונט מידטאון דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.1934, lon: 55.2654 },
  { name: "Paramount Tower Dubai", name_he: "פראמאונט טאואר דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.1932, lon: 55.2652 },
  { name: "DAMAC Paramount Hotel & Residences", name_he: "דאמאק פראמאונט דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.1859, lon: 55.2918 },
  { name: "Burj Al Arab Jumeirah", name_he: "בורג' אל ערב ג'ומיירה", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.1413, lon: 55.1854 },
  { name: "Atlantis The Palm", name_he: "אטלנטיס דה פאלם דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.1300, lon: 55.1160 },
  { name: "Atlantis The Royal", name_he: "אטלנטיס דה רויאל דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.1250, lon: 55.1160 },
  { name: "Armani Hotel Dubai", name_he: "ארמני מלון דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.1970, lon: 55.2740 },
  { name: "Jumeirah Beach Hotel", name_he: "ג'ומיירה ביץ' דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.1430, lon: 55.1830 },
  { name: "Madinat Jumeirah Al Qasr", name_he: "מדינת ג'ומיירה אל קאסר", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.1440, lon: 55.1810 },
  { name: "Madinat Jumeirah Mina A'Salam", name_he: "מדינת ג'ומיירה מינה א סאלאם", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.1440, lon: 55.1800 },
  { name: "One&Only The Palm", name_he: "וואן אנד אונלי דה פאלם דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.1120, lon: 55.1390 },
  { name: "Waldorf Astoria Dubai Palm Jumeirah", name_he: "וולדורף אסטוריה דובאי פאלם ג'ומיירה", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.1100, lon: 55.1390 },
  { name: "Four Seasons Resort Dubai at Jumeirah Beach", name_he: "ארבע עונות דובאי ג'ומיירה ביץ'", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.1510, lon: 55.1900 },
  { name: "Four Seasons Hotel DIFC", name_he: "ארבע עונות דובאי DIFC", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.2130, lon: 55.2830 },
  { name: "Raffles Dubai", name_he: "ראפלס דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.2250, lon: 55.2870 },
  { name: "The Address Boulevard", name_he: "דה אדרס בולווארד דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.1980, lon: 55.2750 },
  { name: "Address Sky View", name_he: "אדרס סקיי ויו דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.1950, lon: 55.2710 },
  { name: "Address Beach Resort", name_he: "אדרס ביץ' ריזורט דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.0830, lon: 55.1360 },
  { name: "Address Dubai Marina", name_he: "אדרס דובאי מרינה", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.0800, lon: 55.1400 },
  { name: "Bulgari Resort Dubai", name_he: "בולגארי ריזורט דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.0950, lon: 55.1350 },
  { name: "Mandarin Oriental Jumeira, Dubai", name_he: "מנדרין אוריינטל ג'ומיירה דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.1860, lon: 55.2430 },
  { name: "W Dubai - The Palm", name_he: "W דובאי - דה פאלם", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.1180, lon: 55.1330 },
  { name: "W Dubai Mina Seyahi", name_he: "W דובאי מינה סיאהי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.1430, lon: 55.1760 },
  { name: "JW Marriott Marquis Dubai", name_he: "JW מריוט מרקיז דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.1870, lon: 55.2630 },
  { name: "The Ritz-Carlton Dubai", name_he: "ריץ-קרלטון דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.1410, lon: 55.1850 },
  { name: "The Ritz-Carlton Dubai DIFC", name_he: "ריץ-קרלטון דובאי DIFC", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.2130, lon: 55.2830 },
  { name: "Grand Hyatt Dubai", name_he: "גרנד הייאט דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.2260, lon: 55.2880 },
  { name: "Park Hyatt Dubai", name_he: "פארק הייאט דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.2530, lon: 55.3270 },
  { name: "Hyatt Regency Dubai", name_he: "הייאט ריג'נסי דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.2650, lon: 55.3070 },
  { name: "Le Royal Meridien Beach Resort & Spa", name_he: "לה רויאל מרידיאן ביץ' דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.1430, lon: 55.1760 },
  { name: "Grosvenor House Dubai", name_he: "גרוסבנור האוס דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.1430, lon: 55.1760 },
  { name: "Jumeirah Emirates Towers", name_he: "ג'ומיירה אמירטס טאוארס דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.2170, lon: 55.2830 },
  { name: "The Palace Downtown Dubai", name_he: "דה פאלאס דאונטאון דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.1930, lon: 55.2760 },
  { name: "Sofitel Dubai Downtown", name_he: "סופיטל דאונטאון דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.1920, lon: 55.2760 },
  { name: "Sofitel Dubai The Palm Resort & Spa", name_he: "סופיטל דובאי דה פאלם", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.1200, lon: 55.1360 },
  { name: "Hilton Dubai Jumeirah", name_he: "הילטון דובאי ג'ומיירה", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.1430, lon: 55.1760 },
  { name: "Anantara The Palm Dubai Resort", name_he: "אנאנטרה דה פאלם דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 25.1180, lon: 55.1360 },
  { name: "Bab Al Shams Desert Resort & Spa", name_he: "באב אל שאמס דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 24.8430, lon: 55.3280 },
  { name: "Emirates Palace Abu Dhabi", name_he: "אמירטס פאלאס אבו דאבי", city: "Abu Dhabi", city_he: "אבו דאבי", country: "United Arab Emirates", country_he: "איחוד האמירויות", lat: 24.4620, lon: 54.3220 },

  // --- Paris ---
  { name: "The Ritz Paris", city: "Paris", country: "France", lat: 48.8680, lon: 2.3288 },
  { name: "Le Bristol Paris", city: "Paris", country: "France", lat: 48.8700, lon: 2.3000 },
  { name: "Plaza Athénée Paris", city: "Paris", country: "France", lat: 48.8700, lon: 2.3000 },
  { name: "Four Seasons Hotel George V Paris", city: "Paris", country: "France", lat: 48.8680, lon: 2.3000 },
  { name: "Hôtel de Crillon Paris", city: "Paris", country: "France", lat: 48.8680, lon: 2.3210 },

  // --- London ---
  { name: "The Savoy London", city: "London", country: "United Kingdom", lat: 51.5100, lon: -0.1230 },
  { name: "Claridge's London", city: "London", country: "United Kingdom", lat: 51.5120, lon: -0.1490 },
  { name: "The Ritz London", city: "London", country: "United Kingdom", lat: 51.5080, lon: -0.1410 },
  { name: "The Langham London", city: "London", country: "United Kingdom", lat: 51.5180, lon: -0.1420 },
  { name: "Shangri-La Hotel London", city: "London", country: "United Kingdom", lat: 51.5040, lon: -0.0790 },

  // --- New York ---
  { name: "The Plaza Hotel", city: "New York", country: "United States", lat: 40.7640, lon: -73.9750 },
  { name: "Waldorf Astoria New York", city: "New York", country: "United States", lat: 40.7540, lon: -73.9740 },
  { name: "Four Seasons Hotel New York", city: "New York", country: "United States", lat: 40.7600, lon: -73.9730 },
  { name: "The Ritz-Carlton New York Central Park", city: "New York", country: "United States", lat: 40.7690, lon: -73.9800 },

  // --- Ibiza / Spain ---
  { name: "Ushuaïa Ibiza Beach Hotel", city: "Ibiza", country: "Spain", lat: 38.9080, lon: 1.3940 },
  { name: "Hard Rock Hotel Ibiza", city: "Ibiza", country: "Spain", lat: 38.9090, lon: 1.3960 },
  { name: "Pacha Ibiza Hotel", city: "Ibiza", country: "Spain", lat: 38.9190, lon: 1.4340 },
  { name: "ME Ibiza", city: "Ibiza", country: "Spain", lat: 38.9160, lon: 1.4210 },
  { name: "Six Senses Ibiza", city: "Ibiza", country: "Spain", lat: 38.9160, lon: 1.4210 },
  { name: "W Barcelona", city: "Barcelona", country: "Spain", lat: 41.3660, lon: 2.1930 },
  { name: "Hotel Arts Barcelona", city: "Barcelona", country: "Spain", lat: 41.3850, lon: 2.1980 },
  { name: "Mandarin Oriental Ritz Madrid", city: "Madrid", country: "Spain", lat: 40.4170, lon: -3.6900 },
  { name: "Hôtel du Cap-Eden-Roc", city: "Antibes", country: "France", lat: 43.6910, lon: 7.1240 },

  // --- Las Vegas ---
  { name: "Bellagio Las Vegas", city: "Las Vegas", country: "United States", lat: 36.1130, lon: -115.1760 },
  { name: "Caesars Palace Las Vegas", city: "Las Vegas", country: "United States", lat: 36.1160, lon: -115.1740 },
  { name: "The Venetian Las Vegas", city: "Las Vegas", country: "United States", lat: 36.1210, lon: -115.1700 },
  { name: "Wynn Las Vegas", city: "Las Vegas", country: "United States", lat: 36.1270, lon: -115.1660 },
  { name: "ARIA Resort & Casino Las Vegas", city: "Las Vegas", country: "United States", lat: 36.1080, lon: -115.1720 },

  // --- Miami ---
  { name: "Eden Roc Miami Beach", city: "Miami Beach", country: "United States", lat: 25.8470, lon: -80.1240 },
  { name: "Fontainebleau Miami Beach", city: "Miami Beach", country: "United States", lat: 25.8290, lon: -80.1210 },
  { name: "The Setai Miami Beach", city: "Miami Beach", country: "United States", lat: 25.8400, lon: -80.1200 },

  // --- Asia icons ---
  { name: "Aman Tokyo", city: "Tokyo", country: "Japan", lat: 35.6720, lon: 139.7630 },
  { name: "Mandarin Oriental Tokyo", city: "Tokyo", country: "Japan", lat: 35.6720, lon: 139.7630 },
  { name: "Park Hyatt Tokyo", city: "Tokyo", country: "Japan", lat: 35.6850, lon: 139.6900 },
  { name: "The Peninsula Hong Kong", city: "Hong Kong", country: "Hong Kong", lat: 22.2930, lon: 114.1820 },
  { name: "The Ritz-Carlton Hong Kong", city: "Hong Kong", country: "Hong Kong", lat: 22.3040, lon: 114.1610 },
  { name: "Mandarin Oriental Bangkok", city: "Bangkok", country: "Thailand", lat: 13.7270, lon: 100.5130 },
  { name: "The Siam Bangkok", city: "Bangkok", country: "Thailand", lat: 13.7900, lon: 100.5400 },
  { name: "Amanbagh Agra", city: "Agra", country: "India", lat: 27.1600, lon: 77.9800 },
  { name: "The Taj Mahal Palace Mumbai", city: "Mumbai", country: "India", lat: 18.9220, lon: 72.8340 },

  // --- Israel ---
  { name: "THE YACHT - By Fattal Limited Edition", name_he: "THE YACHT - פאטל מהדורה מוגבלת", city: "Herzliya", city_he: "הרצליה", country: "Israel", country_he: "ישראל", lat: 32.1620, lon: 34.8030 },
  { name: "InterContinental David Tel Aviv", name_he: "דייויד אינטרקונטיננטל תל אביב", city: "Tel Aviv", city_he: "תל אביב", country: "Israel", country_he: "ישראל", lat: 32.0790, lon: 34.7700 },
  { name: "The David Kempinski Tel Aviv", name_he: "דייויד קמפינסקי תל אביב", city: "Tel Aviv", city_he: "תל אביב", country: "Israel", country_he: "ישראל", lat: 32.0780, lon: 34.7710 },
  { name: "The Ritz-Carlton Herzliya", name_he: "ריץ-קרלטון הרצליה", city: "Herzliya", city_he: "הרצליה", country: "Israel", country_he: "ישראל", lat: 32.1590, lon: 34.8050 },
  { name: "Carlton Tel Aviv Hotel", name_he: "קרלטון תל אביב", city: "Tel Aviv", city_he: "תל אביב", country: "Israel", country_he: "ישראל", lat: 32.0840, lon: 34.7690 },
  { name: "Dan Tel Aviv", name_he: "מלון דן תל אביב", city: "Tel Aviv", city_he: "תל אביב", country: "Israel", country_he: "ישראל", lat: 32.0810, lon: 34.7680 },
  { name: "Royal Beach Tel Aviv by Isrotel Exclusive", name_he: "רויאל ביץ' תל אביב - ישרוטל אקסקלוסיב", city: "Tel Aviv", city_he: "תל אביב", country: "Israel", country_he: "ישראל", lat: 32.0790, lon: 34.7700 },
  { name: "The Setai Tel Aviv", name_he: "סטאי תל אביב", city: "Tel Aviv", city_he: "תל אביב", country: "Israel", country_he: "ישראל", lat: 32.0820, lon: 34.7670 },
  { name: "W Tel Aviv - Jaffa", name_he: "W תל אביב - יפו", city: "Tel Aviv", city_he: "תל אביב", country: "Israel", country_he: "ישראל", lat: 32.0800, lon: 34.7640 },
  { name: "Isrotel King David Jerusalem", name_he: "מלך דוד ירושלים - ישרוטל", city: "Jerusalem", city_he: "ירושלים", country: "Israel", country_he: "ישראל", lat: 31.7720, lon: 35.2210 },
  { name: "Mamilla Hotel Jerusalem", name_he: "ממילה ירושלים", city: "Jerusalem", city_he: "ירושלים", country: "Israel", country_he: "ישראל", lat: 31.7720, lon: 35.2230 },
  { name: "Waldorf Astoria Jerusalem", name_he: "וולדורף אסטוריה ירושלים", city: "Jerusalem", city_he: "ירושלים", country: "Israel", country_he: "ישראל", lat: 31.7730, lon: 35.2180 },
  { name: "Isrotel Royal Rimonim Dead Sea", name_he: "רימונים רויאל ים המלח - ישרוטל", city: "Ein Bokek", city_he: "ים המלח", country: "Israel", country_he: "ישראל", lat: 31.0880, lon: 35.3860 },
  { name: "Herods Herzliya", name_he: "הרודס הרצליה", city: "Herzliya", city_he: "הרצליה", country: "Israel", country_he: "ישראל", lat: 32.1610, lon: 34.8040 },
  { name: "Isrotel King Solomon Eilat", name_he: "המלך שלמה אילת - ישרוטל", city: "Eilat", city_he: "אילת", country: "Israel", country_he: "ישראל", lat: 29.5580, lon: 34.9480 },
  { name: "Isrotel Royal Garden Eilat", name_he: "רויאל גארדן אילת - ישרוטל", city: "Eilat", city_he: "אילת", country: "Israel", country_he: "ישראל", lat: 29.5550, lon: 34.9500 },
  { name: "Isrotel Lago Eilat", name_he: "לאגו אילת - ישרוטל", city: "Eilat", city_he: "אילת", country: "Israel", country_he: "ישראל", lat: 29.5570, lon: 34.9520 },
  { name: "Isrotel Agamim Eilat", name_he: "אגמים אילת - ישרוטל", city: "Eilat", city_he: "אילת", country: "Israel", country_he: "ישראל", lat: 29.5600, lon: 34.9450 },
  { name: "Isrotel Sport Club Eilat", name_he: "ספורט קלאב אילת - ישרוטל", city: "Eilat", city_he: "אילת", country: "Israel", country_he: "ישראל", lat: 29.5620, lon: 34.9430 },
  { name: "Dan Eilat", name_he: "מלון דן אילת", city: "Eilat", city_he: "אילת", country: "Israel", country_he: "ישראל", lat: 29.5540, lon: 34.9470 },
  { name: "Herods Eilat", name_he: "הרודס אילת", city: "Eilat", city_he: "אילת", country: "Israel", country_he: "ישראל", lat: 29.5560, lon: 34.9510 },
  { name: "Hilton Eilat", name_he: "הילטון אילת", city: "Eilat", city_he: "אילת", country: "Israel", country_he: "ישראל", lat: 29.5530, lon: 34.9490 },

  // --- Other iconic ---
  { name: "Atlantis Paradise Island Bahamas", city: "Paradise Island", country: "Bahamas", lat: 25.0850, lon: -77.3140 },
  { name: "Marina Bay Sands Singapore", city: "Singapore", country: "Singapore", lat: 1.2830, lon: 103.8610 },
  { name: "Raffles Singapore", city: "Singapore", country: "Singapore", lat: 1.2950, lon: 103.8540 },
];

// Normalize: lowercase + strip Latin diacritics (é→e, ï→i, ñ→n) so "Ushuaia" matches "Ushuaïa".
function normalize(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function matches(name: string, q: string): boolean {
  const n = normalize(name);
  if (n.startsWith(q)) return true;
  const idx = n.indexOf(q);
  return idx > 0 && n[idx - 1] === " ";
}

export function searchCuratedHotels(query: string, limit = 8, lang = "en") {
  const q = normalize(query).trim();
  if (q.length < 2) return [];
  return CURATED_HOTELS
    .filter((h) => matches(h.name, q) || (h.name_he ? matches(h.name_he, q) : false))
    .sort((a, b) => a.name.length - b.name.length)
    .slice(0, limit)
    .map((h) => {
      const useHe = lang === "he" && h.name_he;
      return {
        label: useHe
          ? [h.name_he, h.city_he || h.city, h.country_he || h.country].join(", ")
          : [h.name, h.city, h.country].join(", "),
        lat: h.lat,
        lon: h.lon,
        result_type: "hotel",
      };
    });
}