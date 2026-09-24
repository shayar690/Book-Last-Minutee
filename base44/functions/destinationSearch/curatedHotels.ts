// Curated database of iconic / popular hotels with English names.
// Supplements Photon (OSM) for partial-name matching: many luxury hotels in OSM
// are stored under a local-language name only (e.g. Arabic in Dubai), so short
// English prefixes like "Five Pa" can't match the "Palm" token via Photon.
// These entries are prefix/word-boundary matched and surfaced above Photon results.
export interface CuratedHotel {
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
}

export const CURATED_HOTELS: CuratedHotel[] = [
  // --- Dubai (UAE) ---
  { name: "FIVE Palm Jumeirah Hotel", city: "Dubai", country: "United Arab Emirates", lat: 25.1170, lon: 55.1340 },
  { name: "FIVE Jumeirah Village Hotel", city: "Dubai", country: "United Arab Emirates", lat: 25.0630, lon: 55.1730 },
  { name: "FIVE Luxe Jumeirah Village", city: "Dubai", country: "United Arab Emirates", lat: 25.0640, lon: 55.1720 },
  { name: "Paramount Hotel Midtown", city: "Dubai", country: "United Arab Emirates", lat: 25.1934, lon: 55.2654 },
  { name: "Paramount Tower Dubai", city: "Dubai", country: "United Arab Emirates", lat: 25.1932, lon: 55.2652 },
  { name: "DAMAC Paramount Hotel & Residences", city: "Dubai", country: "United Arab Emirates", lat: 25.1859, lon: 55.2918 },
  { name: "Burj Al Arab Jumeirah", city: "Dubai", country: "United Arab Emirates", lat: 25.1413, lon: 55.1854 },
  { name: "Atlantis The Palm", city: "Dubai", country: "United Arab Emirates", lat: 25.1300, lon: 55.1160 },
  { name: "Atlantis The Royal", city: "Dubai", country: "United Arab Emirates", lat: 25.1250, lon: 55.1160 },
  { name: "Armani Hotel Dubai", city: "Dubai", country: "United Arab Emirates", lat: 25.1970, lon: 55.2740 },
  { name: "Jumeirah Beach Hotel", city: "Dubai", country: "United Arab Emirates", lat: 25.1430, lon: 55.1830 },
  { name: "Madinat Jumeirah Al Qasr", city: "Dubai", country: "United Arab Emirates", lat: 25.1440, lon: 55.1810 },
  { name: "Madinat Jumeirah Mina A'Salam", city: "Dubai", country: "United Arab Emirates", lat: 25.1440, lon: 55.1800 },
  { name: "One&Only The Palm", city: "Dubai", country: "United Arab Emirates", lat: 25.1120, lon: 55.1390 },
  { name: "Waldorf Astoria Dubai Palm Jumeirah", city: "Dubai", country: "United Arab Emirates", lat: 25.1100, lon: 55.1390 },
  { name: "Four Seasons Resort Dubai at Jumeirah Beach", city: "Dubai", country: "United Arab Emirates", lat: 25.1510, lon: 55.1900 },
  { name: "Four Seasons Hotel DIFC", city: "Dubai", country: "United Arab Emirates", lat: 25.2130, lon: 55.2830 },
  { name: "Raffles Dubai", city: "Dubai", country: "United Arab Emirates", lat: 25.2250, lon: 55.2870 },
  { name: "The Address Boulevard", city: "Dubai", country: "United Arab Emirates", lat: 25.1980, lon: 55.2750 },
  { name: "Address Sky View", city: "Dubai", country: "United Arab Emirates", lat: 25.1950, lon: 55.2710 },
  { name: "Address Beach Resort", city: "Dubai", country: "United Arab Emirates", lat: 25.0830, lon: 55.1360 },
  { name: "Address Dubai Marina", city: "Dubai", country: "United Arab Emirates", lat: 25.0800, lon: 55.1400 },
  { name: "Bulgari Resort Dubai", city: "Dubai", country: "United Arab Emirates", lat: 25.0950, lon: 55.1350 },
  { name: "Mandarin Oriental Jumeira, Dubai", city: "Dubai", country: "United Arab Emirates", lat: 25.1860, lon: 55.2430 },
  { name: "W Dubai - The Palm", city: "Dubai", country: "United Arab Emirates", lat: 25.1180, lon: 55.1330 },
  { name: "W Dubai Mina Seyahi", city: "Dubai", country: "United Arab Emirates", lat: 25.1430, lon: 55.1760 },
  { name: "JW Marriott Marquis Dubai", city: "Dubai", country: "United Arab Emirates", lat: 25.1870, lon: 55.2630 },
  { name: "The Ritz-Carlton Dubai", city: "Dubai", country: "United Arab Emirates", lat: 25.1410, lon: 55.1850 },
  { name: "The Ritz-Carlton Dubai DIFC", city: "Dubai", country: "United Arab Emirates", lat: 25.2130, lon: 55.2830 },
  { name: "Grand Hyatt Dubai", city: "Dubai", country: "United Arab Emirates", lat: 25.2260, lon: 55.2880 },
  { name: "Park Hyatt Dubai", city: "Dubai", country: "United Arab Emirates", lat: 25.2530, lon: 55.3270 },
  { name: "Hyatt Regency Dubai", city: "Dubai", country: "United Arab Emirates", lat: 25.2650, lon: 55.3070 },
  { name: "Le Royal Meridien Beach Resort & Spa", city: "Dubai", country: "United Arab Emirates", lat: 25.1430, lon: 55.1760 },
  { name: "Grosvenor House Dubai", city: "Dubai", country: "United Arab Emirates", lat: 25.1430, lon: 55.1760 },
  { name: "Jumeirah Emirates Towers", city: "Dubai", country: "United Arab Emirates", lat: 25.2170, lon: 55.2830 },
  { name: "The Palace Downtown Dubai", city: "Dubai", country: "United Arab Emirates", lat: 25.1930, lon: 55.2760 },
  { name: "Sofitel Dubai Downtown", city: "Dubai", country: "United Arab Emirates", lat: 25.1920, lon: 55.2760 },
  { name: "Sofitel Dubai The Palm Resort & Spa", city: "Dubai", country: "United Arab Emirates", lat: 25.1200, lon: 55.1360 },
  { name: "Hilton Dubai Jumeirah", city: "Dubai", country: "United Arab Emirates", lat: 25.1430, lon: 55.1760 },
  { name: "Anantara The Palm Dubai Resort", city: "Dubai", country: "United Arab Emirates", lat: 25.1180, lon: 55.1360 },
  { name: "Bab Al Shams Desert Resort & Spa", city: "Dubai", country: "United Arab Emirates", lat: 24.8430, lon: 55.3280 },
  { name: "Emirates Palace Abu Dhabi", city: "Abu Dhabi", country: "United Arab Emirates", lat: 24.4620, lon: 54.3220 },

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
  { name: "THE YACHT - By Fattal Limited Edition", city: "Herzliya", country: "Israel", lat: 32.1620, lon: 34.8030 },
  { name: "The David Kempinski Tel Aviv", city: "Tel Aviv", country: "Israel", lat: 32.0780, lon: 34.7710 },
  { name: "The Ritz-Carlton Herzliya", city: "Herzliya", country: "Israel", lat: 32.1590, lon: 34.8050 },
  { name: "Carlton Tel Aviv Hotel", city: "Tel Aviv", country: "Israel", lat: 32.0840, lon: 34.7690 },
  { name: "Dan Tel Aviv", city: "Tel Aviv", country: "Israel", lat: 32.0810, lon: 34.7680 },
  { name: "Royal Beach Tel Aviv by Isrotel Exclusive", city: "Tel Aviv", country: "Israel", lat: 32.0790, lon: 34.7700 },
  { name: "The Setai Tel Aviv", city: "Tel Aviv", country: "Israel", lat: 32.0820, lon: 34.7670 },
  { name: "W Tel Aviv - Jaffa", city: "Tel Aviv", country: "Israel", lat: 32.0800, lon: 34.7640 },
  { name: "Isrotel King David Jerusalem", city: "Jerusalem", country: "Israel", lat: 31.7720, lon: 35.2210 },
  { name: "Mamilla Hotel Jerusalem", city: "Jerusalem", country: "Israel", lat: 31.7720, lon: 35.2230 },
  { name: "Waldorf Astoria Jerusalem", city: "Jerusalem", country: "Israel", lat: 31.7730, lon: 35.2180 },
  { name: "Isrotel Royal Rimonim Dead Sea", city: "Ein Bokek", country: "Israel", lat: 31.0880, lon: 35.3860 },
  { name: "Herods Herzliya", city: "Herzliya", country: "Israel", lat: 32.1610, lon: 34.8040 },

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

export function searchCuratedHotels(query: string, limit = 8) {
  const q = normalize(query).trim();
  if (q.length < 2) return [];
  return CURATED_HOTELS
    .filter((h) => matches(h.name, q))
    .sort((a, b) => a.name.length - b.name.length)
    .slice(0, limit)
    .map((h) => ({
      label: [h.name, h.city, h.country].join(", "),
      lat: h.lat,
      lon: h.lon,
      result_type: "hotel",
    }));
}