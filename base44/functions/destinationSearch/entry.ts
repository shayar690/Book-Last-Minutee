// Destination autocomplete — Open-Meteo (cities, multilingual, free, no API key)
// + curated hotel database. Fast, reliable, no API key required.
import { searchCuratedHotels } from "./curatedHotels.ts";

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
      const parts = [r.name, r.admin1, r.country].filter(Boolean);
      const key = (r.name + r.country).toLowerCase();
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
    if (filter === "hotels") {
      const curated = searchCuratedHotels(query, 12, lang);
      const cities = await openMeteoSearch(query, lang, filter).catch(() => []);

      const seen = new Set<string>();
      const merged: any[] = [];
      for (const r of [...curated, ...cities]) {
        const key = (r.label || "").toLowerCase().split(",").slice(0, 2).join(",").trim();
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