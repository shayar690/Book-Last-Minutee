// Destination autocomplete — Open-Meteo (cities, multilingual, free, no API key)
// + curated hotel database. Fast, reliable, no API key required.
import { searchCuratedHotels } from "./curatedHotels.ts";

// ISO 3166-1 alpha-2 country code → Hebrew country name.
// Used to guarantee 100% Hebrew country names in Hebrew mode, regardless
// of what Open-Meteo returns (it sometimes uses special characters like "ארה״ב").
const COUNTRY_CODE_HE: Record<string, string> = {
  AD: "אנדורה", AE: "איחוד האמירויות הערביות", AF: "אפגניסטן", AG: "אנטיגואה וברבודה", AI: "אנגילה",
  AL: "אלבניה", AM: "ארמניה", AO: "אנגולה", AR: "ארגנטינה", AT: "אוסטריה",
  AU: "אוסטרליה", AW: "ארובה", AZ: "אזרבייג'ן", BA: "בוסניה והרצגובינה", BB: "ברבדוס",
  BD: "בנגלדש", BE: "בלגיה", BF: "בורקינה פאסו", BG: "בולגריה", BH: "בחריין",
  BI: "בורונדי", BJ: "בנין", BM: "ברמודה", BN: "ברוניי", BO: "בוליביה",
  BQ: "האיים הקריביים ההולנדיים", BR: "ברזיל", BS: "איי בהאמה", BT: "בהוטן",
  BW: "בוצוואנה", BY: "בלארוס", BZ: "בליז", CA: "קנדה", CD: "קונגו",
  CF: "הרפובליקה המרכז אפריקאית", CG: "קונגו", CH: "שוויץ", CI: "חוף השנהב", CK: "איי קוק",
  CL: "צ'ילה", CM: "קמרון", CN: "סין", CO: "קולומביה", CR: "קוסטה ריקה",
  CU: "קובה", CV: "כף ורדה", CW: "קוראסאו", CY: "קפריסין", CZ: "צ'כיה",
  DE: "גרמניה", DJ: "ג'יבוטי", DK: "דנמרק", DM: "דומיניקה", DO: "הרפובליקה הדומיניקנית",
  DZ: "אלג'יריה", EC: "אקוודור", EE: "אסטוניה", EG: "מצרים", ER: "אריתריאה",
  ES: "ספרד", ET: "אתיופיה", FI: "פינלנד", FJ: "פיג'י", FK: "איי פוקלנד",
  FM: "מיקרונזיה", FO: "איי פארו", FR: "צרפת", GA: "גבון", GB: "בריטניה",
  GD: "גרנדה", GE: "גאורגיה", GF: "גיאנה הצרפתית", GH: "גאנה", GI: "גיברלטר",
  GL: "גרינלנד", GM: "גמביה", GN: "גינאה", GP: "גוואדלופ", GQ: "גינאה המשוונית",
  GR: "יוון", GT: "גואטמלה", GY: "גיאנה", HK: "הונג קונג", HN: "הונדורס",
  HR: "קרואטיה", HT: "האיטי", HU: "הונגריה", ID: "אינדונזיה", IE: "אירלנד",
  IL: "ישראל", IN: "הודו", IQ: "עיראק", IR: "איראן", IS: "איסלנד",
  IT: "איטליה", JM: "ג'מייקה", JO: "ירדן", JP: "יפן", KE: "קניה",
  KG: "קירגיזסטן", KH: "קמבודיה", KM: "קומורו", KN: "סנט קיטס ונוויס", KP: "צפון קוריאה",
  KR: "דרום קוריאה", KW: "כווית", KY: "איי קיימן", KZ: "קזחסטן",
  LA: "לאוס", LB: "לבנון", LC: "סנט לוסיה", LI: "ליכטנשטיין", LK: "סרי לנקה",
  LR: "ליבריה", LS: "לסוטו", LT: "ליטא", LU: "לוקסמבורג", LV: "לטביה",
  LY: "לוב", MA: "מרוקו", MC: "מונקו", MD: "מולדובה", ME: "מונטנגרו",
  MG: "מדגסקר", MK: "מקדוניה הצפונית", ML: "מאלי", MM: "מיאנמר", MN: "מונגוליה",
  MO: "מקאו", MQ: "מרטיניק", MR: "מאוריטניה", MS: "מונסראט", MT: "מלטה",
  MU: "מאוריציוס", MV: "האיים המלדיביים", MW: "מלאווי", MX: "מקסיקו", MY: "מלזיה",
  MZ: "מוזמביק", NA: "נמיביה", NC: "קלדוניה החדשה", NE: "ניז'ר", NG: "ניגריה",
  NI: "ניקרגואה", NL: "הולנד", NO: "נורווגיה", NP: "נפאל", NZ: "ניו זילנד",
  OM: "עומאן", PA: "פנמה", PE: "פרו", PF: "פולינזיה הצרפתית", PG: "פפואה גינאה החדשה",
  PH: "הפיליפינים", PK: "פקיסטן", PL: "פולין", PR: "פוארטו ריקו", PT: "פורטוגל",
  PY: "פרגוואי", QA: "קטאר", RE: "ראוניון", RO: "רומניה", RS: "סרביה",
  RU: "רוסיה", RW: "רואנדה", SA: "ערב הסעודית", SB: "איי שלמה", SC: "איי סיישל",
  SD: "סודאן", SE: "שוודיה", SG: "סינגפור", SI: "סלובניה", SK: "סלובקיה",
  SL: "סיירה לאונה", SM: "סן מרינו", SN: "סנגל", SO: "סומליה", SR: "סורינם",
  SS: "דרום סודאן", ST: "סאו טומה ופרינסיפה", SV: "אל סלבדור", SY: "סוריה",
  SZ: "אסוואטיני", TC: "איי טרקס וקאיקוס", TD: "צ'אד", TG: "טוגו", TH: "תאילנד",
  TJ: "טג'יקיסטן", TL: "טימור-לסטה", TM: "טורקמניסטן", TN: "תוניסיה", TO: "טונגה",
  TR: "טורקיה", TT: "טרינידד וטובגו", TW: "טייוואן", TZ: "טנזניה", UA: "אוקראינה",
  UG: "אוגנדה", US: "ארצות הברית", UY: "אורוגוואי", UZ: "אוזבקיסטן",
  VC: "סנט וינסנט והגרנדינים", VE: "ונצואלה", VN: "וייטנאם", VU: "ונואטו",
  WS: "סמואה", YE: "תימן", ZA: "דרום אפריקה", ZM: "זמביה", ZW: "זימבבואה",
};

// Open-Meteo Geocoding API — free, no API key, supports Hebrew and 20+ languages.
// Returns cities, towns, and countries with localized names.
async function openMeteoSearch(query: string, lang: string, filter: string) {
  const langCode = lang === "he" ? "he" : "en";
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=20&language=${langCode}&format=json`;
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  const seen = new Set<string>();
  return (data.results || [])
    .filter((r: any) => {
      // For hotel search, only return cities/towns (not countries or regions)
      if (filter === "hotels") {
        return ["PPL", "PPLA", "PPLA2", "PPLA3", "PPLA4", "PPLA5", "PPLC", "PPLG", "PPLF"].includes(r.feature_code);
      }
      return true;
    })
    .map((r: any) => {
      // In Hebrew mode, use the Hebrew country name from our map (via country_code)
      // to guarantee 100% Hebrew. Open-Meteo sometimes returns special characters
      // (e.g. "ארה״ב" instead of "ארצות הברית") or English names.
      const country = lang === "he" && r.country_code
        ? (COUNTRY_CODE_HE[r.country_code] || r.country)
        : r.country;
      // City + country only — skip admin1 (state/emirate) which is often in English.
      const parts = [r.name, country].filter(Boolean);
      const key = (r.name + country).toLowerCase();
      if (seen.has(key)) return null;
      seen.add(key);
      return {
        label: parts.join(", "),
        lat: r.latitude,
        lon: r.longitude,
        result_type: "city",
      };
    })
    .filter((r: any) => r !== null);
}

export default async function(req: any) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = (body.query || "").trim();
    const lang = body.lang || "en";
    const filter = body.filter || "";
    if (query.length < 2) return Response.json({ results: [] });

    // Hotels tab: curated database + Open-Meteo (cities).
    // Cities appear first, then hotels — so searching "פרא" shows Prague
    // before Paramount hotels in Dubai.
    if (filter === "hotels") {
      const curated = searchCuratedHotels(query, 12, lang);
      const curatedCities = curated.filter((r: any) => r.result_type === "city");
      const curatedHotels = curated.filter((r: any) => r.result_type === "hotel");
      const cities = await openMeteoSearch(query, lang, filter).catch(() => []);

      // Dedup: for cities, use the city name (first part of label) as the key
      // so curated cities (with correct Hebrew names) take priority over
      // Open-Meteo results that may have wrong Hebrew names.
      // For hotels, use hotel name + city (first 2 parts) as before.
      const seen = new Set<string>();
      const merged: any[] = [];
      for (const r of [...curatedCities, ...cities, ...curatedHotels]) {
        const isCity = r.result_type === "city";
        const key = (r.label || "").toLowerCase().split(",").slice(0, isCity ? 1 : 2).join(",").trim();
        if (seen.has(key)) continue;
        seen.add(key);
        merged.push(r);
      }
      if (merged.length) return Response.json({ results: merged });
      return Response.json({ results: [] });
    }

    // General search (non-hotels): Open-Meteo only.
    const results = await openMeteoSearch(query, lang, filter).catch(() => []);
    return Response.json({ results });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}