// Destination autocomplete — Photon (hotels, partial-name matching) + OpenStreetMap Nominatim (other).
// Hotels tab uses Photon (komoot.io) — free, ElasticSearch-backed, returns suggestions as you type
// (partial name matching) instead of requiring the full hotel name.
const HOTEL_TYPES = ["hotel", "hostel", "motel", "guest_house", "apartment", "chalet", "resort", "apartment_hotel", "apartments"];
const AIRPORT_TYPES = ["aerodrome", "helipad", "heliport"];

function classifyOsm(osmKey, osmValue) {
  const k = (osmKey || "").toLowerCase();
  const v = (osmValue || "").toLowerCase();
  if (k === "tourism" && HOTEL_TYPES.includes(v)) return "hotel";
  if (k === "aeroway" && AIRPORT_TYPES.includes(v)) return "airport";
  if (k === "place") return "city";
  return "place";
}

function buildPhotonLabel(p) {
  const parts = [p.name, p.city, p.state, p.country].filter((x, i, arr) => x && x !== arr[i - 1]);
  return parts.join(", ");
}

async function photonSearch(query, lang, filter) {
  // Photon supports lang: en, de, fr, it, default. Hebrew unsupported → use "default" (local names).
  const photonLang = lang === "en" ? "en" : "default";
  const url = "https://photon.komoot.io/api/?q=" + encodeURIComponent(query) +
    "&lang=" + photonLang + "&limit=15";
  const res = await fetch(url, { headers: { "User-Agent": "ATLAS-Travel-Booking/1.0" } });
  const data = await res.json().catch(() => ({}));
  const seen = new Set();
  return (data.features || [])
    .map((f) => {
      const p = f.properties || {};
      const [lon, lat] = f.geometry?.coordinates || [];
      return {
        label: buildPhotonLabel(p),
        lat, lon,
        result_type: classifyOsm(p.osm_key, p.osm_value),
      };
    })
    .filter((r) => {
      if (filter === "hotels" && !["hotel", "city"].includes(r.result_type)) return false;
      const key = (r.label || "").toLowerCase().split(",")[0];
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

async function nominatimSearch(query, lang, filter) {
  const url =
    "https://nominatim.openstreetmap.org/search?format=jsonv2" +
    "&q=" + encodeURIComponent(query) +
    "&addressdetails=1&limit=10&accept-language=" + encodeURIComponent(lang);
  const res = await fetch(url, {
    headers: { "User-Agent": "ATLAS-Travel-Booking/1.0 (atlas.travel)" },
  });
  const data = await res.json().catch(() => []);
  const seen = new Set();
  return (Array.isArray(data) ? data : [])
    .map((r) => ({
      label: r.display_name,
      lat: r.lat,
      lon: r.lon,
      type: r.type,
      category: r.category,
      result_type: classifyOsm(r.category, r.type),
    }))
    .filter((r) => {
      if (filter === "hotels" && !["hotel", "city"].includes(r.result_type)) return false;
      const key = (r.label || "").toLowerCase().split(",")[0];
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export default async function(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = (body.query || "").trim();
    const lang = body.lang || "en";
    const filter = body.filter || "";
    if (query.length < 2) return Response.json({ results: [] });

    // Hotels tab: prefer Photon for partial-name matching (suggestions while typing).
    if (filter === "hotels") {
      try {
        const results = await photonSearch(query, lang, filter);
        if (results.length) return Response.json({ results });
      } catch {}
    }

    const results = await nominatimSearch(query, lang, filter);
    return Response.json({ results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}