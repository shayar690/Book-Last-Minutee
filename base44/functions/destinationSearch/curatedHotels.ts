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
  { name: "FIVE Palm Jumeirah Hotel", name_he: "פייב פאלם ג'ומיירה דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.1170, lon: 55.1340 },
  { name: "FIVE Jumeirah Village Hotel", name_he: "פייב ג'ומיירה וילג' דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.0630, lon: 55.1730 },
  { name: "FIVE Luxe Jumeirah Village", name_he: "פייב לוקס ג'ומיירה וילג' דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.0640, lon: 55.1720 },
  { name: "Paramount Hotel Midtown", name_he: "פראמאונט מידטאון דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.1934, lon: 55.2654 },
  { name: "Paramount Tower Dubai", name_he: "פראמאונט טאואר דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.1932, lon: 55.2652 },
  { name: "DAMAC Paramount Hotel & Residences", name_he: "דאמאק פראמאונט דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.1859, lon: 55.2918 },
  { name: "Burj Al Arab Jumeirah", name_he: "בורג' אל ערב ג'ומיירה", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.1413, lon: 55.1854 },
  { name: "Atlantis The Palm", name_he: "אטלנטיס דה פאלם דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.1300, lon: 55.1160 },
  { name: "Atlantis The Royal", name_he: "אטלנטיס דה רויאל דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.1250, lon: 55.1160 },
  { name: "Armani Hotel Dubai", name_he: "ארמני מלון דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.1970, lon: 55.2740 },
  { name: "Jumeirah Beach Hotel", name_he: "ג'ומיירה ביץ' דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.1430, lon: 55.1830 },
  { name: "Madinat Jumeirah Al Qasr", name_he: "מדינת ג'ומיירה אל קאסר", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.1440, lon: 55.1810 },
  { name: "Madinat Jumeirah Mina A'Salam", name_he: "מדינת ג'ומיירה מינה א סאלאם", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.1440, lon: 55.1800 },
  { name: "One&Only The Palm", name_he: "וואן אנד אונלי דה פאלם דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.1120, lon: 55.1390 },
  { name: "Waldorf Astoria Dubai Palm Jumeirah", name_he: "וולדורף אסטוריה דובאי פאלם ג'ומיירה", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.1100, lon: 55.1390 },
  { name: "Four Seasons Resort Dubai at Jumeirah Beach", name_he: "ארבע עונות דובאי ג'ומיירה ביץ'", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.1510, lon: 55.1900 },
  { name: "Four Seasons Hotel DIFC", name_he: "ארבע עונות דובאי DIFC", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.2130, lon: 55.2830 },
  { name: "Raffles Dubai", name_he: "ראפלס דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.2250, lon: 55.2870 },
  { name: "The Address Boulevard", name_he: "דה אדרס בולווארד דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.1980, lon: 55.2750 },
  { name: "Address Sky View", name_he: "אדרס סקיי ויו דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.1950, lon: 55.2710 },
  { name: "Address Beach Resort", name_he: "אדרס ביץ' ריזורט דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.0830, lon: 55.1360 },
  { name: "Address Dubai Marina", name_he: "אדרס דובאי מרינה", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.0800, lon: 55.1400 },
  { name: "Bulgari Resort Dubai", name_he: "בולגארי ריזורט דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.0950, lon: 55.1350 },
  { name: "Mandarin Oriental Jumeira, Dubai", name_he: "מנדרין אוריינטל ג'ומיירה דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.1860, lon: 55.2430 },
  { name: "W Dubai - The Palm", name_he: "W דובאי - דה פאלם", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.1180, lon: 55.1330 },
  { name: "W Dubai Mina Seyahi", name_he: "W דובאי מינה סיאהי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.1430, lon: 55.1760 },
  { name: "JW Marriott Marquis Dubai", name_he: "JW מריוט מרקיז דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.1870, lon: 55.2630 },
  { name: "The Ritz-Carlton Dubai", name_he: "ריץ-קרלטון דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.1410, lon: 55.1850 },
  { name: "The Ritz-Carlton Dubai DIFC", name_he: "ריץ-קרלטון דובאי DIFC", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.2130, lon: 55.2830 },
  { name: "Grand Hyatt Dubai", name_he: "גרנד הייאט דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.2260, lon: 55.2880 },
  { name: "Park Hyatt Dubai", name_he: "פארק הייאט דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.2530, lon: 55.3270 },
  { name: "Hyatt Regency Dubai", name_he: "הייאט ריג'נסי דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.2650, lon: 55.3070 },
  { name: "Le Royal Meridien Beach Resort & Spa", name_he: "לה רויאל מרידיאן ביץ' דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.1430, lon: 55.1760 },
  { name: "Grosvenor House Dubai", name_he: "גרוסבנור האוס דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.1430, lon: 55.1760 },
  { name: "Jumeirah Emirates Towers", name_he: "ג'ומיירה אמירטס טאוארס דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.2170, lon: 55.2830 },
  { name: "The Palace Downtown Dubai", name_he: "דה פאלאס דאונטאון דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.1930, lon: 55.2760 },
  { name: "Sofitel Dubai Downtown", name_he: "סופיטל דאונטאון דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.1920, lon: 55.2760 },
  { name: "Sofitel Dubai The Palm Resort & Spa", name_he: "סופיטל דובאי דה פאלם", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.1200, lon: 55.1360 },
  { name: "Hilton Dubai Jumeirah", name_he: "הילטון דובאי ג'ומיירה", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.1430, lon: 55.1760 },
  { name: "Anantara The Palm Dubai Resort", name_he: "אנאנטרה דה פאלם דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 25.1180, lon: 55.1360 },
  { name: "Bab Al Shams Desert Resort & Spa", name_he: "באב אל שאמס דובאי", city: "Dubai", city_he: "דובאי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 24.8430, lon: 55.3280 },
  { name: "Emirates Palace Abu Dhabi", name_he: "אמירטס פאלאס אבו דאבי", city: "Abu Dhabi", city_he: "אבו דאבי", country: "United Arab Emirates", country_he: "איחוד האמירויות הערביות", lat: 24.4620, lon: 54.3220 },

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
  { name: "Caesar Premier Eilat", name_he: "קיסר אילת", city: "Eilat", city_he: "אילת", country: "Israel", country_he: "ישראל", lat: 29.5570, lon: 34.9520 },

  // --- Tel Aviv (comprehensive) ---
  { name: "Cinema Hotel Tel Aviv", name_he: "סינמה תל אביב - ישרוטל", city: "Tel Aviv", city_he: "תל אביב", country: "Israel", country_he: "ישראל", lat: 32.0770, lon: 34.7710 },
  { name: "Isrotel Motif Tel Aviv", name_he: "מוטיף תל אביב - ישרוטל", city: "Tel Aviv", city_he: "תל אביב", country: "Israel", country_he: "ישראל", lat: 32.0630, lon: 34.7740 },
  { name: "Isrotel Savoy Tel Aviv", name_he: "סבוי תל אביב - ישרוטל", city: "Tel Aviv", city_he: "תל אביב", country: "Israel", country_he: "ישראל", lat: 32.0790, lon: 34.7670 },
  { name: "Isrotel Varsano Suites Tel Aviv", name_he: "ורסנו סוויטות תל אביב - ישרוטל", city: "Tel Aviv", city_he: "תל אביב", country: "Israel", country_he: "ישראל", lat: 32.0770, lon: 34.7730 },
  { name: "Dan Panorama Tel Aviv", name_he: "דן פנורמה תל אביב", city: "Tel Aviv", city_he: "תל אביב", country: "Israel", country_he: "ישראל", lat: 32.0790, lon: 34.7700 },
  { name: "Hilton Tel Aviv", name_he: "הילטון תל אביב", city: "Tel Aviv", city_he: "תל אביב", country: "Israel", country_he: "ישראל", lat: 32.0840, lon: 34.7660 },
  { name: "Crowne Plaza Tel Aviv", name_he: "קראון פלאזה תל אביב", city: "Tel Aviv", city_he: "תל אביב", country: "Israel", country_he: "ישראל", lat: 32.0810, lon: 34.7700 },
  { name: "Sheraton Tel Aviv", name_he: "שרתון תל אביב", city: "Tel Aviv", city_he: "תל אביב", country: "Israel", country_he: "ישראל", lat: 32.0820, lon: 34.7670 },
  { name: "Marriott Tel Aviv", name_he: "מריוט תל אביב", city: "Tel Aviv", city_he: "תל אביב", country: "Israel", country_he: "ישראל", lat: 32.0760, lon: 34.7740 },
  { name: "Brown TLV Hotel", name_he: "בראון תל אביב", city: "Tel Aviv", city_he: "תל אביב", country: "Israel", country_he: "ישראל", lat: 32.0660, lon: 34.7710 },
  { name: "Brown Beach House Tel Aviv", name_he: "בראון ביץ' תל אביב", city: "Tel Aviv", city_he: "תל אביב", country: "Israel", country_he: "ישראל", lat: 32.0730, lon: 34.7710 },
  { name: "Poli House Tel Aviv", name_he: "פולי האוס תל אביב", city: "Tel Aviv", city_he: "תל אביב", country: "Israel", country_he: "ישראל", lat: 32.0660, lon: 34.7700 },
  { name: "NYX Tel Aviv", name_he: "NYX תל אביב", city: "Tel Aviv", city_he: "תל אביב", country: "Israel", country_he: "ישראל", lat: 32.0640, lon: 34.7730 },
  { name: "U Tel Aviv", name_he: "U תל אביב", city: "Tel Aviv", city_he: "תל אביב", country: "Israel", country_he: "ישראל", lat: 32.0620, lon: 34.7730 },
  { name: "Leonardo Boutique Tel Aviv", name_he: "לאונרדו בוטיק תל אביב", city: "Tel Aviv", city_he: "תל אביב", country: "Israel", country_he: "ישראל", lat: 32.0720, lon: 34.7700 },
  { name: "Herods Tel Aviv", name_he: "הרודס תל אביב", city: "Tel Aviv", city_he: "תל אביב", country: "Israel", country_he: "ישראל", lat: 32.0780, lon: 34.7710 },
  { name: "Prima Music Tel Aviv", name_he: "פרימה מיוזיק תל אביב", city: "Tel Aviv", city_he: "תל אביב", country: "Israel", country_he: "ישראל", lat: 32.0760, lon: 34.7700 },

  // --- Jerusalem (comprehensive) ---
  { name: "Dan Jerusalem", name_he: "דן ירושלים", city: "Jerusalem", city_he: "ירושלים", country: "Israel", country_he: "ישראל", lat: 31.7820, lon: 35.2270 },
  { name: "Dan Panorama Jerusalem", name_he: "דן פנורמה ירושלים", city: "Jerusalem", city_he: "ירושלים", country: "Israel", country_he: "ישראל", lat: 31.7720, lon: 35.2210 },
  { name: "Hilton Jerusalem", name_he: "הילטון ירושלים", city: "Jerusalem", city_he: "ירושלים", country: "Israel", country_he: "ישראל", lat: 31.7830, lon: 35.2230 },
  { name: "Crowne Plaza Jerusalem", name_he: "קראון פלאזה ירושלים", city: "Jerusalem", city_he: "ירושלים", country: "Israel", country_he: "ישראל", lat: 31.7820, lon: 35.1840 },
  { name: "Sheraton Jerusalem", name_he: "שרתון ירושלים", city: "Jerusalem", city_he: "ירושלים", country: "Israel", country_he: "ישראל", lat: 31.7750, lon: 35.2240 },
  { name: "Jerusalem Marriott", name_he: "מריוט ירושלים", city: "Jerusalem", city_he: "ירושלים", country: "Israel", country_he: "ישראל", lat: 31.7760, lon: 35.2150 },
  { name: "Leonardo Plaza Jerusalem", name_he: "לאונרדו פלאזה ירושלים", city: "Jerusalem", city_he: "ירושלים", country: "Israel", country_he: "ישראל", lat: 31.7740, lon: 35.2190 },
  { name: "Isrotel Promenade Jerusalem", name_he: "טיילת ירושלים - ישרוטל", city: "Jerusalem", city_he: "ירושלים", country: "Israel", country_he: "ישראל", lat: 31.7690, lon: 35.2310 },
  { name: "Orient Jerusalem Isrotel Exclusive", name_he: "אוריינט ירושלים - ישרוטל אקסקלוסיב", city: "Jerusalem", city_he: "ירושלים", country: "Israel", country_he: "ישראל", lat: 31.7710, lon: 35.2290 },
  { name: "Inbal Jerusalem", name_he: "אינבל ירושלים", city: "Jerusalem", city_he: "ירושלים", country: "Israel", country_he: "ישראל", lat: 31.7710, lon: 35.2260 },
  { name: "Prima Palace Jerusalem", name_he: "פרימה פלאס ירושלים", city: "Jerusalem", city_he: "ירושלים", country: "Israel", country_he: "ישראל", lat: 31.7810, lon: 35.2120 },
  { name: "Prima Royale Jerusalem", name_he: "פרימה רויאל ירושלים", city: "Jerusalem", city_he: "ירושלים", country: "Israel", country_he: "ישראל", lat: 31.7720, lon: 35.2250 },

  // --- Dead Sea ---
  { name: "Isrotel Dead Sea Resort & Spa", name_he: "ים המלח - ישרוטל", city: "Ein Bokek", city_he: "ים המלח", country: "Israel", country_he: "ישראל", lat: 31.0900, lon: 35.3880 },
  { name: "Daniel Dead Sea", name_he: "דניאל ים המלח", city: "Ein Bokek", city_he: "ים המלח", country: "Israel", country_he: "ישראל", lat: 31.0920, lon: 35.3870 },
  { name: "Herods Dead Sea", name_he: "הרודס ים המלח", city: "Ein Bokek", city_he: "ים המלח", country: "Israel", country_he: "ישראל", lat: 31.0910, lon: 35.3860 },
  { name: "Leonardo Plaza Dead Sea", name_he: "לאונרדו פלאזה ים המלח", city: "Ein Bokek", city_he: "ים המלח", country: "Israel", country_he: "ישראל", lat: 31.0890, lon: 35.3850 },

  // --- Haifa ---
  { name: "Dan Panorama Haifa", name_he: "דן פנורמה חיפה", city: "Haifa", city_he: "חיפה", country: "Israel", country_he: "ישראל", lat: 32.8170, lon: 34.9890 },
  { name: "Dan Carmel Haifa", name_he: "דן כרמל חיפה", city: "Haifa", city_he: "חיפה", country: "Israel", country_he: "ישראל", lat: 32.8170, lon: 34.9860 },
  { name: "Leonardo Haifa", name_he: "לאונרדו חיפה", city: "Haifa", city_he: "חיפה", country: "Israel", country_he: "ישראל", lat: 32.8190, lon: 34.9900 },
  { name: "Crowne Plaza Haifa", name_he: "קראון פלאזה חיפה", city: "Haifa", city_he: "חיפה", country: "Israel", country_he: "ישראל", lat: 32.8170, lon: 34.9870 },

  // --- Netanya ---
  { name: "Isrotel Park Netanya", name_he: "פארק נתניה - ישרוטל", city: "Netanya", city_he: "נתניה", country: "Israel", country_he: "ישראל", lat: 32.3210, lon: 34.8560 },
  { name: "Isrotel Plaza Beach Netanya", name_he: "פלאזה ביץ' נתניה - ישרוטל", city: "Netanya", city_he: "נתניה", country: "Israel", country_he: "ישראל", lat: 32.3230, lon: 34.8530 },
  { name: "Seasons Netanya", name_he: "סיזונס נתניה", city: "Netanya", city_he: "נתניה", country: "Israel", country_he: "ישראל", lat: 32.3220, lon: 34.8540 },
  { name: "Island Netanya", name_he: "איילנד נתניה", city: "Netanya", city_he: "נתניה", country: "Israel", country_he: "ישראל", lat: 32.3240, lon: 34.8520 },

  // --- Tiberias & Galilee ---
  { name: "Leonardo Plaza Tiberias", name_he: "לאונרדו פלאזה טבריה", city: "Tiberias", city_he: "טבריה", country: "Israel", country_he: "ישראל", lat: 32.7960, lon: 35.5320 },
  { name: "Scots Hotel Tiberias", name_he: "סקוטס טבריה - ישרוטל אקסקלוסיב", city: "Tiberias", city_he: "טבריה", country: "Israel", country_he: "ישראל", lat: 32.7950, lon: 35.5310 },
  { name: "Galei Kinneret Hotel", name_he: "גלי כנרת טבריה", city: "Tiberias", city_he: "טבריה", country: "Israel", country_he: "ישראל", lat: 32.7940, lon: 35.5300 },
  { name: "Caesar Premier Tiberias", name_he: "קיסר טבריה", city: "Tiberias", city_he: "טבריה", country: "Israel", country_he: "ישראל", lat: 32.7930, lon: 35.5330 },

  // --- Mitzpe Ramon / Negev ---
  { name: "Beresheet Mitzpe Ramon", name_he: "בראשית מצפה רמון", city: "Mitzpe Ramon", city_he: "מצפה רמון", country: "Israel", country_he: "ישראל", lat: 30.6100, lon: 34.8010 },

  // --- Herzliya / Caesarea / Nazareth / Akko ---
  { name: "Dan Accadia Herzliya", name_he: "דן אכדיה הרצליה", city: "Herzliya", city_he: "הרצליה", country: "Israel", country_he: "ישראל", lat: 32.1600, lon: 34.8060 },
  { name: "Alexander Hotel Herzliya", name_he: "אלכסנדר הרצליה", city: "Herzliya", city_he: "הרצליה", country: "Israel", country_he: "ישראל", lat: 32.1620, lon: 34.8050 },
  { name: "Dan Caesarea", name_he: "דן קיסריה", city: "Caesarea", city_he: "קיסריה", country: "Israel", country_he: "ישראל", lat: 32.5100, lon: 34.9100 },
  { name: "Isrotel Garden Hotel Nazareth", name_he: "גארדן נצרת - ישרוטל", city: "Nazareth", city_he: "נצרת", country: "Israel", country_he: "ישראל", lat: 32.7020, lon: 35.2980 },
  { name: "Isrotel Hamam Hotel Akko", name_he: "חמאם עכו - ישרוטל", city: "Acre", city_he: "עכו", country: "Israel", country_he: "ישראל", lat: 32.8710, lon: 35.0720 },

  // --- Other iconic ---
  { name: "Atlantis Paradise Island Bahamas", city: "Paradise Island", country: "Bahamas", lat: 25.0850, lon: -77.3140 },
  { name: "Marina Bay Sands Singapore", city: "Singapore", country: "Singapore", lat: 1.2830, lon: 103.8610 },
  { name: "Raffles Singapore", city: "Singapore", country: "Singapore", lat: 1.2950, lon: 103.8540 },
];

export interface CuratedCity {
  name: string;
  name_he?: string;
  country: string;
  country_he?: string;
  lat: number;
  lon: number;
}

// Curated cities with Hebrew names — enables partial Hebrew matching (e.g. "לימס" → "לימסול")
// for destinations that Photon/Nominatim can't match from a partial Hebrew query.
export const CURATED_CITIES: CuratedCity[] = [
  // --- Cyprus ---
  { name: "Limassol", name_he: "לימסול", country: "Cyprus", country_he: "קפריסין", lat: 34.6786, lon: 33.0418 },
  { name: "Larnaca", name_he: "לרנקה", country: "Cyprus", country_he: "קפריסין", lat: 34.9229, lon: 33.6233 },
  { name: "Paphos", name_he: "פאפוס", country: "Cyprus", country_he: "קפריסין", lat: 34.7720, lon: 32.4297 },
  { name: "Ayia Napa", name_he: "איה נאפה", country: "Cyprus", country_he: "קפריסין", lat: 34.9833, lon: 33.9999 },
  { name: "Nicosia", name_he: "ניקוסיה", country: "Cyprus", country_he: "קפריסין", lat: 35.1856, lon: 33.3823 },
  // --- Greece ---
  { name: "Athens", name_he: "אתונה", country: "Greece", country_he: "יוון", lat: 37.9838, lon: 23.7275 },
  { name: "Santorini", name_he: "סנטוריני", country: "Greece", country_he: "יוון", lat: 36.3932, lon: 25.4615 },
  { name: "Mykonos", name_he: "מיקונוס", country: "Greece", country_he: "יוון", lat: 37.4467, lon: 25.3289 },
  { name: "Crete", name_he: "כרתים", country: "Greece", country_he: "יוון", lat: 35.2400, lon: 24.8093 },
  { name: "Rhodes", name_he: "רודוס", country: "Greece", country_he: "יוון", lat: 36.4341, lon: 28.2176 },
  { name: "Thessaloniki", name_he: "סלוניקי", country: "Greece", country_he: "יוון", lat: 40.6401, lon: 22.9444 },
  { name: "Corfu", name_he: "קורפו", country: "Greece", country_he: "יוון", lat: 39.6243, lon: 19.9217 },
  { name: "Kos", name_he: "קוס", country: "Greece", country_he: "יוון", lat: 36.8916, lon: 27.2887 },
  // --- Italy ---
  { name: "Rome", name_he: "רומא", country: "Italy", country_he: "איטליה", lat: 41.9028, lon: 12.4964 },
  { name: "Milan", name_he: "מילאנו", country: "Italy", country_he: "איטליה", lat: 45.4642, lon: 9.1900 },
  { name: "Venice", name_he: "ונציה", country: "Italy", country_he: "איטליה", lat: 45.4408, lon: 12.3155 },
  { name: "Florence", name_he: "פירנצה", country: "Italy", country_he: "איטליה", lat: 43.7696, lon: 11.2558 },
  { name: "Naples", name_he: "נאפולי", country: "Italy", country_he: "איטליה", lat: 40.8518, lon: 14.2681 },
  { name: "Sicily", name_he: "סיציליה", country: "Italy", country_he: "איטליה", lat: 37.8333, lon: 14.0000 },
  // --- Spain ---
  { name: "Barcelona", name_he: "ברצלונה", country: "Spain", country_he: "ספרד", lat: 41.3851, lon: 2.1734 },
  { name: "Madrid", name_he: "מדריד", country: "Spain", country_he: "ספרד", lat: 40.4168, lon: -3.7038 },
  { name: "Ibiza", name_he: "איביזה", country: "Spain", country_he: "ספרד", lat: 38.9080, lon: 1.3940 },
  { name: "Mallorca", name_he: "מיורקה", country: "Spain", country_he: "ספרד", lat: 39.6951, lon: 3.0176 },
  { name: "Tenerife", name_he: "טנריף", country: "Spain", country_he: "ספרד", lat: 28.2916, lon: -16.6291 },
  { name: "Valencia", name_he: "ולנסיה", country: "Spain", country_he: "ספרד", lat: 39.4699, lon: -0.3763 },
  { name: "Seville", name_he: "סביליה", country: "Spain", country_he: "ספרד", lat: 37.3886, lon: -5.9823 },
  // --- France ---
  { name: "Paris", name_he: "פריז", country: "France", country_he: "צרפת", lat: 48.8566, lon: 2.3522 },
  { name: "Nice", name_he: "ניס", country: "France", country_he: "צרפת", lat: 43.7102, lon: 7.2620 },
  { name: "Marseille", name_he: "מרסיי", country: "France", country_he: "צרפת", lat: 43.2965, lon: 5.3698 },
  { name: "Lyon", name_he: "ליון", country: "France", country_he: "צרפת", lat: 45.7640, lon: 4.8357 },
  { name: "Cannes", name_he: "קאן", country: "France", country_he: "צרפת", lat: 43.5528, lon: 7.0174 },
  // --- UK ---
  { name: "London", name_he: "לונדון", country: "United Kingdom", country_he: "בריטניה", lat: 51.5074, lon: -0.1278 },
  { name: "Edinburgh", name_he: "אדינבורו", country: "United Kingdom", country_he: "בריטניה", lat: 55.9533, lon: -3.1883 },
  { name: "Manchester", name_he: "מנצ'סטר", country: "United Kingdom", country_he: "בריטניה", lat: 53.4808, lon: -2.2426 },
  // --- Germany ---
  { name: "Berlin", name_he: "ברלין", country: "Germany", country_he: "גרמניה", lat: 52.5200, lon: 13.4050 },
  { name: "Munich", name_he: "מינכן", country: "Germany", country_he: "גרמניה", lat: 48.1351, lon: 11.5820 },
  { name: "Frankfurt", name_he: "פרנקפורט", country: "Germany", country_he: "גרמניה", lat: 50.1109, lon: 8.6821 },
  { name: "Hamburg", name_he: "המבורג", country: "Germany", country_he: "גרמניה", lat: 53.5511, lon: 9.9937 },
  // --- Netherlands / Austria / Czech / Hungary ---
  { name: "Amsterdam", name_he: "אמסטרדם", country: "Netherlands", country_he: "הולנד", lat: 52.3676, lon: 4.9041 },
  { name: "Vienna", name_he: "וינה", country: "Austria", country_he: "אוסטריה", lat: 48.2082, lon: 16.3738 },
  { name: "Salzburg", name_he: "זלצבורג", country: "Austria", country_he: "אוסטריה", lat: 47.8095, lon: 13.0550 },
  { name: "Prague", name_he: "פראג", country: "Czech Republic", country_he: "צ'כיה", lat: 50.0755, lon: 14.4378 },
  { name: "Budapest", name_he: "בודפשט", country: "Hungary", country_he: "הונגריה", lat: 47.4979, lon: 19.0402 },
  // --- Turkey ---
  { name: "Istanbul", name_he: "איסטנבול", country: "Turkey", country_he: "טורקיה", lat: 41.0082, lon: 28.9784 },
  { name: "Antalya", name_he: "אנטליה", country: "Turkey", country_he: "טורקיה", lat: 36.8969, lon: 30.7133 },
  { name: "Bodrum", name_he: "בודרום", country: "Turkey", country_he: "טורקיה", lat: 37.0343, lon: 27.4305 },
  { name: "Cappadocia", name_he: "קפדוקיה", country: "Turkey", country_he: "טורקיה", lat: 38.6431, lon: 34.8289 },
  // --- Egypt / Jordan ---
  { name: "Cairo", name_he: "קהיר", country: "Egypt", country_he: "מצרים", lat: 30.0444, lon: 31.2357 },
  { name: "Sharm El Sheikh", name_he: "שארם א-שייח'", country: "Egypt", country_he: "מצרים", lat: 27.9158, lon: 34.3300 },
  { name: "Hurghada", name_he: "הורגאדה", country: "Egypt", country_he: "מצרים", lat: 27.2538, lon: 33.8382 },
  { name: "Amman", name_he: "עמאן", country: "Jordan", country_he: "ירדן", lat: 31.9454, lon: 35.9283 },
  { name: "Aqaba", name_he: "עקבה", country: "Jordan", country_he: "ירדן", lat: 29.5320, lon: 35.0063 },
  { name: "Petra", name_he: "פטרה", country: "Jordan", country_he: "ירדן", lat: 30.3285, lon: 35.4444 },
  // --- Balkans / Eastern Europe ---
  { name: "Dubrovnik", name_he: "דוברובניק", country: "Croatia", country_he: "קרואטיה", lat: 42.6507, lon: 18.0944 },
  { name: "Split", name_he: "ספליט", country: "Croatia", country_he: "קרואטיה", lat: 43.5081, lon: 16.4402 },
  { name: "Zagreb", name_he: "זאגרב", country: "Croatia", country_he: "קרואטיה", lat: 45.8150, lon: 15.9819 },
  { name: "Budva", name_he: "בודווה", country: "Montenegro", country_he: "מונטנגרו", lat: 42.2911, lon: 18.8400 },
  { name: "Kotor", name_he: "קוטור", country: "Montenegro", country_he: "מונטנגרו", lat: 42.4247, lon: 18.7712 },
  { name: "Ljubljana", name_he: "ליובליאנה", country: "Slovenia", country_he: "סלובניה", lat: 46.0569, lon: 14.5058 },
  { name: "Tbilisi", name_he: "טביליסי", country: "Georgia", country_he: "גאורגיה", lat: 41.7151, lon: 44.8271 },
  { name: "Batumi", name_he: "באטומי", country: "Georgia", country_he: "גאורגיה", lat: 41.6168, lon: 41.6367 },
  { name: "Bucharest", name_he: "בוקרשט", country: "Romania", country_he: "רומניה", lat: 44.4268, lon: 26.1025 },
  { name: "Warsaw", name_he: "ורשה", country: "Poland", country_he: "פולין", lat: 52.2297, lon: 21.0122 },
  { name: "Krakow", name_he: "קרקוב", country: "Poland", country_he: "פולין", lat: 50.0647, lon: 19.9450 },
  { name: "Sofia", name_he: "סופיה", country: "Bulgaria", country_he: "בולגריה", lat: 42.6977, lon: 23.3219 },
  { name: "Varna", name_he: "וארנה", country: "Bulgaria", country_he: "בולגריה", lat: 43.2141, lon: 27.9147 },
  { name: "Belgrade", name_he: "בלגרד", country: "Serbia", country_he: "סרביה", lat: 44.7866, lon: 20.4489 },
  // --- Morocco / Malta / Portugal / Ireland ---
  { name: "Marrakech", name_he: "מרקש", country: "Morocco", country_he: "מרוקו", lat: 31.6295, lon: -7.9811 },
  { name: "Valletta", name_he: "ולטה", country: "Malta", country_he: "מלטה", lat: 35.8989, lon: 14.5146 },
  { name: "Lisbon", name_he: "ליסבון", country: "Portugal", country_he: "פורטוגל", lat: 38.7223, lon: -9.1393 },
  { name: "Dublin", name_he: "דבלין", country: "Ireland", country_he: "אירלנד", lat: 53.3498, lon: -6.2603 },
  // --- Switzerland / Scandinavia / Iceland ---
  { name: "Zurich", name_he: "ציריך", country: "Switzerland", country_he: "שוויץ", lat: 47.3769, lon: 8.5417 },
  { name: "Geneva", name_he: "ז'נבה", country: "Switzerland", country_he: "שוויץ", lat: 46.2044, lon: 6.1432 },
  { name: "Oslo", name_he: "אוסלו", country: "Norway", country_he: "נורווגיה", lat: 59.9139, lon: 10.7522 },
  { name: "Stockholm", name_he: "סטוקהולם", country: "Sweden", country_he: "שוודיה", lat: 59.3293, lon: 18.0686 },
  { name: "Copenhagen", name_he: "קופנהגן", country: "Denmark", country_he: "דנמרק", lat: 55.6761, lon: 12.5683 },
  { name: "Reykjavik", name_he: "רייקיאויק", country: "Iceland", country_he: "איסלנד", lat: 64.1466, lon: -21.9426 },
  // --- Asia ---
  { name: "Bangkok", name_he: "בנקוק", country: "Thailand", country_he: "תאילנד", lat: 13.7563, lon: 100.5018 },
  { name: "Phuket", name_he: "פוקט", country: "Thailand", country_he: "תאילנד", lat: 7.8804, lon: 98.3923 },
  { name: "Bali", name_he: "באלי", country: "Indonesia", country_he: "אינדונזיה", lat: -8.3405, lon: 115.0920 },
  { name: "Tokyo", name_he: "טוקיו", country: "Japan", country_he: "יפן", lat: 35.6762, lon: 139.6503 },
  { name: "Seoul", name_he: "סיאול", country: "South Korea", country_he: "דרום קוריאה", lat: 37.5665, lon: 126.9780 },
  { name: "Singapore", name_he: "סינגפור", country: "Singapore", country_he: "סינגפור", lat: 1.3521, lon: 103.8198 },
  { name: "Hong Kong", name_he: "הונג קונג", country: "Hong Kong", country_he: "הונג קונג", lat: 22.3193, lon: 114.1694 },
  // --- Americas / Oceania / Africa ---
  { name: "New York", name_he: "ניו יורק", country: "United States", country_he: "ארצות הברית", lat: 40.7128, lon: -74.0060 },
  { name: "Los Angeles", name_he: "לוס אנג'לס", country: "United States", country_he: "ארצות הברית", lat: 34.0522, lon: -118.2437 },
  { name: "Miami", name_he: "מיאמי", country: "United States", country_he: "ארצות הברית", lat: 25.7617, lon: -80.1918 },
  { name: "Las Vegas", name_he: "לאס וגאס", country: "United States", country_he: "ארצות הברית", lat: 36.1699, lon: -115.1398 },
  { name: "San Francisco", name_he: "סן פרנסיסקו", country: "United States", country_he: "ארצות הברית", lat: 37.7749, lon: -122.4194 },
  { name: "Orlando", name_he: "אורלנדו", country: "United States", country_he: "ארצות הברית", lat: 28.5383, lon: -81.3792 },
  { name: "Toronto", name_he: "טורונטו", country: "Canada", country_he: "קנדה", lat: 43.6532, lon: -79.3832 },
  { name: "Cancun", name_he: "קנקון", country: "Mexico", country_he: "מקסיקו", lat: 21.1619, lon: -86.8515 },
  { name: "Sydney", name_he: "סידני", country: "Australia", country_he: "אוסטרליה", lat: -33.8688, lon: 151.2093 },
  { name: "Cape Town", name_he: "קייפטאון", country: "South Africa", country_he: "דרום אפריקה", lat: -33.9249, lon: 18.4241 },
  { name: "Buenos Aires", name_he: "בואנוס איירס", country: "Argentina", country_he: "ארגנטינה", lat: -34.6037, lon: -58.3816 },
  { name: "Rio de Janeiro", name_he: "ריו דה ז'ניירו", country: "Brazil", country_he: "ברזיל", lat: -22.9068, lon: -43.1729 },
];

// Normalize: lowercase + strip Latin diacritics (é→e, ï→i, ñ→n) so "Ushuaia" matches "Ushuaïa".
function normalize(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Score: 3 = prefix, 2 = word-boundary, 1 = substring inside a word, 0 = no match.
// Substring matching lets "מלך" find "המלך שלמה" and "שלמה" find "המלך שלמה אילת".
function matchScore(name: string, q: string): number {
  const n = normalize(name);
  if (n.startsWith(q)) return 3;
  const idx = n.indexOf(q);
  if (idx < 0) return 0;
  if (idx > 0 && n[idx - 1] === " ") return 2;
  return 1;
}

export function searchCuratedHotels(query: string, limit = 12, lang = "en") {
  const q = normalize(query).trim();
  if (q.length < 2) return [];

  // --- Hotel matches (by hotel name) ---
  const hotelMatches = CURATED_HOTELS
    .map((h) => {
      const s = Math.max(matchScore(h.name, q), h.name_he ? matchScore(h.name_he, q) : 0);
      return { h, s };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => (b.s - a.s) || (a.h.name.length - b.h.name.length))
    .map((x) => x.h);

  // --- City matches (by city name from curated hotels) ---
  const cityMap = new Map<string, { city: string; city_he?: string; country: string; country_he?: string; lat: number; lon: number }>();
  for (const h of CURATED_HOTELS) {
    const key = h.city.toLowerCase();
    if (!cityMap.has(key)) {
      cityMap.set(key, { city: h.city, city_he: h.city_he, country: h.country, country_he: h.country_he, lat: h.lat, lon: h.lon });
    }
  }
  for (const c of CURATED_CITIES) {
    const key = c.name.toLowerCase();
    if (!cityMap.has(key)) {
      cityMap.set(key, { city: c.name, city_he: c.name_he, country: c.country, country_he: c.country_he, lat: c.lat, lon: c.lon });
    }
  }
  const cityMatches = Array.from(cityMap.values())
    .map((c) => {
      const s = Math.max(matchScore(c.city, q), c.city_he ? matchScore(c.city_he, q) : 0);
      return { c, s };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.c);

  // --- Merge: hotels first, then cities ---
  const results: { label: string; lat: number; lon: number; result_type: string }[] = [];
  const seenKeys = new Set<string>();

  for (const h of hotelMatches) {
    const useHe = lang === "he" && h.name_he;
    const label = useHe
      ? [h.name_he, h.city_he || h.city, h.country_he || h.country].join(", ")
      : [h.name, h.city, h.country].join(", ");
    const key = label.toLowerCase();
    if (seenKeys.has(key)) continue;
    seenKeys.add(key);
    results.push({ label, lat: h.lat, lon: h.lon, result_type: "hotel" });
  }

  for (const c of cityMatches) {
    const useHe = lang === "he" && c.city_he;
    const label = useHe
      ? [c.city_he, c.country_he || c.country].join(", ")
      : [c.city, c.country].join(", ");
    const key = label.toLowerCase();
    if (seenKeys.has(key)) continue;
    seenKeys.add(key);
    results.push({ label, lat: c.lat, lon: c.lon, result_type: "city" });
  }

  return results.slice(0, limit);
}