// Destination autocomplete — Google Places (hotels) + OpenStreetMap Nominatim (other).
// Hotels tab uses Google Places Text Search for comprehensive worldwide hotel coverage
// and partial-name matching (returns suggestions as you type, not only on full names).
const HOTEL_TYPES = ["hotel", "hostel", "motel", "guest_house", "apartment", "chalet", "resort", "apartment_hotel", "apartments"];
const AIRPORT_TYPES = ["aerodrome", "helipad", "heliport"];

function classifyNominatim(r) {
  const cat = (r.category || "").toLowerCase();
  const typ = (r.type || "").toLowerCase();
  if (cat === "tourism" && HOTEL_TYPES.includes(typ)) return "hotel";
  if (cat === "aeroway" && AIRPORT_TYPES.includes(typ)) return "airport";
  if (cat === "place") return "city";
  return "place";
}

function classifyGoogle(r) {
  const types = r.types || [];
  if (types.includes("lodging")) return "hotel";
  if (types.includes("airport")) return "airport";
  if (types.some((t) => ["locality", "administrative_area_level_1", "administrative_area_level_2", "administrative_area_level_3", "country", "sublocality", "sublocality_level_1", "neighborhood", "postal_town"].includes(t))) return "city";
  return "place";
}

async function googlePlacesSearch(query, lang, filter) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;
  const url =
    "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" +
    encodeURIComponent(query) + "&language=" + encodeURIComponent(lang === "he" ? "he" : "en") +
    "&key=" + apiKey;
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  if (data.status && data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(data.error_message || data.status);
  }
  const seen = new Set();
  return (data.results || [])
    .map((r) => ({
      label: [r.name, r.formatted_address].filter(Boolean).join(", "),
      lat: r.geometry?.location?.lat,
      lon: r.geometry?.location?.lng,
      result_type: classifyGoogle(r),
    }))
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
      result_type: classifyNominatim(r),
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

    // Hotels tab: prefer Google Places for comprehensive worldwide hotel coverage + partial-name matching.
    if (filter === "hotels") {
      try {
        const gp = await googlePlacesSearch(query, lang, filter);
        if (gp !== null) return Response.json({ results: gp });
      } catch {}
    }

    const results = await nominatimSearch(query, lang, filter);
    return Response.json({ results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}